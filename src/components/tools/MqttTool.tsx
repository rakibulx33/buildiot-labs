"use client";

import { useMemo, useState } from "react";
import { Instrument } from "@/components/objects/Instrument";
import { bytes, q, sig } from "@/lib/format";
import { HANDSHAKE_PRESETS, mqttData, utf8Length, type Connection, type Qos, type TlsVersion } from "@/lib/calc/mqtt";
import { Keys, NumberField, Readout, SelectField } from "./controls";

const SAMPLE = '{"t":24.6,"h":61,"bat":3.91}';

const SEGMENTS = [
  { key: "payload", label: "Your payload", color: "#f2c94c" },
  { key: "mqtt", label: "MQTT headers and acks", color: "#e9e5dd" },
  { key: "tls", label: "TLS records", color: "#5cc6e0" },
  { key: "tcpip", label: "TCP/IP headers", color: "#9aa6ab" },
  { key: "session", label: "Connecting and keep-alive", color: "#c9a24d" },
] as const;

export function MqttTool() {
  const [topic, setTopic] = useState("site/dhaka/node-01/telemetry");
  const [sample, setSample] = useState(SAMPLE);
  const [qos, setQos] = useState<Qos>(1);
  const [version, setVersion] = useState<"3.1.1" | "5">("3.1.1");
  const [tls, setTls] = useState<"on" | "off">("on");
  const [tlsVersion, setTlsVersion] = useState<TlsVersion>("1.3");
  const [connection, setConnection] = useState<Connection>("persistent");
  const [handshake, setHandshake] = useState<string>("ecdsa");
  const [keepAlive, setKeepAlive] = useState(120);
  const [interval, setIntervalS] = useState(300);
  const [devices, setDevices] = useState(50);

  const payloadBytes = utf8Length(sample);
  const handshakeBytes = HANDSHAKE_PRESETS.find((h) => h.id === handshake)?.bytes ?? 3000;

  const r = useMemo(
    () =>
      mqttData({
        topic,
        payloadBytes,
        qos,
        mqttVersion: version,
        tls: tls === "on",
        tlsVersion,
        intervalSeconds: interval,
        connection,
        keepAliveSeconds: keepAlive,
        handshakeBytes,
        clientIdBytes: 12,
        devices,
      }),
    [topic, payloadBytes, qos, version, tls, tlsVersion, interval, connection, keepAlive, handshakeBytes, devices],
  );

  const perMsg = bytes(r.perMessageTotal);
  const month = bytes(r.per30DaysBytes);
  const fleet = bytes(r.fleet30DaysBytes);

  return (
    <Instrument legend="MQTT data budget">
      <div className="tool-grid">
        <div className="grid content-start gap-5">
          <div className="field">
            <label htmlFor="mqtt-topic" className="field-label">
              Topic
            </label>
            <div className="field-box">
              <input id="mqtt-topic" className="field-input font-mono text-sm" value={topic} onChange={(e) => setTopic(e.target.value)} />
            </div>
          </div>
          <div className="field">
            <label htmlFor="mqtt-payload" className="field-label">
              Example payload
            </label>
            <div className="field-box items-stretch">
              <textarea
                id="mqtt-payload"
                rows={3}
                className="field-input h-auto resize-y py-2.5 font-mono text-sm"
                value={sample}
                onChange={(e) => setSample(e.target.value)}
              />
            </div>
            <p className="field-hint">{payloadBytes} bytes as UTF-8. Paste a real message for a real answer.</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <NumberField label="Send every" unit="s" min={1} value={interval} onChange={setIntervalS} />
            <NumberField label="Devices" min={1} value={devices} onChange={setDevices} />
          </div>
          <Keys<Qos>
            legend="Quality of service"
            value={qos}
            onChange={setQos}
            options={[
              { value: 0, label: "QoS 0" },
              { value: 1, label: "QoS 1" },
              { value: 2, label: "QoS 2" },
            ]}
          />
          <Keys<Connection>
            legend="Connection"
            value={connection}
            onChange={setConnection}
            options={[
              { value: "persistent", label: "Stay connected" },
              { value: "per-message", label: "Reconnect each time" },
            ]}
          />
          <div className="grid grid-cols-2 gap-4">
            <SelectField
              label="TLS"
              value={tls === "on" ? `on-${tlsVersion}` : "off"}
              options={[
                { value: "on-1.3", label: "TLS 1.3" },
                { value: "on-1.2", label: "TLS 1.2" },
                { value: "off", label: "No TLS" },
              ]}
              onChange={(v) => {
                if (v === "off") setTls("off");
                else {
                  setTls("on");
                  setTlsVersion(v.slice(3) as TlsVersion);
                }
              }}
            />
            <SelectField
              label="MQTT version"
              value={version}
              options={[
                { value: "3.1.1", label: "3.1.1" },
                { value: "5", label: "5.0" },
              ]}
              onChange={setVersion}
            />
          </div>
          {connection === "per-message" && tls === "on" ? (
            <SelectField
              label="TLS handshake"
              value={handshake}
              options={HANDSHAKE_PRESETS.map((h) => ({ value: h.id, label: `${h.label}, about ${sig(h.bytes / 1000, 2)} KB` }))}
              onChange={setHandshake}
            />
          ) : null}
          {connection === "persistent" ? (
            <NumberField
              label="Keep-alive"
              unit="s"
              min={0}
              value={keepAlive}
              onChange={setKeepAlive}
              hint="A ping is sent only when nothing else went out within this time."
            />
          ) : null}
        </div>

        <div className="grid content-start gap-4">
          <dl className="readouts" aria-live="polite">
            <Readout label="Per message" value={perMsg.value} unit={perMsg.unit} />
            <Readout label="Payload share" value={String(Math.round(r.payloadShare * 100))} unit="%" />
            <Readout label="Per device, 30 days" value={month.value} unit={month.unit} />
            <Readout label={`Fleet of ${devices}, 30 days`} value={fleet.value} unit={fleet.unit} />
          </dl>

          <figure className="screen p-4">
            <p className="text-xs text-panel-muted">Where the bytes of one message go</p>
            <div className="mt-3 flex h-9 overflow-hidden rounded-[4px] bg-[#1b2226]" role="img" aria-label={SEGMENTS.map((s) => `${s.label} ${Math.round(r.perMessage[s.key])} bytes`).join(", ")}>
              {SEGMENTS.map((s) => {
                const v = r.perMessage[s.key];
                if (v <= 0) return null;
                return (
                  <span
                    key={s.key}
                    className="h-full transition-[flex-grow] duration-500 ease-out"
                    style={{ flexGrow: v, flexBasis: 0, background: s.color, minWidth: 3 }}
                  />
                );
              })}
            </div>
            <ul className="mt-4 grid gap-2 text-sm sm:grid-cols-2">
              {SEGMENTS.map((s) => (
                <li key={s.key} className="flex items-center justify-between gap-3">
                  <span className="flex items-center gap-2 text-panel-muted">
                    <span className="h-2.5 w-2.5 flex-none rounded-[2px]" style={{ background: s.color }} aria-hidden="true" />
                    {s.label}
                  </span>
                  <span className="tabular-nums text-panel-text">{Math.round(r.perMessage[s.key])} B</span>
                </li>
              ))}
            </ul>
          </figure>

          <p className="text-xs leading-relaxed text-panel-muted">
            {sig(r.messagesPerDay, 3)} messages a day per device, {q(bytes(r.perDayBytes))} a day. Counted the way a
            mobile data plan counts: every IP byte, both directions.
          </p>
        </div>
      </div>
    </Instrument>
  );
}
