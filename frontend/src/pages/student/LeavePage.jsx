import { useState } from "react";
import { useMyLeavesQuery, useCreateLeaveMutation } from "../../app/api.js";
import { toast } from "sonner";
import { CalendarDays, Plus, Clock, CheckCircle2, XCircle } from "lucide-react";

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

export default function LeavePage() {
  const { data, isLoading, refetch } = useMyLeavesQuery();
  const [create, { isLoading: creating }] = useCreateLeaveMutation();
  const [showForm, setShowForm] = useState(false);
  const today = new Date().toISOString().slice(0, 10);
  const [form, setForm] = useState({
    fromDate: today,
    toDate: today,
    affectedCategories: ["breakfast", "lunch", "dinner"],
    reason: "",
  });

  const leaves = data?.data?.leaves || [];

  const toggleCat = (c) => {
    setForm((f) => ({
      ...f,
      affectedCategories: f.affectedCategories.includes(c)
        ? f.affectedCategories.filter((x) => x !== c)
        : [...f.affectedCategories, c],
    }));
  };

  const submit = async (e) => {
    e.preventDefault();
    try {
      await create(form).unwrap();
      toast.success("Leave request submitted");
      setShowForm(false);
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || "Failed");
    }
  };

  const getStatusBadge = (s) => {
    if (s === "approved")
      return (
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 4,
            fontSize: 11,
            fontWeight: 800,
            background: "rgba(16, 185, 129, 0.15)",
            color: "#34d399",
            border: "1px solid rgba(16,185,129,0.3)",
            padding: "4px 10px",
            borderRadius: 6,
            textTransform: "uppercase",
          }}
        >
          <CheckCircle2 size={12} /> Approved
        </span>
      );
    if (s === "rejected")
      return (
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 4,
            fontSize: 11,
            fontWeight: 800,
            background: "rgba(239, 68, 68, 0.15)",
            color: "#f87171",
            border: "1px solid rgba(239,68,68,0.3)",
            padding: "4px 10px",
            borderRadius: 6,
            textTransform: "uppercase",
          }}
        >
          <XCircle size={12} /> Rejected
        </span>
      );
    return (
      <span
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 4,
          fontSize: 11,
          fontWeight: 800,
          background: "rgba(245, 158, 11, 0.15)",
          color: "#fbbf24",
          border: "1px solid rgba(245,158,11,0.3)",
          padding: "4px 10px",
          borderRadius: 6,
          textTransform: "uppercase",
        }}
      >
        <Clock size={12} /> Pending
      </span>
    );
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
              color: "#fbbf24",
              letterSpacing: "0.1em",
              marginBottom: 8,
              background: "rgba(245, 158, 11, 0.15)",
              padding: "5px 14px",
              borderRadius: "20px",
              border: "1px solid rgba(245, 158, 11, 0.3)",
            }}
          >
            <CalendarDays size={14} /> LEAVE PORTAL
          </div>
          <h1
            style={{
              margin: 0,
              fontSize: "2rem",
              fontWeight: 800,
              letterSpacing: "-0.03em",
            }}
          >
            Leave Requests
          </h1>
          <p style={{ margin: "8px 0 0", fontSize: 14, color: "#94a3b8" }}>
            Apply for mess leave and track approval.
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
              <Plus size={16} /> New Request
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
                From Date
              </span>
              <input
                type="date"
                value={form.fromDate}
                onChange={(e) => setForm({ ...form, fromDate: e.target.value })}
                style={inputStyle}
              />
            </label>
            <label style={{ display: "grid", gap: 6 }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: "#94a3b8" }}>
                To Date
              </span>
              <input
                type="date"
                value={form.toDate}
                onChange={(e) => setForm({ ...form, toDate: e.target.value })}
                style={inputStyle}
              />
            </label>
          </div>
          <label style={{ display: "grid", gap: 8, marginBottom: 16 }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: "#94a3b8" }}>
              Affected Meals
            </span>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              {["breakfast", "lunch", "snacks", "dinner"].map((c) => (
                <button
                  type="button"
                  key={c}
                  onClick={() => toggleCat(c)}
                  style={{
                    padding: "8px 16px",
                    borderRadius: 8,
                    border: form.affectedCategories.includes(c)
                      ? "1px solid #f59e0b"
                      : "1px solid rgba(255,255,255,0.1)",
                    background: form.affectedCategories.includes(c)
                      ? "rgba(245, 158, 11, 0.15)"
                      : "rgba(255,255,255,0.03)",
                    color: form.affectedCategories.includes(c)
                      ? "#fbbf24"
                      : "#94a3b8",
                    fontWeight: 600,
                    fontSize: 13,
                    cursor: "pointer",
                    textTransform: "capitalize",
                  }}
                >
                  {c}
                </button>
              ))}
            </div>
          </label>
          <label style={{ display: "grid", gap: 6, marginBottom: 24 }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: "#94a3b8" }}>
              Reason
            </span>
            <textarea
              required
              rows="2"
              value={form.reason}
              onChange={(e) => setForm({ ...form, reason: e.target.value })}
              placeholder="Why are you taking leave?"
              style={{ ...inputStyle, resize: "vertical" }}
            />
          </label>
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
            {creating ? "Submitting..." : "Submit Request"}
          </button>
        </form>
      )}

      {isLoading ? (
        <p style={{ color: "#94a3b8" }}>Loading...</p>
      ) : leaves.length === 0 ? (
        <div style={{ ...glassCard, padding: 60, textAlign: "center" }}>
          <CalendarDays
            size={48}
            color="#334155"
            style={{ margin: "0 auto 16px" }}
          />
          <p style={{ color: "#94a3b8", fontSize: 15 }}>
            No leave requests yet.
          </p>
        </div>
      ) : (
        <div style={{ ...glassCard, padding: 0, overflow: "hidden" }}>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              textAlign: "left",
            }}
          >
            <thead>
              <tr
                style={{
                  background: "rgba(15, 23, 42, 0.8)",
                  borderBottom: "1px solid rgba(255,255,255,0.08)",
                }}
              >
                {["From", "To", "Meals", "Status", "Remarks"].map((h) => (
                  <th
                    key={h}
                    style={{
                      padding: "16px 20px",
                      fontSize: 13,
                      fontWeight: 700,
                      color: "#94a3b8",
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {leaves.map((l) => (
                <tr
                  key={l._id}
                  style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}
                >
                  <td
                    style={{
                      padding: "16px 20px",
                      fontSize: 14,
                      color: "#cbd5e1",
                    }}
                  >
                    {new Date(l.fromDate).toLocaleDateString()}
                  </td>
                  <td
                    style={{
                      padding: "16px 20px",
                      fontSize: 14,
                      color: "#cbd5e1",
                    }}
                  >
                    {new Date(l.toDate).toLocaleDateString()}
                  </td>
                  <td
                    style={{
                      padding: "16px 20px",
                      fontSize: 13,
                      color: "#94a3b8",
                      textTransform: "capitalize",
                    }}
                  >
                    {l.affectedCategories?.join(", ")}
                  </td>
                  <td style={{ padding: "16px 20px" }}>
                    {getStatusBadge(l.status)}
                  </td>
                  <td
                    style={{
                      padding: "16px 20px",
                      fontSize: 13,
                      color: "#64748b",
                    }}
                  >
                    {l.remarks || "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
