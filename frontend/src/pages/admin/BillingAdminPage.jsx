import { useState } from "react";
import { useListUsersQuery } from "../../app/api.js";
import { toast } from "sonner";
import { Receipt, IndianRupee, Sparkles } from "lucide-react";

const glassCard = {
  background:
    "linear-gradient(145deg, rgba(30, 41, 59, 0.4) 0%, rgba(15, 23, 42, 0.6) 100%)",
  backdropFilter: "blur(16px)",
  WebkitBackdropFilter: "blur(16px)",
  border: "1px solid rgba(255, 255, 255, 0.08)",
  borderRadius: "16px",
  boxShadow: "0 10px 40px -10px rgba(0, 0, 0, 0.5)",
  padding: "24px",
};

const inputStyle = {
  width: "100%",
  padding: "12px 16px",
  borderRadius: "10px",
  background: "rgba(9, 13, 22, 0.7)",
  border: "1px solid rgba(255,255,255,0.1)",
  color: "#f8fafc",
  fontSize: 14,
  outline: "none",
  colorScheme: "dark",
};

export default function BillingAdminPage() {
  const { data: usersData } = useListUsersQuery({
    role: "student",
    status: "active",
  });
  const [form, setForm] = useState({
    userId: "",
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
  });
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState(null);

  const students = usersData?.data?.users || [];

  const submit = async (e) => {
    e.preventDefault();
    if (!form.userId) return toast.error("Select a student");
    setBusy(true);
    setResult(null);
    try {
      const res = await fetch(
        (import.meta.env.VITE_API_URL || "/api/v1") + "/billing/generate",
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            "X-CSRF-Token":
              (document.cookie.match(/(?:^|;\s*)csrf_token=([^;]+)/) ||
                [])[1] || "",
          },
          body: JSON.stringify(form),
        },
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed");
      setResult(data.data.bill);
      toast.success("Bill generated");
    } catch (err) {
      toast.error(err.message || "Failed");
    } finally {
      setBusy(false);
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
            color: "#c4b5fd",
            letterSpacing: "0.1em",
            marginBottom: 8,
            background: "rgba(139, 92, 246, 0.15)",
            padding: "5px 14px",
            borderRadius: "20px",
            border: "1px solid rgba(139, 92, 246, 0.3)",
          }}
        >
          <Receipt size={14} /> BILLING ENGINE
        </div>
        <h1
          style={{
            margin: 0,
            fontSize: "2rem",
            fontWeight: 800,
            letterSpacing: "-0.03em",
          }}
        >
          Generate Bill
        </h1>
        <p style={{ margin: "8px 0 0", fontSize: 14, color: "#94a3b8" }}>
          Bills include all registered and attended meals in the month.
        </p>
      </header>

      <form onSubmit={submit} style={glassCard}>
        <label style={{ display: "grid", gap: 8, marginBottom: 20 }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: "#94a3b8" }}>
            Student
          </span>
          <select
            value={form.userId}
            onChange={(e) => setForm({ ...form, userId: e.target.value })}
            required
            style={inputStyle}
          >
            <option value="">- Select student -</option>
            {students.map((s) => (
              <option key={s._id} value={s._id}>
                {s.name} ({s.studentId || s.email})
              </option>
            ))}
          </select>
        </label>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 20,
            marginBottom: 24,
          }}
        >
          <label style={{ display: "grid", gap: 8 }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: "#94a3b8" }}>
              Month
            </span>
            <select
              value={form.month}
              onChange={(e) =>
                setForm({ ...form, month: Number(e.target.value) })
              }
              style={inputStyle}
            >
              {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                <option key={m} value={m}>
                  {new Date(0, m - 1).toLocaleString("en", { month: "long" })}
                </option>
              ))}
            </select>
          </label>
          <label style={{ display: "grid", gap: 8 }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: "#94a3b8" }}>
              Year
            </span>
            <input
              type="number"
              min="2024"
              max="2100"
              value={form.year}
              onChange={(e) =>
                setForm({ ...form, year: Number(e.target.value) })
              }
              style={inputStyle}
            />
          </label>
        </div>
        <button
          type="submit"
          disabled={busy}
          style={{
            width: "100%",
            padding: "14px",
            borderRadius: 10,
            background: "linear-gradient(135deg, #8b5cf6, #6d28d9)",
            color: "#fff",
            fontWeight: 800,
            fontSize: 15,
            border: "none",
            cursor: busy ? "not-allowed" : "pointer",
            boxShadow: "0 4px 15px rgba(139, 92, 246, 0.4)",
          }}
        >
          {busy ? "Generating..." : "Generate Bill"}
        </button>
      </form>

      {result && (
        <div
          style={{
            ...glassCard,
            marginTop: 24,
            borderLeft: "4px solid #10b981",
          }}
        >
          <h3 style={{ margin: "0 0 16px", fontSize: 18, fontWeight: 800 }}>
            Bill Created Successfully
          </h3>
          <p style={{ margin: "0 0 20px", fontSize: 15, color: "#cbd5e1" }}>
            Total:{" "}
            <strong style={{ color: "#34d399", fontSize: 20 }}>
              <IndianRupee size={16} /> {result.total}
            </strong>{" "}
            - Status:{" "}
            <span style={{ textTransform: "capitalize", fontWeight: 700 }}>
              {result.status}
            </span>
          </p>

          {result.items?.length > 0 && (
            <div
              style={{
                background: "rgba(15, 23, 42, 0.5)",
                borderRadius: 12,
                overflow: "hidden",
              }}
            >
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  textAlign: "left",
                  fontSize: 14,
                }}
              >
                <thead>
                  <tr
                    style={{
                      background: "rgba(15, 23, 42, 0.8)",
                      borderBottom: "1px solid rgba(255,255,255,0.08)",
                    }}
                  >
                    {["Item", "Qty", "Unit", "Amount"].map((h, i) => (
                      <th
                        key={i}
                        style={{
                          padding: "12px 16px",
                          color: "#94a3b8",
                          fontWeight: 700,
                        }}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {result.items.map((it, i) => (
                    <tr
                      key={i}
                      style={{
                        borderBottom: "1px solid rgba(255,255,255,0.04)",
                      }}
                    >
                      <td style={{ padding: "12px 16px", color: "#f8fafc" }}>
                        {it.label}
                      </td>
                      <td style={{ padding: "12px 16px", color: "#cbd5e1" }}>
                        {it.quantity}
                      </td>
                      <td style={{ padding: "12px 16px", color: "#cbd5e1" }}>
                        ₹ {it.unitPrice}
                      </td>
                      <td
                        style={{
                          padding: "12px 16px",
                          color: "#34d399",
                          fontWeight: 700,
                        }}
                      >
                        ₹ {it.amount}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
