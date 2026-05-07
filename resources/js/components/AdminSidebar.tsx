import { useState, useEffect, useRef } from 'react';
import { Link, router } from '@inertiajs/react';
import {
    IconLayoutDashboard,
    IconUsers,
    IconUserStar,
    IconPalette,
    IconTrophy,
    IconUserEdit,
    IconLogout,
    IconChevronUp,
    IconChevronLeft,
    IconChevronRight,
    IconMenu2,
    IconX,
} from '@tabler/icons-react';

// ── Types ────────────────────────────────────────────────────────────────────

interface AuthUser {
    name: string;
    email: string;
    role: string;
}

interface Props {
    user: AuthUser;
    activePage?: 'dashboard' | 'users' | 'juri' | 'designs' | 'leaderboard' | 'settings';
    pendingUsers?: number;
    onCollapse?: (collapsed: boolean) => void;
}

// ── Styles ───────────────────────────────────────────────────────────────────

const SIDEBAR_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700;800;900&family=Open+Sans:wght@300;400;600&display=swap');

  @keyframes float-slow { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
  @keyframes blink-dot  { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.4;transform:scale(0.7)} }
  @keyframes avatar-pop { 0%{transform:scale(0.7) translateY(6px);opacity:0} 60%{transform:scale(1.08);opacity:1} 100%{transform:scale(1);opacity:1} }
  @keyframes slide-in-left { 0%{transform:translateX(-100%)} 100%{transform:translateX(0)} }

  /* ── Dropdown ── */
  .as-dropdown-panel {
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
  .as-dropdown-panel.open { pointer-events: auto; }
  .as-dropdown-panel:not(.open) { opacity: 0 !important; transform: scaleY(0.88) translateY(6px) !important; }
  .as-dropdown-avatar { animation: avatar-pop .35s cubic-bezier(.34,1.4,.64,1) both; }

  /* ── Sidebar shell ── */
  .as-sidebar {
    position: fixed; left: 0; top: 0; bottom: 0;
    background: rgba(10,60,130,0.85);
    backdrop-filter: blur(32px) saturate(180%);
    -webkit-backdrop-filter: blur(32px) saturate(180%);
    border-right: 1px solid rgba(255,255,255,0.1);
    z-index: 100; display: flex; flex-direction: column;
    overflow: visible;
    transition: width 0.28s cubic-bezier(0.4,0,0.2,1);
  }

  /* ── Nav scroll ── */
  .as-nav {
    flex: 1; padding: 10px 8px; overflow-y: auto; overflow-x: hidden;
  }
  .as-nav::-webkit-scrollbar { width: 3px; }
  .as-nav::-webkit-scrollbar-track { background: transparent; }
  .as-nav::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.15); border-radius: 10px; }

  /* ── Nav items ── */
  .as-nav-item {
    display: flex; align-items: center; gap: 12px;
    padding: 11px 14px; border-radius: 12px; margin-bottom: 3px;
    cursor: pointer; transition: all .24s ease;
    border: 1px solid transparent; text-decoration: none;
    white-space: nowrap; overflow: hidden;
    position: relative;
  }
  .as-nav-item:hover { background: rgba(255,255,255,0.14); transform: translateX(4px); }
  .as-nav-item.active { background: rgba(255,255,255,0.22); border-color: rgba(14,165,233,0.4); }

  .as-sidebar.collapsed .as-nav-item {
    padding: 11px; justify-content: center; gap: 0;
    transform: none !important;
  }

  /* ── Tooltip ── */
  .as-tooltip {
    position: absolute; left: calc(100% + 12px); top: 50%; transform: translateY(-50%);
    background: rgba(10,40,100,0.95); color: #fff;
    font-size: 11px; font-weight: 700;
    font-family: 'Montserrat', sans-serif;
    padding: 6px 12px; border-radius: 8px;
    pointer-events: none; opacity: 0;
    transition: opacity .18s ease;
    white-space: nowrap;
    border: 1px solid rgba(14,165,233,0.25);
    box-shadow: 0 4px 16px rgba(0,0,0,0.25);
    z-index: 300;
  }
  .as-sidebar.collapsed .as-nav-item:hover .as-tooltip { opacity: 1; }

  /* ── Text label fade ── */
  .as-text-label {
    transition: opacity .2s ease, max-width .28s cubic-bezier(0.4,0,0.2,1);
    overflow: hidden; white-space: nowrap;
  }
  .as-sidebar.collapsed .as-text-label {
    opacity: 0; max-width: 0 !important; pointer-events: none;
  }

  /* ── Live bar ── */
  .as-live-bar {
    display: flex; align-items: center; gap: 8px;
    padding: 0 16px; height: 40px;
    border-bottom: 1px solid rgba(255,255,255,0.06);
    overflow: hidden; flex-shrink: 0;
  }
  .as-sidebar.collapsed .as-live-bar {
    justify-content: center; padding: 0;
  }

  /* ── Live label fade ── */
  .as-live-label {
    font-size: 11px; color: rgba(186,230,253,0.7);
    font-weight: 600; letter-spacing: .1em; white-space: nowrap;
    transition: opacity .2s ease, max-width .28s cubic-bezier(0.4,0,0.2,1);
    overflow: hidden; max-width: 200px;
  }
  .as-sidebar.collapsed .as-live-label {
    opacity: 0; max-width: 0; pointer-events: none;
  }

  /* ── Section label ── */
  .as-section-label {
    transition: opacity 0.2s ease, height 0.3s ease, padding 0.3s ease;
    opacity: 1; height: auto;
  }
  .as-sidebar.collapsed .as-section-label {
    opacity: 0; height: 0; padding: 0; overflow: hidden;
  }

  /* ── Divider ── */
  .as-divider {
    height: 1px; background: rgba(255,255,255,0.06); margin: 8px 0;
    transition: margin 0.3s ease;
  }
  .as-sidebar.collapsed .as-divider { margin: 4px 0; }

  /* ── Collapse button ── */
  .as-collapse-btn {
    position: absolute;
    top: 110px;
    right: -14px;
    transform: translateY(-50%);
    width: 28px; height: 28px;
    background: linear-gradient(135deg, #0EA5E9, #1565C0);
    border: 2px solid rgba(255,255,255,0.25);
    border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    cursor: pointer; z-index: 101;
    box-shadow: 0 4px 14px rgba(14,165,233,0.45);
    transition: transform 0.2s ease, box-shadow 0.2s ease;
    outline: none; padding: 0;
  }
  .as-collapse-btn:hover {
    transform: translateY(-50%) scale(1.12);
    box-shadow: 0 6px 20px rgba(14,165,233,0.65);
  }

  /* ── Profile button ── */
  .as-profile-btn {
    display: flex; align-items: center; gap: 10px;
    padding: 10px 12px; border-radius: 12px; cursor: pointer;
    transition: all .22s ease; border: 1px solid rgba(255,255,255,0.14);
    overflow: hidden;
  }
  .as-profile-btn:hover { background: rgba(255,255,255,0.18); }
  .as-sidebar.collapsed .as-profile-btn { justify-content: center; padding: 10px; }

  /* ── Dropdown items ── */
  .as-dd-item {
    display: flex; align-items: center; gap: 10px;
    padding: 10px 14px; border-radius: 10px; cursor: pointer;
    transition: background .18s ease; text-decoration: none;
    color: #1A3A5C; font-size: 13px;
    font-family: 'Montserrat', sans-serif; font-weight: 600;
  }
  .as-dd-item:hover { background: rgba(14,165,233,0.08); }
  .as-dd-item.danger:hover { background: rgba(239,68,68,0.08); color: #DC2626; }

  /* ── Logout icon (collapsed) ── */
  .as-logout-icon {
    display: flex; justify-content: center; align-items: center;
    margin-top: 6px; padding: 9px; border-radius: 10px; cursor: pointer;
    color: rgba(254,202,202,0.7); transition: background .2s, color .2s;
  }
  .as-logout-icon:hover { background: rgba(239,68,68,0.18); color: #FCA5A5; }

  /* ── Mobile overlay ── */
  .as-mobile-overlay {
    display: none;
    position: fixed; inset: 0; background: rgba(0,0,0,0.45);
    z-index: 98; backdrop-filter: blur(2px);
  }

  /* ── Mobile menu drawer ── */
  .as-mobile-drawer {
    display: none;
    position: fixed; top: 0; left: 0; bottom: 0; width: 260px;
    background: rgba(10,60,130,0.96);
    backdrop-filter: blur(32px) saturate(180%);
    -webkit-backdrop-filter: blur(32px) saturate(180%);
    border-right: 1px solid rgba(255,255,255,0.1);
    z-index: 99; flex-direction: column;
    animation: slide-in-left .25s cubic-bezier(0.4,0,0.2,1) both;
    overflow-y: auto;
  }

  /* ── Mobile top bar ── */
  .as-mobile-topbar {
    display: none;
    position: fixed; top: 0; left: 0; right: 0; height: 56px;
    background: rgba(10,60,130,0.92);
    backdrop-filter: blur(24px);
    -webkit-backdrop-filter: blur(24px);
    border-bottom: 1px solid rgba(255,255,255,0.1);
    z-index: 97; align-items: center; padding: 0 16px; gap: 14px;
  }
  .as-hamburger {
    width: 36px; height: 36px; border-radius: 10px;
    background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.15);
    display: flex; align-items: center; justify-content: center;
    cursor: pointer;
  }

  /* ── Responsive breakpoints ── */
  @media (max-width: 768px) {
    .as-sidebar { display: none !important; }
    .as-mobile-topbar { display: flex; }
    .as-mobile-overlay.open { display: block; }
    .as-mobile-drawer.open { 
         display: flex; 
         animation: slide-in-left .25s cubic-bezier(0.4,0,0.2,1) both; 
     }
  }
`;

// ── Avatar color palette ──────────────────────────────────────────────────────

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

// ── Sub-components ────────────────────────────────────────────────────────────

function SectionLabel({ children }: { children: React.ReactNode }) {
    return (
        <p className="as-section-label" style={{
            fontSize: '8.5px', fontWeight: 700, color: 'rgba(186,230,253,0.35)',
            letterSpacing: '.18em', textTransform: 'uppercase',
            padding: '14px 16px 6px',
            fontFamily: "'Montserrat', sans-serif",
        }}>
            {children}
        </p>
    );
}

function Divider() {
    return <div className="as-divider" />;
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

    useEffect(() => {
        if (collapsed) setOpen(false);
    }, [collapsed]);

    const avatarLarge: React.CSSProperties = {
        width: 62, height: 62, borderRadius: '50%',
        background: `linear-gradient(135deg, ${color1}, ${color2})`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 26, fontWeight: 900, color: '#fff',
        fontFamily: "'Montserrat', sans-serif",
        boxShadow: `0 6px 20px ${color1}55`,
        border: '3px solid rgba(255,255,255,0.9)',
    };

    return (
        <div ref={ref} style={{ position: 'relative' }}>
            {/* Dropdown panel — hanya saat expanded */}
            {!collapsed && (
                <div
                    className={`as-dropdown-panel ${open ? 'open' : ''}`}
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
                        <div className={open ? 'as-dropdown-avatar' : ''} style={avatarLarge}>
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

                    <Link href="/settings/profile" className="as-dd-item">
                        <IconUserEdit size={17} /> Edit Profil
                    </Link>
                    <div className="as-dd-item danger" onClick={() => router.post('/logout')}>
                        <IconLogout size={17} /> Keluar / Logout
                    </div>
                </div>
            )}

            {/* Trigger button */}
            <div
                className="as-profile-btn"
                onClick={() => !collapsed && setOpen(o => !o)}
                style={{
                    background: open ? 'rgba(255,255,255,0.18)' : 'rgba(255,255,255,0.08)',
                    cursor: collapsed ? 'default' : 'pointer',
                }}
            >
                <div style={{
                    width: 36, height: 36, borderRadius: '50%',
                    background: `linear-gradient(135deg, ${color1}, ${color2})`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 14, fontWeight: 800, color: '#fff', flexShrink: 0,
                    fontFamily: "'Montserrat',sans-serif",
                    boxShadow: open ? `0 0 12px ${color1}88` : 'none',
                    transition: 'box-shadow .25s ease',
                }}>
                    {user.name[0].toUpperCase()}
                </div>

                {!collapsed && (
                    <>
                        <div style={{ flex: 1, minWidth: 0 }}>
                            <p style={{
                                fontSize: 12, fontWeight: 700, color: '#fff',
                                fontFamily: "'Montserrat',sans-serif",
                                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                            }}>
                                {user.name}
                            </p>
                            <p style={{
                                fontSize: 10, color: 'rgba(186,230,253,0.6)',
                                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                            }}>
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

            {/* Logout shortcut saat collapsed */}
            {collapsed && (
                <div
                    className="as-logout-icon"
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

export default function AdminSidebar({ user, activePage = 'dashboard', pendingUsers = 0, onCollapse }: Props) {
    const [collapsed, setCollapsed] = useState(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('admin-sidebar-collapsed') === 'true';
        }
        return false;
    });
    const [mobileOpen, setMobileOpen] = useState(false);

    const W_EXP = 240;
    const W_COL = 70;

    useEffect(() => {
        onCollapse?.(collapsed);
        const event = new CustomEvent('sidebarToggle', {
            detail: { collapsed, storageKey: 'admin-sidebar-collapsed' }
        });
        window.dispatchEvent(event);
    }, []);

    useEffect(() => {
        const onResize = () => {
            if (window.innerWidth > 768) setMobileOpen(false);
        };
        window.addEventListener('resize', onResize);
        return () => window.removeEventListener('resize', onResize);
    }, []);

    const handleCollapse = (val: boolean) => {
        setCollapsed(val);
        localStorage.setItem('admin-sidebar-collapsed', String(val));
        onCollapse?.(val);
        const event = new CustomEvent('sidebarToggle', {
            detail: { collapsed: val, storageKey: 'admin-sidebar-collapsed' }
        });
        window.dispatchEvent(event);
    };

    const navGroups = [
        {
            label: 'Utama',
            items: [
                { key: 'dashboard', href: '/admin/dashboard', icon: <IconLayoutDashboard size={19} />, label: 'Dashboard' },
            ],
        },
        {
            label: 'Manajemen',
            items: [
                {
                    key: 'users', href: '/admin/users', icon: <IconUsers size={19} />, label: 'Kelola User',
                    badge: pendingUsers > 0 ? pendingUsers : undefined,
                },
                { key: 'juri', href: '/admin/juri', icon: <IconUserStar size={19} />, label: 'Kelola Juri' },
            ],
        },
        {
            label: 'Konten',
            items: [
                { key: 'designs',     href: '/admin/designs',     icon: <IconPalette size={19} />, label: 'Semua Desain' },
                { key: 'leaderboard', href: '/admin/leaderboard', icon: <IconTrophy size={19} />,  label: 'Leaderboard' },
            ],
        },
    ];

    const sidebarContent = (isMobileDrawer = false) => (
        <>
            {/* ── Logo ── */}
            <div style={{
                padding: (!isMobileDrawer && collapsed) ? '28px 15px 22px' : '28px 24px 22px',
                borderBottom: '1px solid rgba(255,255,255,0.08)',
                display: 'flex', alignItems: 'center',
                justifyContent: (!isMobileDrawer && collapsed) ? 'center' : 'flex-start',
                gap: 12, overflow: 'hidden',
                transition: 'padding 0.28s cubic-bezier(0.4,0,0.2,1)',
            }}>
                <Link href="/admin/dashboard" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 12 }}>
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
                    {(!collapsed || isMobileDrawer) && (
                        <div>
                            <p style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 800, fontSize: 13, color: '#fff', lineHeight: 1.2 }}>
                                Layang-Layang
                            </p>
                            <p style={{ fontSize: 9, color: '#BAE6FD', fontWeight: 600, letterSpacing: '.14em', textTransform: 'uppercase' }}>
                                PANEL ADMIN
                            </p>
                        </div>
                    )}
                </Link>
            </div>

            {/* ── Live status ── */}
            <div className="as-live-bar">
                <span style={{
                    width: 7, height: 7, borderRadius: '50%', background: '#34D399',
                    display: 'inline-block', boxShadow: '0 0 8px rgba(52,211,153,0.8)',
                    animation: 'blink-dot 2s ease-in-out infinite', flexShrink: 0,
                }} />
                {(!collapsed || isMobileDrawer) && (
                    <span className="as-live-label">LIVE · Kompetisi 2026</span>
                )}
            </div>

            {/* ── Nav ── */}
            <nav className="as-nav">
                {navGroups.map((group, gi) => (
                    <div key={group.label}>
                        {gi > 0 && <Divider />}
                        <SectionLabel>{group.label}</SectionLabel>

                        {group.items.map(item => {
                            const isActive = activePage === item.key;
                            const hasBadge = !isActive && item.badge !== undefined && item.badge > 0;
                            const isCollapsed = isMobileDrawer ? false : collapsed;

                            return (
                                <Link
                                    key={item.key}
                                    href={item.href}
                                    className={`as-nav-item${isActive ? ' active' : ''}`}
                                >
                                    <span style={{
                                        flexShrink: 0, display: 'flex', alignItems: 'center',
                                        color: isActive ? '#fff' : 'rgba(186,230,253,0.72)',
                                        transition: 'color .2s', position: 'relative',
                                    }}>
                                        {item.icon}

                                        {hasBadge && isCollapsed && (
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
                                        className="as-text-label"
                                        style={{
                                            fontFamily: "'Montserrat', sans-serif",
                                            fontWeight: 700, fontSize: 12.5,
                                            color: isActive ? '#fff' : 'rgba(186,230,253,0.72)',
                                            letterSpacing: '.03em',
                                            maxWidth: isCollapsed ? 0 : 160,
                                            transition: 'color .2s', flex: 1,
                                        }}
                                    >
                                        {item.label}
                                    </span>

                                    {isActive && !isCollapsed && (
                                        <div style={{
                                            marginLeft: 'auto', width: 6, height: 6, borderRadius: '50%',
                                            background: '#0EA5E9', boxShadow: '0 0 8px rgba(14,165,233,0.8)',
                                            flexShrink: 0,
                                        }} />
                                    )}

                                    {hasBadge && !isCollapsed && (
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

                                    {isCollapsed && <span className="as-tooltip">{item.label}</span>}
                                </Link>
                            );
                        })}
                    </div>
                ))}
            </nav>

            {/* ── Profile ── */}
            <div style={{ padding: '10px 12px 14px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                <ProfileDropdown user={user} collapsed={isMobileDrawer ? false : collapsed} />
            </div>
        </>
    );

    return (
        <>
            <style>{SIDEBAR_STYLES}</style>

            {/* ══ DESKTOP SIDEBAR ══ */}
            <div
                className={`as-sidebar${collapsed ? ' collapsed' : ''}`}
                style={{ width: collapsed ? W_COL : W_EXP }}
            >
                <button
                    className="as-collapse-btn"
                    onClick={() => handleCollapse(!collapsed)}
                    title={collapsed ? 'Perluas sidebar' : 'Ciutkan sidebar'}
                >
                    {collapsed
                        ? <IconChevronRight size={13} color="#fff" />
                        : <IconChevronLeft  size={13} color="#fff" />
                    }
                </button>

                {sidebarContent(false)}
            </div>

            {/* ══ MOBILE TOP BAR ══ */}
            <div className="as-mobile-topbar">
                <div className="as-hamburger" onClick={() => setMobileOpen(o => !o)}>
                    {mobileOpen
                        ? <IconX size={18} color="#fff" />
                        : <IconMenu2 size={18} color="#fff" />
                    }
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{
                        width: 28, height: 28, borderRadius: '50%',
                        background: 'linear-gradient(135deg, #0EA5E9, #1565C0)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        animation: 'float-slow 4s ease-in-out infinite',
                        overflow: 'hidden', padding: 4,
                    }}>
                        <img src="/images/logo.png" alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                    </div>
                    <div>
                        <p style={{ fontFamily: "'Montserrat',sans-serif", fontWeight: 800, fontSize: 12, color: '#fff', lineHeight: 1 }}>
                            Layang-Layang
                        </p>
                        <p style={{ fontSize: 8, color: '#BAE6FD', fontWeight: 600, letterSpacing: '.12em', textTransform: 'uppercase' }}>
                            PANEL ADMIN
                        </p>
                    </div>
                </div>
            </div>

            {/* ══ MOBILE OVERLAY ══ */}
            <div
                className={`as-mobile-overlay${mobileOpen ? ' open' : ''}`}
                onClick={() => setMobileOpen(false)}
            />

            {/* ══ MOBILE DRAWER ══ */}
            <div className={`as-mobile-drawer${mobileOpen ? ' open' : ''}`}>
                {sidebarContent(true)}
            </div>
        </>
    );
}

