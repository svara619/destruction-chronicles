import { useState, useEffect, useRef, useCallback } from "react";

// ========== CONFIG ==========
const CONFIG = {
  serverName: "Destruction Chronicles",
  domain: "destruction.ge",
  chronicle: "High Five",
  rates: { xp: 1, sp: 1, adena: 1, drop: 1, spoil: 1, questDrop: 1, raidDrop: 1 },
  maxLevel: 85,
  maxEnchant: 16,
  safeEnchant: 3,
  fullEnchant: 4,
  subclass: "3+1",
  vitality: "x1",
  autoLoot: true,
  autoLootRaid: false,
  bufferScheme: true,
  gmShop: false,
  globalGk: false,
  noblesse: "Quest Required",
  olympiadCycle: "2 კვირა",
  siegeCycle: "2 კვირა",
  adminHash: "dc2026",
  currency: "GEL",
};

// ========== INITIAL DATA ==========
const INIT_NEWS = [
  { id: 1, title: "Grand Opening — 15 აპრილი, 2026", date: "2026-03-25", content: "Destruction Chronicles-ის Grand Opening დანიშნულია 2026 წლის 15 აპრილს, 20:00 საათზე (GMT+4). Open Beta მიმდინარეობს 1 აპრილიდან. შეუერთდით Discord-ს სიახლეებისთვის.", pinned: true },
  { id: 2, title: "Open Beta — რეგისტრაცია გახსნილია", date: "2026-03-20", content: "Open Beta პერიოდში რეგისტრაცია თავისუფალია. Beta-ში შეძენილი პროგრესი Grand Opening-ზე წაიშლება. დონატ ქოინები შენარჩუნდება.", pinned: false },
  { id: 3, title: "დონაციის სისტემა ხელმისაწვდომია", date: "2026-03-18", content: "BOG iPay და TBC Pay ინტეგრაცია აქტიურია. ქოინების შეძენა შესაძლებელია ბარათით ან ონლაინ ბანკინგით. მხოლოდ კოსმეტიკური აითემები — NO PAY TO WIN.", pinned: false },
];

const INIT_DOWNLOADS = [
  { id: 1, name: "სრული კლიენტი (Full Client)", size: "7.2 GB", url: "#", desc: "High Five კლიენტი + Destruction Chronicles პატჩი. Windows 7/10/11.", active: true },
  { id: 2, name: "პატჩი (Patch Only)", size: "145 MB", url: "#", desc: "თუ უკვე გაქვს H5 კლიენტი, მხოლოდ პატჩი საკმარისია.", active: true },
  { id: 3, name: "System ფაილები", size: "48 MB", url: "#", desc: "System ფოლდერის ფაილები ცალკე.", active: true },
];

const DONATE_ITEMS = [
  { id: 1, name: "Appearance Stone", price: 5, icon: "💎", desc: "პერსონაჟის იერსახის შეცვლა სხვა არმორზე", cat: "cosmetic" },
  { id: 2, name: "Name Change", price: 3, icon: "✏️", desc: "პერსონაჟის სახელის ერთჯერადი შეცვლა", cat: "cosmetic" },
  { id: 3, name: "Title Color", price: 2, icon: "🎨", desc: "Title-ის ფერის არჩევა RGB პალიტრიდან", cat: "cosmetic" },
  { id: 4, name: "Nick Color", price: 2, icon: "🖌️", desc: "სახელის ფერის არჩევა RGB პალიტრიდან", cat: "cosmetic" },
  { id: 5, name: "Chat Color", price: 2, icon: "💬", desc: "All Chat ფერის პერსონალიზაცია", cat: "cosmetic" },
  { id: 6, name: "Agathion — Baby Dragon", price: 7, icon: "🐉", desc: "კოსმეტიკური Agathion (არანაირი stat bonus)", cat: "cosmetic" },
  { id: 7, name: "Agathion — Mini Angel", price: 7, icon: "👼", desc: "კოსმეტიკური Agathion (არანაირი stat bonus)", cat: "cosmetic" },
  { id: 8, name: "XP Rune +50% (7 დღე)", price: 8, icon: "📜", desc: "7 დღიანი XP მიღების +50% ბუსტი", cat: "boost" },
  { id: 9, name: "SP Rune +50% (7 დღე)", price: 6, icon: "📜", desc: "7 დღიანი SP მიღების +50% ბუსტი", cat: "boost" },
  { id: 10, name: "Premium Account (30 დღე)", price: 15, icon: "👑", desc: "+50% XP/SP, +30% Adena drop. არ ცვლის gameplay balance-ს.", cat: "boost" },
  { id: 11, name: "Clan Reputation +1000", price: 12, icon: "⚔️", desc: "კლანის რეპუტაციის 1000 ქულის დამატება", cat: "clan" },
  { id: 12, name: "Clan Hall Decoration", price: 10, icon: "🏰", desc: "კლანის დარბაზის ვიზუალური დეკორაცია", cat: "clan" },
  { id: 13, name: "Wedding Service", price: 5, icon: "💒", desc: "ქორწილის სერვისი ორ პერსონაჟს შორის", cat: "service" },
  { id: 14, name: "Stuck Fix", price: 0, icon: "🔧", desc: "გაჭედილი პერსონაჟის გადატანა Giran-ში (უფასო)", cat: "service" },
];

const COIN_PACKS = [
  { coins: 10, price: 5, popular: false },
  { coins: 25, price: 10, popular: false },
  { coins: 55, price: 20, popular: true, bonus: "+10% ბონუსი" },
  { coins: 120, price: 40, popular: false, bonus: "+20% ბონუსი" },
  { coins: 300, price: 90, popular: false, bonus: "+33% ბონუსი" },
];

const CLASSES = [
  { race: "Human Fighter", jobs: ["Gladiator", "Warlord", "Paladin", "Dark Avenger", "Treasure Hunter", "Hawkeye"], icon: "⚔️" },
  { race: "Human Mystic", jobs: ["Sorcerer", "Necromancer", "Warlock", "Bishop", "Prophet"], icon: "🔮" },
  { race: "Elven Fighter", jobs: ["Temple Knight", "Swordsinger", "Plains Walker", "Silver Ranger"], icon: "🏹" },
  { race: "Elven Mystic", jobs: ["Spellsinger", "Elemental Summoner", "Elder"], icon: "✨" },
  { race: "Dark Elf Fighter", jobs: ["Shillien Knight", "Bladedancer", "Abyss Walker", "Phantom Ranger"], icon: "🗡️" },
  { race: "Dark Elf Mystic", jobs: ["Spellhowler", "Phantom Summoner", "Shillien Elder"], icon: "🌑" },
  { race: "Orc Fighter", jobs: ["Destroyer", "Tyrant"], icon: "💪" },
  { race: "Orc Mystic", jobs: ["Overlord", "Warcryer"], icon: "🥁" },
  { race: "Dwarf", jobs: ["Bounty Hunter", "Warsmith"], icon: "⛏️" },
  { race: "Kamael", jobs: ["Berserker", "Soul Breaker (M)", "Soul Breaker (F)", "Arbalester", "Inspector"], icon: "🪽" },
];

const FEATURES = [
  { t: "Retail-Like Gameplay", d: "ყველა quest, skill, NPC და game mechanic მუშაობს ზუსტად როგორც official სერვერზე. არანაირი შეცვლილი drop rate ან გამარტივებული content.", i: "🎮" },
  { t: "Geodata & Anti-Cheat", d: "სრული geodata ჩატვირთული pathfinding-ით. ანტიბოტ სისტემა, HWID ban, speed hack detection და GM მონიტორინგი 24/7.", i: "🛡️" },
  { t: "Olympiad & Heroes", d: "ყოველ 2 კვირაში ერთხელ ოლიმპიადის ციკლი. Class-based და Non-class matches. Hero სტატუსი და Hero weapons.", i: "🏆" },
  { t: "Castle & Fortress Siege", d: "ყველა Castle და Fortress ხელმისაწვდომია siege-ისთვის. 2-კვირიანი ციკლი. Territory War სისტემა Phase 3-ში.", i: "🏰" },
  { t: "Seven Signs & Instances", d: "სრული Seven Signs სისტემა. Catacombs, Necropolises, Kamaloka, Crystal Caverns, Frintezza და სხვა instances.", i: "📿" },
  { t: "Grand Boss System", d: "Antharas, Valakas, Baium, Beleth, Frintezza — retail spawn times. Epic jewelry რეალური drop rate-ით.", i: "🐉" },
  { t: "Clan & Alliance System", d: "Clan Halls (auction + siege), Clan Wars, Clan Academy (lv 5-40), Alliance system, Clan Reputation skills.", i: "⚔️" },
  { t: "Custom Events", d: "TvT, CTF, Deathmatch, Last Man Standing — ყოველდღიური ივენთები ავტომატური განრიგით. სპეციალური reward-ები.", i: "🎯" },
  { t: "Community Board", d: "ბუფერი სქემებით, ტელეპორტი, სტატისტიკა, ranking და clan info — ყველაფერი ბორდიდან ხელმისაწვდომი.", i: "📋" },
  { t: "Manor & Fishing", d: "სრული Manor system (seed/crop farming). Fishing system ყველა reward-ით. ეკონომიკის რეალური ბალანსი.", i: "🌾" },
  { t: "Auction House", d: "მოთამაშეთა შორის ვაჭრობის Community Board სისტემა. offline shop ფუნქციონალი.", i: "💰" },
  { t: "DDoS Protection", d: "Enterprise-დონის DDoS დაცვა Layer 3/4/7. სერვერის სტაბილურობა და 99.9% uptime გარანტია.", i: "🔒" },
];

const RULES = [
  "ბოტის, მაკროსის ან ავტომატური პროგრამების გამოყენება აკრძალულია. დაფიქსირების შემთხვევაში — permanent ban.",
  "RMT (Real Money Trading) — რეალური ფულით ვაჭრობა აკრძალულია. დონაცია მხოლოდ ოფიციალური საიტიდან.",
  "Bug/Exploit-ის გამოყენება ნაცვლად რეპორტისა — ban. ბაგების პატიოსნად შეტყობინება დაჯილდოვდება.",
  "სიძულვილის ენა, რასიზმი, თაღლითობა — გაფრთხილება → mute → ban.",
  "ერთ IP მისამართზე მაქსიმუმ 3 ანგარიში. HWID-ით მონიტორინგი.",
  "PvP ზონებში და siege-ზე ყველაფერი ნებადართულია. Safe zone-ში კილი არ მოხდება.",
  "GM-ებთან კომუნიკაცია მხოლოდ ticket სისტემით ან Discord-ით. In-game PM არ მუშაობს.",
  "სერვერის ადმინისტრაცია იტოვებს უფლებას შეცვალოს წესები წინასწარი შეტყობინებით.",
];

// ========== STYLES ==========
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600;700;800;900&family=Crimson+Text:ital,wght@0,400;0,600;0,700;1,400&family=JetBrains+Mono:wght@400;500&family=Noto+Sans+Georgian:wght@300;400;500;600;700&display=swap');
*{margin:0;padding:0;box-sizing:border-box}
::-webkit-scrollbar{width:6px}::-webkit-scrollbar-track{background:#0a0a0f}::-webkit-scrollbar-thumb{background:#3a2a1a;border-radius:3px}
body{overflow-x:hidden}
@keyframes glow{0%,100%{text-shadow:0 0 20px rgba(201,168,76,.3)}50%{text-shadow:0 0 40px rgba(201,168,76,.6)}}
@keyframes pulse{0%,100%{opacity:.4}50%{opacity:1}}
@keyframes slideUp{from{opacity:0;transform:translateY(30px)}to{opacity:1;transform:translateY(0)}}
@keyframes fadeIn{from{opacity:0}to{opacity:1}}
@keyframes borderGlow{0%,100%{border-color:rgba(201,168,76,.15)}50%{border-color:rgba(201,168,76,.4)}}
.nav-link{position:relative;cursor:pointer;padding:8px 12px;color:#8a7d65;transition:all .3s;font-size:12px;letter-spacing:1.5px;text-transform:uppercase;font-family:'Cinzel',serif;font-weight:600}
.nav-link:hover,.nav-link.active{color:#c9a84c}.nav-link::after{content:'';position:absolute;bottom:0;left:50%;width:0;height:1px;background:#c9a84c;transition:all .3s;transform:translateX(-50%)}.nav-link:hover::after,.nav-link.active::after{width:80%}
.geo{font-family:'Noto Sans Georgian','Crimson Text',serif}
.card{background:linear-gradient(145deg,rgba(30,25,18,.9),rgba(20,17,12,.95));border:1px solid rgba(201,168,76,.15);border-radius:4px;padding:24px;transition:all .4s;position:relative;overflow:hidden}
.card::before{content:'';position:absolute;top:0;left:0;right:0;height:1px;background:linear-gradient(90deg,transparent,rgba(201,168,76,.4),transparent)}
.card:hover{border-color:rgba(201,168,76,.4);transform:translateY(-3px);box-shadow:0 12px 40px rgba(0,0,0,.4)}
.btn{padding:12px 28px;font-family:'Cinzel',serif;font-weight:700;font-size:13px;letter-spacing:2px;text-transform:uppercase;cursor:pointer;transition:all .3s;border-radius:2px;border:none}
.btn-gold{background:linear-gradient(135deg,#c9a84c,#a0822a);color:#0a0a0f}.btn-gold:hover{transform:translateY(-2px);box-shadow:0 8px 25px rgba(201,168,76,.3)}
.btn-outline{background:transparent;color:#c9a84c;border:1px solid rgba(201,168,76,.4)}.btn-outline:hover{background:rgba(201,168,76,.1)}.btn-outline.active{background:rgba(201,168,76,.15)}
.btn-sm{padding:8px 16px;font-size:11px;letter-spacing:1px}
.btn-danger{background:#7f1d1d;color:#fca5a5;border:1px solid #991b1b}.btn-danger:hover{background:#991b1b}
.input{width:100%;background:rgba(15,13,10,.8);border:1px solid rgba(201,168,76,.2);color:#d4c9a8;padding:12px 16px;font-family:'Noto Sans Georgian',sans-serif;font-size:14px;border-radius:2px;transition:all .3s;outline:none}
.input:focus{border-color:rgba(201,168,76,.5)}.input::placeholder{color:#4a4436}
.textarea{min-height:100px;resize:vertical}
.tag{display:inline-block;padding:3px 8px;border-radius:2px;font-size:11px;font-family:'JetBrains Mono',monospace;letter-spacing:.5px;text-transform:uppercase}
.tag-free{background:rgba(74,222,128,.1);color:#4ade80;border:1px solid rgba(74,222,128,.2)}
.tag-price{background:rgba(201,168,76,.1);color:#c9a84c;border:1px solid rgba(201,168,76,.2)}
.tag-pinned{background:rgba(239,68,68,.1);color:#f87171;border:1px solid rgba(239,68,68,.2)}
.divider{height:1px;background:linear-gradient(90deg,transparent,rgba(201,168,76,.2),transparent);max-width:600px;margin:0 auto}
.section{padding:80px 24px;max-width:1200px;margin:0 auto}
.section-title{font-family:'Cinzel',serif;font-size:32px;font-weight:800;color:#c9a84c;text-align:center;margin-bottom:8px;letter-spacing:3px;animation:glow 3s ease-in-out infinite}
.section-sub{font-family:'Noto Sans Georgian','Crimson Text',serif;font-size:15px;color:#8a7d65;text-align:center;margin-bottom:40px}
.online-dot{width:8px;height:8px;border-radius:50%;background:#4ade80;animation:pulse 2s ease-in-out infinite;display:inline-block}
.grid{display:grid;gap:16px}
.grid-2{grid-template-columns:repeat(auto-fill,minmax(280px,1fr))}
.grid-3{grid-template-columns:repeat(auto-fill,minmax(320px,1fr))}
.grid-4{grid-template-columns:repeat(auto-fill,minmax(250px,1fr))}
.admin-card{background:rgba(20,17,12,.95);border:1px solid rgba(201,168,76,.1);border-radius:4px;padding:20px}
.admin-stat{text-align:center;padding:16px;background:rgba(201,168,76,.04);border:1px solid rgba(201,168,76,.1);border-radius:4px}
.tab{padding:10px 20px;cursor:pointer;border-bottom:2px solid transparent;color:#6a6050;font-family:'Cinzel',serif;font-size:12px;letter-spacing:1px;text-transform:uppercase;transition:all .3s}
.tab:hover{color:#8a7d65}.tab.active{color:#c9a84c;border-bottom-color:#c9a84c}
.mono{font-family:'JetBrains Mono',monospace}
.warn-box{padding:14px 20px;background:rgba(251,191,36,.05);border:1px solid rgba(251,191,36,.15);border-radius:4px;font-size:14px;color:#8a7d65}
@media(max-width:768px){.section-title{font-size:24px}.nav-link{font-size:13px;padding:10px 14px}.hide-mobile{display:none!important}}
`;

// ========== HELPERS ==========
function useStorage(key, init) {
  const [val, setVal] = useState(init);
  const loaded = useRef(false);
  useEffect(() => {
    (async () => {
      try {
        const r = await window.storage?.get(key);
        if (r?.value) setVal(JSON.parse(r.value));
      } catch {}
      loaded.current = true;
    })();
  }, [key]);
  const save = useCallback(async (v) => {
    setVal(v);
    try { await window.storage?.set(key, JSON.stringify(v)); } catch {}
  }, [key]);
  return [val, save, loaded.current];
}

function formatDate(d) {
  const m = ["იან", "თებ", "მარ", "აპრ", "მაი", "ივნ", "ივლ", "აგვ", "სექ", "ოქტ", "ნოე", "დეკ"];
  const dt = new Date(d);
  return `${dt.getDate()} ${m[dt.getMonth()]}, ${dt.getFullYear()}`;
}

function AnimNum({ target, dur = 1800 }) {
  const [v, setV] = useState(0);
  const ref = useRef(null);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        let s = Date.now();
        const t = () => { const p = Math.min((Date.now() - s) / dur, 1); setV(Math.floor(p * target)); if (p < 1) requestAnimationFrame(t); };
        t(); obs.disconnect();
      }
    }, { threshold: 0.5 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [target, dur]);
  return <span ref={ref}>{v}</span>;
}

// ========== MAIN APP ==========
export default function App() {
  const [page, setPage] = useState("main");
  const [section, setSection] = useState("home");
  const [news, setNews] = useStorage("dc-news", INIT_NEWS);
  const [downloads, setDownloads] = useStorage("dc-downloads", INIT_DOWNLOADS);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const h = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);

  const scrollTo = (id) => {
    setSection(id); setMobileMenu(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  if (page === "admin") return <AdminPanel news={news} setNews={setNews} downloads={downloads} setDownloads={setDownloads} onBack={() => setPage("main")} />;

  const navItems = [
    { id: "home", l: "მთავარი" }, { id: "news", l: "სიახლეები" }, { id: "features", l: "ფიჩერები" },
    { id: "rates", l: "რეითები" }, { id: "classes", l: "კლასები" }, { id: "donate", l: "მაღაზია" },
    { id: "download", l: "ჩამოტვირთვა" }, { id: "rules", l: "წესები" }, { id: "register", l: "რეგისტრაცია" },
  ];

  return (
    <div style={{ fontFamily: "'Cinzel',serif", background: "#0a0a0f", color: "#d4c9a8", minHeight: "100vh" }}>
      <style>{CSS}</style>

      {/* NAV */}
      <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000, background: scrollY > 50 ? "rgba(10,10,15,.97)" : "transparent", backdropFilter: scrollY > 50 ? "blur(20px)" : "none", borderBottom: scrollY > 50 ? "1px solid rgba(201,168,76,.1)" : "1px solid transparent", transition: "all .4s", padding: "0 20px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: 60 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }} onClick={() => scrollTo("home")}>
            <span style={{ fontSize: 24, color: "#c9a84c" }}>⚔</span>
            <span style={{ fontSize: 14, color: "#c9a84c", fontWeight: 800, letterSpacing: 2 }}>{CONFIG.serverName.toUpperCase()}</span>
          </div>
          <div style={{ display: "flex", gap: 2, alignItems: "center", flexWrap: "wrap" }} className="hide-mobile">
            {navItems.map(n => (
              <div key={n.id} className={`nav-link ${section === n.id ? "active" : ""}`} onClick={() => scrollTo(n.id)}>{n.l}</div>
            ))}
          </div>
          <div style={{ display: "none", cursor: "pointer", padding: 8 }} className="mobile-burger" onClick={() => setMobileMenu(!mobileMenu)}>
            <div style={{ width: 22, height: 2, background: "#c9a84c", marginBottom: 5 }} />
            <div style={{ width: 22, height: 2, background: "#c9a84c", marginBottom: 5 }} />
            <div style={{ width: 22, height: 2, background: "#c9a84c" }} />
          </div>
        </div>
        {mobileMenu && (
          <div style={{ background: "rgba(10,10,15,.98)", padding: "12px 0", borderTop: "1px solid rgba(201,168,76,.1)" }}>
            {navItems.map(n => <div key={n.id} className="nav-link" onClick={() => scrollTo(n.id)} style={{ display: "block", padding: "10px 20px" }}>{n.l}</div>)}
          </div>
        )}
      </nav>

      {/* HERO */}
      <section id="home" style={{ position: "relative", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 50% 30%,rgba(201,168,76,.06) 0%,transparent 60%),radial-gradient(ellipse at 80% 80%,rgba(139,69,19,.04) 0%,transparent 50%)" }} />
        {[...Array(15)].map((_, i) => <div key={i} style={{ position: "absolute", width: 2, height: 2, borderRadius: "50%", background: "rgba(201,168,76,.25)", left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%`, animation: `pulse ${2 + Math.random() * 3}s ease-in-out infinite`, animationDelay: `${Math.random() * 2}s` }} />)}
        <div style={{ textAlign: "center", position: "relative", zIndex: 1, padding: "0 24px", animation: "slideUp .8s ease-out" }}>
          <div style={{ fontSize: 13, color: "#6a6050", letterSpacing: 6, textTransform: "uppercase", marginBottom: 20 }}>LINEAGE II {CONFIG.chronicle.toUpperCase()} — x{CONFIG.rates.xp} RATES</div>
          <h1 style={{ fontSize: "clamp(36px,7vw,72px)", color: "#c9a84c", fontWeight: 900, lineHeight: 1.1, letterSpacing: 3, animation: "glow 3s ease-in-out infinite" }}>{CONFIG.serverName}</h1>
          <div style={{ width: 60, height: 1, background: "linear-gradient(90deg,transparent,#c9a84c,transparent)", margin: "20px auto" }} />
          <p className="geo" style={{ fontSize: 17, color: "#8a7d65", maxWidth: 550, margin: "0 auto 12px", fontStyle: "italic", lineHeight: 1.6 }}>
            Retail-like x1 Private Server — Grand Opening 15 აპრილი, 2026
          </p>
          <div style={{ display: "flex", gap: 14, justifyContent: "center", marginTop: 32, flexWrap: "wrap" }}>
            <button className="btn btn-gold" onClick={() => scrollTo("download")}>ჩამოტვირთე</button>
            <button className="btn btn-outline" onClick={() => scrollTo("register")}>რეგისტრაცია</button>
          </div>
          <div style={{ display: "flex", gap: 36, justifyContent: "center", marginTop: 48, flexWrap: "wrap" }}>
            {[
              { v: 847, l: "ონლაინ", dot: true },
              { v: 3241, l: "რეგისტრირებული" },
              { v: 52, l: "კლანი" },
            ].map((s, i) => (
              <div key={i} style={{ textAlign: "center" }}>
                <div style={{ fontSize: 32, color: "#c9a84c", fontWeight: 900 }}><AnimNum target={s.v} /></div>
                <div style={{ fontSize: 11, color: "#6a6050", letterSpacing: 2, textTransform: "uppercase", marginTop: 4 }}>
                  {s.dot && <span className="online-dot" style={{ marginRight: 6 }} />}{s.l}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* NEWS */}
      <section id="news" className="section">
        <div className="divider" style={{ marginBottom: 48 }} />
        <h2 className="section-title">სიახლეები</h2>
        <p className="section-sub geo">სერვერის უახლესი ამბები და განახლებები</p>
        <div className="grid grid-3">
          {news.sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0) || new Date(b.date) - new Date(a.date)).slice(0, 6).map(n => (
            <div key={n.id} className="card" style={{ animation: "borderGlow 4s ease-in-out infinite" }}>
              <div style={{ display: "flex", gap: 8, marginBottom: 10, alignItems: "center" }}>
                {n.pinned && <span className="tag tag-pinned">პინი</span>}
                <span className="mono" style={{ fontSize: 12, color: "#6a6050" }}>{formatDate(n.date)}</span>
              </div>
              <h3 style={{ fontSize: 15, fontWeight: 700, color: "#c9a84c", marginBottom: 8, letterSpacing: .5 }}>{n.title}</h3>
              <p className="geo" style={{ fontSize: 14, color: "#8a7d65", lineHeight: 1.6 }}>{n.content}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" style={{ padding: "80px 24px", background: "linear-gradient(180deg,rgba(20,17,12,.3),transparent,rgba(20,17,12,.3))" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <h2 className="section-title">სერვერის ფიჩერები</h2>
          <p className="section-sub geo">{CONFIG.chronicle} ქრონიკლის სრული გამოცდილება</p>
          <div className="grid grid-3">
            {FEATURES.map((f, i) => (
              <div key={i} className="card">
                <div style={{ fontSize: 26, marginBottom: 10 }}>{f.i}</div>
                <h3 style={{ fontSize: 14, fontWeight: 700, color: "#c9a84c", marginBottom: 6, letterSpacing: .5 }}>{f.t}</h3>
                <p className="geo" style={{ fontSize: 13, color: "#8a7d65", lineHeight: 1.5 }}>{f.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* RATES */}
      <section id="rates" className="section">
        <div className="divider" style={{ marginBottom: 48 }} />
        <h2 className="section-title">სერვერის პარამეტრები</h2>
        <p className="section-sub geo">ყველა მნიშვნელოვანი კონფიგურაცია ერთ ადგილას</p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 12, justifyContent: "center", marginBottom: 36 }}>
          {Object.entries(CONFIG.rates).map(([k, v]) => (
            <div key={k} style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(201,168,76,.06)", border: "1px solid rgba(201,168,76,.15)", padding: "12px 20px", borderRadius: 4 }}>
              <span className="mono" style={{ color: "#c9a84c", fontWeight: 700, fontSize: 15 }}>x{v}</span>
              <span style={{ color: "#8a7d65", fontSize: 13 }}>{k.replace(/([A-Z])/g, " $1")}</span>
            </div>
          ))}
        </div>
        <div className="grid grid-3" style={{ maxWidth: 1000, margin: "0 auto" }}>
          {[
            ["Max Level", `${CONFIG.maxLevel}`, "3rd Class Transfer"],
            ["Max Enchant", `+${CONFIG.maxEnchant}`, `Safe +${CONFIG.safeEnchant} / Full +${CONFIG.fullEnchant}`],
            ["Subclass", CONFIG.subclass, CONFIG.noblesse],
            ["Buffer", "სქემა", "Community Board"],
            ["Auto Loot", CONFIG.autoLoot ? "ჩართული" : "გამორთული", CONFIG.autoLootRaid ? "Raid-ზეც" : "Raid-ზე გამორთული"],
            ["Vitality", CONFIG.vitality, "Retail-Like System"],
            ["Olympiad", CONFIG.olympiadCycle, "Class + Non-Class"],
            ["Siege", CONFIG.siegeCycle, "ყველა Castle + Fortress"],
            ["GM Shop", CONFIG.gmShop ? "კი" : "არა", "მხოლოდ Grocery / Shadow Items"],
          ].map(([l, v, s], i) => (
            <div key={i} className="card" style={{ textAlign: "center", padding: 18 }}>
              <div className="mono" style={{ fontSize: 24, color: "#c9a84c", fontWeight: 700 }}>{v}</div>
              <div style={{ fontSize: 12, color: "#d4c9a8", letterSpacing: 1, marginTop: 4 }}>{l}</div>
              <div className="geo" style={{ fontSize: 12, color: "#6a6050", marginTop: 3 }}>{s}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CLASSES */}
      <ClassSection />

      {/* DONATE SHOP */}
      <DonateShop />

      {/* DOWNLOAD */}
      <section id="download" className="section">
        <div className="divider" style={{ marginBottom: 48 }} />
        <h2 className="section-title">ჩამოტვირთვა</h2>
        <p className="section-sub geo">დააინსტალირე კლიენტი და შეუერთდი Destruction Chronicles-ს</p>
        <div className="grid grid-3" style={{ maxWidth: 900, margin: "0 auto 32px" }}>
          {downloads.filter(d => d.active).map(d => (
            <div key={d.id} className="card" style={{ textAlign: "center", padding: 24 }}>
              <div style={{ fontSize: 32, marginBottom: 10 }}>📥</div>
              <div style={{ fontSize: 15, fontWeight: 700, color: "#c9a84c", letterSpacing: .5 }}>{d.name}</div>
              <div className="mono" style={{ fontSize: 12, color: "#6a6050", margin: "6px 0" }}>{d.size}</div>
              <p className="geo" style={{ fontSize: 13, color: "#8a7d65", marginBottom: 14 }}>{d.desc}</p>
              <a href={d.url} style={{ textDecoration: "none" }}><button className="btn btn-gold btn-sm" style={{ width: "100%" }}>ჩამოტვირთე</button></a>
            </div>
          ))}
        </div>
        <div className="card" style={{ maxWidth: 600, margin: "0 auto", textAlign: "left" }}>
          <h3 style={{ fontSize: 14, color: "#c9a84c", marginBottom: 14, letterSpacing: 1 }}>სისტემური მოთხოვნები</h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px 20px" }}>
            {[["OS", "Windows 7/10/11"], ["CPU", "Dual Core 2.0 GHz+"], ["RAM", "2 GB+"], ["GPU", "GeForce 6600+"], ["HDD", "10 GB თავისუფალი"], ["DirectX", "9.0c+"], ["ინტერნეტი", "სტაბილური"]].map(([k, v], i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "5px 0", borderBottom: "1px solid rgba(201,168,76,.05)" }}>
                <span className="geo" style={{ color: "#6a6050", fontSize: 13 }}>{k}</span>
                <span className="mono" style={{ color: "#8a7d65", fontSize: 12 }}>{v}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* RULES */}
      <section id="rules" style={{ padding: "80px 24px", background: "linear-gradient(180deg,rgba(20,17,12,.3),transparent,rgba(20,17,12,.3))" }}>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <h2 className="section-title">სერვერის წესები</h2>
          <p className="section-sub geo">წესების დარღვევა გამოიწვევს ანგარიშის დაბლოკვას</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {RULES.map((r, i) => (
              <div key={i} className="card" style={{ padding: "14px 20px", display: "flex", gap: 14, alignItems: "flex-start" }}>
                <span className="mono" style={{ color: "#c9a84c", fontSize: 14, fontWeight: 700, minWidth: 24 }}>{String(i + 1).padStart(2, "0")}</span>
                <p className="geo" style={{ fontSize: 14, color: "#8a7d65", lineHeight: 1.5 }}>{r}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* REGISTER */}
      <RegisterSection />

      {/* FOOTER */}
      <footer style={{ padding: "48px 24px 24px", borderTop: "1px solid rgba(201,168,76,.08)" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 28, marginBottom: 32 }}>
          <div>
            <div style={{ fontSize: 16, color: "#c9a84c", fontWeight: 800, marginBottom: 12, letterSpacing: 2 }}>⚔ {CONFIG.serverName.toUpperCase()}</div>
            <p className="geo" style={{ fontSize: 13, color: "#6a6050", lineHeight: 1.6 }}>Retail-like {CONFIG.chronicle} x{CONFIG.rates.xp} სერვერი. Grand Opening 15 აპრილი, 2026.</p>
          </div>
          <div>
            <div style={{ fontSize: 12, color: "#8a7d65", marginBottom: 10, letterSpacing: 1 }}>კონტაქტი</div>
            <div className="geo" style={{ fontSize: 13, color: "#4a4436", lineHeight: 2 }}>
              Discord: discord.gg/destruction<br />Email: support@destruction.ge<br />Facebook: /DestructionChronicles
            </div>
          </div>
          <div>
            <div style={{ fontSize: 12, color: "#8a7d65", marginBottom: 10, letterSpacing: 1 }}>სერვერი</div>
            <div className="mono" style={{ fontSize: 11, color: "#4a4436", lineHeight: 2.2 }}>
              <span className="online-dot" style={{ marginRight: 6 }} />Login: login.destruction.ge<br />Game: game.destruction.ge<br />Port: 7777
            </div>
          </div>
          <div>
            <div style={{ fontSize: 12, color: "#8a7d65", marginBottom: 10, letterSpacing: 1 }}>გადახდა</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {["BOG iPay", "TBC Pay", "Visa/MC", "Crypto"].map(m => (
                <span key={m} style={{ padding: "4px 10px", background: "rgba(201,168,76,.04)", border: "1px solid rgba(201,168,76,.08)", borderRadius: 2, fontSize: 11, color: "#6a6050" }}>{m}</span>
              ))}
            </div>
          </div>
        </div>
        <div className="divider" />
        <div style={{ textAlign: "center", paddingTop: 20, display: "flex", justifyContent: "center", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
          <span style={{ fontSize: 12, color: "#3a3428" }}>© 2026 {CONFIG.serverName}. Lineage II — NCSoft.</span>
          <span style={{ fontSize: 11, color: "#2a2418", cursor: "pointer" }} onClick={() => setPage("admin")}>Panel</span>
        </div>
      </footer>
    </div>
  );
}

// ========== CLASS SECTION ==========
function ClassSection() {
  const [open, setOpen] = useState(null);
  return (
    <section id="classes" style={{ padding: "80px 24px", background: "linear-gradient(180deg,rgba(20,17,12,.3),transparent,rgba(20,17,12,.3))" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <h2 className="section-title">კლასები</h2>
        <p className="section-sub geo">{CONFIG.chronicle}-ის ყველა კლასი და 3rd profession</p>
        <div className="grid grid-2">
          {CLASSES.map((c, i) => (
            <div key={i} className="card" style={{ cursor: "pointer", padding: 18 }} onClick={() => setOpen(open === i ? null : i)}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: open === i ? 10 : 0 }}>
                <span style={{ fontSize: 22 }}>{c.icon}</span>
                <span style={{ fontSize: 14, fontWeight: 700, color: "#c9a84c", letterSpacing: .5 }}>{c.race}</span>
                <span style={{ marginLeft: "auto", color: "#6a6050", fontSize: 11, transition: "transform .3s", transform: open === i ? "rotate(180deg)" : "" }}>▼</span>
              </div>
              {open === i && (
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6, paddingTop: 10, borderTop: "1px solid rgba(201,168,76,.1)", animation: "fadeIn .3s" }}>
                  {c.jobs.map((j, k) => <span key={k} style={{ padding: "3px 10px", background: "rgba(201,168,76,.05)", border: "1px solid rgba(201,168,76,.1)", borderRadius: 2, fontSize: 12, color: "#8a7d65" }}>{j}</span>)}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ========== DONATE SHOP ==========
function DonateShop() {
  const [filter, setFilter] = useState("all");
  const [showCoins, setShowCoins] = useState(false);
  const filtered = filter === "all" ? DONATE_ITEMS : DONATE_ITEMS.filter(i => i.cat === filter);

  return (
    <section id="donate" className="section">
      <div className="divider" style={{ marginBottom: 48 }} />
      <h2 className="section-title">დონაცია</h2>
      <p className="section-sub geo">მხოლოდ კოსმეტიკა და QoL — NO PAY TO WIN</p>

      <div className="warn-box geo" style={{ maxWidth: 700, margin: "0 auto 28px", textAlign: "center" }}>
        ⚠️ დონაციის შემოსავალი მთლიანად სერვერის ინფრასტრუქტურასა და განვითარებაზე იხარჯება. არცერთი აითემი არ იძლევა gameplay advantage-ს.
      </div>

      <div style={{ textAlign: "center", marginBottom: 24 }}>
        <button className="btn btn-gold" onClick={() => setShowCoins(!showCoins)}>
          {showCoins ? "დახურე" : "💰 ქოინების შეძენა"}
        </button>
      </div>

      {showCoins && (
        <div style={{ maxWidth: 800, margin: "0 auto 32px", animation: "fadeIn .3s" }}>
          <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fill,minmax(140px,1fr))", gap: 12 }}>
            {COIN_PACKS.map((p, i) => (
              <div key={i} className="card" style={{ textAlign: "center", padding: 18, border: p.popular ? "1px solid rgba(201,168,76,.4)" : undefined }}>
                {p.popular && <div style={{ fontSize: 10, color: "#c9a84c", letterSpacing: 1, marginBottom: 6, textTransform: "uppercase" }}>პოპულარული</div>}
                <div className="mono" style={{ fontSize: 28, color: "#c9a84c", fontWeight: 700 }}>{p.coins}</div>
                <div style={{ fontSize: 11, color: "#8a7d65", marginBottom: 4 }}>ქოინი</div>
                <div className="mono" style={{ fontSize: 16, color: "#d4c9a8", fontWeight: 600 }}>{p.price} ₾</div>
                {p.bonus && <div style={{ fontSize: 11, color: "#4ade80", marginTop: 4 }}>{p.bonus}</div>}
                <button className="btn btn-outline btn-sm" style={{ width: "100%", marginTop: 10 }}>შეიძინე</button>
              </div>
            ))}
          </div>
          <div style={{ display: "flex", gap: 10, justifyContent: "center", marginTop: 16, flexWrap: "wrap" }}>
            {["BOG iPay", "TBC Pay", "Visa / Mastercard"].map(m => (
              <span key={m} style={{ padding: "6px 14px", background: "rgba(201,168,76,.04)", border: "1px solid rgba(201,168,76,.1)", borderRadius: 2, fontSize: 12, color: "#8a7d65" }}>{m}</span>
            ))}
          </div>
        </div>
      )}

      <div style={{ display: "flex", gap: 6, justifyContent: "center", marginBottom: 24, flexWrap: "wrap" }}>
        {[["all", "ყველა"], ["cosmetic", "კოსმეტიკა"], ["boost", "ბუსტი"], ["clan", "კლანი"], ["service", "სერვისი"]].map(([id, l]) => (
          <button key={id} className={`btn btn-outline btn-sm ${filter === id ? "active" : ""}`} onClick={() => setFilter(id)}>{l}</button>
        ))}
      </div>

      <div className="grid grid-4">
        {filtered.map(item => (
          <div key={item.id} className="card" style={{ padding: 18, display: "flex", flexDirection: "column", gap: 6 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: 24 }}>{item.icon}</span>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#c9a84c" }}>{item.name}</div>
                <div className="geo" style={{ fontSize: 12, color: "#6a6050", marginTop: 2 }}>{item.desc}</div>
              </div>
            </div>
            <div style={{ marginTop: "auto", display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 10, borderTop: "1px solid rgba(201,168,76,.06)" }}>
              {item.price === 0 ? <span className="tag tag-free">უფასო</span> : <span className="tag tag-price">{item.price} Coins</span>}
              <button className="btn btn-outline btn-sm">{item.price === 0 ? "მოითხოვე" : "შეიძინე"}</button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ========== REGISTER ==========
function RegisterSection() {
  const [form, setForm] = useState({ login: "", password: "", confirm: "", email: "" });
  const [err, setErr] = useState("");
  const [ok, setOk] = useState(false);
  const [showPw, setShowPw] = useState(false);

  const submit = () => {
    setErr("");
    if (!form.login || !form.password || !form.email) return setErr("ყველა ველი სავალდებულოა");
    if (form.login.length < 4 || form.login.length > 14) return setErr("ლოგინი 4-14 სიმბოლო (ლათინური)");
    if (!/^[a-zA-Z0-9_]+$/.test(form.login)) return setErr("ლოგინში მხოლოდ ლათინური ასოები, ციფრები და _");
    if (form.password.length < 6) return setErr("პაროლი მინიმუმ 6 სიმბოლო");
    if (form.password !== form.confirm) return setErr("პაროლები არ ემთხვევა");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) return setErr("არავალიდური ელ-ფოსტა");
    setOk(true);
  };

  return (
    <section id="register" className="section">
      <div style={{ maxWidth: 440, margin: "0 auto" }}>
        <div className="divider" style={{ marginBottom: 48 }} />
        <h2 className="section-title">რეგისტრაცია</h2>
        <p className="section-sub geo">შექმენი ანგარიში და შეუერთდი სამყაროს</p>
        {ok ? (
          <div className="card" style={{ textAlign: "center", padding: 32 }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>✅</div>
            <div style={{ fontSize: 18, color: "#4ade80", marginBottom: 6 }}>რეგისტრაცია წარმატებულია!</div>
            <p className="geo" style={{ fontSize: 14, color: "#8a7d65" }}>ჩამოტვირთე კლიენტი და შემოგვიერთდი</p>
          </div>
        ) : (
          <div className="card" style={{ padding: 28 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {[
                ["ლოგინი", "login", "text", "4-14 ლათინური სიმბოლო"],
                ["ელ-ფოსტა", "email", "email", "example@mail.com"],
                ["პაროლი", "password", showPw ? "text" : "password", "მინიმუმ 6 სიმბოლო"],
                ["პაროლის დადასტურება", "confirm", showPw ? "text" : "password", "გაიმეორე პაროლი"],
              ].map(([label, key, type, ph]) => (
                <div key={key}>
                  <label className="geo" style={{ fontSize: 11, color: "#6a6050", letterSpacing: .5, display: "block", marginBottom: 4 }}>{label}</label>
                  <input className="input" type={type} placeholder={ph} value={form[key]} onChange={e => setForm({ ...form, [key]: e.target.value })} />
                </div>
              ))}
              <label className="geo" style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: "#6a6050", cursor: "pointer" }}>
                <input type="checkbox" checked={showPw} onChange={() => setShowPw(!showPw)} /> პაროლის ჩვენება
              </label>
              {err && <div style={{ padding: "8px 12px", background: "rgba(239,68,68,.1)", border: "1px solid rgba(239,68,68,.2)", borderRadius: 2, fontSize: 13, color: "#f87171" }} className="geo">{err}</div>}
              <button className="btn btn-gold" style={{ width: "100%", marginTop: 4 }} onClick={submit}>რეგისტრაცია</button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

// ========== ADMIN PANEL ==========
function AdminPanel({ news, setNews, downloads, setDownloads, onBack }) {
  const [auth, setAuth] = useState(false);
  const [pw, setPw] = useState("");
  const [tab, setTab] = useState("dashboard");
  const [editNews, setEditNews] = useState(null);
  const [editDl, setEditDl] = useState(null);
  const [newNewsForm, setNewNewsForm] = useState({ title: "", content: "", pinned: false });
  const [newDlForm, setNewDlForm] = useState({ name: "", size: "", url: "", desc: "" });

  if (!auth) {
    return (
      <div style={{ fontFamily: "'Cinzel',serif", background: "#0a0a0f", color: "#d4c9a8", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <style>{CSS}</style>
        <div className="card" style={{ maxWidth: 380, width: "100%", margin: 20, padding: 32 }}>
          <h2 style={{ fontSize: 18, color: "#c9a84c", textAlign: "center", marginBottom: 20, letterSpacing: 2 }}>⚔ ADMIN PANEL</h2>
          <input className="input" type="password" placeholder="პაროლი" value={pw} onChange={e => setPw(e.target.value)} onKeyDown={e => e.key === "Enter" && pw === CONFIG.adminHash && setAuth(true)} />
          <button className="btn btn-gold" style={{ width: "100%", marginTop: 12 }} onClick={() => { if (pw === CONFIG.adminHash) setAuth(true); else alert("არასწორი პაროლი"); }}>შესვლა</button>
          <div style={{ textAlign: "center", marginTop: 12 }}><span style={{ fontSize: 12, color: "#4a4436", cursor: "pointer" }} onClick={onBack}>← უკან საიტზე</span></div>
        </div>
      </div>
    );
  }

  const addNews = () => {
    if (!newNewsForm.title || !newNewsForm.content) return;
    const n = { id: Date.now(), title: newNewsForm.title, date: new Date().toISOString().split("T")[0], content: newNewsForm.content, pinned: newNewsForm.pinned };
    setNews([n, ...news]);
    setNewNewsForm({ title: "", content: "", pinned: false });
  };

  const deleteNews = (id) => setNews(news.filter(n => n.id !== id));
  const togglePin = (id) => setNews(news.map(n => n.id === id ? { ...n, pinned: !n.pinned } : n));

  const addDownload = () => {
    if (!newDlForm.name || !newDlForm.url) return;
    setDownloads([...downloads, { id: Date.now(), ...newDlForm, active: true }]);
    setNewDlForm({ name: "", size: "", url: "", desc: "" });
  };

  const toggleDlActive = (id) => setDownloads(downloads.map(d => d.id === id ? { ...d, active: !d.active } : d));
  const deleteDl = (id) => setDownloads(downloads.filter(d => d.id !== id));

  const tabs = [
    { id: "dashboard", l: "Dashboard" },
    { id: "news", l: "სიახლეები" },
    { id: "downloads", l: "ჩამოტვირთვები" },
    { id: "settings", l: "პარამეტრები" },
  ];

  return (
    <div style={{ fontFamily: "'Cinzel',serif", background: "#0a0a0f", color: "#d4c9a8", minHeight: "100vh" }}>
      <style>{CSS}</style>
      <div style={{ borderBottom: "1px solid rgba(201,168,76,.1)", padding: "12px 20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ color: "#c9a84c", fontSize: 18 }}>⚔</span>
          <span style={{ color: "#c9a84c", fontSize: 13, fontWeight: 700, letterSpacing: 2 }}>ADMIN PANEL</span>
        </div>
        <div style={{ display: "flex", gap: 12 }}>
          <span style={{ fontSize: 12, color: "#4a4436", cursor: "pointer" }} onClick={onBack}>← საიტზე დაბრუნება</span>
          <span style={{ fontSize: 12, color: "#6a6050", cursor: "pointer" }} onClick={() => setAuth(false)}>გასვლა</span>
        </div>
      </div>

      <div style={{ display: "flex", borderBottom: "1px solid rgba(201,168,76,.08)", padding: "0 20px", overflowX: "auto" }}>
        {tabs.map(t => <div key={t.id} className={`tab ${tab === t.id ? "active" : ""}`} onClick={() => setTab(t.id)}>{t.l}</div>)}
      </div>

      <div style={{ maxWidth: 1000, margin: "24px auto", padding: "0 20px" }}>
        {/* DASHBOARD */}
        {tab === "dashboard" && (
          <div>
            <h3 style={{ fontSize: 16, color: "#c9a84c", marginBottom: 16, letterSpacing: 1 }}>სერვერის მიმოხილვა</h3>
            <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fill,minmax(180px,1fr))", gap: 12, marginBottom: 24 }}>
              {[
                ["სიახლეები", news.length, "📰"],
                ["ჩამოტვირთვები", downloads.filter(d => d.active).length, "📥"],
                ["დონატ აითემი", DONATE_ITEMS.length, "💎"],
                ["კოინ პაკეტი", COIN_PACKS.length, "💰"],
              ].map(([l, v, ic], i) => (
                <div key={i} className="admin-stat">
                  <div style={{ fontSize: 24, marginBottom: 6 }}>{ic}</div>
                  <div className="mono" style={{ fontSize: 22, color: "#c9a84c", fontWeight: 700 }}>{v}</div>
                  <div className="geo" style={{ fontSize: 12, color: "#6a6050", marginTop: 2 }}>{l}</div>
                </div>
              ))}
            </div>
            <div className="admin-card">
              <h4 style={{ fontSize: 13, color: "#c9a84c", marginBottom: 10, letterSpacing: 1 }}>სწრაფი ინფორმაცია</h4>
              <div className="geo" style={{ fontSize: 13, color: "#8a7d65", lineHeight: 1.8 }}>
                <strong>დომეინი:</strong> {CONFIG.domain}<br />
                <strong>ქრონიკლი:</strong> {CONFIG.chronicle}<br />
                <strong>რეითი:</strong> x{CONFIG.rates.xp}<br />
                <strong>გადახდა:</strong> BOG iPay (api.bog.ge), TBC Pay (api.tbcbank.ge)<br />
                <strong>პაროლი:</strong> შეცვალე Settings ტაბში
              </div>
            </div>
          </div>
        )}

        {/* NEWS MANAGEMENT */}
        {tab === "news" && (
          <div>
            <h3 style={{ fontSize: 16, color: "#c9a84c", marginBottom: 16, letterSpacing: 1 }}>სიახლეების მართვა</h3>
            <div className="admin-card" style={{ marginBottom: 20 }}>
              <h4 className="geo" style={{ fontSize: 13, color: "#8a7d65", marginBottom: 10 }}>ახალი სიახლის დამატება</h4>
              <input className="input" placeholder="სათაური" value={newNewsForm.title} onChange={e => setNewNewsForm({ ...newNewsForm, title: e.target.value })} style={{ marginBottom: 8 }} />
              <textarea className="input textarea" placeholder="შინაარსი" value={newNewsForm.content} onChange={e => setNewNewsForm({ ...newNewsForm, content: e.target.value })} style={{ marginBottom: 8 }} />
              <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                <label className="geo" style={{ fontSize: 12, color: "#6a6050", display: "flex", alignItems: "center", gap: 6, cursor: "pointer" }}>
                  <input type="checkbox" checked={newNewsForm.pinned} onChange={e => setNewNewsForm({ ...newNewsForm, pinned: e.target.checked })} /> მიამაგრე ზემოთ
                </label>
                <button className="btn btn-gold btn-sm" onClick={addNews}>დამატება</button>
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {news.sort((a, b) => new Date(b.date) - new Date(a.date)).map(n => (
                <div key={n.id} className="admin-card" style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", gap: 6, alignItems: "center", marginBottom: 4 }}>
                      {n.pinned && <span className="tag tag-pinned" style={{ fontSize: 10 }}>📌</span>}
                      <span style={{ fontSize: 14, fontWeight: 700, color: "#c9a84c" }}>{n.title}</span>
                    </div>
                    <span className="mono" style={{ fontSize: 11, color: "#6a6050" }}>{n.date}</span>
                    <p className="geo" style={{ fontSize: 13, color: "#8a7d65", marginTop: 4 }}>{n.content.slice(0, 100)}...</p>
                  </div>
                  <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
                    <button className="btn btn-outline btn-sm" onClick={() => togglePin(n.id)}>{n.pinned ? "📌" : "Pin"}</button>
                    <button className="btn btn-danger btn-sm" onClick={() => deleteNews(n.id)}>წაშლა</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* DOWNLOADS MANAGEMENT */}
        {tab === "downloads" && (
          <div>
            <h3 style={{ fontSize: 16, color: "#c9a84c", marginBottom: 16, letterSpacing: 1 }}>ჩამოტვირთვების მართვა</h3>
            <div className="admin-card" style={{ marginBottom: 20 }}>
              <h4 className="geo" style={{ fontSize: 13, color: "#8a7d65", marginBottom: 10 }}>ახალი ფაილის დამატება</h4>
              <div className="grid" style={{ gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 8 }}>
                <input className="input" placeholder="სახელი" value={newDlForm.name} onChange={e => setNewDlForm({ ...newDlForm, name: e.target.value })} />
                <input className="input" placeholder="ზომა (მაგ. 7.2 GB)" value={newDlForm.size} onChange={e => setNewDlForm({ ...newDlForm, size: e.target.value })} />
              </div>
              <input className="input" placeholder="ჩამოტვირთვის ლინკი (URL)" value={newDlForm.url} onChange={e => setNewDlForm({ ...newDlForm, url: e.target.value })} style={{ marginBottom: 8 }} />
              <input className="input" placeholder="აღწერა" value={newDlForm.desc} onChange={e => setNewDlForm({ ...newDlForm, desc: e.target.value })} style={{ marginBottom: 8 }} />
              <button className="btn btn-gold btn-sm" onClick={addDownload}>დამატება</button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {downloads.map(d => (
                <div key={d.id} className="admin-card" style={{ display: "flex", gap: 12, alignItems: "center", opacity: d.active ? 1 : .5 }}>
                  <div style={{ flex: 1 }}>
                    <span style={{ fontSize: 14, fontWeight: 700, color: "#c9a84c" }}>{d.name}</span>
                    <span className="mono" style={{ fontSize: 11, color: "#6a6050", marginLeft: 8 }}>{d.size}</span>
                    <p className="geo" style={{ fontSize: 12, color: "#8a7d65", marginTop: 2 }}>{d.desc}</p>
                    <p className="mono" style={{ fontSize: 11, color: "#4a4436", marginTop: 2 }}>{d.url}</p>
                  </div>
                  <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
                    <button className="btn btn-outline btn-sm" onClick={() => toggleDlActive(d.id)}>{d.active ? "გამორთე" : "ჩართე"}</button>
                    <button className="btn btn-danger btn-sm" onClick={() => deleteDl(d.id)}>წაშლა</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SETTINGS */}
        {tab === "settings" && (
          <div>
            <h3 style={{ fontSize: 16, color: "#c9a84c", marginBottom: 16, letterSpacing: 1 }}>პარამეტრები</h3>
            <div className="admin-card" style={{ marginBottom: 16 }}>
              <h4 className="geo" style={{ fontSize: 13, color: "#8a7d65", marginBottom: 10 }}>გადახდის ინტეგრაცია</h4>
              <div className="geo" style={{ fontSize: 13, color: "#6a6050", lineHeight: 1.8 }}>
                <strong style={{ color: "#c9a84c" }}>BOG iPay:</strong> რეგისტრაცია businessonline.ge-ზე → iPay მერჩანტის გახსნა → client_id და secret_key-ის მიღება → callback URL-ების კონფიგურაცია (api.bog.ge/docs/en/ipay)<br /><br />
                <strong style={{ color: "#c9a84c" }}>TBC E-Commerce:</strong> განაცხადი tbcbank.ge/web/card-payments → API credentials მიღება → endpoint: api.tbcbank.ge/v1/tpay → callback კონფიგურაცია<br /><br />
                <strong style={{ color: "#c9a84c" }}>Backend სჭირდება:</strong> გადახდის API-ები server-side უნდა დამუშავდეს (Cloudflare Workers ან Node.js backend). client_id/secret არასოდეს frontend-ში!
              </div>
            </div>
            <div className="admin-card" style={{ marginBottom: 16 }}>
              <h4 className="geo" style={{ fontSize: 13, color: "#8a7d65", marginBottom: 10 }}>უსაფრთხოების ჩეკლისტი</h4>
              <div className="geo" style={{ fontSize: 13, color: "#6a6050", lineHeight: 2 }}>
                ✅ Cloudflare DDoS Protection (Layer 3/4/7)<br />
                ✅ SSL/TLS Full (Strict) Mode<br />
                ✅ WAF Managed Rules ჩართული<br />
                ✅ Bot Protection ჩართული<br />
                ⬜ CSP Headers (Cloudflare Workers-ში)<br />
                ⬜ Rate Limiting (API endpoints)<br />
                ⬜ Admin panel production-ში backend-ზე გატანა<br />
                ⬜ Payment API server-side integration<br />
                ⬜ HWID ban system გეიმ სერვერზე<br />
                ⬜ Database backup automation
              </div>
            </div>
            <div className="admin-card">
              <h4 className="geo" style={{ fontSize: 13, color: "#8a7d65", marginBottom: 10 }}>Production TODO</h4>
              <div className="geo" style={{ fontSize: 13, color: "#6a6050", lineHeight: 2 }}>
                1. Cloudflare Workers backend — გადახდის API, რეგისტრაცია, სერვერ სტატუსი<br />
                2. Cloudflare D1 (SQLite) ან KV — მომხმარებლების, ტრანზაქციების ბაზა<br />
                3. BOG iPay მერჩანტის რეგისტრაცია (businessonline.ge)<br />
                4. TBC E-Commerce მერჩანტის რეგისტრაცია<br />
                5. L2J Server setup (MySQL + Java) — dedicated სერვერზე<br />
                6. DNS records: login.destruction.ge, game.destruction.ge<br />
                7. Veeam backup გეიმ სერვერის DB-სთვის<br />
                8. Monitoring: Uptime Kuma ან Cloudflare Health Checks
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
