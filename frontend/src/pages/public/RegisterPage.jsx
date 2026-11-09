import { useState } from "react";
import { Link } from "react-router-dom";
import { useRegisterMutation } from "../../app/api.js";
import { toast } from "sonner";
import {
  ArrowRight,
  Check,
  AlertCircle,
  UserPlus,
  Sparkles,
} from "lucide-react";

const INPUT_STYLE = {
  width: "100%",
  padding: "10px 13px",
  borderRadius: 10,
  background: "#090d16",
  border: "1px solid rgba(255,255,255,0.12)",
  color: "#f8fafc",
  fontSize: 14,
  outline: "none",
};

export default function RegisterPage() {
  const [register, { isLoading }] = useRegisterMutation();
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    studentId: "",
    phone: "",
    semester: 1,
  });

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await register(form).unwrap();
      setDone(true);
    } catch (err) {
      const msg = err?.data?.message || "Enrollment request failed";
      setError(msg);
      toast.error(msg);
    }
  };

  if (done) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "grid",
          placeItems: "center",
          background: "#070b12",
          color: "#f8fafc",
          padding: 24,
          fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
        }}
      >
        <div
          style={{
            maxWidth: 440,
            width: "100%",
            background: "rgba(17, 24, 39, 0.85)",
            border: "1px solid rgba(16, 185, 129, 0.3)",
            borderRadius: 20,
            padding: 36,
            textAlign: "center",
            boxShadow: "0 25px 50px rgba(0,0,0,0.6)",
          }}
        >
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 16,
              background: "rgba(16, 185, 129, 0.15)",
              border: "1px solid rgba(16, 185, 129, 0.4)",
              color: "#10b981",
              display: "grid",
              placeItems: "center",
              margin: "0 auto 18px",
            }}
          >
            <Check size={28} />
          </div>
          <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 10 }}>
            Enrollment Queued
          </h1>
          <p
            style={{
              color: "#94a3b8",
              fontSize: 14,
              lineHeight: 1.6,
              marginBottom: 24,
            }}
          >
            Your MessMatrix student profile has been transmitted to the Mess
            Administration. Once verified, you can sign in and select your
            dining tier.
          </p>
          <Link
            to="/login"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "11px 22px",
              borderRadius: 10,
              background: "linear-gradient(135deg, #10b981, #059669)",
              color: "#022c22",
              fontWeight: 800,
              fontSize: 14,
              textDecoration: "none",
            }}
          >
            Return to Portal Login <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))",
        background: "#070b12",
        color: "#f8fafc",
        fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
      }}
    >
      {/* Left Onboarding Context */}
      <div
        style={{
          padding: "48px 8%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background:
            "radial-gradient(at 0% 100%, rgba(16, 185, 129, 0.14) 0px, transparent 55%), linear-gradient(180deg, #090d16 0%, #05080e 100%)",
          borderRight: "1px solid rgba(255, 255, 255, 0.08)",
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
          }}
        >
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 10,
              background: "linear-gradient(135deg, #10b981, #059669)",
              display: "grid",
              placeItems: "center",
              fontWeight: 800,
              color: "#022c22",
              fontSize: 16,
            }}
          >
            M²
          </div>
          <div>
            <span
              style={{
                fontWeight: 800,
                fontSize: 20,
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
              }}
            >
              IIIT Bhubaneswar Dining OS
            </span>
          </div>
        </Link>

        <div style={{ padding: "40px 0" }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              padding: "5px 12px",
              borderRadius: 999,
              background: "rgba(16, 185, 129, 0.12)",
              border: "1px solid rgba(16, 185, 129, 0.3)",
              color: "#34d399",
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: "0.06em",
              marginBottom: 18,
            }}
          >
            <Sparkles size={13} /> RESIDENT ONBOARDING
          </div>

          <h2
            style={{
              fontSize: "clamp(2rem, 3.2vw, 2.6rem)",
              fontWeight: 800,
              lineHeight: 1.12,
              marginBottom: 16,
            }}
          >
            Initialize your
            <br />
            <span style={{ color: "#10b981" }}>Digital Dining Pass.</span>
          </h2>

          <p
            style={{
              color: "#94a3b8",
              fontSize: 15,
              lineHeight: 1.65,
              maxWidth: 460,
              marginBottom: 28,
            }}
          >
            Register with your official IIIT Bhubaneswar domain email. Once
            approved by the Mess Administrator, you can enroll in Ground Floor
            or 1st Floor dining plans.
          </p>

          <div style={{ display: "grid", gap: 12 }}>
            {[
              "Instant cryptographic QR pass on your phone",
              "Choose between Semester Subscription or Modular Pay-Per-Meal",
              "Real-time running ledger with automated leave rebates",
            ].map((item) => (
              <div
                key={item}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  fontSize: 13.5,
                  color: "#cbd5e1",
                }}
              >
                <div
                  style={{
                    width: 24,
                    height: 24,
                    borderRadius: 6,
                    background: "rgba(16, 185, 129, 0.12)",
                    display: "grid",
                    placeItems: "center",
                    color: "#10b981",
                  }}
                >
                  <Check size={14} />
                </div>
                {item}
              </div>
            ))}
          </div>
        </div>

        <div
          style={{ fontSize: 12, color: "#64748b", fontFamily: "monospace" }}
        >
          MESSMATRIX CORE • IIIT BHUBANESWAR • 2026
        </div>
      </div>

      {/* Right Registration Form */}
      <div
        style={{ display: "grid", placeItems: "center", padding: "40px 6%" }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: 480,
            background: "rgba(17, 24, 39, 0.8)",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            borderRadius: 20,
            padding: 32,
            boxShadow: "0 25px 50px rgba(0, 0, 0, 0.5)",
          }}
        >
          <div style={{ marginBottom: 22 }}>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                color: "#10b981",
                fontSize: 12,
                fontWeight: 700,
                marginBottom: 6,
              }}
            >
              <UserPlus size={14} /> NEW RESIDENT NODE
            </div>
            <h1 style={{ fontSize: 25, fontWeight: 800, margin: "0 0 6px" }}>
              Create Student Account
            </h1>
            <p style={{ color: "#94a3b8", fontSize: 13, margin: 0 }}>
              Restricted to verified @iiit-bh.ac.in institutional addresses
            </p>
          </div>

          {error && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "12px 14px",
                borderRadius: 10,
                background: "rgba(239, 68, 68, 0.12)",
                border: "1px solid rgba(239, 68, 68, 0.35)",
                color: "#fca5a5",
                fontSize: 13,
                marginBottom: 18,
              }}
            >
              <AlertCircle
                size={16}
                color="#ef4444"
                style={{ flexShrink: 0 }}
              />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={submit} style={{ display: "grid", gap: 14 }}>
            <label style={{ display: "grid", gap: 6 }}>
              <span
                style={{ fontSize: 12.5, fontWeight: 600, color: "#cbd5e1" }}
              >
                Full Legal Name
              </span>
              <input
                style={INPUT_STYLE}
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="e.g. Biswabin Sarandeep Pidika"
                required
              />
            </label>

            <label style={{ display: "grid", gap: 6 }}>
              <span
                style={{ fontSize: 12.5, fontWeight: 600, color: "#cbd5e1" }}
              >
                Institute Email
              </span>
              <input
                type="email"
                style={INPUT_STYLE}
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="b423018@iiit-bh.ac.in"
                required
              />
            </label>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "2fr 1fr",
                gap: 12,
              }}
            >
              <label style={{ display: "grid", gap: 6 }}>
                <span
                  style={{ fontSize: 12.5, fontWeight: 600, color: "#cbd5e1" }}
                >
                  Roll / Student ID
                </span>
                <input
                  style={INPUT_STYLE}
                  value={form.studentId}
                  onChange={(e) =>
                    setForm({ ...form, studentId: e.target.value })
                  }
                  placeholder="B423018"
                  required
                />
              </label>

              <label style={{ display: "grid", gap: 6 }}>
                <span
                  style={{ fontSize: 12.5, fontWeight: 600, color: "#cbd5e1" }}
                >
                  Semester
                </span>
                <input
                  type="number"
                  min="1"
                  max="10"
                  style={INPUT_STYLE}
                  value={form.semester}
                  onChange={(e) =>
                    setForm({ ...form, semester: Number(e.target.value) })
                  }
                />
              </label>
            </div>

            <label style={{ display: "grid", gap: 6 }}>
              <span
                style={{ fontSize: 12.5, fontWeight: 600, color: "#cbd5e1" }}
              >
                Contact Number (Optional)
              </span>
              <input
                style={INPUT_STYLE}
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="+91 81440 27830"
              />
            </label>

            <label style={{ display: "grid", gap: 6 }}>
              <span
                style={{ fontSize: 12.5, fontWeight: 600, color: "#cbd5e1" }}
              >
                Account Password
              </span>
              <input
                type="password"
                minLength="8"
                style={INPUT_STYLE}
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="Minimum 8 characters"
                required
              />
            </label>

            <button
              type="submit"
              disabled={isLoading}
              style={{
                marginTop: 8,
                width: "100%",
                padding: "12px 18px",
                borderRadius: 10,
                background: "linear-gradient(135deg, #10b981, #059669)",
                color: "#022c22",
                fontWeight: 800,
                fontSize: 14,
                border: "none",
                cursor: isLoading ? "not-allowed" : "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                boxShadow: "0 8px 20px rgba(16, 185, 129, 0.25)",
              }}
            >
              {isLoading ? (
                "Transmitting Profile..."
              ) : (
                <>
                  Submit Enrollment <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          <p
            style={{
              marginTop: 20,
              marginBottom: 0,
              fontSize: 13,
              color: "#94a3b8",
              textAlign: "center",
            }}
          >
            Already verified?{" "}
            <Link
              to="/login"
              style={{
                color: "#10b981",
                fontWeight: 700,
                textDecoration: "none",
              }}
            >
              Sign in to MessMatrix
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
