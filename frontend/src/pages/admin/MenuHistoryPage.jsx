import { useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { useListMenusQuery, useDeleteMenuMutation } from "../../app/api.js";
import { toast } from "sonner";
import { Plus, Edit, Trash2, ChefHat, Clock, Leaf, Flame } from "lucide-react";

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

export default function MenuHistoryPage() {
  const user = useSelector((s) => s.auth.user);
  const isStaff = user?.role === "staff";
  const canEdit = ["mess_committee", "admin"].includes(user?.role);

  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState("all");
  const { data, isLoading, refetch } = useListMenusQuery({
    page,
    limit: 20,
    published:
      filter === "published" ? true : filter === "draft" ? false : undefined,
  });
  const [deleteMenu] = useDeleteMenuMutation();

  const menus = data?.data?.menus || [];
  const meta = data?.meta || {};

  const handleDelete = async (id, date) => {
    if (
      !confirm(
        "Delete menu for " +
          new Date(date).toLocaleDateString() +
          "?\n\nStudent registrations for this day will be cancelled.",
      )
    )
      return;
    try {
      await deleteMenu(id).unwrap();
      toast.success("Menu deleted");
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || "Failed to delete");
    }
  };

  const isFuture = (d) =>
    new Date(d) >= new Date(new Date().setHours(0, 0, 0, 0));
  const isToday = (d) =>
    new Date(d).toDateString() === new Date().toDateString();
  const isTomorrow = (d) => {
    const t = new Date();
    t.setDate(t.getDate() + 1);
    return new Date(d).toDateString() === t.toDateString();
  };

  const todayMenu = menus.find((m) => isToday(m.date));
  const tomorrowMenu = menus.find((m) => isTomorrow(m.date));

  const renderPrepCard = (menu, title, iconColor) => (
    <div style={{ marginBottom: 24 }}>
      <h2
        style={{
          fontSize: 16,
          marginBottom: 16,
          display: "flex",
          alignItems: "center",
          gap: 8,
          color: "#f8fafc",
        }}
      >
        <ChefHat size={20} color={iconColor} /> {title}
      </h2>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: 16,
        }}
      >
        {(menu.meals || []).map((meal) => (
          <div
            key={meal.category}
            style={{
              ...glassCard,
              padding: 20,
              borderTop: `3px solid ${iconColor}`,
            }}
          >
            <div
              style={{
                fontSize: 12,
                fontWeight: 800,
                textTransform: "uppercase",
                letterSpacing: 0.6,
                color: iconColor,
                marginBottom: 6,
              }}
            >
              {meal.category}
            </div>
            <div
              style={{
                fontSize: 14,
                fontWeight: 600,
                color: "#94a3b8",
                display: "flex",
                alignItems: "center",
                gap: 6,
                marginBottom: 16,
              }}
            >
              <Clock size={14} /> {meal.startTime} - {meal.endTime}
            </div>
            {meal.items && meal.items.length > 0 ? (
              <ul
                style={{
                  listStyle: "none",
                  padding: 0,
                  margin: 0,
                  display: "grid",
                  gap: 8,
                }}
              >
                {meal.items.map((item, i) => (
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
                    {item.name}
                  </li>
                ))}
              </ul>
            ) : (
              <p style={{ margin: 0, fontSize: 13, color: "#64748b" }}>
                No items listed
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "32px 24px" }}>
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
          <h1
            style={{
              margin: 0,
              fontSize: "2rem",
              fontWeight: 800,
              letterSpacing: "-0.03em",
            }}
          >
            {isStaff ? "Menu & Prep" : "Menu History"}
          </h1>
          <p style={{ margin: "8px 0 0", fontSize: 14, color: "#94a3b8" }}>
            {isStaff
              ? "See what to prepare for today and upcoming days"
              : "All menus - past, present, and future"}
          </p>
        </div>
        {canEdit && (
          <Link
            to="/admin/menus/new"
            style={{
              padding: "12px 24px",
              borderRadius: 12,
              background: "linear-gradient(135deg, #10b981, #059669)",
              color: "#022c22",
              fontWeight: 800,
              textDecoration: "none",
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              boxShadow: "0 8px 25px rgba(16, 185, 129, 0.4)",
            }}
          >
            <Plus size={18} /> Create Menu
          </Link>
        )}
      </header>

      {isStaff && (
        <section style={{ marginBottom: 40 }}>
          {todayMenu &&
            renderPrepCard(todayMenu, "Today's Preparation", "#10b981")}
          {tomorrowMenu &&
            renderPrepCard(tomorrowMenu, "Tomorrow's Preparation", "#f59e0b")}
        </section>
      )}

      {canEdit && (
        <div style={{ display: "flex", gap: 10, marginBottom: 24 }}>
          {[
            { v: "all", l: "All" },
            { v: "published", l: "Published" },
            { v: "draft", l: "Draft" },
          ].map((f) => (
            <button
              key={f.v}
              onClick={() => {
                setFilter(f.v);
                setPage(1);
              }}
              style={{
                padding: "8px 20px",
                borderRadius: 10,
                fontSize: 14,
                fontWeight: 700,
                cursor: "pointer",
                border: "1px solid",
                background:
                  filter === f.v
                    ? "rgba(16, 185, 129, 0.15)"
                    : "rgba(255,255,255,0.03)",
                borderColor:
                  filter === f.v
                    ? "rgba(16, 185, 129, 0.4)"
                    : "rgba(255,255,255,0.08)",
                color: filter === f.v ? "#34d399" : "#94a3b8",
                transition: "all 0.2s",
              }}
            >
              {f.l}
            </button>
          ))}
        </div>
      )}

      <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 16 }}>
        {isStaff ? "Full menu schedule" : "All menus"}
      </h2>

      {isLoading ? (
        <p style={{ color: "#94a3b8" }}>Loading...</p>
      ) : menus.length === 0 ? (
        <div style={{ ...glassCard, textAlign: "center", padding: 60 }}>
          <ChefHat
            size={48}
            color="#334155"
            style={{ margin: "0 auto 16px" }}
          />
          <p style={{ color: "#94a3b8", fontSize: 15 }}>
            No menus yet
            {canEdit ? ". Create your first one." : ". Check back later."}
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
                  <th
                    style={{
                      padding: "16px 20px",
                      fontSize: 13,
                      fontWeight: 700,
                      color: "#94a3b8",
                    }}
                  >
                    Date
                  </th>
                  <th
                    style={{
                      padding: "16px 20px",
                      fontSize: 13,
                      fontWeight: 700,
                      color: "#94a3b8",
                    }}
                  >
                    Status
                  </th>
                  <th
                    style={{
                      padding: "16px 20px",
                      fontSize: 13,
                      fontWeight: 700,
                      color: "#94a3b8",
                    }}
                  >
                    Meals
                  </th>
                  {canEdit && (
                    <th
                      style={{
                        padding: "16px 20px",
                        fontSize: 13,
                        fontWeight: 700,
                        color: "#94a3b8",
                      }}
                    >
                      Actions
                    </th>
                  )}
                </tr>
              </thead>
              <tbody>
                {menus.map((m) => {
                  const mealCats = (m.meals || [])
                    .map((x) => x.category)
                    .join(", ");
                  return (
                    <tr
                      key={m._id}
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
                      <td style={{ padding: "16px 20px" }}>
                        <div style={{ fontWeight: 700, color: "#f8fafc" }}>
                          {new Date(m.date).toLocaleDateString("en-IN", {
                            weekday: "short",
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </div>
                        <div style={{ marginTop: 6 }}>
                          {isToday(m.date) && (
                            <span
                              style={{
                                fontSize: 10,
                                fontWeight: 800,
                                background: "rgba(16, 185, 129, 0.15)",
                                color: "#34d399",
                                padding: "2px 8px",
                                borderRadius: 4,
                              }}
                            >
                              TODAY
                            </span>
                          )}
                          {isFuture(m.date) && !isToday(m.date) && (
                            <span
                              style={{
                                fontSize: 10,
                                fontWeight: 800,
                                background: "rgba(245, 158, 11, 0.15)",
                                color: "#fbbf24",
                                padding: "2px 8px",
                                borderRadius: 4,
                              }}
                            >
                              UPCOMING
                            </span>
                          )}
                        </div>
                      </td>
                      <td style={{ padding: "16px 20px" }}>
                        <span
                          style={{
                            fontSize: 12,
                            fontWeight: 700,
                            background: m.published
                              ? "rgba(16, 185, 129, 0.15)"
                              : "rgba(148, 163, 184, 0.15)",
                            color: m.published ? "#34d399" : "#cbd5e1",
                            padding: "4px 10px",
                            borderRadius: 6,
                          }}
                        >
                          {m.published ? "Published" : "Draft"}
                        </span>
                      </td>
                      <td
                        style={{
                          padding: "16px 20px",
                          fontSize: 13,
                          color: "#cbd5e1",
                        }}
                      >
                        <strong>{m.meals?.length || 0} meals</strong>
                        <div
                          style={{
                            color: "#64748b",
                            fontSize: 12,
                            marginTop: 2,
                            textTransform: "capitalize",
                          }}
                        >
                          {mealCats}
                        </div>
                      </td>
                      {canEdit && (
                        <td style={{ padding: "16px 20px" }}>
                          <div style={{ display: "flex", gap: 8 }}>
                            <Link
                              to={"/admin/menus/" + m._id}
                              style={{
                                padding: "6px 12px",
                                borderRadius: 6,
                                background: "rgba(56, 189, 248, 0.1)",
                                color: "#38bdf8",
                                border: "1px solid rgba(56, 189, 248, 0.2)",
                                textDecoration: "none",
                                fontSize: 12,
                                fontWeight: 700,
                                display: "flex",
                                alignItems: "center",
                                gap: 4,
                              }}
                            >
                              <Edit size={12} /> Edit
                            </Link>
                            <button
                              onClick={() => handleDelete(m._id, m.date)}
                              style={{
                                padding: "6px 12px",
                                borderRadius: 6,
                                background: "rgba(239, 68, 68, 0.1)",
                                color: "#f87171",
                                border: "1px solid rgba(239, 68, 68, 0.2)",
                                cursor: "pointer",
                                fontSize: 12,
                                fontWeight: 700,
                                display: "flex",
                                alignItems: "center",
                                gap: 4,
                              }}
                            >
                              <Trash2 size={12} /> Delete
                            </button>
                          </div>
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {meta.pages > 1 && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: 12,
            marginTop: 24,
          }}
        >
          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            style={{
              padding: "8px 16px",
              borderRadius: 8,
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.1)",
              color: "#f8fafc",
              cursor: page === 1 ? "not-allowed" : "pointer",
              opacity: page === 1 ? 0.5 : 1,
            }}
          >
            Prev
          </button>
          <span
            style={{
              padding: "8px 12px",
              fontSize: 13,
              color: "#94a3b8",
              fontWeight: 600,
            }}
          >
            Page {page} of {meta.pages}
          </span>
          <button
            disabled={page >= meta.pages}
            onClick={() => setPage(page + 1)}
            style={{
              padding: "8px 16px",
              borderRadius: 8,
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.1)",
              color: "#f8fafc",
              cursor: page >= meta.pages ? "not-allowed" : "pointer",
              opacity: page >= meta.pages ? 0.5 : 1,
            }}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
