import { useState } from "react";
import {
  useMyComplaintsQuery,
  useCreateComplaintMutation,
} from "../../app/api.js";
import { toast } from "sonner";
import { MessageSquare, Plus, AlertCircle } from "lucide-react";

const CATEGORIES = [
  "food_quality",
  "hygiene",
  "drinking_water",
  "food_quantity",
  "staff_behaviour",
  "mess_cleanliness",
  "billing",
  "infrastructure",
  "menu",
  "other",
];
const PRIORITIES = ["low", "medium", "high", "urgent"];

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

export default function ComplaintsPage() {
  const { data, isLoading, refetch } = useMyComplaintsQuery();
  const [create, { isLoading: creating }] = useCreateComplaintMutation();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    category: "food_quality",
    title: "",
    description: "",
    priority: "medium",
  });

  const complaints = data?.data?.complaints || [];

  const submit = async (e) => {
    e.preventDefault();
    try {
      await create(form).unwrap();
      toast.success("Complaint submitted");
      setShowForm(false);
      setForm({
        category: "food_quality",
        title: "",
        description: "",
        priority: "medium",
      });
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || "Failed");
    }
  };

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "32px 24px" }}>
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          marginBottom: 32,
          flexWrap: "wrap",
          gap: 16,
        }}
      >
        <div>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              fontSize: 11,
              fontWeight: 800,
              color: "#f87171",
              letterSpacing: "0.1em",
              marginBottom: 8,
              background: "rgba(239, 68, 68, 0.15)",
              padding: "5px 14px",
              borderRadius: "20px",
              border: "1px solid rgba(239, 68, 68, 0.3)",
            }}
          >
            <MessageSquare size={14} /> HELPDESK
          </div>
          <h1
            style={{
              margin: 0,
              fontSize: "2rem",
              fontWeight: 800,
              letterSpacing: "-0.03em",
            }}
          >
            My Complaints
          </h1>
          <p style={{ margin: "8px 0 0", fontSize: 14, color: "#94a3b8" }}>
            Track and manage your mess complaints.
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          style={{
            padding: "10px 20px",
            borderRadius: 10,
            background: showForm
              ? "rgba(255,255,255,0.05)"
              : "linear-gradient(135deg, #ef4444, #b91c1c)",
            color: showForm ? "#f8fafc" : "#fff",
            fontWeight: 700,
            fontSize: 14,
            border: showForm ? "1px solid rgba(255,255,255,0.1)" : "none",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 8,
            boxShadow: showForm ? "none" : "0 4px 15px rgba(239, 68, 68, 0.4)",
          }}
        >
          {showForm ? (
            "Cancel"
          ) : (
            <>
              <Plus size={16} /> New Complaint
            </>
          )}
        </button>
      </header>

      {showForm && (
        <form onSubmit={submit} style={{ ...glassCard, marginBottom: 24 }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 16,
              marginBottom: 16,
            }}
          >
            <label style={{ display: "grid", gap: 6 }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: "#94a3b8" }}>
                Category
              </span>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                style={inputStyle}
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c.replace(/_/g, " ")}
                  </option>
                ))}
              </select>
            </label>
            <label style={{ display: "grid", gap: 6 }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: "#94a3b8" }}>
                Priority
              </span>
              <select
                value={form.priority}
                onChange={(e) => setForm({ ...form, priority: e.target.value })}
                style={inputStyle}
              >
                {PRIORITIES.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <label style={{ display: "grid", gap: 6, marginBottom: 16 }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: "#94a3b8" }}>
              Title
            </span>
            <input
              required
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="Brief title"
              style={inputStyle}
            />
          </label>
          <label style={{ display: "grid", gap: 6, marginBottom: 24 }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: "#94a3b8" }}>
              Description
            </span>
            <textarea
              required
              rows="3"
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              placeholder="Describe the issue in detail..."
              style={{ ...inputStyle, resize: "vertical" }}
            />
          </label>
          <button
            type="submit"
            disabled={creating}
            style={{
              padding: "12px 24px",
              borderRadius: 8,
              background: "linear-gradient(135deg, #ef4444, #b91c1c)",
              color: "#fff",
              fontWeight: 800,
              fontSize: 14,
              border: "none",
              cursor: "pointer",
              width: "100%",
            }}
          >
            {creating ? "Submitting..." : "Submit Complaint"}
          </button>
        </form>
      )}

      {isLoading ? (
        <p style={{ color: "#94a3b8" }}>Loading...</p>
      ) : complaints.length === 0 ? (
        <div style={{ ...glassCard, padding: 60, textAlign: "center" }}>
          <MessageSquare
            size={48}
            color="#334155"
            style={{ margin: "0 auto 16px" }}
          />
          <p style={{ color: "#94a3b8", fontSize: 15 }}>No complaints yet.</p>
        </div>
      ) : (
        <div style={{ display: "grid", gap: 16 }}>
          {complaints.map((c) => (
            <div
              key={c._id}
              style={{
                ...glassCard,
                borderLeft:
                  c.status === "resolved"
                    ? "4px solid #10b981"
                    : "4px solid #f59e0b",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  marginBottom: 12,
                }}
              >
                <div>
                  <h3
                    style={{
                      margin: 0,
                      fontSize: 18,
                      fontWeight: 800,
                      color: "#f8fafc",
                    }}
                  >
                    {c.title}
                  </h3>
                  <p
                    style={{
                      margin: "4px 0 0",
                      fontSize: 13,
                      color: "#94a3b8",
                      textTransform: "capitalize",
                    }}
                  >
                    {c.category?.replace(/_/g, " ")} • Priority: {c.priority}
                  </p>
                </div>
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 800,
                    background:
                      c.status === "resolved"
                        ? "rgba(16, 185, 129, 0.15)"
                        : "rgba(245, 158, 11, 0.15)",
                    color: c.status === "resolved" ? "#34d399" : "#fbbf24",
                    border: `1px solid ${c.status === "resolved" ? "rgba(16,185,129,0.3)" : "rgba(245,158,11,0.3)"}`,
                    padding: "4px 10px",
                    borderRadius: 6,
                    textTransform: "uppercase",
                  }}
                >
                  {c.status}
                </span>
              </div>
              <p
                style={{
                  margin: 0,
                  fontSize: 14,
                  color: "#cbd5e1",
                  lineHeight: 1.6,
                }}
              >
                {c.description}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
