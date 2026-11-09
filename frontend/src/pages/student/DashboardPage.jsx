import { useState } from "react";
import { Link } from "react-router-dom";
import {
  useMeQuery,
  useTodayMenuQuery,
  useListAnnouncementsQuery,
  useUpcomingMenusQuery,
  useRunningBillQuery,
  useGroundFloorInfoQuery,
} from "../../app/api.js";
import {
  Megaphone,
  Clock,
  Calendar,
  IndianRupee,
  Sparkles,
  Receipt,
  UtensilsCrossed,
  Bell,
  ChevronRight,
  ShieldCheck,
  Activity,
} from "lucide-react";

const SESSION_ACCENTS = {
  breakfast: {
    border: "#f59e0b",
    badgeBg: "rgba(245, 158, 11, 0.15)",
    badgeColor: "#fbbf24",
    tag: "MORNING",
  },
  lunch: {
    border: "#10b981",
    badgeBg: "rgba(16, 185, 129, 0.15)",
    badgeColor: "#34d399",
    tag: "MIDDAY",
  },
  snacks: {
    border: "#38bdf8",
    badgeBg: "rgba(56, 189, 248, 0.15)",
    badgeColor: "#7dd3fc",
    tag: "EVENING",
  },
  dinner: {
    border: "#8b5cf6",
    badgeBg: "rgba(139, 92, 246, 0.15)",
    badgeColor: "#c4b5fd",
    tag: "NIGHT",
  },
};

// Premium Card Style: Gradient background + inner glow
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

// Helper component for stat icons
const GlowIcon = ({ icon: Icon, color, bg }) => (
  <div
    style={{
      width: 42,
      height: 42,
      borderRadius: "12px",
      display: "grid",
      placeItems: "center",
      background: bg,
      color: color,
      boxShadow: `0 0 20px ${bg}`,
    }}
  >
    <Icon size={20} color={color} />
  </div>
);

export default function DashboardPage() {
  const [upcomingPage, setUpcomingPage] = useState(1);

  const { data: me } = useMeQuery();
  const { data: today, isLoading } = useTodayMenuQuery();
  const { data: annData } = useListAnnouncementsQuery();
  const { data: upcomingData } = useUpcomingMenusQuery({
    page: upcomingPage,
    limit: 3,
    days: 30,
  });

  const user = me?.data?.user;
  const isStudent = user?.role === "student";
  const isGroundFloor = user?.messSystem === "ground_floor";
  const isAdmin = user?.role === "admin";

  const { data: runningData } = useRunningBillQuery(undefined, {
    skip: !isStudent || isGroundFloor,
  });
  const { data: gfData } = useGroundFloorInfoQuery(undefined, {
    skip: !isGroundFloor,
  });

  const ctx = user?.context || {};
  const sessions = today?.data?.sessions || [];
  const announcements = (annData?.data?.announcements || []).slice(0, 3);
  const upcoming = upcomingData?.data?.menus || [];
  const runningBill = runningData?.data?.bill;
  const groundFloor = gfData?.data;

  const firstName = user?.name?.split(" ")[0] || "Member";

  return (
    <div style={{ maxWidth: 1300, margin: "0 auto", padding: "32px 24px" }}>
      {/* Header Section */}
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          flexWrap: "wrap",
          gap: 20,
          marginBottom: 32,
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
              boxShadow: "0 0 15px rgba(16, 185, 129, 0.2)",
            }}
          >
            <Sparkles size={14} /> SYSTEM ONLINE
          </div>
          <h1
            style={{
              margin: 0,
              fontSize: "2.4rem",
              fontWeight: 800,
              letterSpacing: "-0.03em",
              textShadow: "0 2px 10px rgba(0,0,0,0.5)",
            }}
          >
            Welcome back,{" "}
            <span
              style={{
                background: "-webkit-linear-gradient(45deg, #10b981, #34d399)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              {firstName}
            </span>
          </h1>
          <p
            style={{
              margin: "10px 0 0",
              fontSize: 14,
              color: "#94a3b8",
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <Calendar size={15} />
            {new Date().toLocaleDateString("en-IN", {
              weekday: "long",
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
            {user?.hostel?.name && (
              <span style={{ borderLeft: "1px solid #334155", paddingLeft: 8 }}>
                {user.hostel.name} (Room {user.roomNumber || "N/A"})
              </span>
            )}
          </p>
        </div>

        {isStudent && (
          <div style={{ display: "flex", gap: 12 }}>
            <Link
              to="/menu"
              style={{
                padding: "12px 24px",
                borderRadius: 12,
                background: "linear-gradient(135deg, #10b981, #059669)",
                color: "#022c22",
                fontWeight: 700,
                fontSize: 14,
                textDecoration: "none",
                display: "flex",
                alignItems: "center",
                gap: 8,
                boxShadow: "0 8px 25px rgba(16, 185, 129, 0.4)",
              }}
            >
              Open Meal Radar <ChevronRight size={16} />
            </Link>
          </div>
        )}
      </header>

      {/* Admin Stats */}
      {isAdmin && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: 20,
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
                  letterSpacing: "0.05em",
                }}
              >
                System Status
              </span>
              <strong style={{ fontSize: 26, display: "block", marginTop: 8 }}>
                Operational
              </strong>
            </div>
            <GlowIcon
              icon={ShieldCheck}
              color="#34d399"
              bg="rgba(16, 185, 129, 0.15)"
            />
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
                Broadcasts Sent
              </span>
              <strong style={{ fontSize: 26, display: "block", marginTop: 8 }}>
                {announcements.length}
              </strong>
            </div>
            <GlowIcon
              icon={Megaphone}
              color="#7dd3fc"
              bg="rgba(56, 189, 248, 0.15)"
            />
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
                Unread Alerts
              </span>
              <strong style={{ fontSize: 26, display: "block", marginTop: 8 }}>
                {ctx.unreadNotifications ?? 0}
              </strong>
            </div>
            <GlowIcon
              icon={Bell}
              color="#c4b5fd"
              bg="rgba(139, 92, 246, 0.15)"
            />
          </div>
        </div>
      )}

      {/* Student Stats */}
      {isStudent && !isGroundFloor && (
        <section
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: 20,
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
                  letterSpacing: "0.05em",
                }}
              >
                Live Ledger
              </span>
              <strong style={{ fontSize: 26, display: "block", marginTop: 8 }}>
                ₹{runningBill?.total ?? 0}
              </strong>
            </div>
            <GlowIcon
              icon={Activity}
              color="#34d399"
              bg="rgba(16, 185, 129, 0.15)"
            />
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
                Check-Ins
              </span>
              <strong style={{ fontSize: 26, display: "block", marginTop: 8 }}>
                {ctx.attendanceThisMonth ?? 0}
              </strong>
            </div>
            <GlowIcon
              icon={UtensilsCrossed}
              color="#7dd3fc"
              bg="rgba(56, 189, 248, 0.15)"
            />
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
                Last Bill
              </span>
              <strong style={{ fontSize: 26, display: "block", marginTop: 8 }}>
                ₹{ctx.currentBill?.total ?? 0}
              </strong>
            </div>
            <GlowIcon
              icon={Receipt}
              color="#c4b5fd"
              bg="rgba(139, 92, 246, 0.15)"
            />
          </div>
        </section>
      )}

      {/* Today's Sessions */}
      {!isGroundFloor && (
        <section style={{ marginBottom: 40 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 20,
            }}
          >
            <h2
              style={{
                margin: 0,
                fontSize: 20,
                fontWeight: 800,
                display: "flex",
                alignItems: "center",
                gap: 10,
              }}
            >
              <UtensilsCrossed size={22} color="#10b981" />
              {isStudent ? "Today's Meal Matrix" : "Published Daily Sessions"}
            </h2>
            <Link
              to="/menu"
              style={{
                fontSize: 13,
                fontWeight: 600,
                color: "#10b981",
                textDecoration: "none",
                display: "flex",
                alignItems: "center",
                gap: 4,
              }}
            >
              Full Schedule <ChevronRight size={14} />
            </Link>
          </div>

          {isLoading ? (
            <div style={{ ...glassCard, padding: 40, textAlign: "center" }}>
              <p style={{ color: "#94a3b8" }}>Syncing telemetry...</p>
            </div>
          ) : sessions.length === 0 ? (
            /* PREMIUM RADAR EMPTY STATE */
            <div
              style={{
                ...glassCard,
                padding: "60px 20px",
                textAlign: "center",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  width: 200,
                  height: 200,
                  background:
                    "radial-gradient(circle, rgba(16,185,129,0.15) 0%, transparent 70%)",
                  borderRadius: "50%",
                  animation: "pulse 3s infinite",
                }}
              />
              <div
                style={{
                  width: 72,
                  height: 72,
                  borderRadius: "50%",
                  background: "rgba(16, 185, 129, 0.1)",
                  border: "2px solid rgba(16, 185, 129, 0.3)",
                  display: "grid",
                  placeItems: "center",
                  marginBottom: 24,
                  position: "relative",
                  zIndex: 1,
                }}
              >
                <UtensilsCrossed size={32} color="#10b981" />
              </div>
              <h3
                style={{
                  margin: "0 0 8px",
                  fontSize: 22,
                  fontWeight: 800,
                  position: "relative",
                  zIndex: 1,
                }}
              >
                Radar Clear
              </h3>
              <p
                style={{
                  margin: "0 0 24px",
                  fontSize: 15,
                  color: "#cbd5e1",
                  maxWidth: 400,
                  position: "relative",
                  zIndex: 1,
                }}
              >
                The kitchen has not broadcasted the meal schedule for today yet.
                Check back soon or view the upcoming weekly schedule.
              </p>
              <Link
                to={isAdmin ? "/admin/menus" : "/menu"}
                style={{
                  padding: "12px 28px",
                  borderRadius: 10,
                  background: "linear-gradient(135deg, #10b981, #059669)",
                  color: "#022c22",
                  fontWeight: 800,
                  textDecoration: "none",
                  position: "relative",
                  zIndex: 1,
                  boxShadow: "0 4px 15px rgba(16, 185, 129, 0.4)",
                }}
              >
                {isAdmin ? "Create Schedule" : "View Upcoming Menu"}
              </Link>
            </div>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                gap: 20,
              }}
            >
              {sessions.map((s) => {
                const styleMeta =
                  SESSION_ACCENTS[s.category] || SESSION_ACCENTS.lunch;
                return (
                  <div
                    key={s._id}
                    style={{
                      ...glassCard,
                      borderTop: `4px solid ${styleMeta.border}`,
                      padding: 24,
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: 16,
                      }}
                    >
                      <span
                        style={{
                          fontSize: 10,
                          fontWeight: 800,
                          padding: "4px 10px",
                          borderRadius: 6,
                          background: styleMeta.badgeBg,
                          color: styleMeta.badgeColor,
                          boxShadow: `0 0 10px ${styleMeta.badgeBg}`,
                        }}
                      >
                        {styleMeta.tag}
                      </span>
                      <span
                        style={{
                          fontSize: 12,
                          color: "#94a3b8",
                          display: "flex",
                          alignItems: "center",
                          gap: 4,
                        }}
                      >
                        <Clock size={12} /> {s.startTime} - {s.endTime}
                      </span>
                    </div>
                    <h3
                      style={{
                        textTransform: "capitalize",
                        margin: "0 0 16px",
                        fontSize: 20,
                        fontWeight: 800,
                      }}
                    >
                      {s.category}
                    </h3>
                    {s.items?.length > 0 ? (
                      <ul
                        style={{
                          paddingLeft: 16,
                          margin: 0,
                          fontSize: 14,
                          color: "#cbd5e1",
                          lineHeight: 1.8,
                        }}
                      >
                        {s.items.slice(0, 4).map((item, idx) => (
                          <li key={idx}>{item.name}</li>
                        ))}
                      </ul>
                    ) : (
                      <p style={{ fontSize: 13, color: "#64748b" }}>
                        Items pending update
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </section>
      )}

      {/* Two-Column Lower Deck: Upcoming Menus & Campus Broadcasts */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))",
          gap: 24,
        }}
      >
        {/* Upcoming Menus */}
        {isStudent && !isGroundFloor && upcoming.length > 0 && (
          <section>
            <h2
              style={{
                margin: "0 0 16px",
                fontSize: 18,
                fontWeight: 800,
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              <Calendar size={18} color="#10b981" /> Upcoming Windows
            </h2>
            <div style={{ display: "grid", gap: 12 }}>
              {upcoming.map((m) => (
                <div
                  key={m._id}
                  style={{
                    ...glassCard,
                    padding: 20,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div>
                    <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700 }}>
                      {new Date(m.date).toLocaleDateString("en-IN", {
                        weekday: "short",
                        day: "numeric",
                        month: "short",
                      })}
                    </h3>
                    <p
                      style={{
                        margin: "6px 0 0",
                        fontSize: 13,
                        color: "#94a3b8",
                        textTransform: "capitalize",
                      }}
                    >
                      {(m.sessions || []).map((s) => s.category).join(" • ")}
                    </p>
                  </div>
                  <Link
                    to="/menu"
                    style={{
                      padding: "8px 16px",
                      borderRadius: 8,
                      background: "rgba(255,255,255,0.05)",
                      border: "1px solid rgba(255,255,255,0.1)",
                      color: "#f8fafc",
                      fontSize: 13,
                      fontWeight: 600,
                      textDecoration: "none",
                    }}
                  >
                    Inspect
                  </Link>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Broadcasts */}
        {announcements.length > 0 && (
          <section>
            <h2
              style={{
                margin: "0 0 16px",
                fontSize: 18,
                fontWeight: 800,
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              <Megaphone size={18} color="#f59e0b" /> Committee Broadcasts
            </h2>
            <div style={{ display: "grid", gap: 12 }}>
              {announcements.map((a) => (
                <div key={a._id} style={{ ...glassCard, padding: 24 }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      marginBottom: 10,
                    }}
                  >
                    <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700 }}>
                      {a.title}
                    </h3>
                    <span
                      style={{
                        fontSize: 10,
                        textTransform: "uppercase",
                        fontWeight: 800,
                        padding: "4px 10px",
                        borderRadius: 6,
                        background:
                          a.priority === "urgent"
                            ? "rgba(239, 68, 68, 0.15)"
                            : "rgba(255,255,255,0.05)",
                        color: a.priority === "urgent" ? "#f87171" : "#94a3b8",
                        border:
                          a.priority === "urgent"
                            ? "1px solid rgba(239, 68, 68, 0.3)"
                            : "1px solid transparent",
                      }}
                    >
                      {a.priority || "normal"}
                    </span>
                  </div>
                  <p
                    style={{
                      margin: "0 0 16px",
                      fontSize: 14,
                      color: "#cbd5e1",
                      lineHeight: 1.6,
                    }}
                  >
                    {a.body}
                  </p>
                  <p style={{ margin: 0, fontSize: 12, color: "#64748b" }}>
                    Posted {new Date(a.createdAt).toLocaleString("en-IN")}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
