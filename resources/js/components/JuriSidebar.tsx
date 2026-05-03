import { useState, useEffect, useRef } from 'react';
import { Link, router } from '@inertiajs/react';
import {
    IconLayoutDashboard,
    IconStar,
    IconTrophy,
    IconUserEdit,
    IconLogout,
    IconChevronUp,
    IconChevronLeft,
    IconChevronRight,
} from '@tabler/icons-react';

interface AuthUser {
    name: string;
    email: string;
    role: string;
}

interface Props {
    user: AuthUser;
    activePage?: 'overview' | 'penilaian' | 'leaderboard' | 'designs';
    belumDinilai?: number;
}

const SIDEBAR_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700;800;900&family=Open+Sans:wght@300;400;600&display=swap');

  @keyframes float-slow { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
  @keyframes blink-dot  { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.4;transform:scale(0.7)} }
  @keyframes avatar-pop { 0%{transform:scale(0.7) translateY(6px);opacity:0} 60%{transform:scale(1.08);opacity:1} 100%{transform:scale(1);opacity:1} }

  /* ── Dropdown ── */
  .js-dropdown-panel {
    position: absolute; bottom: calc(100% + 10px); left: 0; right: 0;
    background: rgba(255,255,255,0.97);
    backdrop-filter: blur(24px); -webkit-backdrop-filter: blur(24px);
    border: 1.5px solid rgba(14,165,233,0.18); border-radius: 18px; padding: 8px;
    box-shadow: 0 -12px 40px rgba(11,31,58,0.20);
    z-index: 200;
    transform-origin: bottom center;
    transition: opacity .25s cubic-bezier(.4,0,.2,1), transform .25s cubic-bezier(.34,1.4,.64,1);
    pointer-events: none;
  }
  .js-dropdown-panel.open { pointer-events: auto; }
  .js-dropdown-panel:not(.open) { opacity: 0 !important; transform: scaleY(0.88) translateY(6px) !important; }
  .js-dropdown-avatar { animation: avatar-pop .35s cubic-bezier(.34,1.4,.64,1) both; }

  /* ── Sidebar shell ── */
  .js-sidebar {
    position: fixed; left: 0; top: 0; bottom: 0;
    background: rgba(14,100,180,0.82);
    backdrop-filter: blur(32px) saturate(180%);
    -webkit-backdrop-filter: blur(32px) saturate(180%);
    border-right: 1px solid rgba(255,255,255,0.1);
    z-index: 100; display: flex; flex-direction: column;
    overflow: visible;
    transition: width 0.28s cubic-bezier(0.4,0,0.2,1);
  }

  /* ── Nav scroll ── */
  .js-nav {
    flex: 1; padding: 16px 12px; overflow-y: auto; overflow-x: hidden;
  }
  .js-nav::-webkit-scrollbar { width: 3px; }
  .js-nav::-webkit-scrollbar-track { background: transparent; }
  .js-nav::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.15); border-radius: 10px; }

  /* ── Nav items ── */
  .js-nav-item {
    display: flex; align-items: center; gap: 12px;
    padding: 12px 16px; border-radius: 12px; margin-bottom: 4px;
    cursor: pointer; transition: all .24s ease;
    border: 1px solid transparent; text-decoration: none;
    white-space: nowrap; overflow: hidden;
    position: relative;
  }
  .js-nav-item:hover { background: rgba(255,255,255,0.14); transform: translateX(4px); }
  .js-nav-item.active { background: rgba(255,255,255,0.22); border-color: rgba(14,165,233,0.4); }

  /* Collapsed: center icons */
  .js-sidebar.collapsed .js-nav-item {
    padding: 11px; justify-content: center; gap: 0;
    transform: none !important;
  }

  /* ── Tooltip (collapsed mode only) ── */
  .js-tooltip {
    position: absolute; left: calc(100% + 12px); top: 50%; transform: translateY(-50%);
    background: rgba(11,31,58,0.92); color: #fff;
    font-family: 'Montserrat', sans-serif; font-weight: 700; font-size: 11px;
    padding: 5px 12px; border-radius: 8px; white-space: nowrap;
    pointer-events: none; opacity: 0;
    transition: opacity .18s ease;
    box-shadow: 0 4px 16px rgba(0,0,0,0.25);
    z-index: 300;
  }
  .js-sidebar.collapsed .js-nav-item:hover .js-tooltip { opacity: 1; }

  /* ── Label fade ── */
  .js-text-label {
    transition: opacity .2s ease, max-width .28s cubic-bezier(0.4,0,0.2,1);
    overflow: hidden; white-space: nowrap;
  }
  .js-sidebar.collapsed .js-text-label {
    opacity: 0; max-width: 0 !important; pointer-events: none;
  }

  /* ── Live bar ── */
  .js-live-bar {
    display: flex; align-items: center; gap: 8px;
    padding: 0 24px; height: 40px;
    border-bottom: 1px solid rgba(255,255,255,0.06);
    overflow: hidden; flex-shrink: 0;
  }
  .js-sidebar.collapsed .js-live-bar {
    justify-content: center; padding: 0;
  }

  /* ── Live label fade ── */
  .js-live-label {
    font-size: 11px; color: rgba(186,230,253,0.7);
    font-weight: 600; letter-spacing: .1em; white-space: nowrap;
    transition: opacity .2s ease, max-width .28s cubic-bezier(0.4,0,0.2,1);
    overflow: hidden; max-width: 200px;
  }
  .js-sidebar.collapsed .js-live-label {
    opacity: 0; max-width: 0; pointer-events: none;
  }

  /* ── Toggle button ── */
  .js-toggle-btn {
    position: absolute;
    top: 110px;
    right: -14px;
    transform: translateY(-50%);
    width: 28px; height: 28px; border-radius: 50%;
    background: linear-gradient(135deg, #0EA5E9, #1565C0);
    border: 2px solid rgba(255,255,255,0.25);
    box-shadow: 0 4px 14px rgba(14,165,233,0.45);
    display: flex; align-items: center; justify-content: center;
    cursor: pointer; z-index: 110;
    transition: box-shadow .2s, transform .2s;
    padding: 0; outline: none;
  }
  .js-toggle-btn:hover {
    box-shadow: 0 6px 20px rgba(14,165,233,0.65);
    transform: translateY(-50%) scale(1.12);
  }

  /* ── Profile button ── */
  .js-profile-btn {
    display: flex; align-items: center; gap: 10px;
    padding: 10px 12px; border-radius: 12px; cursor: pointer;
    transition: all .22s ease; border: 1px solid rgba(255,255,255,0.14);
    overflow: hidden;
  }
  .js-profile-btn:hover { background: rgba(255,255,255,0.18); }
  .js-sidebar.collapsed .js-profile-btn { justify-content: center; padding: 10px; }

  /* ── Dropdown items ── */
  .js-dd-item {
    display: flex; align-items: center; gap: 10px;
    padding: 10px 14px; border-radius: 10px; cursor: pointer;
    transition: background .18s ease; text-decoration: none;
    color: #1A3A5C; font-size: 13px;
    font-family: 'Montserrat', sans-serif; font-weight: 600;
  }
  .js-dd-item:hover { background: rgba(14,165,233,0.08); }
  .js-dd-item.danger:hover { background: rgba(239,68,68,0.08); color: #DC2626; }

  /* ── Logout icon (collapsed) ── */
  .js-logout-icon {
    display: flex; justify-content: center; align-items: center;
    margin-top: 6px; padding: 9px; border-radius: 10px; cursor: pointer;
    color: rgba(254,202,202,0.7); transition: background .2s, color .2s;
  }
  .js-logout-icon:hover { background: rgba(239,68,68,0.18); color: #FCA5A5; }

  @media (max-width: 768px) { .js-sidebar { display: none !important; } }
`;

// ── Avatar colors ─────────────────────────────────────────────────────────────

const AVATAR_COLORS: [string, string][] = [
    ['#0EA5E9', '#1565C0'],
    ['#6366F1', '#4338CA'],
    ['#EC4899', '#BE185D'],
    ['#10B981', '#047857'],
    ['#F59E0B', '#B45309'],
];

function getAvatarColor(name: string): [string, string] {
    return AVATAR_COLORS[name.charCodeAt(0) % AVATAR_COLORS.length];
}

// ── ProfileDropdown ───────────────────────────────────────────────────────────

function ProfileDropdown({ user, collapsed }: { user: AuthUser; collapsed: boolean }) {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);
    const [color1, color2] = getAvatarColor(user.name);

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const avatarLarge: React.CSSProperties = {
        width: 62, height: 62, borderRadius: '50%',
        background: `linear-gradient(135deg, ${color1}, ${color2})`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 26, fontWeight: 900, color: '#fff',
        fontFamily: "'Montserrat', sans-serif",
        boxShadow: `0 6px 20px ${color1}55`,
        border: '3px solid rgba(255,255,255,0.9)',
    };

    const avatarSmall: React.CSSProperties = {
        width: 36, height: 36, borderRadius: '50%',
        background: `linear-gradient(135deg, ${color1}, ${color2})`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 14, fontWeight: 800, color: '#fff', flexShrink: 0,
        fontFamily: "'Montserrat',sans-serif",
        boxShadow: open ? `0 0 12px ${color1}88` : 'none',
        transition: 'box-shadow .25s ease',
    };

    return (
        <div ref={ref} style={{ position: 'relative' }}>
            {!collapsed && (
                <div
                    className={`js-dropdown-panel ${open ? 'open' : ''}`}
                    style={{
                        opacity: open ? 1 : 0,
                        transform: open ? 'scaleY(1) translateY(0)' : 'scaleY(0.88) translateY(6px)',
                    }}
                >
                    <div style={{
                        padding: '16px 14px 14px', marginBottom: 6,
                        borderBottom: '1px solid rgba(14,165,233,0.1)',
                        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10,
                    }}>
                        <div className={open ? 'js-dropdown-avatar' : ''} style={avatarLarge}>
                            {user.name[0].toUpperCase()}
                        </div>
                        <div style={{ textAlign: 'center' }}>
                            <p style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 800, fontSize: 14, color: '#0B1F3A', lineHeight: 1.3 }}>
                                {user.name}
                            </p>
                            <p style={{ fontSize: 11, color: '#4A6A8A', marginTop: 3 }}>{user.email}</p>
                        </div>
                        <span style={{
                            display: 'inline-block',
                            background: `${color1}18`, color: color2,
                            border: `1px solid ${color1}35`, borderRadius: 999,
                            padding: '3px 12px', fontSize: 9, fontWeight: 700,
                            fontFamily: "'Montserrat',sans-serif",
                            letterSpacing: '.12em', textTransform: 'uppercase',
                        }}>
                            {user.role}
                        </span>
                    </div>

                    <Link href="/settings/profile" className="js-dd-item">
                        <IconUserEdit size={17} /> Edit Profil
                    </Link>
                    <div className="js-dd-item danger" onClick={() => router.post('/logout')}>
                        <IconLogout size={17} /> Keluar / Logout
                    </div>
                </div>
            )}

            <div
                className="js-profile-btn"
                onClick={() => !collapsed && setOpen(o => !o)}
                style={{ background: open ? 'rgba(255,255,255,0.18)' : 'rgba(255,255,255,0.08)', cursor: collapsed ? 'default' : 'pointer' }}
            >
                <div style={avatarSmall}>
                    {user.name[0].toUpperCase()}
                </div>

                {!collapsed && (
                    <>
                        <div style={{ flex: 1, minWidth: 0 }}>
                            <p style={{ fontSize: 12, fontWeight: 700, color: '#fff', fontFamily: "'Montserrat',sans-serif", overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                {user.name}
                            </p>
                            <p style={{ fontSize: 10, color: 'rgba(186,230,253,0.6)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                {user.email}
                            </p>
                        </div>
                        <IconChevronUp
                            size={13}
                            style={{
                                color: 'rgba(255,255,255,0.5)', flexShrink: 0,
                                transition: 'transform .28s cubic-bezier(.34,1.4,.64,1)',
                                transform: open ? 'rotate(0deg)' : 'rotate(180deg)',
                            }}
                        />
                    </>
                )}
            </div>

            {collapsed && (
                <div
                    className="js-logout-icon"
                    onClick={() => router.post('/logout')}
                    title="Keluar / Logout"
                >
                    <IconLogout size={18} />
                </div>
            )}
        </div>
    );
}

// ── Main Export ───────────────────────────────────────────────────────────────

export default function JuriSidebar({ user, activePage = 'overview', belumDinilai = 0 }: Props) {
    const [collapsed, setCollapsed] = useState(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('juri-sidebar-collapsed') === 'true';
        }
        return false;
    });

    const W_EXP = 240;
    const W_COL = 70;

    // Emit state awal ke halaman saat mount (untuk sync marginLeft)
    useEffect(() => {
        const event = new CustomEvent('sidebarToggle', {
            detail: { collapsed, storageKey: 'juri-sidebar-collapsed' }
        });
        window.dispatchEvent(event);
    }, []);

    const handleToggle = () => {
        const newCollapsed = !collapsed;
        setCollapsed(newCollapsed);
        localStorage.setItem('juri-sidebar-collapsed', String(newCollapsed));
        const event = new CustomEvent('sidebarToggle', {
            detail: { collapsed: newCollapsed, storageKey: 'juri-sidebar-collapsed' }
        });
        window.dispatchEvent(event);
    };

    const effectivePage = activePage === 'designs' ? 'penilaian' : activePage;

    const navItems = [
        { key: 'overview',    href: '/juri/dashboard',   icon: <IconLayoutDashboard size={19} />, label: 'Dashboard' },
        { key: 'penilaian',   href: '/juri/designs',     icon: <IconStar size={19} />,            label: 'Penilaian', badge: belumDinilai > 0 ? belumDinilai : undefined },
        { key: 'leaderboard', href: '/juri/leaderboard', icon: <IconTrophy size={19} />,          label: 'Leaderboard' },
    ];

    return (
        <>
            <style>{SIDEBAR_STYLES}</style>

            <div
                className={`js-sidebar${collapsed ? ' collapsed' : ''}`}
                style={{ width: collapsed ? W_COL : W_EXP }}
            >
                <button
                    className="js-toggle-btn"
                    onClick={handleToggle}
                    aria-label={collapsed ? 'Perluas sidebar' : 'Ciutkan sidebar'}
                    title={collapsed ? 'Perluas sidebar' : 'Ciutkan sidebar'}
                >
                    {collapsed
                        ? <IconChevronRight size={13} color="#fff" />
                        : <IconChevronLeft  size={13} color="#fff" />
                    }
                </button>

                {/* ── Logo ── */}
                <div style={{
                    padding: collapsed ? '28px 15px 22px' : '28px 24px 22px',
                    borderBottom: '1px solid rgba(255,255,255,0.08)',
                    display: 'flex', alignItems: 'center',
                    justifyContent: collapsed ? 'center' : 'flex-start',
                    gap: 12, overflow: 'hidden',
                    transition: 'padding 0.28s cubic-bezier(0.4,0,0.2,1)',
                }}>
                    <div style={{
                        width: 40, height: 40, borderRadius: '50%',
                        background: 'linear-gradient(135deg, #0EA5E9, #1565C0)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        boxShadow: '0 0 20px rgba(14,165,233,0.6)',
                        animation: 'float-slow 4s ease-in-out infinite', flexShrink: 0,
                        overflow: 'hidden', padding: 6,
                    }}>
                        <img src="/images/logo.png" alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                    </div>
                    {!collapsed && (
                        <div>
                            <p style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 800, fontSize: 13, color: '#fff', lineHeight: 1.2 }}>
                                Layang-Layang
                            </p>
                            <p style={{ fontSize: 9, color: '#BAE6FD', fontWeight: 600, letterSpacing: '.14em', textTransform: 'uppercase' }}>
                                PANEL JURI
                            </p>
                        </div>
                    )}
                </div>

                {/* ── Live status bar ── */}
                <div className="js-live-bar">
                    <span style={{
                        width: 7, height: 7, borderRadius: '50%', background: '#34D399',
                        display: 'inline-block', boxShadow: '0 0 8px rgba(52,211,153,0.8)',
                        animation: 'blink-dot 2s ease-in-out infinite', flexShrink: 0,
                    }} />
                    <span className="js-live-label">LIVE · Kompetisi 2026</span>
                </div>

                {/* ── Nav ── */}
                <nav className="js-nav">
                    {navItems.map(item => {
                        const isActive = effectivePage === item.key;
                        const hasBadge = !isActive && item.badge !== undefined && item.badge > 0;

                        return (
                            <Link
                                key={item.key}
                                href={item.href}
                                className={`js-nav-item${isActive ? ' active' : ''}`}
                            >
                                <span style={{
                                    flexShrink: 0, display: 'flex', alignItems: 'center',
                                    color: isActive ? '#fff' : 'rgba(186,230,253,0.72)',
                                    transition: 'color .2s', position: 'relative',
                                }}>
                                    {item.icon}
                                    {hasBadge && collapsed && (
                                        <span style={{
                                            position: 'absolute', top: -4, right: -5,
                                            width: 8, height: 8, borderRadius: '50%',
                                            background: '#EF4444',
                                            boxShadow: '0 0 6px rgba(239,68,68,0.8)',
                                            animation: 'blink-dot 2s ease-in-out infinite',
                                        }} />
                                    )}
                                </span>

                                <span
                                    className="js-text-label"
                                    style={{
                                        fontFamily: "'Montserrat', sans-serif",
                                        fontWeight: 700, fontSize: 13,
                                        color: isActive ? '#fff' : 'rgba(186,230,253,0.72)',
                                        letterSpacing: '.03em',
                                        maxWidth: collapsed ? 0 : 160,
                                        transition: 'color .2s', flex: 1,
                                    }}
                                >
                                    {item.label}
                                </span>

                                {isActive && !collapsed && (
                                    <div style={{
                                        marginLeft: 'auto', width: 6, height: 6, borderRadius: '50%',
                                        background: '#0EA5E9', boxShadow: '0 0 8px rgba(14,165,233,0.8)',
                                        flexShrink: 0,
                                    }} />
                                )}

                                {hasBadge && !collapsed && (
                                    <span style={{
                                        marginLeft: 'auto', background: '#EF4444', color: '#fff',
                                        borderRadius: '50%', width: 18, height: 18,
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        fontSize: 9, fontWeight: 900,
                                        boxShadow: '0 0 10px rgba(239,68,68,0.6)',
                                        animation: 'blink-dot 2s ease-in-out infinite',
                                        flexShrink: 0,
                                    }}>
                                        {item.badge! > 9 ? '9+' : item.badge}
                                    </span>
                                )}

                                {collapsed && <span className="js-tooltip">{item.label}</span>}
                            </Link>
                        );
                    })}
                </nav>

                {/* ── Profile ── */}
                <div style={{ padding: '10px 12px 14px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                    <ProfileDropdown user={user} collapsed={collapsed} />
                </div>
            </div>
        </>
    );
}