import { Link } from '@inertiajs/react';
import type { PropsWithChildren } from 'react';
import AppLogoIcon from '@/components/app-logo-icon';
import { home } from '@/routes';

export default function AuthCardLayout({
    children,
    title,
    description,
}: PropsWithChildren<{
    name?: string;
    title?: string;
    description?: string;
}>) {
    return (
        <div
            style={{
                minHeight: '100svh',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '40px 24px',
                position: 'relative',
                overflow: 'hidden',
                background: 'linear-gradient(135deg, #dbeafe 0%, #eff6ff 35%, #e0f2fe 65%, #bfdbfe 100%)',
                fontFamily: "'DM Sans', sans-serif",
            }}
        >
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,300&display=swap');

                @keyframes orb-drift-a {
                    from { transform: translate(0,0) scale(1); }
                    to   { transform: translate(40px,30px) scale(1.08); }
                }
                @keyframes orb-drift-b {
                    from { transform: translate(0,0) scale(1); }
                    to   { transform: translate(-30px,-25px) scale(1.06); }
                }
                @keyframes badge-pulse {
                    0%,100% { transform:scale(1); opacity:1; }
                    50%     { transform:scale(1.4); opacity:.6; }
                }
                @keyframes auth-fadein {
                    from { opacity:0; transform:translateY(22px); }
                    to   { opacity:1; transform:translateY(0); }
                }

                .auth-orb-a {
                    position: fixed;
                    width: 540px; height: 540px;
                    border-radius: 50%;
                    background: radial-gradient(circle, #93c5fd 0%, #60a5fa 55%, transparent 100%);
                    filter: blur(80px);
                    opacity: 0.42;
                    top: -180px; left: -180px;
                    pointer-events: none;
                    animation: orb-drift-a 13s ease-in-out infinite alternate;
                }
                .auth-orb-b {
                    position: fixed;
                    width: 440px; height: 440px;
                    border-radius: 50%;
                    background: radial-gradient(circle, #bfdbfe 0%, #7dd3fc 55%, transparent 100%);
                    filter: blur(80px);
                    opacity: 0.38;
                    bottom: -150px; right: -150px;
                    pointer-events: none;
                    animation: orb-drift-b 10s ease-in-out infinite alternate;
                    animation-delay: -5s;
                }
                .auth-orb-c {
                    position: fixed;
                    width: 280px; height: 280px;
                    border-radius: 50%;
                    background: radial-gradient(circle, #e0f2fe 0%, #bae6fd 60%, transparent 100%);
                    filter: blur(60px);
                    opacity: 0.5;
                    top: 55%; left: 60%;
                    pointer-events: none;
                    animation: orb-drift-a 16s ease-in-out infinite alternate;
                    animation-delay: -8s;
                }

                .auth-card {
                    background: rgba(255,255,255,0.52);
                    backdrop-filter: blur(24px) saturate(160%);
                    -webkit-backdrop-filter: blur(24px) saturate(160%);
                    border: 1.5px solid rgba(191,219,254,0.7);
                    border-radius: 28px;
                    box-shadow:
                        0 20px 60px rgba(96,165,250,0.14),
                        0 6px 24px rgba(59,130,246,0.1),
                        inset 0 1px 0 rgba(255,255,255,0.75);
                    position: relative;
                    z-index: 1;
                    animation: auth-fadein 0.5s ease both;
                    overflow: hidden;
                }
                .auth-card::before {
                    content: '';
                    position: absolute;
                    top: 0; left: 15%; right: 15%;
                    height: 3px;
                    background: linear-gradient(90deg, transparent, #93c5fd, #3b82f6, #93c5fd, transparent);
                    border-radius: 0 0 4px 4px;
                    opacity: 0.85;
                }

                .auth-logo-wrap {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin-bottom: 24px;
                    position: relative;
                    z-index: 2;
                    text-decoration: none;
                    animation: auth-fadein 0.4s ease both;
                }
                .auth-logo-ring {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: 52px; height: 52px;
                    border-radius: 16px;
                    background: rgba(255,255,255,0.65);
                    border: 1.5px solid rgba(147,197,253,0.55);
                    box-shadow: 0 4px 16px rgba(96,165,250,0.18), inset 0 1px 0 rgba(255,255,255,0.8);
                    backdrop-filter: blur(8px);
                    transition: transform 0.2s, box-shadow 0.2s;
                }
                .auth-logo-wrap:hover .auth-logo-ring {
                    transform: translateY(-2px);
                    box-shadow: 0 8px 24px rgba(96,165,250,0.28), inset 0 1px 0 rgba(255,255,255,0.8);
                }

                .auth-badge {
                    display: inline-flex;
                    align-items: center;
                    gap: 6px;
                    padding: 4px 12px 4px 8px;
                    background: rgba(219,234,254,0.6);
                    border: 1px solid rgba(147,197,253,0.5);
                    border-radius: 999px;
                    font-family: 'Sora', sans-serif;
                    font-size: 10.5px;
                    font-weight: 600;
                    letter-spacing: 0.07em;
                    text-transform: uppercase;
                    color: #3b82f6;
                    margin-bottom: 12px;
                }
                .auth-badge-dot {
                    width: 6px; height: 6px;
                    border-radius: 50%;
                    background: #60a5fa;
                    animation: badge-pulse 2s ease infinite;
                }

                .auth-card-title {
                    font-family: 'Sora', sans-serif !important;
                    font-size: 22px !important;
                    font-weight: 700 !important;
                    color: #1e3a5f !important;
                    letter-spacing: -0.02em !important;
                    line-height: 1.2 !important;
                    margin-bottom: 6px !important;
                }
                .auth-card-desc {
                    font-family: 'DM Sans', sans-serif !important;
                    font-size: 13.5px !important;
                    color: #93c5fd !important;
                    line-height: 1.5 !important;
                }
            `}</style>

            {/* Background orbs */}
            <div className="auth-orb-a" />
            <div className="auth-orb-b" />
            <div className="auth-orb-c" />

            <div style={{ width: '100%', maxWidth: '440px', position: 'relative', zIndex: 1 }}>

                {/* Logo */}
                <Link href={home()} className="auth-logo-wrap">
                    <div className="auth-logo-ring">
                        <AppLogoIcon className="size-7" style={{ fill: '#3b82f6' }} />
                    </div>
                </Link>

                {/* Card */}
                <div className="auth-card">
                    {/* Header */}
                    <div style={{ padding: '32px 36px 0', textAlign: 'center' }}>
                        <div className="auth-badge">
                            <div className="auth-badge-dot" />
                            Secure &amp; Encrypted
                        </div>
                        <h1 className="auth-card-title">{title}</h1>
                        <p className="auth-card-desc">{description}</p>
                    </div>

                    {/* Content */}
                    <div style={{ padding: '28px 36px 36px' }}>
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
}