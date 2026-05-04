import { Link } from '@inertiajs/react';
import type { PropsWithChildren } from 'react';
import { useCurrentUrl } from '@/hooks/use-current-url';
import { cn, toUrl } from '@/lib/utils';
import { edit as editAppearance } from '@/routes/appearance';
import { edit } from '@/routes/profile';
import { edit as editSecurity } from '@/routes/security';
import type { NavItem } from '@/types';
import { IconUser, IconShield, IconPalette } from '@tabler/icons-react';

const sidebarNavItems: NavItem[] = [
    {
        title: 'Profil',
        href: edit(),
        icon: IconUser,
    },
    {
        title: 'Keamanan',
        href: editSecurity(),
        icon: IconShield,
    },
    {
        title: 'Tampilan',
        href: editAppearance(),
        icon: IconPalette,
    },
];

export default function SettingsLayout({ children }: PropsWithChildren) {
    const { isCurrentOrParentUrl } = useCurrentUrl();

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700;800&family=Open+Sans:wght@400;600&display=swap');

                @keyframes shimmer-text {
                    0%   { background-position: 0% 50%; }
                    50%  { background-position: 100% 50%; }
                    100% { background-position: 0% 50%; }
                }
                @keyframes spin-slow {
                    from { transform: rotate(0deg); }
                    to   { transform: rotate(360deg); }
                }
                @keyframes float-kite {
                    0%, 100% { transform: translateY(0)   rotate(-5deg); }
                    50%      { transform: translateY(-8px) rotate(5deg); }
                }
                @keyframes slide-in-left {
                    from { opacity: 0; transform: translateX(-16px); }
                    to   { opacity: 1; transform: translateX(0); }
                }
                @keyframes slide-in-up {
                    from { opacity: 0; transform: translateY(16px); }
                    to   { opacity: 1; transform: translateY(0); }
                }

                /* ── Page wrapper ── */
                .ll-settings-layout {
                    min-height: 100vh;
                    padding: 36px 24px 60px;
                    position: relative;
                    overflow: hidden;
                }

                /* Ambient background blobs */
                .ll-bg-blob {
                    position: fixed;
                    border-radius: 50%;
                    pointer-events: none;
                    z-index: 0;
                    filter: blur(80px);
                    opacity: 0.13;
                }

                /* ── Page header ── */
                .ll-page-header {
                    position: relative;
                    z-index: 1;
                    margin-bottom: 36px;
                    animation: slide-in-up .5s ease both;
                }

                .ll-page-title {
                    font-family: 'Montserrat', sans-serif;
                    font-weight: 800;
                    font-size: 28px;
                    letter-spacing: -0.03em;
                    background: linear-gradient(135deg, #0A2F5E 0%, #1565C0 50%, #0EA5E9 100%);
                    background-size: 200%;
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                    animation: shimmer-text 6s ease infinite;
                    margin-bottom: 4px;
                    line-height: 1.15;
                }

                .ll-page-desc {
                    font-family: 'Open Sans', sans-serif;
                    font-size: 14px;
                    color: #4A6A8A;
                }

                .ll-page-header-line {
                    margin-top: 20px;
                    height: 2px;
                    background: linear-gradient(90deg, #0EA5E9 0%, #1565C0 40%, rgba(14,165,233,0.08) 100%);
                    border-radius: 99px;
                }

                /* ── Layout body ── */
                .ll-settings-body {
                    position: relative;
                    z-index: 1;
                    display: flex;
                    gap: 28px;
                    align-items: flex-start;
                }

                /* ── Sidebar ── */
                .ll-sidebar {
                    width: 200px;
                    flex-shrink: 0;
                    animation: slide-in-left .5s ease .1s both;
                }

                .ll-sidebar-card {
                    position: relative;
                    background: rgba(255,255,255,0.68);
                    backdrop-filter: blur(24px) saturate(160%);
                    -webkit-backdrop-filter: blur(24px) saturate(160%);
                    border-radius: 20px;
                    border: 1.5px solid rgba(255,255,255,0.88);
                    box-shadow:
                        0 12px 40px rgba(11,31,58,0.09),
                        0 0 0 1px rgba(14,165,233,0.06),
                        inset 0 1px 0 rgba(255,255,255,0.95);
                    overflow: hidden;
                    padding: 10px 8px;
                }

                .ll-sidebar-card::before {
                    content: '';
                    position: absolute;
                    top: 0; left: 0; right: 0;
                    height: 3px;
                    background: linear-gradient(90deg, #0EA5E9 0%, #1565C0 50%, #0A2F5E 100%);
                }

                .ll-sidebar-label {
                    font-family: 'Montserrat', sans-serif;
                    font-size: 9px;
                    font-weight: 700;
                    letter-spacing: .14em;
                    text-transform: uppercase;
                    color: #8AABCE;
                    padding: 6px 12px 8px;
                }

                /* ── Nav items ── */
                .ll-nav-item {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    padding: 11px 14px;
                    border-radius: 13px;
                    font-family: 'Montserrat', sans-serif;
                    font-weight: 600;
                    font-size: 13px;
                    color: #3A5A7C;
                    text-decoration: none;
                    transition: all .22s cubic-bezier(.34,1.4,.64,1);
                    position: relative;
                    overflow: hidden;
                    margin-bottom: 2px;
                }

                .ll-nav-item:hover {
                    background: rgba(14,165,233,0.07);
                    color: #1565C0;
                    transform: translateX(3px);
                }

                .ll-nav-item .ll-nav-icon {
                    width: 30px;
                    height: 30px;
                    border-radius: 8px;
                    background: rgba(14,165,233,0.08);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    flex-shrink: 0;
                    color: #5A8AC0;
                    transition: all .22s ease;
                }

                .ll-nav-item:hover .ll-nav-icon {
                    background: rgba(14,165,233,0.15);
                    color: #0EA5E9;
                }

                /* Active state */
                .ll-nav-item.ll-active {
                    background: linear-gradient(135deg, rgba(14,165,233,0.13), rgba(21,101,192,0.09));
                    color: #0A2F5E;
                    font-weight: 800;
                    transform: none;
                }

                .ll-nav-item.ll-active::before {
                    content: '';
                    position: absolute;
                    left: 0; top: 50%;
                    transform: translateY(-50%);
                    width: 3px;
                    height: 60%;
                    background: linear-gradient(180deg, #0EA5E9, #1565C0);
                    border-radius: 0 4px 4px 0;
                }

                .ll-nav-item.ll-active .ll-nav-icon {
                    background: linear-gradient(135deg, #0EA5E9, #1565C0);
                    color: #fff;
                    box-shadow: 0 4px 12px rgba(14,165,233,0.4);
                }

                /* Deco ring on sidebar */
                .ll-sidebar-deco {
                    position: absolute;
                    border-radius: 50%;
                    pointer-events: none;
                    animation: spin-slow linear infinite;
                }

                /* ── Content area ── */
                .ll-settings-content {
                    flex: 1;
                    min-width: 0;
                    animation: slide-in-up .5s ease .18s both;
                }

                /* ── Responsive: stack on small screens ── */
                @media (max-width: 860px) {
                    .ll-settings-body {
                        flex-direction: column;
                    }

                    .ll-sidebar {
                        width: 100%;
                        animation: slide-in-up .4s ease .1s both;
                    }

                    .ll-sidebar-card {
                        padding: 8px;
                    }

                    .ll-sidebar-label {
                        display: none;
                    }

                    /* Horizontal nav on mobile */
                    .ll-sidebar-nav {
                        display: flex;
                        flex-direction: row !important;
                        gap: 6px;
                    }

                    .ll-nav-item {
                        flex: 1;
                        justify-content: center;
                        padding: 10px 10px;
                        flex-direction: column;
                        gap: 5px;
                        text-align: center;
                        font-size: 11.5px;
                        margin-bottom: 0;
                    }

                    .ll-nav-item:hover {
                        transform: translateY(-2px);
                    }

                    .ll-nav-item.ll-active::before {
                        left: 50%; top: 0;
                        transform: translateX(-50%);
                        width: 60%; height: 3px;
                        border-radius: 0 0 4px 4px;
                    }

                    .ll-nav-item .ll-nav-icon {
                        width: 34px;
                        height: 34px;
                        margin: 0 auto;
                    }
                }

                @media (max-width: 520px) {
                    .ll-settings-layout {
                        padding: 20px 12px 40px;
                    }

                    .ll-page-title {
                        font-size: 22px;
                    }
                }
            `}</style>

            <div className="ll-settings-layout">
                {/* Ambient background blobs */}
                <div className="ll-bg-blob" style={{
                    width: 420, height: 420,
                    top: -120, right: -80,
                    background: '#0EA5E9',
                }} />
                <div className="ll-bg-blob" style={{
                    width: 300, height: 300,
                    bottom: 60, left: -60,
                    background: '#1565C0',
                }} />
                <div className="ll-bg-blob" style={{
                    width: 200, height: 200,
                    top: '40%', left: '30%',
                    background: '#0A2F5E',
                    opacity: 0.06,
                }} />

                {/* Page header */}
                <div className="ll-page-header">
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                        {/* Kite badge */}
                        <div style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 6,
                            fontFamily: "'Montserrat', sans-serif",
                            fontSize: '9.5px',
                            fontWeight: 700,
                            letterSpacing: '.14em',
                            textTransform: 'uppercase',
                            color: '#5A8AC0',
                            background: 'rgba(14,165,233,0.08)',
                            border: '1px solid rgba(14,165,233,0.18)',
                            borderRadius: '999px',
                            padding: '4px 10px',
                        }}>
                            <span style={{ animation: 'float-kite 3s ease-in-out infinite', display: 'inline-block' }}>🪁</span>
                            Layang-Layang · Kompetisi 2026
                        </div>
                    </div>

                    <div className="ll-page-title">Pengaturan Akun</div>
                    <div className="ll-page-desc">Kelola profil, keamanan, dan tampilan akunmu</div>
                    <div className="ll-page-header-line" />
                </div>

                {/* Body */}
                <div className="ll-settings-body">

                    {/* Sidebar */}
                    <aside className="ll-sidebar">
                        <div className="ll-sidebar-card">
                            {/* Deco rings */}
                            <div className="ll-sidebar-deco" style={{
                                width: 80, height: 80, bottom: -30, right: -30,
                                border: '1px dashed rgba(14,165,233,0.14)',
                                animationDuration: '20s',
                            }} />
                            <div className="ll-sidebar-deco" style={{
                                width: 50, height: 50, bottom: -14, right: -14,
                                border: '1px solid rgba(14,165,233,0.20)',
                                animationDuration: '12s',
                                animationDirection: 'reverse',
                            }} />

                            <div className="ll-sidebar-label">Menu</div>

                            <nav
                                className="ll-sidebar-nav"
                                style={{ display: 'flex', flexDirection: 'column' }}
                                aria-label="Settings navigation"
                            >
                                {sidebarNavItems.map((item, index) => {
                                    const isActive = isCurrentOrParentUrl(item.href);
                                    const Icon = item.icon as any;
                                    return (
                                        <Link
                                            key={`${toUrl(item.href)}-${index}`}
                                            href={item.href}
                                            className={cn('ll-nav-item', { 'll-active': isActive })}
                                        >
                                            <span className="ll-nav-icon">
                                                {Icon && <Icon size={16} />}
                                            </span>
                                            {item.title}
                                        </Link>
                                    );
                                })}
                            </nav>
                        </div>
                    </aside>

                    {/* Main content */}
                    <main className="ll-settings-content">
                        <div style={{ maxWidth: 560 }}>
                            {children}
                        </div>
                    </main>
                </div>
            </div>
        </>
    );
}