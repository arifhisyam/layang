import { Link } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import AdminSidebar from '@/components/AdminSidebar';
import {
    IconUsers, IconStar, IconPhoto, IconClock,
    IconBell, IconArrowRight, IconLayoutDashboard,
    IconTrophy, IconPalette,
} from '@tabler/icons-react';

// ─── TYPES ─────────────────────────────────────────────────
interface AuthUser { name: string; email: string; role: string; }

interface Score { id: number; rata_rata: number; }

interface Design {
    id: number; judul: string; file_path: string;
    user: { name: string } | null; scores: Score[];
}

interface Stats {
    total_peserta: number; total_juri: number;
    total_desain: number; pending_count: number;
}

interface RankItem {
    rank: number; id: number; judul: string;
    file_path: string; peserta: string; nilai_rata_rata: number;
}

interface Props {
    auth: { user: AuthUser };
    stats: Stats;
    recent_designs: Design[];
    top_rankings: RankItem[];
}

// ─── STYLES ────────────────────────────────────────────────
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700;800;900&family=Open+Sans:wght@300;400;600&display=swap');
  *, *::before, *::after { box-sizing: border-box; }
  ::-webkit-scrollbar { width: 5px; height: 5px; }
  ::-webkit-scrollbar-track { background: #C8E9FF; }
  ::-webkit-scrollbar-thumb { background: linear-gradient(#0EA5E9,#1565C0); border-radius: 3px; }

  @keyframes shimmer     { 0%{background-position:0% 50%} 50%{background-position:100% 50%} 100%{background-position:0% 50%} }
  @keyframes orb-drift   { 0%,100%{transform:translate(0,0)} 33%{transform:translate(20px,-14px)} 66%{transform:translate(-16px,18px)} }
  @keyframes float-slow  { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-7px)} }

  @keyframes slideFromTop    { from{opacity:0;transform:translateY(-36px)} to{opacity:1;transform:translateY(0)} }
  @keyframes slideFromLeft   { from{opacity:0;transform:translateX(-56px)} to{opacity:1;transform:translateX(0)} }
  @keyframes slideFromRight  { from{opacity:0;transform:translateX(56px)}  to{opacity:1;transform:translateX(0)} }
  @keyframes slideFromBottom { from{opacity:0;transform:translateY(36px)}  to{opacity:1;transform:translateY(0)} }
  @keyframes popIn           { from{opacity:0;transform:scale(0.7) rotate(-15deg)} to{opacity:1;transform:scale(1) rotate(0deg)} }

  .adm-ready .anim-top    { animation: slideFromTop    0.55s cubic-bezier(0.22,1,0.36,1) both; }
  .adm-ready .anim-left   { animation: slideFromLeft   0.55s cubic-bezier(0.22,1,0.36,1) both; }
  .adm-ready .anim-right  { animation: slideFromRight  0.55s cubic-bezier(0.22,1,0.36,1) both; }
  .adm-ready .anim-bottom { animation: slideFromBottom 0.55s cubic-bezier(0.22,1,0.36,1) both; }
  .adm-ready .anim-pop    { animation: popIn           0.45s cubic-bezier(0.34,1.56,0.64,1) both; }

  .adm-ready .delay-1 { animation-delay: 0.08s; }
  .adm-ready .delay-2 { animation-delay: 0.18s; }
  .adm-ready .delay-3 { animation-delay: 0.28s; }
  .adm-ready .delay-4 { animation-delay: 0.38s; }
  .adm-ready .delay-5 { animation-delay: 0.48s; }

  .adm-ready .stat-0 { animation-delay: 0.10s; }
  .adm-ready .stat-1 { animation-delay: 0.18s; }
  .adm-ready .stat-2 { animation-delay: 0.26s; }
  .adm-ready .stat-3 { animation-delay: 0.34s; }

  .anim-top,.anim-left,.anim-right,.anim-bottom,.anim-pop { opacity: 0; }

  .adm-gradient-sky {
    background: linear-gradient(135deg,#0A2F5E 0%,#1565C0 32%,#0EA5E9 62%,#38BDF8 100%);
    background-size: 280%; -webkit-background-clip: text;
    -webkit-text-fill-color: transparent; background-clip: text;
    animation: shimmer 7s ease infinite;
  }
  .adm-glass {
    background: rgba(255,255,255,0.72);
    backdrop-filter: blur(20px) saturate(160%);
    -webkit-backdrop-filter: blur(20px) saturate(160%);
    border: 1.5px solid rgba(255,255,255,0.88);
    box-shadow: 0 6px 26px rgba(11,31,58,0.08), inset 0 1px 0 rgba(255,255,255,0.92);
  }
  .adm-stat-card { transition: transform .32s cubic-bezier(.34,1.4,.64,1), box-shadow .32s ease; cursor: default; }
  .adm-stat-card:hover { transform: translateY(-6px) scale(1.02); box-shadow: 0 20px 48px rgba(11,31,58,0.14) !important; }
  .adm-row-hover:hover { background: rgba(14,165,233,0.05) !important; }
  .adm-notif-banner {
    display: flex; align-items: center; gap: 14px;
    background: rgba(255,245,228,0.88); border: 1.5px solid rgba(217,119,6,0.32);
    border-radius: 18px; padding: 16px 22px; margin-bottom: 28px;
    text-decoration: none; backdrop-filter: blur(14px);
    box-shadow: 0 4px 18px rgba(217,119,6,0.1); transition: all .26s ease;
  }
  .adm-notif-banner:hover { background: rgba(255,237,189,0.95); transform: translateY(-2px); box-shadow: 0 8px 28px rgba(217,119,6,0.16); }
  .adm-badge {
    border-radius: 999px; padding: 3px 11px;
    font-size: 10px; font-weight: 700;
    font-family: 'Montserrat',sans-serif; letter-spacing: .1em;
  }

  /* ── MOBILE: reset margin-left agar sidebar tidak mendorong konten ── */
  .adm-main { transition: margin-left 0.3s cubic-bezier(0.4,0,0.2,1); }

  @media (max-width: 768px) {
    .adm-main { margin-left: 0 !important; padding-bottom: 80px !important; }
    .adm-mobile-spacer { height: 56px; }

    /* Stat grid: 2 kolom di mobile */
    .adm-stat-grid { grid-template-columns: repeat(2, 1fr) !important; }

    /* Bottom grid: 1 kolom penuh di mobile */
    .adm-bottom-grid { grid-template-columns: 1fr !important; }
    .adm-bottom-grid > div { grid-column: span 1 !important; }

    /* Notif banner lebih kompak */
    .adm-notif-banner { flex-wrap: wrap; gap: 10px; padding: 14px 16px; }

    /* Header lebih kecil */
    .adm-header-title { font-size: 20px !important; }

    /* Tabel: bisa scroll horizontal */
    .adm-table-wrap { overflow-x: auto; -webkit-overflow-scrolling: touch; }
    .adm-table-wrap table { min-width: 420px; }

    /* Stat card padding lebih kecil */
    .adm-stat-card { padding: 16px !important; }
    .adm-stat-card .stat-icon { width: 44px !important; height: 44px !important; }
    .adm-stat-card .stat-value { font-size: 26px !important; }
  }

  @media (max-width: 480px) {
    .adm-stat-grid { grid-template-columns: repeat(2, 1fr) !important; }
    .adm-notif-badge { display: none; }
  }
`;

// ─── SUB COMPONENTS ────────────────────────────────────────
function StatCard({ icon, label, value, color, glowColor, statIdx }: {
    icon: React.ReactNode; label: string; value: number | string;
    color: string; glowColor?: string; statIdx: number;
}) {
    return (
        <div
            className={`adm-glass adm-stat-card anim-right stat-${statIdx}`}
            style={{ borderRadius: 22, padding: 'clamp(18px,2.5vw,26px)', display: 'flex', alignItems: 'center', gap: 16 }}
        >
            <div
                className="stat-icon"
                style={{
                    width: 54, height: 54, borderRadius: 16, flexShrink: 0,
                    background: `${color}14`, border: `1.5px solid ${color}28`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
            >{icon}</div>
            <div>
                <p
                    className="stat-value"
                    style={{
                        fontFamily: "'Montserrat',sans-serif", fontWeight: 900,
                        fontSize: 'clamp(26px,3.5vw,34px)', color, lineHeight: 1,
                        textShadow: `0 0 20px ${glowColor ?? color}38`,
                    }}
                >{value}</p>
                <p style={{
                    fontSize: 'clamp(10px,1.1vw,11.5px)', color: '#1A3A5C', marginTop: 5,
                    fontWeight: 600, letterSpacing: '.07em', textTransform: 'uppercase',
                    fontFamily: "'Montserrat',sans-serif",
                }}>{label}</p>
            </div>
        </div>
    );
}

function RankBadge({ rank }: { rank: number }) {
    const configs: Record<number, { bg: string; color: string }> = {
        1: { bg: 'linear-gradient(135deg,#F59E0B,#D97706)', color: '#fff' },
        2: { bg: 'linear-gradient(135deg,#94A3B8,#64748B)', color: '#fff' },
        3: { bg: 'linear-gradient(135deg,#CD7F32,#A05C1A)', color: '#fff' },
    };
    const c = configs[rank] ?? { bg: 'rgba(14,165,233,0.14)', color: '#1565C0' };
    return (
        <span style={{
            width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
            background: c.bg, color: c.color,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 11, fontWeight: 900, fontFamily: "'Montserrat',sans-serif",
        }}>{rank}</span>
    );
}

function ScoreChip({ value }: { value: number | null }) {
    if (value == null) return (
        <span className="adm-badge" style={{ background: 'rgba(217,119,6,0.12)', color: '#A86100', border: '1px solid rgba(217,119,6,0.28)' }}>
            PENDING
        </span>
    );
    const color = value >= 90 ? '#059669' : value >= 75 ? '#1565C0' : '#C4340E';
    return (
        <span style={{ fontFamily: "'Montserrat',sans-serif", fontWeight: 900, fontSize: 15, color }}>
            {value}
        </span>
    );
}

// ─── MAIN ──────────────────────────────────────────────────
export default function AdminDashboard({ auth, stats, recent_designs = [], top_rankings = [] }: Props) {
    const [ready, setReady] = useState(false);
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

    useEffect(() => {
        const t = requestAnimationFrame(() => requestAnimationFrame(() => setReady(true)));
        return () => cancelAnimationFrame(t);
    }, []);

    const designs  = recent_designs ?? [];
    const rankings = top_rankings ?? [];
    const safeStats: Stats = {
        total_peserta: stats?.total_peserta ?? 0,
        total_juri:    stats?.total_juri    ?? 0,
        total_desain:  stats?.total_desain  ?? 0,
        pending_count: stats?.pending_count ?? 0,
    };

    const sidebarWidth = sidebarCollapsed ? 64 : 240;

    return (
        <div
            className={ready ? 'adm-ready' : ''}
            style={{ display: 'flex', minHeight: '100vh', fontFamily: "'Open Sans',sans-serif" }}
        >
            <style>{STYLES}</style>

            <AdminSidebar
                user={auth.user}
                activePage="dashboard"
                pendingUsers={safeStats.pending_count}
                onCollapse={setSidebarCollapsed}
            />

            {/* ── Main area ── */}
            <div
                className="adm-main"
                style={{
                    marginLeft: sidebarWidth,
                    flex: 1,
                    background: 'linear-gradient(170deg,#A8D8FF 0%,#C4E5FF 16%,#DDF1FF 38%,#CBE8FF 62%,#B0D8FF 100%)',
                    position: 'relative', overflowX: 'hidden', minHeight: '100vh',
                }}
            >
                {/* Background orbs */}
                <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none', overflow: 'hidden' }}>
                    {[
                        { w: 600, h: 600, top: '-200px', left: '0px',  c: 'radial-gradient(circle,rgba(14,165,233,0.14) 0%,transparent 62%)', dur: '24s', delay: '0s' },
                        { w: 460, h: 460, top: 'auto',   left: 'auto', right: '-120px', bottom: '-100px', c: 'radial-gradient(circle,rgba(14,165,233,0.09) 0%,transparent 62%)', dur: '28s', delay: '-8s' },
                        { w: 340, h: 340, top: '42%',    left: '36%',  c: 'radial-gradient(circle,rgba(255,255,255,0.38) 0%,transparent 62%)', dur: '20s', delay: '-4s' },
                    ].map((b, i) => (
                        <div key={i} style={{
                            position: 'absolute', width: b.w, height: b.h, borderRadius: '50%',
                            top: (b as any).top, left: (b as any).left,
                            right: (b as any).right, bottom: (b as any).bottom,
                            background: b.c,
                            animation: `orb-drift ${b.dur} ease-in-out infinite`,
                            animationDelay: b.delay,
                        }} />
                    ))}
                    <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(rgba(11,31,58,0.07) 1px,transparent 1px)', backgroundSize: '28px 28px' }} />
                </div>

                {/* ── Mobile spacer (sama seperti PesertaDashboard) ── */}
                <div className="adm-mobile-spacer" />

                {/* Content */}
                <div style={{ maxWidth: 1100, margin: '0 auto', padding: 'clamp(32px,4vw,48px) clamp(20px,4vw,40px) 60px', position: 'relative', zIndex: 1 }}>

                    {/* ══ HEADER ══ */}
                    <div className="anim-top delay-1" style={{ marginBottom: 28 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                            <div className="anim-pop delay-1" style={{
                                width: 48, height: 48, borderRadius: 16,
                                background: 'linear-gradient(135deg,#0EA5E9,#1565C0)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                boxShadow: '0 8px 24px rgba(14,165,233,0.35)', flexShrink: 0,
                            }}>
                                <IconLayoutDashboard size={22} color="#fff" />
                            </div>
                            <div>
                                <p style={{
                                    fontSize: 10, fontWeight: 700, letterSpacing: '.18em',
                                    textTransform: 'uppercase', color: '#0EA5E9', marginBottom: 4,
                                    fontFamily: "'Montserrat',sans-serif",
                                }}>— ADMIN PANEL —</p>
                                <h1
                                    className="adm-header-title"
                                    style={{
                                        fontFamily: "'Montserrat',sans-serif", fontWeight: 900,
                                        fontSize: 'clamp(20px,3vw,32px)', color: '#08182E', lineHeight: 1.2,
                                    }}
                                >
                                    Dashboard <span className="adm-gradient-sky">Admin</span>
                                </h1>
                                <p style={{ color: '#1A3A5C', fontSize: 13, marginTop: 2 }}>
                                    Selamat datang, <strong style={{ color: '#0B1F3A' }}>{auth.user.name}</strong> — Kompetisi Desain Layang-Layang 2026
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* ══ NOTIF PENDING ══ */}
                    {safeStats.pending_count > 0 && (
                        <Link href="/admin/users" className="adm-notif-banner anim-left delay-2">
                            <span style={{ fontSize: 26, flexShrink: 0, animation: 'float-slow 3s ease-in-out infinite' }}>
                                <IconBell size={26} color="#D97706" />
                            </span>
                            <div style={{ flex: 1 }}>
                                <p style={{ fontFamily: "'Montserrat',sans-serif", fontWeight: 800, fontSize: 14, color: '#92400E', marginBottom: 2 }}>
                                    {safeStats.pending_count} pendaftar menunggu persetujuan!
                                </p>
                                <p style={{ fontSize: 12, color: '#A86100' }}>Klik di sini untuk review dan setujui akun mereka.</p>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
                                <span className="adm-badge adm-notif-badge" style={{ background: 'rgba(217,119,6,0.18)', color: '#92400E', border: '1px solid rgba(217,119,6,0.32)' }}>
                                    {safeStats.pending_count} PENDING
                                </span>
                                <IconArrowRight size={18} color="#D97706" />
                            </div>
                        </Link>
                    )}

                    {/* ══ STAT CARDS ══ */}
                    <div
                        className="adm-stat-grid"
                        style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 'clamp(12px,2vw,20px)', marginBottom: 28 }}
                    >
                        <StatCard statIdx={0} icon={<IconUsers size={24} color="#1565C0" />}  label="Peserta Aktif"  value={safeStats.total_peserta} color="#1565C0" />
                        <StatCard statIdx={1} icon={<IconStar  size={24} color="#0EA5E9" />}  label="Total Juri"     value={safeStats.total_juri}    color="#0EA5E9" />
                        <StatCard statIdx={2} icon={<IconPhoto size={24} color="#059669" />}  label="Total Desain"   value={safeStats.total_desain}  color="#059669" glowColor="#34D399" />
                        {safeStats.pending_count > 0 && (
                            <StatCard statIdx={3} icon={<IconClock size={24} color="#D97706" />} label="Pending Akun" value={safeStats.pending_count} color="#D97706" glowColor="#F59E0B" />
                        )}
                    </div>

                    {/* ══ BOTTOM GRID ══ */}
                    <div
                        className="adm-bottom-grid"
                        style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', gap: 'clamp(14px,2vw,24px)' }}
                    >

                        {/* Desain terbaru */}
                        <div
                            className="adm-glass anim-bottom delay-3"
                            style={{ borderRadius: 22, padding: 'clamp(20px,3vw,28px)', gridColumn: 'span 2' }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 10 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                    <div className="anim-pop delay-3" style={{ width: 34, height: 34, borderRadius: 10, background: 'rgba(14,165,233,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <IconPalette size={18} color="#0EA5E9" />
                                    </div>
                                    <div>
                                        <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.15em', textTransform: 'uppercase', color: '#0EA5E9', marginBottom: 2, fontFamily: "'Montserrat',sans-serif" }}>— TERBARU —</p>
                                        <h2 style={{ fontFamily: "'Montserrat',sans-serif", fontWeight: 800, fontSize: 18, color: '#08182E' }}>Desain Masuk</h2>
                                    </div>
                                </div>
                                <Link href="/admin/designs" style={{
                                    textDecoration: 'none', fontSize: 12, fontWeight: 700, color: '#0EA5E9',
                                    fontFamily: "'Montserrat',sans-serif", letterSpacing: '.06em',
                                    padding: '7px 16px', borderRadius: 999, border: '1.5px solid rgba(14,165,233,0.28)',
                                    background: 'rgba(14,165,233,0.07)', transition: 'all .24s ease',
                                    display: 'inline-flex', alignItems: 'center', gap: 5,
                                }}>
                                    Lihat semua <IconArrowRight size={13} />
                                </Link>
                            </div>

                            {designs.length === 0 ? (
                                <div style={{ textAlign: 'center', padding: '48px 0', color: '#4A6A8A' }}>
                                    <IconPhoto size={36} color="rgba(14,165,233,0.3)" style={{ margin: '0 auto 10px' }} />
                                    <p>Belum ada desain</p>
                                </div>
                            ) : (
                                <div className="adm-table-wrap">
                                    <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 420 }}>
                                        <thead>
                                            <tr style={{ borderBottom: '1.5px solid rgba(14,165,233,0.14)' }}>
                                                {['Desain', 'Peserta', 'Status', 'Nilai'].map(h => (
                                                    <th key={h} style={{
                                                        padding: '10px 14px', textAlign: 'left', fontSize: 10,
                                                        fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase',
                                                        color: '#0B3A6A', fontFamily: "'Montserrat',sans-serif",
                                                    }}>{h}</th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {designs.map(d => (
                                                <tr key={d.id} className="adm-row-hover" style={{ borderBottom: '1px solid rgba(14,165,233,0.07)', transition: 'background .2s ease' }}>
                                                    <td style={{ padding: '12px 14px' }}>
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                                            <img src={`/storage/${d.file_path}`} alt={d.judul} style={{
                                                                width: 40, height: 40, borderRadius: 10, objectFit: 'cover',
                                                                border: '1.5px solid rgba(14,165,233,0.18)', flexShrink: 0,
                                                            }} />
                                                            <span style={{
                                                                fontWeight: 700, color: '#0B1F3A', fontFamily: "'Montserrat',sans-serif",
                                                                fontSize: 13, overflow: 'hidden', textOverflow: 'ellipsis',
                                                                whiteSpace: 'nowrap', maxWidth: 140,
                                                            }}>{d.judul}</span>
                                                        </div>
                                                    </td>
                                                    <td style={{ padding: '12px 14px', color: '#1A3A5C', fontSize: 13 }}>{d.user?.name ?? '-'}</td>
                                                    <td style={{ padding: '12px 14px' }}>
                                                        {(d.scores?.length ?? 0) > 0
                                                            ? <span className="adm-badge" style={{ background: 'rgba(5,150,105,0.12)', color: '#065F46', border: '1px solid rgba(5,150,105,0.28)' }}>✅ Dinilai</span>
                                                            : <span className="adm-badge" style={{ background: 'rgba(217,119,6,0.12)', color: '#A86100', border: '1px solid rgba(217,119,6,0.28)' }}>⏳ Pending</span>
                                                        }
                                                    </td>
                                                    <td style={{ padding: '12px 14px' }}>
                                                        <ScoreChip value={(d.scores?.length ?? 0) > 0 ? d.scores[0].rata_rata : null} />
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>

                        {/* Leaderboard mini */}
                        <div className="adm-glass anim-left delay-4" style={{ borderRadius: 22, padding: 'clamp(20px,3vw,28px)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 10 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                    <div className="anim-pop delay-4" style={{ width: 34, height: 34, borderRadius: 10, background: 'rgba(245,158,11,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <IconTrophy size={18} color="#D97706" />
                                    </div>
                                    <div>
                                        <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.15em', textTransform: 'uppercase', color: '#D97706', marginBottom: 2, fontFamily: "'Montserrat',sans-serif" }}>— PERINGKAT —</p>
                                        <h2 style={{ fontFamily: "'Montserrat',sans-serif", fontWeight: 800, fontSize: 18, color: '#08182E' }}>Top 5</h2>
                                    </div>
                                </div>
                                <Link href="/admin/leaderboard" style={{
                                    textDecoration: 'none', fontSize: 12, fontWeight: 700, color: '#D97706',
                                    fontFamily: "'Montserrat',sans-serif", letterSpacing: '.06em',
                                    padding: '7px 16px', borderRadius: 999, border: '1.5px solid rgba(217,119,6,0.28)',
                                    background: 'rgba(217,119,6,0.08)', transition: 'all .24s ease',
                                    display: 'inline-flex', alignItems: 'center', gap: 5,
                                }}>
                                    Semua <IconArrowRight size={13} />
                                </Link>
                            </div>

                            {rankings.length === 0 ? (
                                <div style={{ textAlign: 'center', padding: '48px 0', color: '#4A6A8A' }}>
                                    <IconTrophy size={36} color="rgba(217,119,6,0.3)" style={{ margin: '0 auto 10px' }} />
                                    <p style={{ fontSize: 13 }}>Belum ada penilaian</p>
                                </div>
                            ) : (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                                    {rankings.map(item => {
                                        const rankBg     = item.rank === 1 ? 'rgba(245,158,11,0.08)' : item.rank === 2 ? 'rgba(148,163,184,0.1)' : item.rank === 3 ? 'rgba(180,83,9,0.08)' : 'rgba(14,165,233,0.04)';
                                        const rankBorder = item.rank === 1 ? 'rgba(245,158,11,0.32)' : item.rank === 2 ? 'rgba(148,163,184,0.32)' : item.rank === 3 ? 'rgba(180,83,9,0.28)' : 'rgba(14,165,233,0.14)';
                                        const scoreColor = item.rank === 1 ? '#D97706' : item.rank === 2 ? '#64748B' : item.rank === 3 ? '#B45309' : '#1565C0';
                                        return (
                                            <div key={item.id} style={{
                                                display: 'flex', alignItems: 'center', gap: 12,
                                                padding: '12px 14px', borderRadius: 14,
                                                background: rankBg, border: `1.5px solid ${rankBorder}`,
                                                transition: 'transform .24s ease,box-shadow .24s ease', cursor: 'default',
                                            }}
                                                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 22px rgba(11,31,58,0.1)'; }}
                                                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = ''; (e.currentTarget as HTMLElement).style.boxShadow = ''; }}
                                            >
                                                <RankBadge rank={item.rank} />
                                                <img src={`/storage/${item.file_path}`} alt={item.judul} style={{ width: 38, height: 38, borderRadius: 9, objectFit: 'cover', flexShrink: 0, border: '1.5px solid rgba(255,255,255,0.8)' }} />
                                                <div style={{ flex: 1, minWidth: 0 }}>
                                                    <p style={{ fontSize: 13, fontWeight: 700, color: '#0B1F3A', fontFamily: "'Montserrat',sans-serif", overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.peserta}</p>
                                                    <p style={{ fontSize: 11, color: '#4A6A8A', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.judul}</p>
                                                </div>
                                                <span style={{ fontFamily: "'Montserrat',sans-serif", fontWeight: 900, fontSize: 16, color: scoreColor, flexShrink: 0 }}>{item.nilai_rata_rata}</span>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}