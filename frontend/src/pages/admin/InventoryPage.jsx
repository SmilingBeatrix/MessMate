import { useState } from "react";
import {
  useListInventoryQuery,
  useCreateInventoryMutation,
  useRecordStockMutation,
} from "../../app/api.js";
import { toast } from "sonner";
import { Box, Plus, AlertTriangle, ArrowUpRight } from "lucide-react";

const CATS = [
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
};

export default function InventoryPage() {
  const { data, refetch, isLoading } = useListInventoryQuery({});
  const [create] = useCreateInventoryMutation();
  const [record] = useRecordStockMutation();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    name: "",
    category: "rice",
    unit: "kg",
    quantity: 0,
    minStockLevel: 5,
    unitCost: 0,
  });

  const items = data?.data?.items || [];

  const submit = async (e) => {
    e.preventDefault();
    try {
      await create(form).unwrap();
      toast.success("Item added");
      setShowForm(false);
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || "Failed");
    }
  };

  const quickPurchase = async (item) => {
    const qty = prompt(`Add stock for ${item.name} (${item.unit}):`, "10");
    if (!qty) return;
    try {
      await record({
        id: item._id,
        type: "purchase",
        quantity: Number(qty),
      }).unwrap();
      toast.success("Stock updated");
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || "Failed");
    }
  };

  return (
    <div style={{ maxWidth: 1000, margin: "0 auto", padding: "32px 24px" }}>
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
              color: "#34d399",
              letterSpacing: "0.1em",
              marginBottom: 8,
              background: "rgba(16, 185, 129, 0.15)",
              padding: "5px 14px",
              borderRadius: "20px",
              border: "1px solid rgba(16, 185, 129, 0.3)",
            }}
          >
            <Box size={14} /> INVENTORY MATRIX
          </div>
          <h1
            style={{
              margin: 0,
              fontSize: "2rem",
              fontWeight: 800,
              letterSpacing: "-0.03em",
            }}
          >
            Kitchen Inventory
          </h1>
          <p style={{ margin: "8px 0 0", fontSize: 14, color: "#94a3b8" }}>
            Track stock levels and manage purchases.
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          style={{
            padding: "10px 20px",
            borderRadius: 10,
            background: showForm
              ? "rgba(255,255,255,0.05)"
              : "linear-gradient(135deg, #10b981, #059669)",
            color: showForm ? "#f8fafc" : "#022c22",
            fontWeight: 700,
            fontSize: 14,
            border: showForm ? "1px solid rgba(255,255,255,0.1)" : "none",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 8,
            boxShadow: showForm ? "none" : "0 4px 15px rgba(16, 185, 129, 0.4)",
          }}
        >
          {showForm ? (
            "Cancel"
          ) : (
            <>
              <Plus size={16} /> Add Item
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
                Name
              </span>
              <input
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                style={inputStyle}
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
              >
                {CATS.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </label>
            <label style={{ display: "grid", gap: 6 }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: "#94a3b8" }}>
                Unit
              </span>
              <select
                value={form.unit}
                onChange={(e) => setForm({ ...form, unit: e.target.value })}
                style={inputStyle}
              >
                {["kg", "g", "l", "ml", "piece", "packet"].map((u) => (
                  <option key={u}>{u}</option>
                ))}
              </select>
            </label>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
              gap: 16,
              marginBottom: 20,
            }}
          >
            <label style={{ display: "grid", gap: 6 }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: "#94a3b8" }}>
                Qty
              </span>
              <input
                type="number"
                value={form.quantity}
                onChange={(e) =>
                  setForm({ ...form, quantity: Number(e.target.value) })
                }
                style={inputStyle}
              />
            </label>
            <label style={{ display: "grid", gap: 6 }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: "#94a3b8" }}>
                Min Level
              </span>
              <input
                type="number"
                value={form.minStockLevel}
                onChange={(e) =>
                  setForm({ ...form, minStockLevel: Number(e.target.value) })
                }
                style={inputStyle}
              />
            </label>
            <label style={{ display: "grid", gap: 6 }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: "#94a3b8" }}>
                Unit Cost (₹)
              </span>
              <input
                type="number"
                value={form.unitCost}
                onChange={(e) =>
                  setForm({ ...form, unitCost: Number(e.target.value) })
                }
                style={inputStyle}
              />
            </label>
          </div>
          <button
            type="submit"
            style={{
              padding: "12px 24px",
              borderRadius: 8,
              background: "linear-gradient(135deg, #10b981, #059669)",
              color: "#022c22",
              fontWeight: 800,
              fontSize: 14,
              border: "none",
              cursor: "pointer",
            }}
          >
            Save Item
          </button>
        </form>
      )}

      {isLoading ? (
        <p style={{ color: "#94a3b8" }}>Loading...</p>
      ) : items.length === 0 ? (
        <div style={{ ...glassCard, padding: 60, textAlign: "center" }}>
          <Box size={48} color="#334155" style={{ margin: "0 auto 16px" }} />
          <p style={{ color: "#94a3b8", fontSize: 15 }}>
            No inventory items yet.
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
                {["Item", "Category", "Stock", "Min Level", "Action"].map(
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
              {items.map((it) => {
                const isLow = it.quantity <= it.minStockLevel;
                return (
                  <tr
                    key={it._id}
                    style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}
                  >
                    <td
                      style={{
                        padding: "16px 20px",
                        fontWeight: 700,
                        color: "#f8fafc",
                      }}
                    >
                      {it.name}
                    </td>
                    <td
                      style={{
                        padding: "16px 20px",
                        fontSize: 13,
                        color: "#cbd5e1",
                        textTransform: "capitalize",
                      }}
                    >
                      {it.category.replace(/_/g, " ")}
                    </td>
                    <td style={{ padding: "16px 20px" }}>
                      <span
                        style={{
                          fontSize: 12,
                          fontWeight: 800,
                          background: isLow
                            ? "rgba(239, 68, 68, 0.15)"
                            : "rgba(16, 185, 129, 0.15)",
                          color: isLow ? "#f87171" : "#34d399",
                          border: `1px solid ${isLow ? "rgba(239,68,68,0.3)" : "rgba(16,185,129,0.3)"}`,
                          padding: "4px 10px",
                          borderRadius: 6,
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 4,
                        }}
                      >
                        {isLow && <AlertTriangle size={12} />} {it.quantity}{" "}
                        {it.unit}
                      </span>
                    </td>
                    <td
                      style={{
                        padding: "16px 20px",
                        fontSize: 13,
                        color: "#64748b",
                      }}
                    >
                      {it.minStockLevel} {it.unit}
                    </td>
                    <td style={{ padding: "16px 20px" }}>
                      <button
                        onClick={() => quickPurchase(it)}
                        style={{
                          padding: "6px 12px",
                          borderRadius: 6,
                          background: "rgba(56, 189, 248, 0.15)",
                          color: "#38bdf8",
                          border: "1px solid rgba(56, 189, 248, 0.3)",
                          cursor: "pointer",
                          fontSize: 12,
                          fontWeight: 700,
                          display: "flex",
                          alignItems: "center",
                          gap: 4,
                        }}
                      >
                        <ArrowUpRight size={12} /> Purchase
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
