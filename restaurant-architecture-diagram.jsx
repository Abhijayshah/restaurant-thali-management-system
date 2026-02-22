import { useState } from "react";

const data = {
  roles: [
    {
      role: "shop-owner",
      color: "#FF6B35",
      bg: "#FFF0EB",
      label: "Shop Owner",
      emoji: "👑",
      perms: ["Full System Access", "Approve/Reject Customers", "Change Pricing", "View All Reports", "Manage QR/UPI", "Manage Menu", "View All Financials"],
    },
    {
      role: "staff-manager-monthly",
      color: "#4361EE",
      bg: "#EEF0FF",
      label: "Manager (Monthly)",
      emoji: "📋",
      perms: ["Add Monthly Customers", "Take Monthly Attendance", "View Monthly Reports", "Notify Owner for Approval", "Confirm Payments"],
    },
    {
      role: "staff-manager-daily",
      color: "#7209B7",
      bg: "#F5EEFF",
      label: "Manager (Daily)",
      emoji: "📅",
      perms: ["Manage Walk-in Customers", "Take Daily Attendance", "Daily Billing Summary", "Mark Food Taken", "Per-item Billing"],
    },
    {
      role: "staff-worker",
      color: "#3A86FF",
      bg: "#EBF4FF",
      label: "Staff Worker",
      emoji: "👷",
      perms: ["View Customer Lists", "Mark Food Taken (limited)", "View Attendance", "Basic Access Only"],
    },
    {
      role: "customer-monthly",
      color: "#06D6A0",
      bg: "#E8FDF6",
      label: "Monthly Customer",
      emoji: "🎫",
      perms: ["Own Profile", "Attendance Calendar", "View Subscription", "View Extras", "Order from Menu"],
    },
    {
      role: "customer-daily",
      color: "#FFB703",
      bg: "#FFF8E6",
      label: "Daily Customer",
      emoji: "🍽️",
      perms: ["Own Profile", "Food History", "Total Amount Spent", "Per-visit Tracking"],
    },
  ],
  customerFlow: [
    { step: "1", label: "Manager Adds Customer", icon: "➕", color: "#4361EE" },
    { step: "2", label: "Notification → Owner", icon: "🔔", color: "#FF6B35" },
    { step: "3", label: "Owner Reviews", icon: "👀", color: "#FF6B35" },
    { step: "4", label: "Approve / Reject", icon: "✅❌", color: "#FF6B35" },
    { step: "5", label: "Share QR / UPI", icon: "📱", color: "#06D6A0" },
    { step: "6", label: "Customer Pays", icon: "💰", color: "#06D6A0" },
    { step: "7", label: "Manager Confirms", icon: "✔️", color: "#4361EE" },
    { step: "8", label: "Customer → ACTIVE", icon: "🟢", color: "#06D6A0" },
  ],
  pricing: [
    { shifts: "Morning only", price: "₹1,750/mo", thalis: "60 thalis", color: "#FFB703" },
    { shifts: "Evening only", price: "₹1,750/mo", thalis: "60 thalis", color: "#FF6B35" },
    { shifts: "Night only", price: "₹1,750/mo", thalis: "60 thalis", color: "#4361EE" },
    { shifts: "Morning + Night", price: "₹3,500/mo", thalis: "120 thalis", color: "#7209B7" },
    { shifts: "All 3 Shifts", price: "₹5,250/mo", thalis: "180 thalis", color: "#06D6A0" },
    { shifts: "Daily Walk-in", price: "₹70/thali", thalis: "Pay per visit", color: "#3A86FF" },
  ],
  collections: [
    { name: "Users", color: "#FF6B35", fields: ["_id", "name", "phone", "email", "role", "customerType", "status", "createdBy"] },
    { name: "Subscriptions", color: "#4361EE", fields: ["userId", "month", "shifts[]", "totalAmount", "thalisAllowed", "thalisUsed", "paymentStatus"] },
    { name: "Attendance", color: "#06D6A0", fields: ["userId", "date", "shift", "foodTaken", "items[]", "isThali", "totalCost", "markedBy"] },
    { name: "Menu", color: "#7209B7", fields: ["category", "name", "price", "available", "shift[]", "image"] },
    { name: "Extras", color: "#FFB703", fields: ["userId", "subscriptionId", "date", "shift", "items[]", "totalExtra", "paid"] },
    { name: "Settings", color: "#3A86FF", fields: ["thaliPricePerShift", "dailyThaliPrice", "maxThalisPerMonth", "qrCode", "upiId"] },
  ],
  summary: [
    { label: "Monthly Customers Total", color: "#4361EE", icon: "📋" },
    { label: "Daily Customers Total", color: "#7209B7", icon: "📅" },
    { label: "Grand Total (Combined)", color: "#FF6B35", icon: "💎" },
  ],
};

function Section({ title, children }) {
  return (
    <div style={{ marginBottom: 40 }}>
      <h2 style={{ fontFamily: "'Georgia', serif", fontSize: 20, color: "#1a1a2e", borderLeft: "4px solid #FF6B35", paddingLeft: 12, marginBottom: 20 }}>
        {title}
      </h2>
      {children}
    </div>
  );
}

export default function App() {
  const [activeRole, setActiveRole] = useState(null);

  return (
    <div style={{ fontFamily: "'Segoe UI', sans-serif", background: "#F8F9FF", minHeight: "100vh", padding: "32px 24px", maxWidth: 1100, margin: "0 auto" }}>
      
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: 48 }}>
        <div style={{ fontSize: 48, marginBottom: 8 }}>🍽️</div>
        <h1 style={{ fontFamily: "'Georgia', serif", fontSize: 32, color: "#1a1a2e", margin: 0 }}>
          Restaurant Thali Management System
        </h1>
        <p style={{ color: "#666", marginTop: 8, fontSize: 15 }}>MERN Stack Architecture — Full System Blueprint</p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", marginTop: 16, flexWrap: "wrap" }}>
          {["MongoDB", "Express.js", "React 18", "Node.js"].map(t => (
            <span key={t} style={{ background: "#1a1a2e", color: "#fff", padding: "4px 14px", borderRadius: 20, fontSize: 13, fontWeight: 600 }}>{t}</span>
          ))}
        </div>
      </div>

      {/* Roles */}
      <Section title="👥 Role-Based Access Control (RBAC)">
        <p style={{ color: "#555", marginBottom: 16, fontSize: 14 }}>Click a role to see permissions</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: 16 }}>
          {data.roles.map(r => (
            <div
              key={r.role}
              onClick={() => setActiveRole(activeRole === r.role ? null : r.role)}
              style={{
                background: activeRole === r.role ? r.color : r.bg,
                border: `2px solid ${r.color}`,
                borderRadius: 12,
                padding: 16,
                cursor: "pointer",
                transition: "all 0.2s",
                color: activeRole === r.role ? "#fff" : "#1a1a2e",
              }}
            >
              <div style={{ fontSize: 28 }}>{r.emoji}</div>
              <div style={{ fontWeight: 700, fontSize: 15, marginTop: 6 }}>{r.label}</div>
              <div style={{ fontSize: 12, opacity: 0.7, marginTop: 2, fontFamily: "monospace" }}>{r.role}</div>
              {activeRole === r.role && (
                <ul style={{ marginTop: 12, paddingLeft: 16, fontSize: 13 }}>
                  {r.perms.map(p => <li key={p} style={{ marginBottom: 4 }}>{p}</li>)}
                </ul>
              )}
            </div>
          ))}
        </div>
      </Section>

      {/* Customer Registration Flow */}
      <Section title="🔄 Customer Registration & Approval Flow">
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, alignItems: "center" }}>
          {data.customerFlow.map((s, i) => (
            <div key={s.step} style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ background: s.color, color: "#fff", borderRadius: 10, padding: "10px 14px", minWidth: 110, textAlign: "center" }}>
                <div style={{ fontSize: 20 }}>{s.icon}</div>
                <div style={{ fontSize: 11, fontWeight: 600, marginTop: 4 }}>Step {s.step}</div>
                <div style={{ fontSize: 12, marginTop: 2 }}>{s.label}</div>
              </div>
              {i < data.customerFlow.length - 1 && (
                <div style={{ fontSize: 20, color: "#999" }}>→</div>
              )}
            </div>
          ))}
        </div>
      </Section>

      {/* Pricing */}
      <Section title="💰 Pricing Structure">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 16 }}>
          {data.pricing.map(p => (
            <div key={p.shifts} style={{ background: "#fff", border: `2px solid ${p.color}`, borderRadius: 12, padding: 16, textAlign: "center" }}>
              <div style={{ fontWeight: 700, color: p.color, fontSize: 22 }}>{p.price}</div>
              <div style={{ fontWeight: 600, marginTop: 6, fontSize: 14 }}>{p.shifts}</div>
              <div style={{ color: "#888", fontSize: 13, marginTop: 4 }}>{p.thalis}</div>
            </div>
          ))}
        </div>
        <div style={{ background: "#fff3cd", border: "1px solid #FFB703", borderRadius: 8, padding: 12, marginTop: 16, fontSize: 13 }}>
          💡 <strong>Flexible Pricing:</strong> Owner can update thali price per shift anytime from Settings. All calculations update automatically.
        </div>
      </Section>

      {/* Owner Revenue Summary */}
      <Section title="📊 Owner Revenue Dashboard (3 Totals)">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 16 }}>
          {data.summary.map(s => (
            <div key={s.label} style={{ background: "#fff", border: `2px solid ${s.color}`, borderRadius: 12, padding: 20, textAlign: "center" }}>
              <div style={{ fontSize: 32 }}>{s.icon}</div>
              <div style={{ color: s.color, fontWeight: 700, fontSize: 15, marginTop: 8 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </Section>

      {/* Database Schema */}
      <Section title="🗄️ MongoDB Collections (Schema Overview)">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: 16 }}>
          {data.collections.map(c => (
            <div key={c.name} style={{ background: "#fff", border: `2px solid ${c.color}`, borderRadius: 12, padding: 16 }}>
              <div style={{ fontWeight: 700, color: c.color, fontSize: 16, marginBottom: 10 }}>📦 {c.name}</div>
              {c.fields.map(f => (
                <div key={f} style={{ fontFamily: "monospace", fontSize: 12, color: "#444", padding: "3px 6px", background: "#f5f5f5", borderRadius: 4, marginBottom: 4 }}>{f}</div>
              ))}
            </div>
          ))}
        </div>
      </Section>

      {/* Attendance Calendar Legend */}
      <Section title="📅 Attendance Calendar System">
        <div style={{ display: "flex", gap: 20, flexWrap: "wrap", marginBottom: 16 }}>
          {[
            { color: "#06D6A0", label: "Food Taken ✅" },
            { color: "#FF6B35", label: "Food Missed ❌" },
            { color: "#ccc", label: "Not Subscribed (grey)" },
            { color: "#4361EE", label: "Today" },
          ].map(l => (
            <div key={l.label} style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 24, height: 24, background: l.color, borderRadius: 4 }} />
              <span style={{ fontSize: 13 }}>{l.label}</span>
            </div>
          ))}
        </div>
        <div style={{ background: "#fff", border: "1px solid #ddd", borderRadius: 12, padding: 16 }}>
          <div style={{ marginBottom: 12, fontWeight: 600 }}>Sample Calendar — Morning Shift (January)</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 6 }}>
            {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map(d => (
              <div key={d} style={{ textAlign: "center", fontSize: 11, color: "#888", fontWeight: 600, padding: 4 }}>{d}</div>
            ))}
            {Array.from({ length: 31 }, (_, i) => {
              const colors = ["#06D6A0","#06D6A0","#06D6A0","#FF6B35","#06D6A0","#06D6A0","#ccc","#06D6A0","#06D6A0","#FF6B35"];
              const c = colors[i % 10];
              return (
                <div key={i} style={{ background: c, borderRadius: 6, textAlign: "center", padding: "6px 0", fontSize: 12, color: "#fff", fontWeight: 600 }}>{i + 1}</div>
              );
            })}
          </div>
        </div>
      </Section>

      {/* Tech Stack */}
      <Section title="⚙️ Technology Stack">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 12 }}>
          {[
            { layer: "Frontend", tech: "React 18 + Vite", color: "#61DAFB" },
            { layer: "UI / Styling", tech: "Tailwind CSS + shadcn/ui", color: "#06B6D4" },
            { layer: "State Mgmt", tech: "Redux Toolkit", color: "#764ABC" },
            { layer: "Charts", tech: "Recharts", color: "#8884D8" },
            { layer: "Backend", tech: "Node.js + Express.js", color: "#68A063" },
            { layer: "Database", tech: "MongoDB + Mongoose", color: "#4DB33D" },
            { layer: "Auth", tech: "JWT + bcryptjs", color: "#FF6B35" },
            { layer: "Real-time", tech: "Socket.io", color: "#FFB703" },
            { layer: "Validation", tech: "Zod / Joi", color: "#7209B7" },
            { layer: "Deployment", tech: "Vercel + Railway", color: "#000" },
          ].map(t => (
            <div key={t.layer} style={{ background: "#fff", border: "1px solid #eee", borderRadius: 10, padding: 14, borderLeft: `4px solid ${t.color}` }}>
              <div style={{ fontSize: 11, color: "#888", textTransform: "uppercase", fontWeight: 700 }}>{t.layer}</div>
              <div style={{ fontWeight: 600, marginTop: 4, fontSize: 14 }}>{t.tech}</div>
            </div>
          ))}
        </div>
      </Section>

      {/* Folder Structure */}
      <Section title="📁 Project Folder Structure">
        <div style={{ background: "#1a1a2e", color: "#e0e0e0", borderRadius: 12, padding: 20, fontFamily: "monospace", fontSize: 13, lineHeight: 1.8 }}>
          <div style={{ color: "#FFB703" }}>restaurant-mern/</div>
          <div style={{ paddingLeft: 20 }}>
            <div style={{ color: "#61DAFB" }}>├── client/ <span style={{ color: "#888" }}>(React Frontend)</span></div>
            <div style={{ paddingLeft: 20 }}>
              <div>├── src/components/ <span style={{ color: "#888" }}>(common, attendance, customer, menu)</span></div>
              <div>├── src/pages/ <span style={{ color: "#888" }}>(auth, owner, manager, staff, customer)</span></div>
              <div>├── src/store/ <span style={{ color: "#888" }}>(Redux slices)</span></div>
              <div>├── src/hooks/ <span style={{ color: "#888" }}>(custom hooks)</span></div>
              <div>└── src/api/ <span style={{ color: "#888" }}>(Axios calls)</span></div>
            </div>
            <div style={{ color: "#68A063", marginTop: 8 }}>├── server/ <span style={{ color: "#888" }}>(Express Backend)</span></div>
            <div style={{ paddingLeft: 20 }}>
              <div>├── models/ <span style={{ color: "#888" }}>(User, Subscription, Attendance, Menu, Extras, Settings)</span></div>
              <div>├── routes/ <span style={{ color: "#888" }}>(auth, users, subscriptions, attendance, menu, reports)</span></div>
              <div>├── controllers/ <span style={{ color: "#888" }}>(business logic)</span></div>
              <div>└── middleware/ <span style={{ color: "#888" }}>(auth, roleCheck, errorHandler)</span></div>
            </div>
            <div style={{ marginTop: 8 }}>├── .env</div>
            <div>└── README.md</div>
          </div>
        </div>
      </Section>

      {/* Footer */}
      <div style={{ textAlign: "center", color: "#888", fontSize: 13, marginTop: 40, paddingTop: 20, borderTop: "1px solid #ddd" }}>
        Restaurant Thali Management System — MERN Stack Blueprint | Ready for Development
      </div>
    </div>
  );
}
