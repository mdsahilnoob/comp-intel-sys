import { ImageResponse } from "next/og"

export const alt = "CompGrid — Compensation Intelligence"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export default function OpenGraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        position: "relative",
        overflow: "hidden",
        padding: "58px 70px",
        color: "#f8f5ed",
        background: "#0b2524",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0.13,
          backgroundImage:
            "linear-gradient(rgba(202, 241, 228, .55) 1px, transparent 1px), linear-gradient(90deg, rgba(202, 241, 228, .55) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />
      <div
        style={{
          position: "absolute",
          width: 520,
          height: 520,
          right: -120,
          top: -180,
          borderRadius: 999,
          background: "#3ebf9b",
          opacity: 0.13,
          filter: "blur(80px)",
        }}
      />
      <div
        style={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          width: "62%",
        }}
      >
        <div style={{ display: "flex", alignItems: "center" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 42,
              height: 42,
              border: "1px solid #8bd6c0",
              color: "#8bd6c0",
              fontSize: 17,
              fontWeight: 700,
              letterSpacing: "-1px",
            }}
          >
            CG
          </div>
          <span
            style={{
              marginLeft: 14,
              fontSize: 19,
              fontWeight: 700,
              letterSpacing: "3px",
            }}
          >
            COMPGRID
          </span>
          <span
            style={{
              marginLeft: 24,
              color: "#8bd6c0",
              fontSize: 12,
              letterSpacing: "2px",
            }}
          >
            COMPENSATION INTELLIGENCE
          </span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", marginTop: 84 }}>
          <span
            style={{
              color: "#8bd6c0",
              fontSize: 19,
              letterSpacing: "4px",
              fontWeight: 700,
            }}
          >
            COMPARE THE SIGNAL
          </span>
          <span
            style={{
              marginTop: 20,
              fontSize: 64,
              lineHeight: 1.04,
              fontWeight: 700,
              letterSpacing: "-3px",
            }}
          >
            Compensation,
            <br />
            decoded by level.
          </span>
          <span
            style={{
              marginTop: 28,
              color: "#b7ccc4",
              fontSize: 23,
              lineHeight: 1.35,
            }}
          >
            Compare companies, levels, roles, and total compensation.
          </span>
        </div>
      </div>
      <div
        style={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          width: 340,
          marginLeft: "auto",
          alignSelf: "center",
          padding: 26,
          border: "1px solid rgba(193, 235, 220, .35)",
          background: "rgba(10, 33, 32, .82)",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", color: "#8ea9a1", fontSize: 12, letterSpacing: "2px" }}>
          <span>ILLUSTRATIVE VIEW</span>
          <span>GOOGLE / L4</span>
        </div>
        <span style={{ marginTop: 34, color: "#91d9c2", fontSize: 14, letterSpacing: "2px" }}>
          TOTAL COMPENSATION
        </span>
        <span style={{ marginTop: 4, fontSize: 55, fontWeight: 700, letterSpacing: "-2px" }}>
          ₹73L
        </span>
        <div style={{ display: "flex", height: 14, marginTop: 28 }}>
          <div style={{ width: "63%", background: "#8bd6c0" }} />
          <div style={{ width: "27%", background: "#d7a56d" }} />
          <div style={{ width: "10%", background: "#d77d78" }} />
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 18, color: "#b7ccc4", fontSize: 13 }}>
          <span>BASE 63%</span>
          <span>STOCK 27%</span>
          <span>BONUS 10%</span>
        </div>
        <div style={{ display: "flex", marginTop: 34, paddingTop: 18, borderTop: "1px solid rgba(193, 235, 220, .2)" }}>
          <div style={{ display: "flex", flexDirection: "column", width: "50%" }}>
            <span style={{ color: "#8ea9a1", fontSize: 11, letterSpacing: "1px" }}>NORMALIZED LEVEL</span>
            <span style={{ marginTop: 7, fontSize: 22, fontWeight: 700 }}>L4 → MID</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", width: "50%" }}>
            <span style={{ color: "#8ea9a1", fontSize: 11, letterSpacing: "1px" }}>PERCENTILE</span>
            <span style={{ marginTop: 7, color: "#8bd6c0", fontSize: 22, fontWeight: 700 }}>P62</span>
          </div>
        </div>
      </div>
    </div>,
    size,
  )
}
