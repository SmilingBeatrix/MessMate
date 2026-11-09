import { useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { useTodayMenuQuery, useGenerateQrMutation } from "../../app/api.js";
import { toast } from "sonner";
import { QrCode, ShieldCheck } from "lucide-react";

const glassCard = {
  background:
    "linear-gradient(145deg, rgba(30, 41, 59, 0.4) 0%, rgba(15, 23, 42, 0.6) 100%)",
  backdropFilter: "blur(16px)",
  WebkitBackdropFilter: "blur(16px)",
  border: "1px solid rgba(255, 255, 255, 0.08)",
  borderRadius: "16px",
  boxShadow:
    "0 10px 40px -10px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.05)",
  padding: 24,
};

export default function QrPassPage() {
  const { data } = useTodayMenuQuery();
  const [generate] = useGenerateQrMutation();
  const [qrData, setQrData] = useState(null);
  const [selected, setSelected] = useState(null);

  const sessions = (data?.data?.sessions || []).filter(
    (s) => s.myRegistration?.status === "registered",
  );

  const doGenerate = async (sessionId) => {
    setSelected(sessionId);
    try {
      const res = await generate({ sessionId }).unwrap();
      setQrData(res.data.qrPass);
      toast.success("QR pass generated");
    } catch (err) {
      toast.error(err?.data?.message || "Failed");
      setQrData(null);
    }
  };

  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: "32px 24px" }}>
      <header style={{ marginBottom: 32 }}>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            fontSize: 11,
            fontWeight: 800,
            color: "#34d399",
            letterSpacing: "0.1em",
            marginBottom: 8,
            background: "rgba(16, 185, 129, 0.15)",
            padding: "5px 14px",
            borderRadius: "20px",
            border: "1px solid rgba(16, 185, 129, 0.3)",
          }}
        >
          <QrCode size={14} /> GATE PASS
        </div>
        <h1
          style={{
            margin: 0,
            fontSize: "2rem",
            fontWeight: 800,
            letterSpacing: "-0.03em",
          }}
        >
          My QR Meal Pass
        </h1>
        <p style={{ margin: "8px 0 0", fontSize: 14, color: "#94a3b8" }}>
          Show this at the mess counter. Valid for 10 minutes.
        </p>
      </header>

      {sessions.length === 0 ? (
        <div style={{ ...glassCard, padding: 60, textAlign: "center" }}>
          <QrCode size={48} color="#334155" style={{ margin: "0 auto 16px" }} />
          <p style={{ color: "#94a3b8", fontSize: 15 }}>
            Register for a meal first on the Menu page.
          </p>
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: 20,
          }}
        >
          {sessions.map((s) => (
            <div
              key={s._id}
              style={{
                ...glassCard,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                borderTop: "4px solid #10b981",
              }}
            >
              <div>
                <h3
                  style={{
                    textTransform: "capitalize",
                    margin: "0 0 8px",
                    fontSize: 20,
                    fontWeight: 800,
                    color: "#f8fafc",
                  }}
                >
                  {s.category}
                </h3>
                <p style={{ margin: 0, fontSize: 13, color: "#94a3b8" }}>
                  {s.startTime} - {s.endTime}
                </p>
              </div>
              <button
                onClick={() => doGenerate(s._id)}
                style={{
                  marginTop: 24,
                  padding: 12,
                  borderRadius: 8,
                  background: "linear-gradient(135deg, #10b981, #059669)",
                  color: "#022c22",
                  fontWeight: 800,
                  fontSize: 14,
                  border: "none",
                  cursor: "pointer",
                  boxShadow: "0 4px 15px rgba(16, 185, 129, 0.3)",
                }}
              >
                Generate QR
              </button>
            </div>
          ))}
        </div>
      )}

      {qrData && selected && (
        <div
          style={{
            ...glassCard,
            marginTop: 32,
            textAlign: "center",
            border: "1px solid rgba(16, 185, 129, 0.4)",
            boxShadow: "0 0 40px rgba(16, 185, 129, 0.1)",
          }}
        >
          <ShieldCheck
            size={32}
            color="#10b981"
            style={{ margin: "0 auto 12px" }}
          />
          <h2 style={{ margin: "0 0 8px", fontSize: 22, fontWeight: 800 }}>
            Show this to mess staff
          </h2>
          <p
            style={{
              margin: "0 0 24px",
              fontSize: 14,
              color: "#fbbf24",
              fontWeight: 600,
            }}
          >
            Expires in {qrData.expiresInMinutes} minutes
          </p>

          <div
            style={{
              display: "inline-block",
              padding: 16,
              background: "#fff",
              borderRadius: 16,
              boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
            }}
          >
            <QRCodeSVG value={qrData.token} size={240} level="M" />
          </div>
        </div>
      )}
    </div>
  );
}
