import { useState, useEffect, useRef } from 'react';
import { Link } from '@inertiajs/react';
import JuriSidebar from '@/components/JuriSidebar';
import {
    IconCircleCheck,
    IconClock,
    IconPhoto,
    IconTrendingUp,
    IconStar,
    IconAlertCircle,
    IconLayoutDashboard,
    IconChevronRight,
    IconPalette,
    IconRefresh,
} from '@tabler/icons-react';

// ─── TYPES ─────────────────────────────────────────────────
interface AuthUser {
    name: string;
    email: string;
    role: string;
}

interface Design {
    judul: string;
    file_path?: string;
    user: { name: string } | null;
}

interface Penilaian {
    id: number;
    rata_rata: number;
    design: Design | null;
}

interface Props {
    auth: { user: AuthUser };
    total_dinilai: number;
    total_belum_dinilai: number;
    penilaian_terakhir: Penilaian[];
}

// ─── GLOBAL STYLES ─────────────────────────────────────────
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700;800;900&family=Plus+Jakarta+Sans:wght@300;400;500;600&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html { scroll-behavior: smooth; }
  body { font-family: 'Plus Jakarta Sans', sans-serif; -webkit-font-smoothing: antialiased; }
  ::-webkit-scrollbar { width: 5px; height: 5px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: rgba(14,100,180,0.2); border-radius: 10px; }

  @keyframes slideFromTop {
    from { opacity: 0; transform: translateY(-36px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes slideFromLeft {
    from { opacity: 0; transform: translateX(-56px); }
    to   { opacity: 1; transform: translateX(0); }
  }
  @keyframes slideFromRight {
    from { opacity: 0; transform: translateX(56px); }
    to   { opacity: 1; transform: translateX(0); }
  }
  @keyframes slideFromBottom {
    from { opacity: 0; transform: translateY(36px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes popIn {
    from { opacity: 0; transform: scale(0.7) rotate(-15deg); }
    to   { opacity: 1; transform: scale(1) rotate(0deg); }
  }
  @keyframes shimmer { 0%{background-position:0% 50%} 50%{background-position:100% 50%} 100%{background-position:0% 50%} }
  @keyframes orb-drift { 0%,100%{transform:translate(0,0)} 33%{transform:translate(20px,-14px)} 66%{transform:translate(-16px,18px)} }
  @keyframes blink-dot { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.4;transform:scale(0.7)} }

  .pd-ready .anim-top    { animation: slideFromTop    0.55s cubic-bezier(0.22,1,0.36,1) both; }
  .pd-ready .anim-left   { animation: slideFromLeft   0.55s cubic-bezier(0.22,1,0.36,1) both; }
  .pd-ready .anim-right  { animation: slideFromRight  0.55s cubic-bezier(0.22,1,0.36,1) both; }
  .pd-ready .anim-bottom { animation: slideFromBottom 0.55s cubic-bezier(0.22,1,0.36,1) both; }
  .pd-ready .anim-pop    { animation: popIn 0.45s cubic-bezier(0.34,1.56,0.64,1) both; }

  .pd-ready .stat-0 { animation-delay: 0.10s; }
  .pd-ready .stat-1 { animation-delay: 0.18s; }
  .pd-ready .stat-2 { animation-delay: 0.26s; }
  .pd-ready .stat-3 { animation-delay: 0.34s; }

  .pd-ready .delay-1 { animation-delay: 0.08s; }
  .pd-ready .delay-2 { animation-delay: 0.30s; }
  .pd-ready .delay-3 { animation-delay: 0.38s; }
  .pd-ready .delay-4 { animation-delay: 0.46s; }
  .pd-ready .delay-5 { animation-delay: 0.54s; }

  .anim-top, .anim-left, .anim-right, .anim-bottom, .anim-pop { opacity: 0; }

  .gradient-text-sky {
    background: linear-gradient(135deg, #0A2F5E 0%, #1565C0 32%, #0EA5E9 62%, #38BDF8 100%);
    background-size: 280%;
    -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
    animation: shimmer 7s ease infinite;
  }

  .juri-page { font-family: 'Plus Jakarta Sans', sans-serif; }

  .juri-main {
    transition: margin-left 0.35s cubic-bezier(0.22,1,0.36,1);
  }

  .stat-card-hover {
    background: rgba(255,255,255,0.70);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border: 1.5px solid rgba(255,255,255,0.88);
    border-radius: 22px;
    padding: clamp(18px,2.5vw,28px);
    display: flex;
    align-items: center;
    gap: 16;
    box-shadow: 0 4px 18px rgba(11,31,58,0.06);
    transition: transform .32s cubic-bezier(.34,1.4,.64,1), box-shadow .32s ease;
    cursor: default;
  }
  .stat-card-hover:hover { transform: translateY(-6px) scale(1.02); box-shadow: 0 20px 48px rgba(11,31,58,0.14) !important; }

  .score-row {
    transition: transform .24s ease, box-shadow .24s ease;
    cursor: default;
  }
  .score-row:hover { transform: translateY(-2px); box-shadow: 0 8px 22px rgba(11,31,58,0.1) !important; }

  .juri-row:hover { background: rgba(14,165,233,0.06) !important; }

  @media (max-width: 768px) {
    .juri-main { margin-left: 0 !important; }
    .stats-grid { grid-template-columns: 1fr 1fr !important; }
  }
`;

// ─── COUNTER ───────────────────────────────────────────────
function Counter({ to }: { to: number }) {
    const [val, setVal] = useState(0);
    const [started, setStarted] = useState(false);
    const ref = useRef<HTMLSpanElement>(null);
    useEffect(() => {
        const el = ref.current; if (!el) return;
        const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setStarted(true); obs.disconnect(); } }, { threshold: 0.1 });
        obs.observe(el); return () => obs.disconnect();
    }, []);
    useEffect(() => {
        if (!started) return;
        let cur = 0; const step = Math.ceil(to / 55);
        const id = setInterval(() => { cur += step; if (cur >= to) { setVal(to); clearInterval(id); } else setVal(cur); }, 18);
        return () => clearInterval(id);
    }, [started, to]);
    return <span ref={ref}>{val.toLocaleString()}</span>;
}

// ─── SCORE CHIP ────────────────────────────────────────────
function ScoreChip({ value }: { value: number }) {
    const color = value >= 90 ? '#059669' : value >= 75 ? '#1565C0' : '#C4340E';
    return (
        <span style={{ background: `${color}14`, color, border: `1px solid ${color}30`, borderRadius: 8, padding: '4px 12px', fontSize: 12, fontWeight: 800, fontFamily: "'Montserrat', sans-serif" }}>{value}</span>
    );
}

// ─── MAIN DASHBOARD ────────────────────────────────────────
export default function JuriDashboard({ auth, total_dinilai, total_belum_dinilai, penilaian_terakhir }: Props) {
    const [ready, setReady] = useState(false);
    const [activeTab, setActiveTab] = useState<'overview' | 'penilaian'>('overview');
    const [scrolled, setScrolled] = useState(false);

    // ✅ FIX: Baca localStorage saat mount agar langsung sinkron
    const [sidebarCollapsed, setSidebarCollapsed] = useState(() =>
        typeof window !== 'undefined'
            ? localStorage.getItem('juri-sidebar-collapsed') === 'true'
            : false
    );

    useEffect(() => {
        const t = requestAnimationFrame(() => {
            requestAnimationFrame(() => setReady(true));
        });
        return () => cancelAnimationFrame(t);
    }, []);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 30);
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    // ✅ FIX: Filter berdasarkan storageKey agar tidak bentrok dengan sidebar lain
    useEffect(() => {
        const handler = (e: CustomEvent) => {
            if (e.detail?.storageKey === 'juri-sidebar-collapsed') {
                setSidebarCollapsed(e.detail?.collapsed ?? false);
            }
        };
        window.addEventListener('sidebarToggle', handler as EventListener);
        return () => window.removeEventListener('sidebarToggle', handler as EventListener);
    }, []);

    const safeDinilai = total_dinilai ?? 0;
    const safeBelumDinilai = total_belum_dinilai ?? 0;
    const safePenilaian = penilaian_terakhir ?? [];
    const totalDesain = safeDinilai + safeBelumDinilai;
    const progressPct = totalDesain > 0 ? Math.round((safeDinilai / totalDesain) * 100) : 0;
    const avgScore = safePenilaian.length > 0
        ? Math.round(safePenilaian.reduce((a, p) => a + Number(p.rata_rata), 0) / safePenilaian.length) : 0;

    const sidebarWidth = sidebarCollapsed ? 70 : 240;

    return (
        <>
            <style>{STYLES}</style>

            <div
                className={`juri-page min-h-screen flex${ready ? ' pd-ready' : ''}`}
                style={{ background: 'linear-gradient(150deg, #EFF8FF 0%, #DBEFFE 40%, #E0EFFE 100%)', position: 'relative' }}
            >
                {/* ── ORBS ── */}
                <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none', overflow: 'hidden' }}>
                    {[
                        { w: 600, h: 600, top: '-200px', left: '-160px', c: 'radial-gradient(circle, rgba(14,165,233,0.15) 0%, transparent 62%)', dur: '24s', delay: '0s' },
                        { w: 480, h: 480, bottom: '-100px', right: '-120px', c: 'radial-gradient(circle, rgba(14,165,233,0.1) 0%, transparent 62%)', dur: '28s', delay: '-8s' },
                        { w: 360, h: 360, top: '40%', left: '38%', c: 'radial-gradient(circle, rgba(255,255,255,0.42) 0%, transparent 62%)', dur: '20s', delay: '-4s' },
                    ].map((b, i) => (
                        <div key={i} style={{
                            position: 'absolute', width: b.w, height: b.h, borderRadius: '50%',
                            top: (b as any).top, left: (b as any).left, right: (b as any).right, bottom: (b as any).bottom,
                            background: b.c, animation: `orb-drift ${b.dur} ease-in-out infinite`, animationDelay: b.delay,
                        }} />
                    ))}
                    <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none', backgroundImage: 'radial-gradient(rgba(11,31,58,0.06) 1px, transparent 1px)', backgroundSize: '28px 28px' }} />
                </div>

                {/* ── SIDEBAR ── */}
                <JuriSidebar
                    user={auth.user}
                    activePage={activeTab === 'penilaian' ? 'penilaian' : 'overview'}
                    belumDinilai={safeBelumDinilai}
                />

                {/* ── MAIN CONTENT ── */}
                <main
                    className="juri-main flex-1 min-w-0 overflow-y-auto"
                    style={{
                        marginLeft: sidebarWidth,
                        minHeight: '100vh',
                        position: 'relative',
                        zIndex: 1,
                        transition: 'margin-left 0.35s cubic-bezier(0.22,1,0.36,1)',
                    }}
                >
                    {/* TOP BAR */}
                    <div className="anim-top delay-1" style={{
                        position: 'sticky', top: 0, zIndex: 50,
                        background: scrolled ? 'rgba(14,100,180,0.82)' : 'rgba(14,100,180,0.55)',
                        backdropFilter: 'blur(28px) saturate(180%)', WebkitBackdropFilter: 'blur(28px) saturate(180%)',
                        borderBottom: `1px solid ${scrolled ? 'rgba(255,255,255,0.22)' : 'rgba(255,255,255,0.1)'}`,
                        boxShadow: scrolled ? '0 8px 32px rgba(9,26,52,0.4)' : 'none',
                        padding: '0 clamp(20px,4vw,40px)', height: 62,
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        transition: 'all .35s ease',
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <div className="anim-pop delay-1" style={{
                                width: 34, height: 34, borderRadius: 10,
                                background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.25)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                            }}>
                                <IconLayoutDashboard size={17} color="rgba(186,230,253,0.9)" />
                            </div>
                            <h1 style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 800, fontSize: 'clamp(16px,2vw,20px)', color: '#fff' }}>
                                {activeTab === 'overview' ? 'Dashboard Juri' : 'Riwayat Penilaian'}
                            </h1>
                            <span style={{ background: 'rgba(255,255,255,0.15)', color: '#BAE6FD', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 8, padding: '3px 10px', fontSize: 10, fontWeight: 700, fontFamily: "'Montserrat', sans-serif", letterSpacing: '.12em' }}>2026</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            {safeBelumDinilai > 0 && (
                                <Link href="/juri/designs" style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(239,68,68,0.2)', border: '1px solid rgba(239,68,68,0.4)', borderRadius: 20, padding: '6px 14px', textDecoration: 'none' }}>
                                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#EF4444', animation: 'blink-dot 2s infinite', display: 'inline-block' }} />
                                    <span style={{ fontSize: 11, color: '#fff', fontWeight: 700, fontFamily: "'Montserrat', sans-serif" }}>{safeBelumDinilai} Belum Dinilai</span>
                                </Link>
                            )}
                            <div style={{ background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 20, padding: '6px 14px', display: 'flex', alignItems: 'center', gap: 6 }}>
                                <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#34D399', boxShadow: '0 0 6px rgba(52,211,153,0.8)', animation: 'blink-dot 2s infinite', display: 'inline-block' }} />
                                <span style={{ fontSize: 11, color: '#fff', fontWeight: 700, fontFamily: "'Montserrat', sans-serif" }}>{auth.user.name}</span>
                            </div>
                        </div>
                    </div>

                    {/* CONTENT */}
                    <div style={{ maxWidth: 960, margin: '0 auto', padding: 'clamp(24px,4vw,40px)' }}>

                        {activeTab === 'overview' && (
                            <>
                                {/* HEADER */}
                                <div className="anim-top delay-1" style={{ marginBottom: 32 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                                        <div className="anim-pop delay-1" style={{
                                            width: 48, height: 48, borderRadius: 16,
                                            background: 'linear-gradient(135deg, #0EA5E9, #1565C0)',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            boxShadow: '0 8px 24px rgba(14,165,233,0.35)',
                                        }}>
                                            <IconLayoutDashboard size={22} color="#fff" />
                                        </div>
                                        <div>
                                            <h2 style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 900, fontSize: 22, color: '#0B1F3A', lineHeight: 1.2 }}>
                                                Dashboard <span className="gradient-text-sky">Juri</span>
                                            </h2>
                                            <p style={{ fontSize: 13, color: '#6B8AAA', fontWeight: 500, marginTop: 2 }}>
                                                Selamat datang, <strong style={{ color: '#0B1F3A' }}>{auth.user.name}</strong> — Kompetisi Desain Layang-Layang 2026
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* STAT CARDS */}
                                <div className="stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, marginBottom: 28 }}>
                                    {[
                                        { icon: <IconCircleCheck size={26} />, label: 'Sudah Dinilai',  value: safeDinilai,       color: '#059669' },
                                        { icon: <IconClock size={26} />,       label: 'Belum Dinilai', value: safeBelumDinilai,  color: '#D97706' },
                                        { icon: <IconPhoto size={26} />,        label: 'Total Desain',  value: totalDesain,       color: '#1565C0' },
                                    ].map((s, i) => (
                                        <div key={i} className={`stat-card-hover anim-right stat-${i}`} style={{
                                            background: 'rgba(255,255,255,0.70)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
                                            border: '1.5px solid rgba(255,255,255,0.88)', borderRadius: 22,
                                            padding: 'clamp(18px,2.5vw,28px)', display: 'flex', alignItems: 'center', gap: 16,
                                            boxShadow: '0 4px 18px rgba(11,31,58,0.06)',
                                        }}>
                                            <div style={{ width: 54, height: 54, borderRadius: 16, flexShrink: 0, background: `${s.color}10`, border: `1.5px solid ${s.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: s.color }}>
                                                {s.icon}
                                            </div>
                                            <div>
                                                <p style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 800, fontSize: 'clamp(28px,4vw,36px)', color: s.color, lineHeight: 1 }}><Counter to={s.value} /></p>
                                                <p style={{ fontSize: 'clamp(10px,1.1vw,11.5px)', color: '#1A3A5C', marginTop: 5, fontWeight: 600, letterSpacing: '.07em', textTransform: 'uppercase', fontFamily: "'Montserrat', sans-serif" }}>{s.label}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* SUMMARY CARDS */}
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'clamp(12px,2vw,20px)', marginBottom: 28 }}>

                                    <div className="anim-left delay-2" style={{ background: 'rgba(255,255,255,0.72)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', border: '1.5px solid rgba(255,255,255,0.88)', borderRadius: 22, padding: '24px 28px', boxShadow: '0 6px 24px rgba(11,31,58,0.07)' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                                            <IconTrendingUp size={20} color="#0EA5E9" />
                                            <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase', color: '#0EA5E9', fontFamily: "'Montserrat', sans-serif" }}>Progress Penilaian</p>
                                        </div>
                                        <p style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 900, fontSize: 52, color: '#1565C0', lineHeight: 1 }}>{progressPct}%</p>
                                        <p style={{ fontSize: 12, color: '#1A3A5C', marginTop: 8 }}><strong>{safeDinilai}</strong> dari <strong>{totalDesain}</strong> desain selesai dinilai</p>
                                        <div style={{ marginTop: 16, background: 'rgba(14,165,233,0.12)', borderRadius: 8, height: 8, overflow: 'hidden' }}>
                                            <div style={{ width: `${progressPct}%`, height: '100%', background: 'linear-gradient(90deg, #0EA5E9, #1565C0)', borderRadius: 8, transition: 'width 1.2s ease' }} />
                                        </div>
                                    </div>

                                    {safePenilaian.length > 0 && (
                                        <div className="anim-right delay-2" style={{ background: 'rgba(255,255,255,0.72)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', border: '1.5px solid rgba(255,87,51,0.22)', borderRadius: 22, padding: '24px 28px', boxShadow: '0 6px 24px rgba(11,31,58,0.07)', position: 'relative', overflow: 'hidden' }}>
                                            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: 'linear-gradient(90deg, #FF5733, #F59E0B)', borderRadius: '22px 22px 0 0' }} />
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                                                <IconStar size={20} color="#C4340E" />
                                                <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase', color: '#C4340E', fontFamily: "'Montserrat', sans-serif" }}>Rata-rata Nilai Kamu</p>
                                            </div>
                                            <div style={{ display: 'inline-block', background: 'linear-gradient(135deg, #FF5733, #D93620)', color: '#fff', borderRadius: 12, padding: '8px 22px', fontFamily: "'Montserrat', sans-serif", fontWeight: 900, fontSize: 36, boxShadow: '0 6px 20px rgba(255,87,51,0.4)' }}>
                                                {avgScore} pts
                                            </div>
                                            <p style={{ fontSize: 12, color: '#1A3A5C', marginTop: 12 }}>dari <strong>{safePenilaian.length}</strong> penilaian terakhir</p>
                                        </div>
                                    )}

                                    <div className="anim-bottom delay-3" style={{ background: 'rgba(255,255,255,0.72)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', border: '1.5px solid rgba(217,119,6,0.22)', borderRadius: 22, padding: '24px 28px', boxShadow: '0 6px 24px rgba(11,31,58,0.07)' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                                            <IconAlertCircle size={20} color="#D97706" />
                                            <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase', color: '#D97706', fontFamily: "'Montserrat', sans-serif" }}>Menunggu Penilaian</p>
                                        </div>
                                        <p style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 900, fontSize: 52, color: '#D97706', lineHeight: 1 }}>{safeBelumDinilai}</p>
                                        <p style={{ fontSize: 12, color: '#1A3A5C', marginTop: 8, marginBottom: 16 }}>desain menunggu penilaian kamu</p>
                                        <Link href="/juri/designs" style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '9px 22px', borderRadius: 999, background: 'linear-gradient(135deg, #1565C0, #0EA5E9)', color: '#fff', textDecoration: 'none', fontFamily: "'Montserrat', sans-serif", fontWeight: 700, fontSize: 12, letterSpacing: '.06em', boxShadow: '0 4px 14px rgba(14,165,233,0.35)' }}>
                                            <IconStar size={14} /> Mulai Menilai
                                        </Link>
                                    </div>
                                </div>

                                {/* CTA FULL */}
                                <div className="anim-bottom delay-4">
                                    <Link href="/juri/designs" style={{ marginBottom: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 9, width: '100%', textAlign: 'center', background: 'linear-gradient(135deg, #1565C0, #0EA5E9)', color: '#fff', padding: '18px 28px', borderRadius: 999, fontWeight: 800, fontSize: 15, fontFamily: "'Montserrat', sans-serif", letterSpacing: '.06em', textDecoration: 'none', boxShadow: '0 8px 24px rgba(14,165,233,0.38)' }}>
                                        <IconPalette size={18} /> Mulai Menilai Desain <IconChevronRight size={18} />
                                    </Link>
                                </div>

                                {/* RECENT ASSESSMENTS */}
                                {safePenilaian.length > 0 && (
                                    <div className="anim-bottom delay-5" style={{ background: 'rgba(255,255,255,0.72)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', border: '1.5px solid rgba(255,255,255,0.88)', borderRadius: 22, padding: '28px', boxShadow: '0 6px 24px rgba(11,31,58,0.07)', marginTop: 28 }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                                            <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.15em', textTransform: 'uppercase', color: '#1565C0', fontFamily: "'Montserrat', sans-serif" }}>— PENILAIAN TERAKHIR —</p>
                                            <button onClick={() => setActiveTab('penilaian')} style={{ fontSize: 12, fontWeight: 700, color: '#0EA5E9', fontFamily: "'Montserrat', sans-serif", padding: '7px 16px', borderRadius: 999, border: '1.5px solid rgba(14,165,233,0.28)', background: 'rgba(14,165,233,0.07)', letterSpacing: '.06em', cursor: 'pointer' }}>
                                                Semua →
                                            </button>
                                        </div>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                                            {safePenilaian.slice(0, 4).map(p => (
                                                <div key={p.id} className="score-row" style={{ display: 'flex', alignItems: 'center', gap: 12, justifyContent: 'space-between', padding: '14px 18px', borderRadius: 14, border: '1.5px solid rgba(14,165,233,0.12)', background: 'rgba(255,255,255,0.5)' }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                                        {p.design?.file_path
                                                            ? <img src={`/storage/${p.design.file_path}`} alt={p.design.judul} style={{ width: 40, height: 40, borderRadius: 10, objectFit: 'cover', border: '1.5px solid rgba(14,165,233,0.18)', flexShrink: 0 }} />
                                                            : <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(14,165,233,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><IconPhoto size={18} color="#0EA5E9" /></div>
                                                        }
                                                        <div>
                                                            <p style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 700, fontSize: 13, color: '#0B1F3A' }}>{p.design?.judul ?? '-'}</p>
                                                            <p style={{ fontSize: 11, color: '#4A6A8A', marginTop: 2 }}>{p.design?.user?.name ?? '-'}</p>
                                                        </div>
                                                    </div>
                                                    <ScoreChip value={p.rata_rata} />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </>
                        )}

                        {activeTab === 'penilaian' && (
                            <div>
                                <div className="anim-top delay-1" style={{ marginBottom: 24 }}>
                                    <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.18em', textTransform: 'uppercase', color: '#0EA5E9', marginBottom: 8, fontFamily: "'Montserrat', sans-serif" }}>— RIWAYAT —</p>
                                    <h2 style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 800, fontSize: 'clamp(22px,3vw,32px)', color: '#08182E', marginBottom: 4 }}>
                                        Penilaian <span className="gradient-text-sky">Kamu</span>
                                    </h2>
                                </div>

                                {safePenilaian.some(p => p.design?.file_path) && (
                                    <div className="anim-left delay-2" style={{ background: 'rgba(255,255,255,0.72)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', border: '1.5px solid rgba(255,255,255,0.88)', borderRadius: 22, padding: '28px', boxShadow: '0 6px 24px rgba(11,31,58,0.07)', marginBottom: 24 }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                                            <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.15em', textTransform: 'uppercase', color: '#1565C0', fontFamily: "'Montserrat', sans-serif" }}>— PREVIEW DESAIN DINILAI —</p>
                                            <Link href="/juri/designs" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 700, color: '#0EA5E9', fontFamily: "'Montserrat', sans-serif", padding: '7px 16px', borderRadius: 999, border: '1.5px solid rgba(14,165,233,0.28)', background: 'rgba(14,165,233,0.07)', letterSpacing: '.06em' }}>
                                                Nilai Lagi <IconChevronRight size={14} />
                                            </Link>
                                        </div>
                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: 12 }}>
                                            {safePenilaian.filter(p => p.design?.file_path).map(p => (
                                                <div key={p.id} style={{ borderRadius: 14, overflow: 'hidden', border: '1.5px solid rgba(14,165,233,0.14)', position: 'relative' }}>
                                                    <img src={`/storage/${p.design!.file_path}`} alt={p.design!.judul} style={{ width: '100%', aspectRatio: '1', objectFit: 'cover', display: 'block' }} />
                                                    <div style={{ padding: '8px 10px', background: 'rgba(8,24,46,0.75)', backdropFilter: 'blur(8px)' }}>
                                                        <p style={{ fontSize: 11, fontWeight: 700, color: '#fff', fontFamily: "'Montserrat', sans-serif", overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.design!.judul}</p>
                                                        <p style={{ fontSize: 10, color: '#BAE6FD' }}>{p.design!.user?.name ?? '-'}</p>
                                                    </div>
                                                    <div style={{ position: 'absolute', top: 8, right: 8, background: p.rata_rata >= 90 ? 'rgba(5,150,105,0.92)' : p.rata_rata >= 75 ? 'rgba(21,101,192,0.92)' : 'rgba(196,52,14,0.92)', color: '#fff', borderRadius: 6, padding: '2px 8px', fontSize: 10, fontWeight: 800, fontFamily: "'Montserrat', sans-serif" }}>
                                                        {p.rata_rata}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                <div className="anim-bottom delay-3" style={{ background: 'rgba(255,255,255,0.74)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', border: '1.5px solid rgba(255,255,255,0.88)', borderRadius: 22, overflow: 'hidden', boxShadow: '0 6px 24px rgba(11,31,58,0.07)' }}>
                                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                        <thead>
                                            <tr style={{ background: 'rgba(8,28,58,0.06)', borderBottom: '1.5px solid rgba(14,165,233,0.15)' }}>
                                                {['#', 'Desain', 'Peserta', 'Nilai'].map(h => (
                                                    <th key={h} style={{ padding: '14px 16px', textAlign: 'left', fontSize: 10, fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase', color: '#0B3A6A', fontFamily: "'Montserrat', sans-serif" }}>{h}</th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {safePenilaian.length === 0 ? (
                                                <tr>
                                                    <td colSpan={4} style={{ padding: '48px', textAlign: 'center' }}>
                                                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
                                                            <IconPhoto size={40} color="#94A3B8" />
                                                            <p style={{ color: '#4A6A8A' }}>Belum ada penilaian yang diberikan.</p>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ) : safePenilaian.map((p, i) => (
                                                <tr key={p.id} className="juri-row" style={{ borderBottom: '1px solid rgba(14,165,233,0.08)', transition: 'background .2s ease' }}>
                                                    <td style={{ padding: '14px 16px', fontSize: 13, color: '#4A6A8A', fontFamily: "'Montserrat', sans-serif", fontWeight: 700 }}>
                                                        {String(i + 1).padStart(2, '0')}
                                                    </td>
                                                    <td style={{ padding: '14px 16px' }}>
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                                            {p.design?.file_path
                                                                ? <img src={`/storage/${p.design.file_path}`} alt={p.design.judul} style={{ width: 40, height: 40, borderRadius: 10, objectFit: 'cover', border: '1.5px solid rgba(14,165,233,0.18)', flexShrink: 0 }} />
                                                                : <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(14,165,233,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><IconPhoto size={18} color="#0EA5E9" /></div>
                                                            }
                                                            <span style={{ fontWeight: 700, color: '#0B1F3A', fontFamily: "'Montserrat', sans-serif", fontSize: 13, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 140 }}>{p.design?.judul ?? '-'}</span>
                                                        </div>
                                                    </td>
                                                    <td style={{ padding: '14px 16px', color: '#1A3A5C', fontSize: 13 }}>{p.design?.user?.name ?? '-'}</td>
                                                    <td style={{ padding: '14px 16px' }}>
                                                        <ScoreChip value={p.rata_rata} />
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                <div className="anim-bottom delay-4" style={{ marginTop: 24 }}>
                                    <Link href="/juri/designs" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 9, width: '100%', textAlign: 'center', background: 'linear-gradient(135deg, #1565C0, #0EA5E9)', color: '#fff', padding: '16px 28px', borderRadius: 999, fontWeight: 800, fontSize: 15, fontFamily: "'Montserrat', sans-serif", letterSpacing: '.06em', textDecoration: 'none', boxShadow: '0 8px 24px rgba(14,165,233,0.38)' }}>
                                        <IconStar size={18} /> Nilai Lebih Banyak Desain <IconChevronRight size={18} />
                                    </Link>
                                </div>
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </>
    );
}