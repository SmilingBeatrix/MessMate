import { useState } from "react";
import {
  useRunningBillQuery,
  usePayDirectMutation,
  useMyPaymentsQuery,
} from "../../app/api.js";
import { toast } from "sonner";
import { QRCodeSVG } from "qrcode.react";
import {
  X,
  CreditCard,
  Smartphone,
  Building,
  CheckCircle2,
  Copy,
  Sparkles,
  ShieldCheck,
  IndianRupee,
} from "lucide-react";

const METHODS = [
  {
    value: "upi",
    label: "UPI",
    icon: Smartphone,
    desc: "GPay, PhonePe, Paytm",
  },
  { value: "card", label: "Card", icon: CreditCard, desc: "Debit or Credit" },
  {
    value: "netbanking",
    label: "Net Banking",
    icon: Building,
    desc: "All major banks",
  },
];
const UPI_APPS = ["GPay", "PhonePe", "Paytm", "BHIM"];
const BANKS = ["SBI", "HDFC", "ICICI", "Axis", "Kotak", "PNB"];

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

export default function BillsPage() {
  const { data: runningData } = useRunningBillQuery();
  const { data: paymentsData, refetch: refetchPayments } = useMyPaymentsQuery();
  const [pay, { isLoading: paying }] = usePayDirectMutation();

  const [showPay, setShowPay] = useState(false);
  const [method, setMethod] = useState("upi");
  const [amount, setAmount] = useState("");
  const [cardNum, setCardNum] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [cardName, setCardName] = useState("");
  const [selectedBank, setSelectedBank] = useState("");
  const [selectedApp, setSelectedApp] = useState("");

  const running = runningData?.data?.bill;
  const payments = paymentsData?.data?.payments || [];
  const total = running?.total || 0;
  const totalPaid = running?.totalPaid || 0;
  const owed = running?.outstanding || 0;

  const upiUrl = `upi://pay?pa=messmate@iiitbh&pn=MESSMATE&am=${amount || 0}&cu=INR&tn=MessBill`;

  const openPay = () => {
    setAmount(owed > 0 ? String(owed) : "");
    setMethod("upi");
    setCardNum("");
    setCardExpiry("");
    setCardCvv("");
    setCardName("");
    setSelectedBank("");
    setSelectedApp("");
    setShowPay(true);
  };

  const copyUpiId = async () => {
    try {
      await navigator.clipboard.writeText("messmate@iiitbh");
      toast.success("UPI ID copied");
    } catch {
      toast.info("UPI ID: messmate@iiitbh");
    }
  };

  const handlePay = async () => {
    const amt = Number(amount);
    if (!amt || amt <= 0) return toast.error("Enter a valid amount");
    if (amt > owed + 0.01)
      return toast.error(`Amount exceeds outstanding Rs. ${owed}`);

    if (method === "card") {
      if (cardNum.replace(/\s/g, "").length < 12)
        return toast.error("Enter valid card number");
      if (!cardExpiry) return toast.error("Enter expiry");
      if (cardCvv.length < 3) return toast.error("Enter CVV");
      if (!cardName.trim()) return toast.error("Enter name on card");
    }
    if (method === "netbanking" && !selectedBank)
      return toast.error("Select a bank");

    try {
      await pay({ amount: amt, method }).unwrap();
      toast.success(`Paid Rs. ${amt} successfully`);
      setShowPay(false);
      setAmount("");
      refetchPayments();
    } catch (err) {
      toast.error(err?.data?.message || "Payment failed");
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
            color: "#34d399",
            letterSpacing: "0.1em",
            marginBottom: 8,
            background: "rgba(16, 185, 129, 0.15)",
            padding: "5px 14px",
            borderRadius: "20px",
            border: "1px solid rgba(16, 185, 129, 0.3)",
          }}
        >
          <IndianRupee size={14} /> BILLING LEDGER
        </div>
        <h1
          style={{
            margin: 0,
            fontSize: "2rem",
            fontWeight: 800,
            letterSpacing: "-0.03em",
          }}
        >
          My Bills
        </h1>
        <p style={{ margin: "8px 0 0", fontSize: 14, color: "#94a3b8" }}>
          Pay for meals and view your payment history.
        </p>
      </header>

      {!running ? (
        <div style={{ ...glassCard, padding: 40, textAlign: "center" }}>
          <p style={{ color: "#94a3b8" }}>Loading bill...</p>
        </div>
      ) : total === 0 ? (
        <div style={{ ...glassCard, padding: 60, textAlign: "center" }}>
          <Sparkles
            size={48}
            color="#334155"
            style={{ margin: "0 auto 16px" }}
          />
          <h3 style={{ margin: "0 0 8px", fontSize: 20, fontWeight: 800 }}>
            No meals charged this month
          </h3>
          <p style={{ color: "#94a3b8", fontSize: 14 }}>
            Go to <strong>Menu</strong> and register for a meal to start your
            bill.
          </p>
        </div>
      ) : (
        <div style={{ ...glassCard, marginBottom: 32, overflow: "hidden" }}>
          <div
            style={{
              padding: 24,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 20,
              borderBottom: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            <div>
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 700,
                  color: "#94a3b8",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  marginBottom: 12,
                }}
              >
                {new Date(running.year, running.month - 1).toLocaleString(
                  "en-IN",
                  { month: "long", year: "numeric" },
                )}
              </div>
              <div style={{ display: "flex", gap: 32 }}>
                <div>
                  <span style={{ fontSize: 12, color: "#64748b" }}>Total</span>
                  <div style={{ fontSize: 24, fontWeight: 800 }}>₹{total}</div>
                </div>
                <div>
                  <span style={{ fontSize: 12, color: "#64748b" }}>Paid</span>
                  <div
                    style={{ fontSize: 24, fontWeight: 800, color: "#10b981" }}
                  >
                    ₹{totalPaid}
                  </div>
                </div>
                <div>
                  <span style={{ fontSize: 12, color: "#64748b" }}>Due</span>
                  <div
                    style={{
                      fontSize: 24,
                      fontWeight: 800,
                      color: owed > 0 ? "#ef4444" : "#10b981",
                    }}
                  >
                    ₹{owed}
                  </div>
                </div>
              </div>
            </div>
            {owed > 0 ? (
              <button
                onClick={openPay}
                style={{
                  padding: "12px 28px",
                  borderRadius: 10,
                  background: "linear-gradient(135deg, #10b981, #059669)",
                  color: "#022c22",
                  fontWeight: 800,
                  fontSize: 15,
                  border: "none",
                  cursor: "pointer",
                  boxShadow: "0 4px 15px rgba(16, 185, 129, 0.4)",
                }}
              >
                Pay ₹{owed}
              </button>
            ) : (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "10px 20px",
                  background: "rgba(16, 185, 129, 0.15)",
                  color: "#34d399",
                  borderRadius: 10,
                  fontWeight: 700,
                }}
              >
                <CheckCircle2 size={18} /> Paid in full
              </div>
            )}
          </div>
          {running.items && running.items.length > 0 && (
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                textAlign: "left",
              }}
            >
              <thead>
                <tr style={{ background: "rgba(15, 23, 42, 0.5)" }}>
                  {["Meal", "Count", "Unit Price", "Amount"].map((h) => (
                    <th
                      key={h}
                      style={{
                        padding: "12px 24px",
                        fontSize: 12,
                        color: "#94a3b8",
                        fontWeight: 700,
                      }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {running.items.map((it, i) => (
                  <tr
                    key={i}
                    style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}
                  >
                    <td
                      style={{
                        padding: "12px 24px",
                        color: "#f8fafc",
                        fontWeight: 600,
                      }}
                    >
                      {it.label}
                    </td>
                    <td style={{ padding: "12px 24px", color: "#cbd5e1" }}>
                      {it.quantity}
                    </td>
                    <td style={{ padding: "12px 24px", color: "#cbd5e1" }}>
                      ₹{it.unitPrice}
                    </td>
                    <td
                      style={{
                        padding: "12px 24px",
                        fontWeight: 700,
                        color: "#34d399",
                      }}
                    >
                      ₹{it.amount}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 16 }}>
        Payment history
      </h2>
      {payments.length === 0 ? (
        <div style={{ ...glassCard, padding: 40, textAlign: "center" }}>
          <p style={{ color: "#94a3b8", margin: 0 }}>No payments yet.</p>
        </div>
      ) : (
        <div style={{ ...glassCard, padding: 0, overflow: "hidden" }}>
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
                {["Date", "Amount", "Method", "Reference", "Status"].map(
                  (h) => (
                    <th
                      key={h}
                      style={{
                        padding: "16px 20px",
                        fontSize: 13,
                        color: "#94a3b8",
                        fontWeight: 700,
                      }}
                    >
                      {h}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody>
              {payments.map((p) => (
                <tr
                  key={p._id}
                  style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}
                >
                  <td
                    style={{
                      padding: "16px 20px",
                      fontSize: 13,
                      color: "#cbd5e1",
                    }}
                  >
                    {new Date(p.paidAt || p.createdAt).toLocaleString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </td>
                  <td
                    style={{
                      padding: "16px 20px",
                      fontWeight: 700,
                      color: "#f8fafc",
                    }}
                  >
                    ₹{p.amount}
                  </td>
                  <td style={{ padding: "16px 20px" }}>
                    <span
                      style={{
                        fontSize: 11,
                        fontWeight: 800,
                        background: "rgba(255,255,255,0.05)",
                        color: "#cbd5e1",
                        padding: "4px 8px",
                        borderRadius: 6,
                        textTransform: "uppercase",
                      }}
                    >
                      {p.method}
                    </span>
                  </td>
                  <td
                    style={{
                      padding: "16px 20px",
                      fontSize: 12,
                      color: "#64748b",
                      fontFamily: "monospace",
                    }}
                  >
                    {p.providerRef?.slice(0, 16) || "-"}
                  </td>
                  <td style={{ padding: "16px 20px" }}>
                    <span
                      style={{
                        fontSize: 11,
                        fontWeight: 800,
                        background:
                          p.status === "success"
                            ? "rgba(16, 185, 129, 0.15)"
                            : "rgba(245, 158, 11, 0.15)",
                        color: p.status === "success" ? "#34d399" : "#fbbf24",
                        padding: "4px 10px",
                        borderRadius: 6,
                        textTransform: "uppercase",
                      }}
                    >
                      {p.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Payment Modal */}
      {showPay && running && (
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
          onClick={() => !paying && setShowPay(false)}
        >
          <div
            style={{
              ...glassCard,
              width: "100%",
              maxWidth: 460,
              padding: 32,
              maxHeight: "90vh",
              overflowY: "auto",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                marginBottom: 24,
              }}
            >
              <div>
                <div
                  style={{
                    fontSize: 12,
                    fontWeight: 700,
                    color: "#94a3b8",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                  }}
                >
                  Amount to pay
                </div>
                <div
                  style={{
                    fontSize: 36,
                    fontWeight: 800,
                    color: "#10b981",
                    letterSpacing: "-0.03em",
                  }}
                >
                  ₹{amount || 0}
                </div>
                <div style={{ fontSize: 13, color: "#64748b" }}>
                  Outstanding: ₹{owed}
                </div>
              </div>
              <button
                onClick={() => !paying && setShowPay(false)}
                disabled={paying}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "#94a3b8",
                  cursor: "pointer",
                }}
              >
                <X size={24} />
              </button>
            </div>

            <label style={{ display: "grid", gap: 6, marginBottom: 24 }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: "#cbd5e1" }}>
                Amount (₹)
              </span>
              <input
                type="number"
                min="1"
                max={owed}
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                disabled={paying}
                style={inputStyle}
              />
            </label>

            <div
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: 12,
                padding: 20,
                textAlign: "center",
                marginBottom: 24,
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 6,
                  fontSize: 12,
                  fontWeight: 700,
                  color: "#94a3b8",
                  marginBottom: 16,
                }}
              >
                <Smartphone size={14} /> Scan with any UPI app
              </div>
              <div
                style={{
                  display: "inline-block",
                  padding: 12,
                  background: "#fff",
                  borderRadius: 8,
                }}
              >
                <QRCodeSVG value={upiUrl} size={160} level="M" />
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                  marginTop: 16,
                }}
              >
                <span
                  style={{
                    fontFamily: "monospace",
                    fontSize: 14,
                    color: "#f8fafc",
                    fontWeight: 700,
                  }}
                >
                  messmate@iiitbh
                </span>
                <button
                  onClick={copyUpiId}
                  style={{
                    background: "rgba(16, 185, 129, 0.15)",
                    border: "none",
                    color: "#34d399",
                    padding: "6px 10px",
                    borderRadius: 6,
                    fontSize: 12,
                    fontWeight: 700,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: 4,
                  }}
                >
                  <Copy size={12} /> Copy
                </button>
              </div>
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                marginBottom: 24,
              }}
            >
              <div
                style={{
                  flex: 1,
                  height: 1,
                  background: "rgba(255,255,255,0.1)",
                }}
              />
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 800,
                  color: "#64748b",
                  letterSpacing: "0.1em",
                }}
              >
                OR PAY WITH
              </span>
              <div
                style={{
                  flex: 1,
                  height: 1,
                  background: "rgba(255,255,255,0.1)",
                }}
              />
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr 1fr",
                gap: 10,
                marginBottom: 24,
              }}
            >
              {METHODS.map(({ value, label, icon: Icon }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setMethod(value)}
                  disabled={paying}
                  style={{
                    padding: "12px 8px",
                    borderRadius: 10,
                    border:
                      method === value
                        ? "1px solid #10b981"
                        : "1px solid rgba(255,255,255,0.1)",
                    background:
                      method === value
                        ? "rgba(16, 185, 129, 0.15)"
                        : "rgba(255,255,255,0.03)",
                    color: method === value ? "#34d399" : "#94a3b8",
                    cursor: "pointer",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 6,
                    transition: "all 0.2s",
                  }}
                >
                  <Icon size={18} />
                  <span style={{ fontSize: 12, fontWeight: 700 }}>{label}</span>
                </button>
              ))}
            </div>

            {method === "upi" && (
              <div style={{ marginBottom: 24 }}>
                <p
                  style={{
                    fontSize: 12,
                    fontWeight: 700,
                    color: "#94a3b8",
                    marginBottom: 8,
                  }}
                >
                  Choose UPI app
                </p>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 8,
                  }}
                >
                  {UPI_APPS.map((app) => (
                    <button
                      key={app}
                      onClick={() => setSelectedApp(app)}
                      style={{
                        padding: "10px",
                        borderRadius: 8,
                        border:
                          selectedApp === app
                            ? "1px solid #10b981"
                            : "1px solid rgba(255,255,255,0.1)",
                        background:
                          selectedApp === app
                            ? "rgba(16, 185, 129, 0.15)"
                            : "rgba(255,255,255,0.03)",
                        color: selectedApp === app ? "#34d399" : "#94a3b8",
                        fontWeight: 600,
                        cursor: "pointer",
                      }}
                    >
                      {app}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {method === "card" && (
              <div style={{ display: "grid", gap: 12, marginBottom: 24 }}>
                <label style={{ display: "grid", gap: 6 }}>
                  <span
                    style={{ fontSize: 13, fontWeight: 600, color: "#cbd5e1" }}
                  >
                    Card number
                  </span>
                  <input
                    value={cardNum}
                    onChange={(e) => {
                      const v = e.target.value.replace(/\D/g, "").slice(0, 16);
                      setCardNum(v.replace(/(\d{4})(?=\d)/g, "$1 "));
                    }}
                    placeholder="1234 5678 9012 3456"
                    disabled={paying}
                    style={inputStyle}
                  />
                </label>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 12,
                  }}
                >
                  <label style={{ display: "grid", gap: 6 }}>
                    <span
                      style={{
                        fontSize: 13,
                        fontWeight: 600,
                        color: "#cbd5e1",
                      }}
                    >
                      Expiry
                    </span>
                    <input
                      value={cardExpiry}
                      onChange={(e) => {
                        const v = e.target.value.replace(/\D/g, "").slice(0, 4);
                        setCardExpiry(
                          v.length > 2 ? v.slice(0, 2) + "/" + v.slice(2) : v,
                        );
                      }}
                      placeholder="MM/YY"
                      disabled={paying}
                      style={inputStyle}
                    />
                  </label>
                  <label style={{ display: "grid", gap: 6 }}>
                    <span
                      style={{
                        fontSize: 13,
                        fontWeight: 600,
                        color: "#cbd5e1",
                      }}
                    >
                      CVV
                    </span>
                    <input
                      type="password"
                      value={cardCvv}
                      onChange={(e) =>
                        setCardCvv(
                          e.target.value.replace(/\D/g, "").slice(0, 4),
                        )
                      }
                      placeholder="123"
                      disabled={paying}
                      style={inputStyle}
                    />
                  </label>
                </div>
                <label style={{ display: "grid", gap: 6 }}>
                  <span
                    style={{ fontSize: 13, fontWeight: 600, color: "#cbd5e1" }}
                  >
                    Cardholder name
                  </span>
                  <input
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value)}
                    placeholder="Name on card"
                    disabled={paying}
                    style={inputStyle}
                  />
                </label>
              </div>
            )}

            {method === "netbanking" && (
              <div style={{ marginBottom: 24 }}>
                <p
                  style={{
                    fontSize: 12,
                    fontWeight: 700,
                    color: "#94a3b8",
                    marginBottom: 8,
                  }}
                >
                  Select bank
                </p>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 8,
                  }}
                >
                  {BANKS.map((b) => (
                    <button
                      key={b}
                      onClick={() => setSelectedBank(b)}
                      style={{
                        padding: "10px",
                        borderRadius: 8,
                        border:
                          selectedBank === b
                            ? "1px solid #10b981"
                            : "1px solid rgba(255,255,255,0.1)",
                        background:
                          selectedBank === b
                            ? "rgba(16, 185, 129, 0.15)"
                            : "rgba(255,255,255,0.03)",
                        color: selectedBank === b ? "#34d399" : "#94a3b8",
                        fontWeight: 600,
                        cursor: "pointer",
                      }}
                    >
                      {b}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <button
              onClick={handlePay}
              disabled={paying}
              style={{
                width: "100%",
                padding: 16,
                borderRadius: 12,
                background: "linear-gradient(135deg, #10b981, #059669)",
                color: "#022c22",
                fontWeight: 800,
                fontSize: 16,
                border: "none",
                cursor: paying ? "not-allowed" : "pointer",
                boxShadow: "0 4px 15px rgba(16, 185, 129, 0.4)",
                marginBottom: 12,
              }}
            >
              {paying ? "Processing..." : `Pay ₹${amount || 0}`}
            </button>
            <div
              style={{
                textAlign: "center",
                fontSize: 12,
                color: "#64748b",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 4,
              }}
            >
              <ShieldCheck size={14} /> Secure demo payment - no real money
              charged
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
