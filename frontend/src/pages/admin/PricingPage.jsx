import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  useListSettingsQuery,
  useUpsertSettingMutation,
} from "../../app/api.js";
import { toast } from "sonner";
import {
  Save,
  Egg,
  Utensils,
  Cookie,
  Moon,
  Building2,
  IndianRupee,
  ShieldAlert,
  Sparkles,
} from "lucide-react";

const MEAL_KEYS = ["breakfast", "lunch", "snacks", "dinner"];
const MEAL_META = {
  breakfast: {
    label: "Breakfast",
    icon: Egg,
    time: "8:00 - 10:00 AM",
    color: "#f59e0b",
  },
  lunch: {
    label: "Lunch",
    icon: Utensils,
    time: "12:00 - 2:00 PM",
    color: "#10b981",
  },
  snacks: {
    label: "Snacks",
    icon: Cookie,
    time: "5:00 - 6:00 PM",
    color: "#38bdf8",
  },
  dinner: {
    label: "Dinner",
    icon: Moon,
    time: "7:30 - 9:30 PM",
    color: "#8b5cf6",
  },
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
  padding: "28px",
  marginBottom: "24px",
};

const inputStyle = {
  width: "100%",
  padding: "12px 16px",
  borderRadius: "10px",
  background: "rgba(9, 13, 22, 0.7)",
  border: "1px solid rgba(255,255,255,0.1)",
  color: "#f8fafc",
  fontSize: 16,
  fontWeight: 700,
  outline: "none",
  colorScheme: "dark",
  transition: "all 0.2s ease",
};

export default function PricingPage() {
  const user = useSelector((s) => s.auth.user);
  const { data, isLoading, refetch } = useListSettingsQuery(undefined, {
    skip: user?.role !== "admin",
  });
  const [upsert, { isLoading: saving }] = useUpsertSettingMutation();

  const [perMeal, setPerMeal] = useState({
    breakfast: 40,
    lunch: 80,
    snacks: 30,
    dinner: 90,
  });
  const [gfFee, setGfFee] = useState(25000);
  const [loaded, setLoaded] = useState(false);

  if (user?.role !== "admin") {
    return (
      <div style={{ maxWidth: 500, margin: "100px auto", textAlign: "center" }}>
        <div style={{ ...glassCard, borderTop: "4px solid #ef4444" }}>
          <ShieldAlert
            size={48}
            color="#ef4444"
            style={{ margin: "0 auto 16px" }}
          />
          <h2 style={{ margin: "0 0 8px", fontSize: 22, fontWeight: 800 }}>
            Admin Access Required
          </h2>
          <p style={{ margin: 0, color: "#94a3b8", fontSize: 14 }}>
            Only the Super Admin can modify mess pricing. Mess Secretaries do
            not have this permission.
          </p>
        </div>
      </div>
    );
  }

  useEffect(() => {
    if (data?.data?.settings && !loaded) {
      const settings = data.data.settings;
      const pm = settings.find((x) => x.key === "billing.perMealPrice");
      const gf = settings.find((x) => x.key === "groundFloor.fee");
      if (pm && pm.value) {
        setPerMeal({
          breakfast: Number(pm.value.breakfast ?? 40),
          lunch: Number(pm.value.lunch ?? 80),
          snacks: Number(pm.value.snacks ?? 30),
          dinner: Number(pm.value.dinner ?? 90),
        });
      }
      if (gf && gf.value) setGfFee(Number(gf.value) || 25000);
      setLoaded(true);
    }
  }, [data, loaded]);

  const updateMeal = (key, value) => {
    setPerMeal((prev) => ({
      ...prev,
      [key]: value === "" ? "" : Number(value),
    }));
  };

  const save = async () => {
    for (const k of MEAL_KEYS) {
      if (perMeal[k] === "" || Number(perMeal[k]) < 0) {
        toast.error(`Invalid ${k} price`);
        return;
      }
    }
    if (gfFee === "" || Number(gfFee) < 0) {
      toast.error("Invalid ground floor fee");
      return;
    }

    try {
      await upsert({
        key: "billing.perMealPrice",
        value: {
          breakfast: Number(perMeal.breakfast),
          lunch: Number(perMeal.lunch),
          snacks: Number(perMeal.snacks),
          dinner: Number(perMeal.dinner),
        },
        category: "billing",
        description: "Per-meal price (INR)",
      }).unwrap();

      await upsert({
        key: "groundFloor.fee",
        value: Number(gfFee),
        category: "billing",
        description: "Ground floor semester fee (INR)",
      }).unwrap();

      toast.success("Prices updated successfully");
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || "Failed to save prices");
    }
  };

  if (isLoading && !loaded) {
    return (
      <div style={{ padding: 40, color: "#94a3b8" }}>
        Loading pricing telemetry...
      </div>
    );
  }

  const totalDaily = Object.values(perMeal).reduce(
    (s, v) => s + (Number(v) || 0),
    0,
  );

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "32px 24px" }}>
      <style>
        {`
          .matrix-input:focus {
            border-color: rgba(16, 185, 129, 0.6) !important;
            box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.15) !important;
          }
        `}
      </style>

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
            boxShadow: "0 0 15px rgba(16, 185, 129, 0.2)",
          }}
        >
          <Sparkles size={14} /> REVENUE MATRIX
        </div>
        <h1
          style={{
            margin: 0,
            fontSize: "2rem",
            fontWeight: 800,
            letterSpacing: "-0.03em",
          }}
        >
          Pricing Settings
        </h1>
        <p style={{ margin: "8px 0 0", fontSize: 14, color: "#94a3b8" }}>
          Configure per-meal prices for the 1st Floor and the semester fee for
          the Ground Floor.
        </p>
      </header>

      {/* 1st Floor Pricing Section */}
      <section style={glassCard}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            marginBottom: 8,
          }}
        >
          <div
            style={{
              padding: 8,
              background: "rgba(16, 185, 129, 0.15)",
              borderRadius: 10,
            }}
          >
            <Utensils size={20} color="#10b981" />
          </div>
          <div>
            <h2 style={{ margin: 0, fontSize: 18, fontWeight: 800 }}>
              1st Floor - Per Meal Pricing
            </h2>
            <p style={{ margin: "2px 0 0", fontSize: 13, color: "#64748b" }}>
              Used when students register for daily meals.
            </p>
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: 16,
            marginTop: 24,
          }}
        >
          {MEAL_KEYS.map((key) => {
            const meta = MEAL_META[key];
            const Icon = meta.icon;
            return (
              <div
                key={key}
                style={{
                  padding: 20,
                  borderRadius: 14,
                  background: "rgba(15, 23, 42, 0.4)",
                  border: "1px solid rgba(255,255,255,0.05)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    marginBottom: 12,
                  }}
                >
                  <Icon size={18} color={meta.color} />
                  <strong style={{ fontSize: 14, color: "#f8fafc" }}>
                    {meta.label}
                  </strong>
                </div>
                <div
                  style={{
                    fontSize: 11,
                    color: "#64748b",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                  }}
                >
                  {meta.time}
                </div>

                <label style={{ display: "block", marginTop: 16 }}>
                  <div
                    style={{
                      fontSize: 12,
                      color: "#94a3b8",
                      fontWeight: 600,
                      marginBottom: 6,
                    }}
                  >
                    Price (INR)
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      position: "relative",
                    }}
                  >
                    <IndianRupee
                      size={16}
                      color="#64748b"
                      style={{ position: "absolute", left: 12 }}
                    />
                    <input
                      type="number"
                      min="0"
                      step="1"
                      className="matrix-input"
                      value={perMeal[key]}
                      onChange={(e) => updateMeal(key, e.target.value)}
                      style={{ ...inputStyle, paddingLeft: 36 }}
                    />
                  </div>
                </label>
              </div>
            );
          })}
        </div>

        <div
          style={{
            marginTop: 24,
            padding: "16px 20px",
            background: "rgba(16, 185, 129, 0.08)",
            border: "1px solid rgba(16, 185, 129, 0.2)",
            borderRadius: 10,
            fontSize: 14,
            color: "#cbd5e1",
          }}
        >
          Daily Total: If a student eats all 4 meals in one day, they pay{" "}
          <strong style={{ color: "#10b981", fontSize: 16 }}>
            ₹{totalDaily}
          </strong>
          .
        </div>
      </section>

      {/* Ground Floor Pricing Section */}
      <section style={{ ...glassCard, borderLeft: "4px solid #f59e0b" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            marginBottom: 8,
          }}
        >
          <div
            style={{
              padding: 8,
              background: "rgba(245, 158, 11, 0.15)",
              borderRadius: 10,
            }}
          >
            <Building2 size={20} color="#f59e0b" />
          </div>
          <div>
            <h2 style={{ margin: 0, fontSize: 18, fontWeight: 800 }}>
              Ground Floor - Semester Fee
            </h2>
            <p style={{ margin: "2px 0 0", fontSize: 13, color: "#64748b" }}>
              One-time enrollment fee for the ground floor dining tier.
            </p>
          </div>
        </div>

        <label style={{ display: "block", maxWidth: 320, marginTop: 24 }}>
          <div
            style={{
              fontSize: 12,
              color: "#94a3b8",
              fontWeight: 600,
              marginBottom: 8,
            }}
          >
            Semester Fee (INR)
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              position: "relative",
            }}
          >
            <IndianRupee
              size={20}
              color="#f59e0b"
              style={{ position: "absolute", left: 14 }}
            />
            <input
              type="number"
              min="0"
              step="100"
              className="matrix-input"
              value={gfFee}
              onChange={(e) =>
                setGfFee(e.target.value === "" ? "" : Number(e.target.value))
              }
              style={{
                ...inputStyle,
                paddingLeft: 40,
                fontSize: 20,
                color: "#fbbf24",
              }}
            />
          </div>
        </label>
      </section>

      {/* Actions */}
      <div
        style={{
          display: "flex",
          gap: 16,
          justifyContent: "flex-end",
          alignItems: "center",
          marginTop: 8,
        }}
      >
        <button
          onClick={() => refetch()}
          style={{
            background: "transparent",
            border: "none",
            color: "#94a3b8",
            fontWeight: 600,
            cursor: "pointer",
            fontSize: 14,
          }}
        >
          Refresh Data
        </button>
        <button
          onClick={save}
          disabled={saving}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            padding: "14px 32px",
            borderRadius: 12,
            background: "linear-gradient(135deg, #10b981, #059669)",
            color: "#022c22",
            fontWeight: 800,
            fontSize: 15,
            border: "none",
            cursor: saving ? "not-allowed" : "pointer",
            boxShadow: "0 8px 25px rgba(16, 185, 129, 0.4)",
            transition: "all 0.2s",
          }}
        >
          <Save size={18} /> {saving ? "Saving..." : "Save All Prices"}
        </button>
      </div>

      <p
        style={{
          textAlign: "right",
          fontSize: 12,
          color: "#64748b",
          marginTop: 16,
        }}
      >
        Changes take effect immediately for new registrations.
      </p>
    </div>
  );
}
