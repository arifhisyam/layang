import { router } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import AdminSidebar from '@/components/AdminSidebar';
import {
    IconUsers, IconCheck, IconX, IconTrash,
    IconBell, IconMail, IconCalendar, IconUserCheck, IconUserX, IconClock,
} from '@tabler/icons-react';

// ─── TYPES ─────────────────────────────────────────────────
interface AuthUser { name: string; email: string; role: string; }
interface User {
    id: number; name: string; email: string;
    role: string; status: string; created_at: string;
}
interface Props {
    auth: { user: AuthUser };
    pending_users?: User[];
    approved_users?: User[];
    rejected_users?: User[];
}
type Tab = 'pending' | 'approved' | 'rejected';

// ─── STYLES ────────────────────────────────────────────────
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700;800;900&family=Open+Sans:wght@300;400;600&display=swap');
  *, *::before, *::after { box-sizing: border-box; }
  ::-webkit-scrollbar { width: 5px; }
  ::-webkit-scrollbar-track { background: #C8E9FF; }
  ::-webkit-scrollbar-thumb { background: linear-gradient(#0EA5E9,#1565C0); border-radius: 3px; }

  @keyframes orb-drift-u  { 0%,100%{transform:translate(0,0)} 33%{transform:translate(20px,-14px)} 66%{transform:translate(-16px,18px)} }
  @keyframes blink-dot-u  { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.4;transform:scale(0.7)} }
  @keyframes pulse-ring    { 0%{transform:scale(1);opacity:.5} 70%{transform:scale(1.55);opacity:0} 100%{transform:scale(1.55);opacity:0} }

  @keyframes slideFromTop    { from{opacity:0;transform:translateY(-36px)} to{opacity:1;transform:translateY(0)} }
  @keyframes slideFromLeft   { from{opacity:0;transform:translateX(-56px)} to{opacity:1;transform:translateX(0)} }
  @keyframes slideFromRight  { from{opacity:0;transform:translateX(56px)}  to{opacity:1;transform:translateX(0)} }
  @keyframes slideFromBottom { from{opacity:0;transform:translateY(36px)}  to{opacity:1;transform:translateY(0)} }
  @keyframes popIn           { from{opacity:0;transform:scale(0.7) rotate(-15deg)} to{opacity:1;transform:scale(1) rotate(0deg)} }

  .au-ready .anim-top    { animation: slideFromTop    0.55s cubic-bezier(0.22,1,0.36,1) both; }
  .au-ready .anim-left   { animation: slideFromLeft   0.55s cubic-bezier(0.22,1,0.36,1) both; }
  .au-ready .anim-right  { animation: slideFromRight  0.55s cubic-bezier(0.22,1,0.36,1) both; }
  .au-ready .anim-bottom { animation: slideFromBottom 0.55s cubic-bezier(0.22,1,0.36,1) both; }
  .au-ready .anim-pop    { animation: popIn           0.45s cubic-bezier(0.34,1.56,0.64,1) both; }

  .au-ready .delay-1 { animation-delay: 0.08s; }
  .au-ready .delay-2 { animation-delay: 0.18s; }
  .au-ready .delay-3 { animation-delay: 0.28s; }
  .au-ready .delay-4 { animation-delay: 0.38s; }
  .au-ready .delay-5 { animation-delay: 0.48s; }

  .anim-top,.anim-left,.anim-right,.anim-bottom,.anim-pop { opacity: 0; }

  .au-glass {
    background: rgba(255,255,255,0.72);
    backdrop-filter: blur(20px) saturate(160%);
    -webkit-backdrop-filter: blur(20px) saturate(160%);
    border: 1.5px solid rgba(255,255,255,0.88);
    box-shadow: 0 6px 26px rgba(11,31,58,0.08), inset 0 1px 0 rgba(255,255,255,0.92);
  }
  .au-stat-card {
    background: rgba(255,255,255,0.65);
    backdrop-filter: blur(16px) saturate(150%);
    -webkit-backdrop-filter: blur(16px) saturate(150%);
    border: 1.5px solid rgba(255,255,255,0.85);
    box-shadow: 0 4px 18px rgba(11,31,58,0.07), inset 0 1px 0 rgba(255,255,255,0.9);
    border-radius: 18px; padding: 20px 22px; flex: 1; min-width: 0;
  }
  .au-row:hover { background: rgba(14,165,233,0.04) !important; }
  .au-tab-btn {
    flex: 1; display: flex; align-items: center; justify-content: center; gap: 8px;
    padding: 11px 12px; border-radius: 12px; border: none; cursor: pointer;
    font-family: 'Montserrat',sans-serif; font-size: 12px; font-weight: 700;
    letter-spacing: .04em; transition: all .22s ease; background: transparent;
    color: rgba(186,230,253,0.55);
  }
  .au-tab-btn:hover { background: rgba(255,255,255,0.1); color: rgba(186,230,253,0.85); }
  .au-tab-btn.active { background: rgba(255,255,255,0.2); color: #fff; border: 1px solid rgba(14,165,233,0.35); }
  .au-action-approve {
    display: inline-flex; align-items: center; gap: 5px;
    padding: 7px 14px; border-radius: 999px; border: none; cursor: pointer;
    font-family: 'Montserrat',sans-serif; font-size: 11px; font-weight: 700;
    background: linear-gradient(135deg,#34D399,#059669); color: #fff;
    box-shadow: 0 4px 12px rgba(5,150,105,0.35);
    transition: all .22s cubic-bezier(.34,1.4,.64,1);
  }
  .au-action-approve:hover { transform: translateY(-2px) scale(1.04); box-shadow: 0 8px 20px rgba(5,150,105,0.48); }
  .au-action-reject {
    display: inline-flex; align-items: center; gap: 5px;
    padding: 7px 14px; border-radius: 999px; border: none; cursor: pointer;
    font-family: 'Montserrat',sans-serif; font-size: 11px; font-weight: 700;
    background: rgba(239,68,68,0.1); color: #DC2626;
    border: 1px solid rgba(239,68,68,0.22); transition: all .22s ease;
  }
  .au-action-reject:hover { background: rgba(239,68,68,0.18); transform: translateY(-1px); }
  .au-action-ghost {
    display: inline-flex; align-items: center; gap: 5px;
    padding: 7px 14px; border-radius: 999px; cursor: pointer;
    font-family: 'Montserrat',sans-serif; font-size: 11px; font-weight: 700;
    background: rgba(14,165,233,0.08); color: #0EA5E9;
    border: 1px solid rgba(14,165,233,0.22); transition: all .22s ease;
  }
  .au-action-ghost:hover { background: rgba(14,165,233,0.16); transform: translateY(-1px); }
  .au-delete-btn {
    width: 30px; height: 30px; border-radius: 8px; border: none; cursor: pointer;
    background: transparent; color: #CBD5E1;
    transition: all .2s ease; display: flex; align-items: center; justify-content: center;
  }
  .au-delete-btn:hover { background: rgba(239,68,68,0.08); color: #EF4444; }

  /* ── MOBILE CARD ── */
  .au-mobile-card {
    display: none; flex-direction: column;
    background: rgba(255,255,255,0.72); backdrop-filter: blur(16px);
    border: 1.5px solid rgba(255,255,255,0.88); border-radius: 16px;
    padding: 14px 16px; box-shadow: 0 4px 16px rgba(11,31,58,0.07);
  }
  .au-desktop-table { display: block; }

  /* ── Main content: transition via CSS class ── */
  .au-main-content {
    transition: margin-left 0.3s cubic-bezier(0.4,0,0.2,1);
  }

  /* Mobile spacer */
  .au-mobile-spacer { display: none; }

  /* ── MOBILE OVERRIDES ── */
  @media (max-width: 768px) {
    /* KEY FIX: reset margin so content fills full width */
    .au-main-content {
      margin-left: 0 !important;
      padding-bottom: 80px !important;
    }

    /* Show spacer for top bar */
    .au-mobile-spacer {
      display: block;
      height: 56px;
    }
  }

  @media (max-width: 640px) {
    .au-desktop-table { display: none !important; }
    .au-mobile-card { display: flex; }
    .au-mobile-list { display: flex; flex-direction: column; gap: 10px; padding: 14px; }
    .au-tab-btn { padding: 10px 6px; font-size: 10px; gap: 4px; }
    .au-tab-count { display: none; }
    .au-notif-banner { flex-wrap: wrap; gap: 10px !important; padding: 14px 16px !important; }
    .au-notif-count { margin-left: 0 !important; width: 100%; text-align: center; }
    .au-stat-row { flex-direction: column !important; gap: 10px !important; }
  }
`;

// ─── Avatar ────────────────────────────────────────────────
const AVATAR_PALETTE = [
    ['#0EA5E9','#1565C0'], ['#6366F1','#4338CA'],
    ['#EC4899','#BE185D'], ['#10B981','#047857'], ['#F59E0B','#B45309'],
];
function Avatar({ name, size = 36 }: { name: string; size?: number }) {
    const [c1, c2] = AVATAR_PALETTE[name.charCodeAt(0) % AVATAR_PALETTE.length];
    return (
        <div style={{ width: size, height: size, borderRadius: '50%', background: `linear-gradient(135deg,${c1},${c2})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: size * 0.36, fontWeight: 800, color: '#fff', flexShrink: 0, fontFamily: "'Montserrat',sans-serif", boxShadow: `0 4px 10px ${c1}44` }}>
            {name[0].toUpperCase()}
        </div>
    );
}

// ─── Stat Card ────────────────────────────────────────────
function StatCard({ icon, label, value, color, delay }: { icon: React.ReactNode; label: string; value: string | number; color: string; delay: string }) {
    return (
        <div className={`au-stat-card anim-bottom ${delay}`}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                <div style={{ width: 34, height: 34, borderRadius: 10, background: `${color}1A`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ color }}>{icon}</div>
                </div>
                <span style={{ fontFamily: "'Montserrat',sans-serif", fontSize: 10, fontWeight: 700, color: '#6A8AAA', letterSpacing: '.1em', textTransform: 'uppercase' as const }}>{label}</span>
            </div>
            <p style={{ fontFamily: "'Montserrat',sans-serif", fontWeight: 900, fontSize: 28, color: '#08182E', lineHeight: 1 }}>{value}</p>
        </div>
    );
}

// ─── Mobile User Card ─────────────────────────────────────
function UserMobileCard({ u, tab, onApprove, onReject, onDelete }: {
    u: User; tab: Tab;
    onApprove: () => void; onReject: () => void; onDelete: () => void;
}) {
    const statusColor = tab === 'approved' ? '#059669' : tab === 'rejected' ? '#DC2626' : '#D97706';
    const statusLabel = tab === 'approved' ? 'Disetujui' : tab === 'rejected' ? 'Ditolak' : 'Menunggu';

    return (
        <div className="au-mobile-card">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
                    <Avatar name={u.name} size={38} />
                    <div style={{ minWidth: 0 }}>
                        <p style={{ fontWeight: 700, color: '#0B1F3A', fontFamily: "'Montserrat',sans-serif", fontSize: 13, marginBottom: 3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{u.name}</p>
                        <span style={{ background: `${statusColor}18`, color: statusColor, border: `1px solid ${statusColor}33`, borderRadius: 999, padding: '2px 9px', fontSize: 9, fontWeight: 700, fontFamily: "'Montserrat',sans-serif", letterSpacing: '.1em' }}>
                            {statusLabel.toUpperCase()}
                        </span>
                    </div>
                </div>
                <button className="au-delete-btn" onClick={onDelete} title="Hapus permanen"><IconTrash size={15} /></button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 5, paddingTop: 10, paddingBottom: 10, borderTop: '1px solid rgba(14,165,233,0.08)', borderBottom: '1px solid rgba(14,165,233,0.08)', marginBottom: 10 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                    <IconMail size={12} color="#A0B8D0" style={{ flexShrink: 0 }} />
                    <span style={{ fontSize: 12, color: '#4A6A8A', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{u.email}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                    <IconCalendar size={12} color="#A0B8D0" style={{ flexShrink: 0 }} />
                    <span style={{ fontSize: 11, color: '#7A9AB8', fontFamily: "'Montserrat',sans-serif" }}>
                        {new Date(u.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                </div>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
                {tab === 'pending' && (
                    <>
                        <button className="au-action-approve" style={{ flex: 1, justifyContent: 'center' }} onClick={onApprove}><IconCheck size={12} /> Setujui</button>
                        <button className="au-action-reject"  style={{ flex: 1, justifyContent: 'center' }} onClick={onReject}><IconX size={12} /> Tolak</button>
                    </>
                )}
                {tab === 'approved' && (
                    <button className="au-action-reject" style={{ flex: 1, justifyContent: 'center' }} onClick={onReject}><IconX size={12} /> Cabut Akses</button>
                )}
                {tab === 'rejected' && (
                    <button className="au-action-ghost" style={{ flex: 1, justifyContent: 'center' }} onClick={onApprove}>↩ Pulihkan</button>
                )}
            </div>
        </div>
    );
}

// ─── MAIN ──────────────────────────────────────────────────
export default function AdminUsers({ auth, pending_users = [], approved_users = [], rejected_users = [] }: Props) {
    const [ready, setReady] = useState(false);
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [activeTab, setActiveTab] = useState<Tab>('pending');

    useEffect(() => {
        const t = requestAnimationFrame(() => requestAnimationFrame(() => setReady(true)));
        return () => cancelAnimationFrame(t);
    }, []);

    const approve = (id: number, name: string) => {
        if (confirm(`Setujui akun "${name}"?`)) router.post(`/admin/users/${id}/approve`);
    };
    const reject = (id: number, name: string) => {
        if (confirm(`Tolak akun "${name}"?`)) router.post(`/admin/users/${id}/reject`);
    };
    const hapus = (id: number) => {
        if (confirm('Hapus user ini secara permanen?')) router.delete(`/admin/users/${id}`);
    };

    const tabs: { key: Tab; label: string; count: number; dot: string }[] = [
        { key: 'pending',  label: 'Menunggu',  count: pending_users.length,  dot: '#F59E0B' },
        { key: 'approved', label: 'Disetujui', count: approved_users.length, dot: '#34D399' },
        { key: 'rejected', label: 'Ditolak',   count: rejected_users.length, dot: '#EF4444' },
    ];
    const currentUsers = { pending: pending_users, approved: approved_users, rejected: rejected_users }[activeTab];
    const sidebarWidth = sidebarCollapsed ? 64 : 240;

    return (
        <div className={ready ? 'au-ready' : ''} style={{ display: 'flex', minHeight: '100vh', fontFamily: "'Open Sans',sans-serif" }}>
            <style>{STYLES}</style>

            <AdminSidebar user={auth.user} activePage="users" pendingUsers={pending_users.length} onCollapse={setSidebarCollapsed} />

            {/* ── KEY FIX: margin-left via CSS class, bukan inline style ── */}
            <div
                className="au-main-content"
                style={{
                    marginLeft: sidebarWidth,
                    flex: 1,
                    background: 'linear-gradient(170deg,#A8D8FF 0%,#C4E5FF 16%,#DDF1FF 38%,#CBE8FF 62%,#B0D8FF 100%)',
                    minHeight: '100vh',
                    position: 'relative',
                }}
            >
                {/* Mobile top spacer */}
                <div className="au-mobile-spacer" />

                {/* Orbs */}
                <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }}>
                    <div style={{ position: 'absolute', width: 500, height: 500, top: -150, right: -100, borderRadius: '50%', background: 'radial-gradient(circle,rgba(14,165,233,0.12) 0%,transparent 65%)', animation: 'orb-drift-u 22s ease-in-out infinite' }} />
                    <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(rgba(11,31,58,0.06) 1px,transparent 1px)', backgroundSize: '28px 28px' }} />
                </div>

                <div style={{ maxWidth: 1000, margin: '0 auto', padding: 'clamp(24px,4vw,48px) clamp(14px,4vw,40px)', position: 'relative', zIndex: 1 }}>

                    {/* Header */}
                    <div className="anim-top delay-1" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                            <div className="anim-pop delay-1" style={{ width: 48, height: 48, borderRadius: 16, background: 'linear-gradient(135deg,#0EA5E9,#1565C0)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 24px rgba(14,165,233,0.35)', flexShrink: 0 }}>
                                <IconUsers size={22} color="#fff" />
                            </div>
                            <div>
                                <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.18em', textTransform: 'uppercase', color: '#0EA5E9', marginBottom: 4, fontFamily: "'Montserrat',sans-serif" }}>— MANAJEMEN —</p>
                                <h1 style={{ fontFamily: "'Montserrat',sans-serif", fontWeight: 900, fontSize: 'clamp(20px,3vw,32px)', color: '#08182E', lineHeight: 1.2 }}>
                                    Kelola <span style={{ color: '#0EA5E9' }}>User</span>
                                </h1>
                                <p style={{ fontSize: 13, color: '#1A3A5C', marginTop: 4 }}>Kelola pendaftaran dan akses peserta kompetisi</p>
                            </div>
                        </div>
                    </div>

                    {/* ── Stat cards ── */}
                    <div className="au-stat-row" style={{ display: 'flex', gap: 14, marginBottom: 28 }}>
                        <StatCard icon={<IconClock size={17} />}     label="Menunggu"   value={pending_users.length}  color="#F59E0B" delay="delay-2" />
                        <StatCard icon={<IconUserCheck size={17} />} label="Disetujui"  value={approved_users.length} color="#10B981" delay="delay-3" />
                        <StatCard icon={<IconUserX size={17} />}     label="Ditolak"    value={rejected_users.length} color="#EF4444" delay="delay-4" />
                    </div>

                    {/* Notif banner */}
                    {pending_users.length > 0 && (
                        <div className="anim-left delay-2 au-notif-banner" style={{ display: 'flex', alignItems: 'center', gap: 14, background: 'rgba(255,245,228,0.88)', border: '1.5px solid rgba(217,119,6,0.32)', borderRadius: 18, padding: '16px 22px', marginBottom: 28, backdropFilter: 'blur(14px)', boxShadow: '0 4px 18px rgba(217,119,6,0.1)' }}>
                            <span style={{ animation: 'blink-dot-u 2s ease-in-out infinite', flexShrink: 0 }}>
                                <IconBell size={24} color="#D97706" />
                            </span>
                            <p style={{ fontFamily: "'Montserrat',sans-serif", fontWeight: 800, fontSize: 14, color: '#92400E' }}>
                                {pending_users.length} pendaftar baru menunggu persetujuanmu!
                            </p>
                            <span className="au-notif-count" style={{ marginLeft: 'auto', background: 'rgba(217,119,6,0.18)', color: '#92400E', border: '1px solid rgba(217,119,6,0.32)', borderRadius: 999, padding: '3px 12px', fontSize: 10, fontWeight: 700, fontFamily: "'Montserrat',sans-serif", letterSpacing: '.1em', whiteSpace: 'nowrap' }}>
                                {pending_users.length} PENDING
                            </span>
                        </div>
                    )}

                    {/* Tab bar */}
                    <div className="anim-bottom delay-3" style={{ display: 'flex', gap: 4, background: 'rgba(10,60,130,0.72)', backdropFilter: 'blur(20px)', borderRadius: 16, padding: '6px', marginBottom: 20, border: '1px solid rgba(255,255,255,0.1)' }}>
                        {tabs.map(t => (
                            <button key={t.key} className={`au-tab-btn ${activeTab === t.key ? 'active' : ''}`} onClick={() => setActiveTab(t.key)}>
                                <span style={{ width: 6, height: 6, borderRadius: '50%', background: t.dot, display: 'inline-block', boxShadow: `0 0 6px ${t.dot}`, flexShrink: 0 }} />
                                {t.label}
                                <span className="au-tab-count" style={{ background: activeTab === t.key ? 'rgba(255,255,255,0.22)' : 'rgba(255,255,255,0.08)', borderRadius: 999, padding: '2px 8px', fontSize: 10, fontWeight: 900 }}>
                                    {t.count}
                                </span>
                            </button>
                        ))}
                    </div>

                    {/* Table + Mobile cards */}
                    <div className="au-glass anim-bottom delay-5" style={{ borderRadius: 22, overflow: 'hidden' }}>
                        {currentUsers.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '72px 24px', color: '#4A6A8A' }}>
                                <div style={{ position: 'relative', width: 72, height: 72, margin: '0 auto 20px' }}>
                                    <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: 'rgba(14,165,233,0.08)', animation: 'pulse-ring 2s ease-out infinite' }} />
                                    <div style={{ position: 'relative', width: '100%', height: '100%', borderRadius: '50%', background: 'rgba(14,165,233,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        {activeTab === 'pending'
                                            ? <IconBell size={30} color="rgba(245,158,11,0.5)" />
                                            : activeTab === 'approved'
                                            ? <IconCheck size={30} color="rgba(5,150,105,0.5)" />
                                            : <IconX size={30} color="rgba(239,68,68,0.5)" />
                                        }
                                    </div>
                                </div>
                                <p style={{ fontFamily: "'Montserrat',sans-serif", fontWeight: 700, fontSize: 15, marginBottom: 6, color: '#1A3A5C' }}>
                                    {activeTab === 'pending' ? 'Tidak ada pendaftar baru' : activeTab === 'approved' ? 'Belum ada user disetujui' : 'Tidak ada user ditolak'}
                                </p>
                                <p style={{ fontSize: 13, color: '#6A8AAA', maxWidth: 260, margin: '0 auto' }}>
                                    {activeTab === 'pending' ? 'Semua pendaftaran sudah ditangani' : activeTab === 'approved' ? 'Setujui pendaftar dari tab Menunggu' : 'Tidak ada riwayat penolakan'}
                                </p>
                            </div>
                        ) : (
                            <>
                                {/* Desktop table */}
                                <div className="au-desktop-table" style={{ overflowX: 'auto' }}>
                                    <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 560 }}>
                                        <thead>
                                            <tr style={{ borderBottom: '1.5px solid rgba(14,165,233,0.12)', background: 'rgba(14,165,233,0.03)' }}>
                                                {['#', 'Peserta', 'Email', 'Terdaftar', 'Aksi'].map(h => (
                                                    <th key={h} style={{ padding: '14px 18px', textAlign: 'left', fontSize: 10, fontWeight: 700, letterSpacing: '.14em', textTransform: 'uppercase', color: '#0B3A6A', fontFamily: "'Montserrat',sans-serif" }}>{h}</th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {currentUsers.map((u, idx) => (
                                                <tr key={u.id} className="au-row" style={{ borderBottom: '1px solid rgba(14,165,233,0.06)', transition: 'background .2s ease' }}>
                                                    <td style={{ padding: '14px 18px', color: '#A0B8D0', fontSize: 12, fontFamily: "'Montserrat',sans-serif", fontWeight: 700 }}>{idx + 1}</td>
                                                    <td style={{ padding: '14px 18px' }}>
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                                            <Avatar name={u.name} />
                                                            <span style={{ fontWeight: 700, color: '#0B1F3A', fontFamily: "'Montserrat',sans-serif", fontSize: 13 }}>{u.name}</span>
                                                        </div>
                                                    </td>
                                                    <td style={{ padding: '14px 18px', color: '#4A6A8A', fontSize: 13 }}>{u.email}</td>
                                                    <td style={{ padding: '14px 18px', color: '#7A9AB8', fontSize: 12 }}>
                                                        {new Date(u.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                                                    </td>
                                                    <td style={{ padding: '14px 18px' }}>
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                                            {activeTab === 'pending' && (
                                                                <>
                                                                    <button className="au-action-approve" onClick={() => approve(u.id, u.name)}><IconCheck size={12} /> Setujui</button>
                                                                    <button className="au-action-reject"  onClick={() => reject(u.id, u.name)}><IconX size={12} /> Tolak</button>
                                                                </>
                                                            )}
                                                            {activeTab === 'approved' && (
                                                                <button className="au-action-reject" onClick={() => reject(u.id, u.name)}><IconX size={12} /> Cabut Akses</button>
                                                            )}
                                                            {activeTab === 'rejected' && (
                                                                <button className="au-action-ghost" onClick={() => approve(u.id, u.name)}>↩ Pulihkan</button>
                                                            )}
                                                            <button className="au-delete-btn" onClick={() => hapus(u.id)} title="Hapus permanen">
                                                                <IconTrash size={15} />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                {/* Mobile cards */}
                                <div className="au-mobile-list">
                                    {currentUsers.map(u => (
                                        <UserMobileCard
                                            key={u.id} u={u} tab={activeTab}
                                            onApprove={() => approve(u.id, u.name)}
                                            onReject={() => reject(u.id, u.name)}
                                            onDelete={() => hapus(u.id)}
                                        />
                                    ))}
                                </div>
                            </>
                        )}
                    </div>

                </div>
            </div>
        </div>
    );
}