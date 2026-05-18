"use client";
import { useState, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useSceneStore } from "@/state/useSceneStore";

const socials = [
  { label: "github",   prefix: "gh/",  value: "kylponio",          href: "https://github.com/kylponio" },
  { label: "twitter",  prefix: "@",    value: "kylponio",          href: "https://twitter.com/kylponio" },
  { label: "email",    prefix: "→",    value: "kylponio@gmail.com", href: "mailto:kylponio@gmail.com" },
];

type SendState = "idle" | "sending" | "sent" | "error";

export function ContactPanel() {
  const camera = useSceneStore((s) => s.camera);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [sendState, setSendState] = useState<SendState>("idle");
  const nameRef = useRef<HTMLInputElement>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name || !email || !message) return;
    setSendState("sending");
    // Simulate async send (replace with real API call)
    setTimeout(() => {
      setSendState("sent");
      setName(""); setEmail(""); setMessage("");
    }, 1400);
  }

  return (
    <AnimatePresence>
      {camera === "CONTACT" && (
        <motion.div
          key="contact-panel"
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 40 }}
          transition={{ duration: 0.4 }}
          className="fixed top-1/2 -translate-y-1/2 right-6 z-20 w-80 pointer-events-auto"
        >
          <div style={{
            background: "rgba(4,3,10,0.72)",
            backdropFilter: "blur(12px)",
            border: "1px solid rgba(255,61,240,0.2)",
            borderRadius: "12px",
            padding: "24px",
            display: "flex",
            flexDirection: "column",
            gap: "16px",
          }}>
            <span style={{ color: "#ff3df0", fontFamily: "Orbitron, sans-serif", fontSize: "10px", letterSpacing: "0.2em" }}>
              // CONTACT.SH
            </span>

            {/* Socials */}
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ display: "flex", alignItems: "center", gap: "8px", textDecoration: "none", padding: "4px 0" }}
                >
                  <span style={{ color: "#ff3df0", fontFamily: "JetBrains Mono, monospace", fontSize: "10px", width: "20px" }}>{s.prefix}</span>
                  <span style={{ color: "#00fff0", fontFamily: "JetBrains Mono, monospace", fontSize: "10px" }}>{s.value}</span>
                </a>
              ))}
            </div>

            <div style={{ height: "1px", background: "linear-gradient(90deg, transparent, rgba(255,61,240,0.3), transparent)" }} />

            {/* Terminal form */}
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <TerminalField label="NAME" value={name} onChange={setName} placeholder="your name" />
              <TerminalField label="EMAIL" value={email} onChange={setEmail} placeholder="your@email.com" type="email" />
              <TerminalTextarea label="MSG" value={message} onChange={setMessage} placeholder="let's build something..." />

              <motion.button
                type="submit"
                disabled={sendState === "sending" || sendState === "sent"}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                style={{
                  marginTop: "4px",
                  padding: "8px 16px",
                  background: "transparent",
                  border: "1px solid #ff3df0",
                  borderRadius: "4px",
                  color: sendState === "sent" ? "#00fff0" : "#ff3df0",
                  fontFamily: "Orbitron, sans-serif",
                  fontSize: "10px",
                  fontWeight: 700,
                  letterSpacing: "0.15em",
                  cursor: sendState === "idle" ? "pointer" : "default",
                  textShadow: `0 0 8px ${sendState === "sent" ? "#00fff0" : "#ff3df0"}`,
                  transition: "color 0.3s, text-shadow 0.3s",
                }}
              >
                {sendState === "idle"    && "> SEND_MSG"}
                {sendState === "sending" && "> TRANSMITTING..."}
                {sendState === "sent"    && "> MESSAGE_SENT ✓"}
                {sendState === "error"   && "> RETRY_?"}
              </motion.button>
            </form>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function TerminalField({
  label, value, onChange, placeholder, type = "text",
}: {
  label: string; value: string;
  onChange: (v: string) => void;
  placeholder: string; type?: string;
}) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "8px", borderBottom: "1px solid rgba(255,61,240,0.15)", paddingBottom: "4px" }}>
      <span style={{ color: "#ff3df0", fontFamily: "JetBrains Mono, monospace", fontSize: "9px", minWidth: "38px", opacity: 0.8 }}>
        {label}:
      </span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        style={{
          flex: 1,
          background: "transparent",
          border: "none",
          outline: "none",
          color: "#00fff0",
          fontFamily: "JetBrains Mono, monospace",
          fontSize: "10px",
          caretColor: "#ff3df0",
        }}
      />
    </div>
  );
}

function TerminalTextarea({
  label, value, onChange, placeholder,
}: {
  label: string; value: string;
  onChange: (v: string) => void;
  placeholder: string;
}) {
  return (
    <div style={{ display: "flex", gap: "8px", borderBottom: "1px solid rgba(255,61,240,0.15)", paddingBottom: "4px" }}>
      <span style={{ color: "#ff3df0", fontFamily: "JetBrains Mono, monospace", fontSize: "9px", minWidth: "38px", opacity: 0.8, paddingTop: "2px" }}>
        {label}:
      </span>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={3}
        style={{
          flex: 1,
          background: "transparent",
          border: "none",
          outline: "none",
          resize: "none",
          color: "#00fff0",
          fontFamily: "JetBrains Mono, monospace",
          fontSize: "10px",
          caretColor: "#ff3df0",
          lineHeight: 1.6,
        }}
      />
    </div>
  );
}
