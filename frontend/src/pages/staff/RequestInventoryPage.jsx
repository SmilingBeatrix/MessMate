import { useState } from "react";
import {
  useMyInventoryRequestsQuery,
  useCreateInventoryRequestMutation,
} from "../../app/api.js";
import { toast } from "sonner";
import { Plus, Clock, CheckCircle2, XCircle, Package } from "lucide-react";

const CATEGORIES = [
  "rice",
  "wheat",
  "vegetables",
  "fruits",
  "pulses",
  "dairy",
  "cooking_oil",
  "spices",
  "meat",
  "cleaning",
  "other",
];
const UNITS = ["kg", "g", "l", "ml", "piece", "packet", "dozen"];

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

export default function RequestInventoryPage() {
  const { data, isLoading, refetch } = useMyInventoryRequestsQuery();
  const [create, { isLoading: creating }] = useCreateInventoryRequestMutation();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    itemName: "",
    category: "vegetables",
    quantity: 1,
    unit: "kg",
    estimatedCost: 0,
    note: "",
    urgency: "normal",
  });

  const requests = data?.data?.requests || [];

  const submit = async (e) => {
    e.preventDefault();
    try {
      await create(form).unwrap();
      toast.success("Request submitted to admin");
      setShowForm(false);
      setForm({
        itemName: "",
        category: "vegetables",
        quantity: 1,
        unit: "kg",
        estimatedCost: 0,
        note: "",
        urgency: "normal",
      });
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || "Failed");
    }
  };

  const getStatusBadge = (s) => {
    if (s === "pending")
      return (
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
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
    if (s === "fulfilled" || s === "approved")
      return (
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
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
            gap: 6,
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
    return null;
  };

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "32px 24px" }}>
      <style>{`.matrix-input:focus { border-color: rgba(56, 189, 248, 0.6) !important; box-shadow: 0 0 0 3px rgba(56, 189, 248, 0.15) !important; }`}</style>

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
              color: "#38bdf8",
              letterSpacing: "0.1em",
              marginBottom: 8,
              background: "rgba(56, 189, 248, 0.15)",
              padding: "5px 14px",
              borderRadius: "20px",
              border: "1px solid rgba(56, 189, 248, 0.3)",
            }}
          >
            <Package size={14} /> STOCK REQUISITION
          </div>
          <h1
            style={{
              margin: 0,
              fontSize: "2rem",
              fontWeight: 800,
              letterSpacing: "-0.03em",
            }}
          >
            Request Inventory
          </h1>
          <p style={{ margin: "8px 0 0", fontSize: 14, color: "#94a3b8" }}>
            Ask the admin to add new stock to the kitchen.
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          style={{
            padding: "10px 20px",
            borderRadius: 10,
            background: showForm
              ? "rgba(255,255,255,0.05)"
              : "linear-gradient(135deg, #38bdf8, #0284c7)",
            color: showForm ? "#f8fafc" : "#082f49",
            fontWeight: 700,
            fontSize: 14,
            border: showForm ? "1px solid rgba(255,255,255,0.1)" : "none",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 8,
            boxShadow: showForm ? "none" : "0 4px 15px rgba(56, 189, 248, 0.4)",
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
                Item Name
              </span>
              <input
                required
                value={form.itemName}
                onChange={(e) => setForm({ ...form, itemName: e.target.value })}
                placeholder="e.g. Basmati Rice"
                style={inputStyle}
                className="matrix-input"
              />
            </label>
            <label style={{ display: "grid", gap: 6 }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: "#94a3b8" }}>
                Category
              </span>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                style={inputStyle}
                className="matrix-input"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </label>
            <label style={{ display: "grid", gap: 6 }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: "#94a3b8" }}>
                Quantity
              </span>
              <input
                type="number"
                min="0.1"
                step="0.1"
                required
                value={form.quantity}
                onChange={(e) =>
                  setForm({ ...form, quantity: Number(e.target.value) })
                }
                style={inputStyle}
                className="matrix-input"
              />
            </label>
            <label style={{ display: "grid", gap: 6 }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: "#94a3b8" }}>
                Unit
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
                value={form.estimatedCost}
                onChange={(e) =>
                  setForm({ ...form, estimatedCost: Number(e.target.value) })
                }
                style={inputStyle}
                className="matrix-input"
              />
            </label>
            <label style={{ display: "grid", gap: 6 }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: "#94a3b8" }}>
                Urgency
              </span>
              <select
                value={form.urgency}
                onChange={(e) => setForm({ ...form, urgency: e.target.value })}
                style={inputStyle}
                className="matrix-input"
              >
                <option value="low">Low</option>
                <option value="normal">Normal</option>
                <option value="high">High</option>
              </select>
            </label>
            <label style={{ display: "grid", gap: 6 }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: "#94a3b8" }}>
                Note (optional)
              </span>
              <input
                value={form.note}
                onChange={(e) => setForm({ ...form, note: e.target.value })}
                placeholder="Why needed?"
                style={inputStyle}
                className="matrix-input"
              />
            </label>
          </div>
          <button
            type="submit"
            disabled={creating}
            style={{
              padding: "12px 24px",
              borderRadius: 8,
              background: "linear-gradient(135deg, #38bdf8, #0284c7)",
              color: "#082f49",
              fontWeight: 800,
              fontSize: 14,
              border: "none",
              cursor: "pointer",
              width: "100%",
              boxShadow: "0 4px 15px rgba(56, 189, 248, 0.3)",
            }}
          >
            {creating ? "Submitting..." : "Submit Request"}
          </button>
        </form>
      )}

      {isLoading ? (
        <p style={{ color: "#94a3b8" }}>Loading...</p>
      ) : requests.length === 0 ? (
        <div style={{ ...glassCard, padding: 60, textAlign: "center" }}>
          <Package
            size={48}
            color="#334155"
            style={{ margin: "0 auto 16px" }}
          />
          <p style={{ color: "#94a3b8", fontSize: 15 }}>
            No requests yet. Click "New Request" to ask the admin for items.
          </p>
        </div>
      ) : (
        <div style={{ ...glassCard, padding: 0, overflow: "hidden" }}>
          <div style={{ overflowX: "auto" }}>
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
                  {[
                    "Item",
                    "Quantity",
                    "Urgency",
                    "Status",
                    "Requested",
                    "Response",
                  ].map((h, i) => (
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
                  ))}
                </tr>
              </thead>
              <tbody>
                {requests.map((r) => (
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
                    <td style={{ padding: "16px 20px" }}>
                      <div style={{ fontWeight: 700, color: "#f8fafc" }}>
                        {r.itemName}
                      </div>
                      <div
                        style={{
                          fontSize: 12,
                          color: "#64748b",
                          textTransform: "capitalize",
                        }}
                      >
                        {r.category}
                      </div>
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
                          background:
                            r.urgency === "high"
                              ? "rgba(239, 68, 68, 0.15)"
                              : "rgba(255,255,255,0.05)",
                          color: r.urgency === "high" ? "#f87171" : "#cbd5e1",
                          border: `1px solid ${r.urgency === "high" ? "rgba(239,68,68,0.3)" : "rgba(255,255,255,0.1)"}`,
                          padding: "4px 10px",
                          borderRadius: 6,
                          textTransform: "uppercase",
                        }}
                      >
                        {r.urgency}
                      </span>
                    </td>
                    <td style={{ padding: "16px 20px" }}>
                      {getStatusBadge(r.status)}
                    </td>
                    <td
                      style={{
                        padding: "16px 20px",
                        fontSize: 13,
                        color: "#94a3b8",
                      }}
                    >
                      {new Date(r.createdAt).toLocaleString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                    <td
                      style={{
                        padding: "16px 20px",
                        fontSize: 13,
                        color: "#64748b",
                      }}
                    >
                      {r.rejectionReason
                        ? "Reason: " + r.rejectionReason
                        : r.approvedAt
                          ? "Added on " +
                            new Date(r.approvedAt).toLocaleDateString()
                          : "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
