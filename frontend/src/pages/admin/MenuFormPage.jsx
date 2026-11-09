import { useState, useEffect } from "react";
import { useParams, useNavigate, Link, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  useMenuDetailQuery,
  useCreateMenuMutation,
  useUpdateMenuMutation,
} from "../../app/api.js";
import { toast } from "sonner";
import { Plus, Trash2, ArrowLeft, AlertCircle } from "lucide-react";

const CATEGORIES = ["breakfast", "lunch", "snacks", "dinner"];
const DEFAULT_TIMES = {
  breakfast: { start: "08:00", end: "10:00" },
  lunch: { start: "12:00", end: "14:00" },
  snacks: { start: "17:00", end: "18:00" },
  dinner: { start: "19:30", end: "21:30" },
};

const glassCard = {
  background:
    "linear-gradient(145deg, rgba(30, 41, 59, 0.4) 0%, rgba(15, 23, 42, 0.6) 100%)",
  backdropFilter: "blur(16px)",
  WebkitBackdropFilter: "blur(16px)",
  border: "1px solid rgba(255, 255, 255, 0.08)",
  borderRadius: "16px",
  boxShadow: "0 10px 40px -10px rgba(0, 0, 0, 0.5)",
  padding: "24px",
  marginBottom: "20px",
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

function emptyMeal(category) {
  return {
    category,
    startTime: DEFAULT_TIMES[category].start,
    endTime: DEFAULT_TIMES[category].end,
    items: [{ name: "" }],
    serving: true,
  };
}
function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

export default function MenuFormPage() {
  const user = useSelector((s) => s.auth.user);
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const { data: existing, isLoading: loadingExisting } = useMenuDetailQuery(
    id,
    { skip: !isEdit },
  );
  const [createMenu, { isLoading: creating }] = useCreateMenuMutation();
  const [updateMenu, { isLoading: updating }] = useUpdateMenuMutation();

  const [date, setDate] = useState(todayStr());
  const [notes, setNotes] = useState("");
  const [published, setPublished] = useState(true);
  const [meals, setMeals] = useState(CATEGORIES.map(emptyMeal));
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  if (!["mess_committee", "admin"].includes(user?.role)) {
    return <Navigate to="/admin/menus" replace />;
  }

  useEffect(() => {
    if (existing?.data?.menu) {
      const m = existing.data.menu;
      setDate(new Date(m.date).toISOString().slice(0, 10));
      setNotes(m.notes || "");
      setPublished(m.published);
      setMeals(
        (m.meals || []).map((meal) => ({
          category: meal.category,
          startTime: meal.startTime,
          endTime: meal.endTime,
          items: (meal.items || []).length
            ? meal.items.map((it) => ({
                name: it.name,
                dietary: it.dietary || "veg",
              }))
            : [{ name: "" }],
          serving: true,
        })),
      );
    }
  }, [existing]);

  const addItem = (catIdx) =>
    setMeals((prev) =>
      prev.map((m, i) =>
        i === catIdx
          ? { ...m, items: [...m.items, { name: "", dietary: "veg" }] }
          : m,
      ),
    );
  const removeItem = (catIdx, itemIdx) =>
    setMeals((prev) =>
      prev.map((m, i) =>
        i === catIdx
          ? { ...m, items: m.items.filter((_, j) => j !== itemIdx) }
          : m,
      ),
    );
  const updateItem = (catIdx, itemIdx, name) =>
    setMeals((prev) =>
      prev.map((m, i) =>
        i === catIdx
          ? {
              ...m,
              items: m.items.map((it, j) =>
                j === itemIdx ? { ...it, name } : it,
              ),
            }
          : m,
      ),
    );
  const updateMeal = (catIdx, updates) =>
    setMeals((prev) =>
      prev.map((m, i) => (i === catIdx ? { ...m, ...updates } : m)),
    );

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      const cleanMeals = meals
        .filter((m) => m.items.some((it) => it.name.trim()))
        .map((m) => ({
          ...m,
          items: m.items
            .filter((it) => it.name.trim())
            .map((it) => ({
              name: it.name.trim(),
              dietary: it.dietary || "veg",
              allergens: [],
              special: false,
            })),
        }));

      if (cleanMeals.length === 0)
        throw new Error("Add at least one item to at least one meal");

      if (isEdit) {
        await updateMenu({
          id,
          date,
          meals: cleanMeals,
          notes,
          published,
        }).unwrap();
        toast.success("Menu updated");
      } else {
        await createMenu({
          date,
          meals: cleanMeals,
          notes,
          published,
        }).unwrap();
        toast.success(
          "Menu created for " + new Date(date).toLocaleDateString(),
        );
      }
      navigate("/admin/menus");
    } catch (err) {
      const msg = err?.data?.message || err.message || "Failed to save menu";
      setError(msg);
      toast.error(msg);
    } finally {
      setBusy(false);
    }
  };

  if (isEdit && loadingExisting)
    return (
      <div style={{ padding: 40, color: "#94a3b8" }}>Loading Telemetry...</div>
    );

  return (
    <div style={{ maxWidth: 1000, margin: "0 auto", padding: "32px 24px" }}>
      <header style={{ marginBottom: 32 }}>
        <Link
          to="/admin/menus"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            color: "#10b981",
            fontSize: 13,
            fontWeight: 600,
            textDecoration: "none",
            marginBottom: 12,
          }}
        >
          <ArrowLeft size={14} /> Back to menu history
        </Link>
        <h1
          style={{
            margin: 0,
            fontSize: "2rem",
            fontWeight: 800,
            letterSpacing: "-0.03em",
          }}
        >
          {isEdit ? "Edit Menu" : "Create Menu"}
        </h1>
      </header>

      {error && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "14px 20px",
            borderRadius: 10,
            background: "rgba(239, 68, 68, 0.1)",
            border: "1px solid rgba(239, 68, 68, 0.3)",
            color: "#fca5a5",
            marginBottom: 20,
          }}
        >
          <AlertCircle size={18} /> <span>{error}</span>
        </div>
      )}

      <form onSubmit={submit}>
        <div style={glassCard}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: 20,
            }}
          >
            <label style={{ display: "grid", gap: 8 }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: "#cbd5e1" }}>
                Date {!isEdit && "(today or later)"}
              </span>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                min={isEdit ? undefined : todayStr()}
                required
                disabled={isEdit}
                style={{ ...inputStyle, opacity: isEdit ? 0.6 : 1 }}
              />
            </label>
            <label style={{ display: "grid", gap: 8 }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: "#cbd5e1" }}>
                Notes (optional)
              </span>
              <input
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Special dinner tonight"
                style={inputStyle}
              />
            </label>
            <label
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                marginTop: 28,
              }}
            >
              <input
                type="checkbox"
                checked={published}
                onChange={(e) => setPublished(e.target.checked)}
                style={{ width: 18, height: 18, accentColor: "#10b981" }}
              />
              <span style={{ fontSize: 14, fontWeight: 600, color: "#f8fafc" }}>
                Published
              </span>
            </label>
          </div>
        </div>

        {meals.map((meal, catIdx) => (
          <div key={meal.category} style={glassCard}>
            <h3
              style={{
                margin: "0 0 16px",
                textTransform: "capitalize",
                fontSize: 18,
                fontWeight: 800,
                color: "#10b981",
              }}
            >
              {meal.category}
            </h3>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 20,
                marginBottom: 20,
              }}
            >
              <label style={{ display: "grid", gap: 8 }}>
                <span
                  style={{ fontSize: 13, fontWeight: 600, color: "#cbd5e1" }}
                >
                  Start time
                </span>
                <input
                  type="time"
                  value={meal.startTime}
                  onChange={(e) =>
                    updateMeal(catIdx, { startTime: e.target.value })
                  }
                  style={inputStyle}
                />
              </label>
              <label style={{ display: "grid", gap: 8 }}>
                <span
                  style={{ fontSize: 13, fontWeight: 600, color: "#cbd5e1" }}
                >
                  End time
                </span>
                <input
                  type="time"
                  value={meal.endTime}
                  onChange={(e) =>
                    updateMeal(catIdx, { endTime: e.target.value })
                  }
                  style={inputStyle}
                />
              </label>
            </div>

            <p
              style={{
                fontSize: 12,
                fontWeight: 700,
                textTransform: "uppercase",
                color: "#64748b",
                letterSpacing: "0.05em",
                marginBottom: 12,
              }}
            >
              Food items
            </p>

            {meal.items.map((item, itemIdx) => (
              <div
                key={itemIdx}
                style={{ display: "flex", gap: 10, marginBottom: 10 }}
              >
                <input
                  value={item.name}
                  onChange={(e) => updateItem(catIdx, itemIdx, e.target.value)}
                  placeholder="e.g. Idli, Sambar"
                  style={{ ...inputStyle, flex: 1 }}
                />
                {meal.items.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeItem(catIdx, itemIdx)}
                    style={{
                      padding: "0 16px",
                      borderRadius: 10,
                      background: "rgba(239, 68, 68, 0.15)",
                      color: "#f87171",
                      border: "1px solid rgba(239,68,68,0.3)",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
            ))}

            <button
              type="button"
              onClick={() => addItem(catIdx)}
              style={{
                marginTop: 8,
                padding: "8px 16px",
                borderRadius: 8,
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.1)",
                color: "#f8fafc",
                fontSize: 13,
                fontWeight: 600,
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              <Plus size={14} /> Add item
            </button>
          </div>
        ))}

        <div
          style={{
            marginTop: 24,
            display: "flex",
            gap: 12,
            justifyContent: "flex-end",
          }}
        >
          <Link
            to="/admin/menus"
            style={{
              padding: "14px 24px",
              borderRadius: 12,
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.1)",
              color: "#f8fafc",
              fontWeight: 600,
              textDecoration: "none",
              display: "inline-flex",
              alignItems: "center",
            }}
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={busy || creating || updating}
            style={{
              padding: "14px 32px",
              borderRadius: 12,
              background: "linear-gradient(135deg, #10b981, #059669)",
              color: "#022c22",
              fontWeight: 800,
              fontSize: 15,
              border: "none",
              cursor: busy || creating || updating ? "not-allowed" : "pointer",
              boxShadow: "0 8px 25px rgba(16, 185, 129, 0.4)",
              transition: "all 0.2s",
            }}
          >
            {busy || creating || updating
              ? "Saving..."
              : isEdit
                ? "Update Menu"
                : "Create Menu"}
          </button>
        </div>
      </form>
    </div>
  );
}
