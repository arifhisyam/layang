import { useForm, router, Link } from '@inertiajs/react';
import { FormEvent, useEffect, useState } from 'react';
import AdminSidebar from '@/components/AdminSidebar';
import {
    IconUsers, IconPlus, IconX, IconTrash, IconCheck,
    IconMail, IconLock, IconUser, IconStar,
} from '@tabler/icons-react';

// ─── TYPES ─────────────────────────────────────────────────
interface AuthUser { name: string; email: string; role: string; }
interface Juri { id: number; name: string; email: string; created_at: string; }
interface Props {
    auth: { user: AuthUser };
    juri_users: Juri[];
    pending_count?: number;
}
interface JuriForm {
    name: string; email: string; password: string;
    [key: string]: string;
}

// ─── STYLES ────────────────────────────────────────────────
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700;800;900&family=Open+Sans:wght@300;400;600&display=swap');
  *, *::before, *::after { box-sizing: border-box; }
  ::-webkit-scrollbar { width: 5px; }
  ::-webkit-scrollbar-track { background: #C8E9FF; }
  ::-webkit-scrollbar-thumb { background: linear-gradient(#0EA5E9,#1565C0); border-radius: 3px; }

  @keyframes orb-drift-j  { 0%,100%{transform:translate(0,0)} 33%{transform:translate(18px,-12px)} 66%{transform:translate(-14px,16px)} }
  @keyframes slide-down-j { from{opacity:0;transform:translateY(-10px) scaleY(0.96)} to{opacity:1;transform:translateY(0) scaleY(1)} }

  @keyframes slideFromTop    { from{opacity:0;transform:translateY(-36px)} to{opacity:1;transform:translateY(0)} }
  @keyframes slideFromLeft   { from{opacity:0;transform:translateX(-56px)} to{opacity:1;transform:translateX(0)} }
  @keyframes slideFromRight  { from{opacity:0;transform:translateX(56px)}  to{opacity:1;transform:translateX(0)} }
  @keyframes slideFromBottom { from{opacity:0;transform:translateY(36px)}  to{opacity:1;transform:translateY(0)} }
  @keyframes popIn           { from{opacity:0;transform:scale(0.7) rotate(-15deg)} to{opacity:1;transform:scale(1) rotate(0deg)} }

  .aj-ready .anim-top    { animation: slideFromTop    0.55s cubic-bezier(0.22,1,0.36,1) both; }
  .aj-ready .anim-left   { animation: slideFromLeft   0.55s cubic-bezier(0.22,1,0.36,1) both; }
  .aj-ready .anim-right  { animation: slideFromRight  0.55s cubic-bezier(0.22,1,0.36,1) both; }
  .aj-ready .anim-bottom { animation: slideFromBottom 0.55s cubic-bezier(0.22,1,0.36,1) both; }
  .aj-ready .anim-pop    { animation: popIn           0.45s cubic-bezier(0.34,1.56,0.64,1) both; }

  .aj-ready .delay-1 { animation-delay: 0.08s; }
  .aj-ready .delay-2 { animation-delay: 0.18s; }
  .aj-ready .delay-3 { animation-delay: 0.28s; }
  .aj-ready .delay-4 { animation-delay: 0.38s; }

  .anim-top,.anim-left,.anim-right,.anim-bottom,.anim-pop { opacity: 0; }

  .aj-glass {
    background: rgba(255,255,255,0.72);
    backdrop-filter: blur(20px) saturate(160%);
    -webkit-backdrop-filter: blur(20px) saturate(160%);
    border: 1.5px solid rgba(255,255,255,0.88);
    box-shadow: 0 6px 26px rgba(11,31,58,0.08), inset 0 1px 0 rgba(255,255,255,0.92);
  }
  .aj-glass-form {
    background: rgba(255,255,255,0.85);
    backdrop-filter: blur(24px) saturate(160%);
    -webkit-backdrop-filter: blur(24px) saturate(160%);
    border: 1.5px solid rgba(99,102,241,0.2);
    box-shadow: 0 8px 32px rgba(99,102,241,0.1), inset 0 1px 0 rgba(255,255,255,0.95);
    animation: slide-down-j .3s cubic-bezier(.34,1.4,.64,1) both;
  }
  .aj-row:hover { background: rgba(99,102,241,0.04) !important; }
  .aj-input {
    width: 100%; border: 1.5px solid rgba(14,165,233,0.22); border-radius: 12px;
    padding: 11px 16px 11px 40px; font-family: 'Open Sans',sans-serif; font-size: 13px;
    color: #0B1F3A; background: rgba(255,255,255,0.8);
    outline: none; transition: border-color .2s ease, box-shadow .2s ease;
  }
  .aj-input:focus { border-color: rgba(99,102,241,0.55); box-shadow: 0 0 0 3px rgba(99,102,241,0.1); }
  .aj-input::placeholder { color: #A0B8D0; }
  .aj-btn-primary {
    display: inline-flex; align-items: center; gap: 7px;
    padding: 12px 24px; border-radius: 999px; border: none; cursor: pointer;
    font-family: 'Montserrat',sans-serif; font-size: 13px; font-weight: 700;
    background: linear-gradient(135deg,#6366F1,#4338CA); color: #fff;
    box-shadow: 0 6px 20px rgba(99,102,241,0.4);
    transition: all .26s cubic-bezier(.34,1.4,.64,1);
  }
  .aj-btn-primary:hover:not(:disabled) { transform: translateY(-2px) scale(1.03); box-shadow: 0 10px 28px rgba(99,102,241,0.52); }
  .aj-btn-primary:disabled { opacity: 0.55; cursor: not-allowed; }
  .aj-btn-ghost {
    display: inline-flex; align-items: center; gap: 7px;
    padding: 12px 22px; border-radius: 999px; cursor: pointer;
    font-family: 'Montserrat',sans-serif; font-size: 13px; font-weight: 700;
    background: transparent; color: #4A6A8A;
    border: 1.5px solid rgba(14,165,233,0.22);
    transition: all .22s ease;
  }
  .aj-btn-ghost:hover { background: rgba(14,165,233,0.06); color: #0B1F3A; }
  .aj-btn-add {
    display: inline-flex; align-items: center; gap: 8px;
    padding: 11px 22px; border-radius: 999px; border: none; cursor: pointer;
    font-family: 'Montserrat',sans-serif; font-size: 12px; font-weight: 700;
    background: linear-gradient(135deg,#6366F1,#4338CA); color: #fff;
    box-shadow: 0 6px 18px rgba(99,102,241,0.38);
    transition: all .26s cubic-bezier(.34,1.4,.64,1); letter-spacing: .04em;
  }
  .aj-btn-add:hover { transform: translateY(-2px) scale(1.04); box-shadow: 0 10px 26px rgba(99,102,241,0.5); }
  .aj-delete-btn {
    width: 32px; height: 32px; border-radius: 9px; border: none; cursor: pointer;
    background: transparent; color: #CBD5E1;
    transition: all .2s ease; display: flex; align-items: center; justify-content: center;
  }
  .aj-delete-btn:hover { background: rgba(239,68,68,0.08); color: #EF4444; }
  .aj-label { font-family: 'Montserrat',sans-serif; font-size: 11px; font-weight: 700; color: #1A3A5C; letter-spacing: .06em; margin-bottom: 7px; display: block; }
  .aj-error { font-size: 11px; color: #DC2626; margin-top: 5px; font-family: 'Montserrat',sans-serif; }
  .aj-input-wrap { position: relative; }
  .aj-input-icon { position: absolute; left: 13px; top: 50%; transform: translateY(-50%); color: #A0B8D0; pointer-events: none; }
`;

// ─── Avatar ────────────────────────────────────────────────
const JURI_PALETTE = [
    ['#6366F1','#4338CA'], ['#0EA5E9','#1565C0'],
    ['#EC4899','#BE185D'], ['#10B981','#047857'], ['#F59E0B','#B45309'],
];
function JuriAvatar({ name }: { name: string }) {
    const [c1, c2] = JURI_PALETTE[name.charCodeAt(0) % JURI_PALETTE.length];
    return (
        <div style={{ width: 40, height: 40, borderRadius: '50%', background: `linear-gradient(135deg,${c1},${c2})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 800, color: '#fff', flexShrink: 0, fontFamily: "'Montserrat',sans-serif", boxShadow: `0 4px 12px ${c1}55` }}>
            {name[0].toUpperCase()}
        </div>
    );
}

// ─── MAIN ──────────────────────────────────────────────────
export default function AdminJuri({ auth, juri_users, pending_count = 0 }: Props) {
    const [ready, setReady] = useState(false);
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [showForm, setShowForm] = useState(false);

    useEffect(() => {
        const t = requestAnimationFrame(() => requestAnimationFrame(() => setReady(true)));
        return () => cancelAnimationFrame(t);
    }, []);

    const { data, setData, post, processing, errors, reset } = useForm<JuriForm>({
        name: '', email: '', password: '',
    });

    const submitJuri = (e: FormEvent) => {
        e.preventDefault();
        post('/admin/users/juri', { onSuccess: () => { reset(); setShowForm(false); } });
    };

    const hapusJuri = (id: number, name: string) => {
        if (confirm(`Hapus akun juri "${name}" secara permanen?`)) router.delete(`/admin/users/${id}`);
    };

    const sidebarWidth = sidebarCollapsed ? 64 : 240;

    return (
        <div className={ready ? 'aj-ready' : ''} style={{ display: 'flex', minHeight: '100vh', fontFamily: "'Open Sans',sans-serif" }}>
            <style>{STYLES}</style>

            <AdminSidebar user={auth.user} activePage="juri" pendingUsers={pending_count} onCollapse={setSidebarCollapsed} />

            <div style={{
                marginLeft: sidebarWidth, flex: 1,
                background: 'linear-gradient(170deg,#A8D8FF 0%,#C4E5FF 16%,#DDF1FF 38%,#CBE8FF 62%,#B0D8FF 100%)',
                minHeight: '100vh', position: 'relative',
                transition: 'margin-left 0.3s cubic-bezier(0.4,0,0.2,1)',
            }}>
                {/* Orbs */}
                <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }}>
                    <div style={{ position: 'absolute', width: 520, height: 520, top: -160, right: -100, borderRadius: '50%', background: 'radial-gradient(circle,rgba(99,102,241,0.12) 0%,transparent 65%)', animation: 'orb-drift-j 24s ease-in-out infinite' }} />
                    <div style={{ position: 'absolute', width: 380, height: 380, bottom: -80, left: '20%', borderRadius: '50%', background: 'radial-gradient(circle,rgba(14,165,233,0.09) 0%,transparent 65%)', animation: 'orb-drift-j 30s ease-in-out infinite', animationDelay: '-10s' }} />
                    <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(rgba(11,31,58,0.06) 1px,transparent 1px)', backgroundSize: '28px 28px' }} />
                </div>

                <div style={{ maxWidth: 1000, margin: '0 auto', padding: 'clamp(32px,4vw,48px) clamp(20px,4vw,40px)', position: 'relative', zIndex: 1 }}>

                  

                    {/* Header */}
                    <div className="anim-top delay-1" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 32 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                            <div className="anim-pop delay-1" style={{ width: 48, height: 48, borderRadius: 16, background: 'linear-gradient(135deg,#6366F1,#4338CA)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 24px rgba(99,102,241,0.35)', flexShrink: 0 }}>
                                <IconStar size={22} color="#fff" />
                            </div>
                            <div>
                                <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.18em', textTransform: 'uppercase', color: '#6366F1', marginBottom: 4, fontFamily: "'Montserrat',sans-serif" }}>— MANAJEMEN —</p>
                                <h1 style={{ fontFamily: "'Montserrat',sans-serif", fontWeight: 900, fontSize: 'clamp(22px,3vw,32px)', color: '#08182E', lineHeight: 1.2 }}>
                                    Kelola <span style={{ background: 'linear-gradient(135deg,#6366F1,#4338CA)', backgroundClip: 'text', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Juri</span>
                                </h1>
                                <p style={{ fontSize: 13, color: '#1A3A5C', marginTop: 4 }}>{juri_users.length} juri aktif terdaftar dalam sistem</p>
                            </div>
                        </div>
                        <button className="aj-btn-add anim-right delay-2" onClick={() => setShowForm(o => !o)}>
                            {showForm ? <><IconX size={14} /> Batal</> : <><IconPlus size={14} /> Tambah Juri</>}
                        </button>
                    </div>

                    {/* Form tambah juri */}
                    {showForm && (
                        <div className="aj-glass-form" style={{ borderRadius: 22, padding: 'clamp(22px,3vw,32px)', marginBottom: 28 }}>
                            <div style={{ marginBottom: 22 }}>
                                <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.16em', textTransform: 'uppercase', color: '#6366F1', marginBottom: 4, fontFamily: "'Montserrat',sans-serif" }}>— FORM —</p>
                                <h2 style={{ fontFamily: "'Montserrat',sans-serif", fontWeight: 800, fontSize: 18, color: '#08182E' }}>Buat Akun Juri Baru</h2>
                            </div>
                            <form onSubmit={submitJuri}>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: 18, marginBottom: 24 }}>
                                    <div>
                                        <label className="aj-label">Nama Lengkap</label>
                                        <div className="aj-input-wrap">
                                            <span className="aj-input-icon"><IconUser size={15} /></span>
                                            <input className="aj-input" value={data.name} onChange={e => setData('name', e.target.value)} placeholder="Nama lengkap juri..." />
                                        </div>
                                        {errors.name && <p className="aj-error">{errors.name}</p>}
                                    </div>
                                    <div>
                                        <label className="aj-label">Alamat Email</label>
                                        <div className="aj-input-wrap">
                                            <span className="aj-input-icon"><IconMail size={15} /></span>
                                            <input className="aj-input" type="email" value={data.email} onChange={e => setData('email', e.target.value)} placeholder="email@domain.com" />
                                        </div>
                                        {errors.email && <p className="aj-error">{errors.email}</p>}
                                    </div>
                                    <div>
                                        <label className="aj-label">Password</label>
                                        <div className="aj-input-wrap">
                                            <span className="aj-input-icon"><IconLock size={15} /></span>
                                            <input className="aj-input" type="password" value={data.password} onChange={e => setData('password', e.target.value)} placeholder="Minimal 8 karakter" />
                                        </div>
                                        {errors.password && <p className="aj-error">{errors.password}</p>}
                                    </div>
                                </div>
                                <div style={{ display: 'flex', gap: 12 }}>
                                    <button type="submit" className="aj-btn-primary" disabled={processing}>
                                        <IconCheck size={15} /> {processing ? 'Menyimpan...' : 'Buat Akun Juri'}
                                    </button>
                                    <button type="button" className="aj-btn-ghost" onClick={() => { reset(); setShowForm(false); }}>
                                        <IconX size={14} /> Batal
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    {/* Daftar juri */}
                    <div className="aj-glass anim-bottom delay-3" style={{ borderRadius: 22, overflow: 'hidden' }}>
                        <div style={{ padding: '20px 24px 16px', borderBottom: '1.5px solid rgba(99,102,241,0.1)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                    <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#6366F1', boxShadow: '0 0 8px rgba(99,102,241,0.6)' }} />
                                    <span style={{ fontFamily: "'Montserrat',sans-serif", fontWeight: 800, fontSize: 15, color: '#08182E' }}>Daftar Juri Aktif</span>
                                </div>
                                <span style={{ background: 'rgba(99,102,241,0.1)', color: '#4338CA', border: '1px solid rgba(99,102,241,0.2)', borderRadius: 999, padding: '4px 14px', fontSize: 11, fontWeight: 700, fontFamily: "'Montserrat',sans-serif" }}>
                                    {juri_users.length} Juri
                                </span>
                            </div>
                        </div>

                        {juri_users.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '72px 0', color: '#4A6A8A' }}>
                                <IconUsers size={48} color="rgba(99,102,241,0.3)" style={{ margin: '0 auto 16px' }} />
                                <p style={{ fontFamily: "'Montserrat',sans-serif", fontWeight: 700, fontSize: 15, marginBottom: 6 }}>Belum ada juri</p>
                                <p style={{ fontSize: 13 }}>Klik "+ Tambah Juri" untuk membuat akun juri pertama</p>
                            </div>
                        ) : (
                            <div style={{ overflowX: 'auto' }}>
                                <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 540 }}>
                                    <thead>
                                        <tr style={{ borderBottom: '1.5px solid rgba(99,102,241,0.1)', background: 'rgba(99,102,241,0.03)' }}>
                                            {['Juri', 'Email', 'Bergabung', 'Aksi'].map(h => (
                                                <th key={h} style={{ padding: '13px 20px', textAlign: 'left', fontSize: 10, fontWeight: 700, letterSpacing: '.14em', textTransform: 'uppercase', color: '#0B3A6A', fontFamily: "'Montserrat',sans-serif" }}>{h}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {juri_users.map((j, idx) => (
                                            <tr key={j.id} className="aj-row" style={{ borderBottom: idx < juri_users.length - 1 ? '1px solid rgba(99,102,241,0.07)' : 'none', transition: 'background .2s ease' }}>
                                                <td style={{ padding: '14px 20px' }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                                        <JuriAvatar name={j.name} />
                                                        <div>
                                                            <p style={{ fontWeight: 700, color: '#0B1F3A', fontFamily: "'Montserrat',sans-serif", fontSize: 13 }}>{j.name}</p>
                                                            <p style={{ fontSize: 10, color: '#6366F1', fontWeight: 600, fontFamily: "'Montserrat',sans-serif", letterSpacing: '.08em' }}>JURI</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td style={{ padding: '14px 20px', color: '#4A6A8A', fontSize: 13 }}>{j.email}</td>
                                                <td style={{ padding: '14px 20px', color: '#7A9AB8', fontSize: 12, fontFamily: "'Montserrat',sans-serif" }}>
                                                    {new Date(j.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                                                </td>
                                                <td style={{ padding: '14px 20px' }}>
                                                    <button className="aj-delete-btn" onClick={() => hapusJuri(j.id, j.name)} title="Hapus juri">
                                                        <IconTrash size={16} />
                                                    </button>
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