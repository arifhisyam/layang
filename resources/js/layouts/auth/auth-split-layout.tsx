import { Link, usePage } from '@inertiajs/react';
import AppLogoIcon from '@/components/app-logo-icon';
import { home } from '@/routes';
import type { AuthLayoutProps } from '@/types';

export default function AuthSplitLayout({
    children,
    title,
    description,
}: AuthLayoutProps) {
    const { name } = usePage().props;

    return (
        <div
            style={{
                position: 'relative',
                height: '100dvh',
                display: 'grid',
                gridTemplateColumns: '1fr',
                overflow: 'hidden',
                background: 'linear-gradient(135deg, #dbeafe 0%, #eff6ff 40%, #e0f2fe 70%, #bfdbfe 100%)',
                fontFamily: "'DM Sans', sans-serif",
            }}
        >
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,300&display=swap');

                @keyframes sp-orb-a { from{transform:translate(0,0) scale(1)} to{transform:translate(30px,25px) scale(1.07)} }
                @keyframes sp-orb-b { from{transform:translate(0,0) scale(1)} to{transform:translate(-25px,20px) scale(1.05)} }
                @keyframes sp-float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
                @keyframes sp-pulse { 0%,100%{transform:scale(1);opacity:1} 50%{transform:scale(1.4);opacity:.6} }
                @keyframes sp-fi    { from{opacity:0;transform:translateY(18px)} to{opacity:1;transform:translateY(0)} }
                @keyframes sp-sl    { from{opacity:0;transform:translateX(-18px)} to{opacity:1;transform:translateX(0)} }

                @media(min-width:1024px) {
                    .sp-root { grid-template-columns: 1fr 1fr !important; }
                    .sp-panel { display:flex !important; }
                    .sp-mobile-logo { display:none !important; }
                }

                .sp-panel {
                    display: none;
                    position: relative;
                    flex-direction: column;
                    justify-content: space-between;
                    padding: 40px;
                    overflow: hidden;
                    background: linear-gradient(150deg, #1d4ed8 0%, #2563eb 40%, #3b82f6 75%, #60a5fa 100%);
                    animation: sp-sl .6s ease both;
                }
                .sp-panel::before {
                    content:'';
                    position:absolute; inset:0;
                    background:
                        radial-gradient(ellipse 60% 50% at 20% 30%, rgba(255,255,255,0.1) 0%, transparent 70%),
                        radial-gradient(ellipse 40% 40% at 80% 80%, rgba(147,197,253,0.15) 0%, transparent 70%);
                    pointer-events:none;
                }
                .sp-panel-orb-1 {
                    position:absolute; width:320px; height:320px; border-radius:50%;
                    background:radial-gradient(circle,rgba(255,255,255,0.12) 0%,transparent 70%);
                    top:-80px; right:-80px;
                    animation:sp-orb-a 14s ease-in-out infinite alternate;
                }
                .sp-panel-orb-2 {
                    position:absolute; width:240px; height:240px; border-radius:50%;
                    background:radial-gradient(circle,rgba(147,197,253,0.18) 0%,transparent 70%);
                    bottom:-60px; left:-40px;
                    animation:sp-orb-b 11s ease-in-out infinite alternate;
                }
                .sp-panel-grid {
                    position:absolute; inset:0; opacity:.06;
                    background-image:
                        linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px);
                    background-size: 40px 40px;
                }

                .sp-panel-logo {
                    display:flex; align-items:center; gap:10px;
                    text-decoration:none; position:relative; z-index:2;
                }
                .sp-panel-logo-ring {
                    display:flex; align-items:center; justify-content:center;
                    width:40px; height:40px; border-radius:12px;
                    background:rgba(255,255,255,0.18);
                    border:1.5px solid rgba(255,255,255,0.3);
                    backdrop-filter:blur(6px);
                }
                .sp-panel-logo-name {
                    font-family:'Sora',sans-serif;
                    font-size:16px; font-weight:600;
                    color:rgba(255,255,255,0.95);
                    letter-spacing:-0.01em;
                }

                .sp-panel-body {
                    position:relative; z-index:2;
                    display:flex; flex-direction:column; gap:20px;
                }
                .sp-panel-headline {
                    font-family:'Sora',sans-serif;
                    font-size:34px; font-weight:700; line-height:1.15;
                    letter-spacing:-0.03em;
                    color:#fff;
                }
                .sp-panel-headline em {
                    font-style:normal;
                    color:rgba(191,219,254,0.9);
                }
                .sp-panel-sub {
                    font-family:'DM Sans',sans-serif;
                    font-size:14px; line-height:1.6;
                    color:rgba(191,219,254,0.75);
                    max-width:280px;
                }
                .sp-panel-dots {
                    display:flex; gap:8px; margin-top:8px;
                }
                .sp-panel-dot {
                    width:8px; height:8px; border-radius:50%;
                    background:rgba(255,255,255,0.3);
                }
                .sp-panel-dot.on {
                    background:rgba(255,255,255,0.85);
                    width:24px; border-radius:4px;
                }

                .sp-panel-quote {
                    position:relative; z-index:2;
                }
                .sp-panel-quote-text {
                    font-family:'DM Sans',sans-serif;
                    font-size:13px; font-style:italic; line-height:1.6;
                    color:rgba(191,219,254,0.7);
                    margin-bottom:8px;
                }
                .sp-panel-quote-author {
                    font-family:'Sora',sans-serif;
                    font-size:12px; font-weight:600;
                    color:rgba(255,255,255,0.5);
                    letter-spacing:.04em; text-transform:uppercase;
                }

                /* ── RIGHT SIDE ── */
                .sp-right {
                    display:flex; align-items:center; justify-content:center;
                    padding:32px 24px;
                    position:relative; overflow:hidden;
                }
                .sp-right-orb-a {
                    position:absolute; width:400px; height:400px; border-radius:50%;
                    background:radial-gradient(circle,#93c5fd 0%,#60a5fa 50%,transparent 100%);
                    filter:blur(80px); opacity:.35;
                    top:-120px; right:-120px; pointer-events:none;
                    animation:sp-orb-a 13s ease-in-out infinite alternate;
                }
                .sp-right-orb-b {
                    position:absolute; width:300px; height:300px; border-radius:50%;
                    background:radial-gradient(circle,#bfdbfe 0%,#7dd3fc 55%,transparent 100%);
                    filter:blur(70px); opacity:.35;
                    bottom:-80px; left:-80px; pointer-events:none;
                    animation:sp-orb-b 10s ease-in-out infinite alternate;
                    animation-delay:-4s;
                }

                .sp-form-wrap {
                    width:100%; max-width:360px;
                    display:flex; flex-direction:column; gap:24px;
                    position:relative; z-index:1;
                    animation:sp-fi .55s ease both; animation-delay:.1s;
                }

                .sp-mobile-logo {
                    display:flex; align-items:center; justify-content:center;
                }
                .sp-mobile-logo-ring {
                    display:flex; align-items:center; justify-content:center;
                    width:52px; height:52px; border-radius:16px;
                    background:rgba(255,255,255,0.65);
                    border:1.5px solid rgba(147,197,253,0.55);
                    box-shadow:0 4px 16px rgba(96,165,250,0.18),inset 0 1px 0 rgba(255,255,255,0.8);
                    backdrop-filter:blur(8px);
                }

                .sp-badge {
                    display:inline-flex; align-items:center; gap:6px;
                    padding:4px 12px 4px 8px;
                    background:rgba(219,234,254,0.6);
                    border:1px solid rgba(147,197,253,0.5);
                    border-radius:999px;
                    font-family:'Sora',sans-serif;
                    font-size:10.5px; font-weight:600; letter-spacing:.07em; text-transform:uppercase;
                    color:#3b82f6;
                }
                .sp-badge-dot {
                    width:6px; height:6px; border-radius:50%; background:#60a5fa;
                    animation:sp-pulse 2s ease infinite;
                }

                .sp-title {
                    font-family:'Sora',sans-serif !important;
                    font-size:22px !important; font-weight:700 !important;
                    color:#1e3a5f !important; letter-spacing:-0.02em !important;
                    line-height:1.2 !important; margin-bottom:5px !important;
                }
                .sp-desc {
                    font-family:'DM Sans',sans-serif !important;
                    font-size:13.5px !important; color:#93c5fd !important;
                    line-height:1.5 !important;
                }

                .sp-card {
                    background:rgba(255,255,255,0.52);
                    backdrop-filter:blur(24px) saturate(160%);
                    -webkit-backdrop-filter:blur(24px) saturate(160%);
                    border:1.5px solid rgba(191,219,254,0.7);
                    border-radius:28px;
                    padding:28px 28px 32px;
                    box-shadow:
                        0 20px 60px rgba(96,165,250,0.14),
                        0 6px 24px rgba(59,130,246,0.1),
                        inset 0 1px 0 rgba(255,255,255,0.75);
                    position:relative;
                }
                .sp-card::before {
                    content:''; position:absolute;
                    top:0; left:15%; right:15%; height:3px;
                    background:linear-gradient(90deg,transparent,#93c5fd,#3b82f6,#93c5fd,transparent);
                    border-radius:0 0 4px 4px; opacity:.85;
                }
            `}</style>

            {/* Left decorative panel */}
            <div className="sp-panel sp-root" style={{ gridColumn:'1', gridRow:'1' }}>
                <div className="sp-panel-orb-1" />
                <div className="sp-panel-orb-2" />
                <div className="sp-panel-grid" />

                <Link href={home()} className="sp-panel-logo">
                    <div className="sp-panel-logo-ring">
                        <AppLogoIcon className="size-5" style={{ fill: 'white' }} />
                    </div>
                    <span className="sp-panel-logo-name">{name as string}</span>
                </Link>

                <div className="sp-panel-body">
                    <h2 className="sp-panel-headline">
                        Your workspace,<br />
                        <em>reimagined.</em>
                    </h2>
                    <p className="sp-panel-sub">
                        Sign in to access your dashboard, manage your projects, and collaborate with your team.
                    </p>
                    <div className="sp-panel-dots">
                        <div className="sp-panel-dot on" />
                        <div className="sp-panel-dot" />
                        <div className="sp-panel-dot" />
                    </div>
                </div>

                <div className="sp-panel-quote">
                    <p className="sp-panel-quote-text">"The best tools get out of the way and let you do great work."</p>
                    <span className="sp-panel-quote-author">— Design Principle</span>
                </div>
            </div>

            {/* Right form panel */}
            <div className="sp-right" style={{ gridColumn:'1', gridRow:'1' }}>
                <div className="sp-right-orb-a" />
                <div className="sp-right-orb-b" />

                <div className="sp-form-wrap">

                    {/* Mobile-only logo */}
                    <div className="sp-mobile-logo">
                        <Link href={home()} style={{ textDecoration:'none' }}>
                            <div className="sp-mobile-logo-ring">
                                <AppLogoIcon className="size-7" style={{ fill: '#3b82f6' }} />
                            </div>
                        </Link>
                    </div>

                    {/* Heading */}
                    <div>
                        <div className="sp-badge" style={{ marginBottom:'12px' }}>
                            <div className="sp-badge-dot" />
                            Secure &amp; Encrypted
                        </div>
                        <h1 className="sp-title">{title}</h1>
                        <p className="sp-desc">{description}</p>
                    </div>

                    {/* Form card */}
                    <div className="sp-card">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
}