import {
  useAllComplaintsQuery,
  useUpdateComplaintStatusMutation,
} from "../../app/api.js";
import { toast } from "sonner";
import { MessageSquare, CheckCircle, Clock } from "lucide-react";

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

export default function AdminComplaintsPage() {
  const { data, isLoading, refetch } = useAllComplaintsQuery({});
  const [update] = useUpdateComplaintStatusMutation();
  const complaints = data?.data?.complaints || [];

  const change = async (id, status) => {
    try {
      await update({ id, status }).unwrap();
      toast.success("Updated");
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || "Failed");
    }
  };

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "32px 24px" }}>
      <header style={{ marginBottom: 32 }}>
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
          <MessageSquare size={14} /> DISPUTE RESOLUTION
        </div>
        <h1
          style={{
            margin: 0,
            fontSize: "2rem",
            fontWeight: 800,
            letterSpacing: "-0.03em",
          }}
        >
          Complaints
        </h1>
        <p style={{ margin: "8px 0 0", fontSize: 14, color: "#94a3b8" }}>
          Manage and resolve student complaints.
        </p>
      </header>

      {isLoading ? (
        <p style={{ color: "#94a3b8" }}>Loading...</p>
      ) : complaints.length === 0 ? (
        <div style={{ ...glassCard, textAlign: "center", padding: 60 }}>
          <MessageSquare
            size={48}
            color="#334155"
            style={{ margin: "0 auto 16px" }}
          />
          <p style={{ color: "#94a3b8", fontSize: 15 }}>
            No complaints yet. All clear!
          </p>
        </div>
      ) : (
        <div style={{ display: "grid", gap: 16 }}>
          {complaints.map((c) => {
            const isResolved = c.status === "resolved";
            return (
              <div
                key={c._id}
                style={{
                  ...glassCard,
                  borderLeft: isResolved
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
                      }}
                    >
                      <span style={{ color: "#cbd5e1", fontWeight: 600 }}>
                        {c.user?.name}
                      </span>{" "}
                      • {c.category?.replace(/_/g, " ")} • Priority:{" "}
                      <span style={{ textTransform: "capitalize" }}>
                        {c.priority}
                      </span>
                    </p>
                  </div>
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 800,
                      background: isResolved
                        ? "rgba(16, 185, 129, 0.15)"
                        : "rgba(245, 158, 11, 0.15)",
                      color: isResolved ? "#34d399" : "#fbbf24",
                      border: `1px solid ${isResolved ? "rgba(16,185,129,0.3)" : "rgba(245,158,11,0.3)"}`,
                      padding: "4px 10px",
                      borderRadius: 6,
                      textTransform: "uppercase",
                    }}
                  >
                    {c.status.replace(/_/g, " ")}
                  </span>
                </div>
                <p
                  style={{
                    margin: "0 0 20px",
                    fontSize: 14,
                    color: "#cbd5e1",
                    lineHeight: 1.6,
                  }}
                >
                  {c.description}
                </p>

                {!isResolved && (
                  <div
                    style={{
                      display: "flex",
                      gap: 12,
                      borderTop: "1px solid rgba(255,255,255,0.06)",
                      paddingTop: 16,
                    }}
                  >
                    <button
                      onClick={() => change(c._id, "in_progress")}
                      style={{
                        padding: "8px 16px",
                        borderRadius: 8,
                        background: "rgba(56, 189, 248, 0.15)",
                        color: "#38bdf8",
                        border: "1px solid rgba(56, 189, 248, 0.3)",
                        cursor: "pointer",
                        fontSize: 13,
                        fontWeight: 700,
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                      }}
                    >
                      <Clock size={14} /> Mark In Progress
                    </button>
                    <button
                      onClick={() => change(c._id, "resolved")}
                      style={{
                        padding: "8px 16px",
                        borderRadius: 8,
                        background: "rgba(16, 185, 129, 0.15)",
                        color: "#34d399",
                        border: "1px solid rgba(16, 185, 129, 0.3)",
                        cursor: "pointer",
                        fontSize: 13,
                        fontWeight: 700,
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                      }}
                    >
                      <CheckCircle size={14} /> Resolve Issue
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
