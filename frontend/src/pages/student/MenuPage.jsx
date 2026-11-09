import { useState } from "react";
import { useSelector } from "react-redux";
import {
  useUpcomingMenusQuery,
  useRegisterMealMutation,
  useCancelRegistrationMutation,
  useMyRegistrationsQuery,
} from "../../app/api.js";
import { toast } from "sonner";
import {
  Clock,
  Leaf,
  Flame,
  ChevronLeft,
  ChevronRight,
  Egg,
  Utensils,
  Cookie,
  Moon,
  CheckCircle2,
  Building2,
} from "lucide-react";

const VISUALS = {
  breakfast: { bg: "rgba(245, 158, 11, 0.1)", color: "#fbbf24", Icon: Egg },
  lunch: { bg: "rgba(16, 185, 129, 0.1)", color: "#34d399", Icon: Utensils },
  snacks: { bg: "rgba(56, 189, 248, 0.1)", color: "#7dd3fc", Icon: Cookie },
  dinner: { bg: "rgba(139, 92, 246, 0.1)", color: "#c4b5fd", Icon: Moon },
};
const MEAL_LABELS = {
  breakfast: "Breakfast",
  lunch: "Lunch",
  snacks: "Snacks",
  dinner: "Dinner",
};

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

export default function MenuPage() {
  const user = useSelector((s) => s.auth.user);
  const isGroundFloor = user?.messSystem === "ground_floor";
  const [page, setPage] = useState(1);
  const { data, isLoading, refetch } = useUpcomingMenusQuery({
    page,
    limit: 3,
    days: 30,
  });
  const { data: regData, refetch: refetchRegs } = useMyRegistrationsQuery();
  const [register] = useRegisterMealMutation();
  const [cancel] = useCancelRegistrationMutation();
  const [busy, setBusy] = useState(null);

  const menus = data?.data?.menus || [];
  const meta = data?.meta || { page: 1, pages: 0, total: 0 };
  const allRegs = regData?.data?.registrations || [];

  const gfMeals = (() => {
    if (!isGroundFloor) return [];
    const meals = new Set();
    for (const menu of menus) {
      for (const s of menu.sessions || []) {
        if (
          s.myRegistration?.isGroundFloor &&
          s.myRegistration?.status === "registered"
        )
          meals.add(s.category);
      }
    }
    return [...meals];
  })();

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const upcomingRegistered = allRegs.filter((r) => {
    const sessionDate = r.session?.date
      ? new Date(r.session.date)
      : new Date(r.date);
    sessionDate.setHours(0, 0, 0, 0);
    return r.status === "registered" && sessionDate >= today;
  });

  const handleRegister = async (sessionId) => {
    setBusy(sessionId);
    try {
      await register({ sessionId }).unwrap();
      toast.success("Registered. Amount added to bill.");
      await Promise.all([refetch(), refetchRegs()]);
    } catch (err) {
      toast.error(err?.data?.message || "Registration failed");
    } finally {
      setBusy(null);
    }
  };

  const handleCancel = async (registrationId) => {
    if (!confirm("Cancel this meal registration?")) return;
    setBusy(registrationId);
    try {
      await cancel(registrationId).unwrap();
      toast.success("Cancelled");
      await Promise.all([refetch(), refetchRegs()]);
    } catch (err) {
      toast.error(err?.data?.message || "Cancellation failed");
    } finally {
      setBusy(null);
    }
  };

  const isToday = (date) =>
    new Date(date).toDateString() === new Date().toDateString();
  const isTomorrow = (date) => {
    const t = new Date();
    t.setDate(t.getDate() + 1);
    return new Date(date).toDateString() === t.toDateString();
  };

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
          {isGroundFloor ? "Menu - Semester Plan" : "Menu & Registration"}
        </h1>
        <p style={{ margin: "8px 0 0", fontSize: 14, color: "#94a3b8" }}>
          {isGroundFloor
            ? "Your meals are pre-registered as part of your semester plan. Just show up to eat."
            : "Register before cutoff. Cancel any time before the cancellation window."}
        </p>
      </header>

      {isGroundFloor && gfMeals.length > 0 && (
        <div
          style={{
            ...glassCard,
            marginBottom: 24,
            borderLeft: "3px solid #f59e0b",
            padding: 20,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              marginBottom: 8,
            }}
          >
            <Building2 size={18} color="#f59e0b" />
            <strong style={{ fontSize: 15, color: "#fbbf24" }}>
              Ground Floor Semester Plan
            </strong>
          </div>
          <p style={{ margin: 0, fontSize: 14, color: "#cbd5e1" }}>
            You are pre-registered for:{" "}
            <strong>
              {gfMeals.map((m) => MEAL_LABELS[m] || m).join(", ")}
            </strong>{" "}
            - every day of the semester.
          </p>
        </div>
      )}

      {!isGroundFloor && upcomingRegistered.length > 0 && (
        <div
          style={{
            ...glassCard,
            marginBottom: 24,
            borderLeft: "3px solid #10b981",
            padding: 20,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              marginBottom: 16,
            }}
          >
            <CheckCircle2 size={18} color="#10b981" />
            <h3 style={{ margin: 0, fontSize: 16, fontWeight: 800 }}>
              Your registered meals ({upcomingRegistered.length})
            </h3>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
              gap: 10,
            }}
          >
            {upcomingRegistered.map((r) => {
              const sessionDate = r.session?.date
                ? new Date(r.session.date)
                : new Date(r.date);
              return (
                <div
                  key={r._id}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "12px 16px",
                    background: "rgba(15, 23, 42, 0.5)",
                    borderRadius: 8,
                    border: "1px solid rgba(255,255,255,0.05)",
                    fontSize: 13,
                  }}
                >
                  <div>
                    <strong
                      style={{ textTransform: "capitalize", color: "#f8fafc" }}
                    >
                      {r.session?.category || "meal"}
                    </strong>
                    <span style={{ color: "#94a3b8", marginLeft: 8 }}>
                      {sessionDate.toLocaleDateString("en-IN", {
                        weekday: "short",
                        day: "numeric",
                        month: "short",
                      })}
                    </span>
                  </div>
                  <span
                    style={{ fontSize: 12, color: "#34d399", fontWeight: 700 }}
                  >
                    {r.session?.startTime &&
                      `${r.session.startTime} - ${r.session.endTime}`}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {isLoading ? (
        <p style={{ color: "#94a3b8" }}>Loading...</p>
      ) : menus.length === 0 ? (
        <div style={{ ...glassCard, padding: 60, textAlign: "center" }}>
          <Utensils
            size={48}
            color="#334155"
            style={{ margin: "0 auto 16px" }}
          />
          <p style={{ color: "#94a3b8", fontSize: 15 }}>
            No menus published yet. The admin will publish upcoming menus.
          </p>
        </div>
      ) : (
        <>
          {menus.map((menu) => (
            <section key={menu._id} style={{ marginBottom: 32 }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  marginBottom: 16,
                  flexWrap: "wrap",
                }}
              >
                <h2
                  style={{
                    margin: 0,
                    fontSize: 20,
                    fontWeight: 800,
                    color: "#f8fafc",
                  }}
                >
                  {new Date(menu.date).toLocaleDateString("en-IN", {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                  })}
                </h2>
                {isToday(menu.date) && (
                  <span
                    style={{
                      fontSize: 10,
                      fontWeight: 800,
                      background: "rgba(16, 185, 129, 0.15)",
                      color: "#34d399",
                      border: "1px solid rgba(16,185,129,0.3)",
                      padding: "3px 8px",
                      borderRadius: 4,
                      textTransform: "uppercase",
                    }}
                  >
                    Today
                  </span>
                )}
                {isTomorrow(menu.date) && (
                  <span
                    style={{
                      fontSize: 10,
                      fontWeight: 800,
                      background: "rgba(245, 158, 11, 0.15)",
                      color: "#fbbf24",
                      border: "1px solid rgba(245,158,11,0.3)",
                      padding: "3px 8px",
                      borderRadius: 4,
                      textTransform: "uppercase",
                    }}
                  >
                    Tomorrow
                  </span>
                )}
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                  gap: 20,
                }}
              >
                {menu.sessions.map((s) => {
                  const isGfReg =
                    s.myRegistration?.isGroundFloor === true &&
                    s.myRegistration?.status === "registered";
                  const isReg = s.myRegistration?.status === "registered";
                  const isAttended = s.myRegistration?.status === "attended";
                  const isEnrolledMeal =
                    isGroundFloor && (isGfReg || isAttended);
                  const visual = VISUALS[s.category] || VISUALS.lunch;

                  return (
                    <div
                      key={s._id}
                      style={{
                        ...glassCard,
                        overflow: "hidden",
                        display: "flex",
                        flexDirection: "column",
                      }}
                    >
                      <div
                        style={{
                          background: visual.bg,
                          padding: 20,
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "flex-start",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 10,
                          }}
                        >
                          <visual.Icon size={24} color={visual.color} />
                          <h3
                            style={{
                              textTransform: "capitalize",
                              margin: 0,
                              fontSize: 18,
                              fontWeight: 800,
                              color: "#f8fafc",
                            }}
                          >
                            {s.category}
                          </h3>
                        </div>
                        {!isGroundFloor && (
                          <span
                            style={{
                              fontSize: 16,
                              fontWeight: 800,
                              color: "#f8fafc",
                              background: "rgba(0,0,0,0.3)",
                              padding: "2px 8px",
                              borderRadius: 6,
                            }}
                          >
                            ₹{s.unitPrice}
                          </span>
                        )}
                        {isGroundFloor && (
                          <span
                            style={{
                              fontSize: 11,
                              fontWeight: 800,
                              color: "#fbbf24",
                              background: "rgba(245,158,11,0.2)",
                              padding: "4px 8px",
                              borderRadius: 6,
                            }}
                          >
                            IN PLAN
                          </span>
                        )}
                      </div>
                      <div
                        style={{
                          padding: 20,
                          flex: 1,
                          display: "flex",
                          flexDirection: "column",
                        }}
                      >
                        <p
                          style={{
                            margin: "0 0 12px",
                            fontSize: 13,
                            color: "#94a3b8",
                            display: "flex",
                            alignItems: "center",
                            gap: 6,
                          }}
                        >
                          <Clock size={14} /> {s.startTime} - {s.endTime}
                        </p>
                        {s.items && s.items.length > 0 && (
                          <ul
                            style={{
                              padding: 0,
                              margin: "0 0 16px",
                              listStyle: "none",
                              display: "grid",
                              gap: 8,
                            }}
                          >
                            {s.items.map((item, i) => (
                              <li
                                key={i}
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 8,
                                  fontSize: 14,
                                  color: "#cbd5e1",
                                }}
                              >
                                {item.dietary === "veg" ? (
                                  <Leaf size={14} color="#10b981" />
                                ) : (
                                  <Flame size={14} color="#ef4444" />
                                )}
                                <span>{item.name}</span>
                              </li>
                            ))}
                          </ul>
                        )}

                        <div
                          style={{
                            marginTop: "auto",
                            paddingTop: 16,
                            borderTop: "1px solid rgba(255,255,255,0.06)",
                          }}
                        >
                          {isAttended ? (
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 8,
                                color: "#34d399",
                                fontWeight: 700,
                                fontSize: 14,
                              }}
                            >
                              <CheckCircle2 size={18} /> Attended
                            </div>
                          ) : isGfReg ? (
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 8,
                                color: "#34d399",
                                fontWeight: 700,
                                fontSize: 14,
                              }}
                            >
                              <CheckCircle2 size={18} /> Registered (Semester
                              Plan)
                            </div>
                          ) : isReg ? (
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                              }}
                            >
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 8,
                                  color: "#34d399",
                                  fontWeight: 700,
                                  fontSize: 14,
                                }}
                              >
                                <CheckCircle2 size={18} /> Registered
                              </div>
                              {s.cancellationOpen && (
                                <button
                                  onClick={() =>
                                    handleCancel(s.myRegistration._id)
                                  }
                                  disabled={busy === s.myRegistration._id}
                                  style={{
                                    padding: "6px 12px",
                                    borderRadius: 6,
                                    background: "rgba(239, 68, 68, 0.15)",
                                    color: "#f87171",
                                    border: "1px solid rgba(239, 68, 68, 0.3)",
                                    fontWeight: 700,
                                    fontSize: 12,
                                    cursor: "pointer",
                                  }}
                                >
                                  {busy === s.myRegistration._id
                                    ? "Cancelling..."
                                    : "Cancel"}
                                </button>
                              )}
                            </div>
                          ) : s.registrationOpen ? (
                            <div
                              style={{
                                display: "flex",
                                gap: 12,
                                alignItems: "center",
                                justifyContent: "space-between",
                              }}
                            >
                              <span
                                style={{
                                  fontSize: 13,
                                  color: "#94a3b8",
                                  fontWeight: 600,
                                }}
                              >
                                Open for registration
                              </span>
                              {!isGroundFloor && (
                                <button
                                  onClick={() => handleRegister(s._id)}
                                  disabled={busy === s._id}
                                  style={{
                                    padding: "8px 16px",
                                    borderRadius: 8,
                                    background:
                                      "linear-gradient(135deg, #10b981, #059669)",
                                    color: "#022c22",
                                    fontWeight: 800,
                                    fontSize: 13,
                                    border: "none",
                                    cursor: "pointer",
                                    boxShadow:
                                      "0 4px 15px rgba(16,185,129,0.3)",
                                  }}
                                >
                                  {busy === s._id
                                    ? "..."
                                    : `Register ₹${s.unitPrice}`}
                                </button>
                              )}
                            </div>
                          ) : (
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 8,
                                color: "#f59e0b",
                                fontWeight: 700,
                                fontSize: 14,
                              }}
                            >
                              <Clock size={18} /> Registration Closed
                            </div>
                          )}

                          {isGroundFloor && !isEnrolledMeal && (
                            <p
                              style={{
                                margin: "8px 0 0",
                                fontSize: 13,
                                color: "#f59e0b",
                                fontWeight: 600,
                              }}
                            >
                              Not in your semester plan
                            </p>
                          )}
                          {isGroundFloor && isEnrolledMeal && !isAttended && (
                            <p
                              style={{
                                margin: "8px 0 0",
                                fontSize: 13,
                                color: "#34d399",
                                fontStyle: "italic",
                              }}
                            >
                              Prepaid - no action needed
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          ))}

          {meta.pages > 1 && (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: 16,
                marginTop: 32,
                flexWrap: "wrap",
              }}
            >
              <button
                disabled={page <= 1}
                onClick={() => setPage(page - 1)}
                style={{
                  padding: "10px 20px",
                  borderRadius: 8,
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  color: "#f8fafc",
                  cursor: page <= 1 ? "not-allowed" : "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  opacity: page <= 1 ? 0.5 : 1,
                }}
              >
                <ChevronLeft size={16} /> Prev
              </button>
              <span style={{ fontSize: 14, color: "#94a3b8", fontWeight: 600 }}>
                Page {meta.page} of {meta.pages}
              </span>
              <button
                disabled={page >= meta.pages}
                onClick={() => setPage(page + 1)}
                style={{
                  padding: "10px 20px",
                  borderRadius: 8,
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  color: "#f8fafc",
                  cursor: page >= meta.pages ? "not-allowed" : "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  opacity: page >= meta.pages ? 0.5 : 1,
                }}
              >
                Next <ChevronRight size={16} />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
