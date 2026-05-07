import { useEffect, useState } from 'react';
import { Link } from '@inertiajs/react';
import AdminSidebar from '@/components/AdminSidebar';
import {
    IconTrophy, IconLayoutDashboard, IconUsers,
    IconListNumbers, IconPalette, IconUser, IconTag,
    IconBulb, IconSparkles, IconTool, IconChartBar,
    IconUserStar, IconClipboardList, IconX,
} from '@tabler/icons-react';

// ── Types ─────────────────────────────────────────────────────────────────────
interface AuthUser { name: string; email: string; role: string; }
interface RankItem {
    rank: number; id: number; judul: string; file_path: string;
    peserta: string; user_id: number; nilai_rata_rata: number;
    jumlah_juri: number;
    detail: { tema: number; kreativitas: number; estetik: number; teknik: number; };
}
interface Props { auth: { user: AuthUser }; rankings: RankItem[]; pendingUsers?: number; }

// ── Styles ────────────────────────────────────────────────────────────────────
const STYLES = `
    @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700;800;900&display=swap');

    @keyframes shimmer   { 0%{background-position:0% 50%} 50%{background-position:100% 50%} 100%{background-position:0% 50%} }
    @keyframes orb-drift { 0%,100%{transform:translate(0,0)} 33%{transform:translate(20px,-14px)} 66%{transform:translate(-16px,18px)} }
    @keyframes bar-grow  { from{width:0} to{width:var(--w)} }
    @keyframes blink-dot { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.4;transform:scale(0.7)} }
    @keyframes crown-bob { 0%,100%{transform:translateY(0) rotate(-4deg)} 50%{transform:translateY(-6px) rotate(4deg)} }
    @keyframes float-glow{ 0%,100%{box-shadow:0 0 18px rgba(14,165,233,0.45)} 50%{box-shadow:0 0 36px rgba(14,165,233,0.75)} }
    @keyframes modal-in  { from{opacity:0;transform:scale(0.9) translateY(16px)} to{opacity:1;transform:scale(1) translateY(0)} }
    @keyframes backdrop-in{ from{opacity:0} to{opacity:1} }

    @keyframes slideFromTop    { from{opacity:0;transform:translateY(-36px)} to{opacity:1;transform:translateY(0)} }
    @keyframes slideFromLeft   { from{opacity:0;transform:translateX(-56px)} to{opacity:1;transform:translateX(0)} }
    @keyframes slideFromRight  { from{opacity:0;transform:translateX(56px)}  to{opacity:1;transform:translateX(0)} }
    @keyframes slideFromBottom { from{opacity:0;transform:translateY(36px)}  to{opacity:1;transform:translateY(0)} }
    @keyframes popIn           { from{opacity:0;transform:scale(0.7) rotate(-15deg)} to{opacity:1;transform:scale(1) rotate(0deg)} }
    @keyframes pop-in-card     { 0%{opacity:0;transform:scale(0.82) translateY(12px)} 70%{transform:scale(1.04)} 100%{opacity:1;transform:scale(1) translateY(0)} }

    .lb-ready .anim-top    { animation: slideFromTop    0.55s cubic-bezier(0.22,1,0.36,1) both; }
    .lb-ready .anim-left   { animation: slideFromLeft   0.55s cubic-bezier(0.22,1,0.36,1) both; }
    .lb-ready .anim-right  { animation: slideFromRight  0.55s cubic-bezier(0.22,1,0.36,1) both; }
    .lb-ready .anim-bottom { animation: slideFromBottom 0.55s cubic-bezier(0.22,1,0.36,1) both; }
    .lb-ready .anim-pop    { animation: popIn           0.45s cubic-bezier(0.34,1.56,0.64,1) both; }
    .lb-ready .podium-anim { animation: pop-in-card     0.55s cubic-bezier(0.34,1.4,0.64,1) both; }

    .lb-ready .delay-1 { animation-delay: 0.08s; }
    .lb-ready .delay-2 { animation-delay: 0.18s; }
    .lb-ready .delay-3 { animation-delay: 0.30s; }
    .lb-ready .delay-4 { animation-delay: 0.42s; }
    .lb-ready .pod-0   { animation-delay: 0.20s; }
    .lb-ready .pod-1   { animation-delay: 0.10s; }
    .lb-ready .pod-2   { animation-delay: 0.30s; }

    .anim-top,.anim-left,.anim-right,.anim-bottom,.anim-pop,.podium-anim { opacity: 0; }

    .lb-gradient-text {
        background: linear-gradient(135deg,#0A2F5E 0%,#1565C0 32%,#0EA5E9 62%,#38BDF8 100%);
        background-size:280%; -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text;
        animation: shimmer 7s ease infinite;
    }
    .lb-row { transition:all .22s ease; cursor:default; }
    .lb-row:hover { background:rgba(14,165,233,0.06)!important; transform:translateX(3px); }
    .podium-card { transition:all .32s cubic-bezier(.34,1.4,.64,1); }
    .podium-card:hover { transform:translateY(-6px) scale(1.03); }
    .score-bar-fill { animation:bar-grow .9s cubic-bezier(.4,0,.2,1) both; }
    .crown { animation:crown-bob 2.4s ease-in-out infinite; display:inline-block; }

    .img-trigger { cursor:zoom-in; position:relative; overflow:hidden; }
    .zoom-hint { position:absolute; inset:0; display:flex; align-items:center; justify-content:center; background:rgba(8,24,46,0); transition:background .22s ease; pointer-events:none; border-radius:inherit; }
    .zoom-hint span { font-size:20px; opacity:0; transform:scale(0.7); transition:opacity .22s ease,transform .22s ease; }
    .img-trigger:hover .zoom-hint { background:rgba(8,24,46,0.45); }
    .img-trigger:hover .zoom-hint span { opacity:1; transform:scale(1); }

    .modal-backdrop { position:fixed; inset:0; z-index:1000; background:rgba(8,18,40,0.85); backdrop-filter:blur(16px); display:flex; align-items:center; justify-content:center; padding:24px; animation:backdrop-in .2s ease both; cursor:zoom-out; }
    .modal-box { animation:modal-in .3s cubic-bezier(.34,1.2,.64,1) both; max-width:880px; width:100%; cursor:default; position:relative; border-radius:22px; overflow:hidden; box-shadow:0 32px 100px rgba(0,0,0,0.6); }
    .modal-close { position:absolute; top:14px; right:14px; z-index:10; width:38px; height:38px; border-radius:50%; background:rgba(255,255,255,0.15); border:1.5px solid rgba(255,255,255,0.25); backdrop-filter:blur(8px); cursor:pointer; color:#fff; display:flex; align-items:center; justify-content:center; transition:all .18s ease; }
    .modal-close:hover { background:rgba(255,255,255,0.28); transform:scale(1.1); }

    /* ══════════════════════════════════════════
       MOBILE RESPONSIVE
    ══════════════════════════════════════════ */

    /* Main content wrapper transition */
    .lb-main-content {
        transition: margin-left 0.3s cubic-bezier(0.4,0,0.2,1);
    }

    /* Mobile spacer for bottom nav / top bar */
    .lb-mobile-spacer { display: none; }

    @media (max-width: 768px) {
        /* Reset margin so content fills full width */
        .lb-main-content {
            margin-left: 0 !important;
            padding-bottom: 80px !important;
        }

        /* Show spacer */
        .lb-mobile-spacer {
            display: block;
            height: 56px;
        }

        /* Top bar: hide on mobile (sidebar handles nav) */
        .lb-topbar {
            display: none !important;
        }

        /* Content padding tighter */
        .lb-content-pad {
            padding: 20px 16px !important;
        }

        /* Podium: scale down */
        .lb-podium-wrap {
            padding: 20px 14px !important;
        }

        /* Podium images smaller */
        .podium-card:hover {
            transform: none;
        }

        /* Table: horizontal scroll */
        .lb-table-wrap {
            overflow-x: auto;
            -webkit-overflow-scrolling: touch;
        }
        .lb-table-wrap table {
            min-width: 640px;
        }

        /* Mobile rank cards — show instead of table on small screens */
        .lb-rank-cards { display: flex !important; }
        .lb-table-section { display: none !important; }

        /* Heading font size */
        .lb-heading { font-size: clamp(22px, 5vw, 32px) !important; }
    }

    @media (max-width: 480px) {
        /* Podium: 3-column stays but smaller gap */
        .lb-podium-inner {
            gap: 8px !important;
        }
    }

    /* ── Mobile rank card list ── */
    .lb-rank-cards {
        display: none;
        flex-direction: column;
        gap: 12px;
        margin-top: 0;
    }
    .lb-rank-card {
        background: rgba(255,255,255,0.80);
        backdrop-filter: blur(16px);
        border: 1.5px solid rgba(255,255,255,0.88);
        border-radius: 18px;
        overflow: hidden;
        box-shadow: 0 4px 14px rgba(11,31,58,0.07);
        display: flex;
        align-items: stretch;
    }
    .lb-rank-card-accent {
        width: 5px;
        flex-shrink: 0;
    }
    .lb-rank-card-body {
        flex: 1;
        padding: 14px 14px 14px 12px;
        display: flex;
        gap: 12px;
        align-items: center;
    }
    .lb-rank-card-scores {
        display: grid;
        grid-template-columns: repeat(2,1fr);
        gap: 6px;
        margin-top: 10px;
    }
    .lb-rank-score-pill {
        background: rgba(14,165,233,0.07);
        border: 1px solid rgba(14,165,233,0.15);
        border-radius: 10px;
        padding: 6px 8px;
        text-align: center;
    }
`;

const MEDAL = ['🥇', '🥈', '🥉'];
const MEDAL_COLORS: Record<number, { ring: string; glow: string; bar: string; text: string; badge: string }> = {
    1: { ring: '#F59E0B', glow: 'rgba(245,158,11,0.55)', bar: 'linear-gradient(90deg,#F59E0B,#FBBF24)', text: '#B45309', badge: 'rgba(245,158,11,0.14)' },
    2: { ring: '#94A3B8', glow: 'rgba(148,163,184,0.45)', bar: 'linear-gradient(90deg,#94A3B8,#CBD5E1)', text: '#475569', badge: 'rgba(148,163,184,0.14)' },
    3: { ring: '#D97706', glow: 'rgba(217,119,6,0.45)',  bar: 'linear-gradient(90deg,#D97706,#F59E0B)', text: '#92400E', badge: 'rgba(217,119,6,0.14)' },
};
const DEFAULT_COLOR = { ring: '#0EA5E9', glow: 'rgba(14,165,233,0.2)', bar: 'linear-gradient(90deg,#0EA5E9,#1565C0)', text: '#1565C0', badge: 'rgba(14,165,233,0.08)' };
const mc = (rank: number) => MEDAL_COLORS[rank] ?? DEFAULT_COLOR;

function ScoreBar({ value, rank }: { value: number; rank: number }) {
    const c = mc(rank);
    return (
        <div style={{ height: 6, borderRadius: 999, background: 'rgba(14,165,233,0.1)', overflow: 'hidden', minWidth: 60 }}>
            <div className="score-bar-fill" style={{ height: '100%', borderRadius: 999, background: c.bar, ['--w' as any]: `${value}%`, width: `${value}%` }} />
        </div>
    );
}

interface PreviewItem { src: string; judul: string; peserta: string; score: number; rank: number; }

function ImageModal({ item, onClose }: { item: PreviewItem; onClose: () => void }) {
    const c = mc(item.rank);
    return (
        <div className="modal-backdrop" onClick={onClose}>
            <div className="modal-box" onClick={e => e.stopPropagation()}>
                <button className="modal-close" onClick={onClose}><IconX size={16} /></button>
                <img src={item.src} alt={item.judul} style={{ width: '100%', maxHeight: '72vh', objectFit: 'contain', display: 'block', background: '#0a1628' }} />
                <div style={{ background: 'rgba(8,24,46,0.94)', backdropFilter: 'blur(12px)', padding: '18px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                            <span style={{ fontSize: 20 }}>{MEDAL[item.rank - 1] ?? ''}</span>
                            <p style={{ fontFamily: "'Montserrat',sans-serif", fontWeight: 800, fontSize: 16, color: '#fff' }}>{item.judul}</p>
                        </div>
                        <p style={{ fontSize: 12, color: 'rgba(186,230,253,0.75)', display: 'flex', alignItems: 'center', gap: 4 }}>
                            <IconUser size={12} />{item.peserta}
                        </p>
                    </div>
                    <div style={{ background: `${c.ring}22`, border: `1.5px solid ${c.ring}55`, borderRadius: 14, padding: '10px 22px', textAlign: 'center', flexShrink: 0 }}>
                        <p style={{ fontFamily: "'Montserrat',sans-serif", fontWeight: 900, fontSize: 30, color: item.rank === 1 ? '#F59E0B' : c.text, lineHeight: 1 }}>{item.score}</p>
                        <p style={{ fontSize: 9, color: 'rgba(186,230,253,0.6)', fontWeight: 700, letterSpacing: '.1em', marginTop: 3 }}>RATA-RATA</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

// ── Mobile Rank Card ──────────────────────────────────────────────────────────
function MobileRankCard({ item, onPreview }: { item: RankItem; onPreview: (item: RankItem) => void }) {
    const c = mc(item.rank);
    const isTop = item.rank <= 3;
    return (
        <div className="lb-rank-card anim-bottom">
            <div className="lb-rank-card-accent" style={{ background: c.ring }} />
            <div className="lb-rank-card-body">
                {/* Rank badge */}
                <div style={{ width: 36, height: 36, borderRadius: '50%', background: isTop ? c.ring : 'rgba(14,165,233,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: isTop ? 15 : 12, fontWeight: 900, color: isTop ? '#fff' : '#1565C0', fontFamily: "'Montserrat',sans-serif", boxShadow: isTop ? `0 2px 10px ${c.glow}` : 'none', flexShrink: 0 }}>
                    {isTop ? MEDAL[item.rank - 1] : item.rank}
                </div>

                {/* Thumbnail */}
                <div className="img-trigger" style={{ width: 52, height: 52, borderRadius: 12, flexShrink: 0 }} onClick={() => onPreview(item)}>
                    <img src={`/storage/${item.file_path}`} alt={item.judul} style={{ width: 52, height: 52, borderRadius: 12, objectFit: 'cover', border: `2px solid ${c.ring}55`, display: 'block' }} />
                    <div className="zoom-hint"><span style={{ fontSize: 14 }}>🔍</span></div>
                </div>

                {/* Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontFamily: "'Montserrat',sans-serif", fontWeight: 800, fontSize: 13, color: '#0B1F3A', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginBottom: 2 }}>{item.judul}</p>
                    <p style={{ fontSize: 11, color: '#4A6A8A', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginBottom: 8 }}>{item.peserta}</p>

                    {/* Score pills 2x2 */}
                    <div className="lb-rank-card-scores">
                        {[
                            { label: 'Tema',    value: item.detail.tema },
                            { label: 'Kreatif', value: item.detail.kreativitas },
                            { label: 'Estetik', value: item.detail.estetik },
                            { label: 'Teknik',  value: item.detail.teknik },
                        ].map(s => (
                            <div key={s.label} className="lb-rank-score-pill">
                                <p style={{ fontSize: 9, color: '#6B8AAA', fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase', marginBottom: 2 }}>{s.label}</p>
                                <p style={{ fontFamily: "'Montserrat',sans-serif", fontWeight: 900, fontSize: 15, color: '#1565C0', lineHeight: 1 }}>{s.value}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Rata-rata */}
                <div style={{ flexShrink: 0, textAlign: 'center', marginLeft: 8 }}>
                    <p style={{ fontFamily: "'Montserrat',sans-serif", fontWeight: 900, fontSize: 22, color: isTop ? c.text : '#1565C0', lineHeight: 1 }}>{item.nilai_rata_rata}</p>
                    <ScoreBar value={(item.nilai_rata_rata / 100) * 100} rank={item.rank} />
                    <p style={{ fontSize: 9, color: '#8AACCC', marginTop: 4, fontWeight: 600 }}>{item.jumlah_juri} juri</p>
                </div>
            </div>
        </div>
    );
}

export default function AdminLeaderboard({ auth, rankings, pendingUsers = 0 }: Props) {
    const [ready, setReady] = useState(false);
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [preview, setPreview] = useState<PreviewItem | null>(null);

    useEffect(() => {
        const t = requestAnimationFrame(() => requestAnimationFrame(() => setReady(true)));
        return () => cancelAnimationFrame(t);
    }, []);

    const top3 = rankings.slice(0, 3);
    const podiumOrder = [top3[1], top3[0], top3[2]].filter(Boolean);
    const maxScore = rankings.length > 0 ? rankings[0].nilai_rata_rata : 100;
    const sidebarWidth = sidebarCollapsed ? 64 : 240;

    const openPreview = (item: RankItem) => setPreview({
        src: `/storage/${item.file_path}`, judul: item.judul,
        peserta: item.peserta, score: item.nilai_rata_rata, rank: item.rank,
    });

    const TABLE_COLS = [
        { label: '#',         icon: null },
        { label: 'Desain',    icon: <IconPalette size={11} /> },
        { label: 'Peserta',   icon: <IconUser size={11} /> },
        { label: 'Tema',      icon: <IconTag size={11} /> },
        { label: 'Kreatif',   icon: <IconBulb size={11} /> },
        { label: 'Estetik',   icon: <IconSparkles size={11} /> },
        { label: 'Teknik',    icon: <IconTool size={11} /> },
        { label: 'Rata-rata', icon: <IconChartBar size={11} /> },
        { label: 'Juri',      icon: <IconUserStar size={11} /> },
    ];

    return (
        <>
            <style>{STYLES}</style>
            {preview && <ImageModal item={preview} onClose={() => setPreview(null)} />}

            <div className={ready ? 'lb-ready' : ''} style={{ minHeight: '100vh', background: 'linear-gradient(170deg,#A8D8FF 0%,#C4E5FF 16%,#DDF1FF 38%,#CBE8FF 62%,#B0D8FF 100%)', position: 'relative' }}>

                {/* Orb blur */}
                <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none', overflow: 'hidden' }}>
                    {[
                        { w: 600, h: 600, top: '-200px', left: '-160px', c: 'radial-gradient(circle,rgba(14,165,233,0.15) 0%,transparent 62%)', dur: '24s', delay: '0s' },
                        { w: 480, h: 480, bottom: '-100px', right: '-120px', c: 'radial-gradient(circle,rgba(14,165,233,0.1) 0%,transparent 62%)', dur: '28s', delay: '-8s' },
                        { w: 360, h: 360, top: '40%', left: '38%', c: 'radial-gradient(circle,rgba(255,255,255,0.42) 0%,transparent 62%)', dur: '20s', delay: '-4s' },
                    ].map((b, i) => (
                        <div key={i} style={{ position: 'absolute', width: b.w, height: b.h, borderRadius: '50%', top: (b as any).top, left: (b as any).left, right: (b as any).right, bottom: (b as any).bottom, background: b.c, animation: `orb-drift ${b.dur} ease-in-out infinite`, animationDelay: b.delay }} />
                    ))}
                    <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', backgroundImage: 'radial-gradient(rgba(11,31,58,0.07) 1px,transparent 1px)', backgroundSize: '28px 28px' }} />
                </div>

                <AdminSidebar user={auth.user} activePage="leaderboard" pendingUsers={pendingUsers} onCollapse={setSidebarCollapsed} />

                {/* ── KEY FIX: marginLeft via CSS class ── */}
                <div className="lb-main-content" style={{ marginLeft: sidebarWidth, minHeight: '100vh', position: 'relative', zIndex: 1 }}>

                    {/* Mobile spacer */}
                    <div className="lb-mobile-spacer" />

                    {/* Top Bar — hidden on mobile */}
                    <div className="lb-topbar anim-top" style={{ position: 'sticky', top: 0, zIndex: 50, height: 62, background: 'rgba(14,100,180,0.55)', backdropFilter: 'blur(28px) saturate(180%)', WebkitBackdropFilter: 'blur(28px) saturate(180%)', borderBottom: '1px solid rgba(255,255,255,0.1)', padding: '0 clamp(20px,4vw,40px)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <Link href="/admin/dashboard" style={{ textDecoration: 'none', fontSize: 12, color: 'rgba(186,230,253,0.7)', fontFamily: "'Montserrat',sans-serif", fontWeight: 600, display: 'flex', alignItems: 'center', gap: 5 }}>
                                <IconLayoutDashboard size={13} /> Dashboard
                            </Link>
                            <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: 12 }}>/</span>
                            <h1 style={{ fontFamily: "'Montserrat',sans-serif", fontWeight: 800, fontSize: 'clamp(16px,2vw,20px)', color: '#fff', display: 'flex', alignItems: 'center', gap: 7 }}>
                                <IconTrophy size={18} color="#FCD34D" /> Leaderboard
                            </h1>
                            <span style={{ background: 'rgba(255,255,255,0.15)', color: '#BAE6FD', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 8, padding: '3px 10px', fontSize: 10, fontWeight: 700, fontFamily: "'Montserrat',sans-serif", letterSpacing: '.12em' }}>2026</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <div style={{ background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 20, padding: '6px 16px', display: 'flex', alignItems: 'center', gap: 6 }}>
                                <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#34D399', boxShadow: '0 0 6px rgba(52,211,153,0.8)', animation: 'blink-dot 2s infinite', display: 'inline-block' }} />
                                <span style={{ fontSize: 11, color: '#fff', fontWeight: 700, fontFamily: "'Montserrat',sans-serif", display: 'flex', alignItems: 'center', gap: 5 }}>
                                    <IconUsers size={12} /> {rankings.length} Peserta Dinilai
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="lb-content-pad" style={{ padding: 'clamp(24px,4vw,40px)' }}>

                        {/* Heading */}
                        <div className="anim-top delay-1" style={{ marginBottom: 32 }}>
                            <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.18em', textTransform: 'uppercase', color: '#0EA5E9', marginBottom: 8, fontFamily: "'Montserrat',sans-serif" }}>— PAPAN PERINGKAT —</p>
                            <h2 className="lb-heading" style={{ fontFamily: "'Montserrat',sans-serif", fontWeight: 800, fontSize: 'clamp(24px,3.5vw,38px)', color: '#08182E', lineHeight: 1.2, marginBottom: 10 }}>
                                Top <span className="lb-gradient-text">Leaderboard</span> <span className="crown">🏆</span>
                            </h2>
                            <p style={{ color: '#1A3A5C', fontSize: 14 }}>Klik gambar untuk preview · Ranking berdasarkan rata-rata penilaian semua juri</p>
                        </div>

                        {rankings.length === 0 ? (
                            <div style={{ background: 'rgba(255,255,255,0.72)', backdropFilter: 'blur(20px)', border: '1.5px solid rgba(255,255,255,0.88)', borderRadius: 24, padding: '80px 40px', textAlign: 'center', boxShadow: '0 6px 24px rgba(11,31,58,0.07)' }}>
                                <IconClipboardList size={56} color="rgba(14,165,233,0.3)" style={{ margin: '0 auto 16px' }} />
                                <p style={{ fontFamily: "'Montserrat',sans-serif", fontWeight: 800, fontSize: 20, color: '#0B1F3A', marginBottom: 8 }}>Belum ada penilaian yang masuk</p>
                                <p style={{ fontSize: 14, color: '#4A6A8A' }}>Penilaian dari juri akan muncul di sini setelah proses penjurian selesai.</p>
                            </div>
                        ) : (
                            <>
                                {/* ── PODIUM ── */}
                                {top3.length > 0 && (
                                    <div className="anim-bottom delay-2" style={{ background: 'rgba(255,255,255,0.72)', backdropFilter: 'blur(20px)', border: '1.5px solid rgba(255,255,255,0.88)', borderRadius: 24, padding: 'clamp(20px,3vw,40px)', boxShadow: '0 6px 24px rgba(11,31,58,0.07)', marginBottom: 24, overflow: 'hidden', position: 'relative' }}>
                                        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 120, background: 'linear-gradient(180deg,transparent,rgba(14,165,233,0.05))', pointerEvents: 'none' }} />
                                        <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.15em', textTransform: 'uppercase', color: '#1565C0', fontFamily: "'Montserrat',sans-serif", textAlign: 'center', marginBottom: 32 }}>— 🥇 TOP 3 TERBAIK —</p>
                                        <div className="lb-podium-inner" style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'center', gap: 'clamp(8px,3vw,32px)' }}>
                                            {podiumOrder.map((item, idx) => {
                                                const c = mc(item.rank);
                                                const isFirst = item.rank === 1;
                                                const imgSize = isFirst ? 80 : 60;
                                                const podiumH = item.rank === 1 ? 100 : item.rank === 2 ? 72 : 56;
                                                return (
                                                    <div key={item.id} className={`podium-card podium-anim pod-${idx}`} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
                                                        <span style={{ fontSize: isFirst ? 28 : 20 }}>{MEDAL[item.rank - 1]}</span>
                                                        <div className="img-trigger" style={{ position: 'relative', borderRadius: isFirst ? 18 : 14 }} onClick={() => openPreview(item)}>
                                                            <img src={`/storage/${item.file_path}`} alt={item.judul} style={{ width: imgSize, height: imgSize, borderRadius: isFirst ? 18 : 14, objectFit: 'cover', border: `3px solid ${c.ring}`, boxShadow: `0 8px 28px ${c.glow}`, display: 'block', animation: isFirst ? 'float-glow 3s ease-in-out infinite' : 'none' }} />
                                                            <div className="zoom-hint"><span>🔍</span></div>
                                                            <div style={{ position: 'absolute', bottom: -8, right: -8, width: 24, height: 24, borderRadius: '50%', background: c.ring, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 900, fontFamily: "'Montserrat',sans-serif", border: '2px solid #fff', boxShadow: `0 2px 8px ${c.glow}` }}>{item.rank}</div>
                                                        </div>
                                                        <div style={{ textAlign: 'center', maxWidth: 110 }}>
                                                            <p style={{ fontFamily: "'Montserrat',sans-serif", fontWeight: 800, fontSize: isFirst ? 13 : 11, color: '#0B1F3A', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginBottom: 2 }}>{item.peserta}</p>
                                                            <p style={{ fontSize: 9, color: '#4A6A8A', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginBottom: 8 }}>{item.judul}</p>
                                                            <div style={{ display: 'inline-block', background: c.badge, color: c.text, border: `1.5px solid ${c.ring}44`, borderRadius: 12, padding: isFirst ? '7px 16px' : '5px 12px', fontFamily: "'Montserrat',sans-serif", fontWeight: 900, fontSize: isFirst ? 22 : 17 }}>{item.nilai_rata_rata}</div>
                                                        </div>
                                                        <div style={{ width: isFirst ? 80 : 62, height: podiumH, background: `linear-gradient(180deg,${c.ring},${c.ring}bb)`, borderRadius: '10px 10px 0 0', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', paddingTop: 10, boxShadow: `0 -4px 16px ${c.glow}` }}>
                                                            <span style={{ fontSize: 11, fontWeight: 900, color: 'rgba(255,255,255,0.85)', fontFamily: "'Montserrat',sans-serif" }}>#{item.rank}</span>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}

                                {/* ── MOBILE: rank cards (shown on mobile, hidden on desktop) ── */}
                                <div className="lb-rank-cards anim-bottom delay-3">
                                    {rankings.map(item => (
                                        <MobileRankCard key={item.id} item={item} onPreview={openPreview} />
                                    ))}
                                </div>

                                {/* ── DESKTOP: Tabel (hidden on mobile) ── */}
                                <div className="lb-table-section anim-bottom delay-3" style={{ background: 'rgba(255,255,255,0.74)', backdropFilter: 'blur(20px)', border: '1.5px solid rgba(255,255,255,0.88)', borderRadius: 24, overflow: 'hidden', boxShadow: '0 6px 24px rgba(11,31,58,0.07)' }}>
                                    <div style={{ padding: '18px 24px', borderBottom: '1.5px solid rgba(14,165,233,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                        <p style={{ fontSize: 11, fontWeight: 700, color: '#0EA5E9', letterSpacing: '.15em', textTransform: 'uppercase', fontFamily: "'Montserrat',sans-serif", display: 'flex', alignItems: 'center', gap: 7 }}>
                                            <IconListNumbers size={15} /> — SEMUA PERINGKAT —
                                        </p>
                                        <p style={{ fontSize: 11, color: '#4A6A8A', fontFamily: "'Montserrat',sans-serif", fontWeight: 600 }}>{rankings.length} peserta</p>
                                    </div>
                                    <div className="lb-table-wrap" style={{ overflowX: 'auto' }}>
                                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                            <thead>
                                                <tr style={{ background: 'rgba(8,28,58,0.04)', borderBottom: '1.5px solid rgba(14,165,233,0.1)' }}>
                                                    {TABLE_COLS.map(({ label, icon }) => (
                                                        <th key={label} style={{ padding: '12px 16px', textAlign: ['Desain', 'Peserta', '#'].includes(label) ? 'left' : 'center', fontSize: 10, fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase', color: '#0B3A6A', fontFamily: "'Montserrat',sans-serif", whiteSpace: 'nowrap' }}>
                                                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>{icon}{label}</span>
                                                        </th>
                                                    ))}
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {rankings.map(item => {
                                                    const c = mc(item.rank);
                                                    const isTop = item.rank <= 3;
                                                    return (
                                                        <tr key={item.id} className="lb-row" style={{ borderBottom: '1px solid rgba(14,165,233,0.07)', background: isTop ? c.badge : 'transparent' }}>
                                                            <td style={{ padding: '14px 16px', width: 52 }}>
                                                                <div style={{ width: 32, height: 32, borderRadius: '50%', background: isTop ? c.ring : 'rgba(14,165,233,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: isTop ? 13 : 11, fontWeight: 900, color: isTop ? '#fff' : '#1565C0', fontFamily: "'Montserrat',sans-serif", boxShadow: isTop ? `0 2px 10px ${c.glow}` : 'none', flexShrink: 0 }}>
                                                                    {isTop ? MEDAL[item.rank - 1] : item.rank}
                                                                </div>
                                                            </td>
                                                            <td style={{ padding: '14px 16px' }}>
                                                                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                                                    <div className="img-trigger" style={{ width: 40, height: 40, borderRadius: 10, flexShrink: 0 }} onClick={() => openPreview(item)}>
                                                                        <img src={`/storage/${item.file_path}`} alt={item.judul} style={{ width: 40, height: 40, borderRadius: 10, objectFit: 'cover', border: `1.5px solid ${c.ring}44`, display: 'block' }} />
                                                                        <div className="zoom-hint"><span style={{ fontSize: 14 }}>🔍</span></div>
                                                                    </div>
                                                                    <span style={{ fontWeight: 700, color: '#0B1F3A', fontFamily: "'Montserrat',sans-serif", fontSize: 13, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 140 }}>{item.judul}</span>
                                                                </div>
                                                            </td>
                                                            <td style={{ padding: '14px 16px', fontSize: 13, color: '#1A3A5C', fontWeight: 600, whiteSpace: 'nowrap' }}>{item.peserta}</td>
                                                            {(['tema', 'kreativitas', 'estetik', 'teknik'] as const).map(key => (
                                                                <td key={key} style={{ padding: '14px 16px', textAlign: 'center' }}>
                                                                    <span style={{ fontFamily: "'Montserrat',sans-serif", fontWeight: 700, fontSize: 13, color: '#1A3A5C' }}>{item.detail[key]}</span>
                                                                </td>
                                                            ))}
                                                            <td style={{ padding: '14px 20px 14px 16px', minWidth: 110 }}>
                                                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5 }}>
                                                                    <span style={{ fontFamily: "'Montserrat',sans-serif", fontWeight: 900, fontSize: 15, color: isTop ? c.text : '#1565C0' }}>{item.nilai_rata_rata}</span>
                                                                    <ScoreBar value={(item.nilai_rata_rata / maxScore) * 100} rank={item.rank} />
                                                                </div>
                                                            </td>
                                                            <td style={{ padding: '14px 16px', textAlign: 'center' }}>
                                                                <span style={{ background: 'rgba(14,165,233,0.08)', border: '1px solid rgba(14,165,233,0.18)', color: '#1565C0', borderRadius: 999, padding: '3px 10px', fontSize: 10, fontWeight: 700, fontFamily: "'Montserrat',sans-serif", display: 'inline-flex', alignItems: 'center', gap: 4, whiteSpace: 'nowrap' }}>
                                                                    <IconUserStar size={11} /> {item.jumlah_juri} juri
                                                                </span>
                                                            </td>
                                                        </tr>
                                                    );
                                                })}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}