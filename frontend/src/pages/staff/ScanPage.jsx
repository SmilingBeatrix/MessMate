import { useState } from "react";
import {
  useTodayMenuQuery,
  useSessionRegistrationsQuery,
  useManualCheckInMutation,
} from "../../app/api.js";
import { toast } from "sonner";
import {
  CheckCircle2,
  Users,
  ChevronLeft,
  Building2,
  QrCode,
} from "lucide-react";

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

export default function ScanPage() {
  const { data: todayData, isLoading: loadingSessions } = useTodayMenuQuery();
  const [selectedSession, setSelectedSession] = useState(null);
  const {
    data: regData,
    isLoading: loadingRegs,
    refetch,
  } = useSessionRegistrationsQuery(selectedSession?._id, {
    skip: !selectedSession,
  });
  const [markPresent, { isLoading: marking }] = useManualCheckInMutation();
  const [busy, setBusy] = useState(null);

  const sessions = todayData?.data?.sessions || [];
  const registrations = regData?.data?.registrations || [];

  const handleMark = async (reg) => {
    setBusy(reg._id);
    try {
      await markPresent({
        registrationId: reg._id,
        sessionId: selectedSession._id,
      }).unwrap();
      toast.success(reg.user?.name + " marked present");
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || "Failed to mark");
    } finally {
      setBusy(null);
    }
  };

  const realRegs = registrations.filter((r) => !r.isGroundFloor);
  const gfRegs = registrations.filter((r) => r.isGroundFloor);
  const counts = {
    registered: realRegs.filter((r) => r.status === "registered").length,
    attended: registrations.filter((r) => r.status === "attended").length,
    gf: gfRegs.filter((r) => r.status === "enrolled_gf").length,
  };

  if (!selectedSession) {
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
            <QrCode size={14} /> GATE VALIDATOR
          </div>
          <h1
            style={{
              margin: 0,
              fontSize: "2rem",
              fontWeight: 800,
              letterSpacing: "-0.03em",
            }}
          >
            Take Attendance
          </h1>
          <p style={{ margin: "8px 0 0", fontSize: 14, color: "#94a3b8" }}>
            Select a meal session and mark students present.
          </p>
        </header>

        {loadingSessions ? (
          <p style={{ color: "#94a3b8" }}>Loading...</p>
        ) : sessions.length === 0 ? (
          <div style={{ ...glassCard, padding: 60, textAlign: "center" }}>
            <p style={{ color: "#94a3b8", fontSize: 15 }}>
              No meals scheduled for today.
            </p>
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
              gap: 20,
            }}
          >
            {sessions.map((s) => (
              <button
                key={s._id}
                onClick={() => setSelectedSession(s)}
                style={{
                  ...glassCard,
                  padding: 24,
                  textAlign: "left",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  borderTop: "4px solid #10b981",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-4px)";
                  e.currentTarget.style.boxShadow =
                    "0 15px 40px rgba(16, 185, 129, 0.2)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = glassCard.boxShadow;
                }}
              >
                <h3
                  style={{
                    textTransform: "capitalize",
                    margin: "0 0 8px",
                    fontSize: 20,
                    fontWeight: 800,
                    color: "#f8fafc",
                  }}
                >
                  {s.category}
                </h3>
                <p
                  style={{ margin: "0 0 20px", fontSize: 13, color: "#94a3b8" }}
                >
                  {s.startTime} - {s.endTime}
                </p>
                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 8,
                    fontSize: 14,
                    color: "#10b981",
                    fontWeight: 700,
                  }}
                >
                  <Users size={16} /> Take attendance
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "32px 24px" }}>
      <header style={{ marginBottom: 32 }}>
        <button
          onClick={() => setSelectedSession(null)}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.1)",
            color: "#f8fafc",
            fontSize: 13,
            fontWeight: 600,
            cursor: "pointer",
            padding: "8px 16px",
            borderRadius: 8,
            marginBottom: 16,
            transition: "all 0.2s",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.background = "rgba(255,255,255,0.1)")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.background = "rgba(255,255,255,0.05)")
          }
        >
          <ChevronLeft size={16} /> Back to sessions
        </button>
        <h1
          style={{
            margin: 0,
            fontSize: "2rem",
            fontWeight: 800,
            letterSpacing: "-0.03em",
            textTransform: "capitalize",
          }}
        >
          {selectedSession.category} Attendance
        </h1>
        <p
          style={{
            margin: "8px 0 0",
            fontSize: 14,
            color: "#94a3b8",
            display: "flex",
            gap: 12,
            flexWrap: "wrap",
          }}
        >
          <span>
            {selectedSession.startTime} - {selectedSession.endTime}
          </span>
          <span style={{ color: "#cbd5e1" }}>•</span>
          <span>
            <strong style={{ color: "#f8fafc" }}>{counts.registered}</strong>{" "}
            registered
          </span>
          {counts.gf > 0 && (
            <>
              <span style={{ color: "#cbd5e1" }}>•</span>
              <span>
                <strong style={{ color: "#f8fafc" }}>{counts.gf}</strong> ground
                floor
              </span>
            </>
          )}
          <span style={{ color: "#cbd5e1" }}>•</span>
          <span>
            <strong style={{ color: "#34d399" }}>{counts.attended}</strong>{" "}
            attended
          </span>
        </p>
      </header>

      {loadingRegs ? (
        <p style={{ color: "#94a3b8" }}>Loading registrations...</p>
      ) : registrations.length === 0 ? (
        <div style={{ ...glassCard, padding: 60, textAlign: "center" }}>
          <p style={{ color: "#94a3b8", fontSize: 15 }}>
            No students registered for this meal.
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
                    "Student",
                    "ID",
                    "Hostel / Room",
                    "Plan",
                    "Status",
                    "Action",
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
                {registrations.map((r) => (
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
                        fontWeight: 700,
                        color: "#f8fafc",
                      }}
                    >
                      {r.user?.name || "-"}
                    </td>
                    <td
                      style={{
                        padding: "16px 20px",
                        fontSize: 13,
                        color: "#cbd5e1",
                        fontFamily: "monospace",
                      }}
                    >
                      {r.user?.studentId || "-"}
                    </td>
                    <td
                      style={{
                        padding: "16px 20px",
                        fontSize: 13,
                        color: "#94a3b8",
                      }}
                    >
                      {r.user?.hostel?.name || "-"}
                      {r.user?.roomNumber ? " / " + r.user.roomNumber : ""}
                    </td>
                    <td style={{ padding: "16px 20px" }}>
                      {r.isGroundFloor ? (
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
                          }}
                        >
                          <Building2 size={12} /> Ground Floor
                        </span>
                      ) : (
                        <span
                          style={{
                            fontSize: 11,
                            fontWeight: 800,
                            background: "rgba(255,255,255,0.05)",
                            color: "#cbd5e1",
                            border: "1px solid rgba(255,255,255,0.1)",
                            padding: "4px 10px",
                            borderRadius: 6,
                          }}
                        >
                          1st Floor
                        </span>
                      )}
                    </td>
                    <td style={{ padding: "16px 20px" }}>
                      <span
                        style={{
                          fontSize: 11,
                          fontWeight: 800,
                          textTransform: "uppercase",
                          background:
                            r.status === "attended"
                              ? "rgba(16, 185, 129, 0.15)"
                              : r.status === "enrolled_gf"
                                ? "rgba(16, 185, 129, 0.15)"
                                : "rgba(245, 158, 11, 0.15)",
                          color:
                            r.status === "attended" ||
                            r.status === "enrolled_gf"
                              ? "#34d399"
                              : "#fbbf24",
                          border: `1px solid ${r.status === "attended" || r.status === "enrolled_gf" ? "rgba(16,185,129,0.3)" : "rgba(245,158,11,0.3)"}`,
                          padding: "4px 10px",
                          borderRadius: 6,
                        }}
                      >
                        {r.status === "enrolled_gf" ? "Enrolled" : r.status}
                      </span>
                    </td>
                    <td style={{ padding: "16px 20px" }}>
                      {r.status === "registered" ||
                      r.status === "enrolled_gf" ? (
                        <button
                          disabled={busy === r._id}
                          onClick={() => handleMark(r)}
                          style={{
                            padding: "6px 12px",
                            borderRadius: 6,
                            background: "rgba(16, 185, 129, 0.15)",
                            color: "#34d399",
                            border: "1px solid rgba(16, 185, 129, 0.3)",
                            cursor: busy === r._id ? "not-allowed" : "pointer",
                            fontSize: 12,
                            fontWeight: 700,
                            display: "flex",
                            alignItems: "center",
                            gap: 4,
                            boxShadow: "0 0 10px rgba(16, 185, 129, 0.1)",
                          }}
                        >
                          <CheckCircle2 size={14} />{" "}
                          {busy === r._id ? "Marking..." : "Mark Present"}
                        </button>
                      ) : (
                        <span
                          style={{
                            fontSize: 12,
                            color: "#64748b",
                            fontWeight: 600,
                          }}
                        >
                          Done
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
    </div>
  );
}
