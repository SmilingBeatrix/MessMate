import { useState } from "react";
import {
  useAllPaymentsQuery,
  useAllRefundsQuery,
  useAllLeavesQuery,
  useDecideLeaveMutation,
} from "../../app/api.js";
import { toast } from "sonner";
import { Check, X, TrendingUp, IndianRupee } from "lucide-react";

const glassCard = {
  background:
    "linear-gradient(145deg, rgba(30, 41, 59, 0.4) 0%, rgba(15, 23, 42, 0.6) 100%)",
  backdropFilter: "blur(16px)",
  WebkitBackdropFilter: "blur(16px)",
  border: "1px solid rgba(255, 255, 255, 0.08)",
  borderRadius: "16px",
  boxShadow: "0 10px 40px -10px rgba(0, 0, 0, 0.5)",
};

export default function TransactionsPage() {
  const [tab, setTab] = useState("payments");
  const [refundFilter, setRefundFilter] = useState("pending");
  const [leaveFilter, setLeaveFilter] = useState("pending");

  const { data: paymentsData, isLoading: loadingP } = useAllPaymentsQuery({});
  const {
    data: refundsData,
    isLoading: loadingR,
    refetch: refetchR,
  } = useAllRefundsQuery({ status: refundFilter });
  const {
    data: leavesData,
    isLoading: loadingL,
    refetch: refetchL,
  } = useAllLeavesQuery({ status: leaveFilter });
  const [decide] = useDecideLeaveMutation();

  const payments = paymentsData?.data?.payments || [];
  const refunds = refundsData?.data?.leaves || [];
  const leaves = leavesData?.data?.leaves || [];
  const totalReceived = payments
    .filter((p) => p.status === "success")
    .reduce((s, p) => s + p.amount, 0);

  const decideItem = async (id, decision, kind) => {
    try {
      await decide({
        id,
        decision,
        remarks: decision === "approve" ? "Approved" : "Rejected",
      }).unwrap();
      toast.success(kind + " " + decision + "d");
      if (kind === "Refund") refetchR();
      else refetchL();
    } catch (err) {
      toast.error(err?.data?.message || "Failed");
    }
  };

  const renderTable = (headers, rows) => (
    <div
      style={{ ...glassCard, padding: 0, overflow: "hidden", marginTop: 20 }}
    >
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
              {headers.map((h, i) => (
                <th
                  key={i}
                  style={{
                    padding: "16px 20px",
                    fontSize: 13,
                    fontWeight: 700,
                    color: "#94a3b8",
                    whiteSpace: "nowrap",
                  }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>{rows}</tbody>
        </table>
      </div>
    </div>
  );

  const emptyState = (msg) => (
    <div
      style={{ ...glassCard, textAlign: "center", padding: 60, marginTop: 20 }}
    >
      <TrendingUp size={40} color="#334155" style={{ margin: "0 auto 16px" }} />
      <p style={{ color: "#94a3b8", fontSize: 15 }}>{msg}</p>
    </div>
  );

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "32px 24px" }}>
      <header style={{ marginBottom: 32 }}>
        <h1
          style={{
            margin: 0,
            fontSize: "2rem",
            fontWeight: 800,
            letterSpacing: "-0.03em",
          }}
        >
          Transactions
        </h1>
        <p style={{ margin: "8px 0 0", fontSize: 14, color: "#94a3b8" }}>
          Payments from students, refund requests, and staff leaves
        </p>
      </header>

      <div
        style={{
          ...glassCard,
          padding: 24,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 32,
        }}
      >
        <div>
          <span
            style={{
              fontSize: 13,
              fontWeight: 700,
              color: "#94a3b8",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
            }}
          >
            Total Revenue
          </span>
          <strong
            style={{
              fontSize: 32,
              display: "flex",
              alignItems: "center",
              marginTop: 8,
              color: "#10b981",
            }}
          >
            <IndianRupee size={24} /> {totalReceived.toLocaleString("en-IN")}
          </strong>
          <small style={{ fontSize: 13, color: "#64748b" }}>
            {payments.length} payments processed
          </small>
        </div>
        <div
          style={{
            width: 60,
            height: 60,
            borderRadius: "16px",
            background: "rgba(16, 185, 129, 0.15)",
            display: "grid",
            placeItems: "center",
            boxShadow: "0 0 20px rgba(16, 185, 129, 0.2)",
          }}
        >
          <TrendingUp size={28} color="#34d399" />
        </div>
      </div>

      <div style={{ display: "flex", gap: 10, marginBottom: 24 }}>
        {["payments", "refunds", "leaves"].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            style={{
              padding: "10px 24px",
              borderRadius: 10,
              fontSize: 14,
              fontWeight: 700,
              cursor: "pointer",
              border: "1px solid",
              background:
                tab === t
                  ? "rgba(16, 185, 129, 0.15)"
                  : "rgba(255,255,255,0.03)",
              borderColor:
                tab === t
                  ? "rgba(16, 185, 129, 0.4)"
                  : "rgba(255,255,255,0.08)",
              color: tab === t ? "#34d399" : "#94a3b8",
              transition: "all 0.2s",
              textTransform: "capitalize",
            }}
          >
            {t === "leaves" ? "Staff Leaves" : t}
          </button>
        ))}
      </div>

      {tab === "payments" &&
        (loadingP ? (
          <p style={{ color: "#94a3b8" }}>Loading...</p>
        ) : payments.length === 0 ? (
          emptyState("No payments yet. Students pay from their Bills page.")
        ) : (
          renderTable(
            ["Date", "Student", "Amount", "Method", "Status"],
            payments.map((p) => (
              <tr
                key={p._id}
                style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}
              >
                <td
                  style={{
                    padding: "16px 20px",
                    fontSize: 13,
                    color: "#cbd5e1",
                  }}
                >
                  {new Date(p.paidAt || p.createdAt).toLocaleString("en-IN", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </td>
                <td style={{ padding: "16px 20px" }}>
                  <div style={{ fontWeight: 700, color: "#f8fafc" }}>
                    {p.user?.name || "-"}
                  </div>
                  <div style={{ fontSize: 12, color: "#64748b" }}>
                    {p.user?.studentId || p.user?.email}
                  </div>
                </td>
                <td
                  style={{
                    padding: "16px 20px",
                    fontWeight: 800,
                    color: "#10b981",
                  }}
                >
                  Rs. {p.amount}
                </td>
                <td style={{ padding: "16px 20px" }}>
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      background: "rgba(255,255,255,0.05)",
                      padding: "4px 8px",
                      borderRadius: 6,
                    }}
                  >
                    {p.method}
                  </span>
                </td>
                <td style={{ padding: "16px 20px" }}>
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 800,
                      background:
                        p.status === "success"
                          ? "rgba(16, 185, 129, 0.15)"
                          : "rgba(245, 158, 11, 0.15)",
                      color: p.status === "success" ? "#34d399" : "#fbbf24",
                      padding: "4px 10px",
                      borderRadius: 6,
                    }}
                  >
                    {p.status.toUpperCase()}
                  </span>
                </td>
              </tr>
            )),
          )
        ))}

      {tab === "refunds" && (
        <>
          <div style={{ display: "flex", gap: 10 }}>
            {["pending", "approved", "rejected"].map((s) => (
              <button
                key={s}
                onClick={() => setRefundFilter(s)}
                style={{
                  padding: "6px 16px",
                  borderRadius: 8,
                  fontSize: 12,
                  fontWeight: 700,
                  cursor: "pointer",
                  border: "1px solid",
                  background:
                    refundFilter === s
                      ? "rgba(255,255,255,0.1)"
                      : "transparent",
                  borderColor:
                    refundFilter === s
                      ? "rgba(255,255,255,0.2)"
                      : "rgba(255,255,255,0.05)",
                  color: refundFilter === s ? "#f8fafc" : "#64748b",
                }}
              >
                {s.toUpperCase()}
              </button>
            ))}
          </div>
          {loadingR ? (
            <p style={{ color: "#94a3b8", marginTop: 20 }}>Loading...</p>
          ) : refunds.length === 0 ? (
            emptyState(`No ${refundFilter} refund requests.`)
          ) : (
            renderTable(
              [
                "Student",
                "Dates",
                "Meals",
                "Amount",
                "Reason",
                "Status",
                "Action",
              ],
              refunds.map((r) => (
                <tr
                  key={r._id}
                  style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}
                >
                  <td style={{ padding: "16px 20px" }}>
                    <div style={{ fontWeight: 700, color: "#f8fafc" }}>
                      {r.user?.name || "-"}
                    </div>
                    <div style={{ fontSize: 12, color: "#64748b" }}>
                      {r.user?.studentId}
                    </div>
                  </td>
                  <td
                    style={{
                      padding: "16px 20px",
                      fontSize: 13,
                      color: "#cbd5e1",
                    }}
                  >
                    {new Date(r.fromDate).toLocaleDateString()}
                    {new Date(r.fromDate).toDateString() !==
                      new Date(r.toDate).toDateString() && (
                      <> to {new Date(r.toDate).toLocaleDateString()}</>
                    )}
                  </td>
                  <td
                    style={{
                      padding: "16px 20px",
                      fontSize: 13,
                      color: "#cbd5e1",
                    }}
                  >
                    {r.affectedCategories?.join(", ")}
                  </td>
                  <td
                    style={{
                      padding: "16px 20px",
                      fontWeight: 800,
                      color: "#10b981",
                    }}
                  >
                    Rs. {r.billingImpact || 0}
                  </td>
                  <td
                    style={{
                      padding: "16px 20px",
                      fontSize: 13,
                      color: "#94a3b8",
                      maxWidth: 200,
                    }}
                  >
                    {r.reason}
                  </td>
                  <td style={{ padding: "16px 20px" }}>
                    <span
                      style={{
                        fontSize: 11,
                        fontWeight: 800,
                        background:
                          r.status === "approved"
                            ? "rgba(16, 185, 129, 0.15)"
                            : r.status === "rejected"
                              ? "rgba(239, 68, 68, 0.15)"
                              : "rgba(245, 158, 11, 0.15)",
                        color:
                          r.status === "approved"
                            ? "#34d399"
                            : r.status === "rejected"
                              ? "#f87171"
                              : "#fbbf24",
                        padding: "4px 10px",
                        borderRadius: 6,
                      }}
                    >
                      {r.status.toUpperCase()}
                    </span>
                  </td>
                  <td style={{ padding: "16px 20px" }}>
                    {r.status === "pending" && (
                      <div style={{ display: "flex", gap: 8 }}>
                        <button
                          onClick={() => decideItem(r._id, "approve", "Refund")}
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
                          onClick={() => decideItem(r._id, "reject", "Refund")}
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
                    )}
                  </td>
                </tr>
              )),
            )
          )}
        </>
      )}

      {tab === "leaves" && (
        <>
          <div style={{ display: "flex", gap: 10 }}>
            {["pending", "approved", "rejected"].map((s) => (
              <button
                key={s}
                onClick={() => setLeaveFilter(s)}
                style={{
                  padding: "6px 16px",
                  borderRadius: 8,
                  fontSize: 12,
                  fontWeight: 700,
                  cursor: "pointer",
                  border: "1px solid",
                  background:
                    leaveFilter === s ? "rgba(255,255,255,0.1)" : "transparent",
                  borderColor:
                    leaveFilter === s
                      ? "rgba(255,255,255,0.2)"
                      : "rgba(255,255,255,0.05)",
                  color: leaveFilter === s ? "#f8fafc" : "#64748b",
                }}
              >
                {s.toUpperCase()}
              </button>
            ))}
          </div>
          {loadingL ? (
            <p style={{ color: "#94a3b8", marginTop: 20 }}>Loading...</p>
          ) : leaves.length === 0 ? (
            emptyState(`No ${leaveFilter} staff leaves.`)
          ) : (
            renderTable(
              ["Staff", "Dates", "Reason", "Status", "Action"],
              leaves.map((l) => (
                <tr
                  key={l._id}
                  style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}
                >
                  <td style={{ padding: "16px 20px" }}>
                    <div style={{ fontWeight: 700, color: "#f8fafc" }}>
                      {l.user?.name || "-"}
                    </div>
                    <div style={{ fontSize: 12, color: "#64748b" }}>
                      {l.user?.email}
                    </div>
                  </td>
                  <td
                    style={{
                      padding: "16px 20px",
                      fontSize: 13,
                      color: "#cbd5e1",
                    }}
                  >
                    {new Date(l.fromDate).toLocaleDateString()}
                    {new Date(l.fromDate).toDateString() !==
                      new Date(l.toDate).toDateString() && (
                      <> to {new Date(l.toDate).toLocaleDateString()}</>
                    )}
                  </td>
                  <td
                    style={{
                      padding: "16px 20px",
                      fontSize: 13,
                      color: "#94a3b8",
                      maxWidth: 250,
                    }}
                  >
                    {l.reason}
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
                        padding: "4px 10px",
                        borderRadius: 6,
                      }}
                    >
                      {l.status.toUpperCase()}
                    </span>
                  </td>
                  <td style={{ padding: "16px 20px" }}>
                    {l.status === "pending" && (
                      <div style={{ display: "flex", gap: 8 }}>
                        <button
                          onClick={() => decideItem(l._id, "approve", "Leave")}
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
                          onClick={() => decideItem(l._id, "reject", "Leave")}
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
                    )}
                  </td>
                </tr>
              )),
            )
          )}
        </>
      )}
    </div>
  );
}
