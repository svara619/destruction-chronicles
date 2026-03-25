import { useState, useEffect, useRef } from "react";

const SERVER_NAME = "Destruction Chronicles";
const RATES = { xp: 1, sp: 1, adena: 1, drop: 1, spoil: 1, questDrop: 1, raidDrop: 1 };

const DONATE_ITEMS = [
  { id: 1, name: "Appearance Stone", price: 5, icon: "💎", desc: "იერსახის შეცვლა", category: "cosmetic" },
  { id: 2, name: "Name Change", price: 3, icon: "✏️", desc: "სახელის შეცვლა", category: "cosmetic" },
  { id: 3, name: "Title Color", price: 2, icon: "🎨", desc: "Title ფერის შეცვლა", category: "cosmetic" },
  { id: 4, name: "XP Rune 50% (7d)", price: 8, icon: "📜", desc: "7 დღიანი XP boost +50%", category: "boost" },
  { id: 5, name: "SP Rune 50% (7d)", price: 6, icon: "📜", desc: "7 დღიანი SP boost +50%", category: "boost" },
  { id: 6, name: "Premium Account (30d)", price: 15, icon: "👑", desc: "+50% XP/SP, +30% Adena", category: "boost" },
  { id: 7, name: "Clan Hall Decoration", price: 10, icon: "🏰", desc: "კლანის დარბაზის დეკორაცია", category: "clan" },
  { id: 8, name: "Clan Rep +1000", price: 12, icon: "⚔️", desc: "კლანის რეპუტაცია +1000", category: "clan" },
  { id: 9, name: "Wedding Service", price: 5, icon: "💒", desc: "ქორწილის სერვისი", category: "service" },
  { id: 10, name: "Stuck Character Fix", price: 0, icon: "🔧", desc: "გაჭედილი პერსონაჟის fix (უფასო)", category: "service" },
  { id: 11, name: "Agathion Pack", price: 7, icon: "🐉", desc: "კოსმეტიკური Agathion", category: "cosmetic" },
  { id: 12, name: "Chat Color", price: 2, icon: "💬", desc: "ჩათის ფერის შეცვლა", category: "cosmetic" },
];

const CLASSES = [
  { name: "Human Fighter", sub: ["Gladiator", "Warlord", "Paladin", "Dark Avenger", "Treasure Hunter", "Hawkeye"], icon: "⚔️" },
  { name: "Human Mystic", sub: ["Sorcerer", "Necromancer", "Warlock", "Bishop", "Prophet"], icon: "🔮" },
  { name: "Elf Fighter", sub: ["Temple Knight", "Swordsinger", "Plains Walker", "Silver Ranger"], icon: "🏹" },
  { name: "Elf Mystic", sub: ["Spellsinger", "Elemental Summoner", "Elder"], icon: "✨" },
  { name: "Dark Elf Fighter", sub: ["Shillien Knight", "Bladedancer", "Abyss Walker", "Phantom Ranger"], icon: "🗡️" },
  { name: "Dark Elf Mystic", sub: ["Spellhowler", "Phantom Summoner", "Shillien Elder"], icon: "🌑" },
  { name: "Orc Fighter", sub: ["Destroyer", "Tyrant"], icon: "💪" },
  { name: "Orc Mystic", sub: ["Overlord", "Warcryer"], icon: "🥁" },
  { name: "Dwarf Fighter", sub: ["Bounty Hunter", "Warsmith"], icon: "⛏️" },
  { name: "Kamael", sub: ["Berserker", "Soul Breaker", "Arbalester", "Inspector"], icon: "🪽" },
];

const FEATURES = [
  { title: "Retail-Like Gameplay", desc: "სრულად retail-ის მსგავსი გეიმფლეი, ყველა quest, skill და NPC მუშაობს", icon: "🎮" },
  { title: "Geodata Enabled", desc: "სრული geodata pathfinding-ით — არ არის wallhack ან fly hack", icon: "🗺️" },
  { title: "Anti-Bot System", desc: "ავტომატური bot-detection სისტემა, captcha და GM მონიტორინგი", icon: "🛡️" },
  { title: "Olympiad System", desc: "ყოველკვირეული Hero სისტემა, balanced class fights", icon: "🏆" },
  { title: "Castle Siege", desc: "ყოველ 2 კვირაში ერთხელ, ყველა Castle ხელმისაწვდომია", icon: "🏰" },
  { title: "Seven Signs", desc: "სრული Seven Signs სისტემა Catacombs/Necropolises-ით", icon: "📿" },
  { title: "Manor System", desc: "სრული Manor, seed/crop farming სისტემა", icon: "🌾" },
  { title: "Clan System", desc: "Clan Halls, Clan Wars, Reputation, Academy (level 5-40)", icon: "⚔️" },
  { title: "Custom Events", desc: "TvT, CTF, DM, Last Man Standing — ყოველდღიური ივენთები", icon: "🎯" },
  { title: "Grand Boss", desc: "Antharas, Valakas, Baium, Beleth, Frintezza — retail spawn times", icon: "🐉" },
  { title: "Auction House", desc: "მოთამაშეთა შორის ვაჭრობის სისტემა", icon: "💰" },
  { title: "Community Board", desc: "Buff, Teleport, Stats, Ranking ბორდიდან", icon: "📋" },
];

const TIMELINE = [
  { phase: "Pre-Launch", items: ["Open Beta Testing", "Bug Reporting", "Balance Adjustments"], status: "done" },
  { phase: "Grand Opening", items: ["Server Launch", "Welcome Events", "Double XP Weekend"], status: "active" },
  { phase: "Phase 1 (Month 1-2)", items: ["Olympiad Start", "First Siege", "Seven Signs Cycle"], status: "upcoming" },
  { phase: "Phase 2 (Month 3-4)", items: ["Grand Boss Spawns", "Epic Jewelry Available", "Clan Halls Auction"], status: "upcoming" },
  { phase: "Phase 3 (Month 5+)", items: ["Territory Wars", "Vitality System Adjustments", "New Custom Events"], status: "upcoming" },
];

function AnimatedNumber({ target, duration = 2000 }) {
  const [val, setVal] = useState(0);
  const ref = useRef(null);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        let start = Date.now();
        const tick = () => {
          const p = Math.min((Date.now() - start) / duration, 1);
          setVal(Math.floor(p * target));
          if (p < 1) requestAnimationFrame(tick);
        };
        tick();
        obs.disconnect();
      }
    }, { threshold: 0.5 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [target, duration]);
  return <span ref={ref}>{val}</span>;
}

export default function L2ServerSite() {
  const [activeSection, setActiveSection] = useState("home");
  const [donateFilter, setDonateFilter] = useState("all");
  const [mobileMenu, setMobileMenu] = useState(false);
  const [expandedClass, setExpandedClass] = useState(null);
  const [scrollY, setScrollY] = useState(0);
  const [regForm, setRegForm] = useState({ login: "", password: "", confirmPassword: "", email: "" });
  const [regError, setRegError] = useState("");
  const [regSuccess, setRegSuccess] = useState(false);

  useEffect(() => {
    const h = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);

  const scrollTo = (id) => {
    setActiveSection(id);
    setMobileMenu(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const handleReg = () => {
    setRegError("");
    if (!regForm.login || !regForm.password || !regForm.email) { setRegError("ყველა ველი სავალდებულოა"); return; }
    if (regForm.login.length < 4) { setRegError("ლოგინი მინიმუმ 4 სიმბოლო"); return; }
    if (regForm.password.length < 6) { setRegError("პაროლი მინიმუმ 6 სიმბოლო"); return; }
    if (regForm.password !== regForm.confirmPassword) { setRegError("პაროლები არ ემთხვევა"); return; }
    if (!regForm.email.includes("@")) { setRegError("არავალიდური ელ-ფოსტა"); return; }
    setRegSuccess(true);
  };

  const filtered = donateFilter === "all" ? DONATE_ITEMS : DONATE_ITEMS.filter(i => i.category === donateFilter);
  const navItems = [
    { id: "home", label: "მთავარი" },
    { id: "features", label: "ფიჩერები" },
    { id: "rates", label: "რეითები" },
    { id: "classes", label: "კლასები" },
    { id: "donate", label: "დონაცია" },
    { id: "timeline", label: "როუდმეპი" },
    { id: "download", label: "ჩამოტვირთვა" },
    { id: "register", label: "რეგისტრაცია" },
  ];

  return (
    <div style={{ fontFamily: "'Cinzel', 'Georgia', serif", background: "#0a0a0f", color: "#d4c9a8", minHeight: "100vh", overflowX: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600;700;800;900&family=Crimson+Text:ital,wght@0,400;0,600;0,700;1,400&family=JetBrains+Mono:wght@400;500&display=swap');

        * { margin: 0; padding: 0; box-sizing: border-box; }
        ::-webkit-scrollbar { width: 8px; }
        ::-webkit-scrollbar-track { background: #0a0a0f; }
        ::-webkit-scrollbar-thumb { background: #3a2a1a; border-radius: 4px; }
        ::-webkit-scrollbar-thumb:hover { background: #c9a84c; }

        @keyframes float { 0%,100% { transform: translateY(0px); } 50% { transform: translateY(-10px); } }
        @keyframes glow { 0%,100% { text-shadow: 0 0 20px rgba(201,168,76,0.3); } 50% { text-shadow: 0 0 40px rgba(201,168,76,0.6), 0 0 80px rgba(201,168,76,0.2); } }
        @keyframes pulse { 0%,100% { opacity: 0.4; } 50% { opacity: 1; } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(40px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
        @keyframes borderGlow { 0%,100% { border-color: rgba(201,168,76,0.2); } 50% { border-color: rgba(201,168,76,0.5); } }

        .nav-link { position: relative; cursor: pointer; padding: 8px 12px; color: #8a7d65; transition: all 0.3s; font-size: 13px; letter-spacing: 1.5px; text-transform: uppercase; font-family: 'Cinzel', serif; font-weight: 600; }
        .nav-link:hover, .nav-link.active { color: #c9a84c; }
        .nav-link::after { content: ''; position: absolute; bottom: 0; left: 50%; width: 0; height: 1px; background: #c9a84c; transition: all 0.3s; transform: translateX(-50%); }
        .nav-link:hover::after, .nav-link.active::after { width: 80%; }

        .section-title { font-family: 'Cinzel', serif; font-size: 36px; font-weight: 800; color: #c9a84c; text-align: center; margin-bottom: 12px; letter-spacing: 3px; animation: glow 3s ease-in-out infinite; }
        .section-sub { font-family: 'Crimson Text', serif; font-size: 18px; color: #8a7d65; text-align: center; margin-bottom: 48px; font-style: italic; }

        .card { background: linear-gradient(145deg, rgba(30,25,18,0.9), rgba(20,17,12,0.95)); border: 1px solid rgba(201,168,76,0.15); border-radius: 4px; padding: 24px; transition: all 0.4s cubic-bezier(0.25,0.46,0.45,0.94); position: relative; overflow: hidden; }
        .card::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 1px; background: linear-gradient(90deg, transparent, rgba(201,168,76,0.4), transparent); }
        .card:hover { border-color: rgba(201,168,76,0.4); transform: translateY(-4px); box-shadow: 0 12px 40px rgba(0,0,0,0.4), 0 0 30px rgba(201,168,76,0.05); }

        .btn-primary { background: linear-gradient(135deg, #c9a84c, #a0822a); color: #0a0a0f; border: none; padding: 14px 36px; font-family: 'Cinzel', serif; font-weight: 700; font-size: 14px; letter-spacing: 2px; text-transform: uppercase; cursor: pointer; transition: all 0.3s; border-radius: 2px; position: relative; overflow: hidden; }
        .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 8px 30px rgba(201,168,76,0.3); }
        .btn-primary::after { content: ''; position: absolute; top: -50%; left: -50%; width: 200%; height: 200%; background: linear-gradient(transparent, rgba(255,255,255,0.1), transparent); transform: rotate(45deg); transition: all 0.5s; }
        .btn-primary:hover::after { left: 100%; }

        .btn-secondary { background: transparent; color: #c9a84c; border: 1px solid rgba(201,168,76,0.4); padding: 12px 28px; font-family: 'Cinzel', serif; font-weight: 600; font-size: 13px; letter-spacing: 2px; text-transform: uppercase; cursor: pointer; transition: all 0.3s; border-radius: 2px; }
        .btn-secondary:hover { background: rgba(201,168,76,0.1); border-color: #c9a84c; }
        .btn-secondary.active { background: rgba(201,168,76,0.15); border-color: #c9a84c; }

        .input-field { width: 100%; background: rgba(15,13,10,0.8); border: 1px solid rgba(201,168,76,0.2); color: #d4c9a8; padding: 14px 18px; font-family: 'Crimson Text', serif; font-size: 16px; border-radius: 2px; transition: all 0.3s; outline: none; }
        .input-field:focus { border-color: rgba(201,168,76,0.5); box-shadow: 0 0 20px rgba(201,168,76,0.05); }
        .input-field::placeholder { color: #4a4436; }

        .rate-badge { display: inline-flex; align-items: center; gap: 8px; background: rgba(201,168,76,0.08); border: 1px solid rgba(201,168,76,0.2); padding: 16px 24px; border-radius: 4px; font-family: 'JetBrains Mono', monospace; font-size: 15px; }

        .donate-card { animation: borderGlow 4s ease-in-out infinite; }
        .donate-card:hover .donate-icon { animation: float 2s ease-in-out infinite; }

        .online-dot { width: 8px; height: 8px; border-radius: 50%; background: #4ade80; animation: pulse 2s ease-in-out infinite; display: inline-block; }

        .hero-bg { position: absolute; inset: 0; background: radial-gradient(ellipse at 50% 30%, rgba(201,168,76,0.06) 0%, transparent 60%), radial-gradient(ellipse at 80% 80%, rgba(139,69,19,0.05) 0%, transparent 50%), radial-gradient(ellipse at 20% 70%, rgba(100,60,20,0.04) 0%, transparent 50%); }

        .divider { height: 1px; background: linear-gradient(90deg, transparent, rgba(201,168,76,0.2), transparent); margin: 0 auto; max-width: 600px; }

        .tag { display: inline-block; padding: 4px 10px; border-radius: 2px; font-size: 11px; font-family: 'JetBrains Mono', monospace; letter-spacing: 1px; text-transform: uppercase; }
        .tag-free { background: rgba(74,222,128,0.1); color: #4ade80; border: 1px solid rgba(74,222,128,0.2); }
        .tag-price { background: rgba(201,168,76,0.1); color: #c9a84c; border: 1px solid rgba(201,168,76,0.2); }

        @media (max-width: 768px) {
          .section-title { font-size: 24px; letter-spacing: 1px; }
          .section-sub { font-size: 15px; }
          .nav-link { font-size: 14px; padding: 12px 16px; }
        }
      `}</style>

      {/* NAV */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000,
        background: scrollY > 50 ? "rgba(10,10,15,0.95)" : "transparent",
        backdropFilter: scrollY > 50 ? "blur(20px)" : "none",
        borderBottom: scrollY > 50 ? "1px solid rgba(201,168,76,0.1)" : "1px solid transparent",
        transition: "all 0.4s",
        padding: "0 24px"
      }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: 64 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontSize: 28, color: "#c9a84c", fontWeight: 900, fontFamily: "'Cinzel', serif", letterSpacing: 2 }}>⚔</span>
            <span style={{ fontSize: 16, color: "#c9a84c", fontWeight: 800, fontFamily: "'Cinzel', serif", letterSpacing: 3 }}>{SERVER_NAME}</span>
          </div>

          {/* Desktop nav */}
          <div style={{ display: "flex", gap: 4, alignItems: "center" }} className="desktop-nav">
            {navItems.map(n => (
              <div key={n.id} className={`nav-link ${activeSection === n.id ? "active" : ""}`} onClick={() => scrollTo(n.id)}>{n.label}</div>
            ))}
          </div>

          {/* Mobile hamburger */}
          <div style={{ display: "none", cursor: "pointer", padding: 8 }} className="mobile-burger" onClick={() => setMobileMenu(!mobileMenu)}>
            <div style={{ width: 24, height: 2, background: "#c9a84c", marginBottom: 5 }} />
            <div style={{ width: 24, height: 2, background: "#c9a84c", marginBottom: 5 }} />
            <div style={{ width: 24, height: 2, background: "#c9a84c" }} />
          </div>
        </div>

        {mobileMenu && (
          <div style={{ background: "rgba(10,10,15,0.98)", padding: "16px 0", borderTop: "1px solid rgba(201,168,76,0.1)" }}>
            {navItems.map(n => (
              <div key={n.id} className="nav-link" onClick={() => scrollTo(n.id)} style={{ display: "block", padding: "12px 24px" }}>{n.label}</div>
            ))}
          </div>
        )}
      </nav>

      {/* HERO */}
      <section id="home" style={{ position: "relative", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
        <div className="hero-bg" />

        {/* Decorative particles */}
        {[...Array(20)].map((_, i) => (
          <div key={i} style={{
            position: "absolute",
            width: 2, height: 2, borderRadius: "50%",
            background: "rgba(201,168,76,0.3)",
            left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%`,
            animation: `pulse ${2 + Math.random() * 3}s ease-in-out infinite`,
            animationDelay: `${Math.random() * 2}s`
          }} />
        ))}

        <div style={{ textAlign: "center", position: "relative", zIndex: 1, padding: "0 24px", animation: "slideUp 1s ease-out" }}>
          <div style={{ fontSize: 14, color: "#8a7d65", letterSpacing: 6, textTransform: "uppercase", marginBottom: 24, fontFamily: "'Cinzel', serif" }}>
            Lineage II High Five
          </div>
          <h1 style={{ fontSize: "clamp(40px, 8vw, 80px)", color: "#c9a84c", fontWeight: 900, lineHeight: 1.1, letterSpacing: 4, fontFamily: "'Cinzel', serif", animation: "glow 3s ease-in-out infinite" }}>
            {SERVER_NAME}
          </h1>
          <div style={{ width: 80, height: 1, background: "linear-gradient(90deg, transparent, #c9a84c, transparent)", margin: "24px auto" }} />
          <p style={{ fontSize: 20, color: "#8a7d65", maxWidth: 600, margin: "0 auto 16px", fontFamily: "'Crimson Text', serif", fontStyle: "italic", lineHeight: 1.6 }}>
            x1 Retail-Like Private Server — შედი ბრძოლის ველზე, destruction.ge
          </p>

          <div style={{ display: "flex", gap: 16, justifyContent: "center", marginTop: 40, flexWrap: "wrap" }}>
            <button className="btn-primary" onClick={() => scrollTo("download")}>ჩამოტვირთე კლიენტი</button>
            <button className="btn-secondary" onClick={() => scrollTo("register")}>რეგისტრაცია</button>
          </div>

          <div style={{ display: "flex", gap: 40, justifyContent: "center", marginTop: 56, flexWrap: "wrap" }}>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 36, color: "#c9a84c", fontWeight: 900, fontFamily: "'Cinzel', serif" }}>
                <AnimatedNumber target={847} />
              </div>
              <div style={{ fontSize: 12, color: "#6a6050", letterSpacing: 2, textTransform: "uppercase", marginTop: 4 }}>
                <span className="online-dot" style={{ marginRight: 6 }} />ონლაინ
              </div>
            </div>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 36, color: "#c9a84c", fontWeight: 900, fontFamily: "'Cinzel', serif" }}>
                <AnimatedNumber target={3241} />
              </div>
              <div style={{ fontSize: 12, color: "#6a6050", letterSpacing: 2, textTransform: "uppercase", marginTop: 4 }}>რეგისტრირებული</div>
            </div>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 36, color: "#c9a84c", fontWeight: 900, fontFamily: "'Cinzel', serif" }}>
                <AnimatedNumber target={52} />
              </div>
              <div style={{ fontSize: 12, color: "#6a6050", letterSpacing: 2, textTransform: "uppercase", marginTop: 4 }}>კლანები</div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" style={{ padding: "100px 24px", maxWidth: 1200, margin: "0 auto" }}>
        <div className="divider" style={{ marginBottom: 60 }} />
        <h2 className="section-title">სერვერის ფიჩერები</h2>
        <p className="section-sub">ყველაფერი რაც High Five ქრონიკალს სჭირდება</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 20 }}>
          {FEATURES.map((f, i) => (
            <div key={i} className="card" style={{ animationDelay: `${i * 0.1}s` }}>
              <div style={{ fontSize: 28, marginBottom: 12 }}>{f.icon}</div>
              <h3 style={{ fontFamily: "'Cinzel', serif", fontSize: 16, fontWeight: 700, color: "#c9a84c", marginBottom: 8, letterSpacing: 1 }}>{f.title}</h3>
              <p style={{ fontFamily: "'Crimson Text', serif", fontSize: 15, color: "#8a7d65", lineHeight: 1.5 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* RATES */}
      <section id="rates" style={{ padding: "80px 24px", background: "linear-gradient(180deg, rgba(20,17,12,0.3), transparent, rgba(20,17,12,0.3))" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <h2 className="section-title">სერვერის რეითები</h2>
          <p className="section-sub">ნამდვილი x1 გამოცდილება — არანაირი shortcut</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 16, justifyContent: "center" }}>
            {Object.entries(RATES).map(([key, val]) => (
              <div key={key} className="rate-badge">
                <span style={{ color: "#c9a84c", fontWeight: 700 }}>x{val}</span>
                <span style={{ color: "#8a7d65" }}>{key.replace(/([A-Z])/g, " $1").trim()}</span>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 48, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 20, maxWidth: 900, margin: "48px auto 0" }}>
            {[
              { label: "Max Level", value: "85", sub: "3rd Class Transfer" },
              { label: "Max Enchant", value: "+16", sub: "Safe +3 / Full +4" },
              { label: "Buffer", value: "სქემა", sub: "Community Board-დან" },
              { label: "Auto Loot", value: "კი", sub: "Raid-ებზე გამორთული" },
              { label: "Subclass", value: "3+1", sub: "Noblesse Quest Required" },
              { label: "Vitality", value: "x1", sub: "Retail-Like System" },
            ].map((s, i) => (
              <div key={i} className="card" style={{ textAlign: "center", padding: 20 }}>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 28, color: "#c9a84c", fontWeight: 700 }}>{s.value}</div>
                <div style={{ fontFamily: "'Cinzel', serif", fontSize: 13, color: "#d4c9a8", letterSpacing: 1, marginTop: 4 }}>{s.label}</div>
                <div style={{ fontFamily: "'Crimson Text', serif", fontSize: 13, color: "#6a6050", marginTop: 4 }}>{s.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CLASSES */}
      <section id="classes" style={{ padding: "100px 24px", maxWidth: 1200, margin: "0 auto" }}>
        <div className="divider" style={{ marginBottom: 60 }} />
        <h2 className="section-title">კლასები</h2>
        <p className="section-sub">High Five-ის ყველა კლასი ხელმისაწვდომია</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>
          {CLASSES.map((c, i) => (
            <div key={i} className="card" style={{ cursor: "pointer", padding: 20 }} onClick={() => setExpandedClass(expandedClass === i ? null : i)}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: expandedClass === i ? 12 : 0 }}>
                <span style={{ fontSize: 24 }}>{c.icon}</span>
                <span style={{ fontFamily: "'Cinzel', serif", fontSize: 15, fontWeight: 700, color: "#c9a84c", letterSpacing: 1 }}>{c.name}</span>
                <span style={{ marginLeft: "auto", color: "#6a6050", fontSize: 12, transition: "transform 0.3s", transform: expandedClass === i ? "rotate(180deg)" : "rotate(0)" }}>▼</span>
              </div>
              {expandedClass === i && (
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8, paddingTop: 12, borderTop: "1px solid rgba(201,168,76,0.1)", animation: "fadeIn 0.3s" }}>
                  {c.sub.map((s, j) => (
                    <span key={j} style={{ padding: "4px 12px", background: "rgba(201,168,76,0.06)", border: "1px solid rgba(201,168,76,0.12)", borderRadius: 2, fontSize: 13, fontFamily: "'Crimson Text', serif", color: "#8a7d65" }}>
                      {s}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* DONATE */}
      <section id="donate" style={{ padding: "100px 24px", background: "linear-gradient(180deg, rgba(20,17,12,0.3), transparent, rgba(20,17,12,0.3))" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <h2 className="section-title">დონაცია</h2>
          <p className="section-sub">მხოლოდ კოსმეტიკური და საყოფაცხოვრებო აითემები — NO PAY TO WIN</p>

          <div style={{ textAlign: "center", padding: "16px 24px", background: "rgba(74,222,128,0.05)", border: "1px solid rgba(74,222,128,0.15)", borderRadius: 4, maxWidth: 700, margin: "0 auto 32px", fontFamily: "'Crimson Text', serif", fontSize: 15, color: "#8a7d65" }}>
            ⚠️ დონაცია მხოლოდ სერვერის შენახვასა და განვითარებაზე იხარჯება. არანაირი gameplay advantage არ იყიდება.
          </div>

          <div style={{ display: "flex", gap: 8, justifyContent: "center", marginBottom: 32, flexWrap: "wrap" }}>
            {[
              { id: "all", label: "ყველა" },
              { id: "cosmetic", label: "კოსმეტიკა" },
              { id: "boost", label: "ბუსტი" },
              { id: "clan", label: "კლანი" },
              { id: "service", label: "სერვისი" },
            ].map(f => (
              <button key={f.id} className={`btn-secondary ${donateFilter === f.id ? "active" : ""}`} onClick={() => setDonateFilter(f.id)} style={{ padding: "8px 20px", fontSize: 12 }}>
                {f.label}
              </button>
            ))}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 16 }}>
            {filtered.map(item => (
              <div key={item.id} className="card donate-card" style={{ display: "flex", flexDirection: "column", gap: 8, padding: 20 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <span className="donate-icon" style={{ fontSize: 28 }}>{item.icon}</span>
                  <div>
                    <div style={{ fontFamily: "'Cinzel', serif", fontSize: 14, fontWeight: 700, color: "#c9a84c", letterSpacing: 0.5 }}>{item.name}</div>
                    <div style={{ fontFamily: "'Crimson Text', serif", fontSize: 13, color: "#6a6050", marginTop: 2 }}>{item.desc}</div>
                  </div>
                </div>
                <div style={{ marginTop: "auto", display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 12, borderTop: "1px solid rgba(201,168,76,0.08)" }}>
                  {item.price === 0
                    ? <span className="tag tag-free">უფასო</span>
                    : <span className="tag tag-price">{item.price} Coins</span>
                  }
                  <button className="btn-secondary" style={{ padding: "6px 16px", fontSize: 11 }}>
                    {item.price === 0 ? "მოითხოვე" : "შეიძინე"}
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 40, textAlign: "center" }}>
            <div style={{ fontFamily: "'Cinzel', serif", fontSize: 14, color: "#8a7d65", letterSpacing: 1, marginBottom: 16 }}>გადახდის მეთოდები</div>
            <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
              {["PayPal", "Visa/MC", "Bank of Georgia", "TBC", "Crypto"].map(m => (
                <span key={m} style={{ padding: "8px 16px", background: "rgba(201,168,76,0.05)", border: "1px solid rgba(201,168,76,0.1)", borderRadius: 2, fontSize: 13, fontFamily: "'Crimson Text', serif", color: "#6a6050" }}>
                  {m}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* TIMELINE */}
      <section id="timeline" style={{ padding: "100px 24px", maxWidth: 800, margin: "0 auto" }}>
        <div className="divider" style={{ marginBottom: 60 }} />
        <h2 className="section-title">როუდმეპი</h2>
        <p className="section-sub">სერვერის განვითარების გეგმა</p>
        <div style={{ position: "relative", paddingLeft: 32 }}>
          <div style={{ position: "absolute", left: 11, top: 0, bottom: 0, width: 1, background: "rgba(201,168,76,0.15)" }} />
          {TIMELINE.map((t, i) => (
            <div key={i} style={{ marginBottom: 36, position: "relative" }}>
              <div style={{
                position: "absolute", left: -32, top: 6,
                width: 22, height: 22, borderRadius: "50%",
                background: t.status === "done" ? "#4ade80" : t.status === "active" ? "#c9a84c" : "rgba(201,168,76,0.2)",
                border: `2px solid ${t.status === "done" ? "#4ade80" : t.status === "active" ? "#c9a84c" : "rgba(201,168,76,0.3)"}`,
                display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, color: "#0a0a0f",
                animation: t.status === "active" ? "pulse 2s ease-in-out infinite" : "none",
                boxShadow: t.status === "active" ? "0 0 16px rgba(201,168,76,0.3)" : "none"
              }}>
                {t.status === "done" ? "✓" : ""}
              </div>
              <div style={{ fontFamily: "'Cinzel', serif", fontSize: 16, fontWeight: 700, color: t.status === "upcoming" ? "#6a6050" : "#c9a84c", letterSpacing: 1, marginBottom: 8 }}>
                {t.phase}
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {t.items.map((item, j) => (
                  <span key={j} style={{
                    padding: "6px 14px", borderRadius: 2, fontSize: 13, fontFamily: "'Crimson Text', serif",
                    background: t.status === "done" ? "rgba(74,222,128,0.06)" : "rgba(201,168,76,0.04)",
                    border: `1px solid ${t.status === "done" ? "rgba(74,222,128,0.15)" : "rgba(201,168,76,0.1)"}`,
                    color: t.status === "upcoming" ? "#4a4436" : "#8a7d65",
                    textDecoration: t.status === "done" ? "line-through" : "none"
                  }}>
                    {item}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* DOWNLOAD */}
      <section id="download" style={{ padding: "100px 24px", background: "linear-gradient(180deg, rgba(20,17,12,0.3), transparent, rgba(20,17,12,0.3))" }}>
        <div style={{ maxWidth: 800, margin: "0 auto", textAlign: "center" }}>
          <h2 className="section-title">ჩამოტვირთვა</h2>
          <p className="section-sub">დააინსტალირე კლიენტი და შეუერთდი სამყაროს</p>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 20, marginBottom: 40 }}>
            {[
              { name: "Full Client", size: "~7.2 GB", desc: "სრული High Five კლიენტი + პატჩი", primary: true },
              { name: "Patch Only", size: "~120 MB", desc: "თუ უკვე გაქვს H5 კლიენტი", primary: false },
              { name: "System Patch", size: "~45 MB", desc: "System ფოლდერის ფაილები", primary: false },
            ].map((d, i) => (
              <div key={i} className="card" style={{ textAlign: "center", padding: 28 }}>
                <div style={{ fontSize: 36, marginBottom: 12 }}>📥</div>
                <div style={{ fontFamily: "'Cinzel', serif", fontSize: 16, fontWeight: 700, color: "#c9a84c", letterSpacing: 1 }}>{d.name}</div>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13, color: "#6a6050", margin: "8px 0" }}>{d.size}</div>
                <div style={{ fontFamily: "'Crimson Text', serif", fontSize: 14, color: "#8a7d65", marginBottom: 16 }}>{d.desc}</div>
                <button className={d.primary ? "btn-primary" : "btn-secondary"} style={{ width: "100%" }}>
                  ჩამოტვირთე
                </button>
              </div>
            ))}
          </div>

          <div className="card" style={{ textAlign: "left", maxWidth: 600, margin: "0 auto" }}>
            <h3 style={{ fontFamily: "'Cinzel', serif", fontSize: 15, color: "#c9a84c", marginBottom: 16, letterSpacing: 1 }}>სისტემური მოთხოვნები</h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px 24px", fontFamily: "'Crimson Text', serif", fontSize: 14 }}>
              {[
                ["OS", "Windows 7+"],
                ["CPU", "Dual Core 2.0 GHz+"],
                ["RAM", "2 GB+"],
                ["GPU", "GeForce 6600+"],
                ["HDD", "10 GB+"],
                ["DirectX", "9.0c"],
              ].map(([k, v], i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: "1px solid rgba(201,168,76,0.05)" }}>
                  <span style={{ color: "#6a6050" }}>{k}</span>
                  <span style={{ color: "#8a7d65", fontFamily: "'JetBrains Mono', monospace", fontSize: 13 }}>{v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* REGISTER */}
      <section id="register" style={{ padding: "100px 24px" }}>
        <div style={{ maxWidth: 480, margin: "0 auto" }}>
          <div className="divider" style={{ marginBottom: 60 }} />
          <h2 className="section-title">რეგისტრაცია</h2>
          <p className="section-sub">შექმენი ანგარიში და დაიწყე თამაში</p>

          {regSuccess ? (
            <div className="card" style={{ textAlign: "center", padding: 40 }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>✅</div>
              <div style={{ fontFamily: "'Cinzel', serif", fontSize: 20, color: "#4ade80", marginBottom: 8 }}>რეგისტრაცია წარმატებულია!</div>
              <div style={{ fontFamily: "'Crimson Text', serif", fontSize: 15, color: "#8a7d65" }}>ჩამოტვირთე კლიენტი და შეუერთდი სამყაროს</div>
              <button className="btn-primary" style={{ marginTop: 20 }} onClick={() => scrollTo("download")}>ჩამოტვირთვა</button>
            </div>
          ) : (
            <div className="card" style={{ padding: 32 }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <div>
                  <label style={{ fontFamily: "'Cinzel', serif", fontSize: 12, color: "#6a6050", letterSpacing: 1, display: "block", marginBottom: 6 }}>ლოგინი</label>
                  <input className="input-field" placeholder="მინიმუმ 4 სიმბოლო" value={regForm.login} onChange={e => setRegForm({ ...regForm, login: e.target.value })} />
                </div>
                <div>
                  <label style={{ fontFamily: "'Cinzel', serif", fontSize: 12, color: "#6a6050", letterSpacing: 1, display: "block", marginBottom: 6 }}>ელ-ფოსტა</label>
                  <input className="input-field" type="email" placeholder="example@mail.com" value={regForm.email} onChange={e => setRegForm({ ...regForm, email: e.target.value })} />
                </div>
                <div>
                  <label style={{ fontFamily: "'Cinzel', serif", fontSize: 12, color: "#6a6050", letterSpacing: 1, display: "block", marginBottom: 6 }}>პაროლი</label>
                  <input className="input-field" type="password" placeholder="მინიმუმ 6 სიმბოლო" value={regForm.password} onChange={e => setRegForm({ ...regForm, password: e.target.value })} />
                </div>
                <div>
                  <label style={{ fontFamily: "'Cinzel', serif", fontSize: 12, color: "#6a6050", letterSpacing: 1, display: "block", marginBottom: 6 }}>პაროლის დადასტურება</label>
                  <input className="input-field" type="password" placeholder="გაიმეორე პაროლი" value={regForm.confirmPassword} onChange={e => setRegForm({ ...regForm, confirmPassword: e.target.value })} />
                </div>
                {regError && (
                  <div style={{ padding: "10px 14px", background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: 2, fontFamily: "'Crimson Text', serif", fontSize: 14, color: "#ef4444" }}>
                    {regError}
                  </div>
                )}
                <button className="btn-primary" style={{ width: "100%", marginTop: 8 }} onClick={handleReg}>
                  რეგისტრაცია
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ padding: "60px 24px 32px", borderTop: "1px solid rgba(201,168,76,0.08)" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 32, marginBottom: 40 }}>
            <div>
              <div style={{ fontFamily: "'Cinzel', serif", fontSize: 18, color: "#c9a84c", fontWeight: 800, marginBottom: 16, letterSpacing: 2 }}>⚔ {SERVER_NAME}</div>
              <p style={{ fontFamily: "'Crimson Text', serif", fontSize: 14, color: "#6a6050", lineHeight: 1.6 }}>
                Retail-like High Five x1 სერვერი ნამდვილი Lineage II მოყვარულებისთვის
              </p>
            </div>
            <div>
              <div style={{ fontFamily: "'Cinzel', serif", fontSize: 13, color: "#8a7d65", marginBottom: 12, letterSpacing: 1 }}>ნავიგაცია</div>
              {navItems.slice(0, 4).map(n => (
                <div key={n.id} style={{ fontFamily: "'Crimson Text', serif", fontSize: 14, color: "#4a4436", padding: "4px 0", cursor: "pointer" }} onClick={() => scrollTo(n.id)}>{n.label}</div>
              ))}
            </div>
            <div>
              <div style={{ fontFamily: "'Cinzel', serif", fontSize: 13, color: "#8a7d65", marginBottom: 12, letterSpacing: 1 }}>კონტაქტი</div>
              <div style={{ fontFamily: "'Crimson Text', serif", fontSize: 14, color: "#4a4436", lineHeight: 2 }}>
                Discord: discord.gg/destruction<br />
                Email: support@destruction.ge<br />
                Facebook: /DestructionChronicles
              </div>
            </div>
            <div>
              <div style={{ fontFamily: "'Cinzel', serif", fontSize: 13, color: "#8a7d65", marginBottom: 12, letterSpacing: 1 }}>სერვერი</div>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: "#4a4436", lineHeight: 2.2 }}>
                <span className="online-dot" style={{ marginRight: 6 }} />Login: login.destruction.ge<br />
                Game: game.destruction.ge<br />
                Port: 7777
              </div>
            </div>
          </div>
          <div className="divider" />
          <div style={{ textAlign: "center", paddingTop: 24, fontFamily: "'Crimson Text', serif", fontSize: 13, color: "#3a3428" }}>
            © 2026 {SERVER_NAME}. არაოფიციალური Lineage II სერვერი. Lineage II არის NCSoft-ის სავაჭრო ნიშანი.
          </div>
        </div>
      </footer>
    </div>
  );
}
