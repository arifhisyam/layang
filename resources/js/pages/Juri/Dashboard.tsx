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
    IconMenu2,
    IconX,
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
  @keyframes slideInFromLeft {
    from { opacity: 0; transform: translateX(-100%); }
    to   { opacity: 1; transform: translateX(0); }
  }
  @keyframes fadeIn {
    from { opacity: 0; }
    to   { opacity: 1; }
  }

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
    padding: clamp(14px,2.5vw,28px);
    display: flex;
    align-items: center;
    gap: 12px;
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

  /* Mobile overlay */
  .mobile-overlay {
    position: fixed;
    inset: 0;
    z-index: 49;
    background: rgba(8,18,40,0.55);
    backdrop-filter: blur(4px);
    -webkit-backdrop-filter: blur(4px);
    animation: fadeIn 0.2s ease both;
  }

  /* Sidebar wrapper mobile */
  .sidebar-wrapper {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    z-index: 50;
  }

  /* Desktop table */
  .desktop-table { display: table; width: 100%; border-collapse: collapse; }
  .mobile-list { display: none; }

  /* ── RESPONSIVE ── */
  @media (max-width: 768px) {
    .juri-main { margin-left: 0 !important; }
    .stats-grid { grid-template-columns: 1fr 1fr !important; gap: 10px !important; }
    .summary-grid { grid-template-columns: 1fr !important; }
    .stat-icon-box { width: 44px !important; height: 44px !important; border-radius: 14px !important; }
    .stat-icon-box svg { width: 20px !important; height: 20px !important; }
    .stat-value { font-size: clamp(22px, 6vw, 32px) !important; }
    .topbar-name { display: none !important; }
    .topbar-badge { padding: 5px 10px !important; font-size: 10px !important; }
    .page-content { padding: 16px !important; }
    .header-title { font-size: 18px !important; }
    .header-icon { width: 40px !important; height: 40px !important; border-radius: 14px !important; }
    .cta-btn { font-size: 13px !important; padding: 15px 20px !important; }
    .section-card { padding: 18px 16px !important; border-radius: 18px !important; }
    .score-row-inner { gap: 8px !important; }
    .score-row-img { width: 34px !important; height: 34px !important; border-radius: 8px !important; }
    .score-title { font-size: 12px !important; }
    .score-sub { font-size: 10px !important; }
    .topbar-height { height: 54px !important; }
    .topbar-logo-text { font-size: 15px !important; }
    .progress-big { font-size: 42px !important; }
  }

  @media (max-width: 600px) {
    .desktop-table { display: none !important; }
    .mobile-list { display: block !important; }
  }

  @media (max-width: 480px) {
    .stats-grid { grid-template-columns: 1fr !important; }
    .avg-big { font-size: 28px !important; }
  }
`;

// ─── COUNTER ───────────────────────────────────────────────
function Counter({ to }: { to: number }) {
    const [val, setVal] = useState(0);
    const [started, setStarted] = useState(false);
    const ref = useRef<HTMLSpanElement>(null);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const obs = new IntersectionObserver(
            ([e]) => { if (e.isIntersecting) { setStarted(true); obs.disconnect(); } },
            { threshold: 0.1 }
        );
        obs.observe(el);
        return () => obs.disconnect();
    }, []);

    useEffect(() => {
        if (!started) return;
        let cur = 0;
        const step = Math.max(1, Math.ceil(to / 55));
        const id = setInterval(() => {
            cur += step;
            if (cur >= to) { setVal(to); clearInterval(id); }
            else setVal(cur);
        }, 18);
        return () => clearInterval(id);
    }, [started, to]);

    return <span ref={ref}>{val.toLocaleString()}</span>;
}

// ─── SCORE CHIP ────────────────────────────────────────────
function ScoreChip({ value }: { value: number }) {
    const color = value >= 90 ? '#059669' : value >= 75 ? '#1565C0' : '#C4340E';
    return (
        <span style={{
            background: `${color}14`, color, border: `1px solid ${color}30`,
            borderRadius: 8, padding: '4px 12px', fontSize: 12,
            fontWeight: 800, fontFamily: "'Montserrat', sans-serif", flexShrink: 0,
        }}>
            {value}
        </span>
    );
}

// ─── MAIN DASHBOARD ────────────────────────────────────────
export default function JuriDashboard({ auth, total_dinilai, total_belum_dinilai, penilaian_terakhir }: Props) {
    const [ready, setReady] = useState(false);
    const [activeTab, setActiveTab] = useState<'overview' | 'penilaian'>('overview');
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    // FIX: SSR-safe localStorage — baca hanya di client setelah mount
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

    // FIX: Baca localStorage setelah hydration selesai (client only)
    useEffect(() => {
        try {
            const stored = localStorage.getItem('juri-sidebar-collapsed');
            if (stored !== null) setSidebarCollapsed(stored === 'true');
        } catch (_) {
            // localStorage unavailable (SSR / private mode)
        }
    }, []);

    // Detect mobile
    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth <= 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Trigger animations after mount
    useEffect(() => {
        const t = requestAnimationFrame(() => {
            requestAnimationFrame(() => setReady(true));
        });
        return () => cancelAnimationFrame(t);
    }, []);

    // Topbar scroll effect
    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 30);
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    // Listen sidebar toggle events from JuriSidebar
    useEffect(() => {
        const handler = (e: Event) => {
            const detail = (e as CustomEvent).detail;
            if (detail?.storageKey === 'juri-sidebar-collapsed') {
                setSidebarCollapsed(detail?.collapsed ?? false);
            }
        };
        window.addEventListener('sidebarToggle', handler);
        return () => window.removeEventListener('sidebarToggle', handler);
    }, []);

    // Close mobile menu on resize to desktop
    useEffect(() => {
        if (!isMobile) setMobileMenuOpen(false);
    }, [isMobile]);

    // Close mobile menu on body scroll lock
    useEffect(() => {
        if (isMobile && mobileMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => { document.body.style.overflow = ''; };
    }, [isMobile, mobileMenuOpen]);

    const safeDinilai       = total_dinilai       ?? 0;
    const safeBelumDinilai  = total_belum_dinilai ?? 0;
    const safePenilaian     = penilaian_terakhir  ?? [];
    const totalDesain       = safeDinilai + safeBelumDinilai;
    const progressPct       = totalDesain > 0 ? Math.round((safeDinilai / totalDesain) * 100) : 0;
    const avgScore          = safePenilaian.length > 0
        ? Math.round(safePenilaian.reduce((a, p) => a + Number(p.rata_rata), 0) / safePenilaian.length)
        : 0;

    // Sidebar width: mobile = 0 (sidebar di-overlay), desktop = collapsed/expanded
    const sidebarWidth = isMobile ? 0 : (sidebarCollapsed ? 70 : 240);

    return (
        <>
            <style>{STYLES}</style>

            <div
                className={`juri-page${ready ? ' pd-ready' : ''}`}
                style={{
                    minHeight: '100vh',
                    display: 'flex',
                    background: 'linear-gradient(150deg, #EFF8FF 0%, #DBEFFE 40%, #E0EFFE 100%)',
                    position: 'relative',
                }}
            >
                {/* ── BACKGROUND ORBS ── */}
                <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none', overflow: 'hidden' }}>
                    {[
                        { w: 600, h: 600, top: '-200px', left: '-160px',  c: 'radial-gradient(circle, rgba(14,165,233,0.15) 0%, transparent 62%)', dur: '24s', delay: '0s' },
                        { w: 480, h: 480, bottom: '-100px', right: '-120px', c: 'radial-gradient(circle, rgba(14,165,233,0.1) 0%, transparent 62%)',  dur: '28s', delay: '-8s' },
                        { w: 360, h: 360, top: '40%', left: '38%',         c: 'radial-gradient(circle, rgba(255,255,255,0.42) 0%, transparent 62%)', dur: '20s', delay: '-4s' },
                    ].map((b, i) => (
                        <div key={i} style={{
                            position: 'absolute', width: b.w, height: b.h, borderRadius: '50%',
                            top: (b as any).top, left: (b as any).left, right: (b as any).right, bottom: (b as any).bottom,
                            background: b.c, animation: `orb-drift ${b.dur} ease-in-out infinite`, animationDelay: b.delay,
                        }} />
                    ))}
                    <div style={{
                        position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none',
                        backgroundImage: 'radial-gradient(rgba(11,31,58,0.06) 1px, transparent 1px)',
                        backgroundSize: '28px 28px',
                    }} />
                </div>

                {/* ── MOBILE OVERLAY (tap to close sidebar) ── */}
                {isMobile && mobileMenuOpen && (
                    <div
                        className="mobile-overlay"
                        onClick={() => setMobileMenuOpen(false)}
                    />
                )}

                {/* ── SIDEBAR ── */}
                {/*
                    Mobile : position fixed, geser masuk/keluar lewat CSS left
                    Desktop: position normal (in-flow), width via sidebarWidth
                */}
                {isMobile ? (
                    <div
                        className="sidebar-wrapper"
                        style={{
                            left: mobileMenuOpen ? 0 : -280,
                            transition: 'left 0.3s cubic-bezier(0.22,1,0.36,1)',
                            width: 260,
                        }}
                    >
                        <JuriSidebar
                            user={auth.user}
                            activePage={activeTab === 'penilaian' ? 'penilaian' : 'overview'}
                            belumDinilai={safeBelumDinilai}
                        />
                    </div>
                ) : (
                    <div style={{
                        position: 'fixed', top: 0, left: 0, bottom: 0, zIndex: 40,
                        width: sidebarWidth,
                        transition: 'width 0.35s cubic-bezier(0.22,1,0.36,1)',
                        overflow: 'hidden',
                    }}>
                        <JuriSidebar
                            user={auth.user}
                            activePage={activeTab === 'penilaian' ? 'penilaian' : 'overview'}
                            belumDinilai={safeBelumDinilai}
                        />
                    </div>
                )}

                {/* ── MAIN CONTENT ── */}
                <main
                    className="juri-main flex-1 min-w-0"
                    style={{
                        marginLeft: sidebarWidth,
                        minHeight: '100vh',
                        overflowY: 'auto',
                        position: 'relative',
                        zIndex: 1,
                        transition: 'margin-left 0.35s cubic-bezier(0.22,1,0.36,1)',
                        // Penting: pastikan konten tidak hilang saat mobile
                        width: isMobile ? '100%' : undefined,
                    }}
                >
                    {/* ── TOP BAR ── */}
                    <div
                        className="anim-top delay-1 topbar-height"
                        style={{
                            position: 'sticky', top: 0, zIndex: 48,
                            background: scrolled ? 'rgba(14,100,180,0.92)' : 'rgba(14,100,180,0.70)',
                            backdropFilter: 'blur(28px) saturate(180%)',
                            WebkitBackdropFilter: 'blur(28px) saturate(180%)',
                            borderBottom: `1px solid ${scrolled ? 'rgba(255,255,255,0.22)' : 'rgba(255,255,255,0.1)'}`,
                            boxShadow: scrolled ? '0 8px 32px rgba(9,26,52,0.4)' : 'none',
                            padding: '0 clamp(14px,4vw,40px)',
                            height: 62,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            transition: 'all .35s ease',
                            gap: 8,
                        }}
                    >
                        {/* Kiri: hamburger + logo */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
                            {/* Hamburger — tampil hanya di mobile */}
                            {isMobile && (
                                <button
                                    onClick={() => setMobileMenuOpen(v => !v)}
                                    aria-label="Toggle menu"
                                    style={{
                                        background: 'rgba(255,255,255,0.15)',
                                        border: '1px solid rgba(255,255,255,0.25)',
                                        borderRadius: 10,
                                        width: 36, height: 36,
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        cursor: 'pointer', flexShrink: 0,
                                    }}
                                >
                                    {mobileMenuOpen
                                        ? <IconX size={18} color="#fff" />
                                        : <IconMenu2 size={18} color="#fff" />}
                                </button>
                            )}

                            {/* Icon */}
                            <div
                                className="anim-pop delay-1"
                                style={{
                                    width: 34, height: 34, borderRadius: 10, flexShrink: 0,
                                    background: 'rgba(255,255,255,0.15)',
                                    border: '1px solid rgba(255,255,255,0.25)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                }}
                            >
                                <IconLayoutDashboard size={17} color="rgba(186,230,253,0.9)" />
                            </div>

                            {/* Title */}
                            <h1
                                className="topbar-logo-text"
                                style={{
                                    fontFamily: "'Montserrat', sans-serif",
                                    fontWeight: 800,
                                    fontSize: 'clamp(13px,2vw,20px)',
                                    color: '#fff',
                                    whiteSpace: 'nowrap',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                }}
                            >
                                {activeTab === 'overview' ? 'Dashboard Juri' : 'Riwayat Penilaian'}
                            </h1>

                            <span style={{
                                background: 'rgba(255,255,255,0.15)',
                                color: '#BAE6FD',
                                border: '1px solid rgba(255,255,255,0.2)',
                                borderRadius: 8,
                                padding: '3px 8px',
                                fontSize: 10,
                                fontWeight: 700,
                                fontFamily: "'Montserrat', sans-serif",
                                letterSpacing: '.12em',
                                flexShrink: 0,
                            }}>
                                2026
                            </span>
                        </div>

                        {/* Kanan: badge + nama */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
                            {safeBelumDinilai > 0 && (
                                <Link
                                    href="/juri/designs"
                                    className="topbar-badge"
                                    style={{
                                        display: 'flex', alignItems: 'center', gap: 5,
                                        background: 'rgba(239,68,68,0.2)',
                                        border: '1px solid rgba(239,68,68,0.4)',
                                        borderRadius: 20, padding: '6px 12px', textDecoration: 'none',
                                    }}
                                >
                                    <span style={{
                                        width: 6, height: 6, borderRadius: '50%',
                                        background: '#EF4444',
                                        animation: 'blink-dot 2s infinite',
                                        display: 'inline-block', flexShrink: 0,
                                    }} />
                                    <span style={{
                                        fontSize: 11, color: '#fff',
                                        fontWeight: 700, fontFamily: "'Montserrat', sans-serif",
                                        whiteSpace: 'nowrap',
                                    }}>
                                        {safeBelumDinilai} Belum
                                    </span>
                                </Link>
                            )}

                            {/* Nama user — disembunyikan di mobile via CSS */}
                            <div
                                className="topbar-name"
                                style={{
                                    background: 'rgba(255,255,255,0.12)',
                                    border: '1px solid rgba(255,255,255,0.2)',
                                    borderRadius: 20, padding: '6px 14px',
                                    display: 'flex', alignItems: 'center', gap: 6,
                                }}
                            >
                                <span style={{
                                    width: 6, height: 6, borderRadius: '50%',
                                    background: '#34D399',
                                    boxShadow: '0 0 6px rgba(52,211,153,0.8)',
                                    animation: 'blink-dot 2s infinite',
                                    display: 'inline-block',
                                }} />
                                <span style={{
                                    fontSize: 11, color: '#fff',
                                    fontWeight: 700, fontFamily: "'Montserrat', sans-serif",
                                }}>
                                    {auth.user.name}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* ── PAGE CONTENT ── */}
                    <div
                        className="page-content"
                        style={{ maxWidth: 960, margin: '0 auto', padding: 'clamp(16px,4vw,40px)' }}
                    >

                        {/* ══════════════════ OVERVIEW TAB ══════════════════ */}
                        {activeTab === 'overview' && (
                            <>
                                {/* HEADER */}
                                <div className="anim-top delay-1" style={{ marginBottom: 24 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                                        <div
                                            className="header-icon anim-pop delay-1"
                                            style={{
                                                width: 48, height: 48, borderRadius: 16, flexShrink: 0,
                                                background: 'linear-gradient(135deg, #0EA5E9, #1565C0)',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                boxShadow: '0 8px 24px rgba(14,165,233,0.35)',
                                            }}
                                        >
                                            <IconLayoutDashboard size={22} color="#fff" />
                                        </div>
                                        <div>
                                            <h2
                                                className="header-title"
                                                style={{
                                                    fontFamily: "'Montserrat', sans-serif",
                                                    fontWeight: 900, fontSize: 22,
                                                    color: '#0B1F3A', lineHeight: 1.2,
                                                }}
                                            >
                                                Dashboard <span className="gradient-text-sky">Juri</span>
                                            </h2>
                                            <p style={{ fontSize: 12, color: '#6B8AAA', fontWeight: 500, marginTop: 2 }}>
                                                Selamat datang, <strong style={{ color: '#0B1F3A' }}>{auth.user.name}</strong>
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* STAT CARDS */}
                                <div
                                    className="stats-grid"
                                    style={{
                                        display: 'grid',
                                        gridTemplateColumns: 'repeat(3, 1fr)',
                                        gap: 12,
                                        marginBottom: 20,
                                    }}
                                >
                                    {[
                                        { icon: <IconCircleCheck size={24} />, label: 'Sudah Dinilai',  value: safeDinilai,      color: '#059669' },
                                        { icon: <IconClock size={24} />,       label: 'Belum Dinilai', value: safeBelumDinilai, color: '#D97706' },
                                        { icon: <IconPhoto size={24} />,       label: 'Total Desain',  value: totalDesain,      color: '#1565C0' },
                                    ].map((s, i) => (
                                        <div key={i} className={`stat-card-hover anim-right stat-${i}`}>
                                            <div
                                                className="stat-icon-box"
                                                style={{
                                                    width: 50, height: 50, borderRadius: 15, flexShrink: 0,
                                                    background: `${s.color}10`,
                                                    border: `1.5px solid ${s.color}18`,
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                    color: s.color,
                                                }}
                                            >
                                                {s.icon}
                                            </div>
                                            <div style={{ minWidth: 0 }}>
                                                <p
                                                    className="stat-value"
                                                    style={{
                                                        fontFamily: "'Montserrat', sans-serif",
                                                        fontWeight: 800,
                                                        fontSize: 'clamp(24px,4vw,36px)',
                                                        color: s.color, lineHeight: 1,
                                                    }}
                                                >
                                                    <Counter to={s.value} />
                                                </p>
                                                <p style={{
                                                    fontSize: 'clamp(9px,1.1vw,11px)',
                                                    color: '#1A3A5C', marginTop: 4,
                                                    fontWeight: 600, letterSpacing: '.06em',
                                                    textTransform: 'uppercase',
                                                    fontFamily: "'Montserrat', sans-serif",
                                                }}>
                                                    {s.label}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* SUMMARY CARDS */}
                                <div
                                    className="summary-grid"
                                    style={{
                                        display: 'grid',
                                        gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                                        gap: 'clamp(10px,2vw,18px)',
                                        marginBottom: 20,
                                    }}
                                >
                                    {/* Progress */}
                                    <div
                                        className="section-card anim-left delay-2"
                                        style={{
                                            background: 'rgba(255,255,255,0.72)',
                                            backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
                                            border: '1.5px solid rgba(255,255,255,0.88)',
                                            borderRadius: 22, padding: '22px 24px',
                                            boxShadow: '0 6px 24px rgba(11,31,58,0.07)',
                                        }}
                                    >
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                                            <IconTrendingUp size={18} color="#0EA5E9" />
                                            <p style={{
                                                fontSize: 10, fontWeight: 700, letterSpacing: '.12em',
                                                textTransform: 'uppercase', color: '#0EA5E9',
                                                fontFamily: "'Montserrat', sans-serif",
                                            }}>
                                                Progress Penilaian
                                            </p>
                                        </div>
                                        <p
                                            className="progress-big"
                                            style={{
                                                fontFamily: "'Montserrat', sans-serif",
                                                fontWeight: 900, fontSize: 52,
                                                color: '#1565C0', lineHeight: 1,
                                            }}
                                        >
                                            {progressPct}%
                                        </p>
                                        <p style={{ fontSize: 12, color: '#1A3A5C', marginTop: 8 }}>
                                            <strong>{safeDinilai}</strong> dari <strong>{totalDesain}</strong> desain selesai
                                        </p>
                                        <div style={{
                                            marginTop: 14, background: 'rgba(14,165,233,0.12)',
                                            borderRadius: 8, height: 8, overflow: 'hidden',
                                        }}>
                                            <div style={{
                                                width: `${progressPct}%`, height: '100%',
                                                background: 'linear-gradient(90deg, #0EA5E9, #1565C0)',
                                                borderRadius: 8, transition: 'width 1.2s ease',
                                            }} />
                                        </div>
                                    </div>

                                    {/* Rata-rata */}
                                    {safePenilaian.length > 0 && (
                                        <div
                                            className="section-card anim-right delay-2"
                                            style={{
                                                background: 'rgba(255,255,255,0.72)',
                                                backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
                                                border: '1.5px solid rgba(255,87,51,0.22)',
                                                borderRadius: 22, padding: '22px 24px',
                                                boxShadow: '0 6px 24px rgba(11,31,58,0.07)',
                                                position: 'relative', overflow: 'hidden',
                                            }}
                                        >
                                            <div style={{
                                                position: 'absolute', top: 0, left: 0, right: 0, height: 3,
                                                background: 'linear-gradient(90deg, #FF5733, #F59E0B)',
                                                borderRadius: '22px 22px 0 0',
                                            }} />
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                                                <IconStar size={18} color="#C4340E" />
                                                <p style={{
                                                    fontSize: 10, fontWeight: 700, letterSpacing: '.12em',
                                                    textTransform: 'uppercase', color: '#C4340E',
                                                    fontFamily: "'Montserrat', sans-serif",
                                                }}>
                                                    Rata-rata Nilai
                                                </p>
                                            </div>
                                            <div
                                                className="avg-big"
                                                style={{
                                                    display: 'inline-block',
                                                    background: 'linear-gradient(135deg, #FF5733, #D93620)',
                                                    color: '#fff', borderRadius: 12, padding: '8px 22px',
                                                    fontFamily: "'Montserrat', sans-serif",
                                                    fontWeight: 900, fontSize: 36,
                                                    boxShadow: '0 6px 20px rgba(255,87,51,0.4)',
                                                }}
                                            >
                                                {avgScore} pts
                                            </div>
                                            <p style={{ fontSize: 12, color: '#1A3A5C', marginTop: 12 }}>
                                                dari <strong>{safePenilaian.length}</strong> penilaian
                                            </p>
                                        </div>
                                    )}

                                    {/* Menunggu */}
                                    <div
                                        className="section-card anim-bottom delay-3"
                                        style={{
                                            background: 'rgba(255,255,255,0.72)',
                                            backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
                                            border: '1.5px solid rgba(217,119,6,0.22)',
                                            borderRadius: 22, padding: '22px 24px',
                                            boxShadow: '0 6px 24px rgba(11,31,58,0.07)',
                                        }}
                                    >
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                                            <IconAlertCircle size={18} color="#D97706" />
                                            <p style={{
                                                fontSize: 10, fontWeight: 700, letterSpacing: '.12em',
                                                textTransform: 'uppercase', color: '#D97706',
                                                fontFamily: "'Montserrat', sans-serif",
                                            }}>
                                                Menunggu
                                            </p>
                                        </div>
                                        <p style={{
                                            fontFamily: "'Montserrat', sans-serif",
                                            fontWeight: 900, fontSize: 52, color: '#D97706', lineHeight: 1,
                                        }}>
                                            {safeBelumDinilai}
                                        </p>
                                        <p style={{ fontSize: 12, color: '#1A3A5C', marginTop: 8, marginBottom: 14 }}>
                                            desain menunggu penilaian
                                        </p>
                                        <Link
                                            href="/juri/designs"
                                            style={{
                                                display: 'inline-flex', alignItems: 'center', gap: 7,
                                                padding: '9px 20px', borderRadius: 999,
                                                background: 'linear-gradient(135deg, #1565C0, #0EA5E9)',
                                                color: '#fff', textDecoration: 'none',
                                                fontFamily: "'Montserrat', sans-serif",
                                                fontWeight: 700, fontSize: 12, letterSpacing: '.06em',
                                                boxShadow: '0 4px 14px rgba(14,165,233,0.35)',
                                            }}
                                        >
                                            <IconStar size={14} /> Mulai Menilai
                                        </Link>
                                    </div>
                                </div>

                                {/* CTA BUTTON */}
                                <div className="anim-bottom delay-4">
                                    <Link
                                        href="/juri/designs"
                                        className="cta-btn"
                                        style={{
                                            marginBottom: 24,
                                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 9,
                                            width: '100%', textAlign: 'center',
                                            background: 'linear-gradient(135deg, #1565C0, #0EA5E9)',
                                            color: '#fff', padding: '16px 28px', borderRadius: 999,
                                            fontWeight: 800, fontSize: 15,
                                            fontFamily: "'Montserrat', sans-serif",
                                            letterSpacing: '.06em', textDecoration: 'none',
                                            boxShadow: '0 8px 24px rgba(14,165,233,0.38)',
                                        }}
                                    >
                                        <IconPalette size={18} /> Mulai Menilai Desain <IconChevronRight size={18} />
                                    </Link>
                                </div>

                                {/* RECENT ASSESSMENTS */}
                                {safePenilaian.length > 0 && (
                                    <div
                                        className="section-card anim-bottom delay-5"
                                        style={{
                                            background: 'rgba(255,255,255,0.72)',
                                            backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
                                            border: '1.5px solid rgba(255,255,255,0.88)',
                                            borderRadius: 22, padding: '22px 20px',
                                            boxShadow: '0 6px 24px rgba(11,31,58,0.07)',
                                        }}
                                    >
                                        <div style={{
                                            display: 'flex', justifyContent: 'space-between',
                                            alignItems: 'center', marginBottom: 16,
                                        }}>
                                            <p style={{
                                                fontSize: 10, fontWeight: 700, letterSpacing: '.15em',
                                                textTransform: 'uppercase', color: '#1565C0',
                                                fontFamily: "'Montserrat', sans-serif",
                                            }}>
                                                Penilaian Terakhir
                                            </p>
                                            <button
                                                onClick={() => setActiveTab('penilaian')}
                                                style={{
                                                    fontSize: 12, fontWeight: 700, color: '#0EA5E9',
                                                    fontFamily: "'Montserrat', sans-serif",
                                                    padding: '6px 14px', borderRadius: 999,
                                                    border: '1.5px solid rgba(14,165,233,0.28)',
                                                    background: 'rgba(14,165,233,0.07)',
                                                    letterSpacing: '.06em', cursor: 'pointer',
                                                }}
                                            >
                                                Semua →
                                            </button>
                                        </div>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                                            {safePenilaian.slice(0, 4).map(p => (
                                                <div
                                                    key={p.id}
                                                    className="score-row"
                                                    style={{
                                                        display: 'flex', alignItems: 'center', gap: 10,
                                                        justifyContent: 'space-between', padding: '12px 14px',
                                                        borderRadius: 14,
                                                        border: '1.5px solid rgba(14,165,233,0.12)',
                                                        background: 'rgba(255,255,255,0.5)',
                                                    }}
                                                >
                                                    <div
                                                        className="score-row-inner"
                                                        style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}
                                                    >
                                                        {p.design?.file_path
                                                            ? <img
                                                                src={`/storage/${p.design.file_path}`}
                                                                alt={p.design.judul}
                                                                className="score-row-img"
                                                                style={{
                                                                    width: 38, height: 38, borderRadius: 10,
                                                                    objectFit: 'cover',
                                                                    border: '1.5px solid rgba(14,165,233,0.18)',
                                                                    flexShrink: 0,
                                                                }}
                                                            />
                                                            : <div
                                                                className="score-row-img"
                                                                style={{
                                                                    width: 38, height: 38, borderRadius: 10,
                                                                    background: 'rgba(14,165,233,0.1)',
                                                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                                    flexShrink: 0,
                                                                }}
                                                            >
                                                                <IconPhoto size={16} color="#0EA5E9" />
                                                            </div>
                                                        }
                                                        <div style={{ minWidth: 0 }}>
                                                            <p
                                                                className="score-title"
                                                                style={{
                                                                    fontFamily: "'Montserrat', sans-serif",
                                                                    fontWeight: 700, fontSize: 12,
                                                                    color: '#0B1F3A',
                                                                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                                                                }}
                                                            >
                                                                {p.design?.judul ?? '-'}
                                                            </p>
                                                            <p
                                                                className="score-sub"
                                                                style={{
                                                                    fontSize: 11, color: '#4A6A8A', marginTop: 1,
                                                                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                                                                }}
                                                            >
                                                                {p.design?.user?.name ?? '-'}
                                                            </p>
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

                        {/* ══════════════════ PENILAIAN TAB ══════════════════ */}
                        {activeTab === 'penilaian' && (
                            <div>
                                <div className="anim-top delay-1" style={{ marginBottom: 20 }}>
                                    <p style={{
                                        fontSize: 10, fontWeight: 700, letterSpacing: '.18em',
                                        textTransform: 'uppercase', color: '#0EA5E9', marginBottom: 6,
                                        fontFamily: "'Montserrat', sans-serif",
                                    }}>
                                        — RIWAYAT —
                                    </p>
                                    <h2 style={{
                                        fontFamily: "'Montserrat', sans-serif", fontWeight: 800,
                                        fontSize: 'clamp(20px,3vw,32px)', color: '#08182E',
                                    }}>
                                        Penilaian <span className="gradient-text-sky">Kamu</span>
                                    </h2>
                                </div>

                                {/* Preview desain */}
                                {safePenilaian.some(p => p.design?.file_path) && (
                                    <div
                                        className="section-card anim-left delay-2"
                                        style={{
                                            background: 'rgba(255,255,255,0.72)',
                                            backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
                                            border: '1.5px solid rgba(255,255,255,0.88)',
                                            borderRadius: 22, padding: '22px 18px',
                                            boxShadow: '0 6px 24px rgba(11,31,58,0.07)', marginBottom: 20,
                                        }}
                                    >
                                        <div style={{
                                            display: 'flex', justifyContent: 'space-between',
                                            alignItems: 'center', marginBottom: 14,
                                        }}>
                                            <p style={{
                                                fontSize: 10, fontWeight: 700, letterSpacing: '.12em',
                                                textTransform: 'uppercase', color: '#1565C0',
                                                fontFamily: "'Montserrat', sans-serif",
                                            }}>
                                                Preview Desain
                                            </p>
                                            <Link
                                                href="/juri/designs"
                                                style={{
                                                    textDecoration: 'none', display: 'flex',
                                                    alignItems: 'center', gap: 5,
                                                    fontSize: 12, fontWeight: 700, color: '#0EA5E9',
                                                    fontFamily: "'Montserrat', sans-serif",
                                                    padding: '6px 14px', borderRadius: 999,
                                                    border: '1.5px solid rgba(14,165,233,0.28)',
                                                    background: 'rgba(14,165,233,0.07)',
                                                }}
                                            >
                                                Nilai Lagi <IconChevronRight size={13} />
                                            </Link>
                                        </div>
                                        <div style={{
                                            display: 'grid',
                                            gridTemplateColumns: 'repeat(auto-fill, minmax(90px, 1fr))',
                                            gap: 10,
                                        }}>
                                            {safePenilaian.filter(p => p.design?.file_path).map(p => (
                                                <div
                                                    key={p.id}
                                                    style={{
                                                        borderRadius: 12, overflow: 'hidden',
                                                        border: '1.5px solid rgba(14,165,233,0.14)',
                                                        position: 'relative',
                                                    }}
                                                >
                                                    <img
                                                        src={`/storage/${p.design!.file_path}`}
                                                        alt={p.design!.judul}
                                                        style={{ width: '100%', aspectRatio: '1', objectFit: 'cover', display: 'block' }}
                                                    />
                                                    <div style={{
                                                        padding: '5px 7px',
                                                        background: 'rgba(8,24,46,0.75)',
                                                        backdropFilter: 'blur(8px)',
                                                    }}>
                                                        <p style={{
                                                            fontSize: 10, fontWeight: 700, color: '#fff',
                                                            fontFamily: "'Montserrat', sans-serif",
                                                            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                                                        }}>
                                                            {p.design!.judul}
                                                        </p>
                                                    </div>
                                                    <div style={{
                                                        position: 'absolute', top: 6, right: 6,
                                                        background: p.rata_rata >= 90
                                                            ? 'rgba(5,150,105,0.92)'
                                                            : p.rata_rata >= 75
                                                                ? 'rgba(21,101,192,0.92)'
                                                                : 'rgba(196,52,14,0.92)',
                                                        color: '#fff', borderRadius: 6,
                                                        padding: '2px 7px', fontSize: 10, fontWeight: 800,
                                                        fontFamily: "'Montserrat', sans-serif",
                                                    }}>
                                                        {p.rata_rata}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Tabel / Mobile list */}
                                <div
                                    className="section-card anim-bottom delay-3"
                                    style={{
                                        background: 'rgba(255,255,255,0.74)',
                                        backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
                                        border: '1.5px solid rgba(255,255,255,0.88)',
                                        borderRadius: 22, overflow: 'hidden',
                                        boxShadow: '0 6px 24px rgba(11,31,58,0.07)',
                                    }}
                                >
                                    {/* Mobile list */}
                                    <div className="mobile-list">
                                        {safePenilaian.length === 0 ? (
                                            <div style={{ padding: '40px 20px', textAlign: 'center' }}>
                                                <IconPhoto size={36} color="#94A3B8" />
                                                <p style={{ color: '#4A6A8A', marginTop: 10 }}>Belum ada penilaian.</p>
                                            </div>
                                        ) : safePenilaian.map((p, i) => (
                                            <div
                                                key={p.id}
                                                style={{
                                                    display: 'flex', alignItems: 'center', gap: 10,
                                                    padding: '14px 16px',
                                                    borderBottom: '1px solid rgba(14,165,233,0.08)',
                                                }}
                                            >
                                                <span style={{
                                                    fontFamily: "'Montserrat', sans-serif",
                                                    fontWeight: 700, fontSize: 12, color: '#4A6A8A',
                                                    width: 24, flexShrink: 0,
                                                }}>
                                                    {String(i + 1).padStart(2, '0')}
                                                </span>
                                                {p.design?.file_path
                                                    ? <img
                                                        src={`/storage/${p.design.file_path}`}
                                                        alt=""
                                                        style={{
                                                            width: 38, height: 38, borderRadius: 10,
                                                            objectFit: 'cover', flexShrink: 0,
                                                        }}
                                                    />
                                                    : <div style={{
                                                        width: 38, height: 38, borderRadius: 10,
                                                        background: 'rgba(14,165,233,0.1)',
                                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                        flexShrink: 0,
                                                    }}>
                                                        <IconPhoto size={16} color="#0EA5E9" />
                                                    </div>
                                                }
                                                <div style={{ flex: 1, minWidth: 0 }}>
                                                    <p style={{
                                                        fontFamily: "'Montserrat', sans-serif",
                                                        fontWeight: 700, fontSize: 13, color: '#0B1F3A',
                                                        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                                                    }}>
                                                        {p.design?.judul ?? '-'}
                                                    </p>
                                                    <p style={{ fontSize: 11, color: '#4A6A8A' }}>
                                                        {p.design?.user?.name ?? '-'}
                                                    </p>
                                                </div>
                                                <ScoreChip value={p.rata_rata} />
                                            </div>
                                        ))}
                                    </div>

                                    {/* Desktop table */}
                                    <table className="desktop-table">
                                        <thead>
                                            <tr style={{
                                                background: 'rgba(8,28,58,0.06)',
                                                borderBottom: '1.5px solid rgba(14,165,233,0.15)',
                                            }}>
                                                {['#', 'Desain', 'Peserta', 'Nilai'].map(h => (
                                                    <th key={h} style={{
                                                        padding: '12px 14px', textAlign: 'left',
                                                        fontSize: 10, fontWeight: 700,
                                                        letterSpacing: '.12em', textTransform: 'uppercase',
                                                        color: '#0B3A6A',
                                                        fontFamily: "'Montserrat', sans-serif",
                                                    }}>
                                                        {h}
                                                    </th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {safePenilaian.length === 0 ? (
                                                <tr>
                                                    <td colSpan={4} style={{ padding: '48px', textAlign: 'center' }}>
                                                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
                                                            <IconPhoto size={40} color="#94A3B8" />
                                                            <p style={{ color: '#4A6A8A' }}>Belum ada penilaian.</p>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ) : safePenilaian.map((p, i) => (
                                                <tr
                                                    key={p.id}
                                                    className="juri-row"
                                                    style={{
                                                        borderBottom: '1px solid rgba(14,165,233,0.08)',
                                                        transition: 'background .2s ease',
                                                    }}
                                                >
                                                    <td style={{
                                                        padding: '12px 14px', fontSize: 12, color: '#4A6A8A',
                                                        fontFamily: "'Montserrat', sans-serif", fontWeight: 700,
                                                    }}>
                                                        {String(i + 1).padStart(2, '0')}
                                                    </td>
                                                    <td style={{ padding: '12px 14px' }}>
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                                            {p.design?.file_path
                                                                ? <img
                                                                    src={`/storage/${p.design.file_path}`}
                                                                    alt={p.design.judul}
                                                                    style={{
                                                                        width: 36, height: 36, borderRadius: 9,
                                                                        objectFit: 'cover',
                                                                        border: '1.5px solid rgba(14,165,233,0.18)',
                                                                        flexShrink: 0,
                                                                    }}
                                                                />
                                                                : <div style={{
                                                                    width: 36, height: 36, borderRadius: 9,
                                                                    background: 'rgba(14,165,233,0.1)',
                                                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                                    flexShrink: 0,
                                                                }}>
                                                                    <IconPhoto size={16} color="#0EA5E9" />
                                                                </div>
                                                            }
                                                            <span style={{
                                                                fontWeight: 700, color: '#0B1F3A',
                                                                fontFamily: "'Montserrat', sans-serif",
                                                                fontSize: 12,
                                                                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                                                                maxWidth: 130,
                                                            }}>
                                                                {p.design?.judul ?? '-'}
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td style={{ padding: '12px 14px', color: '#1A3A5C', fontSize: 12 }}>
                                                        {p.design?.user?.name ?? '-'}
                                                    </td>
                                                    <td style={{ padding: '12px 14px' }}>
                                                        <ScoreChip value={p.rata_rata} />
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                <div className="anim-bottom delay-4" style={{ marginTop: 20 }}>
                                    <Link
                                        href="/juri/designs"
                                        style={{
                                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 9,
                                            width: '100%', textAlign: 'center',
                                            background: 'linear-gradient(135deg, #1565C0, #0EA5E9)',
                                            color: '#fff', padding: '15px 28px', borderRadius: 999,
                                            fontWeight: 800, fontSize: 14,
                                            fontFamily: "'Montserrat', sans-serif",
                                            letterSpacing: '.06em', textDecoration: 'none',
                                            boxShadow: '0 8px 24px rgba(14,165,233,0.38)',
                                        }}
                                    >
                                        <IconStar size={16} /> Nilai Lebih Banyak Desain <IconChevronRight size={16} />
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