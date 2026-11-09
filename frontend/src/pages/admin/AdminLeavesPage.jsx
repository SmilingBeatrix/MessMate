import { useAllLeavesQuery, useDecideLeaveMutation } from "../../app/api.js";
import { toast } from "sonner";
import { CalendarDays, Check, X } from "lucide-react";

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

export default function AdminLeavesPage() {
  const { data, isLoading, refetch } = useAllLeavesQuery({});
  const [decide] = useDecideLeaveMutation();
  const leaves = data?.data?.leaves || [];

  const act = async (id, decision) => {
    try {
      await decide({
        id,
        decision,
        remarks: decision === "approve" ? "Approved" : "Rejected",
      }).unwrap();
      toast.success("Leave " + decision + "d");
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || "Failed");
    }
  };

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "32px 24px" }}>
      <header style={{ marginBottom: 32 }}>
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
          <CalendarDays size={14} /> ATTENDANCE TELEMETRY
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
          Review and decide student leaves.
        </p>
      </header>

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
                {["Student", "From", "To", "Meals", "Status", "Action"].map(
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
              {leaves.map((l) => (
                <tr
                  key={l._id}
                  style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}
                >
                  <td
                    style={{
                      padding: "16px 20px",
                      fontWeight: 700,
                      color: "#f8fafc",
                    }}
                  >
                    {l.user?.name || "-"}
                  </td>
                  <td
                    style={{
                      padding: "16px 20px",
                      fontSize: 13,
                      color: "#cbd5e1",
                    }}
                  >
                    {new Date(l.fromDate).toLocaleDateString()}
                  </td>
                  <td
                    style={{
                      padding: "16px 20px",
                      fontSize: 13,
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
                    <span
                      style={{
                        fontSize: 11,
                        fontWeight: 800,
                        background:
                          l.status === "approved"
                            ? "rgba(16, 185, 129, 0.15)"
                            : l.status === "rejected"
                              ? "rgba(239, 68, 68, 0.15)"
                              : "rgba(245, 158, 11, 0.15)",
                        color:
                          l.status === "approved"
                            ? "#34d399"
                            : l.status === "rejected"
                              ? "#f87171"
                              : "#fbbf24",
                        border: `1px solid ${l.status === "approved" ? "rgba(16,185,129,0.3)" : l.status === "rejected" ? "rgba(239,68,68,0.3)" : "rgba(245,158,11,0.3)"}`,
                        padding: "4px 10px",
                        borderRadius: 6,
                        textTransform: "uppercase",
                      }}
                    >
                      {l.status}
                    </span>
                  </td>
                  <td style={{ padding: "16px 20px" }}>
                    {l.status === "pending" ? (
                      <div style={{ display: "flex", gap: 8 }}>
                        <button
                          onClick={() => act(l._id, "approve")}
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
                          onClick={() => act(l._id, "reject")}
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
                        Processed
                      </span>
                    )}
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
