import { useState } from "react";
import { useCreateAnnouncementMutation } from "../../app/api.js"; // Note: If this import isn't used, you can remove it.
import { toast } from "sonner";
import { Sparkles, Calendar, Plus, Trash2 } from "lucide-react";

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
  boxShadow:
    "0 10px 40px -10px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.05)",
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
  transition: "all 0.2s ease",
};

export default function MenuCreatePage() {
  const today = new Date().toISOString().slice(0, 10);
  const [date, setDate] = useState(today);
  const [notes, setNotes] = useState("");
  const [published, setPublished] = useState(true);
  const [busy, setBusy] = useState(false);
  const [meals, setMeals] = useState(
    CATEGORIES.map((c) => ({
      category: c,
      startTime: DEFAULT_TIMES[c].start,
      endTime: DEFAULT_TIMES[c].end,
      items: [{ name: "" }],
      serving: true,
    })),
  );

  const addItem = (catIdx) => {
    setMeals((prev) =>
      prev.map((m, i) =>
        i === catIdx ? { ...m, items: [...m.items, { name: "" }] } : m,
      ),
    );
  };
  const removeItem = (catIdx, itemIdx) => {
    setMeals((prev) =>
      prev.map((m, i) =>
        i === catIdx
          ? { ...m, items: m.items.filter((_, j) => j !== itemIdx) }
          : m,
      ),
    );
  };
  const updateItem = (catIdx, itemIdx, name) => {
    setMeals((prev) =>
      prev.map((m, i) =>
        i === catIdx
          ? {
              ...m,
              items: m.items.map((it, j) => (j === itemIdx ? { name } : it)),
            }
          : m,
      ),
    );
  };

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      const cleanMeals = meals.map((m) => ({
        ...m,
        items: m.items
          .filter((it) => it.name.trim())
          .map((it) => ({
            name: it.name.trim(),
            dietary: "veg",
            allergens: [],
            special: false,
          })),
      }));
      const res = await fetch(
        (import.meta.env.VITE_API_URL || "/api/v1") + "/menus",
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            "X-CSRF-Token":
              (document.cookie.match(/(?:^|;\s*)csrf_token=([^;]+)/) ||
                [])[1] || "",
          },
          body: JSON.stringify({ date, meals: cleanMeals, notes, published }),
        },
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed");
      toast.success("Menu created for " + date);
      setNotes("");
    } catch (err) {
      toast.error(err.message || "Failed to create menu");
    } finally {
      setBusy(false);
    }
  };

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
          <Sparkles size={14} /> MENU ARCHITECT
        </div>
        <h1
          style={{
            margin: 0,
            fontSize: "2rem",
            fontWeight: 800,
            letterSpacing: "-0.03em",
          }}
        >
          Create Menu
        </h1>
        <p style={{ margin: "8px 0 0", fontSize: 14, color: "#94a3b8" }}>
          Publish today's menu - meal sessions auto-create
        </p>
      </header>

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
                Date
              </span>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                style={inputStyle}
              />
            </label>
            <label style={{ display: "grid", gap: 8 }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: "#cbd5e1" }}>
                Notes (optional)
              </span>
              <input
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. Special dinner!"
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
                Publish immediately
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
                  Start Time
                </span>
                <input
                  type="time"
                  value={meal.startTime}
                  onChange={(e) =>
                    setMeals((prev) =>
                      prev.map((m, i) =>
                        i === catIdx ? { ...m, startTime: e.target.value } : m,
                      ),
                    )
                  }
                  style={inputStyle}
                />
              </label>
              <label style={{ display: "grid", gap: 8 }}>
                <span
                  style={{ fontSize: 13, fontWeight: 600, color: "#cbd5e1" }}
                >
                  End Time
                </span>
                <input
                  type="time"
                  value={meal.endTime}
                  onChange={(e) =>
                    setMeals((prev) =>
                      prev.map((m, i) =>
                        i === catIdx ? { ...m, endTime: e.target.value } : m,
                      ),
                    )
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
              Food Items
            </p>

            {meal.items.map((item, itemIdx) => (
              <div
                key={itemIdx}
                style={{ display: "flex", gap: 10, marginBottom: 10 }}
              >
                <input
                  value={item.name}
                  onChange={(e) => updateItem(catIdx, itemIdx, e.target.value)}
                  placeholder="e.g. Idli, Sambar, Paneer"
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
              <Plus size={14} /> Add Item
            </button>
          </div>
        ))}

        <div
          style={{ marginTop: 24, display: "flex", justifyContent: "flex-end" }}
        >
          <button
            type="submit"
            disabled={busy}
            style={{
              padding: "14px 32px",
              borderRadius: 12,
              background: "linear-gradient(135deg, #10b981, #059669)",
              color: "#022c22",
              fontWeight: 800,
              fontSize: 15,
              border: "none",
              cursor: busy ? "not-allowed" : "pointer",
              boxShadow: "0 8px 25px rgba(16, 185, 129, 0.4)",
              transition: "all 0.2s",
            }}
          >
            {busy ? "Creating..." : "Create Menu"}
          </button>
        </div>
      </form>
    </div>
  );
}
