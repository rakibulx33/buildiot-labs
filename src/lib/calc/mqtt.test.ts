import { describe, expect, it } from "vitest";
import { mqttData, publishPacketBytes, remainingLengthBytes } from "./mqtt";

describe("mqtt packet sizes", () => {
  it("encodes remaining length like the spec", () => {
    expect(remainingLengthBytes(0)).toBe(1);
    expect(remainingLengthBytes(127)).toBe(1);
    expect(remainingLengthBytes(128)).toBe(2);
    expect(remainingLengthBytes(16_383)).toBe(2);
    expect(remainingLengthBytes(16_384)).toBe(3);
  });

  it("sizes a QoS 0 publish", () => {
    // fixed header 1 + RL 1 + topic len 2 + topic 10 + payload 20 = 34
    expect(publishPacketBytes(10, 20, 0, "3.1.1")).toBe(34);
  });

  it("adds a packet id for QoS 1 and a property length for MQTT 5", () => {
    expect(publishPacketBytes(10, 20, 1, "3.1.1")).toBe(36);
    expect(publishPacketBytes(10, 20, 1, "5")).toBe(37);
  });
});

describe("mqtt data budget", () => {
  const base = {
    topic: "site/a/node-01/telemetry",
    payloadBytes: 48,
    qos: 1 as const,
    mqttVersion: "3.1.1" as const,
    tls: true,
    tlsVersion: "1.3" as const,
    intervalSeconds: 300,
    connection: "persistent" as const,
    keepAliveSeconds: 120,
    handshakeBytes: 3000,
    clientIdBytes: 12,
    devices: 10,
  };

  it("reports per-message and monthly totals", () => {
    const r = mqttData(base);
    expect(r.messagesPerDay).toBeCloseTo(288);
    expect(r.perMessageTotal).toBeGreaterThan(base.payloadBytes);
    expect(r.per30DaysBytes).toBeCloseTo(r.perDayBytes * 30);
    expect(r.fleet30DaysBytes).toBeCloseTo(r.per30DaysBytes * 10);
  });

  it("charges keep-alive pings when messages are rarer than the keep-alive", () => {
    const withPings = mqttData(base);
    const noPings = mqttData({ ...base, intervalSeconds: 60 });
    expect(withPings.perMessage.session).toBeGreaterThan(0);
    expect(noPings.perMessage.session).toBe(0);
  });

  it("makes reconnecting per message far more expensive", () => {
    const persistent = mqttData(base);
    const reconnect = mqttData({ ...base, connection: "per-message" });
    expect(reconnect.perMessageTotal).toBeGreaterThan(persistent.perMessageTotal + 3000);
  });
});
