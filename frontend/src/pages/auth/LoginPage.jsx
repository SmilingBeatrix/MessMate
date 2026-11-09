import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useLoginMutation } from "../../app/api.js";
import { toast } from "sonner";
import {
  ArrowRight,
  Lock,
  AlertCircle,
  Users,
  ShieldCheck,
  ChefHat,
  GraduationCap,
  Sparkles,
  KeyRound,
} from "lucide-react";

const ACCESS_NODES = [
  {
    icon: GraduationCap,
    title: "Hostel Student",
    desc: "Self-registered & admin verified",
    color: "#10b981",
  },
  {
    icon: ShieldCheck,
    title: "Mess Committee",
    desc: "Provisioned admin credentials",
    color: "#6366f1",
  },
  {
    icon: Users,
    title: "Chief Warden",
    desc: "Executive telemetry credentials",
    color: "#ec4899",
  },
  {
    icon: ChefHat,
    title: "Kitchen Staff",
    desc: "Counter scanner & inventory node",
    color: "#f59e0b",
  },
];

export default function LoginPage() {
  const navigate = useNavigate();
  const [login, { isLoading }] = useLoginMutation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await login({ email, password }).unwrap();
      toast.success("Authenticated — Welcome to MessMatrix");
      navigate("/dashboard", { replace: true });
    } catch (err) {
      const msg =
        err?.data?.message ||
        "Authentication failed. Please verify your credentials.";
      setError(msg);
      toast.error(msg);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))",
        background: "#04070d", // Darker, richer background
        color: "#f8fafc",
        fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
        colorScheme: "dark", // Forces browser inputs to render in dark mode
      }}
    >
      {/* Interactive Focus/Hover Styles injected safely */}
      <style>
        {`
          .matrix-input:focus {
            border-color: rgba(16, 185, 129, 0.6) !important;
            box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.15) !important;
            background: rgba(9, 13, 22, 1) !important;
          }
          .matrix-btn:hover:not(:disabled) {
            transform: translateY(-2px);
            box-shadow: 0 12px 25px rgba(16, 185, 129, 0.4) !important;
          }
          .matrix-btn:active:not(:disabled) {
            transform: translateY(0);
          }
          .role-card:hover {
            background: rgba(16, 185, 129, 0.08) !important;
            border-color: rgba(16, 185, 129, 0.3) !important;
          }
        `}
      </style>

      {/* Left Telemetry & Security Panel */}
      <div
        style={{
          padding: "48px 8%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background:
            "radial-gradient(circle at 0% 0%, rgba(16, 185, 129, 0.15) 0px, transparent 50%), linear-gradient(180deg, #090d16 0%, #04070d 100%)",
          borderRight: "1px solid rgba(255, 255, 255, 0.05)",
        }}
      >
        <Link
          to="/"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 12,
            textDecoration: "none",
            color: "#fff",
            width: "fit-content",
          }}
        >
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 12,
              background: "linear-gradient(135deg, #10b981, #059669)",
              display: "grid",
              placeItems: "center",
              fontWeight: 800,
              color: "#022c22",
              fontSize: 18,
              boxShadow: "0 4px 12px rgba(16, 185, 129, 0.3)",
            }}
          >
            M²
          </div>
          <div>
            <span
              style={{
                fontWeight: 800,
                fontSize: 22,
                letterSpacing: "-0.03em",
              }}
            >
              MESS<span style={{ color: "#10b981" }}>MATRIX</span>
            </span>
            <span
              style={{
                display: "block",
                fontSize: 10,
                color: "#94a3b8",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                fontWeight: 600,
              }}
            >
              IIIT Bhubaneswar Dining OS
            </span>
          </div>
        </Link>

        <div style={{ margin: "auto 0", padding: "40px 0" }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              padding: "6px 14px",
              borderRadius: 999,
              background: "rgba(16, 185, 129, 0.1)",
              border: "1px solid rgba(16, 185, 129, 0.25)",
              color: "#34d399",
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: "0.08em",
              marginBottom: 24,
            }}
          >
            <Sparkles size={14} /> ZERO-TRUST ACCESS GATEWAY
          </div>

          <h2
            style={{
              fontSize: "clamp(2.2rem, 3.5vw, 3rem)",
              fontWeight: 800,
              lineHeight: 1.1,
              marginBottom: 20,
              letterSpacing: "-0.02em",
            }}
          >
            Precision dining.
            <br />
            <span style={{ color: "#10b981" }}>Unified campus ledger.</span>
          </h2>

          <p
            style={{
              color: "#94a3b8",
              fontSize: 16,
              lineHeight: 1.6,
              maxWidth: 480,
              marginBottom: 32,
            }}
          >
            Authenticate with your institutional node to lock in daily meal
            slots, generate cryptographic QR gate passes, and inspect real-time
            billing telemetry.
          </p>

          <div style={{ display: "grid", gap: 16 }}>
            {[
              "Server-enforced RBAC across 4 institutional roles",
              "HttpOnly encrypted session cookies",
              "Automated proactive JWT refresh rotation",
            ].map((point) => (
              <div
                key={point}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  fontSize: 14,
                  color: "#cbd5e1",
                  fontWeight: 500,
                }}
              >
                <div
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: 8,
                    background: "rgba(16, 185, 129, 0.1)",
                    display: "grid",
                    placeItems: "center",
                    color: "#10b981",
                    border: "1px solid rgba(16, 185, 129, 0.2)",
                  }}
                >
                  <Lock size={14} />
                </div>
                {point}
              </div>
            ))}
          </div>
        </div>

        <div
          style={{
            fontSize: 12,
            color: "#475569",
            fontFamily: "monospace",
            letterSpacing: "0.05em",
          }}
        >
          MESSMATRIX CORE • IIIT BHUBANESWAR • 2026
        </div>
      </div>

      {/* Right Authentication Form Panel */}
      <div
        style={{
          display: "grid",
          placeItems: "center",
          padding: "40px 6%",
          background:
            "radial-gradient(circle at 100% 100%, rgba(16, 185, 129, 0.05) 0px, transparent 50%)",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: 460,
            background: "rgba(15, 23, 42, 0.6)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            borderRadius: 24,
            padding: 36,
            boxShadow:
              "0 25px 60px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255,255,255,0.05)",
          }}
        >
          <div style={{ marginBottom: 28 }}>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                color: "#10b981",
                fontSize: 12,
                fontWeight: 800,
                marginBottom: 8,
                letterSpacing: "0.05em",
              }}
            >
              <KeyRound size={15} /> SESSION INITIALIZATION
            </div>
            <h1
              style={{
                fontSize: 28,
                fontWeight: 800,
                margin: "0 0 8px",
                letterSpacing: "-0.02em",
              }}
            >
              Sign in to MessMatrix
            </h1>
            <p style={{ color: "#94a3b8", fontSize: 14, margin: 0 }}>
              Enter your registered IIIT Bhubaneswar credentials
            </p>
          </div>

          {error && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "14px 16px",
                borderRadius: 12,
                background: "rgba(239, 68, 68, 0.1)",
                border: "1px solid rgba(239, 68, 68, 0.3)",
                color: "#fca5a5",
                fontSize: 13,
                marginBottom: 24,
                fontWeight: 500,
              }}
            >
              <AlertCircle
                size={18}
                color="#ef4444"
                style={{ flexShrink: 0 }}
              />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={submit} style={{ display: "grid", gap: 20 }}>
            <label style={{ display: "grid", gap: 8 }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: "#cbd5e1" }}>
                Institutional Email
              </span>
              <input
                type="email"
                className="matrix-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@iiit-bh.ac.in"
                required
                disabled={isLoading}
                autoComplete="email"
                style={{
                  width: "100%",
                  padding: "13px 16px",
                  borderRadius: 10,
                  background: "rgba(9, 13, 22, 0.7)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  color: "#f8fafc",
                  fontSize: 15,
                  outline: "none",
                  transition: "all 0.2s ease",
                }}
              />
            </label>

            <label style={{ display: "grid", gap: 8 }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: "#cbd5e1" }}>
                Security Password
              </span>
              <input
                type="password"
                className="matrix-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                required
                disabled={isLoading}
                autoComplete="current-password"
                style={{
                  width: "100%",
                  padding: "13px 16px",
                  borderRadius: 10,
                  background: "rgba(9, 13, 22, 0.7)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  color: "#f8fafc",
                  fontSize: 15,
                  outline: "none",
                  transition: "all 0.2s ease",
                }}
              />
            </label>

            <button
              type="submit"
              className="matrix-btn"
              disabled={isLoading}
              style={{
                marginTop: 8,
                width: "100%",
                padding: "14px 18px",
                borderRadius: 10,
                background: "linear-gradient(135deg, #10b981, #059669)",
                color: "#022c22",
                fontWeight: 800,
                fontSize: 15,
                border: "none",
                cursor: isLoading ? "not-allowed" : "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 10,
                boxShadow: "0 8px 20px rgba(16, 185, 129, 0.2)",
                transition: "all 0.2s ease",
              }}
            >
              {isLoading ? (
                "Authenticating Node..."
              ) : (
                <>
                  Launch Portal <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          {/* Role Reference Matrix */}
          <div
            style={{
              marginTop: 32,
              paddingTop: 24,
              borderTop: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            <div
              style={{
                fontSize: 11,
                fontWeight: 800,
                color: "#64748b",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                marginBottom: 16,
              }}
            >
              Supported Role Nodes
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 12,
              }}
            >
              {ACCESS_NODES.map(({ icon: Icon, title, desc, color }) => (
                <div
                  key={title}
                  className="role-card"
                  style={{
                    background: "rgba(9, 13, 22, 0.4)",
                    border: "1px solid rgba(255,255,255,0.05)",
                    borderRadius: 12,
                    padding: 12,
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 10,
                    transition: "all 0.2s ease",
                  }}
                >
                  <Icon
                    size={18}
                    color={color}
                    style={{ marginTop: 2, flexShrink: 0 }}
                  />
                  <div>
                    <strong
                      style={{
                        display: "block",
                        fontSize: 12.5,
                        color: "#e2e8f0",
                        marginBottom: 2,
                      }}
                    >
                      {title}
                    </strong>
                    <span
                      style={{
                        fontSize: 11,
                        color: "#64748b",
                        lineHeight: 1.3,
                      }}
                    >
                      {desc}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <p
              style={{
                marginTop: 24,
                marginBottom: 0,
                fontSize: 13,
                color: "#94a3b8",
                textAlign: "center",
              }}
            >
              Unregistered resident?{" "}
              <Link
                to="/register"
                style={{
                  color: "#10b981",
                  fontWeight: 700,
                  textDecoration: "none",
                }}
              >
                Request Student Node
              </Link>{" "}
              (requires admin verification).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
