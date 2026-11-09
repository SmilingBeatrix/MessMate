import { useState } from "react";
import {
  useListAnnouncementsQuery,
  useCreateAnnouncementMutation,
} from "../../app/api.js";
import { toast } from "sonner";
import { Megaphone, Plus, AlertCircle } from "lucide-react";

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

export default function AnnouncementsPage() {
  const { data, isLoading, refetch } = useListAnnouncementsQuery();
  const [create, { isLoading: creating }] = useCreateAnnouncementMutation();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    title: "",
    body: "",
    category: "general",
    priority: "normal",
  });

  const announcements = data?.data?.announcements || [];

  const submit = async (e) => {
    e.preventDefault();
    try {
      await create(form).unwrap();
      toast.success("Published");
      setShowForm(false);
      setForm({ title: "", body: "", category: "general", priority: "normal" });
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || "Failed");
    }
  };

  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: "32px 24px" }}>
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
              color: "#fbbf24",
              letterSpacing: "0.1em",
              marginBottom: 8,
              background: "rgba(245, 158, 11, 0.15)",
              padding: "5px 14px",
              borderRadius: "20px",
              border: "1px solid rgba(245, 158, 11, 0.3)",
            }}
          >
            <Megaphone size={14} /> BROADCASTS
          </div>
          <h1
            style={{
              margin: 0,
              fontSize: "2rem",
              fontWeight: 800,
              letterSpacing: "-0.03em",
            }}
          >
            Announcements
          </h1>
          <p style={{ margin: "8px 0 0", fontSize: 14, color: "#94a3b8" }}>
            Publish official notices to all campus users.
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          style={{
            padding: "10px 20px",
            borderRadius: 10,
            background: showForm
              ? "rgba(255,255,255,0.05)"
              : "linear-gradient(135deg, #f59e0b, #d97706)",
            color: showForm ? "#f8fafc" : "#451a03",
            fontWeight: 700,
            fontSize: 14,
            border: showForm ? "1px solid rgba(255,255,255,0.1)" : "none",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 8,
            boxShadow: showForm ? "none" : "0 4px 15px rgba(245, 158, 11, 0.4)",
          }}
        >
          {showForm ? (
            "Cancel"
          ) : (
            <>
              <Plus size={16} /> New Notice
            </>
          )}
        </button>
      </header>

      {showForm && (
        <form onSubmit={submit} style={{ ...glassCard, marginBottom: 24 }}>
          <label style={{ display: "grid", gap: 8, marginBottom: 16 }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: "#94a3b8" }}>
              Title
            </span>
            <input
              required
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              style={inputStyle}
            />
          </label>
          <label style={{ display: "grid", gap: 8, marginBottom: 16 }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: "#94a3b8" }}>
              Message Body
            </span>
            <textarea
              required
              rows="3"
              value={form.body}
              onChange={(e) => setForm({ ...form, body: e.target.value })}
              style={{ ...inputStyle, resize: "vertical" }}
            />
          </label>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 16,
              marginBottom: 24,
            }}
          >
            <label style={{ display: "grid", gap: 8 }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: "#94a3b8" }}>
                Category
              </span>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                style={inputStyle}
              >
                {[
                  "general",
                  "menu_change",
                  "special_dinner",
                  "mess_holiday",
                  "maintenance",
                  "payment_reminder",
                ].map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </label>
            <label style={{ display: "grid", gap: 8 }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: "#94a3b8" }}>
                Priority
              </span>
              <select
                value={form.priority}
                onChange={(e) => setForm({ ...form, priority: e.target.value })}
                style={inputStyle}
              >
                {["low", "normal", "high", "urgent"].map((p) => (
                  <option key={p}>{p}</option>
                ))}
              </select>
            </label>
          </div>
          <button
            type="submit"
            disabled={creating}
            style={{
              padding: "12px 24px",
              borderRadius: 8,
              background: "linear-gradient(135deg, #f59e0b, #d97706)",
              color: "#451a03",
              fontWeight: 800,
              fontSize: 14,
              border: "none",
              cursor: "pointer",
              width: "100%",
            }}
          >
            {creating ? "Publishing..." : "Publish Announcement"}
          </button>
        </form>
      )}

      {isLoading ? (
        <p style={{ color: "#94a3b8" }}>Loading...</p>
      ) : announcements.length === 0 ? (
        <div style={{ ...glassCard, padding: 60, textAlign: "center" }}>
          <Megaphone
            size={48}
            color="#334155"
            style={{ margin: "0 auto 16px" }}
          />
          <p style={{ color: "#94a3b8", fontSize: 15 }}>
            No announcements yet.
          </p>
        </div>
      ) : (
        <div style={{ display: "grid", gap: 16 }}>
          {announcements.map((a) => {
            const isUrgent = a.priority === "urgent" || a.priority === "high";
            return (
              <div
                key={a._id}
                style={{
                  ...glassCard,
                  padding: 24,
                  borderLeft: isUrgent
                    ? "4px solid #ef4444"
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
                  <h3
                    style={{
                      margin: 0,
                      fontSize: 18,
                      fontWeight: 800,
                      color: "#f8fafc",
                    }}
                  >
                    {a.title}
                  </h3>
                  <span
                    style={{
                      fontSize: 10,
                      fontWeight: 800,
                      textTransform: "uppercase",
                      background: isUrgent
                        ? "rgba(239, 68, 68, 0.15)"
                        : "rgba(255,255,255,0.05)",
                      color: isUrgent ? "#f87171" : "#94a3b8",
                      border: `1px solid ${isUrgent ? "rgba(239,68,68,0.3)" : "rgba(255,255,255,0.1)"}`,
                      padding: "4px 10px",
                      borderRadius: 6,
                    }}
                  >
                    {a.priority}
                  </span>
                </div>
                <p
                  style={{
                    margin: "0 0 16px",
                    fontSize: 14,
                    color: "#cbd5e1",
                    lineHeight: 1.6,
                  }}
                >
                  {a.body}
                </p>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: 12,
                    color: "#64748b",
                  }}
                >
                  <span
                    style={{
                      textTransform: "capitalize",
                      fontWeight: 600,
                      color: "#94a3b8",
                    }}
                  >
                    {a.category.replace(/_/g, " ")}
                  </span>
                  <span>{new Date(a.createdAt).toLocaleString()}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
