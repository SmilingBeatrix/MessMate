import { useState } from "react";
import {
  useAllInventoryRequestsQuery,
  useDecideInventoryRequestMutation,
} from "../../app/api.js";
import { toast } from "sonner";
import { Check, X, Package, AlertTriangle } from "lucide-react";

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

export default function InventoryRequestsPage() {
  const [filter, setFilter] = useState("pending");
  const { data, isLoading, refetch } = useAllInventoryRequestsQuery({
    status: filter,
  });
  const [decide] = useDecideInventoryRequestMutation();
  const [rejecting, setRejecting] = useState(null);
  const [reason, setReason] = useState("");

  const requests = data?.data?.requests || [];

  const approve = async (r) => {
    const unitCostStr = prompt(
      "Unit cost in Rs. (leave blank to use estimate):",
      r.estimatedCost && r.quantity
        ? (r.estimatedCost / r.quantity).toFixed(2)
        : "",
    );
    const unitCost = unitCostStr ? Number(unitCostStr) : undefined;
    try {
      await decide({ id: r._id, decision: "approve", unitCost }).unwrap();
      toast.success("Approved - stock added");
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || "Failed");
    }
  };

  const reject = async (r, reason) => {
    try {
      await decide({
        id: r._id,
        decision: "reject",
        rejectionReason: reason,
      }).unwrap();
      toast.success("Rejected");
      setRejecting(null);
      setReason("");
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || "Failed");
    }
  };

  const filters = [
    { value: "pending", label: "Pending" },
    { value: "fulfilled", label: "Approved" },
    { value: "rejected", label: "Rejected" },
  ];

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "32px 24px" }}>
      <header style={{ marginBottom: 32 }}>
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
          <Package size={14} /> SUPPLY CHAIN
        </div>
        <h1
          style={{
            margin: 0,
            fontSize: "2rem",
            fontWeight: 800,
            letterSpacing: "-0.03em",
          }}
        >
          Inventory Requests
        </h1>
        <p style={{ margin: "8px 0 0", fontSize: 14, color: "#94a3b8" }}>
          Approve or reject stock requests from kitchen staff.
        </p>
      </header>

      <div style={{ display: "flex", gap: 10, marginBottom: 24 }}>
        {filters.map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            style={{
              padding: "8px 20px",
              borderRadius: 10,
              fontSize: 14,
              fontWeight: 700,
              cursor: "pointer",
              border: "1px solid",
              background:
                filter === f.value
                  ? "rgba(56, 189, 248, 0.15)"
                  : "rgba(255,255,255,0.03)",
              borderColor:
                filter === f.value
                  ? "rgba(56, 189, 248, 0.4)"
                  : "rgba(255,255,255,0.08)",
              color: filter === f.value ? "#7dd3fc" : "#94a3b8",
              transition: "all 0.2s",
            }}
          >
            {f.label}
          </button>
        ))}
      </div>

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
            No {filter} requests found.
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
                    "Staff",
                    "Item",
                    "Qty",
                    "Urgency",
                    "Note",
                    "Status",
                    "Actions",
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
                    style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}
                  >
                    <td style={{ padding: "16px 20px" }}>
                      <div style={{ fontWeight: 700, color: "#f8fafc" }}>
                        {r.requestedBy?.name || "Staff"}
                      </div>
                      <div style={{ fontSize: 12, color: "#64748b" }}>
                        {r.requestedBy?.email}
                      </div>
                    </td>
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
                    <td
                      style={{
                        padding: "16px 20px",
                        fontSize: 13,
                        color: "#94a3b8",
                        maxWidth: 200,
                      }}
                    >
                      {r.note || "-"}
                    </td>
                    <td style={{ padding: "16px 20px" }}>
                      <span
                        style={{
                          fontSize: 11,
                          fontWeight: 800,
                          background:
                            r.status === "fulfilled"
                              ? "rgba(16, 185, 129, 0.15)"
                              : r.status === "rejected"
                                ? "rgba(239, 68, 68, 0.15)"
                                : "rgba(245, 158, 11, 0.15)",
                          color:
                            r.status === "fulfilled"
                              ? "#34d399"
                              : r.status === "rejected"
                                ? "#f87171"
                                : "#fbbf24",
                          border: `1px solid ${r.status === "fulfilled" ? "rgba(16,185,129,0.3)" : r.status === "rejected" ? "rgba(239,68,68,0.3)" : "rgba(245,158,11,0.3)"}`,
                          padding: "4px 10px",
                          borderRadius: 6,
                          textTransform: "uppercase",
                        }}
                      >
                        {r.status}
                      </span>
                    </td>
                    <td style={{ padding: "16px 20px" }}>
                      {r.status === "pending" ? (
                        <div style={{ display: "flex", gap: 8 }}>
                          <button
                            onClick={() => approve(r)}
                            style={{
                              padding: "6px 12px",
                              borderRadius: 6,
                              background: "rgba(16, 185, 129, 0.15)",
                              color: "#34d399",
                              border: "1px solid rgba(16, 185, 129, 0.3)",
                              cursor: "pointer",
                              fontSize: 12,
                              fontWeight: 700,
                              display: "flex",
                              alignItems: "center",
                              gap: 4,
                            }}
                          >
                            <Check size={12} /> Approve
                          </button>
                          <button
                            onClick={() => setRejecting(r)}
                            style={{
                              padding: "6px 12px",
                              borderRadius: 6,
                              background: "rgba(239, 68, 68, 0.15)",
                              color: "#f87171",
                              border: "1px solid rgba(239, 68, 68, 0.3)",
                              cursor: "pointer",
                              fontSize: 12,
                              fontWeight: 700,
                              display: "flex",
                              alignItems: "center",
                              gap: 4,
                            }}
                          >
                            <X size={12} /> Reject
                          </button>
                        </div>
                      ) : (
                        <span style={{ fontSize: 12, color: "#64748b" }}>
                          {r.status === "fulfilled" && r.approvedBy
                            ? "by " + r.approvedBy.name
                            : r.rejectionReason || "-"}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Premium Reject Modal */}
      {rejecting && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0,0,0,0.7)",
            backdropFilter: "blur(8px)",
            display: "grid",
            placeItems: "center",
            zIndex: 100,
          }}
          onClick={() => setRejecting(null)}
        >
          <div
            style={{ ...glassCard, width: "90%", maxWidth: 460, padding: 32 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 20,
              }}
            >
              <h2 style={{ margin: 0, fontSize: 20, fontWeight: 800 }}>
                Reject Request
              </h2>
              <button
                onClick={() => setRejecting(null)}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "#94a3b8",
                  cursor: "pointer",
                }}
              >
                <X size={20} />
              </button>
            </div>
            <p style={{ margin: "0 0 16px", color: "#cbd5e1", fontSize: 14 }}>
              {rejecting.itemName} - {rejecting.quantity} {rejecting.unit}
            </p>
            <label style={{ display: "grid", gap: 8, marginBottom: 24 }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: "#94a3b8" }}>
                Reason (optional)
              </span>
              <input
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="e.g. Already in stock"
                style={inputStyle}
              />
            </label>
            <button
              onClick={() => reject(rejecting, reason)}
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: 10,
                background: "linear-gradient(135deg, #ef4444, #b91c1c)",
                color: "#fff",
                fontWeight: 800,
                fontSize: 14,
                border: "none",
                cursor: "pointer",
                boxShadow: "0 4px 15px rgba(239, 68, 68, 0.4)",
              }}
            >
              Confirm Rejection
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
