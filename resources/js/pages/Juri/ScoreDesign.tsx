import { useState, useEffect } from 'react';
import { useForm, Link } from '@inertiajs/react';
import { FormEvent } from 'react';
import JuriSidebar from '@/components/JuriSidebar';
import {
    IconUser,
    IconPalette,
    IconBulb,
    IconSparkles,
    IconTool,
    IconNotes,
    IconSend,
    IconEdit,
    IconLock,
    IconChevronRight,
    IconAlertCircle,
    IconCircleCheck,
    IconRefresh,
    IconCalendarEvent,
    IconArrowLeft,
} from '@tabler/icons-react';

interface AuthUser {
    name: string;
    email: string;
    role: string;
    id: number;
}

interface Design {
    id: number;
    judul: string;
    file_path: string;
    deskripsi: string | null;
    user: { name: string } | null;
    event: { nama: string } | null;
}

interface ExistingScore {
    tema: number;
    kreativitas: number;
    estetik: number;
    teknik: number;
    catatan: string | null;
    juri_id: number;
}

interface Props {
    auth: { user: AuthUser };
    design: Design;
    existingScore: ExistingScore | null;
    otherJuriScore: ExistingScore | null;
}

type ScoreField = 'tema' | 'kreativitas' | 'estetik' | 'teknik';

interface ScoreForm {
    tema: number;
    kreativitas: number;
    estetik: number;
    teknik: number;
    catatan: string;
}

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700;800;900&family=Plus+Jakarta+Sans:wght@300;400;500;600&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Plus Jakarta Sans', sans-serif; -webkit-font-smoothing: antialiased; }
  ::-webkit-scrollbar { width: 5px; }
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
  @keyframes backdrop-in{ from{opacity:0} to{opacity:1} }

  .pd-ready .anim-top    { animation: slideFromTop    0.55s cubic-bezier(0.22,1,0.36,1) both; }
  .pd-ready .anim-left   { animation: slideFromLeft   0.55s cubic-bezier(0.22,1,0.36,1) both; }
  .pd-ready .anim-right  { animation: slideFromRight  0.55s cubic-bezier(0.22,1,0.36,1) both; }
  .pd-ready .anim-bottom { animation: slideFromBottom 0.55s cubic-bezier(0.22,1,0.36,1) both; }
  .pd-ready .anim-pop    { animation: popIn 0.45s cubic-bezier(0.34,1.56,0.64,1) both; }

  .pd-ready .slider-0 { animation-delay: 0.30s; }
  .pd-ready .slider-1 { animation-delay: 0.38s; }
  .pd-ready .slider-2 { animation-delay: 0.46s; }
  .pd-ready .slider-3 { animation-delay: 0.54s; }

  .pd-ready .delay-1 { animation-delay: 0.08s; }
  .pd-ready .delay-2 { animation-delay: 0.20s; }
  .pd-ready .delay-3 { animation-delay: 0.30s; }
  .pd-ready .delay-4 { animation-delay: 0.40s; }
  .pd-ready .delay-5 { animation-delay: 0.50s; }
  .pd-ready .delay-6 { animation-delay: 0.60s; }

  .anim-top, .anim-left, .anim-right, .anim-bottom, .anim-pop { opacity: 0; }

  .gradient-text-sky {
    background: linear-gradient(135deg, #0A2F5E 0%, #1565C0 32%, #0EA5E9 62%, #38BDF8 100%);
    background-size: 280%;
    -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
    animation: shimmer 7s ease infinite;
  }

  .sd-page { font-family: 'Plus Jakarta Sans', sans-serif; }
  .sd-main { transition: margin-left 0.35s cubic-bezier(0.22,1,0.36,1); }

  /* Range slider */
  input[type=range] { -webkit-appearance: none; appearance: none; width: 100%; height: 6px; border-radius: 999px; outline: none; cursor: pointer; }
  input[type=range]::-webkit-slider-thumb { -webkit-appearance: none; appearance: none; width: 22px; height: 22px; border-radius: 50%; background: linear-gradient(135deg, #0EA5E9, #1565C0); border: 3px solid #fff; box-shadow: 0 2px 8px rgba(14,165,233,0.5); cursor: pointer; transition: transform .18s ease, box-shadow .18s ease; }
  input[type=range]::-webkit-slider-thumb:hover { transform: scale(1.2); box-shadow: 0 4px 16px rgba(14,165,233,0.6); }
  input[type=range]::-moz-range-thumb { width: 22px; height: 22px; border-radius: 50%; background: linear-gradient(135deg, #0EA5E9, #1565C0); border: 3px solid #fff; box-shadow: 0 2px 8px rgba(14,165,233,0.5); cursor: pointer; }
  input[type=range]:disabled { opacity: 0.4; cursor: not-allowed; }

  /* Touch-friendly slider pada mobile */
  @media (max-width: 768px) {
    input[type=range]::-webkit-slider-thumb { width: 28px; height: 28px; }
  }

  .score-card {
    background: rgba(255,255,255,0.72);
    backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);
    border: 1.5px solid rgba(255,255,255,0.88);
    border-radius: 20px; padding: 20px 20px;
    box-shadow: 0 4px 18px rgba(11,31,58,0.06);
    transition: border-color .22s ease, box-shadow .22s ease;
  }
  .score-card:focus-within { border-color: rgba(14,165,233,0.4); box-shadow: 0 4px 24px rgba(14,165,233,0.15); }

  .submit-btn {
    width: 100%; padding: 16px 28px; border-radius: 999px;
    background: linear-gradient(135deg, #1565C0, #0EA5E9);
    color: #fff; border: none; cursor: pointer;
    font-family: 'Montserrat', sans-serif; font-weight: 800; font-size: 15px;
    letter-spacing: .06em;
    box-shadow: 0 8px 24px rgba(14,165,233,0.38);
    transition: all .25s ease;
    display: flex; align-items: center; justify-content: center; gap: 9px;
  }
  .submit-btn:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 12px 32px rgba(14,165,233,0.5); }
  .submit-btn:disabled { opacity: 0.55; cursor: not-allowed; }
  .submit-btn:active:not(:disabled) { transform: scale(0.98); }

  .update-btn {
    width: 100%; padding: 16px 28px; border-radius: 999px;
    background: linear-gradient(135deg, #D97706, #F59E0B);
    color: #fff; border: none; cursor: pointer;
    font-family: 'Montserrat', sans-serif; font-weight: 800; font-size: 15px;
    letter-spacing: .06em;
    box-shadow: 0 8px 24px rgba(245,158,11,0.38);
    transition: all .25s ease;
    display: flex; align-items: center; justify-content: center; gap: 9px;
  }
  .update-btn:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 12px 32px rgba(245,158,11,0.5); }
  .update-btn:disabled { opacity: 0.55; cursor: not-allowed; }
  .update-btn:active:not(:disabled) { transform: scale(0.98); }

  textarea {
    width: 100%; border: 1.5px solid rgba(14,165,233,0.2); border-radius: 16px;
    padding: 14px 16px; resize: none; outline: none;
    background: rgba(255,255,255,0.8); font-family: 'Plus Jakarta Sans', sans-serif; font-size: 13px; color: #1A3A5C;
    transition: border-color .22s ease, box-shadow .22s ease;
  }
  textarea:focus { border-color: rgba(14,165,233,0.5); box-shadow: 0 0 0 3px rgba(14,165,233,0.1); }
  textarea:disabled { opacity: 0.5; cursor: not-allowed; background: rgba(241,245,249,0.9); }

  /* ── MOBILE MENU BUTTON ── */
  .mobile-menu-btn {
    display: none;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    border-radius: 10px;
    background: rgba(255,255,255,0.15);
    border: 1px solid rgba(255,255,255,0.25);
    cursor: pointer;
    color: #fff;
    flex-shrink: 0;
  }

  /* ── MOBILE SIDEBAR OVERLAY ── */
  .mobile-sidebar-overlay {
    display: none;
    position: fixed;
    inset: 0;
    z-index: 199;
    background: rgba(8,18,40,0.5);
    backdrop-filter: blur(4px);
    -webkit-backdrop-filter: blur(4px);
    animation: backdrop-in .2s ease both;
  }

  /* ── STICKY SCORE PREVIEW di mobile (muncul saat scroll form) ── */
  .mobile-score-sticky {
    display: none;
    position: sticky;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 40;
    background: rgba(14,100,180,0.88);
    backdrop-filter: blur(24px) saturate(180%);
    -webkit-backdrop-filter: blur(24px) saturate(180%);
    border-top: 1px solid rgba(255,255,255,0.15);
    padding: 12px clamp(14px,4vw,24px);
  }

  /* ─────────── RESPONSIVE ─────────── */
  @media (max-width: 768px) {
    .sd-main { margin-left: 0 !important; }
    .mobile-menu-btn { display: flex; }
    .mobile-sidebar-overlay { display: block; }
    .topbar-breadcrumb { display: none !important; }

    /* Grid form: 1 kolom di mobile */
    .form-grid {
      grid-template-columns: 1fr !important;
      gap: 16px !important;
    }

    /* Gambar desain: aspect ratio lebih pendek di mobile */
    .design-image { aspect-ratio: 16/9 !important; max-height: 220px; }

    /* Info card: baris horizontal, compact */
    .info-detail-card { padding: 14px 16px !important; }

    /* Live score preview menjadi horizontal row di mobile, bukan block penuh */
    .live-score-card {
      display: flex !important;
      flex-direction: row !important;
      align-items: center !important;
      justify-content: space-between !important;
      padding: 14px 18px !important;
      text-align: left !important;
    }
    .live-score-number { font-size: 44px !important; }
    .live-score-bar { margin-top: 0 !important; width: 100px !important; }

    /* Score slider cards: padding lebih compact */
    .score-card { padding: 16px 16px !important; }

    /* Sticky score bar di mobile */
    .mobile-score-sticky { display: flex; align-items: center; justify-content: space-between; gap: 12px; }

    /* Sembunyikan live score card desktop di mobile (pakai sticky bar) */
    .desktop-score-preview { display: none !important; }

    /* Info row yang jadi 2 kolom di mobile */
    .info-grid-mobile {
      display: grid !important;
      grid-template-columns: 1fr 1fr !important;
      gap: 10px !important;
    }

    /* Tombol back: lebih compact */
    .back-link { margin-top: 0 !important; }
  }

  @media (max-width: 480px) {
    .score-card { padding: 14px !important; }
    .live-score-number { font-size: 36px !important; }
    .submit-btn, .update-btn { font-size: 14px !important; padding: 14px 20px !important; }
  }
`;

export default function ScoreDesign({ auth, design, existingScore, otherJuriScore }: Props) {
    const [ready, setReady] = useState(false);
    const [sidebarCollapsed, setSidebarCollapsed] = useState(() =>
        typeof window !== 'undefined'
            ? localStorage.getItem('juri-sidebar-collapsed') === 'true'
            : false
    );
    const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const check = () => setIsMobile(window.innerWidth <= 768);
        check();
        window.addEventListener('resize', check);
        return () => window.removeEventListener('resize', check);
    }, []);

    useEffect(() => {
        const t = requestAnimationFrame(() => {
            requestAnimationFrame(() => setReady(true));
        });
        return () => cancelAnimationFrame(t);
    }, []);

    useEffect(() => {
        const handler = (e: CustomEvent) => {
            if (e.detail?.storageKey === 'juri-sidebar-collapsed') {
                setSidebarCollapsed(e.detail?.collapsed ?? false);
            }
        };
        window.addEventListener('sidebarToggle', handler as EventListener);
        return () => window.removeEventListener('sidebarToggle', handler as EventListener);
    }, []);

    useEffect(() => {
        if (!isMobile) setMobileSidebarOpen(false);
    }, [isMobile]);

    const isLocked = !!otherJuriScore && !existingScore;

    const { data, setData, post, put, processing, errors } = useForm<ScoreForm>({
        tema:        existingScore?.tema        ?? (isLocked ? otherJuriScore?.tema        ?? 0 : 0),
        kreativitas: existingScore?.kreativitas ?? (isLocked ? otherJuriScore?.kreativitas ?? 0 : 0),
        estetik:     existingScore?.estetik     ?? (isLocked ? otherJuriScore?.estetik     ?? 0 : 0),
        teknik:      existingScore?.teknik      ?? (isLocked ? otherJuriScore?.teknik      ?? 0 : 0),
        catatan:     existingScore?.catatan     ?? (isLocked ? otherJuriScore?.catatan     ?? '' : ''),
    });

    const submit = (e: FormEvent) => {
        e.preventDefault();
        if (isLocked) return;
        if (existingScore) {
            put(`/juri/designs/${design.id}/score`);
        } else {
            post(`/juri/designs/${design.id}/score`);
        }
    };

    const avg = Number(
        ((Number(data.tema) + Number(data.kreativitas) + Number(data.estetik) + Number(data.teknik)) / 4).toFixed(1)
    );
    const avgColor = avg >= 90 ? '#059669' : avg >= 75 ? '#1565C0' : avg >= 50 ? '#D97706' : '#C4340E';

    const criteria: { label: string; field: ScoreField; icon: React.ReactNode; desc: string }[] = [
        { label: 'Tema',        field: 'tema',        icon: <IconPalette size={16} />,  desc: 'Kesesuaian dengan tema kompetisi' },
        { label: 'Kreativitas', field: 'kreativitas', icon: <IconBulb size={16} />,     desc: 'Orisinalitas dan inovasi desain' },
        { label: 'Estetik',     field: 'estetik',     icon: <IconSparkles size={16} />, desc: 'Keindahan visual dan komposisi' },
        { label: 'Teknik',      field: 'teknik',      icon: <IconTool size={16} />,     desc: 'Kerapian dan kualitas eksekusi' },
    ];

    const getTrackStyle = (value: number) => ({
        background: `linear-gradient(90deg, #0EA5E9 ${value}%, rgba(14,165,233,0.15) ${value}%)`,
    });

    const sidebarWidth = isMobile ? 0 : (sidebarCollapsed ? 64 : 240);

    return (
        <>
            <style>{STYLES}</style>

            {/* Mobile sidebar overlay */}
            {mobileSidebarOpen && isMobile && (
                <div
                    className="mobile-sidebar-overlay"
                    onClick={() => setMobileSidebarOpen(false)}
                />
            )}

            <div
                className={`sd-page min-h-screen${ready ? ' pd-ready' : ''}`}
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

                {/* Sidebar — mobile slide-in */}
                <div style={{
                    position: 'fixed',
                    left: isMobile ? (mobileSidebarOpen ? 0 : -280) : 0,
                    top: 0,
                    zIndex: 200,
                    transition: 'left 0.35s cubic-bezier(0.22,1,0.36,1)',
                }}>
                    <JuriSidebar user={auth.user} activePage="penilaian" />
                </div>

                {/* Main */}
                <div
                    className="sd-main"
                    style={{
                        marginLeft: sidebarWidth,
                        minHeight: '100vh',
                        position: 'relative',
                        zIndex: 1,
                        transition: 'margin-left 0.35s cubic-bezier(0.22,1,0.36,1)',
                        paddingBottom: isMobile ? 80 : 0,
                    }}
                >
                    {/* Top Bar */}
                    <div className="anim-top delay-1" style={{ position: 'sticky', top: 0, zIndex: 50, background: 'rgba(14,100,180,0.75)', backdropFilter: 'blur(28px) saturate(180%)', WebkitBackdropFilter: 'blur(28px) saturate(180%)', borderBottom: '1px solid rgba(255,255,255,0.12)', padding: '0 clamp(14px,4vw,40px)', height: 62, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
                            {/* Hamburger */}
                            <button
                                className="mobile-menu-btn"
                                onClick={() => setMobileSidebarOpen(o => !o)}
                                aria-label="Buka menu"
                            >
                                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                                    <rect y="2" width="18" height="2" rx="1" fill="currentColor"/>
                                    <rect y="8" width="18" height="2" rx="1" fill="currentColor"/>
                                    <rect y="14" width="18" height="2" rx="1" fill="currentColor"/>
                                </svg>
                            </button>

                            <span className="topbar-breadcrumb" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                <Link href="/juri/dashboard" style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 600, fontSize: 13, color: 'rgba(186,230,253,0.7)', textDecoration: 'none' }}>Dashboard</Link>
                                <IconChevronRight size={14} color="rgba(186,230,253,0.4)" />
                                <Link href="/juri/designs" style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 600, fontSize: 13, color: 'rgba(186,230,253,0.7)', textDecoration: 'none' }}>Penilaian</Link>
                                <IconChevronRight size={14} color="rgba(186,230,253,0.4)" />
                            </span>
                            <h1 style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 800, fontSize: 'clamp(13px,2vw,17px)', color: '#fff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: isMobile ? 160 : 200 }}>{design.judul}</h1>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                            {isLocked && (
                                <span style={{ display: 'flex', alignItems: 'center', gap: 5, background: 'rgba(100,116,139,0.25)', border: '1px solid rgba(100,116,139,0.4)', color: '#CBD5E1', borderRadius: 20, padding: '5px 10px', fontSize: 10, fontWeight: 700, fontFamily: "'Montserrat', sans-serif", whiteSpace: 'nowrap' }}>
                                    <IconLock size={11} /> {isMobile ? 'Terkunci' : 'Terkunci — Sudah Dinilai Juri Lain'}
                                </span>
                            )}
                            {existingScore && !isLocked && (
                                <span style={{ display: 'flex', alignItems: 'center', gap: 5, background: 'rgba(245,158,11,0.2)', border: '1px solid rgba(245,158,11,0.4)', color: '#FDE68A', borderRadius: 20, padding: '5px 10px', fontSize: 10, fontWeight: 700, fontFamily: "'Montserrat', sans-serif", whiteSpace: 'nowrap' }}>
                                    <IconEdit size={11} /> {isMobile ? 'Edit' : 'Mode Edit Nilai'}
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Content */}
                    <div style={{ maxWidth: 1050, margin: '0 auto', padding: 'clamp(16px,4vw,40px) clamp(14px,4vw,40px)' }}>

                        {/* Header */}
                        <div className="anim-top delay-1" style={{ marginBottom: 20 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                <div className="anim-pop delay-1" style={{
                                    width: 44, height: 44, borderRadius: 14, flexShrink: 0,
                                    background: isLocked
                                        ? 'linear-gradient(135deg, #64748B, #94A3B8)'
                                        : existingScore
                                            ? 'linear-gradient(135deg, #D97706, #F59E0B)'
                                            : 'linear-gradient(135deg, #0EA5E9, #1565C0)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    boxShadow: isLocked ? '0 8px 24px rgba(100,116,139,0.3)' : '0 8px 24px rgba(14,165,233,0.35)',
                                }}>
                                    {isLocked ? <IconLock size={20} color="#fff" /> : existingScore ? <IconEdit size={20} color="#fff" /> : <IconSend size={20} color="#fff" />}
                                </div>
                                <div>
                                    <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.18em', textTransform: 'uppercase', color: '#0EA5E9', marginBottom: 3, fontFamily: "'Montserrat', sans-serif" }}>— FORM PENILAIAN —</p>
                                    <h2 style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 800, fontSize: 'clamp(18px,3vw,28px)', color: '#08182E', lineHeight: 1.2 }}>
                                        {isLocked
                                            ? <>Nilai <span style={{ color: '#64748B' }}>Terkunci</span></>
                                            : <>Nilai <span className="gradient-text-sky">Desain</span></>
                                        }
                                    </h2>
                                </div>
                            </div>
                        </div>

                        {/* Banner locked */}
                        {isLocked && (
                            <div className="anim-left delay-2" style={{ background: 'rgba(100,116,139,0.1)', border: '1.5px solid rgba(100,116,139,0.25)', borderRadius: 14, padding: '14px 16px', marginBottom: 18, display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                                <IconAlertCircle size={18} color="#64748B" style={{ flexShrink: 0, marginTop: 1 }} />
                                <div>
                                    <p style={{ fontSize: 13, fontWeight: 700, color: '#334155', fontFamily: "'Montserrat', sans-serif", marginBottom: 2 }}>Desain ini sudah dinilai oleh juri lain</p>
                                    <p style={{ fontSize: 12, color: '#64748B', lineHeight: 1.5 }}>Setiap karya hanya dinilai oleh satu juri. Kartu ini tidak dapat diubah atau dinilai ulang.</p>
                                </div>
                            </div>
                        )}

                        {/* Banner edit */}
                        {existingScore && !isLocked && (
                            <div className="anim-left delay-2" style={{ background: 'rgba(245,158,11,0.08)', border: '1.5px solid rgba(245,158,11,0.25)', borderRadius: 14, padding: '14px 16px', marginBottom: 18, display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                                <IconEdit size={18} color="#D97706" style={{ flexShrink: 0, marginTop: 1 }} />
                                <div>
                                    <p style={{ fontSize: 13, fontWeight: 700, color: '#92400E', fontFamily: "'Montserrat', sans-serif", marginBottom: 2 }}>Anda sudah menilai desain ini</p>
                                    <p style={{ fontSize: 12, color: '#B45309', lineHeight: 1.5 }}>Geser slider untuk mengubah nilai, lalu klik <strong>Update Penilaian</strong>.</p>
                                </div>
                            </div>
                        )}

                        <div className="form-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: 'clamp(16px,2.5vw,28px)', alignItems: 'start' }}>

                            {/* ── Kiri: Info Desain ── */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

                                {/* Gambar */}
                                <div className="anim-left delay-2" style={{ borderRadius: 20, overflow: 'hidden', border: '1.5px solid rgba(255,255,255,0.88)', boxShadow: '0 8px 32px rgba(11,31,58,0.14)', position: 'relative' }}>
                                    <img
                                        className="design-image"
                                        src={`/storage/${design.file_path}`}
                                        alt={design.judul}
                                        style={{ width: '100%', aspectRatio: '4/3', objectFit: 'cover', display: 'block', filter: isLocked ? 'grayscale(30%)' : 'none', transition: 'filter .3s ease' }}
                                    />
                                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(8,24,46,0.6) 0%, transparent 50%)' }} />
                                    <div style={{ position: 'absolute', bottom: 14, left: 14, right: 14 }}>
                                        <p style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 800, fontSize: 15, color: '#fff', marginBottom: 3 }}>{design.judul}</p>
                                        <p style={{ fontSize: 12, color: 'rgba(186,230,253,0.85)', display: 'flex', alignItems: 'center', gap: 5 }}>
                                            <IconUser size={11} /> {design.user?.name ?? '-'}
                                        </p>
                                    </div>
                                    {isLocked && (
                                        <div style={{ position: 'absolute', top: 10, right: 10, background: 'rgba(100,116,139,0.9)', backdropFilter: 'blur(8px)', color: '#fff', borderRadius: 999, padding: '4px 10px', fontSize: 10, fontWeight: 800, fontFamily: "'Montserrat', sans-serif", display: 'flex', alignItems: 'center', gap: 4 }}>
                                            <IconLock size={10} /> Terkunci
                                        </div>
                                    )}
                                </div>

                                {/* Detail info */}
                                <div className="anim-left delay-3 info-detail-card" style={{ background: 'rgba(255,255,255,0.72)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', border: '1.5px solid rgba(255,255,255,0.88)', borderRadius: 18, padding: '18px 20px', boxShadow: '0 4px 18px rgba(11,31,58,0.06)' }}>
                                    {/* Di mobile, tampilkan sebagai grid 2 kolom */}
                                    <div className="info-grid-mobile" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                                        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                                            <IconUser size={15} color="#4A6A8A" style={{ flexShrink: 0 }} />
                                            <div>
                                                <p style={{ fontSize: 9, fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase', color: '#4A6A8A', fontFamily: "'Montserrat', sans-serif" }}>Peserta</p>
                                                <p style={{ fontSize: 13, fontWeight: 700, color: '#0B1F3A', fontFamily: "'Montserrat', sans-serif" }}>{design.user?.name ?? '-'}</p>
                                            </div>
                                        </div>
                                        {design.event && (
                                            <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                                                <IconCalendarEvent size={15} color="#4A6A8A" style={{ flexShrink: 0 }} />
                                                <div>
                                                    <p style={{ fontSize: 9, fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase', color: '#4A6A8A', fontFamily: "'Montserrat', sans-serif" }}>Event</p>
                                                    <p style={{ fontSize: 13, fontWeight: 700, color: '#0B1F3A', fontFamily: "'Montserrat', sans-serif" }}>{design.event.nama}</p>
                                                </div>
                                            </div>
                                        )}
                                        {design.deskripsi && (
                                            <>
                                                <div style={{ height: 1, background: 'rgba(14,165,233,0.12)', gridColumn: '1 / -1' }} />
                                                <div style={{ gridColumn: '1 / -1' }}>
                                                    <p style={{ fontSize: 9, fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase', color: '#4A6A8A', fontFamily: "'Montserrat', sans-serif", marginBottom: 5 }}>Deskripsi</p>
                                                    <p style={{ fontSize: 13, color: '#1A3A5C', lineHeight: 1.6 }}>{design.deskripsi}</p>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </div>

                                {/* Live score preview — desktop only */}
                                <div className="anim-left delay-4 desktop-score-preview live-score-card" style={{ background: isLocked ? 'rgba(100,116,139,0.08)' : `linear-gradient(135deg, ${avgColor}18, ${avgColor}08)`, border: isLocked ? '1.5px solid rgba(100,116,139,0.2)' : `1.5px solid ${avgColor}30`, borderRadius: 18, padding: '18px 22px', textAlign: 'center', boxShadow: isLocked ? 'none' : `0 4px 18px ${avgColor}15`, display: 'flex', flexDirection: 'column' }}>
                                    <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.14em', textTransform: 'uppercase', color: isLocked ? '#94A3B8' : avgColor, fontFamily: "'Montserrat', sans-serif", marginBottom: 8 }}>
                                        {isLocked ? 'Nilai Juri Lain' : 'Rata-rata Sementara'}
                                    </p>
                                    <p className="live-score-number" style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 900, fontSize: 58, color: isLocked ? '#94A3B8' : avgColor, lineHeight: 1 }}>{avg}</p>
                                    <p style={{ fontSize: 11, color: '#4A6A8A', marginTop: 6 }}>dari 100 poin</p>
                                    <div className="live-score-bar" style={{ marginTop: 12, background: isLocked ? 'rgba(100,116,139,0.12)' : `${avgColor}18`, borderRadius: 8, height: 8, overflow: 'hidden' }}>
                                        <div style={{ width: `${avg}%`, height: '100%', background: isLocked ? 'rgba(100,116,139,0.4)' : `linear-gradient(90deg, ${avgColor}, ${avgColor}bb)`, borderRadius: 8, transition: 'width .5s ease' }} />
                                    </div>
                                </div>
                            </div>

                            {/* ── Kanan: Form Slider ── */}
                            <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

                                {criteria.map(({ label, field, icon, desc }, ci) => {
                                    const val = Number(data[field]);
                                    const barColor = isLocked ? '#94A3B8' : val >= 90 ? '#059669' : val >= 75 ? '#0EA5E9' : val >= 50 ? '#D97706' : '#EF4444';
                                    return (
                                        <div key={field} className={`score-card anim-right slider-${ci}`} style={{ opacity: isLocked ? 0.75 : 1 }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
                                                <div>
                                                    <p style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 800, fontSize: 14, color: '#0B1F3A', display: 'flex', alignItems: 'center', gap: 6 }}>
                                                        <span style={{ color: '#4A6A8A' }}>{icon}</span> {label}
                                                    </p>
                                                    <p style={{ fontSize: 11, color: '#4A6A8A', marginTop: 2 }}>{desc}</p>
                                                </div>
                                                <div style={{ background: `${barColor}15`, border: `1.5px solid ${barColor}30`, borderRadius: 11, padding: '5px 14px', minWidth: 54, textAlign: 'center', flexShrink: 0 }}>
                                                    <span style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 900, fontSize: 20, color: barColor, lineHeight: 1 }}>{val}</span>
                                                </div>
                                            </div>
                                            <input
                                                type="range" min={0} max={100} step={1}
                                                value={val}
                                                disabled={isLocked}
                                                onChange={(e) => !isLocked && setData(field, Number(e.target.value))}
                                                style={getTrackStyle(val)}
                                            />
                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 5 }}>
                                                <span style={{ fontSize: 10, color: '#4A6A8A', fontWeight: 600 }}>0 · Kurang</span>
                                                <span style={{ fontSize: 10, color: '#4A6A8A', fontWeight: 600 }}>100 · Sempurna</span>
                                            </div>
                                        </div>
                                    );
                                })}

                                {/* Catatan */}
                                <div className="anim-right delay-5" style={{ background: 'rgba(255,255,255,0.72)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', border: '1.5px solid rgba(255,255,255,0.88)', borderRadius: 18, padding: '18px 18px', boxShadow: '0 4px 18px rgba(11,31,58,0.06)' }}>
                                    <p style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 700, fontSize: 13, color: '#0B1F3A', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 6 }}>
                                        <IconNotes size={14} color="#4A6A8A" /> Catatan untuk Peserta
                                        <span style={{ fontSize: 10, fontWeight: 500, color: '#4A6A8A', marginLeft: 2 }}>(opsional)</span>
                                    </p>
                                    <textarea
                                        value={data.catatan}
                                        disabled={isLocked}
                                        onChange={(e) => !isLocked && setData('catatan', e.target.value)}
                                        placeholder={isLocked ? 'Form terkunci — tidak dapat diubah.' : 'Berikan masukan atau komentar untuk peserta...'}
                                        rows={4}
                                    />
                                    {errors.catatan && <p style={{ fontSize: 11, color: '#EF4444', marginTop: 6 }}>{errors.catatan}</p>}
                                </div>

                                {/* Submit / Update / Locked */}
                                <div className="anim-bottom delay-6">
                                    {isLocked ? (
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, background: 'rgba(100,116,139,0.1)', border: '1.5px solid rgba(100,116,139,0.25)', borderRadius: 999, padding: '15px 20px' }}>
                                            <IconLock size={17} color="#94A3B8" />
                                            <span style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 700, fontSize: 13, color: '#64748B', textAlign: 'center' }}>Form Terkunci — Sudah Dinilai Juri Lain</span>
                                        </div>
                                    ) : existingScore ? (
                                        <>
                                            <button type="submit" disabled={processing} className="update-btn">
                                                {processing ? <><IconRefresh size={16} /> Menyimpan...</> : <><IconEdit size={16} /> Update Penilaian</>}
                                            </button>
                                            <p style={{ textAlign: 'center', fontSize: 11, color: '#4A6A8A', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5, marginTop: 10 }}>
                                                <IconCircleCheck size={13} color="#059669" /> Nilai sebelumnya akan diperbarui setelah klik update.
                                            </p>
                                        </>
                                    ) : (
                                        <button type="submit" disabled={processing} className="submit-btn">
                                            {processing ? <><IconRefresh size={16} /> Menyimpan...</> : <><IconSend size={16} /> Kirim Penilaian</>}
                                        </button>
                                    )}
                                </div>

                                {/* Back */}
                                <div className="anim-bottom delay-6 back-link" style={{ marginTop: 2 }}>
                                    <Link href="/juri/designs" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, textDecoration: 'none', fontSize: 12, color: '#4A6A8A', fontWeight: 600, fontFamily: "'Montserrat', sans-serif" }}>
                                        <IconArrowLeft size={13} /> Kembali ke Daftar Desain
                                    </Link>
                                </div>
                            </form>
                        </div>
                    </div>

                    {/* ── STICKY BOTTOM BAR DI MOBILE — rata-rata sementara ── */}
                    <div className="mobile-score-sticky" style={{
                        position: 'fixed',
                        bottom: 0, left: 0, right: 0,
                        zIndex: 40,
                        background: isLocked ? 'rgba(71,85,105,0.88)' : 'rgba(14,100,180,0.88)',
                        backdropFilter: 'blur(24px) saturate(180%)',
                        WebkitBackdropFilter: 'blur(24px) saturate(180%)',
                        borderTop: '1px solid rgba(255,255,255,0.15)',
                        padding: '10px 16px',
                        display: isMobile ? 'flex' : 'none',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: 12,
                    }}>
                        <div>
                            <p style={{ fontSize: 9, fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase', color: 'rgba(186,230,253,0.7)', fontFamily: "'Montserrat', sans-serif", marginBottom: 1 }}>
                                {isLocked ? 'Nilai Juri Lain' : 'Rata-rata Sementara'}
                            </p>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                <p style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 900, fontSize: 32, color: isLocked ? '#CBD5E1' : '#fff', lineHeight: 1 }}>{avg}</p>
                                <div style={{ width: 80, height: 6, background: 'rgba(255,255,255,0.15)', borderRadius: 999, overflow: 'hidden' }}>
                                    <div style={{ width: `${avg}%`, height: '100%', background: isLocked ? 'rgba(203,213,225,0.6)' : `linear-gradient(90deg, #38BDF8, #fff)`, borderRadius: 999, transition: 'width .4s ease' }} />
                                </div>
                            </div>
                        </div>
                        <div style={{ display: 'flex', gap: 6 }}>
                            {criteria.map(({ label, field }) => (
                                <div key={field} style={{ textAlign: 'center' }}>
                                    <p style={{ fontSize: 8, color: 'rgba(186,230,253,0.6)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 1 }}>{label.slice(0,3)}</p>
                                    <p style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 800, fontSize: 13, color: '#fff' }}>{Number(data[field])}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}