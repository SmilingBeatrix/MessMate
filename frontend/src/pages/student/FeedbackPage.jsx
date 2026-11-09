import { useState } from "react";
import {
  useMyAttendanceQuery,
  useMyFeedbackQuery,
  useSubmitFeedbackMutation,
} from "../../app/api.js";
import { toast } from "sonner";
import {
  Star,
  MessageSquarePlus,
  CheckCircle2,
  X,
  Sparkles,
} from "lucide-react";

const RATING_FIELDS = [
  { key: "taste", label: "Taste" },
  { key: "quality", label: "Quality" },
  { key: "hygiene", label: "Hygiene" },
  { key: "quantity", label: "Quantity" },
  { key: "overall", label: "Overall" },
];

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

function StarPicker({ value, onChange }) {
  return (
    <div style={{ display: "flex", gap: 4 }}>
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          onClick={() => onChange(n)}
          style={{
            background: "transparent",
            border: "none",
            cursor: "pointer",
            padding: 2,
            color: n <= value ? "#fbbf24" : "#334155",
            transition: "transform 0.1s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.2)")}
          onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
        >
          <Star
            size={24}
            fill={n <= value ? "#fbbf24" : "none"}
            stroke={n <= value ? "#fbbf24" : "#334155"}
          />
        </button>
      ))}
    </div>
  );
}

export default function FeedbackPage() {
  const { data: attData, isLoading: loadingAtt } = useMyAttendanceQuery();
  const { data: fbData, refetch: refetchFb } = useMyFeedbackQuery();
  const [submit, { isLoading: submitting }] = useSubmitFeedbackMutation();

  const [rating, setRating] = useState(null);
  const [form, setForm] = useState({
    taste: 5,
    quality: 5,
    hygiene: 5,
    quantity: 5,
    overall: 5,
    comment: "",
  });

  const attendance = attData?.data?.attendance || [];
  const feedback = fbData?.data?.feedback || [];
  const feedbackBySession = new Map(
    feedback.map((f) => [String(f.session), f]),
  );
  const pending = attendance.filter((a) => {
    const sid = String(a.session?._id || a.session);
    return sid && !feedbackBySession.has(sid);
  });
  const rated = feedback.map((f) => {
    const att = attendance.find(
      (a) => String(a.session?._id || a.session) === String(f.session),
    );
    return { ...f, attendance: att };
  });

  const openRate = (att) => {
    setRating(att);
    setForm({
      taste: 5,
      quality: 5,
      hygiene: 5,
      quantity: 5,
      overall: 5,
      comment: "",
    });
  };

  const handleSubmit = async () => {
    if (!rating) return;
    const sessionId = rating.session?._id || rating.session;
    if (!sessionId) return toast.error("Cannot submit - session missing");
    try {
      await submit({ sessionId, ...form }).unwrap();
      toast.success("Thank you for your feedback");
      setRating(null);
      refetchFb();
    } catch (err) {
      toast.error(err?.data?.message || "Failed to submit");
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
            color: "#fbbf24",
            letterSpacing: "0.1em",
            marginBottom: 8,
            background: "rgba(245, 158, 11, 0.15)",
            padding: "5px 14px",
            borderRadius: "20px",
            border: "1px solid rgba(245, 158, 11, 0.3)",
          }}
        >
          <Sparkles size={14} /> MEAL RATINGS
        </div>
        <h1
          style={{
            margin: 0,
            fontSize: "2rem",
            fontWeight: 800,
            letterSpacing: "-0.03em",
          }}
        >
          Feedback
        </h1>
        <p style={{ margin: "8px 0 0", fontSize: 14, color: "#94a3b8" }}>
          Rate meals you have attended - helps the mess improve.
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
        <div style={{ ...glassCard, padding: 20 }}>
          <span
            style={{
              fontSize: 12,
              fontWeight: 700,
              color: "#94a3b8",
              textTransform: "uppercase",
            }}
          >
            Meals attended
          </span>
          <strong style={{ fontSize: 24, display: "block", marginTop: 4 }}>
            {attendance.length}
          </strong>
        </div>
        <div
          style={{ ...glassCard, padding: 20, borderLeft: "3px solid #f59e0b" }}
        >
          <span
            style={{
              fontSize: 12,
              fontWeight: 700,
              color: "#94a3b8",
              textTransform: "uppercase",
            }}
          >
            Pending rating
          </span>
          <strong
            style={{
              fontSize: 24,
              display: "block",
              marginTop: 4,
              color: "#fbbf24",
            }}
          >
            {pending.length}
          </strong>
        </div>
        <div
          style={{ ...glassCard, padding: 20, borderLeft: "3px solid #10b981" }}
        >
          <span
            style={{
              fontSize: 12,
              fontWeight: 700,
              color: "#94a3b8",
              textTransform: "uppercase",
            }}
          >
            Rated
          </span>
          <strong
            style={{
              fontSize: 24,
              display: "block",
              marginTop: 4,
              color: "#34d399",
            }}
          >
            {rated.length}
          </strong>
        </div>
      </section>

      <section style={{ marginBottom: 32 }}>
        <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 16 }}>
          Rate your meals
        </h2>
        {loadingAtt ? (
          <p style={{ color: "#94a3b8" }}>Loading...</p>
        ) : pending.length === 0 ? (
          <div style={{ ...glassCard, padding: 60, textAlign: "center" }}>
            <CheckCircle2
              size={48}
              color="#334155"
              style={{ margin: "0 auto 16px" }}
            />
            <p style={{ color: "#94a3b8", fontSize: 15 }}>
              {attendance.length === 0
                ? "Attend a meal first (staff marks you present), then you can rate it here."
                : "You have rated all your attended meals. Well done!"}
            </p>
          </div>
        ) : (
          <div style={{ display: "grid", gap: 12 }}>
            {pending.slice(0, 10).map((a) => {
              const sessionDate = new Date(a.date || a.attendedAt);
              return (
                <div
                  key={a._id}
                  style={{
                    ...glassCard,
                    padding: 20,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexWrap: "wrap",
                    gap: 16,
                  }}
                >
                  <div>
                    <h3
                      style={{
                        margin: 0,
                        fontSize: 16,
                        fontWeight: 700,
                        textTransform: "capitalize",
                      }}
                    >
                      {a.session?.category || "Meal"}
                    </h3>
                    <p
                      style={{
                        margin: "4px 0 0",
                        fontSize: 13,
                        color: "#94a3b8",
                      }}
                    >
                      {sessionDate.toLocaleDateString("en-IN", {
                        weekday: "short",
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                      {a.attendedAt &&
                        " - " +
                          new Date(a.attendedAt).toLocaleTimeString("en-IN", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                    </p>
                  </div>
                  <button
                    onClick={() => openRate(a)}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 6,
                      padding: "10px 20px",
                      borderRadius: 8,
                      background: "linear-gradient(135deg, #f59e0b, #d97706)",
                      color: "#451a03",
                      fontWeight: 800,
                      fontSize: 13,
                      border: "none",
                      cursor: "pointer",
                      boxShadow: "0 4px 15px rgba(245, 158, 11, 0.3)",
                    }}
                  >
                    <MessageSquarePlus size={16} /> Rate now
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {rated.length > 0 && (
        <section>
          <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 16 }}>
            Your past ratings
          </h2>
          <div style={{ display: "grid", gap: 12 }}>
            {rated.map((f) => (
              <div key={f._id} style={{ ...glassCard, padding: 20 }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    gap: 12,
                    flexWrap: "wrap",
                  }}
                >
                  <div style={{ flex: 1, minWidth: 200 }}>
                    <h3
                      style={{
                        margin: 0,
                        fontSize: 16,
                        fontWeight: 700,
                        textTransform: "capitalize",
                      }}
                    >
                      {f.attendance?.session?.category || "Meal"}
                    </h3>
                    <p
                      style={{
                        margin: "4px 0",
                        fontSize: 13,
                        color: "#94a3b8",
                      }}
                    >
                      {f.attendance?.date &&
                        new Date(f.attendance.date).toLocaleDateString(
                          "en-IN",
                          { weekday: "short", day: "numeric", month: "short" },
                        )}
                    </p>
                    <div
                      style={{
                        display: "flex",
                        gap: 12,
                        marginTop: 8,
                        fontSize: 12,
                        color: "#64748b",
                        flexWrap: "wrap",
                      }}
                    >
                      <span>Taste: {f.taste}/5</span>
                      <span>Quality: {f.quality}/5</span>
                      <span>Hygiene: {f.hygiene}/5</span>
                      <span>Qty: {f.quantity}/5</span>
                    </div>
                    {f.comment && (
                      <p
                        style={{
                          margin: "12px 0 0",
                          fontSize: 13,
                          fontStyle: "italic",
                          color: "#cbd5e1",
                        }}
                      >
                        "{f.comment}"
                      </p>
                    )}
                  </div>
                  <div
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 4,
                      padding: "8px 14px",
                      background: "rgba(245, 158, 11, 0.15)",
                      borderRadius: 8,
                      color: "#fbbf24",
                      fontWeight: 800,
                      fontSize: 15,
                      border: "1px solid rgba(245,158,11,0.3)",
                    }}
                  >
                    <Star size={16} fill="#fbbf24" /> {f.overall}/5
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {rating && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.8)",
            backdropFilter: "blur(8px)",
            display: "grid",
            placeItems: "center",
            zIndex: 100,
            padding: 20,
          }}
          onClick={() => !submitting && setRating(null)}
        >
          <div
            style={{ ...glassCard, width: "100%", maxWidth: 460, padding: 32 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                marginBottom: 24,
                gap: 8,
              }}
            >
              <div>
                <h2
                  style={{
                    margin: 0,
                    fontSize: 20,
                    fontWeight: 800,
                    textTransform: "capitalize",
                  }}
                >
                  Rate {rating.session?.category || "meal"}
                </h2>
                <p
                  style={{ margin: "4px 0 0", fontSize: 13, color: "#94a3b8" }}
                >
                  {new Date(
                    rating.date || rating.attendedAt,
                  ).toLocaleDateString("en-IN", {
                    weekday: "long",
                    day: "numeric",
                    month: "short",
                  })}
                </p>
              </div>
              <button
                onClick={() => !submitting && setRating(null)}
                disabled={submitting}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "#94a3b8",
                  cursor: submitting ? "not-allowed" : "pointer",
                }}
              >
                <X size={22} />
              </button>
            </div>

            <div style={{ display: "grid", gap: 16, marginBottom: 24 }}>
              {RATING_FIELDS.map(({ key, label }) => (
                <div
                  key={key}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: 12,
                  }}
                >
                  <span
                    style={{ fontSize: 14, fontWeight: 600, color: "#cbd5e1" }}
                  >
                    {label}
                  </span>
                  <StarPicker
                    value={form[key]}
                    onChange={(v) => setForm({ ...form, [key]: v })}
                  />
                </div>
              ))}
              <label style={{ display: "grid", gap: 8, marginTop: 8 }}>
                <span
                  style={{ fontSize: 13, fontWeight: 600, color: "#94a3b8" }}
                >
                  Comment (optional)
                </span>
                <textarea
                  rows="3"
                  value={form.comment}
                  onChange={(e) =>
                    setForm({ ...form, comment: e.target.value })
                  }
                  placeholder="What did you think of the food?"
                  style={{ ...inputStyle, resize: "vertical" }}
                  disabled={submitting}
                />
              </label>
            </div>

            <button
              onClick={handleSubmit}
              disabled={submitting}
              style={{
                width: "100%",
                padding: 14,
                borderRadius: 10,
                background: "linear-gradient(135deg, #f59e0b, #d97706)",
                color: "#451a03",
                fontWeight: 800,
                fontSize: 15,
                border: "none",
                cursor: submitting ? "not-allowed" : "pointer",
                boxShadow: "0 4px 15px rgba(245, 158, 11, 0.4)",
              }}
            >
              {submitting ? "Submitting..." : "Submit feedback"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
