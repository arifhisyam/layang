import { Link } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import PesertaSidebar from '@/components/PesertaSidebar';
import {
    IconLayoutDashboard,
    IconCloudUpload,
    IconCircleCheck,
    IconClock,
    IconTrophy,
    IconArrowRight,
    IconBrush,
    IconBulb,
    IconSparkles,
    IconTool,
    IconPalette,
    IconHourglass,
    IconUserStar,
    IconFileDescription,
    IconDownload,
} from '@tabler/icons-react';

interface AuthUser { name: string; email: string; role: string; }
interface Juri { name: string; }
interface Score {
    id: number; tema: number; kreativitas: number; estetik: number;
    teknik: number; rata_rata: number; catatan: string | null; juri: Juri | null;
}
interface Design {
    id: number; judul: string; file_path: string; deskripsi: string | null; scores: Score[];
}
interface RankItem {
    rank: number; id: number; judul: string; file_path: string;
    peserta: string; user_id: number; nilai_rata_rata: number;
}
interface Props {
    auth: { user: AuthUser };
    designs: Design[];
    top_rankings: RankItem[];
    my_rank: RankItem | null;
}

const SCORE_CRITERIA = [
    { icon: IconBrush,    label: 'Tema',        key: 'tema',        color: '#6366F1' },
    { icon: IconBulb,     label: 'Kreativitas', key: 'kreativitas', color: '#EC4899' },
    { icon: IconSparkles, label: 'Estetik',     key: 'estetik',     color: '#F59E0B' },
    { icon: IconTool,     label: 'Teknik',      key: 'teknik',      color: '#10B981' },
] as const;

const PAGE_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700;800;900&family=Plus+Jakarta+Sans:wght@300;400;500;600&display=swap');

  @keyframes float-kite { 0%,100%{transform:translateY(0) rotate(-3deg)} 50%{transform:translateY(-10px) rotate(3deg)} }

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

  .pd-ready .anim-top    { animation: slideFromTop    0.55s cubic-bezier(0.22,1,0.36,1) both; }
  .pd-ready .anim-left   { animation: slideFromLeft   0.55s cubic-bezier(0.22,1,0.36,1) both; }
  .pd-ready .anim-right  { animation: slideFromRight  0.55s cubic-bezier(0.22,1,0.36,1) both; }
  .pd-ready .anim-bottom { animation: slideFromBottom 0.55s cubic-bezier(0.22,1,0.36,1) both; }
  .pd-ready .anim-pop    { animation: popIn           0.45s cubic-bezier(0.34,1.56,0.64,1) both; }

  .pd-ready .stat-0 { animation-delay: 0.10s; }
  .pd-ready .stat-1 { animation-delay: 0.18s; }
  .pd-ready .stat-2 { animation-delay: 0.26s; }
  .pd-ready .stat-3 { animation-delay: 0.34s; }

  .pd-ready .design-0 { animation-delay: 0.52s; }
  .pd-ready .design-1 { animation-delay: 0.62s; }
  .pd-ready .design-2 { animation-delay: 0.72s; }
  .pd-ready .design-3 { animation-delay: 0.82s; }
  .pd-ready .design-4 { animation-delay: 0.92s; }

  .pd-ready .pill-0 { animation-delay: 0.60s; }
  .pd-ready .pill-1 { animation-delay: 0.68s; }
  .pd-ready .pill-2 { animation-delay: 0.76s; }
  .pd-ready .pill-3 { animation-delay: 0.84s; }

  .pd-ready .delay-1 { animation-delay: 0.08s; }
  .pd-ready .delay-2 { animation-delay: 0.30s; }
  .pd-ready .delay-3 { animation-delay: 0.38s; }
  .pd-ready .delay-4 { animation-delay: 0.46s; }

  .anim-top, .anim-left, .anim-right, .anim-bottom, .anim-pop { opacity: 0; }

  .pd-page { font-family:'Plus Jakarta Sans',sans-serif; }

  .pd-stat {
    background: rgba(255,255,255,0.7);
    backdrop-filter: blur(16px);
    border: 1px solid rgba(255,255,255,0.9);
    border-radius: 20px; padding: 22px 20px;
    transition: transform .22s ease, box-shadow .22s ease;
  }
  .pd-stat:hover { transform: translateY(-4px); box-shadow: 0 16px 40px rgba(14,100,180,0.14); }

  .pd-card {
    background: rgba(255,255,255,0.75);
    backdrop-filter: blur(20px);
    border: 1px solid rgba(255,255,255,0.9);
    border-radius: 24px; overflow: hidden;
  }

  .pd-design-card {
    background: rgba(255,255,255,0.8);
    backdrop-filter: blur(12px);
    border: 1px solid rgba(255,255,255,0.9);
    border-radius: 20px; overflow: hidden;
    transition: transform .22s ease, box-shadow .22s ease;
  }
  .pd-design-card:hover { transform: translateY(-3px); box-shadow: 0 20px 48px rgba(14,100,180,0.13); }

  .pd-score-pill {
    background: linear-gradient(135deg, #EFF8FF, #DBEFFE);
    border: 1px solid rgba(14,165,233,0.2);
    border-radius: 14px; padding: 12px 10px; text-align: center;
  }

  .pd-download-banner {
    background: linear-gradient(135deg, #0B3D7C 0%, #0E64B4 50%, #0EA5E9 100%);
    border-radius: 24px; padding: 28px 32px; position: relative; overflow: hidden;
  }
  .pd-download-banner::before {
    content:''; position:absolute; top:-40px; right:-40px;
    width:180px; height:180px; border-radius:50%; background: rgba(255,255,255,0.06);
  }
  .pd-download-banner::after {
    content:''; position:absolute; bottom:-60px; right:80px;
    width:120px; height:120px; border-radius:50%; background: rgba(255,255,255,0.04);
  }

  .pd-rank-banner { border-radius: 24px; padding: 24px 28px; position: relative; overflow: hidden; }

  .pd-main::-webkit-scrollbar { width: 5px; }
  .pd-main::-webkit-scrollbar-track { background: transparent; }
  .pd-main::-webkit-scrollbar-thumb { background: rgba(14,100,180,0.2); border-radius: 10px; }

  /* ── KEY FIX: reset margin-left on mobile so sidebar space disappears ── */
  @media (max-width: 768px) {
    .pd-main { margin-left: 0 !important; padding-bottom: 80px !important; }
    .pd-mobile-spacer { height: 56px; }
    .pd-stat { padding: 16px; }
    .pd-design-card > div { flex-direction: column !important; }
    .pd-design-card > div > div:first-child { width: 100% !important; height: 180px; }
    .pd-download-banner { padding: 20px 18px; }
    .pd-stat-grid { grid-template-columns: repeat(2, 1fr) !important; }
    .pd-score-grid { grid-template-columns: repeat(2, 1fr) !important; }
  }
  @media (max-width: 480px) {
    .pd-score-grid { grid-template-columns: repeat(2, 1fr) !important; }
  }
`;

export default function PesertaDashboard({ auth, designs, top_rankings, my_rank }: Props) {
    const [ready, setReady] = useState(false);

    useEffect(() => {
        const t = requestAnimationFrame(() => {
            requestAnimationFrame(() => setReady(true));
        });
        return () => cancelAnimationFrame(t);
    }, []);

    const sudahDinilai = designs.filter(d => d.scores?.length > 0);
    const belumDinilai = designs.filter(d => d.scores?.length === 0);

    const rankGradient = (rank: number) =>
        rank === 1 ? 'linear-gradient(135deg, #F59E0B, #EF8C07)' :
        rank === 2 ? 'linear-gradient(135deg, #94A3B8, #64748B)' :
        rank === 3 ? 'linear-gradient(135deg, #D97706, #B45309)' :
        'linear-gradient(135deg, #0EA5E9, #1565C0)';

    const STAT_ITEMS = [
        { Icon: IconCloudUpload, label: 'Total Upload',   value: designs.length,                     color: '#0EA5E9', bg: 'rgba(14,165,233,0.1)' },
        { Icon: IconCircleCheck, label: 'Sudah Dinilai',  value: sudahDinilai.length,                color: '#10B981', bg: 'rgba(16,185,129,0.1)' },
        { Icon: IconClock,       label: 'Menunggu Nilai', value: belumDinilai.length,                color: '#F59E0B', bg: 'rgba(245,158,11,0.1)' },
        { Icon: IconTrophy,      label: 'Posisimu',       value: my_rank ? `#${my_rank.rank}` : '—', color: '#6366F1', bg: 'rgba(99,102,241,0.1)', link: '/peserta/leaderboard' },
    ] as const;

    return (
        <>
            <style>{PAGE_STYLES}</style>
            <div className={`pd-page min-h-screen flex${ready ? ' pd-ready' : ''}`}
                style={{ background: 'linear-gradient(150deg, #EFF8FF 0%, #DBEFFE 40%, #E0EFFE 100%)' }}>

                <PesertaSidebar user={auth.user} activePage="dashboard" />

                {/* margin-left ditangani via CSS .pd-main, bukan inline style,
                    supaya media query bisa override ke 0 di mobile */}
                <main className="pd-main flex-1 min-w-0 overflow-y-auto" style={{ padding: 0 }}>
                    <div className="pd-mobile-spacer" />
                    <div style={{ maxWidth: 900, margin: '0 auto', padding: '36px 24px 60px' }}>

                        {/* ══ HEADER ══ */}
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
                                    <h1 style={{ fontFamily: "'Montserrat',sans-serif", fontWeight: 900, fontSize: 22, color: '#0B1F3A', lineHeight: 1.2 }}>
                                        Halo, {auth.user.name}! 👋
                                    </h1>
                                    <p style={{ fontSize: 13, color: '#6B8AAA', fontWeight: 500, marginTop: 2 }}>
                                        Kompetisi Desain Layang-Layang 2026 · Panel Peserta
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* ══ STAT CARDS ══ */}
                        <div className="pd-stat-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 28 }}>
                            {STAT_ITEMS.map((s, i) => (
                                <div key={i} className={`pd-stat anim-right stat-${i}`}>
                                    <div style={{ width: 40, height: 40, borderRadius: 12, background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}>
                                        <s.Icon size={20} color={s.color} />
                                    </div>
                                    <p style={{ fontFamily: "'Montserrat',sans-serif", fontWeight: 900, fontSize: 26, color: s.color, lineHeight: 1 }}>{s.value}</p>
                                    <p style={{ fontSize: 11, color: '#8AACCC', fontWeight: 600, marginTop: 4, textTransform: 'uppercase', letterSpacing: '.08em' }}>{s.label}</p>
                                    {'link' in s && s.link && (
                                        <Link href={s.link} style={{ display: 'inline-flex', alignItems: 'center', gap: 4, marginTop: 8, fontSize: 11, color: s.color, fontWeight: 700, textDecoration: 'none' }}>
                                            Lihat <IconArrowRight size={12} />
                                        </Link>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* ══ RANK BANNER ══ */}
                        {my_rank && (
                            <div className="pd-rank-banner anim-left delay-2"
                                style={{ background: rankGradient(my_rank.rank), marginBottom: 28 }}>
                                <div style={{ position: 'absolute', top: 0, right: 0, bottom: 0, width: 200, background: 'rgba(255,255,255,0.05)', clipPath: 'polygon(30% 0%, 100% 0%, 100% 100%, 0% 100%)' }} />
                                <div style={{ display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap', position: 'relative' }}>
                                    <div style={{ fontFamily: "'Montserrat',sans-serif", fontWeight: 900, fontSize: 52, color: 'rgba(255,255,255,0.25)', lineHeight: 1 }}>
                                        #{my_rank.rank}
                                    </div>
                                    <img src={`/storage/${my_rank.file_path}`} alt={my_rank.judul}
                                        style={{ width: 64, height: 64, borderRadius: 16, objectFit: 'cover', border: '3px solid rgba(255,255,255,0.35)', flexShrink: 0 }} />
                                    <div style={{ flex: 1, minWidth: 140 }}>
                                        <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.65)', fontWeight: 700, letterSpacing: '.14em', textTransform: 'uppercase', marginBottom: 4 }}>Posisimu di Leaderboard</p>
                                        <p style={{ fontFamily: "'Montserrat',sans-serif", fontWeight: 800, fontSize: 17, color: '#fff', lineHeight: 1.2 }}>{my_rank.judul}</p>
                                        <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.75)', marginTop: 4 }}>Nilai rata-rata: <strong>{my_rank.nilai_rata_rata}</strong></p>
                                    </div>
                                    <Link href="/peserta/leaderboard" style={{
                                        display: 'inline-flex', alignItems: 'center', gap: 6,
                                        background: 'rgba(255,255,255,0.2)', border: '1px solid rgba(255,255,255,0.35)',
                                        color: '#fff', fontFamily: "'Montserrat',sans-serif", fontWeight: 700, fontSize: 13,
                                        padding: '10px 20px', borderRadius: 12, textDecoration: 'none',
                                        backdropFilter: 'blur(8px)', transition: 'background .2s', flexShrink: 0,
                                    }}>
                                        <IconTrophy size={15} /> Leaderboard
                                    </Link>
                                </div>
                            </div>
                        )}

                        {/* ══ DOWNLOAD JUKNIS ══ */}
                        <div className="pd-download-banner anim-right delay-3" style={{ marginBottom: 28 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap', position: 'relative', zIndex: 1 }}>
                                <div className="anim-pop delay-3" style={{
                                    width: 56, height: 56, borderRadius: 16,
                                    background: 'rgba(255,255,255,0.15)', border: '1.5px solid rgba(255,255,255,0.25)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                                    backdropFilter: 'blur(8px)',
                                }}>
                                    <IconFileDescription size={26} color="#fff" />
                                </div>
                                <div style={{ flex: 1, minWidth: 180 }}>
                                    <p style={{ fontFamily: "'Montserrat',sans-serif", fontWeight: 800, fontSize: 16, color: '#fff', marginBottom: 4 }}>
                                        Juknis Lomba Desain Layang-Layang 2026
                                    </p>
                                    <p style={{ fontSize: 13, color: 'rgba(186,230,253,0.8)', fontWeight: 400 }}>
                                        Download petunjuk teknis lengkap sebelum mengikuti kompetisi.
                                    </p>
                                </div>
                                <a href="/storage/juknis/juknis-layang-layang-2026.pdf" download target="_blank" rel="noopener noreferrer"
                                    style={{
                                        display: 'inline-flex', alignItems: 'center', gap: 8,
                                        background: '#fff', color: '#0B3D7C',
                                        fontFamily: "'Montserrat',sans-serif", fontWeight: 800, fontSize: 13,
                                        padding: '12px 22px', borderRadius: 14, textDecoration: 'none',
                                        boxShadow: '0 4px 20px rgba(0,0,0,0.15)', flexShrink: 0,
                                        transition: 'transform .2s, box-shadow .2s',
                                    }}
                                    onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.transform = 'translateY(-2px)'; (e.currentTarget as HTMLAnchorElement).style.boxShadow = '0 8px 28px rgba(0,0,0,0.2)'; }}
                                    onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.transform = ''; (e.currentTarget as HTMLAnchorElement).style.boxShadow = '0 4px 20px rgba(0,0,0,0.15)'; }}
                                >
                                    <IconDownload size={16} /> Download Juknis
                                </a>
                            </div>
                        </div>

                        {/* ══ DESAIN SECTION ══ */}
                        <div className="anim-bottom delay-4">
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
                                <div className="anim-pop delay-4" style={{
                                    width: 38, height: 38, borderRadius: 12,
                                    background: 'linear-gradient(135deg, #6366F1, #4338CA)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                                }}>
                                    <IconPalette size={18} color="#fff" />
                                </div>
                                <h2 style={{ fontFamily: "'Montserrat',sans-serif", fontWeight: 800, fontSize: 18, color: '#0B1F3A' }}>
                                    Desain & Hasil Penilaian
                                </h2>
                                <span style={{ marginLeft: 'auto', background: 'rgba(14,165,233,0.12)', color: '#0EA5E9', borderRadius: 999, padding: '4px 14px', fontSize: 12, fontWeight: 700, fontFamily: "'Montserrat',sans-serif" }}>
                                    {designs.length} desain
                                </span>
                            </div>

                            {designs.length === 0 ? (
                                <div className="pd-card" style={{ padding: '60px 40px', textAlign: 'center' }}>
                                    <div style={{ fontSize: 56, marginBottom: 16, animation: 'float-kite 3s ease-in-out infinite' }}>🪁</div>
                                    <p style={{ fontFamily: "'Montserrat',sans-serif", fontWeight: 800, fontSize: 18, color: '#0B1F3A', marginBottom: 8 }}>Belum Ada Desain</p>
                                    <p style={{ fontSize: 14, color: '#8AACCC' }}>Belum ada desain yang terdaftar untuk akunmu.</p>
                                </div>
                            ) : (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                                    {designs.map((d, idx) => {
                                        const dir = idx % 2 === 0 ? 'anim-left' : 'anim-right';
                                        return (
                                            <div key={d.id} className={`pd-design-card ${dir} design-${Math.min(idx, 4)}`}>
                                                <div style={{ display: 'flex', flexDirection: 'row' }}>
                                                    {/* Image */}
                                                    <div style={{ width: 200, flexShrink: 0, position: 'relative', overflow: 'hidden' }}>
                                                        <img src={`/storage/${d.file_path}`} alt={d.judul}
                                                            style={{ width: '100%', height: '100%', minHeight: 200, objectFit: 'cover', display: 'block' }} />
                                                        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, transparent 60%, rgba(255,255,255,0.3))' }} />
                                                    </div>

                                                    {/* Content */}
                                                    <div style={{ flex: 1, padding: '24px 24px 24px 22px' }}>
                                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                                                            <div>
                                                                <h3 style={{ fontFamily: "'Montserrat',sans-serif", fontWeight: 800, fontSize: 16, color: '#0B1F3A', marginBottom: 4 }}>{d.judul}</h3>
                                                                {d.deskripsi && <p style={{ fontSize: 12, color: '#8AACCC', lineHeight: 1.5 }}>{d.deskripsi}</p>}
                                                            </div>
                                                            {d.scores?.length > 0 ? (
                                                                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, background: 'rgba(16,185,129,0.1)', color: '#10B981', border: '1px solid rgba(16,185,129,0.25)', borderRadius: 999, padding: '4px 12px', fontSize: 11, fontWeight: 700, flexShrink: 0, marginLeft: 12 }}>
                                                                    <IconCircleCheck size={13} /> Sudah Dinilai
                                                                </span>
                                                            ) : (
                                                                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, background: 'rgba(245,158,11,0.1)', color: '#D97706', border: '1px solid rgba(245,158,11,0.25)', borderRadius: 999, padding: '4px 12px', fontSize: 11, fontWeight: 700, flexShrink: 0, marginLeft: 12 }}>
                                                                    <IconClock size={13} /> Menunggu
                                                                </span>
                                                            )}
                                                        </div>

                                                        {d.scores?.length > 0 ? (
                                                            d.scores.map(s => (
                                                                <div key={s.id}>
                                                                    <p style={{ fontSize: 11, color: '#8AACCC', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
                                                                        <IconUserStar size={13} color="#6366F1" />
                                                                        Dinilai oleh: <strong style={{ color: '#4A6A8A' }}>{s.juri?.name ?? '—'}</strong>
                                                                    </p>

                                                                    {/* Score pills */}
                                                                    <div className="pd-score-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, marginBottom: 14 }}>
                                                                        {SCORE_CRITERIA.map((c, ci) => (
                                                                            <div key={c.key} className={`pd-score-pill anim-bottom pill-${ci}`}>
                                                                                <c.icon size={16} color={c.color} style={{ display: 'block', marginBottom: 4, margin: '0 auto 4px' }} />
                                                                                <p style={{ fontSize: 10, color: '#8AACCC', marginBottom: 2, fontWeight: 600 }}>{c.label}</p>
                                                                                <p style={{ fontFamily: "'Montserrat',sans-serif", fontWeight: 900, fontSize: 20, color: c.color }}>{s[c.key]}</p>
                                                                            </div>
                                                                        ))}
                                                                    </div>

                                                                    <div style={{
                                                                        background: 'linear-gradient(135deg, #10B981, #059669)',
                                                                        borderRadius: 14, padding: '14px 18px',
                                                                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                                                        marginBottom: s.catatan ? 12 : 0,
                                                                    }}>
                                                                        <div>
                                                                            <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.75)', fontWeight: 600, marginBottom: 2 }}>Nilai Rata-rata</p>
                                                                            <p style={{ fontFamily: "'Montserrat',sans-serif", fontWeight: 900, fontSize: 32, color: '#fff', lineHeight: 1 }}>{s.rata_rata}</p>
                                                                        </div>
                                                                        <div style={{ textAlign: 'right' }}>
                                                                            <IconTrophy size={32} color="rgba(255,255,255,0.3)" />
                                                                            <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)' }}>dari 100</p>
                                                                        </div>
                                                                    </div>

                                                                    {s.catatan && (
                                                                        <div style={{ background: 'rgba(99,102,241,0.06)', border: '1px solid rgba(99,102,241,0.15)', borderLeft: '3px solid #6366F1', borderRadius: '0 12px 12px 0', padding: '12px 16px' }}>
                                                                            <p style={{ fontSize: 10, color: '#6366F1', fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', marginBottom: 4 }}>Catatan Juri</p>
                                                                            <p style={{ fontSize: 13, color: '#4A6A8A', fontStyle: 'italic' }}>"{s.catatan}"</p>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            ))
                                                        ) : (
                                                            <div style={{ background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.2)', borderRadius: 14, padding: '16px 18px', display: 'flex', alignItems: 'center', gap: 12 }}>
                                                                <IconHourglass size={22} color="#D97706" />
                                                                <p style={{ fontSize: 13, color: '#92682B' }}>Desainmu sedang menunggu penilaian dari juri. Tetap semangat! 💪</p>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>

                    </div>
                </main>
            </div>
        </>
    );
}