/**
 * StaffDashboardPage.tsx
 * ─────────────────────────────────────────────────────────────────────────────
 * TRANSFORMED: Dark slate → Zomato-style warm restaurant UI
 * Color System:
 *   Primary Red   : #E23744 (Zomato signature)
 *   Accent Orange : #FF6B35
 *   Warm BG       : #FFF8F5
 *   Card White    : #FFFFFF
 *   Text Dark     : #1C1C1C
 *   Text Muted    : #7C7C7C
 * ─────────────────────────────────────────────────────────────────────────────
 * Sections:
 *   1. TopStatsBar       — live counts for the current shift
 *   2. ShiftSelector     — morning / evening pill toggle
 *   3. CustomerSearch    — search + filter bar
 *   4. AttendanceCards   — per-customer thali marking cards
 *   5. ExtrasSection     — add-on items panel
 * ─────────────────────────────────────────────────────────────────────────────
 * DROP-IN REPLACEMENT — keep all existing Redux hooks/API calls,
 * only the JSX structure + className strings change.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { useState } from "react";

// ─── MOCK DATA — replace with your real Redux selectors ──────────────────────
const MOCK_CUSTOMERS = [
  { id: "1", name: "Rahul Sharma",    type: "monthly", attended: true,  thali: true,  extras: 1 },
  { id: "2", name: "Priya Patel",     type: "monthly", attended: false, thali: false, extras: 0 },
  { id: "3", name: "Amit Verma",      type: "daily",   attended: true,  thali: true,  extras: 2 },
  { id: "4", name: "Sneha Joshi",     type: "monthly", attended: true,  thali: false, extras: 0 },
  { id: "5", name: "Karan Mehta",     type: "daily",   attended: false, thali: false, extras: 0 },
  { id: "6", name: "Divya Reddy",     type: "monthly", attended: true,  thali: true,  extras: 3 },
  { id: "7", name: "Rohit Kumar",     type: "monthly", attended: false, thali: false, extras: 0 },
  { id: "8", name: "Ananya Singh",    type: "daily",   attended: true,  thali: true,  extras: 1 },
];

const EXTRA_ITEMS = [
  { id: "e1", name: "Extra Roti",   price: 10, icon: "🫓" },
  { id: "e2", name: "Extra Dal",    price: 15, icon: "🍲" },
  { id: "e3", name: "Sweet",        price: 20, icon: "🍮" },
  { id: "e4", name: "Papad",        price: 5,  icon: "🥙" },
  { id: "e5", name: "Chaas",        price: 12, icon: "🥛" },
  { id: "e6", name: "Pickle",       price: 8,  icon: "🫙" },
];
// ─────────────────────────────────────────────────────────────────────────────

export default function StaffDashboardPage() {
  const [shift, setShift]           = useState<"morning" | "evening">("morning");
  const [search, setSearch]         = useState("");
  const [filter, setFilter]         = useState<"all" | "monthly" | "daily">("all");
  const [customers, setCustomers]   = useState(MOCK_CUSTOMERS);
  const [selectedCustomer, setSelectedCustomer] = useState<string | null>(null);
  const [extrasModal, setExtrasModal]           = useState<string | null>(null); // customerId
  const [selectedExtras, setSelectedExtras]     = useState<Record<string, number>>({});

  // ── Derived stats ────────────────────────────────────────────────────────
  const totalPresent  = customers.filter(c => c.attended).length;
  const totalAbsent   = customers.filter(c => !c.attended).length;
  const thaliCount    = customers.filter(c => c.thali).length;
  const extrasTotal   = customers.reduce((sum, c) => sum + c.extras, 0);

  // ── Filtered list ────────────────────────────────────────────────────────
  const filtered = customers.filter(c => {
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "all" || c.type === filter;
    return matchSearch && matchFilter;
  });

  // ── Attendance toggle ────────────────────────────────────────────────────
  const toggleAttendance = (id: string) => {
    setCustomers(prev => prev.map(c =>
      c.id === id
        ? { ...c, attended: !c.attended, thali: !c.attended ? c.thali : false }
        : c
    ));
  };

  // ── Thali toggle (only if attended) ─────────────────────────────────────
  const toggleThali = (id: string) => {
    setCustomers(prev => prev.map(c =>
      c.id === id && c.attended ? { ...c, thali: !c.thali } : c
    ));
  };

  // ── Extras modal handlers ────────────────────────────────────────────────
  const openExtras = (id: string) => {
    setExtrasModal(id);
    setSelectedExtras({});
  };

  const adjustExtra = (itemId: string, delta: number) => {
    setSelectedExtras(prev => {
      const current = prev[itemId] || 0;
      const next = Math.max(0, current + delta);
      return { ...prev, [itemId]: next };
    });
  };

  const saveExtras = () => {
    const total = Object.values(selectedExtras).reduce((s, v) => s + v, 0);
    setCustomers(prev => prev.map(c =>
      c.id === extrasModal ? { ...c, extras: c.extras + total } : c
    ));
    setExtrasModal(null);
  };

  // ── Avatar initials helper ───────────────────────────────────────────────
  const getInitials = (name: string) =>
    name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);

  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
  });

  return (
    // ── Page wrapper — warm Zomato background ───────────────────────────
    <div style={{ minHeight: "100vh", background: "#FFF8F5", fontFamily: "'Nunito', 'Segoe UI', sans-serif" }}>

      {/* ═══════════════════════════════════════════════════════════════════
          SECTION 1 — PAGE HEADER
          Technical: sticky top header bar with gradient background
      ════════════════════════════════════════════════════════════════════ */}
      <div style={{
        background: "linear-gradient(135deg, #E23744 0%, #FF6B35 100%)",
        padding: "20px 24px 28px",
        position: "sticky",
        top: 0,
        zIndex: 50,
        boxShadow: "0 4px 20px rgba(226,55,68,0.3)",
      }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              {/* Restaurant-branded staff title */}
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
                <span style={{ fontSize: 28 }}>🍽️</span>
                <span style={{ color: "rgba(255,255,255,0.85)", fontSize: 13, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase" }}>
                  Staff Portal
                </span>
              </div>
              <h1 style={{ color: "#fff", fontSize: 22, fontWeight: 800, margin: 0 }}>
                Attendance Dashboard
              </h1>
              <p style={{ color: "rgba(255,255,255,0.75)", fontSize: 13, marginTop: 4 }}>{today}</p>
            </div>
            {/* Staff avatar badge */}
            <div style={{
              width: 46, height: 46, borderRadius: "50%",
              background: "rgba(255,255,255,0.2)",
              border: "2px solid rgba(255,255,255,0.4)",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "#fff", fontWeight: 800, fontSize: 16,
            }}>
              ST
            </div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 16px 40px" }}>

        {/* ═══════════════════════════════════════════════════════════════
            SECTION 2 — STATS BAR
            Technical: CSS Grid 4-column stat cards with icon badges
        ══════════════════════════════════════════════════════════════ */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 12,
          marginTop: -18, // overlaps header for Zomato-card effect
          marginBottom: 24,
        }}>
          {[
            { label: "Present",   value: totalPresent, icon: "✅", color: "#22C55E", bg: "#F0FDF4" },
            { label: "Absent",    value: totalAbsent,  icon: "❌", color: "#E23744", bg: "#FFF1F2" },
            { label: "Thalis",    value: thaliCount,   icon: "🍱", color: "#FF6B35", bg: "#FFF4EE" },
            { label: "Extras",    value: extrasTotal,  icon: "➕", color: "#8B5CF6", bg: "#F5F3FF" },
          ].map(stat => (
            <div key={stat.label} style={{
              background: "#fff",
              borderRadius: 16,
              padding: "16px 14px",
              boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
              border: "1px solid rgba(0,0,0,0.05)",
              display: "flex",
              flexDirection: "column",
              gap: 8,
            }}>
              {/* Icon badge */}
              <div style={{
                width: 40, height: 40, borderRadius: 12,
                background: stat.bg,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 20,
              }}>
                {stat.icon}
              </div>
              <div style={{ fontSize: 28, fontWeight: 900, color: "#1C1C1C", lineHeight: 1 }}>
                {stat.value}
              </div>
              <div style={{ fontSize: 12, color: "#7C7C7C", fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5 }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* ═══════════════════════════════════════════════════════════════
            SECTION 3 — SHIFT SELECTOR
            Technical: pill toggle — updates shift state, filters data
        ══════════════════════════════════════════════════════════════ */}
        <div style={{
          background: "#fff",
          borderRadius: 16,
          padding: 20,
          marginBottom: 20,
          boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 12,
        }}>
          <div>
            <p style={{ margin: 0, fontWeight: 800, color: "#1C1C1C", fontSize: 15 }}>Select Shift</p>
            <p style={{ margin: 0, color: "#7C7C7C", fontSize: 12, marginTop: 2 }}>
              All attendance will be recorded for this shift
            </p>
          </div>
          {/* Pill toggle — morning / evening */}
          <div style={{
            display: "flex",
            background: "#FFF8F5",
            borderRadius: 50,
            padding: 4,
            border: "1px solid #FFE0D4",
          }}>
            {(["morning", "evening"] as const).map(s => (
              <button
                key={s}
                onClick={() => setShift(s)}
                style={{
                  padding: "10px 24px",
                  borderRadius: 50,
                  border: "none",
                  cursor: "pointer",
                  fontWeight: 700,
                  fontSize: 14,
                  transition: "all 0.2s ease",
                  background: shift === s
                    ? "linear-gradient(135deg, #E23744, #FF6B35)"
                    : "transparent",
                  color: shift === s ? "#fff" : "#7C7C7C",
                  boxShadow: shift === s ? "0 4px 12px rgba(226,55,68,0.35)" : "none",
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                }}
              >
                <span>{s === "morning" ? "🌅" : "🌙"}</span>
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════════════
            SECTION 4 — CUSTOMER SEARCH & FILTER BAR
            Technical: controlled input + filter pill buttons
        ══════════════════════════════════════════════════════════════ */}
        <div style={{
          background: "#fff",
          borderRadius: 16,
          padding: 16,
          marginBottom: 20,
          boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
          display: "flex",
          gap: 12,
          flexWrap: "wrap",
          alignItems: "center",
        }}>
          {/* Search input with icon */}
          <div style={{ flex: 1, minWidth: 200, position: "relative" }}>
            <span style={{
              position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)",
              fontSize: 16, color: "#7C7C7C",
            }}>🔍</span>
            <input
              type="text"
              placeholder="Search customer name..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{
                width: "100%",
                padding: "11px 14px 11px 42px",
                borderRadius: 12,
                border: "1.5px solid #FFE0D4",
                fontSize: 14,
                color: "#1C1C1C",
                background: "#FFF8F5",
                outline: "none",
                boxSizing: "border-box",
                fontFamily: "inherit",
                transition: "border-color 0.2s",
              }}
              onFocus={e => (e.target.style.borderColor = "#E23744")}
              onBlur={e => (e.target.style.borderColor = "#FFE0D4")}
            />
          </div>
          {/* Type filter pills */}
          <div style={{ display: "flex", gap: 8 }}>
            {(["all", "monthly", "daily"] as const).map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                style={{
                  padding: "10px 18px",
                  borderRadius: 50,
                  border: filter === f ? "none" : "1.5px solid #FFE0D4",
                  background: filter === f
                    ? "linear-gradient(135deg, #E23744, #FF6B35)"
                    : "#FFF8F5",
                  color: filter === f ? "#fff" : "#7C7C7C",
                  fontWeight: 700,
                  fontSize: 13,
                  cursor: "pointer",
                  boxShadow: filter === f ? "0 4px 12px rgba(226,55,68,0.25)" : "none",
                  transition: "all 0.2s ease",
                }}
              >
                {f === "all" ? "All" : f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
          {/* Results count badge */}
          <div style={{
            padding: "8px 14px",
            borderRadius: 50,
            background: "#FFF1F2",
            color: "#E23744",
            fontWeight: 800,
            fontSize: 13,
            whiteSpace: "nowrap",
          }}>
            {filtered.length} customers
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════════════
            SECTION 5 — ATTENDANCE CARDS
            Technical: CSS Grid responsive cards, each card = 1 customer
            Each card has: avatar, name, type badge, attended toggle,
            thali toggle (enabled only if attended), extras button
        ══════════════════════════════════════════════════════════════ */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
          gap: 14,
          marginBottom: 28,
        }}>
          {filtered.map(customer => (
            <div
              key={customer.id}
              style={{
                background: "#fff",
                borderRadius: 18,
                padding: 18,
                boxShadow: customer.attended
                  ? "0 4px 20px rgba(34,197,94,0.12)"
                  : "0 2px 12px rgba(0,0,0,0.06)",
                border: customer.attended
                  ? "1.5px solid rgba(34,197,94,0.25)"
                  : "1.5px solid transparent",
                transition: "all 0.25s ease",
                position: "relative",
                overflow: "hidden",
              }}
            >
              {/* Attended green accent strip */}
              {customer.attended && (
                <div style={{
                  position: "absolute", top: 0, left: 0, right: 0, height: 3,
                  background: "linear-gradient(90deg, #22C55E, #4ADE80)",
                }} />
              )}

              {/* Card top — avatar + name + badge */}
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                {/* Avatar with initials */}
                <div style={{
                  width: 46, height: 46, borderRadius: "50%",
                  background: customer.attended
                    ? "linear-gradient(135deg, #E23744, #FF6B35)"
                    : "linear-gradient(135deg, #E5E7EB, #D1D5DB)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: "#fff", fontWeight: 800, fontSize: 16,
                  flexShrink: 0,
                  boxShadow: customer.attended ? "0 4px 12px rgba(226,55,68,0.3)" : "none",
                }}>
                  {getInitials(customer.name)}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ margin: 0, fontWeight: 800, color: "#1C1C1C", fontSize: 15, 
                    overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {customer.name}
                  </p>
                  {/* Subscription type badge */}
                  <span style={{
                    display: "inline-block",
                    marginTop: 3,
                    padding: "2px 10px",
                    borderRadius: 50,
                    fontSize: 11,
                    fontWeight: 700,
                    background: customer.type === "monthly" ? "#FFF4EE" : "#F5F3FF",
                    color: customer.type === "monthly" ? "#FF6B35" : "#8B5CF6",
                    textTransform: "uppercase",
                    letterSpacing: 0.5,
                  }}>
                    {customer.type === "monthly" ? "📅 Monthly" : "☀️ Daily"}
                  </span>
                </div>
                {/* Extras count badge (top right) */}
                {customer.extras > 0 && (
                  <div style={{
                    minWidth: 22, height: 22, borderRadius: 50,
                    background: "#8B5CF6", color: "#fff",
                    fontWeight: 800, fontSize: 11,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    padding: "0 6px",
                  }}>
                    +{customer.extras}
                  </div>
                )}
              </div>

              {/* Action row — Attended | Thali | Extras */}
              <div style={{ display: "flex", gap: 8 }}>

                {/* Attended toggle button */}
                <button
                  onClick={() => toggleAttendance(customer.id)}
                  style={{
                    flex: 1,
                    padding: "10px 8px",
                    borderRadius: 12,
                    border: "none",
                    cursor: "pointer",
                    fontWeight: 700,
                    fontSize: 12,
                    background: customer.attended
                      ? "linear-gradient(135deg, #22C55E, #4ADE80)"
                      : "#F3F4F6",
                    color: customer.attended ? "#fff" : "#6B7280",
                    boxShadow: customer.attended ? "0 4px 12px rgba(34,197,94,0.3)" : "none",
                    transition: "all 0.2s ease",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 3,
                  }}
                >
                  <span style={{ fontSize: 18 }}>{customer.attended ? "✅" : "⬜"}</span>
                  Present
                </button>

                {/* Thali toggle — disabled if not attended */}
                <button
                  onClick={() => toggleThali(customer.id)}
                  disabled={!customer.attended}
                  style={{
                    flex: 1,
                    padding: "10px 8px",
                    borderRadius: 12,
                    border: "none",
                    cursor: customer.attended ? "pointer" : "not-allowed",
                    fontWeight: 700,
                    fontSize: 12,
                    background: customer.thali
                      ? "linear-gradient(135deg, #FF6B35, #FF8C42)"
                      : "#F3F4F6",
                    color: customer.thali ? "#fff" : customer.attended ? "#6B7280" : "#D1D5DB",
                    boxShadow: customer.thali ? "0 4px 12px rgba(255,107,53,0.3)" : "none",
                    opacity: customer.attended ? 1 : 0.5,
                    transition: "all 0.2s ease",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 3,
                  }}
                >
                  <span style={{ fontSize: 18 }}>🍱</span>
                  Thali
                </button>

                {/* Extras button */}
                <button
                  onClick={() => openExtras(customer.id)}
                  disabled={!customer.attended}
                  style={{
                    flex: 1,
                    padding: "10px 8px",
                    borderRadius: 12,
                    border: "none",
                    cursor: customer.attended ? "pointer" : "not-allowed",
                    fontWeight: 700,
                    fontSize: 12,
                    background: "#FFF1F2",
                    color: customer.attended ? "#E23744" : "#D1D5DB",
                    opacity: customer.attended ? 1 : 0.5,
                    transition: "all 0.2s ease",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 3,
                  }}
                >
                  <span style={{ fontSize: 18 }}>➕</span>
                  Extras
                </button>
              </div>
            </div>
          ))}

          {/* Empty state */}
          {filtered.length === 0 && (
            <div style={{
              gridColumn: "1 / -1",
              textAlign: "center",
              padding: "60px 20px",
              color: "#7C7C7C",
            }}>
              <div style={{ fontSize: 64, marginBottom: 16 }}>🍽️</div>
              <p style={{ fontWeight: 800, fontSize: 18, color: "#1C1C1C", margin: "0 0 8px" }}>
                No customers found
              </p>
              <p style={{ margin: 0, fontSize: 14 }}>Try adjusting your search or filter</p>
            </div>
          )}
        </div>

        {/* ═══════════════════════════════════════════════════════════════
            SECTION 6 — EXTRAS SUMMARY PANEL
            Technical: horizontal scrollable row of extra-item totals
            Shows aggregated count of each extra across all customers
        ══════════════════════════════════════════════════════════════ */}
        <div style={{
          background: "#fff",
          borderRadius: 18,
          padding: 20,
          boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
        }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
            <div>
              <h2 style={{ margin: 0, fontWeight: 800, color: "#1C1C1C", fontSize: 17 }}>
                ➕ Extras Tracker
              </h2>
              <p style={{ margin: "4px 0 0", color: "#7C7C7C", fontSize: 13 }}>
                Total add-ons ordered this shift
              </p>
            </div>
            <div style={{
              padding: "6px 14px",
              background: "linear-gradient(135deg, #E23744, #FF6B35)",
              borderRadius: 50,
              color: "#fff",
              fontWeight: 800,
              fontSize: 13,
            }}>
              {extrasTotal} items
            </div>
          </div>

          {/* Extras grid */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))",
            gap: 10,
          }}>
            {EXTRA_ITEMS.map(item => (
              <div key={item.id} style={{
                background: "#FFF8F5",
                border: "1.5px solid #FFE0D4",
                borderRadius: 14,
                padding: "14px 12px",
                textAlign: "center",
              }}>
                <div style={{ fontSize: 28, marginBottom: 6 }}>{item.icon}</div>
                <p style={{ margin: 0, fontWeight: 800, fontSize: 13, color: "#1C1C1C" }}>
                  {item.name}
                </p>
                <p style={{ margin: "4px 0 0", fontSize: 12, color: "#E23744", fontWeight: 700 }}>
                  ₹{item.price}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════
          SECTION 7 — EXTRAS MODAL
          Technical: fixed overlay with centered modal card
          Appears when staff taps "Extras" on an attended customer
      ════════════════════════════════════════════════════════════════════ */}
      {extrasModal && (() => {
        const customer = customers.find(c => c.id === extrasModal);
        if (!customer) return null;
        const modalTotal = Object.entries(selectedExtras).reduce((sum, [id, qty]) => {
          const item = EXTRA_ITEMS.find(e => e.id === id);
          return sum + (item ? item.price * qty : 0);
        }, 0);
        return (
          <div style={{
            position: "fixed", inset: 0,
            background: "rgba(28,28,28,0.6)",
            backdropFilter: "blur(4px)",
            zIndex: 100,
            display: "flex", alignItems: "flex-end", justifyContent: "center",
            padding: 0,
          }}
            onClick={(e) => e.target === e.currentTarget && setExtrasModal(null)}
          >
            {/* Bottom sheet style — Zomato / Swiggy pattern */}
            <div style={{
              background: "#fff",
              borderRadius: "24px 24px 0 0",
              width: "100%",
              maxWidth: 560,
              padding: "24px 20px 32px",
              boxShadow: "0 -8px 40px rgba(0,0,0,0.15)",
              animation: "slideUp 0.3s ease",
            }}>
              {/* Drag handle */}
              <div style={{
                width: 40, height: 4, borderRadius: 2,
                background: "#E5E7EB",
                margin: "0 auto 20px",
              }} />

              {/* Modal header */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                <div>
                  <h3 style={{ margin: 0, fontWeight: 800, color: "#1C1C1C", fontSize: 18 }}>
                    Add Extras
                  </h3>
                  <p style={{ margin: "4px 0 0", color: "#7C7C7C", fontSize: 13 }}>
                    for {customer.name}
                  </p>
                </div>
                <button onClick={() => setExtrasModal(null)} style={{
                  width: 36, height: 36, borderRadius: "50%",
                  border: "none", background: "#F3F4F6",
                  cursor: "pointer", fontSize: 18, color: "#6B7280",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>✕</button>
              </div>

              {/* Extras item list with qty stepper */}
              <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 20 }}>
                {EXTRA_ITEMS.map(item => {
                  const qty = selectedExtras[item.id] || 0;
                  return (
                    <div key={item.id} style={{
                      display: "flex",
                      alignItems: "center",
                      padding: "12px 14px",
                      borderRadius: 14,
                      border: qty > 0 ? "1.5px solid #FF6B35" : "1.5px solid #F3F4F6",
                      background: qty > 0 ? "#FFF8F5" : "#fff",
                      transition: "all 0.2s",
                    }}>
                      <span style={{ fontSize: 22, marginRight: 12 }}>{item.icon}</span>
                      <div style={{ flex: 1 }}>
                        <p style={{ margin: 0, fontWeight: 700, color: "#1C1C1C", fontSize: 14 }}>
                          {item.name}
                        </p>
                        <p style={{ margin: 0, color: "#E23744", fontWeight: 700, fontSize: 13 }}>
                          ₹{item.price} each
                        </p>
                      </div>
                      {/* Qty stepper */}
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <button
                          onClick={() => adjustExtra(item.id, -1)}
                          style={{
                            width: 30, height: 30, borderRadius: "50%",
                            border: "1.5px solid #E5E7EB",
                            background: "#fff", cursor: "pointer",
                            fontWeight: 800, fontSize: 16, color: "#6B7280",
                            display: "flex", alignItems: "center", justifyContent: "center",
                          }}
                        >−</button>
                        <span style={{ fontWeight: 800, fontSize: 16, color: "#1C1C1C", minWidth: 20, textAlign: "center" }}>
                          {qty}
                        </span>
                        <button
                          onClick={() => adjustExtra(item.id, 1)}
                          style={{
                            width: 30, height: 30, borderRadius: "50%",
                            border: "none",
                            background: "linear-gradient(135deg, #E23744, #FF6B35)",
                            cursor: "pointer",
                            fontWeight: 800, fontSize: 16, color: "#fff",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            boxShadow: "0 2px 8px rgba(226,55,68,0.3)",
                          }}
                        >+</button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Total + Save button */}
              <div style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "14px 18px",
                background: "#FFF8F5",
                borderRadius: 14,
                marginBottom: 14,
              }}>
                <span style={{ fontWeight: 700, color: "#7C7C7C", fontSize: 14 }}>Order Total</span>
                <span style={{ fontWeight: 900, color: "#E23744", fontSize: 20 }}>₹{modalTotal}</span>
              </div>

              <button
                onClick={saveExtras}
                style={{
                  width: "100%",
                  padding: "16px",
                  borderRadius: 14,
                  border: "none",
                  background: "linear-gradient(135deg, #E23744, #FF6B35)",
                  color: "#fff",
                  fontWeight: 800,
                  fontSize: 16,
                  cursor: "pointer",
                  boxShadow: "0 6px 20px rgba(226,55,68,0.35)",
                  fontFamily: "inherit",
                }}
              >
                Save Extras 🍱
              </button>
            </div>
          </div>
        );
      })()}

      {/* ── CSS keyframe for modal slide-up animation ──────────────────────── */}
      <style>{`
        @keyframes slideUp {
          from { transform: translateY(100%); opacity: 0; }
          to   { transform: translateY(0);    opacity: 1; }
        }
        * { box-sizing: border-box; }
        button:active { transform: scale(0.97); }
      `}</style>
    </div>
  );
}
