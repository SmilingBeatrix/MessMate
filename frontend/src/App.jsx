import { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useMeQuery } from "./app/api.js";
import { setUser } from "./features/auth/authSlice.js";
import { useProactiveRefresh } from "./hooks/useProactiveRefresh.js";

// Public & Auth Modules
import LandingPage from "./pages/public/LandingPage.jsx";
import RegisterPage from "./pages/public/RegisterPage.jsx";
import LoginPage from "./pages/auth/LoginPage.jsx";
import ChooseMessSystemPage from "./pages/auth/ChooseMessSystemPage.jsx";
import GroundFloorEnrollPage from "./pages/student/GroundFloorEnrollPage.jsx";

// Core Shell
import AppLayout from "./components/layout/AppLayout.jsx";

// Student Modules
import DashboardPage from "./pages/student/DashboardPage.jsx";
import MenuPage from "./pages/student/MenuPage.jsx";
import BillsPage from "./pages/student/BillsPage.jsx";
import AttendancePage from "./pages/student/AttendancePage.jsx";
import ComplaintsPage from "./pages/student/ComplaintsPage.jsx";
import RefundRequestPage from "./pages/student/RefundRequestPage.jsx";
import FeedbackPage from "./pages/student/FeedbackPage.jsx";

// Staff Modules
import ScanPage from "./pages/staff/ScanPage.jsx";
import WastagePage from "./pages/staff/WastagePage.jsx";
import RequestInventoryPage from "./pages/staff/RequestInventoryPage.jsx";
import LeavePage from "./pages/staff/LeavePage.jsx";

// Admin & Warden Modules
import UsersPage from "./pages/admin/UsersPage.jsx";
import PricingPage from "./pages/admin/PricingPage.jsx";
import AnnouncementsPage from "./pages/admin/AnnouncementsPage.jsx";
import AdminComplaintsPage from "./pages/admin/AdminComplaintsPage.jsx";
import InventoryRequestsPage from "./pages/admin/InventoryRequestsPage.jsx";
import MenuHistoryPage from "./pages/admin/MenuHistoryPage.jsx";
import MenuFormPage from "./pages/admin/MenuFormPage.jsx";
import TransactionsPage from "./pages/admin/TransactionsPage.jsx";
import AnalyticsPage from "./pages/warden/AnalyticsPage.jsx";

export default function App() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const hydrated = useSelector((state) => state.auth.hydrated);
  const { data: sessionPayload } = useMeQuery();

  useProactiveRefresh();

  useEffect(() => {
    if (sessionPayload?.data?.user) {
      dispatch(setUser(sessionPayload.data.user));
    }
  }, [sessionPayload, dispatch]);

  if (!hydrated) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#090d16",
          color: "#f8fafc",
          gap: "14px",
          fontFamily: "system-ui, -apple-system, sans-serif",
        }}
      >
        <div
          style={{
            width: 44,
            height: 44,
            borderRadius: 12,
            background: "linear-gradient(135deg, #10b981, #059669)",
            display: "grid",
            placeItems: "center",
            fontWeight: 800,
            fontSize: 18,
            color: "#022c22",
            boxShadow: "0 0 25px rgba(16, 185, 129, 0.4)",
          }}
        >
          M²
        </div>
        <div
          style={{
            color: "#94a3b8",
            fontSize: 13,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
          }}
        >
          Initializing MessMatrix Core...
        </div>
      </div>
    );
  }

  const requiresTierAllocation =
    user && user.role === "student" && !user.messSystem;
  const defaultRoute = requiresTierAllocation ? "/choose-system" : "/dashboard";

  return (
    <Routes>
      {/* Public Entry Routes */}
      <Route
        path="/"
        element={
          user ? <Navigate to={defaultRoute} replace /> : <LandingPage />
        }
      />
      <Route
        path="/login"
        element={user ? <Navigate to={defaultRoute} replace /> : <LoginPage />}
      />
      <Route
        path="/register"
        element={
          user ? <Navigate to={defaultRoute} replace /> : <RegisterPage />
        }
      />

      {/* Onboarding & Dining Tier Allocation */}
      <Route
        path="/choose-system"
        element={
          user ? <ChooseMessSystemPage /> : <Navigate to="/login" replace />
        }
      />
      <Route
        path="/ground-floor/enroll"
        element={
          user ? <GroundFloorEnrollPage /> : <Navigate to="/login" replace />
        }
      />

      {/* Protected Workspace Shell */}
      <Route
        element={
          !user ? (
            <Navigate to="/login" replace />
          ) : requiresTierAllocation ? (
            <Navigate to="/choose-system" replace />
          ) : (
            <AppLayout />
          )
        }
      >
        {/* Student Portal */}
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/menu" element={<MenuPage />} />
        <Route path="/bills" element={<BillsPage />} />
        <Route path="/attendance" element={<AttendancePage />} />
        <Route path="/complaints" element={<ComplaintsPage />} />
        <Route path="/refunds" element={<RefundRequestPage />} />
        <Route path="/feedback" element={<FeedbackPage />} />

        {/* Kitchen & Caterer Staff */}
        <Route path="/scan" element={<ScanPage />} />
        <Route path="/wastage" element={<WastagePage />} />
        <Route path="/staff/leaves" element={<LeavePage />} />
        <Route
          path="/staff/request-inventory"
          element={<RequestInventoryPage />}
        />

        {/* Mess Administration */}
        <Route path="/inventory-requests" element={<InventoryRequestsPage />} />
        <Route path="/admin/menus" element={<MenuHistoryPage />} />
        <Route path="/admin/menus/new" element={<MenuFormPage />} />
        <Route path="/admin/menus/:id" element={<MenuFormPage />} />
        <Route path="/admin/transactions" element={<TransactionsPage />} />
        <Route path="/admin/users" element={<UsersPage />} />
        <Route path="/admin/pricing" element={<PricingPage />} />
        <Route path="/admin/announcements" element={<AnnouncementsPage />} />
        <Route path="/admin/complaints" element={<AdminComplaintsPage />} />

        {/* Warden Executive View */}
        <Route path="/warden/analytics" element={<AnalyticsPage />} />
      </Route>

      {/* Catch-All Fallback */}
      <Route
        path="*"
        element={<Navigate to={user ? defaultRoute : "/"} replace />}
      />
    </Routes>
  );
}
