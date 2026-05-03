import { Link } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';
import { home } from '@/routes';
import type { AuthLayoutProps } from '@/types';

function CloudCanvas() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d')!;
        let W = window.innerWidth, H = window.innerHeight;
        canvas.width = W; canvas.height = H;

        const bubbles = Array.from({ length: 22 }, () => ({
            x: Math.random() * W,
            y: Math.random() * H,
            r: 35 + Math.random() * 110,
            opacity: 0.05 + Math.random() * 0.1,
            dx: (Math.random() - 0.5) * 0.22,
            dy: (Math.random() - 0.5) * 0.12,
            color: Math.random() > 0.5 ? '135,206,235' : '174,214,241',
        }));

        // Twinkling stars / light dots
        const dots = Array.from({ length: 40 }, () => ({
            x: Math.random() * W, y: Math.random() * H,
            r: Math.random() > 0.7 ? 1.2 : 0.6,
            baseOp: 0.08 + Math.random() * 0.25,
            opacity: 0,
            phase: Math.random() * Math.PI * 2,
            speed: 0.008 + Math.random() * 0.014,
            ox: 0, oy: 0, tx: 0, ty: 0,
            depth: 0.2 + Math.random() * 0.8,
        }));

        let rawX = 0, rawY = 0;
        const onMouse = (e: MouseEvent) => {
            rawX = (e.clientX / W - 0.5) * 2;
            rawY = (e.clientY / H - 0.5) * 2;
        };
        window.addEventListener('mousemove', onMouse, { passive: true });

        const onResize = () => {
            W = window.innerWidth; H = window.innerHeight;
            canvas.width = W; canvas.height = H;
        };
        window.addEventListener('resize', onResize, { passive: true });

        let frame = 0; let raf: number;
        const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

        const draw = () => {
            raf = requestAnimationFrame(draw); frame++;
            ctx.clearRect(0, 0, W, H);

            // Floating bubbles
            for (const b of bubbles) {
                b.x += b.dx; b.y += b.dy;
                if (b.x < -b.r) b.x = W + b.r;
                if (b.x > W + b.r) b.x = -b.r;
                if (b.y < -b.r) b.y = H + b.r;
                if (b.y > H + b.r) b.y = -b.r;
                const g = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, b.r);
                g.addColorStop(0, `rgba(${b.color},${b.opacity})`);
                g.addColorStop(1, `rgba(${b.color},0)`);
                ctx.beginPath(); ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
                ctx.fillStyle = g; ctx.fill();
            }

            // Twinkling dots with parallax
            for (const s of dots) {
                s.tx = rawX * 18 * s.depth; s.ty = rawY * 10 * s.depth;
                s.ox = lerp(s.ox, s.tx, 0.04); s.oy = lerp(s.oy, s.ty, 0.04);
                s.opacity = s.baseOp * (0.4 + 0.6 * (0.5 + 0.5 * Math.sin(frame * s.speed + s.phase)));
                const x = s.x + s.ox, y = s.y + s.oy;
                ctx.beginPath(); ctx.arc(x, y, s.r, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(46,134,171,${s.opacity})`;
                ctx.fill();
            }
        };
        draw();
        return () => {
            cancelAnimationFrame(raf);
            window.removeEventListener('mousemove', onMouse);
            window.removeEventListener('resize', onResize);
        };
    }, []);
    return <canvas ref={canvasRef} style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none', display: 'block' }} />;
}

export default function AuthSimpleLayout({ children, title, description }: AuthLayoutProps) {
    const [mounted, setMounted] = useState(false);
    useEffect(() => { const t = setTimeout(() => setMounted(true), 60); return () => clearTimeout(t); }, []);

    return (
        <div style={{
            minHeight: '100svh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '40px 24px',
            position: 'relative',
            overflow: 'hidden',
            background: 'linear-gradient(160deg, #F0F8FF 0%, #E4F2FC 25%, #EAF5FF 55%, #DDEEF9 100%)',
            fontFamily: "'DM Sans', sans-serif",
        }}>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,600;0,700;1,600;1,700&family=DM+Sans:wght@300;400;500;600&display=swap');

                *, *::before, *::after { box-sizing: border-box; }

                @keyframes al-orb    { 0%{transform:translate(0,0) scale(1)} 33%{transform:translate(30px,-20px) scale(1.08)} 66%{transform:translate(-15px,30px) scale(.94)} 100%{transform:translate(0,0) scale(1)} }
                @keyframes al-in     { from{opacity:0;transform:translateY(28px)} to{opacity:1;transform:translateY(0)} }
                @keyframes al-kite   { 0%,100%{transform:translateY(0) rotate(-6deg)} 50%{transform:translateY(-12px) rotate(6deg)} }
                @keyframes al-ring   { 0%{transform:translate(-50%,-50%) scale(1);opacity:.35} 100%{transform:translate(-50%,-50%) scale(1.38);opacity:0} }
                @keyframes al-pulse  { 0%,100%{transform:scale(1);opacity:1} 50%{transform:scale(1.5);opacity:.5} }
                @keyframes al-shimmer{ 0%{background-position:0% 50%} 50%{background-position:100% 50%} 100%{background-position:0% 50%} }

                .al-card {
                    background: rgba(255,255,255,0.72);
                    backdrop-filter: blur(28px) saturate(160%);
                    -webkit-backdrop-filter: blur(28px) saturate(160%);
                    border: 1.5px solid rgba(135,206,235,0.55);
                    border-radius: 28px;
                    padding: 36px 36px 40px;
                    box-shadow:
                        0 0 0 1px rgba(135,206,235,0.12),
                        0 24px 64px rgba(135,206,235,0.22),
                        0 8px 28px rgba(46,134,171,0.12),
                        inset 0 1px 0 rgba(255,255,255,0.9);
                    position: relative;
                    animation: al-in .6s cubic-bezier(.22,1,.36,1) .1s both;
                }
                .al-card::before {
                    content: '';
                    position: absolute;
                    top: 0; left: 12%; right: 12%; height: 2.5px;
                    background: linear-gradient(90deg, transparent, #5BA3C9, #87CEEB, #AED6F1, #87CEEB, transparent);
                    border-radius: 0 0 4px 4px;
                    opacity: .9;
                }
                .al-card::after {
                    content: '';
                    position: absolute;
                    inset: 0; border-radius: 28px;
                    background: radial-gradient(ellipse 80% 50% at 50% 0%, rgba(135,206,235,0.1) 0%, transparent 60%);
                    pointer-events: none;
                }

                .al-logo-link {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 0;
                    text-decoration: none;
                    animation: al-in .4s ease both;
                }
                .al-logo-wrap {
                    position: relative;
                    display: flex; align-items: center; justify-content: center;
                    width: 68px; height: 68px;
                    margin-bottom: 20px;
                }
                .al-logo-ring-expand {
                    position: absolute; top: 50%; left: 50%;
                    width: 80px; height: 80px; border-radius: 50%;
                    border: 1px solid rgba(135,206,235,0.45);
                    animation: al-ring 3.5s ease-out infinite;
                    pointer-events: none;
                }
                .al-logo-ring-expand:nth-child(2) { animation-delay: 1.75s; }
                .al-logo-circle {
                    width: 68px; height: 68px; border-radius: 50%;
                    background: linear-gradient(135deg, rgba(255,255,255,.95) 0%, rgba(174,214,241,.6) 50%, rgba(135,206,235,.4) 100%);
                    border: 1.5px solid rgba(135,206,235,.55);
                    display: flex; align-items: center; justify-content: center;
                    box-shadow: 0 0 40px rgba(135,206,235,.35), inset 0 0 20px rgba(255,255,255,.8);
                    position: relative; z-index: 1;
                    transition: transform .25s, box-shadow .25s;
                }
                .al-logo-link:hover .al-logo-circle {
                    transform: translateY(-3px);
                    box-shadow: 0 0 60px rgba(135,206,235,.5), inset 0 0 20px rgba(255,255,255,.9);
                }
                .al-kite-icon {
                    font-size: 28px;
                    animation: al-kite 4s ease-in-out infinite;
                    filter: drop-shadow(0 4px 12px rgba(46,134,171,.3));
                }

                .al-badge {
                    display: inline-flex; align-items: center; gap: 7px;
                    padding: 5px 14px 5px 10px;
                    background: rgba(135,206,235,.2);
                    border: 1px solid rgba(135,206,235,.55);
                    border-radius: 999px;
                    font-family: 'DM Sans', sans-serif;
                    font-size: 10.5px; font-weight: 600;
                    letter-spacing: .1em; text-transform: uppercase;
                    color: #2E86AB;
                    margin-bottom: 12px;
                }
                .al-badge-dot {
                    width: 6px; height: 6px; border-radius: 50%;
                    background: #5BA3C9;
                    box-shadow: 0 0 8px rgba(91,163,201,.7);
                    animation: al-pulse 2s ease infinite;
                }

                .al-title {
                    font-family: 'Cormorant Garamond', serif !important;
                    font-size: 26px !important;
                    font-weight: 700 !important;
                    color: #1A5F7A !important;
                    letter-spacing: .01em !important;
                    line-height: 1.15 !important;
                    margin-bottom: 6px !important;
                    text-align: center !important;
                    background: linear-gradient(135deg, #1A5F7A 0%, #2E86AB 45%, #5BA3C9 75%, #87CEEB 100%);
                    background-size: 200%;
                    -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
                    animation: al-shimmer 6s ease infinite;
                }
                .al-desc {
                    font-family: 'DM Sans', sans-serif !important;
                    font-size: 13.5px !important;
                    color: rgba(90,143,168,.65) !important;
                    text-align: center !important;
                    line-height: 1.6 !important;
                    font-weight: 300 !important;
                }

                /* Override form inputs for light theme */
                .al-card input {
                    background: rgba(255,255,255,0.8) !important;
                    border: 1.5px solid rgba(135,206,235,0.5) !important;
                    border-radius: 14px !important;
                    color: #1A5F7A !important;
                    box-shadow: inset 0 1px 3px rgba(135,206,235,0.1) !important;
                }
                .al-card input::placeholder {
                    color: rgba(91,163,201,0.4) !important;
                }
                .al-card input:hover {
                    border-color: rgba(91,163,201,0.65) !important;
                    background: rgba(255,255,255,0.95) !important;
                }
                .al-card input:focus {
                    border-color: #5BA3C9 !important;
                    background: rgba(255,255,255,1) !important;
                    box-shadow: 0 0 0 4px rgba(135,206,235,0.22), inset 0 1px 3px rgba(135,206,235,0.08) !important;
                }

                .lf-label, .rf-label { color: #2E86AB !important; }
                .lf-link-sm { color: rgba(90,143,168,.7) !important; }
                .lf-link-sm:hover { color: #2E86AB !important; }
                .lf-remember-label { color: rgba(46,134,171,.75) !important; }
                .lf-footer, .rf-footer { color: rgba(90,143,168,.7) !important; }
                .lf-footer a, .rf-footer a { color: #2E86AB !important; }
                .lf-footer a::after, .rf-footer a::after { background: #5BA3C9 !important; }
                .lf-footer a:hover, .rf-footer a:hover { color: #5BA3C9 !important; }
                .rf-hint { color: rgba(91,163,201,.6) !important; }
                .lf-error, .rf-error { color: #e05c5c !important; }
                .lf-sep::before, .lf-sep::after { background: linear-gradient(90deg, transparent, rgba(135,206,235,0.55), transparent) !important; }
                .lf-sep span { color: rgba(91,163,201,.6) !important; }
                .lf-status { background: rgba(135,206,235,.18) !important; border: 1px solid rgba(135,206,235,.5) !important; color: #2E86AB !important; }
                .lf-checkbox { border-color: rgba(135,206,235,.6) !important; background: rgba(255,255,255,.8) !important; }
                .al-card [data-slot="password-input"] {
                    background: rgba(255,255,255,0.8) !important;
                    border: 1.5px solid rgba(135,206,235,0.5) !important;
                    border-radius: 14px !important;
                    color: #1A5F7A !important;
                }

                @media (max-width: 480px) {
                    .al-card { padding: 28px 22px 32px !important; }
                }
            `}</style>

            {/* ── Ambient background orbs ── */}
            <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none', overflow: 'hidden' }}>
                {[
                    { w: 600, h: 600, top: '-200px', left: '-180px', c: 'radial-gradient(circle, rgba(135,206,235,.28) 0%, transparent 60%)', dur: '22s' },
                    { w: 480, h: 480, bottom: '-120px', right: '-130px', c: 'radial-gradient(circle, rgba(174,214,241,.22) 0%, transparent 60%)', dur: '28s' },
                    { w: 360, h: 360, top: '45%', left: '55%', c: 'radial-gradient(circle, rgba(189,224,254,.2) 0%, transparent 60%)', dur: '18s' },
                ].map((b, i) => (
                    <div key={i} style={{
                        position: 'absolute', width: b.w, height: b.h, borderRadius: '50%',
                        top: (b as any).top, left: (b as any).left, right: (b as any).right, bottom: (b as any).bottom,
                        background: b.c,
                        animation: `al-orb ${b.dur} ease-in-out infinite`,
                        animationDelay: `${i * -6}s`,
                    }} />
                ))}
            </div>

            <CloudCanvas />

            {/* Light dot grid */}
            <div style={{
                position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none',
                backgroundImage: 'radial-gradient(rgba(135,206,235,0.32) 1px, transparent 1px)',
                backgroundSize: '36px 36px',
            }} />

            {/* ── Content ── */}
            <div style={{ width: '100%', maxWidth: '400px', position: 'relative', zIndex: 1 }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'center' }}>

                    {/* Logo */}
                    <Link href={home()} className="al-logo-link">
                        <div className="al-logo-wrap">
                            <div className="al-logo-ring-expand" />
                            <div className="al-logo-ring-expand" />
                            <div className="al-logo-circle">
                                <span className="al-kite-icon">🪁</span>
                            </div>
                        </div>
                    </Link>

                    {/* Brand name */}
                    <div style={{
                        fontFamily: "'Cormorant Garamond', serif",
                        fontWeight: 700, fontSize: 13,
                        color: 'rgba(46,134,171,.7)',
                        letterSpacing: '.14em', textTransform: 'uppercase',
                        marginTop: -14, marginBottom: 6,
                        animation: 'al-in .5s ease .15s both',
                    }}>
                        Layang-Layang Event · 2025
                    </div>

                    {/* Heading block */}
                    <div style={{ textAlign: 'center', marginBottom: 8, animation: 'al-in .55s ease .2s both' }}>
                        <div className="al-badge">
                            <div className="al-badge-dot" />
                            Aman &amp; Terenkripsi
                        </div>
                        <h1 className="al-title">{title}</h1>
                        <p className="al-desc">{description}</p>
                    </div>

                    {/* Form card */}
                    <div className="al-card" style={{ width: '100%' }}>
                        {children}
                    </div>

                    {/* Footer */}
                    <p style={{
                        fontSize: 12, color: 'rgba(91,163,201,.45)',
                        fontFamily: "'DM Sans', sans-serif",
                        letterSpacing: '.04em', marginTop: 8,
                        animation: 'al-in .5s ease .35s both',
                    }}>
                        © 2025 Layang-Layang Event
                    </p>
                </div>
            </div>
        </div>
    );
}