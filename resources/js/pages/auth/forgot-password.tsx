import { Form, Head } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { login } from '@/routes';
import { email } from '@/routes/password';
import { useEffect, useRef, useState } from 'react';
import { IconCircleCheck, IconMail, IconArrowLeft } from '@tabler/icons-react';

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
            x: Math.random() * window.innerWidth, y: Math.random() * window.innerHeight,
            vx: (Math.random() - 0.5) * 0.4, vy: -0.3 - Math.random() * 0.5,
            size: 3 + Math.random() * 8, opacity: 0.04 + Math.random() * 0.12,
            phase: Math.random() * Math.PI * 2, wobble: 0.008 + Math.random() * 0.012,
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
                ctx.moveTo(0, -k.size * 1.4); ctx.lineTo(k.size, 0);
                ctx.lineTo(0, k.size * 1.1); ctx.lineTo(-k.size, 0);
                ctx.closePath();
                ctx.fillStyle = `rgba(14,165,233,${k.opacity})`; ctx.fill();
                ctx.beginPath(); ctx.moveTo(0, k.size * 1.1);
                for (let j = 1; j <= 5; j++) ctx.lineTo(Math.sin(t * 3 + k.phase + j * 0.7) * 4, k.size * 1.1 + j * 7);
                ctx.strokeStyle = `rgba(14,165,233,${k.opacity * 0.45})`; ctx.lineWidth = 1; ctx.stroke();
                ctx.restore();
            }
        };
        draw();
        window.addEventListener('resize', resize, { passive: true });
        return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize); };
    }, []);
    return <canvas ref={canvasRef} style={{ position: 'fixed', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 0 }} />;
}

export default function ForgotPassword({ status }: { status?: string }) {
    const [mounted, setMounted] = useState(false);
    useEffect(() => { const t = setTimeout(() => setMounted(true), 80); return () => clearTimeout(t); }, []);

    return (
        <>
            <Head title="Lupa Kata Sandi — Layang-Layang Event 2026" />
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800;900&family=Open+Sans:wght@300;400;600;700&display=swap');
                *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
                body { font-family: 'Open Sans', sans-serif; -webkit-font-smoothing: antialiased; }
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
                input:-webkit-autofill { -webkit-box-shadow: 0 0 0 30px rgba(255,255,255,0.88) inset !important; -webkit-text-fill-color: #0B1F3A !important; }
            `}</style>

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

                <div style={{
                    position: 'relative', zIndex: 1, width: '100%', maxWidth: 460,
                    opacity: mounted ? 1 : 0,
                    transform: mounted ? 'translateY(0) scale(1)' : 'translateY(40px) scale(0.96)',
                    transition: 'opacity .85s cubic-bezier(.22,1,.36,1), transform .9s cubic-bezier(.22,1,.36,1)',
                }}>
                    <TextLink href={login()} style={{
                        display: 'inline-flex', alignItems: 'center', gap: 7,
                        color: '#1A3A5C', textDecoration: 'none',
                        fontFamily: "'Open Sans', sans-serif", fontSize: 13, fontWeight: 600,
                        marginBottom: 24, opacity: 0.76,
                        padding: '6px 12px', borderRadius: 999,
                        background: 'rgba(255,255,255,0.5)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255,255,255,0.7)',
                    }}>
                        <IconArrowLeft size={14} /> Kembali ke Login
                    </TextLink>

                    <div style={{
                        background: 'rgba(255,255,255,0.72)',
                        backdropFilter: 'blur(32px) saturate(180%)',
                        WebkitBackdropFilter: 'blur(32px) saturate(180%)',
                        borderRadius: 28,
                        border: '1.5px solid rgba(255,255,255,0.9)',
                        boxShadow: '0 32px 80px rgba(11,31,58,0.14), 0 0 0 1px rgba(14,165,233,0.08), inset 0 1px 0 rgba(255,255,255,0.95)',
                        overflow: 'hidden', position: 'relative',
                    }}>
                        <div style={{ height: 5, width: '100%', background: 'linear-gradient(90deg, #0EA5E9 0%, #1565C0 50%, #0A2F5E 100%)' }} />

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
                                    boxShadow: '0 8px 24px rgba(14,165,233,0.42)',
                                    animation: 'float-kite 4s ease-in-out infinite',
                                    flexShrink: 0, padding: 6,
                                }}>
                                    <img src="/images/logo.png" alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                                </div>
                                <div>
                                    <p style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 800, fontSize: 15, color: '#0B1F3A', lineHeight: 1.1 }}>Layang-Layang</p>
                                    <p style={{ fontSize: 9.5, color: '#5A8AC0', fontWeight: 700, letterSpacing: '.16em', textTransform: 'uppercase', fontFamily: "'Montserrat', sans-serif" }}>KOMPETISI 2026</p>
                                </div>
                            </div>

                            <div style={{ marginBottom: 32 }}>
                                <h1 style={{
                                    fontFamily: "'Montserrat', sans-serif", fontWeight: 800,
                                    fontSize: 'clamp(22px, 4vw, 28px)', color: '#08182E', marginBottom: 8, lineHeight: 1.1,
                                }}>
                                    <span className="gradient-text">Lupa Kata Sandi?</span> 🔑
                                </h1>
                                <p style={{ fontSize: 13.5, color: '#2C4A6A', fontFamily: "'Open Sans', sans-serif", lineHeight: 1.65 }}>
                                    Masukkan alamat emailmu dan kami akan mengirimkan tautan untuk mengatur ulang kata sandimu.
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

                            <Form {...email.form()}>
                                {({ processing, errors }) => (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                                            <label htmlFor="email" style={{
                                                fontFamily: "'Montserrat', sans-serif", fontWeight: 700,
                                                fontSize: 12, color: '#1A3A5C', letterSpacing: '.08em', textTransform: 'uppercase',
                                            }}>Alamat Email</label>
                                            <div style={{
                                                position: 'relative',
                                                background: 'rgba(255,255,255,0.75)',
                                                border: '1.5px solid rgba(255,255,255,0.9)',
                                                borderRadius: 14, overflow: 'hidden',
                                                boxShadow: '0 2px 12px rgba(11,31,58,0.06)',
                                                display: 'flex', alignItems: 'center',
                                            }}>
                                                <span style={{ paddingLeft: 14, color: '#7A9ABE', display: 'flex', alignItems: 'center', flexShrink: 0 }}>
                                                    <IconMail size={18} />
                                                </span>
                                                <Input
                                                    id="email"
                                                    type="email"
                                                    name="email"
                                                    autoComplete="off"
                                                    autoFocus
                                                    placeholder="email@example.com"
                                                    style={{
                                                        border: 'none', background: 'transparent',
                                                        padding: '14px 16px', fontSize: 14.5,
                                                        color: '#0B1F3A', fontFamily: "'Open Sans', sans-serif",
                                                        outline: 'none', width: '100%',
                                                    }}
                                                />
                                            </div>
                                            <InputError message={errors.email} />
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={processing}
                                            data-test="email-password-reset-link-button"
                                            style={{
                                                width: '100%', border: 'none',
                                                cursor: processing ? 'not-allowed' : 'pointer',
                                                background: processing
                                                    ? 'linear-gradient(135deg, #93C5FD, #60A5FA)'
                                                    : 'linear-gradient(135deg, #1565C0, #0A2F5E)',
                                                color: '#fff',
                                                fontFamily: "'Montserrat', sans-serif",
                                                fontWeight: 800, fontSize: 14.5, letterSpacing: '.08em',
                                                padding: '16px 28px', borderRadius: 16,
                                                boxShadow: '0 8px 28px rgba(21,101,192,0.36)',
                                                transition: 'all .3s cubic-bezier(.34,1.4,.64,1)',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                                            }}
                                        >
                                            {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                                            Kirim Tautan Reset
                                        </button>
                                    </div>
                                )}
                            </Form>
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

ForgotPassword.layout = {
    title: 'Forgot password',
    description: 'Enter your email to receive a password reset link',
};