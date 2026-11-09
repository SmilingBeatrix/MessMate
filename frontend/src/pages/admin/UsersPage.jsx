import { useState } from "react";
import { useListUsersQuery, useSetUserStatusMutation } from "../../app/api.js";
import { toast } from "sonner";
import {
  Check,
  RotateCcw,
  Ban,
  Users,
  Sparkles,
  ShieldAlert,
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

export default function UsersPage() {
  const { data, isLoading, refetch } = useListUsersQuery({});
  const [setStatus] = useSetUserStatusMutation();
  const [filter, setFilter] = useState("all");

  const users = (data?.data?.users || []).filter(
    (u) => filter === "all" || u.status === filter || u.role === filter,
  );

  const change = async (id, status, name) => {
    if (
      status === "suspended" &&
      !confirm("Suspend " + name + "? They will not be able to login.")
    )
      return;
    try {
      await setStatus({ id, status }).unwrap();
      toast.success(name + " is now " + status);
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || "Failed to update");
    }
  };

  const filters = [
    { value: "all", label: "All" },
    { value: "pending", label: "Pending" },
    { value: "active", label: "Active" },
    { value: "suspended", label: "Suspended" },
    { value: "student", label: "Students" },
    { value: "mess_committee", label: "Admins" },
    { value: "staff", label: "Staff" },
  ];

  // Helper for role colors
  const getRoleBadge = (role) => {
    const r = role
      .replace(/_/g, " ")
      .replace("mess committee", "mess secretary")
      .toUpperCase();
    switch (role) {
      case "admin":
        return {
          bg: "rgba(139, 92, 246, 0.15)",
          color: "#c4b5fd",
          border: "rgba(139, 92, 246, 0.3)",
        };
      case "mess_committee":
        return {
          bg: "rgba(56, 189, 248, 0.15)",
          color: "#7dd3fc",
          border: "rgba(56, 189, 248, 0.3)",
        };
      case "staff":
        return {
          bg: "rgba(245, 158, 11, 0.15)",
          color: "#fbbf24",
          border: "rgba(245, 158, 11, 0.3)",
        };
      default:
        return {
          bg: "rgba(255, 255, 255, 0.05)",
          color: "#cbd5e1",
          border: "rgba(255, 255, 255, 0.1)",
        };
    }
  };

  // Helper for status colors
  const getStatusBadge = (status) => {
    switch (status) {
      case "active":
        return {
          bg: "rgba(16, 185, 129, 0.15)",
          color: "#34d399",
          border: "rgba(16, 185, 129, 0.3)",
        };
      case "pending":
        return {
          bg: "rgba(245, 158, 11, 0.15)",
          color: "#fbbf24",
          border: "rgba(245, 158, 11, 0.3)",
        };
      case "suspended":
        return {
          bg: "rgba(239, 68, 68, 0.15)",
          color: "#f87171",
          border: "rgba(239, 68, 68, 0.3)",
        };
      default:
        return {
          bg: "rgba(255, 255, 255, 0.05)",
          color: "#94a3b8",
          border: "rgba(255, 255, 255, 0.1)",
        };
    }
  };

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "32px 24px" }}>
      {/* Header */}
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
          <Users size={14} /> IDENTITY MATRIX
        </div>
        <h1
          style={{
            margin: 0,
            fontSize: "2rem",
            fontWeight: 800,
            letterSpacing: "-0.03em",
          }}
        >
          User Management
        </h1>
        <p style={{ margin: "8px 0 0", fontSize: 14, color: "#94a3b8" }}>
          Approve, suspend, or reactivate any campus account.
        </p>
      </header>

      {/* Filter Tabs */}
      <div
        style={{ display: "flex", gap: 10, marginBottom: 24, flexWrap: "wrap" }}
      >
        {filters.map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            style={{
              padding: "8px 20px",
              borderRadius: 10,
              fontSize: 14,
              fontWeight: 700,
              cursor: "pointer",
              border: "1px solid",
              background:
                filter === f.value
                  ? "rgba(16, 185, 129, 0.15)"
                  : "rgba(255,255,255,0.03)",
              borderColor:
                filter === f.value
                  ? "rgba(16, 185, 129, 0.4)"
                  : "rgba(255,255,255,0.08)",
              color: filter === f.value ? "#34d399" : "#94a3b8",
              transition: "all 0.2s",
            }}
          >
            {f.label}
          </button>
        ))}
      </div>

      {isLoading ? (
        <p style={{ color: "#94a3b8" }}>Loading directory...</p>
      ) : users.length === 0 ? (
        <div style={{ ...glassCard, padding: 60, textAlign: "center" }}>
          <ShieldAlert
            size={48}
            color="#334155"
            style={{ margin: "0 auto 16px" }}
          />
          <p style={{ color: "#94a3b8", fontSize: 15 }}>
            No users match this filter.
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
                    Name
                  </th>
                  <th
                    style={{
                      padding: "16px 20px",
                      fontSize: 13,
                      fontWeight: 700,
                      color: "#94a3b8",
                    }}
                  >
                    Email
                  </th>
                  <th
                    style={{
                      padding: "16px 20px",
                      fontSize: 13,
                      fontWeight: 700,
                      color: "#94a3b8",
                    }}
                  >
                    Role
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
                      textAlign: "right",
                    }}
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => {
                  const isWarden = u.role === "admin";
                  const roleBadge = getRoleBadge(u.role);
                  const statusBadge = getStatusBadge(u.status);

                  return (
                    <tr
                      key={u._id}
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
                          {u.name}
                        </div>
                        {u.studentId && (
                          <div
                            style={{
                              fontSize: 12,
                              color: "#64748b",
                              fontFamily: "monospace",
                              marginTop: 2,
                            }}
                          >
                            {u.studentId}
                          </div>
                        )}
                      </td>
                      <td
                        style={{
                          padding: "16px 20px",
                          fontSize: 13.5,
                          color: "#cbd5e1",
                        }}
                      >
                        {u.email}
                      </td>
                      <td style={{ padding: "16px 20px" }}>
                        <span
                          style={{
                            fontSize: 11,
                            fontWeight: 800,
                            background: roleBadge.bg,
                            color: roleBadge.color,
                            border: `1px solid ${roleBadge.border}`,
                            padding: "4px 10px",
                            borderRadius: 6,
                          }}
                        >
                          {u.role
                            .replace(/_/g, " ")
                            .replace("mess committee", "mess secretary")
                            .toUpperCase()}
                        </span>
                      </td>
                      <td style={{ padding: "16px 20px" }}>
                        <span
                          style={{
                            fontSize: 11,
                            fontWeight: 800,
                            background: statusBadge.bg,
                            color: statusBadge.color,
                            border: `1px solid ${statusBadge.border}`,
                            padding: "4px 10px",
                            borderRadius: 6,
                            textTransform: "uppercase",
                          }}
                        >
                          {u.status}
                        </span>
                      </td>
                      <td style={{ padding: "16px 20px" }}>
                        <div
                          style={{
                            display: "flex",
                            gap: 8,
                            justifyContent: "flex-end",
                          }}
                        >
                          {u.status === "pending" && (
                            <button
                              onClick={() => change(u._id, "active", u.name)}
                              style={{
                                padding: "6px 12px",
                                borderRadius: 6,
                                background: "rgba(16, 185, 129, 0.15)",
                                color: "#34d399",
                                border: "1px solid rgba(16, 185, 129, 0.3)",
                                cursor: "pointer",
                                fontSize: 12,
                                fontWeight: 700,
                                display: "flex",
                                alignItems: "center",
                                gap: 4,
                              }}
                            >
                              <Check size={12} /> Approve
                            </button>
                          )}
                          {u.status === "active" && !isWarden && (
                            <button
                              onClick={() => change(u._id, "suspended", u.name)}
                              style={{
                                padding: "6px 12px",
                                borderRadius: 6,
                                background: "rgba(239, 68, 68, 0.15)",
                                color: "#f87171",
                                border: "1px solid rgba(239, 68, 68, 0.3)",
                                cursor: "pointer",
                                fontSize: 12,
                                fontWeight: 700,
                                display: "flex",
                                alignItems: "center",
                                gap: 4,
                              }}
                            >
                              <Ban size={12} /> Suspend
                            </button>
                          )}
                          {u.status === "suspended" && (
                            <button
                              onClick={() => change(u._id, "active", u.name)}
                              style={{
                                padding: "6px 12px",
                                borderRadius: 6,
                                background: "rgba(56, 189, 248, 0.15)",
                                color: "#38bdf8",
                                border: "1px solid rgba(56, 189, 248, 0.3)",
                                cursor: "pointer",
                                fontSize: 12,
                                fontWeight: 700,
                                display: "flex",
                                alignItems: "center",
                                gap: 4,
                              }}
                            >
                              <RotateCcw size={12} /> Reactivate
                            </button>
                          )}
                          {isWarden && u.status === "active" && (
                            <span
                              style={{
                                fontSize: 11,
                                color: "#64748b",
                                fontStyle: "italic",
                                paddingRight: 10,
                              }}
                            >
                              Super Admin
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
