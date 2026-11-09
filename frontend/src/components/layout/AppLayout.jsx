import React from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useLogoutMutation } from "../../app/api.js";
import { clearUser } from "../../features/auth/authSlice.js";
import NotificationBell from "./NotificationBell.jsx";
import { LogOut } from "lucide-react";

const ROLE_NAV_MAP = {
  student: [
    { to: "/dashboard", label: "Matrix Hub" },
    { to: "/menu", label: "Meal Radar" },
    { to: "/attendance", label: "Gate Pass" },
    { to: "/bills", label: "Ledger" },
    { to: "/refunds", label: "Rebates" },
    { to: "/complaints", label: "Helpdesk" },
    { to: "/feedback", label: "Ratings" },
  ],
  staff: [
    { to: "/dashboard", label: "Overview" },
    { to: "/scan", label: "QR Validator" },
    { to: "/wastage", label: "Bio-Wastage" },
    { to: "/staff/request-inventory", label: "Requisition" },
    { to: "/staff/leaves", label: "Shift Leave" },
  ],
  admin: [
    { to: "/dashboard", label: "Command Hub" },
    { to: "/admin/menus", label: "Menu Architect" },
    { to: "/admin/transactions", label: "Transactions" },
    { to: "/admin/pricing", label: "Tier Pricing" },
    { to: "/inventory-requests", label: "Supply Chain" },
    { to: "/admin/complaints", label: "Disputes" },
    { to: "/admin/announcements", label: "Broadcasts" },
    { to: "/admin/users", label: "Directory" },
  ],
  warden: [
    { to: "/dashboard", label: "Overview" },
    { to: "/warden/analytics", label: "Telemetry" },
  ],
};

export default function AppLayout() {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [logout] = useLogoutMutation();

  const role = user?.role?.toLowerCase() || "student";
  const navItems = ROLE_NAV_MAP[role] || ROLE_NAV_MAP.student;
  const initial = user?.name ? user.name.charAt(0).toUpperCase() : "?";

  const handleSignOut = async () => {
    try {
      await logout().unwrap();
    } catch {
      // Proceed with local state cleanup even if network call fails
    }
    dispatch(clearUser());
    navigate("/login", { replace: true });
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#060b14",
        // This creates the rich, non-blackish vibrant glow
        backgroundImage: `
          radial-gradient(at 0% 0%, hsla(161, 74%, 45%, 0.15) 0px, transparent 50%),
          radial-gradient(at 100% 0%, hsla(242, 48%, 53%, 0.12) 0px, transparent 50%),
          radial-gradient(at 50% 100%, hsla(200, 70%, 50%, 0.08) 0px, transparent 50%)
        `,
        backgroundAttachment: "fixed",
        color: "#f8fafc",
        fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
        colorScheme: "dark",
      }}
    >
      {/* CSS for Hover Effects */}
      <style>
        {`
          .nav-item:hover { color: #f8fafc !important; background: rgba(255,255,255,0.08) !important; }
          .user-avatar { transition: transform 0.2s ease, box-shadow 0.2s ease; }
          .user-avatar:hover { transform: scale(1.05); box-shadow: 0 0 20px rgba(139, 92, 246, 0.5); }
          .logout-btn:hover { background: rgba(239, 68, 68, 0.2) !important; border-color: rgba(239, 68, 68, 0.5) !important; }
        `}
      </style>

      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 50,
          background: "rgba(6, 11, 20, 0.75)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          borderBottom: "1px solid rgba(255, 255, 255, 0.06)",
          boxShadow: "0 4px 30px rgba(0, 0, 0, 0.3)",
          padding: "0.8rem 2rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "1rem",
        }}
      >
        {/* Brand */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
            cursor: "pointer",
          }}
          onClick={() => navigate("/dashboard")}
        >
          <div
            style={{
              width: "38px",
              height: "38px",
              borderRadius: "10px",
              background: "linear-gradient(135deg, #10b981, #059669)",
              display: "grid",
              placeItems: "center",
              fontWeight: 800,
              color: "#022c22",
              fontSize: "1.1rem",
              boxShadow: "0 0 15px rgba(16, 185, 129, 0.4)",
            }}
          >
            M²
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span
              style={{
                fontWeight: 800,
                fontSize: "1.15rem",
                letterSpacing: "-0.02em",
                lineHeight: 1.1,
              }}
            >
              MESS<span style={{ color: "#10b981" }}>MATRIX</span>
            </span>
            <span
              style={{
                fontSize: "0.65rem",
                color: "#64748b",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                fontWeight: 700,
              }}
            >
              {role} Node
            </span>
          </div>
        </div>

        {/* Navigation Pills */}
        <nav
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.25rem",
            background: "rgba(15, 23, 42, 0.5)",
            padding: "0.3rem",
            borderRadius: "12px",
            border: "1px solid rgba(255, 255, 255, 0.05)",
            overflowX: "auto",
            maxWidth: "100%",
          }}
        >
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className="nav-item"
              style={({ isActive }) => ({
                padding: "0.45rem 1rem",
                borderRadius: "8px",
                fontSize: "0.85rem",
                fontWeight: 600,
                whiteSpace: "nowrap",
                textDecoration: "none",
                color: isActive ? "#022c22" : "#94a3b8",
                background: isActive
                  ? "linear-gradient(135deg, #10b981, #059669)"
                  : "transparent",
                boxShadow: isActive
                  ? "0 2px 15px rgba(16, 185, 129, 0.4)"
                  : "none",
                transition: "all 0.2s ease",
              })}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Right Section */}
        <div style={{ display: "flex", alignItems: "center", gap: "1.25rem" }}>
          <NotificationBell />

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
              borderLeft: "1px solid rgba(255,255,255,0.1)",
              paddingLeft: "1.25rem",
            }}
          >
            <div
              className="user-avatar"
              style={{
                width: "38px",
                height: "38px",
                borderRadius: "50%",
                background: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
                display: "grid",
                placeItems: "center",
                fontWeight: 800,
                color: "#fff",
                boxShadow: "0 0 15px rgba(139, 92, 246, 0.4)",
              }}
            >
              {initial}
            </div>
            <div
              style={{
                textAlign: "right",
                fontSize: "0.82rem",
                lineHeight: 1.3,
              }}
            >
              <div style={{ fontWeight: 700, color: "#f8fafc" }}>
                {user?.name || "Member"}
              </div>
              <div
                style={{
                  color: "#94a3b8",
                  fontSize: "0.72rem",
                  fontFamily: "monospace",
                }}
              >
                {user?.email}
              </div>
            </div>
            <button
              onClick={handleSignOut}
              title="Terminate Session"
              className="logout-btn"
              style={{
                background: "rgba(239, 68, 68, 0.1)",
                border: "1px solid rgba(239, 68, 68, 0.2)",
                color: "#f87171",
                padding: "0.5rem",
                borderRadius: "8px",
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                transition: "all 0.2s ease",
              }}
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </header>

      <main style={{ paddingBottom: "3rem" }}>
        <Outlet />
      </main>
    </div>
  );
}
