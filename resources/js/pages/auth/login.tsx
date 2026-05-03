import { Head, Link, useForm } from '@inertiajs/react';
import { login as loginRoute, register, dashboard } from '@/routes';
import { useEffect, useRef, useState, FormEvent } from 'react';
import {
    IconArrowLeft,
    IconArrowRight,
    IconMail,
    IconKey,
    IconEye,
    IconEyeOff,
    IconAlertTriangle,
    IconCircleCheck,
} from '@tabler/icons-react';

interface Props {
    status?: string;
    canResetPassword?: boolean;
}

// ─── FLOATING PARTICLES ─────────────────────────────────────
function ParticleCanvas() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    useEffect(() => {
        const canvas = canvasRef.current; if (!canvas) return;
        const ctx = canvas.getContext('2d')!;
        const resize = () => {
            canvas.width = window.innerWidth * devicePixelRatio;
            canvas.height = window.innerHeight * devicePixelRatio;
            ctx.scale(devicePixelRatio, devicePixelRatio);
        };
        resize();

        const kites = Array.from({ length: 18 }, (_, i) => ({
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            vx: (Math.random() - 0.5) * 0.4,
            vy: -0.3 - Math.random() * 0.5,
            size: 3 + Math.random() * 8,
            opacity: 0.04 + Math.random() * 0.12,
            phase: Math.random() * Math.PI * 2,
            wobble: 0.008 + Math.random() * 0.012,
        }));

        let t = 0, raf: number;
        const draw = () => {
            raf = requestAnimationFrame(draw);
            ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
            t += 0.01;

            for (const k of kites) {
                k.x += k.vx + Math.sin(t * k.wobble * 60 + k.phase) * 0.3;
                k.y += k.vy;
                if (k.y < -20) { k.y = window.innerHeight + 20; k.x = Math.random() * window.innerWidth; }

                ctx.save();
                ctx.translate(k.x, k.y);
                ctx.rotate(Math.sin(t * k.wobble * 40 + k.phase) * 0.3);
                ctx.beginPath();
                ctx.moveTo(0, -k.size * 1.4);
                ctx.lineTo(k.size, 0);
                ctx.lineTo(0, k.size * 1.1);
                ctx.lineTo(-k.size, 0);
                ctx.closePath();
                ctx.fillStyle = `rgba(14,165,233,${k.opacity})`;
                ctx.fill();
                ctx.beginPath();
                ctx.moveTo(0, k.size * 1.1);
                for (let j = 1; j <= 5; j++) {
                    ctx.lineTo(Math.sin(t * 3 + k.phase + j * 0.7) * 4, k.size * 1.1 + j * 7);
                }
                ctx.strokeStyle = `rgba(14,165,233,${k.opacity * 0.45})`;
                ctx.lineWidth = 1;
                ctx.stroke();
                ctx.restore();
            }
        };
        draw();
        window.addEventListener('resize', resize, { passive: true });
        return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize); };
    }, []);
    return <canvas ref={canvasRef} style={{ position: 'fixed', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 0 }} />;
}

// ─── INPUT FIELD ────────────────────────────────────────────
function FloatInput({
    id, label, type = 'text', value, onChange, error, icon, autoComplete,
}: {
    id: string; label: string; type?: string; value: string;
    onChange: (v: string) => void; error?: string; icon: React.ReactNode; autoComplete?: string;
}) {
    const [focused, setFocused] = useState(false);
    const [showPass, setShowPass] = useState(false);
    const lifted = focused || value.length > 0;
    const inputType = type === 'password' ? (showPass ? 'text' : 'password') : type;

    return (
        <div style={{ marginBottom: 20 }}>
            <div style={{
                position: 'relative',
                background: focused ? 'rgba(255,255,255,0.88)' : 'rgba(255,255,255,0.62)',
                border: `1.5px solid ${error ? 'rgba(217,54,32,0.55)' : focused ? 'rgba(14,165,233,0.55)' : 'rgba(255,255,255,0.8)'}`,
                borderRadius: 16,
                backdropFilter: 'blur(14px)',
                WebkitBackdropFilter: 'blur(14px)',
                boxShadow: focused ? `0 0 0 3px rgba(14,165,233,0.12), 0 8px 32px rgba(11,31,58,0.08)` : '0 2px 12px rgba(11,31,58,0.05)',
                transition: 'all .28s cubic-bezier(.4,0,.2,1)',
                overflow: 'hidden',
            }}>
                <div style={{
                    position: 'absolute', top: 0, left: 0, right: 0, height: 2,
                    background: 'linear-gradient(90deg, #0EA5E9, #1565C0)',
                    opacity: focused ? 1 : 0,
                    transition: 'opacity .28s ease',
                }} />

                <span style={{
                    position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)',
                    pointerEvents: 'none', zIndex: 2,
                    color: focused ? '#0EA5E9' : '#7A9ABE',
                    transition: 'color .25s ease',
                    display: 'flex', alignItems: 'center',
                }}>
                    {icon}
                </span>

                <label htmlFor={id} style={{
                    position: 'absolute',
                    left: 50, top: lifted ? 8 : '50%',
                    transform: lifted ? 'none' : 'translateY(-50%)',
                    fontSize: lifted ? 10 : 14.5,
                    fontWeight: lifted ? 700 : 400,
                    color: error ? '#C4340E' : focused ? '#0EA5E9' : '#4A6A8A',
                    fontFamily: "'Montserrat', sans-serif",
                    letterSpacing: lifted ? '.12em' : 0,
                    textTransform: lifted ? 'uppercase' : 'none',
                    transition: 'all .22s cubic-bezier(.4,0,.2,1)',
                    pointerEvents: 'none', zIndex: 2,
                }}>{label}</label>

                <input
                    id={id}
                    type={inputType}
                    value={value}
                    autoComplete={autoComplete}
                    onChange={e => onChange(e.target.value)}
                    onFocus={() => setFocused(true)}
                    onBlur={() => setFocused(false)}
                    style={{
                        width: '100%', border: 'none', background: 'transparent',
                        padding: lifted ? '22px 48px 8px 50px' : '16px 48px 16px 50px',
                        fontSize: 14.5,
                        color: '#0B1F3A',
                        fontFamily: "'Open Sans', sans-serif",
                        outline: 'none',
                        transition: 'padding .22s ease',
                    }}
                />

                {type === 'password' && (
                    <button
                        type="button"
                        onClick={() => setShowPass(p => !p)}
                        style={{
                            position: 'absolute', right: 14, top: '50%',
                            transform: 'translateY(-50%)',
                            background: 'none', border: 'none', cursor: 'pointer',
                            padding: 4, color: '#5A7A9A',
                            transition: 'color .2s ease',
                            display: 'flex', alignItems: 'center',
                        }}
                    >
                        {showPass ? <IconEyeOff size={17} /> : <IconEye size={17} />}
                    </button>
                )}
            </div>
            {error && (
                <p style={{
                    marginTop: 6, marginLeft: 8,
                    fontSize: 11.5, color: '#C4340E',
                    fontFamily: "'Open Sans', sans-serif",
                    fontWeight: 600, letterSpacing: '.04em',
                    animation: 'shake .4s ease',
                    display: 'flex', alignItems: 'center', gap: 4,
                }}>
                    <IconAlertTriangle size={13} /> {error}
                </p>
            )}
        </div>
    );
}

export default function Login({ status, canResetPassword = true }: Props) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '', password: '', remember: false,
    });
    const [mounted, setMounted] = useState(false);
    const [btnHov, setBtnHov] = useState(false);

    useEffect(() => {
        const t = setTimeout(() => setMounted(true), 80);
        return () => { clearTimeout(t); reset('password'); };
    }, []);

    const submit = (e: FormEvent) => {
        e.preventDefault();
        post('/login');
    };

    const card: React.CSSProperties = {
        opacity: mounted ? 1 : 0,
        transform: mounted ? 'translateY(0) scale(1)' : 'translateY(40px) scale(0.96)',
        transition: 'opacity .85s cubic-bezier(.22,1,.36,1), transform .9s cubic-bezier(.22,1,.36,1)',
    };

    return (
        <>
            <Head title="Masuk — Layang-Layang Event 2026" />
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800;900&family=Open+Sans:wght@300;400;600;700&display=swap');
                *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
                body { font-family: 'Open Sans', sans-serif; -webkit-font-smoothing: antialiased; }
                @keyframes shake { 0%,100%{transform:translateX(0)} 20%{transform:translateX(-4px)} 60%{transform:translateX(4px)} 80%{transform:translateX(-2px)} }
                @keyframes orb-drift { 0%,100%{transform:translate(0,0)} 33%{transform:translate(22px,-16px)} 66%{transform:translate(-18px,20px)} }
                @keyframes spin-slow { from{transform:rotate(0)} to{transform:rotate(360deg)} }
                @keyframes shimmer { 0%{background-position:0% 50%} 50%{background-position:100% 50%} 100%{background-position:0% 50%} }
                @keyframes float-kite { 0%,100%{transform:translateY(0) rotate(-6deg)} 50%{transform:translateY(-14px) rotate(6deg)} }
                .gradient-text {
                    background: linear-gradient(135deg, #0A2F5E, #1565C0, #0EA5E9, #38BDF8);
                    background-size: 260%; -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent; background-clip: text;
                    animation: shimmer 6s ease infinite;
                }
                ::-webkit-scrollbar { width: 4px; }
                ::-webkit-scrollbar-thumb { background: linear-gradient(#0EA5E9,#1565C0); border-radius: 2px; }
                input:-webkit-autofill { -webkit-box-shadow: 0 0 0 30px rgba(255,255,255,0.88) inset !important; -webkit-text-fill-color: #0B1F3A !important; }
            `}</style>

            {/* ── BG ── */}
            <div style={{
                minHeight: '100vh', position: 'relative', overflow: 'hidden',
                background: 'linear-gradient(160deg, #A8D8FF 0%, #C4E5FF 22%, #DDF1FF 48%, #C8E8FF 72%, #B0D8FF 100%)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                padding: 'clamp(24px, 5vw, 48px) clamp(16px, 4vw, 24px)',
            }}>
                <ParticleCanvas />

                {[
                    { w: 700, h: 700, top: '-280px', left: '-200px', c: 'radial-gradient(circle, rgba(14,165,233,0.18) 0%, transparent 60%)', dur: '22s' },
                    { w: 500, h: 500, bottom: '-150px', right: '-150px', c: 'radial-gradient(circle, rgba(21,101,192,0.14) 0%, transparent 60%)', dur: '28s' },
                    { w: 380, h: 380, top: '40%', left: '60%', c: 'radial-gradient(circle, rgba(255,255,255,0.44) 0%, transparent 60%)', dur: '18s' },
                ].map((b, i) => (
                    <div key={i} style={{
                        position: 'fixed', borderRadius: '50%',
                        width: b.w, height: b.h, background: b.c,
                        top: (b as any).top, left: (b as any).left,
                        right: (b as any).right, bottom: (b as any).bottom,
                        animation: `orb-drift ${b.dur} ease-in-out infinite`,
                        animationDelay: `${-i * 6}s`, pointerEvents: 'none', zIndex: 0,
                    }} />
                ))}

                <div style={{
                    position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0,
                    backgroundImage: 'radial-gradient(rgba(11,31,58,0.07) 1px, transparent 1px)',
                    backgroundSize: '28px 28px',
                }} />

                {/* ── CARD ── */}
                <div style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: 460, ...card }}>

                    <Link href="/" style={{
                        display: 'inline-flex', alignItems: 'center', gap: 7,
                        color: '#1A3A5C', textDecoration: 'none',
                        fontFamily: "'Open Sans', sans-serif", fontSize: 13, fontWeight: 600,
                        marginBottom: 24, opacity: 0.76,
                        padding: '6px 12px', borderRadius: 999,
                        background: 'rgba(255,255,255,0.5)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255,255,255,0.7)',
                    }}>
                        <IconArrowLeft size={14} /> Kembali ke Beranda
                    </Link>

                    <div style={{
                        background: 'rgba(255,255,255,0.72)',
                        backdropFilter: 'blur(32px) saturate(180%)',
                        WebkitBackdropFilter: 'blur(32px) saturate(180%)',
                        borderRadius: 28,
                        border: '1.5px solid rgba(255,255,255,0.9)',
                        boxShadow: '0 32px 80px rgba(11,31,58,0.14), 0 0 0 1px rgba(14,165,233,0.08), inset 0 1px 0 rgba(255,255,255,0.95)',
                        overflow: 'hidden',
                        position: 'relative',
                    }}>
                        <div style={{
                            height: 5, width: '100%',
                            background: 'linear-gradient(90deg, #0EA5E9 0%, #1565C0 50%, #0A2F5E 100%)',
                        }} />

                        <div style={{ position: 'absolute', top: -60, right: -60, pointerEvents: 'none' }}>
                            {[120, 90, 60].map((s, i) => (
                                <div key={s} style={{
                                    position: 'absolute', top: 0, right: 0,
                                    width: s, height: s, borderRadius: '50%',
                                    border: `1px ${i === 2 ? 'solid' : 'dashed'} rgba(14,165,233,${0.12 + i * 0.07})`,
                                    animation: `spin-slow ${20 + i * 8}s linear infinite ${i % 2 === 0 ? '' : 'reverse'}`,
                                    transform: 'translate(50%, 50%)',
                                }} />
                            ))}
                        </div>

                        <div style={{ padding: 'clamp(32px, 5vw, 44px) clamp(28px, 5vw, 44px)' }}>

                            {/* Logo */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 36 }}>
                                <div style={{
                                    width: 52, height: 52, borderRadius: 16,
                                    background: 'linear-gradient(135deg, #0EA5E9, #1565C0)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    fontSize: 24,
                                    boxShadow: '0 8px 24px rgba(14,165,233,0.42)',
                                    animation: 'float-kite 4s ease-in-out infinite',
                                    flexShrink: 0, padding: 6,
                                }}>
                                    <img src="/images/logo.png" alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                                </div>
                                <div>
                                    <p style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 800, fontSize: 15, color: '#0B1F3A', lineHeight: 1.1, letterSpacing: '-.01em' }}>Layang-Layang</p>
                                    <p style={{ fontSize: 9.5, color: '#5A8AC0', fontWeight: 700, letterSpacing: '.16em', textTransform: 'uppercase', fontFamily: "'Montserrat', sans-serif" }}>KOMPETISI 2026</p>
                                </div>
                            </div>

                            {/* Heading */}
                            <div style={{ marginBottom: 32 }}>
                                <h1 style={{
                                    fontFamily: "'Montserrat', sans-serif", fontWeight: 800,
                                    fontSize: 'clamp(26px, 4vw, 32px)',
                                    color: '#08182E', marginBottom: 8, lineHeight: 1.1,
                                    letterSpacing: '-0.02em',
                                }}>
                                    Selamat<br />
                                    <span className="gradient-text">Datang Kembali</span> 👋
                                </h1>
                                <p style={{ fontSize: 13.5, color: '#2C4A6A', fontFamily: "'Open Sans', sans-serif", fontWeight: 400, lineHeight: 1.65 }}>
                                    Masuk untuk melanjutkan perjalananmu di kompetisi desain layang-layang terbesar Indonesia.
                                </p>
                            </div>

                            {status && (
                                <div style={{
                                    background: 'rgba(14,165,233,0.1)',
                                    border: '1px solid rgba(14,165,233,0.28)',
                                    borderRadius: 12, padding: '10px 16px', marginBottom: 20,
                                    fontSize: 13, color: '#0A4A8C',
                                    fontFamily: "'Open Sans', sans-serif",
                                    display: 'flex', alignItems: 'center', gap: 8,
                                }}>
                                    <IconCircleCheck size={16} color="#0EA5E9" />
                                    {status}
                                </div>
                            )}

                            {/* Form */}
                            <form onSubmit={submit}>
                                <FloatInput
                                    id="email" label="Alamat Email"
                                    type="email" value={data.email}
                                    onChange={v => setData('email', v)}
                                    error={errors.email} icon={<IconMail size={18} />}
                                    autoComplete="username"
                                />
                                <FloatInput
                                    id="password" label="Kata Sandi"
                                    type="password" value={data.password}
                                    onChange={v => setData('password', v)}
                                    error={errors.password} icon={<IconKey size={18} />}
                                    autoComplete="current-password"
                                />

                                <div style={{
                                    display: 'flex', alignItems: 'center',
                                    justifyContent: 'space-between', marginBottom: 28,
                                }}>
                                    <label style={{
                                        display: 'flex', alignItems: 'center', gap: 9,
                                        cursor: 'pointer', fontSize: 13, color: '#2C4A6A',
                                        fontFamily: "'Open Sans', sans-serif",
                                    }}>
                                        <input
                                            type="checkbox"
                                            checked={data.remember}
                                            onChange={e => setData('remember', e.target.checked)}
                                            style={{ width: 17, height: 17, borderRadius: 5, accentColor: '#0EA5E9', cursor: 'pointer' }}
                                        />
                                        Ingat saya
                                    </label>
                                    {canResetPassword && (
                                        <Link href="/forgot-password" style={{
                                            fontSize: 12.5, color: '#0EA5E9',
                                            textDecoration: 'none', fontWeight: 600,
                                            fontFamily: "'Montserrat', sans-serif",
                                            letterSpacing: '.03em',
                                        }}>
                                            Lupa password?
                                        </Link>
                                    )}
                                </div>

                                <button
                                    type="submit"
                                    disabled={processing}
                                    onMouseEnter={() => setBtnHov(true)}
                                    onMouseLeave={() => setBtnHov(false)}
                                    style={{
                                        width: '100%', border: 'none', cursor: processing ? 'not-allowed' : 'pointer',
                                        background: processing
                                            ? 'linear-gradient(135deg, #93C5FD, #60A5FA)'
                                            : btnHov
                                                ? 'linear-gradient(135deg, #0EA5E9, #1256B8)'
                                                : 'linear-gradient(135deg, #1565C0, #0A2F5E)',
                                        color: '#fff',
                                        fontFamily: "'Montserrat', sans-serif",
                                        fontWeight: 800, fontSize: 14.5, letterSpacing: '.08em',
                                        padding: '16px 28px', borderRadius: 16,
                                        boxShadow: btnHov && !processing
                                            ? '0 16px 44px rgba(14,165,233,0.48), 0 0 0 3px rgba(14,165,233,0.16)'
                                            : '0 8px 28px rgba(21,101,192,0.36)',
                                        transform: btnHov && !processing ? 'translateY(-3px) scale(1.02)' : 'translateY(0) scale(1)',
                                        transition: 'all .3s cubic-bezier(.34,1.4,.64,1)',
                                        position: 'relative', overflow: 'hidden',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                                    }}
                                >
                                    {processing ? (
                                        <>
                                            <span style={{
                                                width: 16, height: 16, borderRadius: '50%',
                                                border: '2.5px solid rgba(255,255,255,0.4)',
                                                borderTopColor: '#fff',
                                                display: 'inline-block',
                                                animation: 'spin-slow .8s linear infinite',
                                            }} />
                                            Memproses...
                                        </>
                                    ) : (
                                        <>
                                            Masuk ke Dashboard
                                            <IconArrowRight size={16} />
                                        </>
                                    )}
                                </button>
                            </form>

                            <div style={{ display: 'flex', alignItems: 'center', gap: 14, margin: '28px 0' }}>
                                <div style={{ flex: 1, height: 1, background: 'linear-gradient(90deg, transparent, rgba(14,165,233,0.3))' }} />
                                <span style={{ fontSize: 11.5, color: '#7A9ABE', fontFamily: "'Open Sans', sans-serif", fontWeight: 600, letterSpacing: '.08em' }}>ATAU</span>
                                <div style={{ flex: 1, height: 1, background: 'linear-gradient(90deg, rgba(14,165,233,0.3), transparent)' }} />
                            </div>

                            <p style={{ textAlign: 'center', fontSize: 13.5, color: '#2C4A6A', fontFamily: "'Open Sans', sans-serif" }}>
                                Belum punya akun?{' '}
                                <Link href={register()} style={{
                                    color: '#D93620', fontWeight: 700,
                                    fontFamily: "'Montserrat', sans-serif",
                                    textDecoration: 'none', fontSize: 13.5,
                                    letterSpacing: '.02em',
                                }}>
                                    Daftar Gratis ✨
                                </Link>
                            </p>
                        </div>
                    </div>

                    <p style={{ textAlign: 'center', marginTop: 22, fontSize: 11.5, color: 'rgba(11,31,58,0.45)', fontFamily: "'Open Sans', sans-serif", letterSpacing: '.04em' }}>
                        🪁 Kompetisi Desain Layang-Layang · 2026
                    </p>
                </div>
            </div>
        </>
    );
}

Login.layout = false;