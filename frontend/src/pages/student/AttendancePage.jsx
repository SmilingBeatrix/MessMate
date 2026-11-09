import { useMemo } from "react";
import { useMyAttendanceQuery } from "../../app/api.js";
import { Calendar, CheckCircle2, Activity, Utensils } from "lucide-react";

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

export default function AttendancePage() {
  const { data, isLoading } = useMyAttendanceQuery();
  const records = data?.data?.attendance || [];

  const stats = useMemo(() => {
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const thisMonth = records.filter(
      (r) => new Date(r.attendedAt) >= monthStart,
    ).length;
    const totalMeals = records.length;
    const streak = (() => {
      let count = 0;
      const sorted = [...records].sort(
        (a, b) => new Date(b.attendedAt) - new Date(a.attendedAt),
      );
      for (const r of sorted) {
        const d = new Date(r.attendedAt);
        const diff = Math.floor((now - d) / (1000 * 60 * 60 * 24));
        if (diff <= count + 1) count++;
        else break;
      }
      return count;
    })();
    return { thisMonth, totalMeals, streak };
  }, [records]);

  return (
    <div style={{ maxWidth: 1000, margin: "0 auto", padding: "32px 24px" }}>
      <header style={{ marginBottom: 32 }}>
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
          <Activity size={14} /> ATTENDANCE LOG
        </div>
        <h1
          style={{
            margin: 0,
            fontSize: "2rem",
            fontWeight: 800,
            letterSpacing: "-0.03em",
          }}
        >
          My Attendance
        </h1>
        <p style={{ margin: "8px 0 0", fontSize: 14, color: "#94a3b8" }}>
          Every meal you have attended at the mess.
        </p>
      </header>

      <section
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: 16,
          marginBottom: 32,
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
              }}
            >
              Total Meals
            </span>
            <strong style={{ fontSize: 28, display: "block", marginTop: 8 }}>
              {stats.totalMeals}
            </strong>
          </div>
          <div
            style={{
              width: 42,
              height: 42,
              borderRadius: "12px",
              background: "rgba(16, 185, 129, 0.15)",
              display: "grid",
              placeItems: "center",
            }}
          >
            <Utensils size={20} color="#34d399" />
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
              }}
            >
              This Month
            </span>
            <strong style={{ fontSize: 28, display: "block", marginTop: 8 }}>
              {stats.thisMonth}
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
            }}
          >
            <Calendar size={20} color="#38bdf8" />
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
              }}
            >
              Active Streak
            </span>
            <strong style={{ fontSize: 28, display: "block", marginTop: 8 }}>
              {stats.streak}{" "}
              <span style={{ fontSize: 16, color: "#64748b" }}>days</span>
            </strong>
          </div>
          <div
            style={{
              width: 42,
              height: 42,
              borderRadius: "12px",
              background: "rgba(245, 158, 11, 0.15)",
              display: "grid",
              placeItems: "center",
            }}
          >
            <CheckCircle2 size={20} color="#fbbf24" />
          </div>
        </div>
      </section>

      {isLoading ? (
        <p style={{ color: "#94a3b8" }}>Loading...</p>
      ) : records.length === 0 ? (
        <div style={{ ...glassCard, padding: 60, textAlign: "center" }}>
          <CheckCircle2
            size={48}
            color="#334155"
            style={{ margin: "0 auto 16px" }}
          />
          <p style={{ color: "#94a3b8", fontSize: 15 }}>
            No attendance records yet. Register for a meal and check in at the
            counter.
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
                  {["Date", "Meal", "Time", "Method", "Status"].map((h, i) => (
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
                {records.map((r) => (
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
                        fontSize: 14,
                        color: "#cbd5e1",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                        }}
                      >
                        <Calendar size={14} color="#64748b" />
                        {new Date(r.attendedAt).toLocaleDateString("en-IN", {
                          weekday: "short",
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </div>
                    </td>
                    <td
                      style={{
                        padding: "16px 20px",
                        textTransform: "capitalize",
                        fontWeight: 700,
                        color: "#f8fafc",
                      }}
                    >
                      {r.session?.category || "-"}
                    </td>
                    <td
                      style={{
                        padding: "16px 20px",
                        fontSize: 13,
                        color: "#94a3b8",
                      }}
                    >
                      {new Date(r.attendedAt).toLocaleTimeString("en-IN", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
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
                          textTransform: "uppercase",
                        }}
                      >
                        {r.method}
                      </span>
                    </td>
                    <td style={{ padding: "16px 20px" }}>
                      <span
                        style={{
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
                        Present
                      </span>
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
