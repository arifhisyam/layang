import { useState, useEffect, useRef } from 'react';
import { Link, router } from '@inertiajs/react';
import {
    IconLayoutDashboard,
    IconCloudUpload,
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
    activePage?: 'dashboard' | 'upload' | 'leaderboard';
}

// ── Styles ───────────────────────────────────────────────────────────────────

const SIDEBAR_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700;800;900&family=Open+Sans:wght@300;400;600&display=swap');

  @keyframes float-slow { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
  @keyframes blink-dot  { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.4;transform:scale(0.7)} }
  @keyframes avatar-pop { 0%{transform:scale(0.7) translateY(6px);opacity:0} 60%{transform:scale(1.08);opacity:1} 100%{transform:scale(1);opacity:1} }
  @keyframes slide-in-left { 0%{transform:translateX(-100%)} 100%{transform:translateX(0)} }

  /* ── Dropdown ── */
  .ps-dropdown-panel {
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
  .ps-dropdown-panel.open { pointer-events: auto; }
  .ps-dropdown-panel:not(.open) { opacity: 0 !important; transform: scaleY(0.88) translateY(6px) !important; }
  .ps-dropdown-avatar { animation: avatar-pop .35s cubic-bezier(.34,1.4,.64,1) both; }

  /* ── Sidebar shell ── */
  .ps-sidebar {
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
  .ps-nav {
    flex: 1; padding: 10px 12px; overflow-y: auto; overflow-x: hidden;
  }
  .ps-nav::-webkit-scrollbar { width: 3px; }
  .ps-nav::-webkit-scrollbar-track { background: transparent; }
  .ps-nav::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.15); border-radius: 10px; }

  /* ── Nav items ── */
  .ps-nav-item {
    display: flex; align-items: center; gap: 12px;
    padding: 11px 14px; border-radius: 12px; margin-bottom: 3px;
    cursor: pointer; transition: all .24s ease;
    border: 1px solid transparent; text-decoration: none;
    white-space: nowrap; overflow: hidden;
    position: relative;
  }
  .ps-nav-item:hover { background: rgba(255,255,255,0.14); transform: translateX(4px); }
  .ps-nav-item.active { background: rgba(255,255,255,0.22); border-color: rgba(14,165,233,0.4); }

  /* Collapsed: center icons */
  .ps-sidebar.collapsed .ps-nav-item {
    padding: 11px; justify-content: center; gap: 0;
    transform: none !important;
  }

  /* ── Tooltip (collapsed mode only) ── */
  .ps-tooltip {
    position: absolute; left: calc(100% + 12px); top: 50%; transform: translateY(-50%);
    background: rgba(11,31,58,0.92); color: #fff;
    font-family: 'Montserrat', sans-serif; font-weight: 700; font-size: 11px;
    padding: 5px 12px; border-radius: 8px; white-space: nowrap;
    pointer-events: none; opacity: 0;
    transition: opacity .18s ease;
    box-shadow: 0 4px 16px rgba(0,0,0,0.25);
    z-index: 300;
  }
  .ps-sidebar.collapsed .ps-nav-item:hover .ps-tooltip { opacity: 1; }

  /* ── Label fade ── */
  .ps-text-label {
    transition: opacity .2s ease, max-width .28s cubic-bezier(0.4,0,0.2,1);
    overflow: hidden; white-space: nowrap;
  }
  .ps-sidebar.collapsed .ps-text-label {
    opacity: 0; max-width: 0 !important; pointer-events: none;
  }

  /* ── Toggle button ── FIX #4: background matches chevron color (#0E64B4), chevron is white ── */
  .ps-toggle-btn {
    position: absolute; top: 112px; right: -14px;
    width: 28px; height: 28px; border-radius: 50%;
    background: #0E64B4;
    border: 2px solid rgba(14,165,233,0.4);
    box-shadow: 0 2px 12px rgba(14,100,180,0.28);
    display: flex; align-items: center; justify-content: center;
    cursor: pointer; z-index: 110;
    transition: border-color .2s, box-shadow .2s, background .2s;
    padding: 0; outline: none;
  }
  .ps-toggle-btn:hover {
    border-color: #0EA5E9;
    background: #1575C8;
    box-shadow: 0 0 14px rgba(14,165,233,0.45);
  }

  /* ── Profile button ── */
  .ps-profile-btn {
    display: flex; align-items: center; gap: 10px;
    padding: 10px 12px; border-radius: 12px; cursor: pointer;
    transition: all .22s ease; border: 1px solid rgba(255,255,255,0.14);
    overflow: hidden;
  }
  .ps-profile-btn:hover { background: rgba(255,255,255,0.18); }
  .ps-sidebar.collapsed .ps-profile-btn { justify-content: center; padding: 10px; }

  /* ── Dropdown items ── */
  .ps-dd-item {
    display: flex; align-items: center; gap: 10px;
    padding: 10px 14px; border-radius: 10px; cursor: pointer;
    transition: background .18s ease; text-decoration: none;
    color: #1A3A5C; font-size: 13px;
    font-family: 'Montserrat', sans-serif; font-weight: 600;
  }
  .ps-dd-item:hover { background: rgba(14,165,233,0.08); }
  .ps-dd-item.danger:hover { background: rgba(239,68,68,0.08); color: #DC2626; }

  /* ── Logout icon (collapsed) ── */
  .ps-logout-icon {
    display: flex; justify-content: center; align-items: center;
    margin-top: 6px; padding: 9px; border-radius: 10px; cursor: pointer;
    color: rgba(254,202,202,0.7); transition: background .2s, color .2s;
  }
  .ps-logout-icon:hover { background: rgba(239,68,68,0.18); color: #FCA5A5; }

  /* ── Mobile overlay ── */
  .ps-mobile-overlay {
    display: none;
    position: fixed; inset: 0; background: rgba(0,0,0,0.45);
    z-index: 98; backdrop-filter: blur(2px);
  }

  /* ── Mobile bottom nav ── */
  .ps-mobile-nav {
    display: none;
    position: fixed; bottom: 0; left: 0; right: 0;
    background: rgba(10,60,130,0.92);
    backdrop-filter: blur(24px) saturate(180%);
    -webkit-backdrop-filter: blur(24px) saturate(180%);
    border-top: 1px solid rgba(255,255,255,0.12);
    z-index: 100; padding: 6px 0 max(6px, env(safe-area-inset-bottom));
    justify-content: space-around; align-items: center;
  }
  .ps-mobile-nav-item {
    display: flex; flex-direction: column; align-items: center; gap: 3px;
    padding: 6px 14px; border-radius: 10px; text-decoration: none;
    transition: background .2s;
    flex: 1;
  }
  .ps-mobile-nav-item.active { background: rgba(255,255,255,0.18); }
  .ps-mobile-nav-item span {
    font-size: 9px; font-family: 'Montserrat', sans-serif; font-weight: 700;
    color: rgba(186,230,253,0.6); letter-spacing: .04em;
  }
  .ps-mobile-nav-item.active span { color: #fff; }

  /* ── Mobile menu drawer ── */
  .ps-mobile-drawer {
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

  /* ── Hamburger (mobile top bar) ── */
  .ps-mobile-topbar {
    display: none;
    position: fixed; top: 0; left: 0; right: 0; height: 56px;
    background: rgba(10,60,130,0.92);
    backdrop-filter: blur(24px);
    -webkit-backdrop-filter: blur(24px);
    border-bottom: 1px solid rgba(255,255,255,0.1);
    z-index: 97; align-items: center; padding: 0 16px; gap: 14px;
  }
  .ps-hamburger {
    width: 36px; height: 36px; border-radius: 10px;
    background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.15);
    display: flex; align-items: center; justify-content: center;
    cursor: pointer;
  }

  /* ── Responsive breakpoints ── */
  @media (max-width: 768px) {
    .ps-sidebar { display: none !important; }
    .ps-mobile-topbar { display: flex; }
    .ps-mobile-nav { display: flex; }
    .ps-mobile-overlay.open { display: block; }
    .ps-mobile-drawer.open { display: flex; }
  }
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

// ── Nav items config ──────────────────────────────────────────────────────────

const NAV_ITEMS = [
    { key: 'dashboard',   href: '/peserta/dashboard',  icon: <IconLayoutDashboard size={19} />, label: 'Dashboard' },
    { key: 'upload',      href: '/peserta/upload',      icon: <IconCloudUpload size={19} />,     label: 'Upload Desain' },
    { key: 'leaderboard', href: '/peserta/leaderboard', icon: <IconTrophy size={19} />,          label: 'Leaderboard' },
] as const;

// ── Sub-components ────────────────────────────────────────────────────────────

function SectionLabel({ children }: { children: React.ReactNode }) {
    return (
        <p style={{
            fontSize: '8.5px', fontWeight: 700, color: 'rgba(186,230,253,0.35)',
            letterSpacing: '.18em', textTransform: 'uppercase',
            padding: '14px 16px 6px',
            fontFamily: "'Montserrat', sans-serif",
        }}>
            {children}
        </p>
    );
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
            {/* Panel (only shown when expanded) */}
            {!collapsed && (
                <div
                    className={`ps-dropdown-panel ${open ? 'open' : ''}`}
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
                        <div className={open ? 'ps-dropdown-avatar' : ''} style={avatarLarge}>
                            {user.name[0].toUpperCase()}
                        </div>
                        <div style={{ textAlign: 'center' }}>
                            <p style={{ fontFamily: "'Montserrat',sans-serif", fontWeight: 800, fontSize: 14, color: '#0B1F3A', lineHeight: 1.3 }}>
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

                    <Link href="/settings/profile" className="ps-dd-item">
                        <IconUserEdit size={17} /> Edit Profil
                    </Link>
                    <div className="ps-dd-item danger" onClick={() => router.post('/logout')}>
                        <IconLogout size={17} /> Keluar / Logout
                    </div>
                </div>
            )}

            {/* Trigger button */}
            <div
                className="ps-profile-btn"
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

            {/* Logout shortcut when collapsed */}
            {collapsed && (
                <div
                    className="ps-logout-icon"
                    onClick={() => router.post('/logout')}
                    title="Keluar / Logout"
                >
                    <IconLogout size={18} />
                </div>
            )}
        </div>
    );
}

// ── NavItem ───────────────────────────────────────────────────────────────────

function NavItem({
    item,
    isActive,
    collapsed,
}: {
    item: typeof NAV_ITEMS[number];
    isActive: boolean;
    collapsed: boolean;
}) {
    return (
        <Link
            href={item.href}
            className={`ps-nav-item${isActive ? ' active' : ''}`}
        >
            <span style={{
                flexShrink: 0, display: 'flex', alignItems: 'center',
                color: isActive ? '#fff' : 'rgba(186,230,253,0.72)',
                transition: 'color .2s',
            }}>
                {item.icon}
            </span>

            <span
                className="ps-text-label"
                style={{
                    fontFamily: "'Montserrat', sans-serif",
                    fontWeight: 700, fontSize: 12.5,
                    color: isActive ? '#fff' : 'rgba(186,230,253,0.72)',
                    letterSpacing: '.03em',
                    maxWidth: collapsed ? 0 : 160,
                    transition: 'color .2s',
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

            {/* Tooltip on hover (collapsed only) */}
            {collapsed && <span className="ps-tooltip">{item.label}</span>}
        </Link>
    );
}

// ── Main Export ───────────────────────────────────────────────────────────────

export default function PesertaSidebar({ user, activePage = 'dashboard' }: Props) {
    const [collapsed, setCollapsed] = useState(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('peserta-sidebar-collapsed');
            return saved === 'true';
        }
        return false;
    });
    const [mobileOpen, setMobileOpen] = useState(false);

    const W_EXP = 240;
    const W_COL = 70;

    useEffect(() => {
        const onResize = () => {
            if (window.innerWidth > 768) setMobileOpen(false);
        };
        window.addEventListener('resize', onResize);
        return () => window.removeEventListener('resize', onResize);
    }, []);

    const handleToggle = () => {
        const newCollapsed = !collapsed;
        setCollapsed(newCollapsed);
        localStorage.setItem('peserta-sidebar-collapsed', String(newCollapsed));
        const event = new CustomEvent('sidebarToggle', {
            detail: { collapsed: newCollapsed, storageKey: 'peserta-sidebar-collapsed' }
        });
        window.dispatchEvent(event);
    };

    const sidebarContent = (isMobileDrawer = false) => (
        <>
            {/* ── Logo ── */}
            {/* FIX #1: collapsed logo centered, FIX #2: live dot visible when collapsed */}
            <div style={{
                padding: '28px 24px 22px',
                borderBottom: '1px solid rgba(255,255,255,0.08)',
                display: 'flex',
                alignItems: 'center',
                // FIX #1: center logo when collapsed
                justifyContent: (!isMobileDrawer && collapsed) ? 'center' : 'flex-start',
                gap: 12,
                overflow: 'hidden',
            }}>
                <div style={{
                    width: 40, height: 40, borderRadius: '50%',
                    background: 'linear-gradient(135deg, #0EA5E9, #1565C0)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: '0 0 20px rgba(14,165,233,0.6)',
                    animation: 'float-slow 4s ease-in-out infinite', flexShrink: 0,
                    overflow: 'hidden',
                    padding: 6,
                }}>
                    <img src="/images/logo.png" alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                </div>
                {(!collapsed || isMobileDrawer) && (
                    <div>
                        <p style={{ fontFamily: "'Montserrat',sans-serif", fontWeight: 800, fontSize: 13, color: '#fff', lineHeight: 1.2 }}>
                            Layang-Layang
                        </p>
                        <p style={{ fontSize: 9, color: '#BAE6FD', fontWeight: 600, letterSpacing: '.14em', textTransform: 'uppercase' }}>
                            PANEL PESERTA
                        </p>
                    </div>
                )}
            </div>

            {/* ── Live status ── */}
            {/* FIX #2: when collapsed show only the green dot, centered */}
            <div style={{
                padding: (!isMobileDrawer && collapsed) ? '14px 0' : '14px 24px',
                borderBottom: '1px solid rgba(255,255,255,0.06)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: (!isMobileDrawer && collapsed) ? 'center' : 'flex-start',
                gap: 8,
            }}>
                <span style={{
                    width: 7, height: 7, borderRadius: '50%', background: '#34D399',
                    display: 'inline-block', boxShadow: '0 0 8px rgba(52,211,153,0.8)',
                    animation: 'blink-dot 2s ease-in-out infinite',
                    flexShrink: 0,
                }} />
                {(!collapsed || isMobileDrawer) && (
                    <span style={{ fontSize: 11, color: 'rgba(186,230,253,0.7)', fontWeight: 600, letterSpacing: '.1em' }}>
                        LIVE · Kompetisi 2026
                    </span>
                )}
            </div>

            {/* ── Nav ── */}
            <nav className="ps-nav">
                <SectionLabel>{(!collapsed || isMobileDrawer) ? 'Menu Utama' : '···'}</SectionLabel>
                {NAV_ITEMS.map(item => (
                    <NavItem
                        key={item.key}
                        item={item}
                        isActive={activePage === item.key}
                        collapsed={isMobileDrawer ? false : collapsed}
                    />
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

            {/* ══ DESKTOP SIDEBAR ══════════════════════════════════════════════ */}
            <div
                className={`ps-sidebar${collapsed ? ' collapsed' : ''}`}
                style={{ width: collapsed ? W_COL : W_EXP }}
            >
                {/* ── Toggle button ── FIX #3: moved down to top:112px to align with live dot section */}
                {/* FIX #4: bg = #0E64B4 (blue), chevron = white */}
                <button
                    className="ps-toggle-btn"
                    onClick={handleToggle}
                    aria-label={collapsed ? 'Perluas sidebar' : 'Ciutkan sidebar'}
                    title={collapsed ? 'Perluas sidebar' : 'Ciutkan sidebar'}
                >
                    {collapsed
                        ? <IconChevronRight size={14} color="#ffffff" />
                        : <IconChevronLeft size={14} color="#ffffff" />
                    }
                </button>

                {sidebarContent(false)}
            </div>


            {/* ══ MOBILE TOP BAR ═══════════════════════════════════════════════ */}
            <div className="ps-mobile-topbar">
                <div className="ps-hamburger" onClick={() => setMobileOpen(o => !o)}>
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
                        fontSize: 14, animation: 'float-slow 4s ease-in-out infinite',
                    }}>🪁</div>
                    <div>
                        <p style={{ fontFamily: "'Montserrat',sans-serif", fontWeight: 800, fontSize: 12, color: '#fff', lineHeight: 1 }}>
                            Layang-Layang
                        </p>
                        <p style={{ fontSize: 8, color: '#BAE6FD', fontWeight: 600, letterSpacing: '.12em', textTransform: 'uppercase' }}>
                            PANEL PESERTA
                        </p>
                    </div>
                </div>
            </div>

            {/* ══ MOBILE OVERLAY ═══════════════════════════════════════════════ */}
            <div
                className={`ps-mobile-overlay${mobileOpen ? ' open' : ''}`}
                onClick={() => setMobileOpen(false)}
            />

            {/* ══ MOBILE DRAWER ════════════════════════════════════════════════ */}
            <div className={`ps-mobile-drawer${mobileOpen ? ' open' : ''}`}>
                {sidebarContent(true)}
            </div>

            {/* ══ MOBILE BOTTOM NAV ════════════════════════════════════════════ */}
            <nav className="ps-mobile-nav">
                {NAV_ITEMS.map(item => (
                    <Link
                        key={item.key}
                        href={item.href}
                        className={`ps-mobile-nav-item${activePage === item.key ? ' active' : ''}`}
                    >
                        <span style={{ color: activePage === item.key ? '#fff' : 'rgba(186,230,253,0.7)', display: 'flex' }}>
                            {item.icon}
                        </span>
                        <span>{item.label.split(' ')[0]}</span>
                    </Link>
                ))}
            </nav>
        </>
    );
}