import { useState, useEffect } from 'react';
import { Link } from '@inertiajs/react';
import JuriSidebar from '@/components/JuriSidebar';
import {
    IconCircleCheck,
    IconClock,
    IconPhoto,
    IconStar,
    IconEdit,
    IconLock,
    IconUser,
    IconChevronRight,
    IconTrendingUp,
    IconLayoutGrid,
} from '@tabler/icons-react';

interface AuthUser {
    name: string;
    email: string;
    role: string;
}

interface Score {
    id: number;
    rata_rata: number;
    juri_id: number;
}

interface Design {
    id: number;
    judul: string;
    file_path: string;
    user: { name: string } | null;
    scores: Score[];
}

interface Props {
    auth: { user: AuthUser & { id: number } };
    designs: Design[];
}

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700;800;900&family=Plus+Jakarta+Sans:wght@300;400;500;600&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Plus Jakarta Sans', sans-serif; -webkit-font-smoothing: antialiased; }
  ::-webkit-scrollbar { width: 5px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: rgba(14,100,180,0.2); border-radius: 10px; }

  /* ── Base animation keyframes — sama persis dengan referensi ── */
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
  @keyframes shimmer    { 0%{background-position:0% 50%} 50%{background-position:100% 50%} 100%{background-position:0% 50%} }
  @keyframes orb-drift  { 0%,100%{transform:translate(0,0)} 33%{transform:translate(20px,-14px)} 66%{transform:translate(-16px,18px)} }

  /* ── Animation classes — active only when .pd-ready on parent ── */
  .pd-ready .anim-top    { animation: slideFromTop    0.55s cubic-bezier(0.22,1,0.36,1) both; }
  .pd-ready .anim-left   { animation: slideFromLeft   0.55s cubic-bezier(0.22,1,0.36,1) both; }
  .pd-ready .anim-right  { animation: slideFromRight  0.55s cubic-bezier(0.22,1,0.36,1) both; }
  .pd-ready .anim-bottom { animation: slideFromBottom 0.55s cubic-bezier(0.22,1,0.36,1) both; }
  .pd-ready .anim-pop    { animation: popIn 0.45s cubic-bezier(0.34,1.56,0.64,1) both; }

  /* ── Stat card stagger ── */
  .pd-ready .stat-0 { animation-delay: 0.10s; }
  .pd-ready .stat-1 { animation-delay: 0.18s; }
  .pd-ready .stat-2 { animation-delay: 0.26s; }

  /* ── Design card stagger ── */
  .pd-ready .card-0 { animation-delay: 0.42s; }
  .pd-ready .card-1 { animation-delay: 0.52s; }
  .pd-ready .card-2 { animation-delay: 0.62s; }
  .pd-ready .card-3 { animation-delay: 0.72s; }
  .pd-ready .card-4 { animation-delay: 0.82s; }

  /* ── Section delays ── */
  .pd-ready .delay-1 { animation-delay: 0.08s; }
  .pd-ready .delay-2 { animation-delay: 0.30s; }
  .pd-ready .delay-3 { animation-delay: 0.38s; }
  .pd-ready .delay-4 { animation-delay: 0.46s; }

  /* ── Before ready: hidden ── */
  .anim-top, .anim-left, .anim-right, .anim-bottom, .anim-pop { opacity: 0; }

  .gradient-text-sky {
    background: linear-gradient(135deg, #0A2F5E 0%, #1565C0 32%, #0EA5E9 62%, #38BDF8 100%);
    background-size: 280%;
    -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
    animation: shimmer 7s ease infinite;
  }

  .jd-page { font-family: 'Plus Jakarta Sans', sans-serif; }

  /* ── Sidebar collapse responsive ── */
  .jd-main {
    transition: margin-left 0.35s cubic-bezier(0.22,1,0.36,1);
  }

  .design-card {
    background: rgba(255,255,255,0.72);
    backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);
    border: 1.5px solid rgba(255,255,255,0.88);
    border-radius: 22px;
    overflow: hidden;
    box-shadow: 0 4px 18px rgba(11,31,58,0.07);
    transition: transform .32s cubic-bezier(.34,1.4,.64,1), box-shadow .32s ease, border-color .22s ease;
  }
  .design-card:hover {
    transform: translateY(-6px) scale(1.01);
    box-shadow: 0 20px 48px rgba(11,31,58,0.14);
    border-color: rgba(14,165,233,0.3);
  }
  .design-card img { transition: transform .4s ease; }
  .design-card:hover img { transform: scale(1.04); }

  .nilai-btn {
    display: flex; align-items: center; justify-content: center; gap: 7px;
    text-align: center;
    background: linear-gradient(135deg, #1565C0, #0EA5E9);
    color: #fff; padding: 11px 22px; border-radius: 999px;
    font-family: 'Montserrat', sans-serif; font-weight: 700; font-size: 13px;
    letter-spacing: .06em; text-decoration: none;
    box-shadow: 0 4px 14px rgba(14,165,233,0.35);
    transition: all .22s ease;
  }
  .nilai-btn:hover { box-shadow: 0 8px 24px rgba(14,165,233,0.5); transform: translateY(-1px); }

  .edit-btn {
    display: flex; align-items: center; justify-content: center; gap: 7px;
    text-align: center;
    background: rgba(245,158,11,0.1);
    color: #D97706; padding: 11px 22px; border-radius: 999px;
    font-family: 'Montserrat', sans-serif; font-weight: 700; font-size: 13px;
    letter-spacing: .06em; text-decoration: none;
    border: 1.5px solid rgba(245,158,11,0.35);
    transition: all .22s ease;
  }
  .edit-btn:hover { background: rgba(245,158,11,0.18); transform: translateY(-1px); box-shadow: 0 6px 18px rgba(245,158,11,0.2); }

  .locked-box {
    display: flex; align-items: center; gap: 10px;
    background: rgba(148,163,184,0.1);
    border: 1.5px solid rgba(148,163,184,0.25);
    border-radius: 14px; padding: 12px 16px;
  }

  @media (max-width: 768px) {
    .jd-main { margin-left: 0 !important; }
    .designs-grid { grid-template-columns: 1fr !important; }
  }
`;

export default function JuriDesigns({ auth, designs }: Props) {
    const [ready, setReady] = useState(false);
    const [sidebarCollapsed, setSidebarCollapsed] = useState(() =>
    typeof window !== 'undefined'
        ? localStorage.getItem('juri-sidebar-collapsed') === 'true'
        : false
);

    // Trigger animasi setelah mount — sama persis dengan referensi
    useEffect(() => {
        const t = requestAnimationFrame(() => {
            requestAnimationFrame(() => setReady(true));
        });
        return () => cancelAnimationFrame(t);
    }, []);

    // Listen to sidebar collapse state via custom event
     useEffect(() => {
        const handler = (e: CustomEvent) => {
            if (e.detail?.storageKey === 'juri-sidebar-collapsed') {
                setSidebarCollapsed(e.detail?.collapsed ?? false);
            }
        };
        window.addEventListener('sidebarToggle', handler as EventListener);
        return () => window.removeEventListener('sidebarToggle', handler as EventListener);
    }, []);

    const currentJuriId = auth.user.id;

    const dinilaiJuriLain = (d: Design) =>
        d.scores?.some(s => s.juri_id !== currentJuriId) ?? false;

    const dinilaiSendiri = (d: Design) =>
        d.scores?.some(s => s.juri_id === currentJuriId) ?? false;

    const getSkorSendiri = (d: Design) =>
        d.scores?.find(s => s.juri_id === currentJuriId)?.rata_rata ?? null;

    const getSkorJuriLain = (d: Design) =>
        d.scores?.find(s => s.juri_id !== currentJuriId)?.rata_rata ?? null;

    const belumDinilai = designs.filter(d => !dinilaiSendiri(d) && !dinilaiJuriLain(d));
    const sudahDinilai = designs.filter(d => dinilaiSendiri(d));
    const terkunci = designs.filter(d => !dinilaiSendiri(d) && dinilaiJuriLain(d));

    const sidebarWidth = sidebarCollapsed ? 64 : 240;

    return (
        <>
            <style>{STYLES}</style>

            <div
                className={`jd-page min-h-screen${ready ? ' pd-ready' : ''}`}
                style={{ background: 'linear-gradient(150deg, #EFF8FF 0%, #DBEFFE 40%, #E0EFFE 100%)', position: 'relative' }}
            >
                {/* Orbs */}
                <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none', overflow: 'hidden' }}>
                    {[
                        { w: 600, h: 600, top: '-200px', left: '-160px', c: 'radial-gradient(circle, rgba(14,165,233,0.15) 0%, transparent 62%)', dur: '24s', delay: '0s' },
                        { w: 480, h: 480, bottom: '-100px', right: '-120px', c: 'radial-gradient(circle, rgba(14,165,233,0.1) 0%, transparent 62%)', dur: '28s', delay: '-8s' },
                    ].map((b, i) => (
                        <div key={i} style={{ position: 'absolute', width: b.w, height: b.h, borderRadius: '50%', top: (b as any).top, left: (b as any).left, right: (b as any).right, bottom: (b as any).bottom, background: b.c, animation: `orb-drift ${b.dur} ease-in-out infinite`, animationDelay: b.delay }} />
                    ))}
                    <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none', backgroundImage: 'radial-gradient(rgba(11,31,58,0.07) 1px, transparent 1px)', backgroundSize: '28px 28px' }} />
                </div>

                {/* Sidebar */}
                <JuriSidebar
                    user={auth.user}
                    activePage="penilaian"
                    belumDinilai={belumDinilai.length}
                />

                {/* Main */}
                <div
                    className="jd-main"
                    style={{
                        marginLeft: sidebarWidth,
                        minHeight: '100vh',
                        position: 'relative',
                        zIndex: 1,
                        transition: 'margin-left 0.35s cubic-bezier(0.22,1,0.36,1)',
                    }}
                >
                    {/* Top Bar — anim-top */}
                    <div className="anim-top delay-1" style={{ position: 'sticky', top: 0, zIndex: 50, background: 'rgba(14,100,180,0.75)', backdropFilter: 'blur(28px) saturate(180%)', WebkitBackdropFilter: 'blur(28px) saturate(180%)', borderBottom: '1px solid rgba(255,255,255,0.12)', padding: '0 clamp(20px,4vw,40px)', height: 62, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <Link href="/juri/dashboard" style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 600, fontSize: 13, color: 'rgba(186,230,253,0.7)', textDecoration: 'none' }}>Dashboard</Link>
                            <IconChevronRight size={14} color="rgba(186,230,253,0.4)" />
                            <div className="anim-pop delay-1" style={{ width: 28, height: 28, borderRadius: 8, background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <IconLayoutGrid size={14} color="rgba(186,230,253,0.9)" />
                            </div>
                            <h1 style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 800, fontSize: 'clamp(15px,2vw,18px)', color: '#fff' }}>Penilaian Desain</h1>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            {terkunci.length > 0 && (
                                <span style={{ display: 'flex', alignItems: 'center', gap: 5, background: 'rgba(148,163,184,0.2)', border: '1px solid rgba(148,163,184,0.4)', color: '#CBD5E1', borderRadius: 20, padding: '5px 14px', fontSize: 11, fontWeight: 700, fontFamily: "'Montserrat', sans-serif" }}>
                                    <IconLock size={12} /> {terkunci.length} Terkunci
                                </span>
                            )}
                            <span style={{ display: 'flex', alignItems: 'center', gap: 5, background: 'rgba(245,158,11,0.2)', border: '1px solid rgba(245,158,11,0.4)', color: '#FDE68A', borderRadius: 20, padding: '5px 14px', fontSize: 11, fontWeight: 700, fontFamily: "'Montserrat', sans-serif" }}>
                                <IconClock size={12} /> {belumDinilai.length} Belum Dinilai
                            </span>
                            <span style={{ display: 'flex', alignItems: 'center', gap: 5, background: 'rgba(16,185,129,0.2)', border: '1px solid rgba(16,185,129,0.4)', color: '#6EE7B7', borderRadius: 20, padding: '5px 14px', fontSize: 11, fontWeight: 700, fontFamily: "'Montserrat', sans-serif" }}>
                                <IconCircleCheck size={12} /> {sudahDinilai.length} Selesai
                            </span>
                        </div>
                    </div>

                    {/* Content */}
                    <div style={{ maxWidth: 1100, margin: '0 auto', padding: 'clamp(24px,4vw,40px)' }}>

                        {/* Header — dari atas */}
                        <div className="anim-top delay-1" style={{ marginBottom: 32 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                                <div className="anim-pop delay-1" style={{
                                    width: 48, height: 48, borderRadius: 16,
                                    background: 'linear-gradient(135deg, #0EA5E9, #1565C0)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    boxShadow: '0 8px 24px rgba(14,165,233,0.35)',
                                }}>
                                    <IconLayoutGrid size={22} color="#fff" />
                                </div>
                                <div>
                                    <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.18em', textTransform: 'uppercase', color: '#0EA5E9', marginBottom: 4, fontFamily: "'Montserrat', sans-serif" }}>— PENILAIAN —</p>
                                    <h2 style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 800, fontSize: 'clamp(20px,3.5vw,32px)', color: '#08182E', lineHeight: 1.2 }}>
                                        Desain <span className="gradient-text-sky">Peserta</span>
                                    </h2>
                                </div>
                                <span style={{ marginLeft: 'auto', background: 'rgba(14,165,233,0.12)', color: '#0EA5E9', borderRadius: 999, padding: '4px 14px', fontSize: 12, fontWeight: 700, fontFamily: "'Montserrat', sans-serif" }}>
                                    {designs.length} karya
                                </span>
                            </div>
                            <p style={{ color: '#1A3A5C', fontSize: 14, marginTop: 12 }}>
                                Nilai setiap desain dengan teliti — <strong>{designs.length}</strong> total karya terdaftar.
                            </p>
                        </div>

                        {/* Info banner — dari kiri */}
                        <div className="anim-left delay-2" style={{ background: 'rgba(14,165,233,0.08)', border: '1.5px solid rgba(14,165,233,0.22)', borderRadius: 16, padding: '14px 20px', marginBottom: 28, display: 'flex', alignItems: 'center', gap: 12 }}>
                            <IconLock size={18} color="#0EA5E9" style={{ flexShrink: 0 }} />
                            <p style={{ fontSize: 13, color: '#1A3A5C', fontFamily: "'Montserrat', sans-serif", fontWeight: 600 }}>
                                Setiap karya dinilai oleh <strong style={{ color: '#1565C0' }}>satu juri saja</strong>. Jika juri lain sudah menilai lebih dahulu, kartu akan terkunci dan tidak dapat dinilai ulang.
                            </p>
                        </div>

                        {/* Progress bar — dari kanan */}
                        {designs.length > 0 && (
                            <div className="anim-right delay-3" style={{ background: 'rgba(255,255,255,0.72)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', border: '1.5px solid rgba(255,255,255,0.88)', borderRadius: 18, padding: '20px 28px', marginBottom: 32, boxShadow: '0 4px 18px rgba(11,31,58,0.06)', display: 'flex', alignItems: 'center', gap: 20 }}>
                                <IconTrendingUp size={22} color="#1565C0" style={{ flexShrink: 0 }} />
                                <div style={{ flex: 1 }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                                        <span style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 700, fontSize: 12, color: '#1565C0', letterSpacing: '.08em', textTransform: 'uppercase' }}>Progress Penilaian (Kamu)</span>
                                        <span style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 900, fontSize: 20, color: '#1565C0' }}>
                                            {designs.length > 0 ? Math.round(((sudahDinilai.length) / designs.length) * 100) : 0}%
                                        </span>
                                    </div>
                                    <div style={{ background: 'rgba(14,165,233,0.12)', borderRadius: 8, height: 10, overflow: 'hidden' }}>
                                        <div style={{ width: `${designs.length > 0 ? Math.round((sudahDinilai.length / designs.length) * 100) : 0}%`, height: '100%', background: 'linear-gradient(90deg, #0EA5E9, #1565C0)', borderRadius: 8, transition: 'width 1.2s ease' }} />
                                    </div>
                                </div>
                                <div style={{ textAlign: 'center', flexShrink: 0 }}>
                                    <p style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 900, fontSize: 28, color: '#059669', lineHeight: 1 }}>{sudahDinilai.length}</p>
                                    <p style={{ fontSize: 10, color: '#1A3A5C', fontWeight: 600, letterSpacing: '.06em' }}>SELESAI</p>
                                </div>
                                <div style={{ textAlign: 'center', flexShrink: 0 }}>
                                    <p style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 900, fontSize: 28, color: '#D97706', lineHeight: 1 }}>{belumDinilai.length}</p>
                                    <p style={{ fontSize: 10, color: '#1A3A5C', fontWeight: 600, letterSpacing: '.06em' }}>MENUNGGU</p>
                                </div>
                                {terkunci.length > 0 && (
                                    <div style={{ textAlign: 'center', flexShrink: 0 }}>
                                        <p style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 900, fontSize: 28, color: '#94A3B8', lineHeight: 1 }}>{terkunci.length}</p>
                                        <p style={{ fontSize: 10, color: '#1A3A5C', fontWeight: 600, letterSpacing: '.06em' }}>TERKUNCI</p>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Empty state */}
                        {designs.length === 0 ? (
                            <div className="anim-bottom delay-4" style={{ textAlign: 'center', padding: '80px 40px', background: 'rgba(255,255,255,0.72)', backdropFilter: 'blur(20px)', borderRadius: 24, border: '1.5px solid rgba(255,255,255,0.88)', boxShadow: '0 6px 24px rgba(11,31,58,0.07)' }}>
                                <IconPhoto size={64} color="#94A3B8" style={{ marginBottom: 16 }} />
                                <p style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 700, fontSize: 18, color: '#1A3A5C', marginBottom: 8 }}>Belum ada desain</p>
                                <p style={{ color: '#4A6A8A', fontSize: 14 }}>Peserta belum mengupload desain apapun.</p>
                            </div>
                        ) : (
                            <div className="designs-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 'clamp(14px,2vw,22px)' }}>
                                {designs.map((d, idx) => {
                                    const sudahSendiri = dinilaiSendiri(d);
                                    const juriLainSudah = dinilaiJuriLain(d);
                                    const skorSendiri = getSkorSendiri(d);
                                    const skorJuriLain = getSkorJuriLain(d);

                                    const scoreColor = (val: number | null) =>
                                        val !== null
                                            ? val >= 90 ? '#059669' : val >= 75 ? '#1565C0' : '#C4340E'
                                            : '#D97706';

                                    // Alternating left/right seperti referensi
                                    const dir = idx % 2 === 0 ? 'anim-left' : 'anim-right';

                                    return (
                                        <div key={d.id} className={`design-card ${dir} card-${Math.min(idx, 4)}`} style={{ opacity: juriLainSudah && !sudahSendiri ? 0.75 : 1 }}>
                                            {/* Image */}
                                            <div style={{ position: 'relative', overflow: 'hidden', height: 200 }}>
                                                <img src={`/storage/${d.file_path}`} alt={d.judul} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                                                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(8,24,46,0.5) 0%, transparent 50%)' }} />

                                                {/* Status badge */}
                                                <div style={{
                                                    position: 'absolute', top: 12, right: 12,
                                                    background: sudahSendiri
                                                        ? 'rgba(5,150,105,0.92)'
                                                        : juriLainSudah
                                                            ? 'rgba(100,116,139,0.92)'
                                                            : 'rgba(217,119,6,0.92)',
                                                    backdropFilter: 'blur(8px)', color: '#fff', borderRadius: 999, padding: '4px 10px',
                                                    fontSize: 10, fontWeight: 800, fontFamily: "'Montserrat', sans-serif", letterSpacing: '.06em',
                                                    display: 'flex', alignItems: 'center', gap: 5,
                                                }}>
                                                    {sudahSendiri
                                                        ? <><IconCircleCheck size={11} /> Sudah Dinilai</>
                                                        : juriLainSudah
                                                            ? <><IconLock size={11} /> Terkunci</>
                                                            : <><IconClock size={11} /> Belum Dinilai</>
                                                    }
                                                </div>

                                                {/* Score overlay */}
                                                {sudahSendiri && skorSendiri !== null && (
                                                    <div style={{ position: 'absolute', bottom: 12, right: 12, background: `${scoreColor(skorSendiri)}ee`, backdropFilter: 'blur(8px)', color: '#fff', borderRadius: 12, padding: '6px 14px', fontFamily: "'Montserrat', sans-serif", fontWeight: 900, fontSize: 22, lineHeight: 1 }}>
                                                        {skorSendiri}
                                                    </div>
                                                )}
                                                {juriLainSudah && !sudahSendiri && skorJuriLain !== null && (
                                                    <div style={{ position: 'absolute', bottom: 12, right: 12, background: 'rgba(100,116,139,0.88)', backdropFilter: 'blur(8px)', color: '#fff', borderRadius: 12, padding: '6px 14px', fontFamily: "'Montserrat', sans-serif", fontWeight: 900, fontSize: 22, lineHeight: 1 }}>
                                                        {skorJuriLain}
                                                    </div>
                                                )}
                                            </div>

                                            {/* Info */}
                                            <div style={{ padding: '18px 20px 20px' }}>
                                                <p style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 800, fontSize: 15, color: '#0B1F3A', marginBottom: 4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{d.judul}</p>
                                                <p style={{ fontSize: 12, color: '#4A6A8A', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 5 }}>
                                                    <IconUser size={12} /> <span style={{ fontWeight: 600, color: '#1A3A5C' }}>{d.user?.name ?? '-'}</span>
                                                </p>

                                                {/* Juri sendiri sudah menilai */}
                                                {sudahSendiri && (
                                                    <div>
                                                        <div style={{ background: `${scoreColor(skorSendiri)}0e`, border: `1.5px solid ${scoreColor(skorSendiri)}25`, borderRadius: 14, padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                                                            <span style={{ fontSize: 12, fontWeight: 700, color: scoreColor(skorSendiri), fontFamily: "'Montserrat', sans-serif" }}>Nilai kamu</span>
                                                            <span style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 900, fontSize: 26, color: scoreColor(skorSendiri) }}>{skorSendiri}</span>
                                                        </div>
                                                        <Link href={`/juri/designs/${d.id}`} className="edit-btn">
                                                            <IconEdit size={14} /> Edit Nilai
                                                        </Link>
                                                    </div>
                                                )}

                                                {/* Juri lain sudah menilai — terkunci */}
                                                {juriLainSudah && !sudahSendiri && (
                                                    <div className="locked-box">
                                                        <IconLock size={18} color="#94A3B8" style={{ flexShrink: 0 }} />
                                                        <div>
                                                            <p style={{ fontSize: 12, fontWeight: 700, color: '#64748B', fontFamily: "'Montserrat', sans-serif" }}>Sudah dinilai juri lain</p>
                                                            {skorJuriLain !== null && (
                                                                <p style={{ fontSize: 11, color: '#94A3B8', marginTop: 2 }}>Nilai: <strong style={{ color: '#64748B' }}>{skorJuriLain}</strong></p>
                                                            )}
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Belum dinilai siapapun */}
                                                {!sudahSendiri && !juriLainSudah && (
                                                <Link href={`/juri/designs/${d.id}`} className="nilai-btn">
                                                    <IconStar size={14} /> Nilai Sekarang
                                                </Link>
                                            )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}