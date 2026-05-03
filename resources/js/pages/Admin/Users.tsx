import { useForm, router, Link } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import AdminSidebar from '@/components/AdminSidebar';
import {
    IconUsers, IconCheck, IconX, IconTrash,
    IconBell, IconArrowRight, IconStar,
} from '@tabler/icons-react';

// ─── TYPES ─────────────────────────────────────────────────
interface AuthUser { name: string; email: string; role: string; }
interface User {
    id: number; name: string; email: string;
    role: string; status: string; created_at: string;
}
interface Props {
    auth: { user: AuthUser };
    pending_users: User[];
    approved_users: User[];
    rejected_users: User[];
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

  .anim-top,.anim-left,.anim-right,.anim-bottom,.anim-pop { opacity: 0; }

  .au-glass {
    background: rgba(255,255,255,0.72);
    backdrop-filter: blur(20px) saturate(160%);
    -webkit-backdrop-filter: blur(20px) saturate(160%);
    border: 1.5px solid rgba(255,255,255,0.88);
    box-shadow: 0 6px 26px rgba(11,31,58,0.08), inset 0 1px 0 rgba(255,255,255,0.92);
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
  .au-badge {
    border-radius: 999px; padding: 3px 11px;
    font-size: 9.5px; font-weight: 700;
    font-family: 'Montserrat',sans-serif; letter-spacing: .1em;
  }
`;

// ─── Avatar ────────────────────────────────────────────────
const AVATAR_PALETTE = [
    ['#0EA5E9','#1565C0'], ['#6366F1','#4338CA'],
    ['#EC4899','#BE185D'], ['#10B981','#047857'], ['#F59E0B','#B45309'],
];
function Avatar({ name }: { name: string }) {
    const [c1, c2] = AVATAR_PALETTE[name.charCodeAt(0) % AVATAR_PALETTE.length];
    return (
        <div style={{ width: 36, height: 36, borderRadius: '50%', background: `linear-gradient(135deg,${c1},${c2})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 800, color: '#fff', flexShrink: 0, fontFamily: "'Montserrat',sans-serif", boxShadow: `0 4px 10px ${c1}44` }}>
            {name[0].toUpperCase()}
        </div>
    );
}

// ─── MAIN ──────────────────────────────────────────────────
export default function AdminUsers({ auth, pending_users, approved_users, rejected_users }: Props) {
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

    const tabs: { key: Tab; label: string; count: number; dot?: string }[] = [
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

            <div style={{
                marginLeft: sidebarWidth, flex: 1,
                background: 'linear-gradient(170deg,#A8D8FF 0%,#C4E5FF 16%,#DDF1FF 38%,#CBE8FF 62%,#B0D8FF 100%)',
                minHeight: '100vh', position: 'relative',
                transition: 'margin-left 0.3s cubic-bezier(0.4,0,0.2,1)',
            }}>
                {/* Orbs */}
                <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }}>
                    <div style={{ position: 'absolute', width: 500, height: 500, top: -150, right: -100, borderRadius: '50%', background: 'radial-gradient(circle,rgba(14,165,233,0.12) 0%,transparent 65%)', animation: 'orb-drift-u 22s ease-in-out infinite' }} />
                    <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(rgba(11,31,58,0.06) 1px,transparent 1px)', backgroundSize: '28px 28px' }} />
                </div>

                <div style={{ maxWidth: 1000, margin: '0 auto', padding: 'clamp(32px,4vw,48px) clamp(20px,4vw,40px)', position: 'relative', zIndex: 1 }}>

                   

                    {/* Header */}
                    <div className="anim-top delay-1" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                            <div className="anim-pop delay-1" style={{ width: 48, height: 48, borderRadius: 16, background: 'linear-gradient(135deg,#0EA5E9,#1565C0)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 24px rgba(14,165,233,0.35)', flexShrink: 0 }}>
                                <IconUsers size={22} color="#fff" />
                            </div>
                            <div>
                                <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.18em', textTransform: 'uppercase', color: '#0EA5E9', marginBottom: 4, fontFamily: "'Montserrat',sans-serif" }}>— MANAJEMEN —</p>
                                <h1 style={{ fontFamily: "'Montserrat',sans-serif", fontWeight: 900, fontSize: 'clamp(22px,3vw,32px)', color: '#08182E', lineHeight: 1.2 }}>
                                    Kelola <span style={{ color: '#0EA5E9' }}>User</span>
                                </h1>
                                <p style={{ fontSize: 13, color: '#1A3A5C', marginTop: 4 }}>Kelola pendaftaran dan akses peserta kompetisi</p>
                            </div>
                        </div>
                       
                    </div>

                    {/* Notif banner */}
                    {pending_users.length > 0 && (
                        <div className="anim-left delay-2" style={{ display: 'flex', alignItems: 'center', gap: 14, background: 'rgba(255,245,228,0.88)', border: '1.5px solid rgba(217,119,6,0.32)', borderRadius: 18, padding: '16px 22px', marginBottom: 28, backdropFilter: 'blur(14px)', boxShadow: '0 4px 18px rgba(217,119,6,0.1)' }}>
                            <span style={{ animation: 'blink-dot-u 2s ease-in-out infinite' }}>
                                <IconBell size={24} color="#D97706" />
                            </span>
                            <p style={{ fontFamily: "'Montserrat',sans-serif", fontWeight: 800, fontSize: 14, color: '#92400E' }}>
                                {pending_users.length} pendaftar baru menunggu persetujuanmu!
                            </p>
                            <span style={{ marginLeft: 'auto', background: 'rgba(217,119,6,0.18)', color: '#92400E', border: '1px solid rgba(217,119,6,0.32)', borderRadius: 999, padding: '3px 12px', fontSize: 10, fontWeight: 700, fontFamily: "'Montserrat',sans-serif", letterSpacing: '.1em' }}>
                                {pending_users.length} PENDING
                            </span>
                        </div>
                    )}

                    {/* Tab bar */}
                    <div className="anim-bottom delay-3" style={{ display: 'flex', gap: 4, background: 'rgba(10,60,130,0.72)', backdropFilter: 'blur(20px)', borderRadius: 16, padding: '6px', marginBottom: 20, border: '1px solid rgba(255,255,255,0.1)' }}>
                        {tabs.map(t => (
                            <button key={t.key} className={`au-tab-btn ${activeTab === t.key ? 'active' : ''}`} onClick={() => setActiveTab(t.key)}>
                                {t.dot && <span style={{ width: 6, height: 6, borderRadius: '50%', background: t.dot, display: 'inline-block', boxShadow: `0 0 6px ${t.dot}` }} />}
                                {t.label}
                                <span style={{ background: activeTab === t.key ? 'rgba(255,255,255,0.22)' : 'rgba(255,255,255,0.08)', borderRadius: 999, padding: '2px 8px', fontSize: 10, fontWeight: 900 }}>
                                    {t.count}
                                </span>
                            </button>
                        ))}
                    </div>

                    {/* Table */}
                    <div className="au-glass anim-bottom delay-4" style={{ borderRadius: 22, overflow: 'hidden' }}>
                        {currentUsers.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '64px 0', color: '#4A6A8A' }}>
                                <div style={{ marginBottom: 12 }}>
                                    {activeTab === 'pending'
                                        ? <IconBell size={42} color="rgba(245,158,11,0.4)" style={{ margin: '0 auto' }} />
                                        : activeTab === 'approved'
                                        ? <IconCheck size={42} color="rgba(5,150,105,0.4)" style={{ margin: '0 auto' }} />
                                        : <IconX size={42} color="rgba(239,68,68,0.4)" style={{ margin: '0 auto' }} />
                                    }
                                </div>
                                <p style={{ fontFamily: "'Montserrat',sans-serif", fontWeight: 700, fontSize: 14 }}>Tidak ada user di kategori ini</p>
                            </div>
                        ) : (
                            <div style={{ overflowX: 'auto' }}>
                                <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 560 }}>
                                    <thead>
                                        <tr style={{ borderBottom: '1.5px solid rgba(14,165,233,0.12)' }}>
                                            {['Peserta', 'Email', 'Terdaftar', 'Aksi'].map(h => (
                                                <th key={h} style={{ padding: '14px 18px', textAlign: 'left', fontSize: 10, fontWeight: 700, letterSpacing: '.14em', textTransform: 'uppercase', color: '#0B3A6A', fontFamily: "'Montserrat',sans-serif" }}>{h}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {currentUsers.map(u => (
                                            <tr key={u.id} className="au-row" style={{ borderBottom: '1px solid rgba(14,165,233,0.06)', transition: 'background .2s ease' }}>
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
                        )}
                    </div>

                </div>
            </div>
        </div>
    );
}