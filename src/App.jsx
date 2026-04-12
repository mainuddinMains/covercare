import { useState } from "react";

const FONTS = `@import url('https://fonts.googleapis.com/css2?family=Lora:wght@400;500;600&family=DM+Sans:wght@300;400;500;600&display=swap');`;

const C = {
  bg: "#F7F4EF",
  surface: "#FFFFFF",
  teal: "#0A5C5C",
  tealLight: "#E0F2F1",
  tealMid: "#1A8C8C",
  amber: "#E8924A",
  amberLight: "#FEF3E8",
  dark: "#1A2928",
  muted: "#6B7C7B",
  border: "#E0DDD8",
  success: "#2D7A4A",
  successLight: "#E8F5EE",
  danger: "#C0392B",
  dangerLight: "#FDECEA",
  info: "#2563EB",
  infoLight: "#EFF6FF",
};

const INSURANCE_PLANS = [
  { id: "hmo", name: "HMO", full: "Health Maintenance Organization", desc: "Lower costs, requires referrals, in-network only" },
  { id: "ppo", name: "PPO", full: "Preferred Provider Organization", desc: "Flexible, no referrals, can go out-of-network" },
  { id: "epo", name: "EPO", full: "Exclusive Provider Organization", desc: "In-network only, no referrals needed" },
  { id: "hdhp", name: "HDHP", full: "High Deductible Health Plan", desc: "Low premiums, high deductible, pairs with HSA" },
];

const INSURANCE_COMPANIES = [
  "Blue Cross Blue Shield (BCBS)", "Aetna", "UnitedHealthcare",
  "Cigna", "Humana", "Kaiser Permanente", "Anthem",
  "University/Student Health Plan", "Medicaid", "Other"
];

const PROVIDERS = [
  { id: 1, name: "Barnes-Jewish Hospital", type: "Major Hospital", typeIcon: "H", address: "1 Barnes Jewish Hospital Plaza, St. Louis, MO", distance: "2.3 mi", rating: 4.8, phone: "(314) 747-3000", specialties: ["Emergency Care", "Cardiology", "Oncology", "General Medicine"], networks: ["BCBS", "Aetna", "UnitedHealthcare", "Cigna", "Humana"], copayRange: "$250–500", waitTime: "~45 min avg", lat: 38.637, lng: -90.262 },
  { id: 2, name: "Wash. U. Physicians Clinic", type: "Specialty Clinic", typeIcon: "C", address: "4921 Parkview Pl, St. Louis, MO", distance: "1.8 mi", rating: 4.7, phone: "(314) 362-7382", specialties: ["Primary Care", "Internal Medicine", "Dermatology", "Psychiatry"], networks: ["BCBS", "Aetna", "Cigna", "Student Plans"], copayRange: "$25–50", waitTime: "3–5 days", lat: 38.636, lng: -90.261 },
  { id: 3, name: "WashU Student Health", type: "Student Health", typeIcon: "S", address: "Danforth Campus, St. Louis, MO", distance: "0.9 mi", rating: 4.5, phone: "(314) 935-6666", specialties: ["Primary Care", "Mental Health", "Immunizations", "Sexual Health"], networks: ["Student Health Plans", "Most Major Plans"], copayRange: "$0–20", waitTime: "Same-day often", lat: 38.648, lng: -90.306 },
  { id: 4, name: "Urgent Care Now - Clayton", type: "Urgent Care", typeIcon: "U", address: "7910 Clayton Rd, Clayton, MO", distance: "3.1 mi", rating: 4.2, phone: "(314) 721-7700", specialties: ["Minor Injuries", "Illness", "X-rays", "Lab Tests"], networks: ["Most Major Plans"], copayRange: "$75–150", waitTime: "~20 min", lat: 38.645, lng: -90.347 },
  { id: 5, name: "SLUCare Physician Group", type: "Specialty Clinic", typeIcon: "C", address: "1008 S Spring Ave, St. Louis, MO", distance: "1.2 mi", rating: 4.4, phone: "(314) 977-4440", specialties: ["Primary Care", "Cardiology", "OB/GYN", "Neurology"], networks: ["BCBS", "Aetna", "Cigna", "Medicaid"], copayRange: "$30–60", waitTime: "3–7 days", lat: 38.624, lng: -90.254 },
];

const LEARN_CARDS = [
  { icon: "▣", title: "Your Insurance Card", color: C.teal, content: "Your insurance card is your key to healthcare. It shows your Member ID, Group Number, and important phone numbers. Always carry it to appointments. You get this after enrolling — usually through your university or employer." },
  { icon: "◈", title: "Understanding Your Costs", color: "#2D5FAA", content: "Premium: monthly fee to have insurance. Deductible: amount you pay before insurance helps (e.g. $500/year). Copay: fixed fee per visit (e.g. $25). Coinsurance: % you pay after deductible (e.g. 20%). Out-of-pocket max: the most you'll ever pay in a year." },
  { icon: "◆", title: "Types of Care", color: "#2D7A4A", content: "Primary Care Doctor (PCP): Your first stop for non-emergencies. Urgent Care: For issues needing attention today but not life-threatening. Emergency Room (ER): True emergencies only — very expensive otherwise. Specialist: For specific conditions, often needs a referral." },
  { icon: "◉", title: "In-Network vs Out-of-Network", color: C.amber, content: "In-network providers have contracts with your insurer — you pay much less. Out-of-network can be extremely expensive. Always verify a provider is in-network by calling your insurance company or checking their website before your visit." },
  { icon: "▶", title: "Making an Appointment", color: "#7A3DAA", content: "Call the provider, say you're a new patient, and give your insurance info. They verify your coverage. For your first visit, bring your insurance card, photo ID, and medical history. Arrive 15 minutes early — there will be paperwork." },
  { icon: "◐", title: "Getting a Prescription", color: "#AA3D5F", content: "Doctors send prescriptions electronically to a pharmacy. CVS, Walgreens, and Walmart are common. Show your insurance card at the counter. Generic drugs cost far less than brand names — ask your doctor if a generic is available." },
];

const CLINICS = [
  { id: 1, name: "CHCS - Grace Hill Health Centers", type: "FQHC", address: "1717 N 14th St, St. Louis, MO", distance: "1.4 mi", phone: "(314) 814-8200", services: ["Primary Care", "Dental", "Behavioral Health", "WIC"], accepts: "All patients, sliding scale, no status check" },
  { id: 2, name: "Peter & Paul Community Services", type: "Free Clinic", address: "721 N 1st St, St. Louis, MO", distance: "2.1 mi", phone: "(314) 421-3093", services: ["Primary Care", "Prescriptions", "Lab Work"], accepts: "Uninsured & undocumented, free of charge" },
  { id: 3, name: "SLU School of Medicine Free Clinic", type: "Free Clinic", address: "1402 S Grand Blvd, St. Louis, MO", distance: "0.8 mi", phone: "(314) 977-5511", services: ["Primary Care", "Mental Health", "Chronic Disease"], accepts: "Uninsured residents, income-based" },
  { id: 4, name: "Affinia Healthcare (FQHC)", type: "FQHC", address: "1027 Bellevue Ave, St. Louis, MO", distance: "3.2 mi", phone: "(314) 814-8800", services: ["Family Medicine", "OB/GYN", "Pediatrics", "HIV Care"], accepts: "All patients, sliding fee scale" },
];

function Badge({ children, color = C.teal, bg }) {
  return (
    <span style={{ fontSize: 11, fontWeight: 500, padding: "2px 8px", borderRadius: 20, background: bg || color + "18", color, fontFamily: "'DM Sans', sans-serif", whiteSpace: "nowrap" }}>
      {children}
    </span>
  );
}

function StarRating({ rating }) {
  return (
    <span style={{ fontSize: 12, color: C.amber }}>
      {"★".repeat(Math.floor(rating))}{"☆".repeat(5 - Math.floor(rating))} <span style={{ color: C.muted }}>{rating}</span>
    </span>
  );
}

function ProviderCard({ p, insurance, onSelect }) {
  const inNetwork = p.networks.includes("Most Major Plans") ||
    p.networks.some(n => n.toLowerCase().includes((insurance?.company || "").toLowerCase().split(" ")[0]));
  const typeColors = { "Major Hospital": C.teal, "Hospital": C.teal, "Specialty Clinic": C.tealMid, "Student Health": "#2D7A4A", "Urgent Care": C.amber };
  const tc = typeColors[p.type] || C.teal;

  return (
    <div onClick={() => onSelect(p)} style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 16, padding: "16px 20px", cursor: "pointer", marginBottom: 12, transition: "box-shadow 0.2s" }}
      onMouseEnter={e => e.currentTarget.style.boxShadow = "0 4px 20px rgba(10,92,92,0.1)"}
      onMouseLeave={e => e.currentTarget.style.boxShadow = "none"}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <div style={{ width: 40, height: 40, borderRadius: 10, background: tc + "18", display: "flex", alignItems: "center", justifyContent: "center", color: tc, fontWeight: 700, fontSize: 14 }}>{p.typeIcon}</div>
          <div>
            <p style={{ margin: 0, fontFamily: "'Lora', serif", fontSize: 15, fontWeight: 600, color: C.dark }}>{p.name}</p>
            <p style={{ margin: "2px 0 0", fontSize: 12, color: C.muted }}>{p.type}</p>
          </div>
        </div>
        <Badge color={inNetwork ? C.success : C.danger} bg={inNetwork ? C.successLight : C.dangerLight}>
          {inNetwork ? "✓ In-Network" : "Out-of-Network"}
        </Badge>
      </div>
      <p style={{ margin: "0 0 8px", fontSize: 12, color: C.muted }}>📍 {p.address} · {p.distance}</p>
      <StarRating rating={p.rating} />
      <div style={{ display: "flex", gap: 8, marginTop: 10, flexWrap: "wrap" }}>
        {p.specialties.slice(0, 3).map(s => <Badge key={s}>{s}</Badge>)}
        {p.specialties.length > 3 && <Badge color={C.muted}>+{p.specialties.length - 3} more</Badge>}
      </div>
      <div style={{ marginTop: 12, paddingTop: 12, borderTop: `1px solid ${C.border}`, display: "flex", gap: 16 }}>
        <div><p style={{ margin: 0, fontSize: 11, color: C.muted }}>EST. COPAY</p><p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: C.dark }}>{p.copayRange}</p></div>
        <div><p style={{ margin: 0, fontSize: 11, color: C.muted }}>WAIT TIME</p><p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: C.dark }}>{p.waitTime}</p></div>
        <div style={{ marginLeft: "auto" }}><p style={{ margin: 0, fontSize: 11, color: C.muted }}>PHONE</p><p style={{ margin: 0, fontSize: 13, fontWeight: 500, color: C.teal }}>{p.phone}</p></div>
      </div>
    </div>
  );
}

function ProviderModal({ p, onClose, insurance }) {
  if (!p) return null;
  const inNetwork = p.networks.includes("Most Major Plans") ||
    p.networks.some(n => n.toLowerCase().includes((insurance?.company || "").toLowerCase().split(" ")[0]));

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(10,40,40,0.5)", zIndex: 100, display: "flex", alignItems: "flex-end", justifyContent: "center" }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{ background: C.surface, borderRadius: "24px 24px 0 0", width: "100%", maxWidth: 640, maxHeight: "85vh", overflowY: "auto", padding: "28px 28px 40px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
          <div>
            <p style={{ margin: 0, fontFamily: "'Lora', serif", fontSize: 20, fontWeight: 600, color: C.dark }}>{p.name}</p>
            <p style={{ margin: "4px 0 0", color: C.muted, fontSize: 13 }}>{p.type} · {p.distance} away</p>
          </div>
          <button onClick={onClose} style={{ border: "none", background: C.border, borderRadius: "50%", width: 32, height: 32, cursor: "pointer", fontSize: 16, color: C.dark }}>×</button>
        </div>

        <Badge color={inNetwork ? C.success : C.danger} bg={inNetwork ? C.successLight : C.dangerLight}>
          {inNetwork ? "✓ In-Network with your plan" : "⚠ Out-of-Network — verify before visiting"}
        </Badge>

        <div style={{ background: C.tealLight, borderRadius: 12, padding: "16px 20px", margin: "16px 0" }}>
          <p style={{ margin: "0 0 4px", fontSize: 12, fontWeight: 600, color: C.teal }}>ADDRESS</p>
          <p style={{ margin: "0 0 12px", fontSize: 14, color: C.dark }}>{p.address}</p>
          <p style={{ margin: "0 0 4px", fontSize: 12, fontWeight: 600, color: C.teal }}>PHONE</p>
          <p style={{ margin: 0, fontSize: 14, color: C.dark }}>{p.phone}</p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 20 }}>
          {[["Rating", `★ ${p.rating}/5`], ["Est. Copay", p.copayRange], ["Wait Time", p.waitTime]].map(([l, v]) => (
            <div key={l} style={{ background: C.bg, borderRadius: 10, padding: "12px 14px" }}>
              <p style={{ margin: "0 0 4px", fontSize: 11, color: C.muted }}>{l}</p>
              <p style={{ margin: 0, fontSize: 14, fontWeight: 600, color: C.dark }}>{v}</p>
            </div>
          ))}
        </div>

        <p style={{ margin: "0 0 8px", fontSize: 13, fontWeight: 600, color: C.dark }}>Specialties</p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 20 }}>
          {p.specialties.map(s => <Badge key={s}>{s}</Badge>)}
        </div>

        <p style={{ margin: "0 0 8px", fontSize: 13, fontWeight: 600, color: C.dark }}>Accepted Insurance Networks</p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 24 }}>
          {p.networks.map(n => <Badge key={n} color="#2D5FAA" bg="#EFF6FF">{n}</Badge>)}
        </div>

        <div style={{ background: "#FFFBF0", border: `1px solid #F4E4A0`, borderRadius: 12, padding: "14px 18px", marginBottom: 20 }}>
          <p style={{ margin: "0 0 6px", fontSize: 12, fontWeight: 600, color: "#8A6A00" }}>💡 BEFORE YOU GO</p>
          <p style={{ margin: 0, fontSize: 13, color: "#5A4A00", lineHeight: 1.6 }}>Call ahead to confirm your insurance is accepted and to book an appointment. Bring your insurance card, photo ID, and any previous medical records. Arrive 15 minutes early.</p>
        </div>

        <div style={{ display: "block", width: "100%", background: C.teal, color: "#fff", textAlign: "center", padding: "14px 0", borderRadius: 12, fontWeight: 600, fontSize: 15, cursor: "pointer" }}
          onClick={() => alert(`Calling ${p.phone}`)}>
          📞 Call to Book Appointment
        </div>
      </div>
    </div>
  );
}

function parseMarkdown(text) {
  return text.split("\n").map((line, i) => {
    if (!line.trim()) return <br key={i} />;
    const parts = line.split(/\*\*(.*?)\*\*/g);
    return (
      <p key={i} style={{ margin: "0 0 6px", lineHeight: 1.65, fontSize: 14, color: C.dark, fontFamily: "'DM Sans', sans-serif" }}>
        {parts.map((part, j) => j % 2 === 1 ? <strong key={j} style={{ color: C.teal }}>{part}</strong> : part)}
      </p>
    );
  });
}

function LoginPage({ onLogin }) {
  const [mode, setMode] = useState("login");
  const [name, setName] = useState("Mainuddin");
  const [email, setEmail] = useState("mainuddin@slu.edu");
  const [pass, setPass] = useState("••••••••");

  return (
    <div style={{ minHeight: "100vh", background: C.bg, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 24, fontFamily: "'DM Sans', sans-serif" }}>
      <div style={{ maxWidth: 420, width: "100%" }}>
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div style={{ width: 64, height: 64, borderRadius: 20, background: C.teal, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px", fontSize: 28 }}>⚕</div>
          <h1 style={{ fontFamily: "'Lora', serif", fontSize: 30, fontWeight: 600, color: C.dark, margin: "0 0 8px" }}>CoverCare</h1>
          <p style={{ color: C.muted, fontSize: 15, margin: 0 }}>Your US healthcare navigation guide</p>
        </div>

        <div style={{ background: C.surface, borderRadius: 20, padding: "32px 28px", border: `1px solid ${C.border}` }}>
          <div style={{ display: "flex", marginBottom: 24, background: C.bg, borderRadius: 10, padding: 4 }}>
            {["login", "signup"].map(m => (
              <button key={m} onClick={() => setMode(m)} style={{ flex: 1, padding: "8px 0", border: "none", borderRadius: 8, cursor: "pointer", fontSize: 14, fontWeight: 500, background: mode === m ? C.surface : "transparent", color: mode === m ? C.dark : C.muted, fontFamily: "'DM Sans', sans-serif" }}>
                {m === "login" ? "Log In" : "Sign Up"}
              </button>
            ))}
          </div>

          {mode === "signup" && (
            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: C.muted, letterSpacing: 0.5 }}>FULL NAME</label>
              <input value={name} onChange={e => setName(e.target.value)} placeholder="Your name" style={{ display: "block", width: "100%", marginTop: 6, padding: "11px 14px", border: `1.5px solid ${C.border}`, borderRadius: 10, fontSize: 14, color: C.dark, background: C.bg, outline: "none", boxSizing: "border-box", fontFamily: "'DM Sans', sans-serif" }} />
            </div>
          )}
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 12, fontWeight: 600, color: C.muted, letterSpacing: 0.5 }}>EMAIL</label>
            <input value={email} onChange={e => setEmail(e.target.value)} placeholder="you@university.edu" style={{ display: "block", width: "100%", marginTop: 6, padding: "11px 14px", border: `1.5px solid ${C.border}`, borderRadius: 10, fontSize: 14, color: C.dark, background: C.bg, outline: "none", boxSizing: "border-box", fontFamily: "'DM Sans', sans-serif" }} />
          </div>
          <div style={{ marginBottom: 24 }}>
            <label style={{ fontSize: 12, fontWeight: 600, color: C.muted, letterSpacing: 0.5 }}>PASSWORD</label>
            <input value={pass} onChange={e => setPass(e.target.value)} placeholder="••••••••" type="password" style={{ display: "block", width: "100%", marginTop: 6, padding: "11px 14px", border: `1.5px solid ${C.border}`, borderRadius: 10, fontSize: 14, color: C.dark, background: C.bg, outline: "none", boxSizing: "border-box", fontFamily: "'DM Sans', sans-serif" }} />
          </div>
          <button onClick={() => onLogin(name || email.split("@")[0], email)} style={{ width: "100%", padding: "13px 0", background: C.teal, color: "#fff", border: "none", borderRadius: 12, fontSize: 15, fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>
            {mode === "login" ? "Log In" : "Create Account"} →
          </button>
        </div>
        <p style={{ textAlign: "center", fontSize: 12, color: C.muted, marginTop: 20 }}>Helping immigrants & international students navigate US healthcare.</p>
      </div>
    </div>
  );
}

function OnboardStatus({ user, onNext }) {
  const [selected, setSelected] = useState("");
  const statuses = [
    { id: "undocumented", icon: "🌍", label: "Undocumented immigrant", desc: "No SSN or ITIN, recently arrived" },
    { id: "greencard", icon: "📄", label: "Green card / LPR", desc: "Permanent resident" },
    { id: "visa", icon: "✈️", label: "Work or student visa", desc: "H-1B, F-1, J-1 or other visa" },
    { id: "citizen", icon: "🇺🇸", label: "US citizen / uninsured", desc: "Citizen with no current coverage" },
  ];
  return (
    <div style={{ minHeight: "100vh", background: C.bg, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div style={{ maxWidth: 500, width: "100%" }}>
        <div style={{ display: "flex", gap: 8, marginBottom: 32 }}>
          {[0,1,2,3].map(i => <div key={i} style={{ flex: 1, height: 4, borderRadius: 2, background: i === 0 ? C.teal : C.border }} />)}
        </div>
        <h2 style={{ fontFamily: "'Lora', serif", fontSize: 24, color: C.dark, margin: "0 0 8px" }}>Hi {user}! What's your situation?</h2>
        <p style={{ color: C.muted, fontSize: 14, margin: "0 0 28px", lineHeight: 1.6 }}>This helps us show you the right insurance options and care pathways.</p>
        <div style={{ display: "grid", gap: 12, marginBottom: 24 }}>
          {statuses.map(s => (
            <div key={s.id} onClick={() => setSelected(s.id)} style={{ background: selected === s.id ? C.tealLight : C.surface, border: `2px solid ${selected === s.id ? C.teal : C.border}`, borderRadius: 14, padding: "14px 18px", cursor: "pointer", display: "flex", gap: 14, alignItems: "center", transition: "all 0.2s" }}>
              <span style={{ fontSize: 24 }}>{s.icon}</span>
              <div>
                <p style={{ margin: "0 0 2px", fontWeight: 600, fontSize: 14, color: C.dark, fontFamily: "'DM Sans', sans-serif" }}>{s.label}</p>
                <p style={{ margin: 0, fontSize: 12, color: C.muted, fontFamily: "'DM Sans', sans-serif" }}>{s.desc}</p>
              </div>
              <div style={{ width: 20, height: 20, borderRadius: "50%", border: `2px solid ${selected === s.id ? C.teal : C.border}`, background: selected === s.id ? C.teal : "transparent", marginLeft: "auto", flexShrink: 0 }} />
            </div>
          ))}
        </div>
        <button onClick={() => selected && onNext(selected)} style={{ width: "100%", padding: "13px 0", background: selected ? C.teal : C.border, color: selected ? "#fff" : C.muted, border: "none", borderRadius: 12, fontSize: 15, fontWeight: 600, cursor: selected ? "pointer" : "default", fontFamily: "'DM Sans', sans-serif" }}>
          Next →
        </button>
      </div>
    </div>
  );
}

function OnboardInsurance({ user, status, onComplete, onSkip }) {
  const [step, setStep] = useState(0);
  const [company, setCompany] = useState("");
  const [planType, setPlanType] = useState("");
  const [memberId, setMemberId] = useState("");
  const [deductible, setDeductible] = useState("");
  const [copay, setCopay] = useState("");

  return (
    <div style={{ minHeight: "100vh", background: C.bg, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 24, fontFamily: "'DM Sans', sans-serif" }}>
      <div style={{ maxWidth: 500, width: "100%" }}>
        <div style={{ display: "flex", gap: 8, marginBottom: 32 }}>
          {[0,1,2,3].map(i => <div key={i} style={{ flex: 1, height: 4, borderRadius: 2, background: i <= step + 1 ? C.teal : C.border, transition: "background 0.3s" }} />)}
        </div>

        {step === 0 && (
          <div>
            <h2 style={{ fontFamily: "'Lora', serif", fontSize: 24, color: C.dark, margin: "0 0 8px" }}>Do you have insurance?</h2>
            <p style={{ color: C.muted, fontSize: 14, margin: "0 0 28px", lineHeight: 1.6 }}>This helps us find in-network providers and estimate your costs.</p>
            <label style={{ fontSize: 12, fontWeight: 600, color: C.muted, letterSpacing: 0.5 }}>INSURANCE COMPANY</label>
            <select value={company} onChange={e => setCompany(e.target.value)} style={{ display: "block", width: "100%", marginTop: 8, marginBottom: 20, padding: "12px 14px", border: `1.5px solid ${C.border}`, borderRadius: 10, fontSize: 14, color: C.dark, background: C.surface, outline: "none", boxSizing: "border-box", fontFamily: "'DM Sans', sans-serif" }}>
              <option value="">Select your insurer...</option>
              {INSURANCE_COMPANIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <label style={{ fontSize: 12, fontWeight: 600, color: C.muted, letterSpacing: 0.5 }}>MEMBER ID (from your card)</label>
            <input value={memberId} onChange={e => setMemberId(e.target.value)} placeholder="e.g. ABC123456789" style={{ display: "block", width: "100%", marginTop: 8, marginBottom: 24, padding: "12px 14px", border: `1.5px solid ${C.border}`, borderRadius: 10, fontSize: 14, color: C.dark, background: C.surface, outline: "none", boxSizing: "border-box", fontFamily: "'DM Sans', sans-serif" }} />
            <button onClick={() => company && setStep(1)} style={{ width: "100%", padding: "13px 0", background: company ? C.teal : C.border, color: company ? "#fff" : C.muted, border: "none", borderRadius: 12, fontSize: 15, fontWeight: 600, cursor: company ? "pointer" : "default", fontFamily: "'DM Sans', sans-serif" }}>Next →</button>
            <button onClick={onSkip} style={{ width: "100%", marginTop: 12, padding: "10px 0", background: "transparent", color: C.muted, border: "none", fontSize: 14, cursor: "pointer" }}>I don't have insurance yet</button>
          </div>
        )}

        {step === 1 && (
          <div>
            <h2 style={{ fontFamily: "'Lora', serif", fontSize: 24, color: C.dark, margin: "0 0 8px" }}>What type of plan?</h2>
            <p style={{ color: C.muted, fontSize: 14, margin: "0 0 24px" }}>Check your insurance card or enrollment email.</p>
            <div style={{ display: "grid", gap: 12, marginBottom: 24 }}>
              {INSURANCE_PLANS.map(plan => (
                <div key={plan.id} onClick={() => setPlanType(plan.id)} style={{ background: planType === plan.id ? C.tealLight : C.surface, border: `2px solid ${planType === plan.id ? C.teal : C.border}`, borderRadius: 12, padding: "14px 18px", cursor: "pointer", transition: "all 0.2s" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <p style={{ margin: "0 0 4px", fontWeight: 600, fontSize: 15, color: C.dark }}><span style={{ color: C.teal }}>{plan.name}</span> — {plan.full}</p>
                      <p style={{ margin: 0, fontSize: 12, color: C.muted }}>{plan.desc}</p>
                    </div>
                    <div style={{ width: 20, height: 20, borderRadius: "50%", border: `2px solid ${planType === plan.id ? C.teal : C.border}`, background: planType === plan.id ? C.teal : "transparent", flexShrink: 0, marginLeft: 12 }} />
                  </div>
                </div>
              ))}
            </div>
            <div style={{ display: "flex", gap: 12 }}>
              <button onClick={() => setStep(0)} style={{ flex: 1, padding: "13px 0", background: C.surface, color: C.dark, border: `1px solid ${C.border}`, borderRadius: 12, fontSize: 15, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>← Back</button>
              <button onClick={() => planType && setStep(2)} style={{ flex: 2, padding: "13px 0", background: planType ? C.teal : C.border, color: planType ? "#fff" : C.muted, border: "none", borderRadius: 12, fontSize: 15, fontWeight: 600, cursor: planType ? "pointer" : "default", fontFamily: "'DM Sans', sans-serif" }}>Next →</button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <h2 style={{ fontFamily: "'Lora', serif", fontSize: 24, color: C.dark, margin: "0 0 8px" }}>Cost details</h2>
            <p style={{ color: C.muted, fontSize: 14, margin: "0 0 24px" }}>Find these in your plan documents or insurance portal.</p>
            <div style={{ background: "#FFFBF0", border: `1px solid #F4E4A0`, borderRadius: 12, padding: "14px 18px", marginBottom: 20 }}>
              <p style={{ margin: "0 0 4px", fontSize: 12, fontWeight: 600, color: "#8A6A00" }}>💡 WHERE TO FIND THIS</p>
              <p style={{ margin: 0, fontSize: 13, color: "#5A4A00", lineHeight: 1.5 }}>Log into your insurance company's website or check the "Summary of Benefits" from enrollment.</p>
            </div>
            {[["Annual Deductible ($)", deductible, setDeductible, "e.g. 500"], ["Copay per Visit ($)", copay, setCopay, "e.g. 25"]].map(([label, val, setter, ph]) => (
              <div key={label} style={{ marginBottom: 16 }}>
                <label style={{ fontSize: 12, fontWeight: 600, color: C.muted, letterSpacing: 0.5 }}>{label.toUpperCase()}</label>
                <input value={val} onChange={e => setter(e.target.value)} placeholder={ph} type="number" style={{ display: "block", width: "100%", marginTop: 8, padding: "12px 14px", border: `1.5px solid ${C.border}`, borderRadius: 10, fontSize: 14, color: C.dark, background: C.surface, outline: "none", boxSizing: "border-box", fontFamily: "'DM Sans', sans-serif" }} />
              </div>
            ))}
            <div style={{ display: "flex", gap: 12, marginTop: 24 }}>
              <button onClick={() => setStep(1)} style={{ flex: 1, padding: "13px 0", background: C.surface, color: C.dark, border: `1px solid ${C.border}`, borderRadius: 12, fontSize: 15, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>← Back</button>
              <button onClick={() => onComplete({ company, planType, memberId, deductible, copay })} style={{ flex: 2, padding: "13px 0", background: C.teal, color: "#fff", border: "none", borderRadius: 12, fontSize: 15, fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>Find Care →</button>
            </div>
            <button onClick={onSkip} style={{ width: "100%", marginTop: 12, padding: "10px 0", background: "transparent", color: C.muted, border: "none", fontSize: 14, cursor: "pointer" }}>Skip for now</button>
          </div>
        )}
      </div>
    </div>
  );
}

function FindCare({ insurance }) {
  const [conditions, setConditions] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [view, setView] = useState("list");

  const findCare = async () => {
    if (!conditions.trim()) return;
    setLoading(true);
    setResult(null);
    const planInfo = insurance
      ? `${insurance.company || "Unknown"} (${insurance.planType?.toUpperCase() || "Unknown"}), Deductible: $${insurance.deductible || "unknown"}, Copay: $${insurance.copay || "unknown"}`
      : "No insurance set up";
    const prompt = `You are a warm, empathetic US healthcare navigator helping someone navigate the US healthcare system. They may be anxious or confused.

Patient info:
- Insurance: ${planInfo}
- Their concern: "${conditions}"

Provide a brief, warm, helpful response with:
**What kind of care you likely need** (2-3 sentences)
**What to expect with your insurance** (2-3 sentences about costs)
**Tips for your first visit** (2-3 bullet points)
**⚠️ Seek emergency care immediately if** (2-3 relevant warning signs)

Keep it under 300 words. Be warm and reassuring. Use simple language.`;

    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ model: "claude-sonnet-4-20250514", max_tokens: 1000, messages: [{ role: "user", content: prompt }] })
      });
      const data = await res.json();
      setResult(data.content[0].text);
    } catch {
      setResult("**What kind of care you likely need**\nBased on your symptoms, you should start with an Urgent Care center for same-day evaluation. This avoids costly ER fees for non-emergency conditions.\n\n**What to expect with your insurance**\nWith your plan, expect a copay of around $75–150 at urgent care. Always confirm your plan is accepted before visiting.\n\n**Tips for your first visit**\n• Bring your insurance card and photo ID\n• List any medications you're currently taking\n• Arrive 15 minutes early for paperwork\n\n**⚠️ Seek emergency care immediately if**\n• Difficulty breathing or chest pain\n• High fever above 103°F / 39.4°C\n• Severe or worsening pain");
    }
    setLoading(false);
  };

  const QUICK = ["Fever & sore throat", "Stomach pain", "Anxiety / stress", "Back pain", "Skin rash", "Headaches", "Annual check-up", "Mental health support"];

  const sortedProviders = insurance
    ? [...PROVIDERS].sort((a, b) => {
        const aIn = a.networks.includes("Most Major Plans") || a.networks.some(n => n.toLowerCase().includes((insurance.company || "").toLowerCase().split(" ")[0]));
        const bIn = b.networks.includes("Most Major Plans") || b.networks.some(n => n.toLowerCase().includes((insurance.company || "").toLowerCase().split(" ")[0]));
        return bIn - aIn;
      })
    : PROVIDERS;

  return (
    <div style={{ padding: "20px 0" }}>
      <h2 style={{ fontFamily: "'Lora', serif", fontSize: 22, color: C.dark, margin: "0 0 6px" }}>Find the Right Care</h2>
      <p style={{ color: C.muted, fontSize: 14, margin: "0 0 20px" }}>Tell us what's going on and we'll guide you.</p>

      {insurance && (
        <div style={{ background: C.tealLight, border: `1px solid ${C.teal}30`, borderRadius: 12, padding: "10px 16px", marginBottom: 20, display: "flex", gap: 10, alignItems: "center" }}>
          <span style={{ fontSize: 16 }}>🛡</span>
          <div>
            <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: C.teal, fontFamily: "'DM Sans', sans-serif" }}>{insurance.company || "Insurance added"}</p>
            <p style={{ margin: 0, fontSize: 12, color: C.muted, fontFamily: "'DM Sans', sans-serif" }}>{INSURANCE_PLANS.find(p => p.id === insurance.planType)?.name || "Plan set"} · Copay ~${insurance.copay || "?"}</p>
          </div>
        </div>
      )}

      <textarea value={conditions} onChange={e => setConditions(e.target.value)}
        placeholder="Describe your symptoms or what care you need... (e.g. 'I've had a fever for 2 days and sore throat')"
        rows={4}
        style={{ width: "100%", padding: "14px 16px", border: `1.5px solid ${C.border}`, borderRadius: 14, fontSize: 14, color: C.dark, fontFamily: "'DM Sans', sans-serif", resize: "vertical", outline: "none", boxSizing: "border-box", lineHeight: 1.6, background: C.surface }} />

      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, margin: "12px 0" }}>
        {QUICK.map(q => (
          <button key={q} onClick={() => setConditions(q)} style={{ padding: "6px 12px", background: conditions === q ? C.tealLight : C.bg, border: `1px solid ${conditions === q ? C.teal : C.border}`, borderRadius: 20, fontSize: 12, color: conditions === q ? C.teal : C.muted, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>{q}</button>
        ))}
      </div>

      <button onClick={findCare} disabled={loading || !conditions.trim()} style={{ width: "100%", padding: "14px 0", background: conditions.trim() ? C.teal : C.border, color: conditions.trim() ? "#fff" : C.muted, border: "none", borderRadius: 12, fontSize: 15, fontWeight: 600, cursor: conditions.trim() ? "pointer" : "default", fontFamily: "'DM Sans', sans-serif", marginBottom: 24 }}>
        {loading ? "Getting guidance..." : "Get AI Guidance & Find Providers →"}
      </button>

      {loading && (
        <div style={{ textAlign: "center", padding: "40px 0" }}>
          <div style={{ width: 40, height: 40, border: `3px solid ${C.tealLight}`, borderTopColor: C.teal, borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto 16px" }} />
          <p style={{ color: C.muted, fontSize: 14 }}>Analyzing your needs...</p>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      )}

      {result && !loading && (
        <div>
          <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 16, padding: "20px 22px", marginBottom: 24 }}>
            <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 14 }}>
              <div style={{ width: 32, height: 32, borderRadius: 10, background: C.teal, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>⚕</div>
              <p style={{ margin: 0, fontFamily: "'Lora', serif", fontSize: 16, fontWeight: 600, color: C.dark }}>Your Personalized Guidance</p>
            </div>
            <div>{parseMarkdown(result)}</div>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
            <h3 style={{ fontFamily: "'Lora', serif", fontSize: 18, color: C.dark, margin: 0 }}>Nearby Providers</h3>
            <div style={{ display: "flex", background: C.bg, borderRadius: 8, padding: 3 }}>
              {["list", "map"].map(v => (
                <button key={v} onClick={() => setView(v)} style={{ padding: "6px 14px", border: "none", borderRadius: 6, cursor: "pointer", fontSize: 13, fontWeight: 500, background: view === v ? C.surface : "transparent", color: view === v ? C.dark : C.muted, fontFamily: "'DM Sans', sans-serif" }}>
                  {v === "list" ? "☰ List" : "◈ Map"}
                </button>
              ))}
            </div>
          </div>

          {view === "list" && sortedProviders.map(p => <ProviderCard key={p.id} p={p} insurance={insurance} onSelect={setSelectedProvider} />)}
        </div>
      )}

      {selectedProvider && <ProviderModal p={selectedProvider} onClose={() => setSelectedProvider(null)} insurance={insurance} />}
    </div>
  );
}

function LearnSection() {
  const [expanded, setExpanded] = useState(null);
  return (
    <div style={{ padding: "20px 0" }}>
      <h2 style={{ fontFamily: "'Lora', serif", fontSize: 22, color: C.dark, margin: "0 0 6px" }}>How US Healthcare Works</h2>
      <p style={{ color: C.muted, fontSize: 14, margin: "0 0 24px" }}>Everything you need to know as a newcomer.</p>

      <div style={{ background: C.teal, borderRadius: 16, padding: "20px 22px", marginBottom: 24, color: "#fff" }}>
        <p style={{ margin: "0 0 8px", fontFamily: "'Lora', serif", fontSize: 18, fontWeight: 600 }}>The Golden Rule of US Healthcare</p>
        <p style={{ margin: 0, fontSize: 14, lineHeight: 1.7, opacity: 0.9, fontFamily: "'DM Sans', sans-serif" }}>Never go to the Emergency Room for non-emergencies. It can cost $1,000–$3,000+. Use your Primary Care Doctor or Urgent Care instead — same conditions, much lower cost.</p>
      </div>

      <div style={{ display: "grid", gap: 12 }}>
        {LEARN_CARDS.map((card, i) => (
          <div key={i} onClick={() => setExpanded(expanded === i ? null : i)} style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 14, overflow: "hidden", cursor: "pointer" }}>
            <div style={{ padding: "16px 18px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: card.color + "18", display: "flex", alignItems: "center", justifyContent: "center", color: card.color, fontSize: 16 }}>{card.icon}</div>
                <p style={{ margin: 0, fontSize: 15, fontWeight: 600, color: C.dark, fontFamily: "'DM Sans', sans-serif" }}>{card.title}</p>
              </div>
              <span style={{ color: C.muted, fontSize: 18 }}>{expanded === i ? "∧" : "⌄"}</span>
            </div>
            {expanded === i && (
              <div style={{ padding: "0 18px 18px", borderTop: `1px solid ${C.border}`, paddingTop: 14 }}>
                <p style={{ margin: 0, fontSize: 14, color: C.dark, lineHeight: 1.7, fontFamily: "'DM Sans', sans-serif" }}>{card.content}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      <div style={{ background: C.amberLight, border: `1px solid ${C.amber}40`, borderRadius: 16, padding: "20px 22px", marginTop: 20 }}>
        <p style={{ margin: "0 0 10px", fontFamily: "'Lora', serif", fontSize: 17, fontWeight: 600, color: "#8A4A00" }}>Emergency? Call 911</p>
        <p style={{ margin: "0 0 12px", fontSize: 14, color: "#6A3A00", lineHeight: 1.6, fontFamily: "'DM Sans', sans-serif" }}>For life-threatening emergencies — chest pain, difficulty breathing, severe bleeding, stroke symptoms — call 911 immediately. ERs cannot turn you away regardless of insurance or immigration status.</p>
        <div style={{ display: "flex", gap: 12 }}>
          <div style={{ padding: "10px 20px", background: C.danger, color: "#fff", borderRadius: 10, fontSize: 14, fontWeight: 600, fontFamily: "'DM Sans', sans-serif", cursor: "pointer" }}>Call 911</div>
          <div style={{ padding: "10px 20px", background: C.teal, color: "#fff", borderRadius: 10, fontSize: 14, fontWeight: 600, fontFamily: "'DM Sans', sans-serif", cursor: "pointer" }}>Crisis Line: 988</div>
        </div>
      </div>
    </div>
  );
}

function ClinicsSection() {
  const [filter, setFilter] = useState("All");
  const types = ["All", "FQHC", "Free Clinic"];
  const filtered = filter === "All" ? CLINICS : CLINICS.filter(c => c.type === filter);

  return (
    <div style={{ padding: "20px 0" }}>
      <h2 style={{ fontFamily: "'Lora', serif", fontSize: 22, color: C.dark, margin: "0 0 6px" }}>Community Clinics</h2>
      <p style={{ color: C.muted, fontSize: 14, margin: "0 0 20px" }}>Free & low-cost care near St. Louis, regardless of insurance or status.</p>

      <div style={{ background: "#E8F5EE", border: `1px solid ${C.success}30`, borderRadius: 12, padding: "12px 16px", marginBottom: 20, display: "flex", gap: 10, alignItems: "flex-start" }}>
        <span style={{ fontSize: 16, marginTop: 1 }}>✅</span>
        <p style={{ margin: 0, fontSize: 13, color: "#1A4A2A", lineHeight: 1.6, fontFamily: "'DM Sans', sans-serif" }}>All clinics below serve patients regardless of immigration status, insurance coverage, or ability to pay. Federally Qualified Health Centers (FQHCs) use a sliding fee scale based on income.</p>
      </div>

      <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
        {types.map(t => (
          <button key={t} onClick={() => setFilter(t)} style={{ padding: "7px 16px", background: filter === t ? C.teal : C.bg, color: filter === t ? "#fff" : C.muted, border: `1px solid ${filter === t ? C.teal : C.border}`, borderRadius: 20, fontSize: 13, cursor: "pointer", fontFamily: "'DM Sans', sans-serif", fontWeight: filter === t ? 600 : 400 }}>{t}</button>
        ))}
      </div>

      <div style={{ display: "grid", gap: 12 }}>
        {filtered.map(c => (
          <div key={c.id} style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 16, padding: "16px 20px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
              <div>
                <p style={{ margin: "0 0 3px", fontFamily: "'Lora', serif", fontSize: 15, fontWeight: 600, color: C.dark }}>{c.name}</p>
                <p style={{ margin: 0, fontSize: 12, color: C.muted }}>{c.address} · {c.distance}</p>
              </div>
              <Badge color={c.type === "FQHC" ? C.teal : C.success} bg={c.type === "FQHC" ? C.tealLight : C.successLight}>{c.type}</Badge>
            </div>
            <div style={{ background: C.successLight, borderRadius: 8, padding: "8px 12px", marginBottom: 10 }}>
              <p style={{ margin: 0, fontSize: 12, color: "#1A4A2A", fontFamily: "'DM Sans', sans-serif" }}>✓ {c.accepts}</p>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 10 }}>
              {c.services.map(s => <Badge key={s}>{s}</Badge>)}
            </div>
            <p style={{ margin: 0, fontSize: 13, color: C.teal, fontWeight: 500, fontFamily: "'DM Sans', sans-serif" }}>📞 {c.phone}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function ProfileSection({ user, insurance, status, onEditInsurance, onLogout }) {
  const plan = INSURANCE_PLANS.find(p => p.id === insurance?.planType);
  const statusLabels = { undocumented: "Undocumented immigrant", greencard: "Green card holder", visa: "Visa holder", citizen: "US citizen" };

  return (
    <div style={{ padding: "20px 0" }}>
      <div style={{ background: C.teal, borderRadius: 20, padding: "24px 22px", marginBottom: 24, color: "#fff", display: "flex", gap: 16, alignItems: "center" }}>
        <div style={{ width: 56, height: 56, borderRadius: "50%", background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Lora', serif", fontSize: 22, fontWeight: 600 }}>{user?.[0]?.toUpperCase() || "U"}</div>
        <div>
          <p style={{ margin: "0 0 4px", fontFamily: "'Lora', serif", fontSize: 20, fontWeight: 600 }}>{user}</p>
          <p style={{ margin: 0, fontSize: 13, opacity: 0.8, fontFamily: "'DM Sans', sans-serif" }}>{statusLabels[status] || "Healthcare Navigator User"}</p>
        </div>
      </div>

      <h3 style={{ fontFamily: "'Lora', serif", fontSize: 18, color: C.dark, margin: "0 0 14px" }}>Insurance Details</h3>
      {insurance ? (
        <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 16, padding: "20px 22px", marginBottom: 20 }}>
          {[["Insurance Company", insurance.company || "Not set"], ["Plan Type", plan ? `${plan.name} — ${plan.full}` : "Not set"], ["Member ID", insurance.memberId || "Not provided"], ["Annual Deductible", insurance.deductible ? `$${insurance.deductible}` : "Not provided"], ["Copay per Visit", insurance.copay ? `$${insurance.copay}` : "Not provided"]].map(([label, value]) => (
            <div key={label} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: `1px solid ${C.border}` }}>
              <p style={{ margin: 0, fontSize: 13, color: C.muted, fontFamily: "'DM Sans', sans-serif" }}>{label}</p>
              <p style={{ margin: 0, fontSize: 13, fontWeight: 500, color: C.dark, fontFamily: "'DM Sans', sans-serif", maxWidth: "60%", textAlign: "right" }}>{value}</p>
            </div>
          ))}
          <button onClick={onEditInsurance} style={{ width: "100%", marginTop: 16, padding: "11px 0", background: C.tealLight, color: C.teal, border: `1px solid ${C.teal}30`, borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>Edit Insurance</button>
        </div>
      ) : (
        <div style={{ background: C.amberLight, border: `1px solid ${C.amber}40`, borderRadius: 16, padding: "20px 22px", marginBottom: 20, textAlign: "center" }}>
          <p style={{ margin: "0 0 14px", fontSize: 14, color: "#6A3A00", fontFamily: "'DM Sans', sans-serif" }}>No insurance added yet. Add your plan to get personalized recommendations.</p>
          <button onClick={onEditInsurance} style={{ padding: "10px 24px", background: C.amber, color: "#fff", border: "none", borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>Add Insurance</button>
        </div>
      )}

      <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 16, padding: "16px 20px", marginBottom: 20 }}>
        <p style={{ margin: "0 0 12px", fontSize: 14, fontWeight: 600, color: C.dark, fontFamily: "'DM Sans', sans-serif" }}>Quick Reference</p>
        {[["Insurance hotline", insurance?.company ? "1-800 on back of your card" : "Check your card"], ["Emergency", "Call 911"], ["Mental Health Crisis", "Call 988"], ["Poison Control", "1-800-222-1222"]].map(([label, val]) => (
          <div key={label} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: `1px solid ${C.border}` }}>
            <p style={{ margin: 0, fontSize: 13, color: C.muted, fontFamily: "'DM Sans', sans-serif" }}>{label}</p>
            <p style={{ margin: 0, fontSize: 13, fontWeight: 500, color: C.teal, fontFamily: "'DM Sans', sans-serif" }}>{val}</p>
          </div>
        ))}
      </div>

      <button onClick={onLogout} style={{ width: "100%", padding: "12px 0", background: "transparent", color: C.danger, border: `1px solid ${C.danger}40`, borderRadius: 12, fontSize: 14, fontWeight: 500, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>Log Out</button>
    </div>
  );
}

export default function App() {
  const [page, setPage] = useState("login");
  const [tab, setTab] = useState("find");
  const [user, setUser] = useState(null);
  const [status, setStatus] = useState(null);
  const [insurance, setInsurance] = useState(null);

  const TABS = [
    { id: "find", label: "Find Care", icon: "⊕" },
    { id: "clinics", label: "Clinics", icon: "◉" },
    { id: "learn", label: "Learn", icon: "◎" },
    { id: "profile", label: "Profile", icon: "◈" },
  ];

  return (
    <>
      <style>{FONTS}</style>
      {page === "login" && <LoginPage onLogin={(name, email) => { setUser(name); setPage("status"); }} />}
      {page === "status" && <OnboardStatus user={user} onNext={(s) => { setStatus(s); setPage("onboard"); }} />}
      {page === "onboard" && <OnboardInsurance user={user} status={status} onComplete={(ins) => { setInsurance(ins); setPage("home"); }} onSkip={() => setPage("home")} />}
      {page === "home" && (
        <div style={{ minHeight: "100vh", background: C.bg, fontFamily: "'DM Sans', sans-serif" }}>
          <div style={{ background: C.surface, borderBottom: `1px solid ${C.border}`, padding: "14px 20px", display: "flex", justifyContent: "space-between", alignItems: "center", position: "sticky", top: 0, zIndex: 50 }}>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <div style={{ width: 32, height: 32, borderRadius: 9, background: C.teal, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>⚕</div>
              <span style={{ fontFamily: "'Lora', serif", fontSize: 18, fontWeight: 600, color: C.dark }}>CoverCare</span>
            </div>
            {insurance && (
              <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                <span style={{ fontSize: 12, color: C.teal }}>🛡</span>
                <span style={{ fontSize: 12, color: C.muted }}>{insurance.company?.split(" ")[0] || "Insured"}</span>
              </div>
            )}
          </div>

          <div style={{ maxWidth: 640, margin: "0 auto", padding: "0 20px 100px" }}>
            {tab === "find" && <FindCare insurance={insurance} />}
            {tab === "clinics" && <ClinicsSection />}
            {tab === "learn" && <LearnSection />}
            {tab === "profile" && <ProfileSection user={user} insurance={insurance} status={status} onEditInsurance={() => setPage("onboard")} onLogout={() => { setUser(null); setInsurance(null); setStatus(null); setPage("login"); }} />}
          </div>

          <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: C.surface, borderTop: `1px solid ${C.border}`, display: "flex", padding: "8px 0 16px", zIndex: 50 }}>
            {TABS.map(t => (
              <button key={t.id} onClick={() => setTab(t.id)} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4, border: "none", background: "transparent", cursor: "pointer", padding: "6px 0" }}>
                <span style={{ fontSize: 20, color: tab === t.id ? C.teal : C.muted }}>{t.icon}</span>
                <span style={{ fontSize: 11, fontWeight: tab === t.id ? 600 : 400, color: tab === t.id ? C.teal : C.muted, fontFamily: "'DM Sans', sans-serif" }}>{t.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
