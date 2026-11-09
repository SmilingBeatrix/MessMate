import { Link } from "react-router-dom";
import {
  Utensils,
  QrCode,
  Receipt,
  MessageSquare,
  BarChart3,
  ShieldCheck,
  Package,
  ArrowRight,
  Check,
  Lock,
  Zap,
  Star,
  GraduationCap,
  Building2,
  UserCog,
  Sparkles,
  Activity,
} from "lucide-react";

const MATRIX_CAPABILITIES = [
  {
    icon: Utensils,
    tag: "MENU ENGINE",
    title: "Live Meal Radar & Scheduling",
    desc: "Real-time meal schedules across Breakfast, Lunch, Snacks, and Dinner with dynamic dietary tags and cutoff timers.",
  },
  {
    icon: QrCode,
    tag: "ZERO-TRUST ENTRY",
    title: "Cryptographic QR Gate Passes",
    desc: "Time-bound, signed digital tokens that eliminate screenshot fraud and verify student dining access in under 300ms.",
  },
  {
    icon: Receipt,
    tag: "LEDGER SYNC",
    title: "Automated Rebate & Split Billing",
    desc: "Dual-tier billing supporting both Ground Floor semester plans and 1st Floor pay-per-meal dynamic ledgers.",
  },
  {
    icon: MessageSquare,
    tag: "SLA HELPDESK",
    title: "Priority Grievance Escalation",
    desc: "Direct student-to-committee escalation tickets with photographic proof, status timelines, and warden oversight.",
  },
  {
    icon: Package,
    tag: "SUPPLY CHAIN",
    title: "Kitchen Stock & Bio-Wastage",
    desc: "End-to-end ration requisitioning, low-inventory triggers, and daily post-meal food wastage telemetry.",
  },
  {
    icon: BarChart3,
    tag: "WARDEN TELEMETRY",
    title: "Executive Campus Analytics",
    desc: "High-level institutional dashboards tracking daily footfall, revenue collection, and caterer rating trends.",
  },
];

const WORKFLOW_NODES = [
  {
    step: "NODE 01",
    title: "Menu Broadcast & Tier Selection",
    desc: "Admins publish daily menus while students enroll in either the Semester Subscription (Ground Floor) or Dynamic Modular Mess (1st Floor).",
  },
  {
    step: "NODE 02",
    title: "Pre-Cutoff Slot Locking",
    desc: "Students lock in upcoming meals or submit leave/rebate requests from their dashboard so the kitchen prepares exact quantities.",
  },
  {
    step: "NODE 03",
    title: "Instant Optical Validation",
    desc: "Counter staff scan the student's live QR pass. Attendance and billing ledgers sync automatically via WebSockets.",
  },
];

const ROLE_MATRICES = [
  {
    icon: GraduationCap,
    role: "Hostel Residents",
    accent: "#10b981",
    perks: [
      "Dual-tier mess enrollment",
      "Instant QR gate pass",
      "Live running bill & rebates",
      "Meal rating & helpdesk",
    ],
  },
  {
    icon: ShieldCheck,
    role: "Mess Committee / Admin",
    accent: "#6366f1",
    perks: [
      "Multi-day menu builder",
      "Automated invoice generation",
      "Inventory & stock approvals",
      "Campus-wide broadcasts",
    ],
  },
  {
    icon: UserCog,
    role: "Caterer & Kitchen Staff",
    accent: "#f59e0b",
    perks: [
      "High-speed QR scanner",
      "Headcount & slot verification",
      "Daily bio-wastage logging",
      "Ration requisition requests",
    ],
  },
  {
    icon: Building2,
    role: "Chief Warden Office",
    accent: "#ec4899",
    perks: [
      "Financial & audit telemetry",
      "Caterer quality compliance",
      "Wastage reduction metrics",
      "Grievance SLA monitoring",
    ],
  },
];

const CAMPUS_VOICES = [
  {
    name: "Siddharth Mohanty",
    meta: "B.Tech CSE • Final Year",
    quote:
      "Switching between semester pass tracking and daily menu lookups on MessMatrix is effortless. The QR scan at lunch rush takes less than two seconds.",
  },
  {
    name: "Ananya Dash",
    meta: "B.Tech IT • 3rd Year",
    quote:
      "Complete transparency on monthly mess dues. Every single meal registration and leave rebate shows up immediately on my live ledger.",
  },
  {
    name: "ritesh Pradhan",
    meta: "Hostel Mess Representative",
    quote:
      "Tracking kitchen inventory requests and daily plate wastage used to happen on paper registers. MessMatrix digitized our entire workflow.",
  },
];

export default function LandingPage() {
  return (
    <div
      style={{
        background: "#070b12",
        color: "#f8fafc",
        minHeight: "100vh",
        fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
      }}
    >
      {/* Top Navbar */}
      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 50,
          background: "rgba(7, 11, 18, 0.82)",
          backdropFilter: "blur(16px)",
          borderBottom: "1px solid rgba(255,255,255,0.08)",
          padding: "16px 5%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Link
          to="/"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            textDecoration: "none",
            color: "#fff",
          }}
        >
          <div
            style={{
              width: 38,
              height: 38,
              borderRadius: 10,
              background: "linear-gradient(135deg, #10b981, #059669)",
              display: "grid",
              placeItems: "center",
              fontWeight: 800,
              color: "#022c22",
              fontSize: 16,
            }}
          >
            M²
          </div>
          <div>
            <span
              style={{
                fontWeight: 800,
                fontSize: 19,
                letterSpacing: "-0.03em",
              }}
            >
              MESS<span style={{ color: "#10b981" }}>MATRIX</span>
            </span>
            <span
              style={{
                display: "block",
                fontSize: 10,
                color: "#94a3b8",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
              }}
            >
              IIIT Bhubaneswar Dining OS
            </span>
          </div>
        </Link>

        <nav
          style={{ display: "flex", gap: 28, fontSize: 14, fontWeight: 500 }}
        >
          <a
            href="#capabilities"
            style={{ color: "#cbd5e1", textDecoration: "none" }}
          >
            Architecture
          </a>
          <a
            href="#workflow"
            style={{ color: "#cbd5e1", textDecoration: "none" }}
          >
            Protocol
          </a>
          <a href="#roles" style={{ color: "#cbd5e1", textDecoration: "none" }}>
            Access Nodes
          </a>
        </nav>

        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <Link
            to="/login"
            style={{
              padding: "9px 18px",
              borderRadius: 10,
              color: "#e2e8f0",
              textDecoration: "none",
              fontSize: 14,
              fontWeight: 600,
              border: "1px solid rgba(255,255,255,0.12)",
            }}
          >
            Portal Login
          </Link>
          <Link
            to="/register"
            style={{
              padding: "9px 18px",
              borderRadius: 10,
              background: "linear-gradient(135deg, #10b981, #059669)",
              color: "#022c22",
              textDecoration: "none",
              fontSize: 14,
              fontWeight: 700,
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            Initialize Account <ArrowRight size={15} />
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section
        style={{
          padding: "72px 5% 64px",
          maxWidth: 1320,
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))",
          gap: 48,
          alignItems: "center",
        }}
      >
        <div>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "6px 14px",
              borderRadius: 999,
              background: "rgba(16, 185, 129, 0.12)",
              border: "1px solid rgba(16, 185, 129, 0.3)",
              color: "#34d399",
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: "0.06em",
              marginBottom: 22,
            }}
          >
            <Sparkles size={14} /> IIIT BHUBANESWAR • NEXT-GEN CAMPUS TELEMETRY
          </div>

          <h1
            style={{
              fontSize: "clamp(2.4rem, 4.5vw, 3.8rem)",
              fontWeight: 800,
              lineHeight: 1.08,
              letterSpacing: "-0.03em",
              marginBottom: 20,
            }}
          >
            Precision Dining.
            <br />
            <span
              style={{
                background: "linear-gradient(90deg, #10b981, #38bdf8)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Zero-Friction Campus Mess.
            </span>
          </h1>

          <p
            style={{
              color: "#94a3b8",
              fontSize: 17,
              lineHeight: 1.65,
              marginBottom: 32,
              maxWidth: 560,
            }}
          >
            MessMatrix unifies hostel dining across Ground Floor Subscription
            and 1st Floor Modular systems. Generate cryptographic QR gate
            passes, track live running bills, automate leave rebates, and
            monitor kitchen inventory in real time.
          </p>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 14,
              marginBottom: 32,
            }}
          >
            <Link
              to="/login"
              style={{
                padding: "14px 26px",
                borderRadius: 12,
                background: "linear-gradient(135deg, #10b981, #059669)",
                color: "#022c22",
                fontWeight: 800,
                fontSize: 15,
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                boxShadow: "0 10px 30px rgba(16, 185, 129, 0.25)",
              }}
            >
              Launch Command Deck <ArrowRight size={18} />
            </Link>
            <Link
              to="/register"
              style={{
                padding: "14px 26px",
                borderRadius: 12,
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.12)",
                color: "#f8fafc",
                fontWeight: 600,
                fontSize: 15,
                textDecoration: "none",
              }}
            >
              Student Enrollment
            </Link>
          </div>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 20,
              color: "#64748b",
              fontSize: 13,
              fontWeight: 600,
            }}
          >
            <span
              style={{ display: "inline-flex", alignItems: "center", gap: 6 }}
            >
              <Lock size={14} color="#10b981" /> JWT + Role Guarded
            </span>
            <span
              style={{ display: "inline-flex", alignItems: "center", gap: 6 }}
            >
              <Zap size={14} color="#10b981" /> WebSocket Live Sync
            </span>
            <span
              style={{ display: "inline-flex", alignItems: "center", gap: 6 }}
            >
              <Check size={14} color="#10b981" /> Anti-Replay QR Passes
            </span>
          </div>
        </div>

        {/* Interactive Bento Preview */}
        <div
          style={{
            background:
              "linear-gradient(145deg, rgba(30,41,59,0.7), rgba(15,23,42,0.9))",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: 24,
            padding: 24,
            boxShadow: "0 25px 60px rgba(0,0,0,0.6)",
            display: "grid",
            gap: 16,
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              borderBottom: "1px solid rgba(255,255,255,0.08)",
              paddingBottom: 14,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <Activity size={18} color="#10b981" />
              <span
                style={{
                  fontSize: 13,
                  fontWeight: 700,
                  letterSpacing: "0.05em",
                }}
              >
                LIVE MATRIX TELEMETRY
              </span>
            </div>
            <span
              style={{
                fontSize: 11,
                padding: "4px 10px",
                borderRadius: 99,
                background: "rgba(16,185,129,0.15)",
                color: "#34d399",
                fontWeight: 700,
              }}
            >
              ONLINE • IIIT-BH
            </span>
          </div>

          <div
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}
          >
            <div
              style={{
                background: "rgba(9,13,22,0.75)",
                padding: 16,
                borderRadius: 16,
                border: "1px solid rgba(255,255,255,0.06)",
              }}
            >
              <span
                style={{
                  fontSize: 11,
                  color: "#94a3b8",
                  textTransform: "uppercase",
                }}
              >
                Active Session
              </span>
              <h4 style={{ margin: "6px 0 4px", fontSize: 16 }}>
                Lunch • 12:30 - 14:15
              </h4>
              <p style={{ fontSize: 12, color: "#cbd5e1", margin: "0 0 10px" }}>
                Jeera Rice, Dal Tadka, Paneer Handi, Salad
              </p>
              <span
                style={{
                  fontSize: 11,
                  padding: "3px 8px",
                  borderRadius: 6,
                  background: "#065f46",
                  color: "#6ee7b7",
                  fontWeight: 600,
                }}
              >
                Slot Verified
              </span>
            </div>

            <div
              style={{
                background: "rgba(9,13,22,0.75)",
                padding: 16,
                borderRadius: 16,
                border: "1px solid rgba(255,255,255,0.06)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <span
                  style={{
                    fontSize: 11,
                    color: "#94a3b8",
                    textTransform: "uppercase",
                  }}
                >
                  Gate Pass Hash
                </span>
                <QrCode size={22} color="#10b981" />
              </div>
              <div>
                <div
                  style={{
                    fontFamily: "monospace",
                    fontSize: 13,
                    color: "#34d399",
                    fontWeight: 700,
                  }}
                >
                  MMX-94A8-F201
                </div>
                <p
                  style={{ fontSize: 11, color: "#64748b", margin: "2px 0 0" }}
                >
                  Single-use cryptographic token
                </p>
              </div>
            </div>
          </div>

          <div
            style={{
              background: "rgba(16, 185, 129, 0.08)",
              border: "1px solid rgba(16, 185, 129, 0.25)",
              padding: 16,
              borderRadius: 16,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div>
              <span
                style={{
                  fontSize: 11,
                  color: "#94a3b8",
                  textTransform: "uppercase",
                }}
              >
                Running Monthly Ledger
              </span>
              <div style={{ fontSize: 22, fontWeight: 800, color: "#f8fafc" }}>
                ₹2,340.00
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <span
                style={{
                  fontSize: 11,
                  padding: "4px 10px",
                  borderRadius: 8,
                  background: "rgba(245, 158, 11, 0.2)",
                  color: "#fbbf24",
                  fontWeight: 700,
                }}
              >
                Auto-Rebate Active
              </span>
              <p style={{ fontSize: 11, color: "#94a3b8", margin: "4px 0 0" }}>
                1st Floor Modular Plan
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Metrics Bar */}
      <section
        style={{
          borderTop: "1px solid rgba(255,255,255,0.08)",
          borderBottom: "1px solid rgba(255,255,255,0.08)",
          background: "rgba(17, 24, 39, 0.5)",
          padding: "28px 5%",
        }}
      >
        <div
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: 24,
            textAlign: "center",
          }}
        >
          <div>
            <strong style={{ fontSize: 28, color: "#10b981" }}>4</strong>
            <p style={{ color: "#94a3b8", fontSize: 13, marginTop: 4 }}>
              Dedicated Role Portals
            </p>
          </div>
          <div>
            <strong style={{ fontSize: 28, color: "#10b981" }}>2 Tiers</strong>
            <p style={{ color: "#94a3b8", fontSize: 13, marginTop: 4 }}>
              Semester & Modular Billing
            </p>
          </div>
          <div>
            <strong style={{ fontSize: 28, color: "#10b981" }}>26</strong>
            <p style={{ color: "#94a3b8", fontSize: 13, marginTop: 4 }}>
              MongoDB Schema Collections
            </p>
          </div>
          <div>
            <strong style={{ fontSize: 28, color: "#10b981" }}>100%</strong>
            <p style={{ color: "#94a3b8", fontSize: 13, marginTop: 4 }}>
              Real-Time Socket Verification
            </p>
          </div>
        </div>
      </section>

      {/* Capabilities Grid */}
      <section
        id="capabilities"
        style={{ padding: "80px 5%", maxWidth: 1280, margin: "0 auto" }}
      >
        <div
          style={{ textAlign: "center", maxWidth: 640, margin: "0 auto 48px" }}
        >
          <span
            style={{
              color: "#10b981",
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
            }}
          >
            CORE ARCHITECTURE
          </span>
          <h2 style={{ fontSize: 34, fontWeight: 800, margin: "10px 0 12px" }}>
            Engineered for high-density hostel dining.
          </h2>
          <p style={{ color: "#94a3b8", fontSize: 15 }}>
            Every module is wired directly to a production REST + WebSocket
            backend with strict role-based access control.
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: 20,
          }}
        >
          {MATRIX_CAPABILITIES.map(({ icon: Icon, tag, title, desc }) => (
            <div
              key={title}
              style={{
                background: "rgba(17, 24, 39, 0.75)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: 18,
                padding: 24,
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 16,
                }}
              >
                <div
                  style={{
                    width: 42,
                    height: 42,
                    borderRadius: 12,
                    background: "rgba(16,185,129,0.12)",
                    display: "grid",
                    placeItems: "center",
                    color: "#10b981",
                  }}
                >
                  <Icon size={20} />
                </div>
                <span
                  style={{
                    fontSize: 10,
                    fontFamily: "monospace",
                    color: "#64748b",
                    border: "1px solid rgba(255,255,255,0.08)",
                    padding: "3px 8px",
                    borderRadius: 6,
                  }}
                >
                  {tag}
                </span>
              </div>
              <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>
                {title}
              </h3>
              <p
                style={{
                  color: "#94a3b8",
                  fontSize: 14,
                  lineHeight: 1.6,
                  margin: 0,
                }}
              >
                {desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 3-Step Protocol */}
      <section
        id="workflow"
        style={{
          padding: "72px 5%",
          background: "rgba(15, 23, 42, 0.6)",
          borderTop: "1px solid rgba(255,255,255,0.06)",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 44 }}>
            <span
              style={{
                color: "#38bdf8",
                fontSize: 12,
                fontWeight: 700,
                letterSpacing: "0.1em",
              }}
            >
              OPERATIONAL FLOW
            </span>
            <h2 style={{ fontSize: 32, fontWeight: 800, marginTop: 8 }}>
              Three nodes. Zero paper registers.
            </h2>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: 24,
            }}
          >
            {WORKFLOW_NODES.map((w) => (
              <div
                key={w.step}
                style={{
                  background: "#090d16",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: 16,
                  padding: 24,
                }}
              >
                <span
                  style={{
                    fontFamily: "monospace",
                    fontSize: 12,
                    color: "#10b981",
                    fontWeight: 700,
                  }}
                >
                  {w.step}
                </span>
                <h3
                  style={{
                    fontSize: 18,
                    fontWeight: 700,
                    margin: "10px 0 8px",
                  }}
                >
                  {w.title}
                </h3>
                <p
                  style={{
                    color: "#94a3b8",
                    fontSize: 14,
                    lineHeight: 1.6,
                    margin: 0,
                  }}
                >
                  {w.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Role Access Nodes */}
      <section
        id="roles"
        style={{ padding: "80px 5%", maxWidth: 1280, margin: "0 auto" }}
      >
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <span
            style={{
              color: "#10b981",
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: "0.1em",
            }}
          >
            RBAC SECURITY
          </span>
          <h2 style={{ fontSize: 32, fontWeight: 800, marginTop: 8 }}>
            Four specialized command views.
          </h2>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: 20,
          }}
        >
          {ROLE_MATRICES.map(({ icon: Icon, role, accent, perks }) => (
            <div
              key={role}
              style={{
                background: "rgba(17,24,39,0.7)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderTop: `3px solid ${accent}`,
                borderRadius: 16,
                padding: 24,
              }}
            >
              <Icon size={24} color={accent} />
              <h3
                style={{ fontSize: 18, fontWeight: 700, margin: "12px 0 14px" }}
              >
                {role}
              </h3>
              <ul
                style={{
                  listStyle: "none",
                  padding: 0,
                  margin: 0,
                  display: "grid",
                  gap: 10,
                }}
              >
                {perks.map((p) => (
                  <li
                    key={p}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      fontSize: 13.5,
                      color: "#cbd5e1",
                    }}
                  >
                    <Check size={14} color={accent} /> {p}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Campus Testimonials */}
      <section style={{ padding: "64px 5%", maxWidth: 1280, margin: "0 auto" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: 20,
          }}
        >
          {CAMPUS_VOICES.map((v) => (
            <div
              key={v.name}
              style={{
                background: "rgba(30,41,59,0.4)",
                border: "1px solid rgba(255,255,255,0.07)",
                borderRadius: 16,
                padding: 24,
              }}
            >
              <div
                style={{
                  display: "flex",
                  gap: 4,
                  color: "#f59e0b",
                  marginBottom: 12,
                }}
              >
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={14} fill="currentColor" />
                ))}
              </div>
              <p
                style={{
                  color: "#e2e8f0",
                  fontSize: 14,
                  lineHeight: 1.6,
                  marginBottom: 16,
                }}
              >
                "{v.quote}"
              </p>
              <div style={{ fontWeight: 700, fontSize: 14 }}>{v.name}</div>
              <div style={{ color: "#64748b", fontSize: 12 }}>{v.meta}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer
        style={{
          borderTop: "1px solid rgba(255,255,255,0.08)",
          padding: "40px 5% 28px",
          background: "#05080e",
        }}
      >
        <div
          style={{
            maxWidth: 1280,
            margin: "0 auto",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 16,
          }}
        >
          <div>
            <strong style={{ fontSize: 16, letterSpacing: "-0.02em" }}>
              MESS<span style={{ color: "#10b981" }}>MATRIX</span>
            </strong>
            <p style={{ color: "#64748b", fontSize: 12, marginTop: 4 }}>
              © {new Date().getFullYear()} MessMatrix — International Institute
              of Information Technology, Bhubaneswar
            </p>
          </div>
          <div
            style={{ color: "#94a3b8", fontSize: 13, fontFamily: "monospace" }}
          >
            Architected & Engineered by{" "}
            <strong style={{ color: "#10b981" }}>
              Biswabin Sarandeep Pidika (B423018)
            </strong>
          </div>
        </div>
      </footer>
    </div>
  );
}
