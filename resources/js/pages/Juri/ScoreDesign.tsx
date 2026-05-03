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
  @keyframes shimmer { 0%{background-position:0% 50%} 50%{background-position:100% 50%} 100%{background-position:0% 50%} }
  @keyframes orb-drift { 0%,100%{transform:translate(0,0)} 33%{transform:translate(20px,-14px)} 66%{transform:translate(-16px,18px)} }
  @keyframes pulse-ring { 0%{box-shadow:0 0 0 0 rgba(14,165,233,0.4)} 70%{box-shadow:0 0 0 10px rgba(14,165,233,0)} 100%{box-shadow:0 0 0 0 rgba(14,165,233,0)} }

  /* ── Animation classes — active only when .pd-ready on parent ── */
  .pd-ready .anim-top    { animation: slideFromTop    0.55s cubic-bezier(0.22,1,0.36,1) both; }
  .pd-ready .anim-left   { animation: slideFromLeft   0.55s cubic-bezier(0.22,1,0.36,1) both; }
  .pd-ready .anim-right  { animation: slideFromRight  0.55s cubic-bezier(0.22,1,0.36,1) both; }
  .pd-ready .anim-bottom { animation: slideFromBottom 0.55s cubic-bezier(0.22,1,0.36,1) both; }
  .pd-ready .anim-pop    { animation: popIn 0.45s cubic-bezier(0.34,1.56,0.64,1) both; }

  /* ── Slider card stagger ── */
  .pd-ready .slider-0 { animation-delay: 0.30s; }
  .pd-ready .slider-1 { animation-delay: 0.38s; }
  .pd-ready .slider-2 { animation-delay: 0.46s; }
  .pd-ready .slider-3 { animation-delay: 0.54s; }

  /* ── Section delays ── */
  .pd-ready .delay-1 { animation-delay: 0.08s; }
  .pd-ready .delay-2 { animation-delay: 0.20s; }
  .pd-ready .delay-3 { animation-delay: 0.30s; }
  .pd-ready .delay-4 { animation-delay: 0.40s; }
  .pd-ready .delay-5 { animation-delay: 0.50s; }
  .pd-ready .delay-6 { animation-delay: 0.60s; }

  /* ── Before ready: hidden ── */
  .anim-top, .anim-left, .anim-right, .anim-bottom, .anim-pop { opacity: 0; }

  .gradient-text-sky {
    background: linear-gradient(135deg, #0A2F5E 0%, #1565C0 32%, #0EA5E9 62%, #38BDF8 100%);
    background-size: 280%;
    -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
    animation: shimmer 7s ease infinite;
  }

  .sd-page { font-family: 'Plus Jakarta Sans', sans-serif; }

  /* ── Sidebar collapse responsive ── */
  .sd-main {
    transition: margin-left 0.35s cubic-bezier(0.22,1,0.36,1);
  }

  /* Custom range slider */
  input[type=range] { -webkit-appearance: none; appearance: none; width: 100%; height: 6px; border-radius: 999px; outline: none; cursor: pointer; }
  input[type=range]::-webkit-slider-thumb { -webkit-appearance: none; appearance: none; width: 22px; height: 22px; border-radius: 50%; background: linear-gradient(135deg, #0EA5E9, #1565C0); border: 3px solid #fff; box-shadow: 0 2px 8px rgba(14,165,233,0.5); cursor: pointer; transition: transform .18s ease, box-shadow .18s ease; }
  input[type=range]::-webkit-slider-thumb:hover { transform: scale(1.2); box-shadow: 0 4px 16px rgba(14,165,233,0.6); }
  input[type=range]::-moz-range-thumb { width: 22px; height: 22px; border-radius: 50%; background: linear-gradient(135deg, #0EA5E9, #1565C0); border: 3px solid #fff; box-shadow: 0 2px 8px rgba(14,165,233,0.5); cursor: pointer; }
  input[type=range]:disabled { opacity: 0.4; cursor: not-allowed; }

  .score-card {
    background: rgba(255,255,255,0.72);
    backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);
    border: 1.5px solid rgba(255,255,255,0.88);
    border-radius: 20px; padding: 22px 24px;
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

  textarea {
    width: 100%; border: 1.5px solid rgba(14,165,233,0.2); border-radius: 16px;
    padding: 14px 18px; resize: none; outline: none;
    background: rgba(255,255,255,0.8); font-family: 'Plus Jakarta Sans', sans-serif; font-size: 13px; color: #1A3A5C;
    transition: border-color .22s ease, box-shadow .22s ease;
  }
  textarea:focus { border-color: rgba(14,165,233,0.5); box-shadow: 0 0 0 3px rgba(14,165,233,0.1); }
  textarea:disabled { opacity: 0.5; cursor: not-allowed; background: rgba(241,245,249,0.9); }

  @media (max-width: 768px) {
    .sd-main { margin-left: 0 !important; }
    .form-grid { grid-template-columns: 1fr !important; }
  }
`;

export default function ScoreDesign({ auth, design, existingScore, otherJuriScore }: Props) {
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

    const sidebarWidth = sidebarCollapsed ? 64 : 240;

    return (
        <>
            <style>{STYLES}</style>

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

                {/* Sidebar */}
                <JuriSidebar user={auth.user} activePage="penilaian" />

                {/* Main */}
                <div
                    className="sd-main"
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
                            <Link href="/juri/designs" style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 600, fontSize: 13, color: 'rgba(186,230,253,0.7)', textDecoration: 'none' }}>Penilaian</Link>
                            <IconChevronRight size={14} color="rgba(186,230,253,0.4)" />
                            <h1 style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 800, fontSize: 'clamp(14px,2vw,17px)', color: '#fff', maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{design.judul}</h1>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            {isLocked && (
                                <span style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(100,116,139,0.25)', border: '1px solid rgba(100,116,139,0.4)', color: '#CBD5E1', borderRadius: 20, padding: '5px 14px', fontSize: 11, fontWeight: 700, fontFamily: "'Montserrat', sans-serif" }}>
                                    <IconLock size={12} /> Terkunci — Sudah Dinilai Juri Lain
                                </span>
                            )}
                            {existingScore && !isLocked && (
                                <span style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(245,158,11,0.2)', border: '1px solid rgba(245,158,11,0.4)', color: '#FDE68A', borderRadius: 20, padding: '5px 14px', fontSize: 11, fontWeight: 700, fontFamily: "'Montserrat', sans-serif" }}>
                                    <IconEdit size={12} /> Mode Edit Nilai
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Content */}
                    <div style={{ maxWidth: 1050, margin: '0 auto', padding: 'clamp(24px,4vw,40px)' }}>

                        {/* Header — dari atas */}
                        <div className="anim-top delay-1" style={{ marginBottom: 28 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                                <div className="anim-pop delay-1" style={{
                                    width: 48, height: 48, borderRadius: 16,
                                    background: isLocked
                                        ? 'linear-gradient(135deg, #64748B, #94A3B8)'
                                        : existingScore
                                            ? 'linear-gradient(135deg, #D97706, #F59E0B)'
                                            : 'linear-gradient(135deg, #0EA5E9, #1565C0)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    boxShadow: isLocked ? '0 8px 24px rgba(100,116,139,0.3)' : '0 8px 24px rgba(14,165,233,0.35)',
                                }}>
                                    {isLocked ? <IconLock size={22} color="#fff" /> : existingScore ? <IconEdit size={22} color="#fff" /> : <IconSend size={22} color="#fff" />}
                                </div>
                                <div>
                                    <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.18em', textTransform: 'uppercase', color: '#0EA5E9', marginBottom: 4, fontFamily: "'Montserrat', sans-serif" }}>— FORM PENILAIAN —</p>
                                    <h2 style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 800, fontSize: 'clamp(20px,3vw,30px)', color: '#08182E', lineHeight: 1.2 }}>
                                        {isLocked
                                            ? <>Nilai <span style={{ color: '#64748B' }}>Terkunci</span></>
                                            : <>Nilai <span className="gradient-text-sky">Desain</span></>
                                        }
                                    </h2>
                                </div>
                            </div>
                        </div>

                        {/* Banner locked — dari kiri */}
                        {isLocked && (
                            <div className="anim-left delay-2" style={{ background: 'rgba(100,116,139,0.1)', border: '1.5px solid rgba(100,116,139,0.25)', borderRadius: 16, padding: '16px 20px', marginBottom: 24, display: 'flex', alignItems: 'center', gap: 12 }}>
                                <IconAlertCircle size={20} color="#64748B" style={{ flexShrink: 0 }} />
                                <div>
                                    <p style={{ fontSize: 13, fontWeight: 700, color: '#334155', fontFamily: "'Montserrat', sans-serif", marginBottom: 2 }}>Desain ini sudah dinilai oleh juri lain</p>
                                    <p style={{ fontSize: 12, color: '#64748B' }}>Setiap karya hanya dinilai oleh satu juri. Kartu ini tidak dapat diubah atau dinilai ulang.</p>
                                </div>
                            </div>
                        )}

                        {/* Banner edit — dari kiri */}
                        {existingScore && !isLocked && (
                            <div className="anim-left delay-2" style={{ background: 'rgba(245,158,11,0.08)', border: '1.5px solid rgba(245,158,11,0.25)', borderRadius: 16, padding: '16px 20px', marginBottom: 24, display: 'flex', alignItems: 'center', gap: 12 }}>
                                <IconEdit size={20} color="#D97706" style={{ flexShrink: 0 }} />
                                <div>
                                    <p style={{ fontSize: 13, fontWeight: 700, color: '#92400E', fontFamily: "'Montserrat', sans-serif", marginBottom: 2 }}>Anda sudah menilai desain ini</p>
                                    <p style={{ fontSize: 12, color: '#B45309' }}>Geser slider untuk mengubah nilai, lalu klik <strong>Update Penilaian</strong>.</p>
                                </div>
                            </div>
                        )}

                        <div className="form-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: 'clamp(16px,2.5vw,28px)', alignItems: 'start' }}>

                            {/* ── Kiri: Info Desain — dari kiri ── */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

                                {/* Gambar — anim-left */}
                                <div className="anim-left delay-2" style={{ borderRadius: 22, overflow: 'hidden', border: '1.5px solid rgba(255,255,255,0.88)', boxShadow: '0 8px 32px rgba(11,31,58,0.14)', position: 'relative' }}>
                                    <img src={`/storage/${design.file_path}`} alt={design.judul} style={{ width: '100%', aspectRatio: '4/3', objectFit: 'cover', display: 'block', filter: isLocked ? 'grayscale(30%)' : 'none', transition: 'filter .3s ease' }} />
                                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(8,24,46,0.6) 0%, transparent 50%)' }} />
                                    <div style={{ position: 'absolute', bottom: 16, left: 16, right: 16 }}>
                                        <p style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 800, fontSize: 16, color: '#fff', marginBottom: 4 }}>{design.judul}</p>
                                        <p style={{ fontSize: 12, color: 'rgba(186,230,253,0.85)', display: 'flex', alignItems: 'center', gap: 5 }}>
                                            <IconUser size={12} /> {design.user?.name ?? '-'}
                                        </p>
                                    </div>
                                    {isLocked && (
                                        <div style={{ position: 'absolute', top: 12, right: 12, background: 'rgba(100,116,139,0.9)', backdropFilter: 'blur(8px)', color: '#fff', borderRadius: 999, padding: '5px 12px', fontSize: 11, fontWeight: 800, fontFamily: "'Montserrat', sans-serif", display: 'flex', alignItems: 'center', gap: 5 }}>
                                            <IconLock size={11} /> Terkunci
                                        </div>
                                    )}
                                </div>

                                {/* Detail info — anim-left */}
                                <div className="anim-left delay-3" style={{ background: 'rgba(255,255,255,0.72)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', border: '1.5px solid rgba(255,255,255,0.88)', borderRadius: 20, padding: '20px 22px', boxShadow: '0 4px 18px rgba(11,31,58,0.06)' }}>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                                        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                                            <IconUser size={16} color="#4A6A8A" />
                                            <div>
                                                <p style={{ fontSize: 9, fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase', color: '#4A6A8A', fontFamily: "'Montserrat', sans-serif" }}>Peserta</p>
                                                <p style={{ fontSize: 13, fontWeight: 700, color: '#0B1F3A', fontFamily: "'Montserrat', sans-serif" }}>{design.user?.name ?? '-'}</p>
                                            </div>
                                        </div>
                                        {design.event && (
                                            <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                                                <IconCalendarEvent size={16} color="#4A6A8A" />
                                                <div>
                                                    <p style={{ fontSize: 9, fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase', color: '#4A6A8A', fontFamily: "'Montserrat', sans-serif" }}>Event</p>
                                                    <p style={{ fontSize: 13, fontWeight: 700, color: '#0B1F3A', fontFamily: "'Montserrat', sans-serif" }}>{design.event.nama}</p>
                                                </div>
                                            </div>
                                        )}
                                        {design.deskripsi && (
                                            <>
                                                <div style={{ height: 1, background: 'rgba(14,165,233,0.12)' }} />
                                                <div>
                                                    <p style={{ fontSize: 9, fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase', color: '#4A6A8A', fontFamily: "'Montserrat', sans-serif", marginBottom: 6 }}>Deskripsi</p>
                                                    <p style={{ fontSize: 13, color: '#1A3A5C', lineHeight: 1.6 }}>{design.deskripsi}</p>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </div>

                                {/* Live score preview — anim-left */}
                                <div className="anim-left delay-4" style={{ background: isLocked ? 'rgba(100,116,139,0.08)' : `linear-gradient(135deg, ${avgColor}18, ${avgColor}08)`, border: isLocked ? '1.5px solid rgba(100,116,139,0.2)' : `1.5px solid ${avgColor}30`, borderRadius: 20, padding: '20px 24px', textAlign: 'center', boxShadow: isLocked ? 'none' : `0 4px 18px ${avgColor}15` }}>
                                    <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.14em', textTransform: 'uppercase', color: isLocked ? '#94A3B8' : avgColor, fontFamily: "'Montserrat', sans-serif", marginBottom: 8 }}>
                                        {isLocked ? 'Nilai Juri Lain' : 'Rata-rata Sementara'}
                                    </p>
                                    <p style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 900, fontSize: 64, color: isLocked ? '#94A3B8' : avgColor, lineHeight: 1 }}>{avg}</p>
                                    <p style={{ fontSize: 11, color: '#4A6A8A', marginTop: 6 }}>dari 100 poin</p>
                                    <div style={{ marginTop: 14, background: isLocked ? 'rgba(100,116,139,0.12)' : `${avgColor}18`, borderRadius: 8, height: 8, overflow: 'hidden' }}>
                                        <div style={{ width: `${avg}%`, height: '100%', background: isLocked ? 'rgba(100,116,139,0.4)' : `linear-gradient(90deg, ${avgColor}, ${avgColor}bb)`, borderRadius: 8, transition: 'width .5s ease' }} />
                                    </div>
                                </div>
                            </div>

                            {/* ── Kanan: Form Slider — dari kanan, stagger ── */}
                            <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

                                {criteria.map(({ label, field, icon, desc }, ci) => {
                                    const val = Number(data[field]);
                                    const barColor = isLocked ? '#94A3B8' : val >= 90 ? '#059669' : val >= 75 ? '#0EA5E9' : val >= 50 ? '#D97706' : '#EF4444';
                                    return (
                                        <div key={field} className={`score-card anim-right slider-${ci}`} style={{ opacity: isLocked ? 0.75 : 1 }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
                                                <div>
                                                    <p style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 800, fontSize: 14, color: '#0B1F3A', display: 'flex', alignItems: 'center', gap: 7 }}>
                                                        <span style={{ color: '#4A6A8A' }}>{icon}</span> {label}
                                                    </p>
                                                    <p style={{ fontSize: 11, color: '#4A6A8A', marginTop: 3 }}>{desc}</p>
                                                </div>
                                                <div style={{ background: `${barColor}15`, border: `1.5px solid ${barColor}30`, borderRadius: 12, padding: '6px 16px', minWidth: 58, textAlign: 'center' }}>
                                                    <span style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 900, fontSize: 22, color: barColor, lineHeight: 1 }}>{val}</span>
                                                </div>
                                            </div>
                                            <input
                                                type="range" min={0} max={100} step={1}
                                                value={val}
                                                disabled={isLocked}
                                                onChange={(e) => !isLocked && setData(field, Number(e.target.value))}
                                                style={getTrackStyle(val)}
                                            />
                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }}>
                                                <span style={{ fontSize: 10, color: '#4A6A8A', fontWeight: 600 }}>0 · Kurang</span>
                                                <span style={{ fontSize: 10, color: '#4A6A8A', fontWeight: 600 }}>100 · Sempurna</span>
                                            </div>
                                        </div>
                                    );
                                })}

                                {/* Catatan — anim-right */}
                                <div className="anim-right delay-5" style={{ background: 'rgba(255,255,255,0.72)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', border: '1.5px solid rgba(255,255,255,0.88)', borderRadius: 20, padding: '20px 22px', boxShadow: '0 4px 18px rgba(11,31,58,0.06)' }}>
                                    <p style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 700, fontSize: 13, color: '#0B1F3A', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 6 }}>
                                        <IconNotes size={15} color="#4A6A8A" /> Catatan untuk Peserta
                                        <span style={{ fontSize: 10, fontWeight: 500, color: '#4A6A8A', marginLeft: 4 }}>(opsional)</span>
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

                                {/* Submit / Update / Locked — anim-bottom */}
                                <div className="anim-bottom delay-6">
                                    {isLocked ? (
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, background: 'rgba(100,116,139,0.1)', border: '1.5px solid rgba(100,116,139,0.25)', borderRadius: 999, padding: '16px 28px' }}>
                                            <IconLock size={18} color="#94A3B8" />
                                            <span style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 700, fontSize: 14, color: '#64748B' }}>Form Terkunci — Sudah Dinilai Juri Lain</span>
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

                                {/* Back — anim-bottom */}
                                <div className="anim-bottom delay-6">
                                    <Link href="/juri/designs" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, textDecoration: 'none', fontSize: 12, color: '#4A6A8A', fontWeight: 600, fontFamily: "'Montserrat', sans-serif" }}>
                                        <IconArrowLeft size={13} /> Kembali ke Daftar Desain
                                    </Link>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}