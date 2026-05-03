import { Head, Link } from '@inertiajs/react';
import { login, register, dashboard } from '@/routes';
import { useEffect, useRef, useState, CSSProperties } from 'react';

interface AuthUser { name: string; email: string; }

interface GalleryDesign {
    id: number;
    judul: string;
    deskripsi: string | null;
    file_path: string;
    user: { name: string };
    avg_score: number;
    total_scores: number;
}

interface Props {
    auth: { user: AuthUser | null };
    canRegister?: boolean;
    galleryDesigns?: GalleryDesign[];
}

function useReveal(threshold = 0.12) {
    const ref = useRef<HTMLDivElement>(null);
    const [visible, setVisible] = useState(false);
    useEffect(() => {
        const el = ref.current; if (!el) return;
        const obs = new IntersectionObserver(([e]) => {
            if (e.isIntersecting) { setVisible(true); obs.disconnect(); }
        }, { threshold });
        obs.observe(el); return () => obs.disconnect();
    }, []);
    return { ref, visible };
}

function Counter({ to, suffix = '' }: { to: number; suffix?: string }) {
    const [val, setVal] = useState(0);
    const { ref, visible } = useReveal();
    useEffect(() => {
        if (!visible) return;
        let cur = 0; const step = Math.ceil(to / 55);
        const id = setInterval(() => {
            cur += step;
            if (cur >= to) { setVal(to); clearInterval(id); } else setVal(cur);
        }, 18);
        return () => clearInterval(id);
    }, [visible, to]);
    return <span ref={ref}>{val.toLocaleString()}{suffix}</span>;
}

// ─── ANIMATED SKY CANVAS ───────────────────────────────────
function SkyCanvas() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    useEffect(() => {
        const canvas = canvasRef.current; if (!canvas) return;
        const ctx = canvas.getContext('2d')!;
        let W = canvas.offsetWidth, H = canvas.offsetHeight;
        canvas.width = W * devicePixelRatio; canvas.height = H * devicePixelRatio;
        ctx.scale(devicePixelRatio, devicePixelRatio);
        const clouds = Array.from({ length: 12 }, () => ({
            x: Math.random() * W, y: 60 + Math.random() * (H * 0.6),
            w: 120 + Math.random() * 200, h: 30 + Math.random() * 50,
            opacity: 0.08 + Math.random() * 0.14, speed: 0.12 + Math.random() * 0.2,
        }));
        const kites = Array.from({ length: 6 }, () => ({
            x: Math.random() * W, y: Math.random() * H * 0.7,
            phase: Math.random() * Math.PI * 2, speed: 0.008 + Math.random() * 0.006,
            size: 4 + Math.random() * 6, opacity: 0.12 + Math.random() * 0.18,
        }));
        let raf: number, t = 0;
        const draw = () => {
            raf = requestAnimationFrame(draw);
            ctx.clearRect(0, 0, W, H); t += 0.01;
            for (const c of clouds) {
                c.x += c.speed;
                if (c.x - c.w > W) c.x = -c.w;
                const g = ctx.createRadialGradient(c.x, c.y, 0, c.x, c.y, c.w * 0.6);
                g.addColorStop(0, `rgba(255,255,255,${c.opacity})`);
                g.addColorStop(1, 'rgba(255,255,255,0)');
                ctx.beginPath();
                ctx.ellipse(c.x, c.y, c.w * 0.6, c.h * 0.5, 0, 0, Math.PI * 2);
                ctx.fillStyle = g; ctx.fill();
            }
            for (const k of kites) {
                const y = k.y + Math.sin(t * k.speed * 60 + k.phase) * 18;
                const x = k.x + Math.cos(t * k.speed * 40 + k.phase) * 12;
                ctx.beginPath(); ctx.arc(x, y, k.size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(14,165,233,${k.opacity})`; ctx.fill();
                ctx.beginPath(); ctx.moveTo(x, y + k.size);
                for (let i = 1; i <= 6; i++) ctx.lineTo(x + Math.sin(i * 0.8 + t * 2) * 4, y + k.size + i * 8);
                ctx.strokeStyle = `rgba(14,165,233,${k.opacity * 0.4})`; ctx.lineWidth = 1.5; ctx.stroke();
            }
        };
        draw();
        const onResize = () => {
            W = canvas.offsetWidth; H = canvas.offsetHeight;
            canvas.width = W * devicePixelRatio; canvas.height = H * devicePixelRatio;
            ctx.scale(devicePixelRatio, devicePixelRatio);
        };
        window.addEventListener('resize', onResize, { passive: true });
        return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', onResize); };
    }, []);
    return <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 0 }} />;
}

// ─── STEP CARD ─────────────────────────────────────────────
function StepCard({ num, icon, title, desc, delay }: {
    num: string; icon: string; title: string; desc: string; delay: number;
}) {
    const { ref, visible } = useReveal();
    const [hov, setHov] = useState(false);
    return (
        <div
            ref={ref}
            onMouseEnter={() => setHov(true)}
            onMouseLeave={() => setHov(false)}
            style={{
                opacity: visible ? 1 : 0,
                transform: visible
                    ? hov ? 'translateY(-12px) scale(1.02)' : 'translateY(0) scale(1)'
                    : 'translateY(60px)',
                transition: `opacity .7s ${delay}ms ease, transform .6s ${delay}ms cubic-bezier(.34,1.4,.64,1), box-shadow .35s ease`,
                background: hov ? 'rgba(255,255,255,0.96)' : 'rgba(255,255,255,0.68)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                border: `1.5px solid ${hov ? 'rgba(14,165,233,0.45)' : 'rgba(255,255,255,0.85)'}`,
                borderRadius: 24,
                padding: 'clamp(22px, 4vw, 44px) clamp(18px, 4vw, 36px)',
                boxShadow: hov
                    ? '0 28px 64px rgba(11,31,58,0.16), 0 0 0 1px rgba(14,165,233,0.18)'
                    : '0 6px 24px rgba(11,31,58,0.07)',
                position: 'relative', overflow: 'hidden', cursor: 'default',
            }}
        >
            <span style={{
                position: 'absolute', bottom: -16, right: 14,
                fontFamily: "'Montserrat', sans-serif", fontWeight: 800,
                fontSize: 'clamp(60px, 10vw, 108px)',
                color: 'rgba(14,165,233,0.065)',
                lineHeight: 1, userSelect: 'none', letterSpacing: '-3px',
            }}>{num}</span>

            <div style={{
                position: 'absolute', top: 0, left: 0, right: 0, height: 3,
                background: 'linear-gradient(90deg, #0EA5E9, #1565C0)',
                opacity: hov ? 1 : 0.3,
                transition: 'opacity .35s ease',
                borderRadius: '24px 24px 0 0',
            }} />

            <div style={{
                width: 52, height: 52, borderRadius: 16,
                background: hov
                    ? 'linear-gradient(135deg, #0EA5E9, #1565C0)'
                    : 'linear-gradient(135deg, rgba(14,165,233,0.13), rgba(21,101,192,0.08))',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginBottom: 18,
                boxShadow: hov ? '0 10px 28px rgba(14,165,233,0.36)' : 'none',
                transition: 'all .4s cubic-bezier(.34,1.56,.64,1)',
                transform: hov ? 'scale(1.12) rotate(-8deg)' : 'scale(1)',
            }}>
                <i className={`ti ${icon}`} style={{
                    fontSize: 24,
                    color: hov ? '#fff' : '#0EA5E9',
                    transition: 'color .4s ease',
                }} />
            </div>

            <div style={{
                display: 'inline-block',
                background: 'rgba(14,165,233,0.09)',
                border: '1px solid rgba(14,165,233,0.2)',
                borderRadius: 6, padding: '3px 11px',
                fontSize: 10, fontWeight: 700, color: '#0284C7',
                letterSpacing: '.16em', marginBottom: 12,
                fontFamily: "'Montserrat', sans-serif",
                textTransform: 'uppercase',
            }}>LANGKAH {num}</div>

            <h3 style={{
                fontFamily: "'Montserrat', sans-serif",
                fontWeight: 700,
                fontSize: 'clamp(16px, 2.2vw, 21px)',
                color: '#0B1F3A', marginBottom: 10, lineHeight: 1.25,
            }}>{title}</h3>

            <p style={{
                fontSize: 'clamp(13px, 1.4vw, 14.5px)',
                color: '#2C4A6A',
                lineHeight: 1.82,
                fontFamily: "'Open Sans', sans-serif",
                fontWeight: 400,
            }}>{desc}</p>
        </div>
    );
}

// ─── CRITERIA CARD ─────────────────────────────────────────
function CritCard({ icon, label, desc, delay, color }: {
    icon: string; label: string; desc: string; delay: number; color: string;
}) {
    const { ref, visible } = useReveal();
    const [hov, setHov] = useState(false);
    return (
        <div
            ref={ref}
            onMouseEnter={() => setHov(true)}
            onMouseLeave={() => setHov(false)}
            style={{
                opacity: visible ? 1 : 0,
                transform: visible
                    ? hov ? 'translateY(-14px) scale(1.025)' : 'translateY(0) scale(1)'
                    : 'scale(0.9) translateY(28px)',
                transition: `opacity .6s ${delay}ms ease, transform .55s ${delay}ms cubic-bezier(.34,1.4,.64,1), box-shadow .35s ease`,
                background: hov ? 'rgba(255,255,255,0.97)' : 'rgba(255,255,255,0.64)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                border: `1.5px solid ${hov ? color + '44' : 'rgba(255,255,255,0.86)'}`,
                borderRadius: 22,
                padding: 'clamp(20px, 3vw, 36px) clamp(16px, 2.5vw, 28px)',
                textAlign: 'center',
                boxShadow: hov
                    ? `0 24px 56px rgba(11,31,58,0.14), 0 0 0 1px ${color}22`
                    : '0 4px 18px rgba(11,31,58,0.06)',
                cursor: 'default',
            }}
        >
            <div style={{
                width: 58, height: 58, borderRadius: '50%',
                background: hov ? color + '1C' : color + '0F',
                border: `2px solid ${color}${hov ? '38' : '18'}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 16px',
                transform: hov ? 'scale(1.16) rotate(-7deg)' : 'scale(1)',
                transition: 'all .4s cubic-bezier(.34,1.56,.64,1)',
            }}>
                <i className={`ti ${icon}`} style={{
                    fontSize: 26,
                    color: color,
                    transition: 'color .3s ease',
                }} />
            </div>

            <h3 style={{
                fontFamily: "'Montserrat', sans-serif",
                fontWeight: 700,
                fontSize: 'clamp(14px, 1.9vw, 18px)',
                color: '#0B1F3A', marginBottom: 8,
            }}>{label}</h3>

            <div style={{
                width: hov ? 40 : 26, height: 3, background: color,
                borderRadius: 2, margin: '0 auto 13px',
                opacity: hov ? 1 : 0.42,
                transition: 'all .35s ease',
            }} />

            <p style={{
                fontSize: 'clamp(12px, 1.3vw, 13.5px)',
                color: '#2C4A6A',
                lineHeight: 1.82,
                fontFamily: "'Open Sans', sans-serif",
                fontWeight: 400,
            }}>{desc}</p>
        </div>
    );
}

// ─── GALLERY CARD ──────────────────────────────────────────
function GalleryCard({
    design,
    index,
    style = {},
}: {
    design: GalleryDesign;
    index: number;
    style?: React.CSSProperties;
}) {
    const ref = useRef<HTMLDivElement>(null);
    const [visible, setVisible] = useState(false);
    const [hov, setHov] = useState(false);

    useEffect(() => {
        const el = ref.current; if (!el) return;
        const obs = new IntersectionObserver(
            ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
            { threshold: 0.04 }
        );
        obs.observe(el);
        return () => obs.disconnect();
    }, []);

    return (
        <div
            ref={ref}
            onMouseEnter={() => setHov(true)}
            onMouseLeave={() => setHov(false)}
            style={{
                position: 'relative',
                overflow: 'hidden',
                borderRadius: 0,
                cursor: 'default',
                opacity: visible ? 1 : 0,
                transform: visible ? 'scale(1)' : 'scale(0.97)',
                transition: `opacity .55s ${index * 70}ms cubic-bezier(.22,1,.36,1), transform .5s ${index * 70}ms cubic-bezier(.22,1,.36,1)`,
                ...style,
            }}
        >
            <img
                src={`/storage/${design.file_path}`}
                alt={design.judul}
                style={{
                    position: 'absolute', inset: 0,
                    width: '100%', height: '100%',
                    objectFit: 'cover',
                    display: 'block',
                    transform: hov ? 'scale(1.07)' : 'scale(1)',
                    transition: 'transform .65s cubic-bezier(.34,1.1,.64,1)',
                }}
            />
            <div style={{
                position: 'absolute', inset: 0,
                background: 'linear-gradient(to top, rgba(8,24,80,0.75) 0%, rgba(8,24,80,0.08) 50%, transparent 100%)',
                opacity: hov ? 1 : 0,
                transition: 'opacity .3s ease',
                display: 'flex', alignItems: 'flex-end',
                padding: '12px 11px',
                pointerEvents: 'none',
            }}>
                <div style={{
                    transform: hov ? 'translateY(0)' : 'translateY(7px)',
                    transition: 'transform .3s ease',
                }}>
                    <p style={{
                        fontFamily: "'Montserrat', sans-serif",
                        fontWeight: 700, fontSize: 12,
                        color: '#fff', marginBottom: 3, lineHeight: 1.3,
                    }}>{design.judul}</p>
                    <p style={{
                        fontSize: 10, color: 'rgba(186,230,253,0.85)',
                        fontFamily: "'Open Sans', sans-serif",
                        display: 'flex', alignItems: 'center', gap: 3,
                    }}>
                        <i className="ti ti-user" style={{ fontSize: 9 }} />
                        {design.user.name}
                    </p>
                </div>
            </div>
        </div>
    );
}

// ─── 7-PHOTO MASONRY GALLERY ───────────────────────────────
function MasonryGallery({ designs }: { designs: GalleryDesign[] }) {
    const { ref, visible } = useReveal(0.04);

    if (designs.length === 0) {
        return (
            <div ref={ref} style={{
                textAlign: 'center',
                padding: 'clamp(48px, 10vw, 96px) 24px',
                opacity: visible ? 1 : 0,
                transform: visible ? 'translateY(0)' : 'translateY(28px)',
                transition: 'opacity .75s ease, transform .75s ease',
            }}>
                <div style={{
                    width: 96, height: 96, borderRadius: '50%',
                    background: 'rgba(14,165,233,0.08)',
                    border: '2px dashed rgba(14,165,233,0.28)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    margin: '0 auto 20px',
                }}>
                    <i className="ti ti-photo-off" style={{ fontSize: 36, color: 'rgba(14,165,233,0.38)' }} />
                </div>
                <h3 style={{
                    fontFamily: "'Montserrat', sans-serif",
                    fontWeight: 700, fontSize: 18,
                    color: '#0B1F3A', marginBottom: 10,
                }}>Belum Ada Karya</h3>
                <p style={{
                    fontSize: 14, color: '#4A7A9B',
                    fontFamily: "'Open Sans', sans-serif",
                    maxWidth: 320, margin: '0 auto', lineHeight: 1.8,
                }}>
                    Jadilah yang pertama upload desain layang-layangmu dan tampil di sini!
                </p>
            </div>
        );
    }

    const slots = designs.slice(0, 7);
    const get = (i: number) => slots[i] ?? null;
    const GAP = 4;
    const GRID_H = 'clamp(320px, 55vw, 560px)';
    const COL = ['40%', '30%', '30%'];

    return (
        <div
            ref={ref}
            style={{
                opacity: visible ? 1 : 0,
                transition: 'opacity .5s ease',
                display: 'flex',
                gap: GAP,
                height: GRID_H,
            }}
        >
            <div style={{ width: COL[0], flexShrink: 0, display: 'flex', flexDirection: 'column', gap: GAP }}>
                {get(0) && <GalleryCard design={get(0)!} index={0} style={{ flex: 1 }} />}
            </div>
            <div style={{ width: COL[1], flexShrink: 0, display: 'flex', flexDirection: 'column', gap: GAP }}>
                {get(1) && <GalleryCard design={get(1)!} index={1} style={{ flex: 2 }} />}
                {get(5) && <GalleryCard design={get(5)!} index={5} style={{ flex: 1 }} />}
            </div>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: GAP }}>
                <div style={{ flex: 2, display: 'flex', flexDirection: 'column', gap: GAP }}>
                    {get(2) && <GalleryCard design={get(2)!} index={2} style={{ flex: 1 }} />}
                    <div style={{ flex: 1, display: 'flex', gap: GAP }}>
                        {get(3) && <GalleryCard design={get(3)!} index={3} style={{ flex: 1 }} />}
                        {get(4) && <GalleryCard design={get(4)!} index={4} style={{ flex: 1 }} />}
                    </div>
                </div>
                {get(6) && <GalleryCard design={get(6)!} index={6} style={{ flex: 1 }} />}
            </div>
        </div>
    );
}

// ─── MOBILE-FRIENDLY NAVBAR ────────────────────────────────
function DynamicIslandNav({ auth, canRegister, scrolled }: {
    auth: { user: AuthUser | null }; canRegister: boolean; scrolled: boolean;
}) {
    const [expanded, setExpanded] = useState(false);
    const [loginHov, setLoginHov] = useState(false);
    const [regHov, setRegHov] = useState(false);
    const [dashHov, setDashHov] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setExpanded(true), 300);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div style={{
            position: 'fixed', top: 14, left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 200,
            width: expanded ? 'min(500px, calc(100vw - 28px))' : '140px',
            transition: 'width .85s cubic-bezier(.34,1.2,.64,1)',
        }}>
            <div style={{
                background: scrolled
                    ? 'rgba(14,100,180,0.82)'
                    : 'rgba(14,100,180,0.55)',
                backdropFilter: scrolled ? 'blur(36px) saturate(180%)' : 'blur(22px)',
                WebkitBackdropFilter: scrolled ? 'blur(36px) saturate(180%)' : 'blur(22px)',
                borderRadius: 999,
                border: `1px solid ${scrolled ? 'rgba(255,255,255,0.32)' : 'rgba(255,255,255,0.18)'}`,
                boxShadow: scrolled
                    ? '0 14px 50px rgba(9,26,52,0.52), 0 0 0 1px rgba(14,165,233,0.16), inset 0 1px 0 rgba(255,255,255,0.1)'
                    : '0 8px 28px rgba(9,26,52,0.28), inset 0 1px 0 rgba(255,255,255,0.08)',
                padding: '0 6px', height: 52,
                display: 'flex', alignItems: 'center', overflow: 'hidden',
                transition: 'all 0.4s cubic-bezier(.4,0,.2,1)',
            }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', padding: '0 10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                        <div style={{
                            width: 42, height: 42, borderRadius: '50%',
                            background: 'linear-gradient(135deg, #0EA5E9, #1565C0)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            flexShrink: 0,
                            boxShadow: '0 0 18px rgba(14,165,233,0.55)',
                            overflow: 'hidden',
                            padding: 6,
                        }}>
                            <img src="/images/logo.png" alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                        </div>
                        <div style={{
                            opacity: expanded ? 1 : 0,
                            transform: expanded ? 'translateX(0)' : 'translateX(-10px)',
                            transition: 'opacity .5s .3s ease, transform .5s .3s ease',
                            whiteSpace: 'nowrap',
                        }}>
                            <p style={{
                                fontFamily: "'Montserrat', sans-serif",
                                fontWeight: 800, fontSize: 12,
                                color: '#fff', lineHeight: 1, letterSpacing: '-.01em',
                            }}>Layang-Layang</p>
                            <p style={{
                                fontSize: 8, color: '#BAE6FD',
                                fontWeight: 600, letterSpacing: '.14em',
                                textTransform: 'uppercase',
                                fontFamily: "'Open Sans', sans-serif",
                            }}>KOMPETISI 2026</p>
                        </div>
                    </div>

                    <div style={{
                        display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0,
                        opacity: expanded ? 1 : 0,
                        transform: expanded ? 'translateX(0)' : 'translateX(10px)',
                        transition: 'opacity .5s .5s ease, transform .5s .5s ease',
                    }}>
                        {auth.user ? (
                            <Link href={dashboard()}
                                onMouseEnter={() => setDashHov(true)}
                                onMouseLeave={() => setDashHov(false)}
                                style={{
                                    background: dashHov
                                        ? 'linear-gradient(135deg, #38BDF8, #1D74D5)'
                                        : 'linear-gradient(135deg, #0EA5E9, #1565C0)',
                                    color: '#fff', textDecoration: 'none',
                                    fontFamily: "'Montserrat', sans-serif",
                                    fontWeight: 700, fontSize: 11.5,
                                    padding: '7px 16px', borderRadius: 999,
                                    boxShadow: dashHov
                                        ? '0 8px 28px rgba(14,165,233,0.65)'
                                        : '0 4px 16px rgba(14,165,233,0.4)',
                                    whiteSpace: 'nowrap', letterSpacing: '.05em',
                                    transition: 'all .28s cubic-bezier(.34,1.4,.64,1)',
                                    display: 'inline-flex', alignItems: 'center', gap: 6,
                                }}>
                                <i className="ti ti-layout-dashboard" style={{ fontSize: 14 }} />
                                Dashboard
                            </Link>
                        ) : (
                            <>
                                <Link href={login()}
                                    onMouseEnter={() => setLoginHov(true)}
                                    onMouseLeave={() => setLoginHov(false)}
                                    style={{
                                        color: loginHov ? '#fff' : 'rgba(210,232,255,0.74)',
                                        textDecoration: 'none',
                                        fontFamily: "'Open Sans', sans-serif",
                                        fontWeight: 600, fontSize: 12,
                                        padding: '7px 12px', borderRadius: 999,
                                        background: loginHov ? 'rgba(255,255,255,0.13)' : 'transparent',
                                        border: `1px solid ${loginHov ? 'rgba(210,232,255,0.28)' : 'transparent'}`,
                                        whiteSpace: 'nowrap',
                                        transition: 'all .24s ease',
                                        display: 'inline-flex', alignItems: 'center', gap: 5,
                                    }}>
                                    <i className="ti ti-login" style={{ fontSize: 13 }} />
                                    Masuk
                                </Link>

                                {canRegister && (
                                    <Link href={register()}
                                        onMouseEnter={() => setRegHov(true)}
                                        onMouseLeave={() => setRegHov(false)}
                                        style={{
                                            background: regHov
                                                ? 'linear-gradient(135deg, #4169E1, #2a52cc)'
                                                : 'linear-gradient(135deg, #3a5fd9, #1e3fbf)',
                                            color: '#fff', textDecoration: 'none',
                                            fontFamily: "'Montserrat', sans-serif",
                                            fontWeight: 700, fontSize: 11.5,
                                            padding: '7px 14px', borderRadius: 999,
                                            boxShadow: regHov
                                                ? '0 10px 30px rgba(65,105,225,0.7)'
                                                : '0 4px 16px rgba(65,105,225,0.45)',
                                            whiteSpace: 'nowrap', letterSpacing: '.05em',
                                            transition: 'all .28s cubic-bezier(.34,1.4,.64,1)',
                                            display: 'inline-flex', alignItems: 'center', gap: 5,
                                        }}>
                                        <i className="ti ti-user-plus" style={{ fontSize: 13 }} />
                                        Daftar
                                    </Link>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

// ─── MAIN COMPONENT ────────────────────────────────────────
export default function Welcome({ auth, canRegister = true, galleryDesigns = [] }: Props) {
    const [scrolled, setScrolled] = useState(false);
    const [heroIn, setHeroIn] = useState(false);
    const mouse = useRef({ x: 0.5, y: 0.5, tx: 0.5, ty: 0.5 });
    const [mp, setMp] = useState({ x: 0.5, y: 0.5 });
    const [isMobile, setIsMobile] = useState(false);

    const ctaReveal = useReveal();
    const stepsReveal = useReveal();
    const galleryReveal = useReveal(0.05);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile, { passive: true });
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    useEffect(() => {
        const t = setTimeout(() => setHeroIn(true), 120);
        const onScroll = () => setScrolled(window.scrollY > 60);
        const m = mouse.current;
        const onMouse = (e: MouseEvent) => {
            m.tx = e.clientX / window.innerWidth;
            m.ty = e.clientY / window.innerHeight;
        };
        let raf: number;
        const tick = () => {
            m.x += (m.tx - m.x) * 0.055;
            m.y += (m.ty - m.y) * 0.055;
            setMp({ x: m.x, y: m.y });
            raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
        window.addEventListener('scroll', onScroll, { passive: true });
        window.addEventListener('mousemove', onMouse, { passive: true });
        return () => {
            clearTimeout(t); cancelAnimationFrame(raf);
            window.removeEventListener('scroll', onScroll);
            window.removeEventListener('mousemove', onMouse);
        };
    }, []);

    const slide = (d: number, extra: CSSProperties = {}): CSSProperties => ({
        opacity: heroIn ? 1 : 0,
        transform: heroIn ? 'translateY(0)' : 'translateY(38px)',
        transition: `opacity .9s ease ${d}ms, transform .95s cubic-bezier(.22,1,.36,1) ${d}ms`,
        ...extra,
    });

    const px = isMobile ? 0 : (mp.x - 0.5) * 2 * 14;
    const py = isMobile ? 0 : (mp.y - 0.5) * 2 * 9;

    return (
        <>
            <Head title="Layang-Layang Event — Kompetisi Desain 2026" />
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,400;0,500;0,600;0,700;0,800;0,900;1,700;1,800&family=Open+Sans:wght@300;400;500;600;700&display=swap');

                *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
                html { scroll-behavior: smooth; }
                body {
                    font-family: 'Open Sans', sans-serif;
                    -webkit-font-smoothing: antialiased;
                    text-rendering: optimizeLegibility;
                    overflow-x: hidden;
                }

                ::-webkit-scrollbar { width: 5px; }
                ::-webkit-scrollbar-track { background: #C8E9FF; }
                ::-webkit-scrollbar-thumb { background: linear-gradient(#0EA5E9, #1565C0); border-radius: 3px; }

                @keyframes float-slow  { 0%,100%{transform:translateY(0) rotate(-6deg)} 50%{transform:translateY(-22px) rotate(6deg)} }
                @keyframes float-med   { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-14px)} }
                @keyframes float-fast  { 0%,100%{transform:translateY(0) scale(1)} 50%{transform:translateY(-10px) scale(1.05)} }
                @keyframes spin-slow   { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
                @keyframes pop-in      { 0%{opacity:0;transform:scale(0.4) rotate(-18deg)} 65%{transform:scale(1.1) rotate(3deg)} 100%{opacity:1;transform:scale(1) rotate(0)} }
                @keyframes shimmer     { 0%{background-position:0% 50%} 50%{background-position:100% 50%} 100%{background-position:0% 50%} }
                @keyframes blink-dot   { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.4;transform:scale(0.7)} }
                @keyframes orb-drift   { 0%,100%{transform:translate(0,0)} 33%{transform:translate(26px,-18px)} 66%{transform:translate(-20px,24px)} }
                @keyframes ring-pulse  { 0%{transform:translate(-50%,-50%) scale(1);opacity:.32} 100%{transform:translate(-50%,-50%) scale(1.55);opacity:0} }
                @keyframes kite-float  { 0%,100%{transform:translateY(0) rotate(-6deg)} 50%{transform:translateY(-22px) rotate(6deg)} }

                .gradient-text-sky {
                    background: linear-gradient(135deg, #0A2F5E 0%, #1565C0 32%, #0EA5E9 62%, #38BDF8 100%);
                    background-size: 280%;
                    -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
                    animation: shimmer 7s ease infinite;
                }
                .gradient-text-flame {
                    background: linear-gradient(135deg, #FF4F1F, #F59E0B 52%, #FF4F1F);
                    background-size: 200%;
                    -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
                    animation: shimmer 4.5s ease infinite;
                }

                .kite-hero { animation: float-slow 5.5s ease-in-out infinite; }
                .kite-sm-a { animation: float-med 4s ease-in-out infinite; }
                .kite-sm-b { animation: float-fast 6s ease-in-out infinite 1s; }

                .heading-xl {
                    font-family: 'Montserrat', sans-serif;
                    font-weight: 800;
                    font-size: clamp(26px, 7vw, 56px);
                    line-height: 1.15;
                    letter-spacing: -0.02em;
                    color: #08182E;
                }

                /* ── HERO HEADLINE baru — lebih ramping ── */
                .hero-headline {
                    font-family: 'Montserrat', sans-serif;
                    font-weight: 700;
                    font-size: clamp(22px, 4.2vw, 38px);
                    line-height: 1.3;
                    letter-spacing: -0.01em;
                    color: #08182E;
                    margin-bottom: 6px;
                }

                /* ── KOMPETISI besar tetap ada di atas ── */
                .heading-kompetisi {
                    font-family: 'Montserrat', sans-serif;
                    font-weight: 800;
                    font-size: clamp(26px, 7vw, 56px);
                    line-height: 1.1;
                    letter-spacing: -0.02em;
                }

                .heading-section {
                    font-family: 'Montserrat', sans-serif;
                    font-weight: 800;
                    font-size: clamp(28px, 6vw, 52px);
                    line-height: 1.1;
                    letter-spacing: -0.02em;
                    color: #08182E;
                }

                .btn-primary {
                    display: inline-flex; align-items: center; gap: 8px; text-decoration: none;
                    background: linear-gradient(135deg, #4169E1 0%, #2a52cc 100%);
                    color: #fff;
                    font-family: 'Montserrat', sans-serif; font-weight: 700;
                    font-size: clamp(13px, 3.5vw, 15px);
                    padding: clamp(12px, 3vw, 16px) clamp(22px, 5vw, 36px);
                    border-radius: 999px;
                    box-shadow: 0 8px 28px rgba(65,105,225,.38), inset 0 1px 0 rgba(255,255,255,.22);
                    transition: transform .3s cubic-bezier(.34,1.4,.64,1), box-shadow .3s ease, filter .25s ease;
                    border: none; cursor: pointer; letter-spacing: .06em; position: relative; overflow: hidden;
                    -webkit-tap-highlight-color: transparent;
                    touch-action: manipulation;
                }
                .btn-primary::before {
                    content: ''; position: absolute; inset: 0;
                    background: linear-gradient(135deg, rgba(255,255,255,.2), transparent);
                    opacity: 0; transition: opacity .3s ease;
                }
                .btn-primary:hover {
                    transform: translateY(-4px) scale(1.04);
                    box-shadow: 0 18px 48px rgba(65,105,225,.52), 0 0 0 4px rgba(65,105,225,.18);
                    filter: brightness(1.07);
                }
                .btn-primary:hover::before { opacity: 1; }
                .btn-primary:active { transform: translateY(-1px) scale(1.01); transition-duration: .1s; }

                .btn-secondary {
                    display: inline-flex; align-items: center; gap: 8px; text-decoration: none;
                    background: rgba(255,255,255,0.7);
                    color: #0B2855;
                    font-family: 'Open Sans', sans-serif; font-weight: 700;
                    font-size: clamp(13px, 3.5vw, 15px);
                    padding: clamp(11px, 3vw, 15px) clamp(22px, 5vw, 36px);
                    border-radius: 999px;
                    border: 1.5px solid rgba(14,165,233,0.38);
                    backdrop-filter: blur(14px); -webkit-backdrop-filter: blur(14px);
                    transition: transform .3s cubic-bezier(.34,1.4,.64,1), background .28s ease, border-color .28s ease, box-shadow .3s ease;
                    cursor: pointer; letter-spacing: .04em;
                    -webkit-tap-highlight-color: transparent;
                    touch-action: manipulation;
                }
                .btn-secondary:hover {
                    transform: translateY(-4px) scale(1.04);
                    background: rgba(255,255,255,0.96);
                    border-color: rgba(14,165,233,0.6);
                    box-shadow: 0 14px 36px rgba(14,165,233,.2), 0 0 0 3px rgba(14,165,233,.12);
                    color: #0B1F3A;
                }
                .btn-secondary:active { transform: translateY(-1px) scale(1.01); transition-duration: .1s; }

                .glass-card {
                    background: rgba(255,255,255,0.66);
                    backdrop-filter: blur(20px) saturate(160%);
                    -webkit-backdrop-filter: blur(20px) saturate(160%);
                    border: 1.5px solid rgba(255,255,255,0.88);
                    border-radius: 20px;
                    box-shadow: 0 6px 26px rgba(11,31,58,0.08), inset 0 1px 0 rgba(255,255,255,0.92);
                }

                .section-wrap {
                    max-width: 1200px; margin: 0 auto;
                    padding: clamp(48px, 8vw, 110px) clamp(16px, 5vw, 36px);
                    position: relative; z-index: 1;
                }

                .steps-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
                    gap: clamp(12px, 2vw, 24px);
                }
                .crit-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
                    gap: clamp(10px, 1.8vw, 20px);
                }

                .hero-wrap {
                    display: flex;
                    flex-direction: column-reverse;
                    align-items: center;
                    gap: clamp(24px, 5vw, 48px);
                }
                @media (min-width: 768px) {
                    .hero-wrap {
                        display: grid;
                        grid-template-columns: 1fr 1fr;
                        flex-direction: unset;
                        align-items: center;
                        gap: clamp(36px, 5vw, 72px);
                    }
                }

                .hero-art {
                    position: relative;
                    width: 100%;
                    max-width: 320px;
                    height: clamp(260px, 60vw, 430px);
                    margin: 0 auto;
                }
                @media (min-width: 768px) {
                    .hero-art {
                        max-width: 400px;
                        height: clamp(320px, 45vw, 430px);
                        justify-self: center;
                        margin: 0;
                    }
                }

                .hero-text {
                    text-align: center;
                    width: 100%;
                }
                @media (min-width: 768px) {
                    .hero-text { text-align: left; }
                }

                .cta-row {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 10px;
                    justify-content: center;
                }
                @media (min-width: 768px) {
                    .cta-row { justify-content: flex-start; }
                }

                .trust-row {
                    display: flex;
                    align-items: center;
                    gap: 14px;
                    justify-content: center;
                    flex-wrap: wrap;
                }
                @media (min-width: 768px) {
                    .trust-row { justify-content: flex-start; }
                }

                .hero-body-text {
                    max-width: 100%;
                }
                @media (min-width: 768px) {
                    .hero-body-text { max-width: 480px; }
                }

                .badge-top {
                    position: absolute;
                    top: 0px;
                    right: -8px;
                    padding: 12px 16px;
                }
                @media (min-width: 480px) { .badge-top { right: -16px; } }
                @media (min-width: 768px) { .badge-top { right: clamp(-16px, -3vw, -40px); } }

                .badge-bottom {
                    position: absolute;
                    bottom: 20px;
                    left: -8px;
                    padding: 12px 16px;
                }
                @media (min-width: 480px) { .badge-bottom { left: -16px; } }
                @media (min-width: 768px) { .badge-bottom { left: clamp(-16px, -3vw, -40px); } }

                @media (max-width: 480px) {
                    .steps-grid { grid-template-columns: 1fr; }
                    .crit-grid { grid-template-columns: repeat(2, 1fr); }
                    .cta-inner { padding: 48px 20px !important; border-radius: 22px !important; }
                }
                @media (max-width: 360px) {
                    .crit-grid { grid-template-columns: 1fr; }
                }
            `}</style>

            <div style={{
                minHeight: '100vh',
                background: 'linear-gradient(170deg, #A8D8FF 0%, #C4E5FF 16%, #DDF1FF 38%, #CBE8FF 62%, #B0D8FF 100%)',
                position: 'relative', overflowX: 'hidden',
            }}>

                {/* Orb depth layer */}
                <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none', overflow: 'hidden' }}>
                    {[
                        { w: 600, h: 600, top: '-220px', left: '-150px', c: 'radial-gradient(circle, rgba(14,165,233,0.17) 0%, transparent 62%)', dur: '24s', delay: '0s' },
                        { w: 500, h: 500, top: '18%', right: '-150px', c: 'radial-gradient(circle, rgba(255,255,255,0.52) 0%, transparent 62%)', dur: '30s', delay: '-7s' },
                        { w: 400, h: 400, bottom: '-100px', left: '22%', c: 'radial-gradient(circle, rgba(14,165,233,0.11) 0%, transparent 60%)', dur: '21s', delay: '-13s' },
                    ].map((b, i) => (
                        <div key={i} style={{
                            position: 'absolute', width: b.w, height: b.h, borderRadius: '50%',
                            top: (b as any).top, left: (b as any).left,
                            right: (b as any).right, bottom: (b as any).bottom,
                            background: b.c,
                            animation: `orb-drift ${b.dur} ease-in-out infinite`,
                            animationDelay: b.delay,
                        }} />
                    ))}
                </div>

                <div style={{
                    position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none',
                    backgroundImage: 'radial-gradient(rgba(11,31,58,0.08) 1px, transparent 1px)',
                    backgroundSize: '30px 30px',
                }} />

                <DynamicIslandNav auth={auth} canRegister={canRegister} scrolled={scrolled} />

                {/* ─── HERO ──────────────────────────────────── */}
                <div className="section-wrap" style={{ paddingTop: 'clamp(80px, 16vw, 140px)', paddingBottom: 'clamp(32px, 6vw, 72px)' }}>
                    <div className="hero-wrap">

                        {/* TEXT */}
                        <div className="hero-text">

                            {/* Badge live */}
                            <div style={slide(80)}>
                                <span style={{
                                    display: 'inline-flex', alignItems: 'center', gap: 8,
                                    background: 'rgba(255,255,255,0.74)',
                                    border: '1.5px solid rgba(14,165,233,0.30)',
                                    backdropFilter: 'blur(14px)',
                                    color: '#0E4A8A', letterSpacing: '.12em',
                                    textTransform: 'uppercase', marginBottom: 16,
                                    fontFamily: "'Montserrat', sans-serif",
                                    boxShadow: '0 4px 18px rgba(14,165,233,0.1)',
                                    padding: '5px 14px',
                                    borderRadius: 999,
                                    fontSize: 'clamp(9px, 2.5vw, 11px)', fontWeight: 700,
                                }}>
                                    <span style={{
                                        width: 7, height: 7, borderRadius: '50%',
                                        background: '#FF5733', display: 'inline-block',
                                        boxShadow: '0 0 10px rgba(255,87,51,0.8)',
                                        animation: 'blink-dot 1.6s ease-in-out infinite',
                                        flexShrink: 0,
                                    }} />
                                    Pendaftaran Dibuka · 2026
                                </span>
                            </div>

                            {/* Label kecil KOMPETISI DESAIN */}
                            <div style={slide(130)}>
                                <p style={{
                                    fontFamily: "'Montserrat', sans-serif",
                                    fontWeight: 700,
                                    fontSize: 'clamp(9px, 2vw, 11px)',
                                    letterSpacing: '.22em',
                                    textTransform: 'uppercase',
                                    color: '#0EA5E9',
                                    marginBottom: 8,
                                }}>
                                    Kompetisi Desain Layang-Layang
                                </p>
                            </div>

                            {/* ── HEADLINE UTAMA — font medium, tidak terlalu tebal ── */}
                            <div style={slide(180)}>
                                <h1 className="hero-headline" style={{ marginBottom: 14 }}>
                                    <span className="gradient-text-sky">
                                        Tunjukkan Kreativitas
                                    </span>
                                    <br />
                                    <span className="gradient-text-sky">
                                        Tanpa Batas
                                    </span>
                                </h1>
                            </div>

                            {/* ── SUBHEADLINE ── */}
                            <div style={slide(260)}>
                                <p className="hero-body-text" style={{
                                    fontSize: 'clamp(13px, 3vw, 15.5px)',
                                    color: '#2C5F8A',
                                    lineHeight: 1.85,
                                    marginBottom: 60,
                                    fontWeight: 400,
                                    fontFamily: "'Open Sans', sans-serif",
                                    textAlign: 'justify',
                                }}>
                                    Upload desain layang-layangmu sekarang, dapatkan penilaian dari{' '}
                                    <strong style={{ color: '#1256A8', fontWeight: 700 }}>juri profesional</strong>{' '}
                                    secara real time, dan menangkan{' '}
                                    <strong style={{ color: '#0EA5E9', fontWeight: 700 }}>penghargaan bergengsi</strong>.
                                </p>
                            </div>

                            {/* CTA Buttons */}
                            <div className="cta-row" style={{ ...slide(350) }}>
                                {canRegister && !auth.user && (
                                    <Link href={register()} className="btn-primary">
                                        <i className="ti ti-sparkles" style={{ fontSize: 16 }} />
                                        Ikut Sekarang
                                    </Link>
                                )}
                                {!auth.user && (
                                    <Link href={login()} className="btn-secondary">
                                        Sudah Punya Akun
                                        <i className="ti ti-arrow-right" style={{ fontSize: 15 }} />
                                    </Link>
                                )}
                                {auth.user && (
                                    <Link href={dashboard()} className="btn-primary">
                                        Dashboard
                                        <i className="ti ti-arrow-right" style={{ fontSize: 15 }} />
                                    </Link>
                                )}
                            </div>

                            {/* Social proof */}
                            <div style={{ ...slide(450), marginTop: 28 }}>
                                <div className="trust-row">
                                    <div style={{ display: 'flex' }}>
                                        {['#4DA3D4', '#5BB8E8', '#3D8EC4', '#6BC4F0', '#4AAED8'].map((bg, i) => (
                                            <span key={i} style={{
                                                width: 30, height: 30, borderRadius: '50%',
                                                background: bg,
                                                border: '2px solid rgba(255,255,255,0.82)',
                                                marginLeft: i > 0 ? -9 : 0,
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            }}>
                                                <i className="ti ti-user" style={{ fontSize: 13, color: '#fff' }} />
                                            </span>
                                        ))}
                                    </div>
                                    <p style={{
                                        fontSize: 'clamp(12px, 3vw, 13px)',
                                        color: '#1A3A5C',
                                        fontFamily: "'Open Sans', sans-serif",
                                        fontWeight: 400,
                                    }}>
                                        <strong style={{ color: '#08182E', fontWeight: 700 }}>500+ peserta</strong> sudah bergabung
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* HERO ART */}
                        <div className="hero-art" style={{ ...slide(210) as CSSProperties }}>
                            <div style={{
                                position: 'absolute', top: '50%', left: '50%',
                                width: '80%', height: '80%',
                                background: 'radial-gradient(circle, rgba(14,165,233,0.24) 0%, transparent 68%)',
                                transform: `translate(calc(-50% + ${px * 0.3}px), calc(-50% + ${py * 0.3}px))`,
                                transition: 'transform .22s ease', borderRadius: '50%', pointerEvents: 'none',
                            }} />

                            {[90, 74, 58].map((pct, i) => (
                                <div key={pct} style={{
                                    position: 'absolute', top: '50%', left: '50%',
                                    width: `${pct}%`, height: `${pct}%`, borderRadius: '50%',
                                    border: `${i === 0 ? 1.5 : 1}px ${i === 2 ? 'solid' : 'dashed'} rgba(14,165,233,${0.14 + i * 0.09})`,
                                    transform: 'translate(-50%,-50%)',
                                    animation: i % 2 === 0
                                        ? `spin-slow ${30 - i * 8}s linear infinite`
                                        : `spin-slow ${24 - i * 6}s linear infinite reverse`,
                                    pointerEvents: 'none',
                                }} />
                            ))}

                            {[0, 1].map(i => (
                                <div key={i} style={{
                                    position: 'absolute', top: '50%', left: '50%',
                                    width: '56%', height: '56%', borderRadius: '50%',
                                    border: '1.5px solid rgba(14,165,233,0.28)',
                                    animation: `ring-pulse 3.6s ease-out ${i * 1.8}s infinite`,
                                    pointerEvents: 'none',
                                }} />
                            ))}

                            <div style={{
                                position: 'absolute', top: '50%', left: '50%',
                                width: '55%', height: '55%', borderRadius: '50%',
                                background: 'linear-gradient(135deg, rgba(255,255,255,0.92) 0%, rgba(196,228,255,0.62) 50%, rgba(14,165,233,0.24) 100%)',
                                border: '2px solid rgba(255,255,255,0.92)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                transform: `translate(calc(-50% + ${px * 0.2}px), calc(-50% + ${py * 0.2}px))`,
                                transition: 'transform .22s ease',
                                boxShadow: '0 0 60px rgba(14,165,233,0.28), inset 0 0 40px rgba(255,255,255,0.52), 0 16px 48px rgba(11,31,58,0.12)',
                            }}>
                                <img
                                    className="kite-hero"
                                    src="/images/layang.png"
                                    alt="layang-layang"
                                    style={{
                                        width: '85%',
                                        height: '85%',
                                        objectFit: 'cover',
                                        objectPosition: '30%',
                                        borderRadius: '50%',
                                        border: '3px solid rgba(255,255,255,0.90)',
                                        boxShadow: '0 8px 32px rgba(11,31,58,0.18), 0 0 0 6px rgba(255,255,255,0.28)',
                                        display: 'block',
                                    }}
                                />
                            </div>

                            <span className="kite-sm-a" style={{
                                position: 'absolute', top: '4%', left: '2%',
                                opacity: 0.58,
                                filter: 'drop-shadow(0 4px 12px rgba(14,165,233,0.38))',
                            }}>
                                <img src="/images/logo.png" alt="" style={{
                                    width: 'clamp(2rem, 7vw, 3.5rem)',
                                    height: 'clamp(2rem, 7vw, 3.5rem)',
                                    objectFit: 'contain',
                                }} />
                            </span>
                            <span className="kite-sm-b" style={{
                                position: 'absolute', bottom: '14%', right: '0%',
                                opacity: 0.48,
                                filter: 'drop-shadow(0 4px 12px rgba(14,165,233,0.28))',
                            }}>
                                <img src="/images/logo.png" alt="" style={{
                                    width: 'clamp(1.6rem, 6vw, 2.8rem)',
                                    height: 'clamp(1.6rem, 6vw, 2.8rem)',
                                    objectFit: 'contain',
                                }} />
                            </span>

                            {/* Badge atas — Total Peserta */}
                            <div className="glass-card badge-top" style={{
                                animation: heroIn
                                    ? 'pop-in .7s cubic-bezier(.34,1.56,.64,1) 1s both, float-med 3.5s ease-in-out 1.7s infinite'
                                    : 'none',
                            }}>
                                <p style={{ fontSize: 9, color: '#0EA5E9', fontWeight: 700, marginBottom: 3, letterSpacing: '.13em', textTransform: 'uppercase', fontFamily: "'Open Sans', sans-serif" }}>Total Peserta</p>
                                <p style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 800, fontSize: 'clamp(18px, 5vw, 28px)', color: '#08182E', lineHeight: 1 }}>500+</p>
                            </div>

                            {/* Badge bawah — Penghargaan Bergengsi */}
                            <div className="glass-card badge-bottom" style={{
                                animation: heroIn
                                    ? 'pop-in .7s cubic-bezier(.34,1.56,.64,1) 1.3s both, float-med 4.2s ease-in-out 2s infinite reverse'
                                    : 'none',
                            }}>
                                <p style={{ fontSize: 9, color: '#0EA5E9', fontWeight: 700, marginBottom: 3, letterSpacing: '.13em', textTransform: 'uppercase', fontFamily: "'Open Sans', sans-serif" }}>Penghargaan</p>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                    <p style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 800, fontSize: 'clamp(14px, 4vw, 20px)', color: '#08182E', lineHeight: 1 }}>Bergengsi</p>
                                    <i className="ti ti-medal" style={{ fontSize: 18, color: '#1565C0' }} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* DIVIDER */}
                <div style={{ maxWidth: 1200, marginTop: 75, padding: '0 clamp(16px, 5vw, 36px)' }}>
                    <div style={{ height: 1.5, background: 'linear-gradient(90deg, transparent, rgba(14,165,233,0.48), rgba(21,101,192,0.38), transparent)', borderRadius: 1 }} />
                </div>

                {/* ─── CARA IKUT ─────────────────────────────── */}
                <div className="section-wrap">
                    <div ref={stepsReveal.ref} style={{
                        marginBottom: 'clamp(32px, 5vw, 64px)',
                        textAlign: 'center',
                        opacity: stepsReveal.visible ? 1 : 0,
                        transform: stepsReveal.visible ? 'translateY(0)' : 'translateY(28px)',
                        transition: 'opacity .75s ease, transform .75s ease',
                    }}>
                        <p style={{ fontSize: 'clamp(9px, 2.5vw, 11px)', fontWeight: 700, letterSpacing: '.18em', textTransform: 'uppercase', color: '#0EA5E9', marginBottom: 14, fontFamily: "'Montserrat', sans-serif" }}>— LANGKAH MUDAH —</p>
                        <h2 className="heading-section" style={{ marginBottom: 12 }}>
                            Cara Ikut<br /><span className="gradient-text-sky">Kompetisi</span>
                        </h2>
                        <p style={{ color: '#1A3A5C', fontSize: 'clamp(13px, 3.5vw, 16px)', fontFamily: "'Open Sans', sans-serif", fontWeight: 400, maxWidth: 460, margin: '0 auto' }}>
                            Mudah, cepat, dan sepenuhnya transparan
                        </p>
                    </div>

                    <div className="steps-grid">
                        {[
                            { num: '01', icon: 'ti-user-plus', title: 'Daftar Akun', desc: 'Buat akun peserta secara gratis dan lengkapi profilmu dalam hitungan menit tanpa ribet.', delay: 0 },
                            { num: '02', icon: 'ti-upload', title: 'Upload Desain', desc: 'Upload foto desain layang-layangmu dalam format JPG atau PNG dengan tampilan yang mudah digunakan.', delay: 140 },
                            { num: '03', icon: 'ti-trophy', title: 'Terima Penilaian', desc: 'Juri menilai berdasarkan 4 kriteria utama. Hasilnya langsung tampil real-time di dashboardmu.', delay: 280 },
                        ].map(item => <StepCard key={item.num} {...item} />)}
                    </div>
                </div>

                {/* DIVIDER */}
                <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 clamp(16px, 5vw, 36px)' }}>
                    <div style={{ height: 1.5, background: 'linear-gradient(90deg, transparent, rgba(255,87,51,0.38), rgba(245,158,11,0.32), transparent)', borderRadius: 1 }} />
                </div>

                {/* ─── KRITERIA ──────────────────────────────── */}
                <div className="section-wrap">
                    {(() => {
                        const r = useReveal();
                        return (
                            <>
                                <div ref={r.ref} style={{
                                    marginBottom: 'clamp(28px, 5vw, 60px)',
                                    textAlign: 'center',
                                    opacity: r.visible ? 1 : 0,
                                    transform: r.visible ? 'translateY(0)' : 'translateY(28px)',
                                    transition: 'opacity .75s ease, transform .75s ease',
                                }}>
                                    <p style={{ fontSize: 'clamp(9px, 2.5vw, 11px)', fontWeight: 700, letterSpacing: '.18em', textTransform: 'uppercase', color: '#C4340E', marginBottom: 14, fontFamily: "'Montserrat', sans-serif" }}>— PENILAIAN PROFESIONAL —</p>
                                    <h2 className="heading-section" style={{ marginBottom: 12 }}>
                                        Kriteria<br /><span className="gradient-text-flame">Penilaian</span>
                                    </h2>
                                    <p style={{ color: '#1A3A5C', fontSize: 'clamp(13px, 3.5vw, 16px)', fontFamily: "'Open Sans', sans-serif", fontWeight: 400, maxWidth: 480, margin: '0 auto' }}>
                                        Setiap kriteria dinilai 0–100 poin oleh juri berpengalaman
                                    </p>
                                </div>
                                <div className="crit-grid">
                                    {[
                                        { icon: 'ti-palette', label: 'Tema', desc: 'Kesesuaian desain dengan tema lomba yang ditetapkan panitia kompetisi.', delay: 0, color: '#0EA5E9' },
                                        { icon: 'ti-bulb', label: 'Kreativitas', desc: 'Orisinalitas, keunikan ide, dan inovasi segar dalam desain karyamu.', delay: 100, color: '#1565C0' },
                                        { icon: 'ti-sparkles', label: 'Estetika', desc: 'Keindahan visual, komposisi warna, dan harmoni keseluruhan karya.', delay: 200, color: '#A86100' },
                                        { icon: 'ti-tool', label: 'Teknik', desc: 'Kualitas eksekusi, ketelitian, dan standar teknis pembuatan karya.', delay: 300, color: '#C4340E' },
                                    ].map(k => <CritCard key={k.label} {...k} />)}
                                </div>
                            </>
                        );
                    })()}
                </div>

                {/* DIVIDER */}
                <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 clamp(16px, 5vw, 36px)' }}>
                    <div style={{ height: 1.5, background: 'linear-gradient(90deg, transparent, rgba(14,165,233,0.38), rgba(245,158,11,0.28), transparent)', borderRadius: 1 }} />
                </div>

                {/* ─── GALERI ────────────────────────────────── */}
                <div className="section-wrap">
                    <div ref={galleryReveal.ref} style={{
                        marginBottom: 'clamp(28px, 5vw, 60px)',
                        textAlign: 'center',
                        opacity: galleryReveal.visible ? 1 : 0,
                        transform: galleryReveal.visible ? 'translateY(0)' : 'translateY(28px)',
                        transition: 'opacity .75s ease, transform .75s ease',
                    }}>
                        <p style={{ fontSize: 'clamp(9px, 2.5vw, 11px)', fontWeight: 700, letterSpacing: '.18em', textTransform: 'uppercase', color: '#A86100', marginBottom: 14, fontFamily: "'Montserrat', sans-serif" }}>— KARYA PESERTA —</p>
                        <h2 className="heading-section" style={{ marginBottom: 12 }}>
                            Galeri<br />
                            <span style={{
                                background: 'linear-gradient(135deg, #A86100, #F59E0B 52%, #A86100)',
                                backgroundSize: '200%',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                backgroundClip: 'text',
                                animation: 'shimmer 4.5s ease infinite',
                            }}>Karya Terbaik</span>
                        </h2>
                        <p style={{ color: '#1A3A5C', fontSize: 'clamp(13px, 3.5vw, 16px)', fontFamily: "'Open Sans', sans-serif", fontWeight: 400, maxWidth: 480, margin: '0 auto 24px' }}>
                            Desain layang-layang terbaik pilihan juri profesional, diurutkan berdasarkan nilai tertinggi
                        </p>
                        <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginBottom: 4 }}>
                            {['🥇', '🥈', '🥉'].map((m, i) => (
                                <span key={i} style={{
                                    fontSize: 'clamp(20px, 4vw, 28px)',
                                    filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.12))',
                                    animation: `float-med ${3.5 + i * 0.5}s ease-in-out ${i * 0.3}s infinite`,
                                    display: 'inline-block',
                                }}>{m}</span>
                            ))}
                        </div>
                    </div>
                    <MasonryGallery designs={galleryDesigns} />
                </div>

                {/* ─── CTA BANNER ────────────────────────────── */}
                {canRegister && !auth.user && (
                    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 clamp(16px, 5vw, 36px) clamp(56px, 10vw, 120px)', position: 'relative', zIndex: 1 }}>
                        <div
                            ref={ctaReveal.ref}
                            className="cta-inner"
                            style={{
                                position: 'relative', overflow: 'hidden',
                                borderRadius: 'clamp(20px, 4vw, 36px)',
                                padding: 'clamp(48px, 9vw, 100px) clamp(20px, 5vw, 52px)',
                                textAlign: 'center',
                                background: 'linear-gradient(138deg, rgba(8,24,46,0.92) 0%, rgba(18,88,178,0.88) 50%, rgba(10,155,225,0.8) 100%)',
                                border: '1.5px solid rgba(255,255,255,0.14)',
                                boxShadow: '0 40px 100px rgba(8,24,46,0.28), inset 0 1px 0 rgba(255,255,255,0.14)',
                                backdropFilter: 'blur(44px)', WebkitBackdropFilter: 'blur(44px)',
                                opacity: ctaReveal.visible ? 1 : 0,
                                transform: ctaReveal.visible ? 'translateY(0)' : 'translateY(44px)',
                                transition: 'opacity .95s ease, transform 1s cubic-bezier(.22,1,.36,1)',
                            }}
                        >
                            <div style={{ position: 'absolute', inset: 0, zIndex: 0, borderRadius: 'inherit', overflow: 'hidden' }}>
                                <SkyCanvas />
                            </div>
                            <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(rgba(255,255,255,0.1) 1px, transparent 1px)', backgroundSize: '26px 26px', borderRadius: 'inherit', pointerEvents: 'none', zIndex: 1 }} />

                            <div style={{ position: 'relative', zIndex: 2 }}>
                                <div style={{ display: 'block', marginBottom: 20, animation: 'float-slow 4s ease-in-out infinite', filter: 'drop-shadow(0 8px 30px rgba(255,255,255,0.38))' }}>
                                    <img src="/images/logo.png" alt="Logo" style={{ width: 'clamp(64px, 14vw, 100px)', height: 'clamp(64px, 14vw, 100px)', objectFit: 'contain', display: 'block', margin: '0 auto' }} />
                                </div>
                                <h2 style={{
                                    fontFamily: "'Montserrat', sans-serif",
                                    fontWeight: 800,
                                    fontSize: 'clamp(24px, 6vw, 56px)',
                                    color: '#fff', marginBottom: 16,
                                    letterSpacing: '-0.02em', lineHeight: 1.1,
                                }}>
                                    Siap Terbang<br />
                                    Bersama Kami?{' '}
                                    <i className="ti ti-rocket" style={{ fontSize: '0.85em', verticalAlign: 'middle' }} />
                                </h2>
                                <p style={{
                                    color: 'rgba(206,236,255,0.9)',
                                    fontSize: 'clamp(13px, 3.5vw, 17px)',
                                    maxWidth: 520, margin: '0 auto clamp(28px, 6vw, 52px)',
                                    lineHeight: 1.9, fontWeight: 300,
                                    fontFamily: "'Open Sans', sans-serif",
                                }}>
                                    Daftar sekarang dan jadilah bagian dari kompetisi desain layang-layang{' '}
                                    <strong style={{ color: '#fff', fontWeight: 700 }}>terbesar di Indonesia</strong>!
                                </p>
                                <div style={{ display: 'flex', justifyContent: 'center', gap: 14, flexWrap: 'wrap' }}>
                                    <Link href={register()} className="btn-primary" style={{ boxShadow: '0 14px 44px rgba(65,105,225,.52), inset 0 1px 0 rgba(255,255,255,.22)' }}>
                                        <i className="ti ti-sparkles" style={{ fontSize: 16 }} />
                                        Daftar Gratis Sekarang
                                    </Link>
                                </div>
                                <p style={{ color: 'rgba(176,212,255,0.58)', marginTop: 20, fontFamily: "'Open Sans', sans-serif", fontWeight: 400, fontSize: 'clamp(10px, 2.5vw, 13px)' }}>
                                    Tidak perlu kartu kredit · 100% gratis · Mulai dalam 2 menit
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* ─── FOOTER ────────────────────────────────── */}
                <div style={{
                    borderTop: '1px solid rgba(14,165,233,0.18)',
                    textAlign: 'center',
                    padding: 'clamp(20px, 4vw, 36px) clamp(16px, 5vw, 36px)',
                    color: '#1A3A5C',
                    position: 'relative', zIndex: 1,
                    letterSpacing: '.04em',
                    fontFamily: "'Open Sans', sans-serif",
                    fontWeight: 400,
                    fontSize: 'clamp(11px, 3vw, 13px)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                }}>
                    <img src="/images/logo.png" alt="Logo" style={{ width: 'clamp(22px, 5vw, 32px)', height: 'clamp(22px, 5vw, 32px)', objectFit: 'contain', filter: 'drop-shadow(0 0 8px rgba(14,165,233,0.48))' }} />
                    © 2025{' '}
                    <strong style={{ color: '#1565C0', fontFamily: "'Montserrat', sans-serif", fontWeight: 700 }}>Layang-Layang Event</strong>
                    {' '}· All rights reserved.
                </div>
            </div>
        </>
    );
}