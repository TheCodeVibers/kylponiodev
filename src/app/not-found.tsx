import Link from "next/link";

export default function NotFound() {
  return (
    <div style={{
      minHeight: "100vh",
      background: "#04030a",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      position: "relative",
      overflow: "hidden",
      fontFamily: "var(--font-orbitron), monospace",
    }}>
      {/* Scanlines */}
      <div style={{
        position: "fixed",
        inset: 0,
        backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.08) 2px, rgba(0,0,0,0.08) 4px)",
        pointerEvents: "none",
        zIndex: 10,
      }} />

      {/* Background grid */}
      <div style={{
        position: "fixed",
        inset: 0,
        backgroundImage: "linear-gradient(rgba(0,255,240,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,240,0.03) 1px, transparent 1px)",
        backgroundSize: "48px 48px",
        pointerEvents: "none",
      }} />

      {/* Corner decorations */}
      {[
        { top: 24, left: 24 },
        { top: 24, right: 24 },
        { bottom: 24, left: 24 },
        { bottom: 24, right: 24 },
      ].map((pos, i) => (
        <div key={i} style={{
          position: "fixed",
          ...pos,
          width: 24,
          height: 24,
          borderTop: i < 2 ? "1px solid rgba(0,255,240,0.3)" : "none",
          borderBottom: i >= 2 ? "1px solid rgba(0,255,240,0.3)" : "none",
          borderLeft: i % 2 === 0 ? "1px solid rgba(0,255,240,0.3)" : "none",
          borderRight: i % 2 === 1 ? "1px solid rgba(0,255,240,0.3)" : "none",
        }} />
      ))}

      {/* Content */}
      <div style={{ textAlign: "center", zIndex: 1, padding: "0 24px" }}>
        {/* Error code */}
        <div style={{
          fontSize: "clamp(80px, 18vw, 160px)",
          fontWeight: 900,
          letterSpacing: "0.08em",
          color: "#00fff0",
          textShadow: "0 0 20px #00fff0, 0 0 60px #00fff040",
          lineHeight: 1,
          marginBottom: "8px",
          animation: "glitch 4s infinite",
        }}>
          404
        </div>

        {/* Tag */}
        <div style={{
          fontSize: "clamp(10px, 2vw, 13px)",
          letterSpacing: "0.35em",
          color: "#ff3df0",
          textShadow: "0 0 10px #ff3df0",
          marginBottom: "32px",
        }}>
          // SIGNAL_LOST
        </div>

        <div style={{
          width: "280px",
          height: "1px",
          background: "linear-gradient(90deg, transparent, rgba(0,255,240,0.4), transparent)",
          margin: "0 auto 28px",
        }} />

        <p style={{
          fontFamily: "var(--font-rajdhani), sans-serif",
          fontSize: "clamp(13px, 2vw, 16px)",
          color: "#8888aa",
          letterSpacing: "0.08em",
          lineHeight: 1.6,
          marginBottom: "40px",
          maxWidth: "340px",
        }}>
          Coordinates not found in the void.<br />
          The signal you&apos;re looking for drifted off-grid.
        </p>

        <Link href="/" style={{
          display: "inline-block",
          padding: "10px 28px",
          border: "1px solid #00fff0",
          color: "#00fff0",
          textDecoration: "none",
          fontSize: "11px",
          letterSpacing: "0.25em",
          textShadow: "0 0 8px #00fff0",
          boxShadow: "0 0 16px rgba(0,255,240,0.15), inset 0 0 16px rgba(0,255,240,0.05)",
          transition: "box-shadow 0.2s",
        }}>
          ← RETURN TO BASE
        </Link>
      </div>

      <style>{`
        @keyframes glitch {
          0%, 90%, 100% { transform: translate(0); filter: none; }
          91% { transform: translate(-2px, 1px); filter: hue-rotate(90deg); }
          92% { transform: translate(2px, -1px); }
          93% { transform: translate(0); filter: none; }
          95% { transform: translate(1px, 2px); filter: hue-rotate(-40deg); }
          96% { transform: translate(-1px, -1px); }
          97% { transform: translate(0); filter: none; }
        }
      `}</style>
    </div>
  );
}
