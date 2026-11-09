import { useState } from "react";
import { useMyWastageQuery, useCreateWastageMutation } from "../../app/api.js";
import { toast } from "sonner";
import {
  Plus,
  Trash2,
  CheckCircle2,
  Clock,
  RotateCw,
  IndianRupee,
} from "lucide-react";

const UNITS = ["kg", "g", "l", "ml", "piece", "packet"];
const REASONS = ["leftover", "spoiled", "overcooked", "other"];

const glassCard = {
  background:
    "linear-gradient(145deg, rgba(30, 41, 59, 0.4) 0%, rgba(15, 23, 42, 0.6) 100%)",
  backdropFilter: "blur(16px)",
  WebkitBackdropFilter: "blur(16px)",
  border: "1px solid rgba(255, 255, 255, 0.08)",
  borderRadius: "16px",
  boxShadow:
    "0 10px 40px -10px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.05)",
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
  transition: "all 0.2s",
};

export default function WastagePage() {
  const { data, refetch, isLoading } = useMyWastageQuery();
  const [create, { isLoading: saving }] = useCreateWastageMutation();

  const today = new Date().toISOString().slice(0, 10);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    itemName: "",
    quantity: 1,
    unit: "kg",
    reason: "leftover",
    estimatedCost: 0,
    notes: "",
    date: today,
  });

  const records = data?.data?.records || [];
  const stats = data?.data?.stats || { count: 0, totalCost: 0 };

  const submit = async (e) => {
    e.preventDefault();
    if (!form.itemName.trim()) return toast.error("Enter item name");
    if (Number(form.quantity) <= 0)
      return toast.error("Quantity must be greater than 0");

    try {
      await create({
        itemName: form.itemName.trim(),
        quantity: Number(form.quantity),
        unit: form.unit,
        reason: form.reason,
        estimatedCost: Number(form.estimatedCost) || 0,
        notes: form.notes || "",
        date: form.date,
      }).unwrap();
      toast.success("Wastage recorded");
      setShowForm(false);
      setForm({
        itemName: "",
        quantity: 1,
        unit: "kg",
        reason: "leftover",
        estimatedCost: 0,
        notes: "",
        date: today,
      });
      refetch();
    } catch (err) {
      const msg = err?.data?.message || "Failed to record wastage";
      const errors = err?.data?.errors;
      toast.error(Array.isArray(errors) ? errors.join(", ") : msg);
    }
  };

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "32px 24px" }}>
      <style>{`.matrix-input:focus { border-color: rgba(239, 68, 68, 0.6) !important; box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.15) !important; }`}</style>

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
            <Trash2 size={14} /> LOSS TRACKER
          </div>
          <h1
            style={{
              margin: 0,
              fontSize: "2rem",
              fontWeight: 800,
              letterSpacing: "-0.03em",
            }}
          >
            Food Wastage
          </h1>
          <p style={{ margin: "8px 0 0", fontSize: 14, color: "#94a3b8" }}>
            Record leftover or spoiled items after each meal.
          </p>
        </div>
        <div style={{ display: "flex", gap: 12 }}>
          <button
            onClick={() => refetch()}
            style={{
              padding: "10px 16px",
              borderRadius: 10,
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.1)",
              color: "#f8fafc",
              fontWeight: 600,
              fontSize: 14,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            <RotateCw size={16} /> Refresh
          </button>
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
              boxShadow: showForm
                ? "none"
                : "0 4px 15px rgba(239, 68, 68, 0.4)",
            }}
          >
            {showForm ? (
              "Cancel"
            ) : (
              <>
                <Plus size={16} /> Record Wastage
              </>
            )}
          </button>
        </div>
      </header>

      <section
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: 20,
          marginBottom: 24,
        }}
      >
        <div
          style={{
            ...glassCard,
            padding: 24,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <span
              style={{
                fontSize: 12,
                fontWeight: 700,
                color: "#94a3b8",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}
            >
              My Records
            </span>
            <strong style={{ fontSize: 28, display: "block", marginTop: 8 }}>
              {stats.count || 0}
            </strong>
          </div>
          <div
            style={{
              width: 42,
              height: 42,
              borderRadius: "12px",
              background: "rgba(56, 189, 248, 0.15)",
              display: "grid",
              placeItems: "center",
              boxShadow: "0 0 15px rgba(56, 189, 248, 0.2)",
            }}
          >
            <Clock size={20} color="#38bdf8" />
          </div>
        </div>
        <div
          style={{
            ...glassCard,
            padding: 24,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <span
              style={{
                fontSize: 12,
                fontWeight: 700,
                color: "#94a3b8",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}
            >
              Total Cost
            </span>
            <strong
              style={{
                fontSize: 28,
                display: "flex",
                alignItems: "center",
                marginTop: 8,
                color: "#f87171",
              }}
            >
              <IndianRupee size={20} /> {stats.totalCost || 0}
            </strong>
          </div>
          <div
            style={{
              width: 42,
              height: 42,
              borderRadius: "12px",
              background: "rgba(239, 68, 68, 0.15)",
              display: "grid",
              placeItems: "center",
              boxShadow: "0 0 15px rgba(239, 68, 68, 0.2)",
            }}
          >
            <Trash2 size={20} color="#f87171" />
          </div>
        </div>
      </section>

      {showForm && (
        <form
          onSubmit={submit}
          style={{ ...glassCard, padding: 24, marginBottom: 24 }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: 16,
              marginBottom: 16,
            }}
          >
            <label style={{ display: "grid", gap: 6 }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: "#94a3b8" }}>
                Item Name *
              </span>
              <input
                required
                value={form.itemName}
                onChange={(e) => setForm({ ...form, itemName: e.target.value })}
                placeholder="e.g. Rice, Dal"
                style={inputStyle}
                className="matrix-input"
              />
            </label>
            <label style={{ display: "grid", gap: 6 }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: "#94a3b8" }}>
                Quantity *
              </span>
              <input
                type="number"
                min="0.01"
                step="0.01"
                required
                value={form.quantity}
                onChange={(e) => setForm({ ...form, quantity: e.target.value })}
                style={inputStyle}
                className="matrix-input"
              />
            </label>
            <label style={{ display: "grid", gap: 6 }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: "#94a3b8" }}>
                Unit *
              </span>
              <select
                value={form.unit}
                onChange={(e) => setForm({ ...form, unit: e.target.value })}
                style={inputStyle}
                className="matrix-input"
              >
                {UNITS.map((u) => (
                  <option key={u} value={u}>
                    {u}
                  </option>
                ))}
              </select>
            </label>
            <label style={{ display: "grid", gap: 6 }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: "#94a3b8" }}>
                Reason
              </span>
              <select
                value={form.reason}
                onChange={(e) => setForm({ ...form, reason: e.target.value })}
                style={inputStyle}
                className="matrix-input"
              >
                {REASONS.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: 16,
              marginBottom: 24,
            }}
          >
            <label style={{ display: "grid", gap: 6 }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: "#94a3b8" }}>
                Estimated Cost (₹)
              </span>
              <input
                type="number"
                min="0"
                step="1"
                value={form.estimatedCost}
                onChange={(e) =>
                  setForm({ ...form, estimatedCost: e.target.value })
                }
                style={inputStyle}
                className="matrix-input"
              />
            </label>
            <label style={{ display: "grid", gap: 6 }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: "#94a3b8" }}>
                Date
              </span>
              <input
                type="date"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                style={inputStyle}
                className="matrix-input"
              />
            </label>
            <label style={{ display: "grid", gap: 6 }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: "#94a3b8" }}>
                Notes (optional)
              </span>
              <input
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                placeholder="Any detail"
                style={inputStyle}
                className="matrix-input"
              />
            </label>
          </div>
          <button
            type="submit"
            disabled={saving}
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
              boxShadow: "0 4px 15px rgba(239, 68, 68, 0.3)",
            }}
          >
            {saving ? "Saving..." : "Record Wastage"}
          </button>
        </form>
      )}

      <section>
        <h2
          style={{
            fontSize: 18,
            fontWeight: 800,
            marginBottom: 16,
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <Clock size={20} color="#f8fafc" /> My wastage history
        </h2>
        {isLoading ? (
          <p style={{ color: "#94a3b8" }}>Loading...</p>
        ) : records.length === 0 ? (
          <div style={{ ...glassCard, padding: 60, textAlign: "center" }}>
            <Trash2
              size={48}
              color="#334155"
              style={{ margin: "0 auto 16px" }}
            />
            <h3 style={{ margin: "0 0 6px", fontSize: 18, color: "#f8fafc" }}>
              No wastage recorded yet
            </h3>
            <p style={{ color: "#94a3b8", fontSize: 14, margin: 0 }}>
              Click "Record Wastage" above to log leftover items after serving.
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
                  {["Date", "Item", "Quantity", "Reason", "Cost", "Notes"].map(
                    (h, i) => (
                      <th
                        key={i}
                        style={{
                          padding: "16px 20px",
                          fontSize: 13,
                          fontWeight: 700,
                          color: "#94a3b8",
                        }}
                      >
                        {h}
                      </th>
                    ),
                  )}
                </tr>
              </thead>
              <tbody>
                {records.map((r) => {
                  const isRecent =
                    new Date() - new Date(r.createdAt) < 5 * 60 * 1000;
                  return (
                    <tr
                      key={r._id}
                      style={{
                        borderBottom: "1px solid rgba(255,255,255,0.04)",
                        transition: "background 0.2s",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.background =
                          "rgba(255,255,255,0.02)")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.background = "transparent")
                      }
                    >
                      <td
                        style={{
                          padding: "16px 20px",
                          fontSize: 13,
                          color: "#cbd5e1",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 6,
                          }}
                        >
                          {isRecent && (
                            <CheckCircle2 size={14} color="#10b981" />
                          )}
                          {new Date(r.date).toLocaleDateString("en-IN", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })}
                        </div>
                      </td>
                      <td
                        style={{
                          padding: "16px 20px",
                          fontWeight: 700,
                          color: "#f8fafc",
                        }}
                      >
                        {r.itemName}
                      </td>
                      <td
                        style={{
                          padding: "16px 20px",
                          fontSize: 14,
                          color: "#cbd5e1",
                        }}
                      >
                        {r.quantity} {r.unit}
                      </td>
                      <td style={{ padding: "16px 20px" }}>
                        <span
                          style={{
                            fontSize: 11,
                            fontWeight: 800,
                            background: "rgba(255,255,255,0.05)",
                            color: "#cbd5e1",
                            border: "1px solid rgba(255,255,255,0.1)",
                            padding: "4px 10px",
                            borderRadius: 6,
                            textTransform: "capitalize",
                          }}
                        >
                          {r.reason}
                        </span>
                      </td>
                      <td
                        style={{
                          padding: "16px 20px",
                          fontWeight: 700,
                          color: r.estimatedCost > 0 ? "#f87171" : "#64748b",
                        }}
                      >
                        {r.estimatedCost > 0 ? `₹ ${r.estimatedCost}` : "-"}
                      </td>
                      <td
                        style={{
                          padding: "16px 20px",
                          fontSize: 13,
                          color: "#94a3b8",
                        }}
                      >
                        {r.notes || "-"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
