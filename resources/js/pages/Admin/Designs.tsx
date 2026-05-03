import { Link, router } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import AdminSidebar from '@/components/AdminSidebar';
import {
    IconPhoto, IconCircleCheck, IconClock, IconLayoutDashboard,
    IconUserStar, IconChartBar, IconTrash, IconAlertTriangle,
    IconX, IconCheck,
} from '@tabler/icons-react';

// ─── TYPES ─────────────────────────────────────────────────
interface AuthUser { name: string; email: string; role: string; }
interface Juri { name: string; }
interface Score { id: number; rata_rata: number; juri: Juri | null; }
interface Design {
    id: number; judul: string; file_path: string;
    user: { name: string } | null; scores: Score[];
}
interface Props {
    auth: { user: AuthUser };
    designs: Design[];
    pending_count?: number;
}

// ─── STYLES ────────────────────────────────────────────────
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700;800;900&family=Open+Sans:wght@300;400;600&display=swap');
  *, *::before, *::after { box-sizing: border-box; }
  ::-webkit-scrollbar { width: 5px; }
  ::-webkit-scrollbar-track { background: #C8E9FF; }
  ::-webkit-scrollbar-thumb { background: linear-gradient(#0EA5E9,#1565C0); border-radius: 3px; }

  @keyframes orb-drift-ad { 0%,100%{transform:translate(0,0)} 33%{transform:translate(18px,-12px)} 66%{transform:translate(-14px,16px)} }

  @keyframes slideFromTop    { from{opacity:0;transform:translateY(-36px)} to{opacity:1;transform:translateY(0)} }
  @keyframes slideFromLeft   { from{opacity:0;transform:translateX(-56px)} to{opacity:1;transform:translateX(0)} }
  @keyframes slideFromRight  { from{opacity:0;transform:translateX(56px)}  to{opacity:1;transform:translateX(0)} }
  @keyframes slideFromBottom { from{opacity:0;transform:translateY(36px)}  to{opacity:1;transform:translateY(0)} }
  @keyframes popIn           { from{opacity:0;transform:scale(0.7) rotate(-15deg)} to{opacity:1;transform:scale(1) rotate(0deg)} }
  @keyframes modalIn         { from{opacity:0;transform:scale(0.88) translateY(16px)} to{opacity:1;transform:scale(1) translateY(0)} }

  .addes-ready .anim-top    { animation: slideFromTop    0.55s cubic-bezier(0.22,1,0.36,1) both; }
  .addes-ready .anim-left   { animation: slideFromLeft   0.55s cubic-bezier(0.22,1,0.36,1) both; }
  .addes-ready .anim-right  { animation: slideFromRight  0.55s cubic-bezier(0.22,1,0.36,1) both; }
  .addes-ready .anim-bottom { animation: slideFromBottom 0.55s cubic-bezier(0.22,1,0.36,1) both; }
  .addes-ready .anim-pop    { animation: popIn           0.45s cubic-bezier(0.34,1.56,0.64,1) both; }

  .addes-ready .delay-1 { animation-delay: 0.08s; }
  .addes-ready .delay-2 { animation-delay: 0.18s; }
  .addes-ready .delay-3 { animation-delay: 0.28s; }
  .addes-ready .delay-4 { animation-delay: 0.38s; }
  .addes-ready .stat-0  { animation-delay: 0.10s; }
  .addes-ready .stat-1  { animation-delay: 0.18s; }
  .addes-ready .stat-2  { animation-delay: 0.26s; }
  .addes-ready .card-0  { animation-delay: 0.42s; }
  .addes-ready .card-1  { animation-delay: 0.50s; }
  .addes-ready .card-2  { animation-delay: 0.58s; }
  .addes-ready .card-3  { animation-delay: 0.66s; }
  .addes-ready .card-4  { animation-delay: 0.74s; }

  .anim-top,.anim-left,.anim-right,.anim-bottom,.anim-pop { opacity: 0; }

  .addes-glass {
    background: rgba(255,255,255,0.72);
    backdrop-filter: blur(20px) saturate(160%);
    -webkit-backdrop-filter: blur(20px) saturate(160%);
    border: 1.5px solid rgba(255,255,255,0.88);
    box-shadow: 0 6px 26px rgba(11,31,58,0.08), inset 0 1px 0 rgba(255,255,255,0.92);
  }
  .addes-card {
    background: rgba(255,255,255,0.80);
    backdrop-filter: blur(16px);
    border: 1.5px solid rgba(255,255,255,0.85);
    box-shadow: 0 4px 18px rgba(11,31,58,0.07);
    border-radius: 22px; overflow: hidden;
    transition: transform .32s cubic-bezier(.34,1.4,.64,1), box-shadow .32s ease;
  }
  .addes-card:hover {
    transform: translateY(-6px) scale(1.015);
    box-shadow: 0 18px 44px rgba(11,31,58,0.13);
  }
  .addes-badge {
    border-radius: 999px; padding: 4px 12px;
    font-size: 10px; font-weight: 700;
    font-family: 'Montserrat',sans-serif; letter-spacing: .1em;
  }
  .addes-score-chip {
    display: flex; justify-content: space-between; align-items: center;
    padding: 10px 14px; border-radius: 12px;
    margin-bottom: 8px; transition: transform .2s ease;
  }
  .addes-score-chip:last-child { margin-bottom: 0; }
  .addes-score-chip:hover { transform: translateX(3px); }

  /* ── Tombol hapus ── */
  .addes-delete-btn {
    display: flex; align-items: center; justify-content: center; gap: 6px;
    width: 100%; padding: 9px 0; border-radius: 10px; border: none; cursor: pointer;
    font-family: 'Montserrat',sans-serif; font-size: 11px; font-weight: 700;
    letter-spacing: .06em;
    background: rgba(239,68,68,0.08); color: #DC2626;
    border: 1.5px solid rgba(239,68,68,0.2);
    transition: all .22s ease;
    margin-top: 12px;
  }
  .addes-delete-btn:hover {
    background: rgba(239,68,68,0.14); border-color: rgba(239,68,68,0.4);
    transform: translateY(-1px);
  }
  .addes-delete-btn:active { transform: translateY(0); }

  /* ── Modal backdrop ── */
  .addes-modal-backdrop {
    position: fixed; inset: 0; z-index: 999;
    background: rgba(8,24,46,0.55);
    backdrop-filter: blur(6px);
    display: flex; align-items: center; justify-content: center;
    padding: 20px;
  }
  .addes-modal {
    background: #fff; border-radius: 24px;
    box-shadow: 0 24px 64px rgba(8,24,46,0.22);
    padding: 32px 28px 28px;
    max-width: 400px; width: 100%;
    animation: modalIn 0.3s cubic-bezier(0.34,1.4,0.64,1) both;
  }
`;

// ─── MODAL KONFIRMASI HAPUS ────────────────────────────────
function DeleteModal({ design, onCancel, onConfirm }: {
    design: Design;
    onCancel: () => void;
    onConfirm: () => void;
}) {
    return (
        <div className="addes-modal-backdrop" onClick={onCancel}>
            <div className="addes-modal" onClick={e => e.stopPropagation()}>
                {/* Icon */}
                <div style={{ width: 56, height: 56, borderRadius: 18, background: 'rgba(239,68,68,0.1)', border: '1.5px solid rgba(239,68,68,0.22)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                    <IconAlertTriangle size={26} color="#DC2626" />
                </div>

                {/* Teks */}
                <h2 style={{ fontFamily: "'Montserrat',sans-serif", fontWeight: 900, fontSize: 18, color: '#0B1F3A', textAlign: 'center', marginBottom: 10 }}>
                    Hapus Desain?
                </h2>
                <p style={{ fontSize: 13, color: '#4A6A8A', textAlign: 'center', lineHeight: 1.6, marginBottom: 6 }}>
                    Kamu akan menghapus karya
                </p>
                <p style={{ fontFamily: "'Montserrat',sans-serif", fontWeight: 800, fontSize: 14, color: '#0B1F3A', textAlign: 'center', marginBottom: 6 }}>
                    "{design.judul}"
                </p>
                <p style={{ fontSize: 12, color: '#4A6A8A', textAlign: 'center', marginBottom: 24 }}>
                    milik <strong style={{ color: '#0B2855' }}>{design.user?.name ?? '-'}</strong>.<br />
                    <span style={{ color: '#DC2626', fontWeight: 600 }}>Tindakan ini tidak bisa dibatalkan.</span>
                </p>

                {/* Tombol */}
                <div style={{ display: 'flex', gap: 10 }}>
                    <button
                        onClick={onCancel}
                        style={{ flex: 1, padding: '11px 0', borderRadius: 12, border: '1.5px solid rgba(11,31,58,0.14)', background: 'rgba(11,31,58,0.04)', cursor: 'pointer', fontFamily: "'Montserrat',sans-serif", fontWeight: 700, fontSize: 13, color: '#1A3A5C', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, transition: 'all .2s ease' }}
                    >
                        <IconX size={15} /> Batal
                    </button>
                    <button
                        onClick={onConfirm}
                        style={{ flex: 1, padding: '11px 0', borderRadius: 12, border: 'none', background: 'linear-gradient(135deg,#EF4444,#DC2626)', cursor: 'pointer', fontFamily: "'Montserrat',sans-serif", fontWeight: 700, fontSize: 13, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, boxShadow: '0 6px 18px rgba(239,68,68,0.35)', transition: 'all .2s ease' }}
                    >
                        <IconCheck size={15} /> Ya, Hapus
                    </button>
                </div>
            </div>
        </div>
    );
}

// ─── MAIN ──────────────────────────────────────────────────
export default function AdminDesigns({ auth, designs, pending_count = 0 }: Props) {
    const [ready, setReady] = useState(false);
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState<Design | null>(null);

    useEffect(() => {
        const t = requestAnimationFrame(() => requestAnimationFrame(() => setReady(true)));
        return () => cancelAnimationFrame(t);
    }, []);

    const dinilai = designs.filter(d => (d.scores?.length ?? 0) > 0).length;
    const pending  = designs.length - dinilai;
    const sidebarWidth = sidebarCollapsed ? 64 : 240;

    const handleDelete = () => {
        if (!deleteTarget) return;
        router.delete(`/admin/designs/${deleteTarget.id}`, {
            onFinish: () => setDeleteTarget(null),
        });
    };

    return (
        <div className={ready ? 'addes-ready' : ''} style={{ display: 'flex', minHeight: '100vh', fontFamily: "'Open Sans',sans-serif" }}>
            <style>{STYLES}</style>

            {/* Modal konfirmasi */}
            {deleteTarget && (
                <DeleteModal
                    design={deleteTarget}
                    onCancel={() => setDeleteTarget(null)}
                    onConfirm={handleDelete}
                />
            )}

            <AdminSidebar user={auth.user} activePage="designs" pendingUsers={pending_count} onCollapse={setSidebarCollapsed} />

            <div style={{
                marginLeft: sidebarWidth, flex: 1,
                background: 'linear-gradient(170deg,#A8D8FF 0%,#C4E5FF 16%,#DDF1FF 38%,#CBE8FF 62%,#B0D8FF 100%)',
                minHeight: '100vh', position: 'relative',
                transition: 'margin-left 0.3s cubic-bezier(0.4,0,0.2,1)',
            }}>
                {/* Orbs */}
                <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }}>
                    <div style={{ position: 'absolute', width: 500, height: 500, top: -150, right: -80, borderRadius: '50%', background: 'radial-gradient(circle,rgba(14,165,233,0.12) 0%,transparent 65%)', animation: 'orb-drift-ad 26s ease-in-out infinite' }} />
                    <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(rgba(11,31,58,0.06) 1px,transparent 1px)', backgroundSize: '28px 28px' }} />
                </div>

                <div style={{ maxWidth: 1200, margin: '0 auto', padding: 'clamp(32px,4vw,48px) clamp(20px,4vw,40px)', position: 'relative', zIndex: 1 }}>

                    

                    {/* Header */}
                    <div className="anim-top delay-1" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 32 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                            <div className="anim-pop delay-1" style={{ width: 48, height: 48, borderRadius: 16, background: 'linear-gradient(135deg,#0EA5E9,#1565C0)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 24px rgba(14,165,233,0.35)', flexShrink: 0 }}>
                                <IconPhoto size={22} color="#fff" />
                            </div>
                            <div>
                                <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.18em', textTransform: 'uppercase', color: '#0EA5E9', marginBottom: 4, fontFamily: "'Montserrat',sans-serif" }}>— KONTEN —</p>
                                <h1 style={{ fontFamily: "'Montserrat',sans-serif", fontWeight: 900, fontSize: 'clamp(22px,3vw,32px)', color: '#08182E', lineHeight: 1.2 }}>
                                    Semua <span style={{ color: '#0EA5E9' }}>Desain</span>
                                </h1>
                                <p style={{ fontSize: 13, color: '#1A3A5C', marginTop: 4 }}>Pantau semua karya peserta kompetisi</p>
                            </div>
                        </div>

                        {/* Mini stats */}
                        <div style={{ display: 'flex', gap: 12 }}>
                            {[
                                { value: designs.length, label: 'Total',   color: '#0EA5E9', icon: <IconPhoto size={16} color="#0EA5E9" />, idx: 0 },
                                { value: dinilai,         label: 'Dinilai', color: '#059669', icon: <IconCircleCheck size={16} color="#059669" />, idx: 1 },
                                { value: pending,         label: 'Pending', color: '#D97706', icon: <IconClock size={16} color="#D97706" />, idx: 2 },
                            ].map(s => (
                                <div key={s.label} className={`addes-glass anim-right stat-${s.idx}`} style={{ borderRadius: 14, padding: '12px 18px', textAlign: 'center' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 4 }}>{s.icon}</div>
                                    <p style={{ fontFamily: "'Montserrat',sans-serif", fontWeight: 900, fontSize: 22, color: s.color, lineHeight: 1 }}>{s.value}</p>
                                    <p style={{ fontSize: 9.5, fontWeight: 700, color: '#1A3A5C', letterSpacing: '.1em', textTransform: 'uppercase', fontFamily: "'Montserrat',sans-serif", marginTop: 4 }}>{s.label}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Grid desain */}
                    {designs.length === 0 ? (
                        <div className="addes-glass anim-bottom delay-2" style={{ borderRadius: 22, textAlign: 'center', padding: '80px 0' }}>
                            <IconPhoto size={52} color="rgba(14,165,233,0.3)" style={{ margin: '0 auto 16px' }} />
                            <p style={{ fontFamily: "'Montserrat',sans-serif", fontWeight: 700, fontSize: 16, color: '#0B1F3A', marginBottom: 6 }}>Belum ada desain</p>
                            <p style={{ fontSize: 13, color: '#4A6A8A' }}>Desain peserta akan muncul di sini setelah diupload</p>
                        </div>
                    ) : (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: 'clamp(14px,2vw,22px)' }}>
                            {designs.map((d, idx) => {
                                const isDinilai = (d.scores?.length ?? 0) > 0;
                                const dir = idx % 2 === 0 ? 'anim-left' : 'anim-right';
                                return (
                                    <div key={d.id} className={`addes-card ${dir} card-${Math.min(idx, 4)}`}>
                                        {/* Gambar */}
                                        <div style={{ position: 'relative', height: 190, overflow: 'hidden' }}>
                                            <img
                                                src={`/storage/${d.file_path}`} alt={d.judul}
                                                style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform .4s ease' }}
                                                onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.05)')}
                                                onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
                                            />
                                            <div style={{ position: 'absolute', top: 12, right: 12 }}>
                                                {isDinilai
                                                    ? <span className="addes-badge" style={{ background: 'rgba(5,150,105,0.88)', color: '#fff', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.3)', display: 'inline-flex', alignItems: 'center', gap: 4 }}><IconCircleCheck size={11} /> Dinilai</span>
                                                    : <span className="addes-badge" style={{ background: 'rgba(217,119,6,0.88)', color: '#fff', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.3)', display: 'inline-flex', alignItems: 'center', gap: 4 }}><IconClock size={11} /> Pending</span>
                                                }
                                            </div>
                                            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 60, background: 'linear-gradient(to top,rgba(11,31,58,0.4),transparent)' }} />
                                        </div>

                                        {/* Info */}
                                        <div style={{ padding: '16px 18px 18px' }}>
                                            <h3 style={{ fontFamily: "'Montserrat',sans-serif", fontWeight: 800, fontSize: 14, color: '#0B1F3A', marginBottom: 4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                {d.judul}
                                            </h3>
                                            <p style={{ fontSize: 12, color: '#4A6A8A', marginBottom: 14 }}>
                                                Peserta: <span style={{ fontWeight: 600, color: '#0B2855' }}>{d.user?.name ?? '-'}</span>
                                            </p>

                                            {isDinilai ? (
                                                <div>
                                                    {d.scores.map(s => (
                                                        <div key={s.id} className="addes-score-chip" style={{ background: 'rgba(5,150,105,0.07)', border: '1px solid rgba(5,150,105,0.15)' }}>
                                                            <p style={{ fontSize: 11, color: '#047857', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 5 }}>
                                                                <IconUserStar size={13} /> Juri: <span style={{ fontWeight: 700 }}>{s.juri?.name ?? '-'}</span>
                                                            </p>
                                                            <span style={{ fontFamily: "'Montserrat',sans-serif", fontWeight: 900, fontSize: 20, color: '#059669', display: 'flex', alignItems: 'center', gap: 4 }}>
                                                                <IconChartBar size={14} color="#059669" /> {s.rata_rata}
                                                            </span>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <div style={{ background: 'rgba(217,119,6,0.07)', border: '1px solid rgba(217,119,6,0.18)', borderRadius: 12, padding: '12px 14px', textAlign: 'center', display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'center' }}>
                                                    <IconClock size={15} color="#A86100" />
                                                    <p style={{ fontSize: 12, color: '#A86100', fontWeight: 600, fontFamily: "'Montserrat',sans-serif" }}>Menunggu penilaian juri</p>
                                                </div>
                                            )}

                                            {/* Tombol Hapus */}
                                            <button className="addes-delete-btn" onClick={() => setDeleteTarget(d)}>
                                                <IconTrash size={13} /> HAPUS DESAIN
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}