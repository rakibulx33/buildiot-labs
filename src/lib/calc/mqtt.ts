/**
 * Estimate the data an MQTT device uses, counted the way a mobile data
 * plan counts it: every IP byte in both directions.
 *
 * Packet sizes follow the MQTT 3.1.1 / 5.0 wire format. TCP/IP and TLS
 * overheads are typical values, and TLS handshake sizes depend mostly on
 * the server's certificate chain, so they are inputs with presets.
 */

export const IP_TCP_HEADER = 52; // IPv4 20 + TCP 20 + timestamp option 12
export const TLS_RECORD = { "1.2": 29, "1.3": 22 } as const; // header + nonce/type + AEAD tag

export type TlsVersion = keyof typeof TLS_RECORD;
export type Qos = 0 | 1 | 2;
export type Connection = "persistent" | "per-message";

export const HANDSHAKE_PRESETS = [
  { id: "rsa", label: "Full handshake, RSA certificate chain", bytes: 5200 },
  { id: "ecdsa", label: "Full handshake, ECDSA certificate chain", bytes: 3000 },
  { id: "resumed", label: "Resumed TLS session", bytes: 650 },
] as const;

export type MqttInput = {
  topic: string;
  payloadBytes: number;
  qos: Qos;
  mqttVersion: "3.1.1" | "5";
  tls: boolean;
  tlsVersion: TlsVersion;
  intervalSeconds: number;
  connection: Connection;
  keepAliveSeconds: number;
  handshakeBytes: number; // TLS handshake bytes, both directions
  clientIdBytes: number;
  devices: number;
};

/** Bytes used by MQTT's variable-length "remaining length" field. */
export function remainingLengthBytes(n: number): number {
  if (n < 128) return 1;
  if (n < 16_384) return 2;
  if (n < 2_097_152) return 3;
  return 4;
}

/** Size of an MQTT PUBLISH packet in bytes. */
export function publishPacketBytes(topicBytes: number, payloadBytes: number, qos: Qos, version: "3.1.1" | "5"): number {
  const variableHeader = 2 + topicBytes + (qos > 0 ? 2 : 0) + (version === "5" ? 1 : 0);
  const remaining = variableHeader + payloadBytes;
  return 1 + remainingLengthBytes(remaining) + remaining;
}

export function utf8Length(s: string): number {
  return new TextEncoder().encode(s).length;
}

export type Breakdown = {
  payload: number;
  mqtt: number;
  tls: number;
  tcpip: number;
  session: number; // connection setup/teardown and keep-alive
};

export type MqttResult = {
  publishPacket: number;
  perMessage: Breakdown;
  perMessageTotal: number;
  messagesPerDay: number;
  perDayBytes: number;
  per30DaysBytes: number;
  fleet30DaysBytes: number;
  payloadShare: number;
};

export function mqttData(input: MqttInput): MqttResult {
  const topicBytes = utf8Length(input.topic);
  const publish = publishPacketBytes(topicBytes, input.payloadBytes, input.qos, input.mqttVersion);
  const b: Breakdown = { payload: input.payloadBytes, mqtt: publish - input.payloadBytes, tls: 0, tcpip: 0, session: 0 };

  // The PUBLISH segment in its own TLS record, and the TCP ACK coming back.
  b.tls += input.tls ? TLS_RECORD[input.tlsVersion] : 0;
  b.tcpip += 2 * IP_TCP_HEADER;

  // Acknowledgements for QoS 1 (PUBACK) and QoS 2 (PUBREC, PUBREL, PUBCOMP).
  const acks = input.qos === 1 ? 1 : input.qos === 2 ? 3 : 0;
  for (let i = 0; i < acks; i++) {
    b.mqtt += 4;
    b.tls += input.tls ? TLS_RECORD[input.tlsVersion] : 0;
    b.tcpip += IP_TCP_HEADER;
  }

  if (input.connection === "per-message") {
    // TCP open (SYN, SYN-ACK, ACK) and close (FIN, ACK, FIN, ACK).
    b.session += 3 * 60 + 4 * IP_TCP_HEADER;
    if (input.tls) b.session += input.handshakeBytes;
    // MQTT CONNECT (~12 bytes + client id), CONNACK (4), DISCONNECT (2), each in its own segment.
    const connect = 12 + 2 + input.clientIdBytes + (input.mqttVersion === "5" ? 1 : 0);
    b.session += connect + 4 + 2;
    b.session += 3 * IP_TCP_HEADER + (input.tls ? 3 * TLS_RECORD[input.tlsVersion] : 0);
  } else {
    // Keep-alive: PINGREQ/PINGRESP only when nothing else was sent within the keep-alive window.
    const interval = Math.max(input.intervalSeconds, 1);
    if (input.keepAliveSeconds > 0 && interval > input.keepAliveSeconds) {
      const pingsPerMessage = Math.floor(interval / input.keepAliveSeconds);
      const pingPair = 2 * (2 + IP_TCP_HEADER + (input.tls ? TLS_RECORD[input.tlsVersion] : 0));
      b.session += pingsPerMessage * pingPair;
    }
  }

  const perMessageTotal = b.payload + b.mqtt + b.tls + b.tcpip + b.session;
  const messagesPerDay = 86_400 / Math.max(input.intervalSeconds, 1);
  const perDayBytes = perMessageTotal * messagesPerDay;
  const per30DaysBytes = perDayBytes * 30;
  return {
    publishPacket: publish,
    perMessage: b,
    perMessageTotal,
    messagesPerDay,
    perDayBytes,
    per30DaysBytes,
    fleet30DaysBytes: per30DaysBytes * Math.max(input.devices, 1),
    payloadShare: perMessageTotal > 0 ? b.payload / perMessageTotal : 0,
  };
}
