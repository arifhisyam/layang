import { Head, Link, useForm } from '@inertiajs/react';
import { login, register as registerRoute } from '@/routes';
import { useEffect, useRef, useState, FormEvent } from 'react';
import {
    IconArrowLeft,
    IconArrowRight,
    IconMail,
    IconKey,
    IconLock,
    IconUser,
    IconEye,
    IconEyeOff,
    IconAlertTriangle,
    IconCheck,
    IconTrophy,
    IconChartBar,
    IconCloudUpload,
    IconMedal,
    IconUserPlus,
} from '@tabler/icons-react';

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
        const kites = Array.from({ length: 22 }, () => ({
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            vx: (Math.random() - 0.5) * 0.38,
            vy: -0.28 - Math.random() * 0.45,
            size: 2.5 + Math.random() * 7,
            opacity: 0.03 + Math.random() * 0.11,
            phase: Math.random() * Math.PI * 2,
            wobble: 0.007 + Math.random() * 0.011,
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
                ctx.rotate(Math.sin(t * k.wobble * 40 + k.phase) * 0.28);
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
    id, label, type = 'text', value, onChange, error, icon, autoComplete, hint,
}: {
    id: string; label: string; type?: string; value: string;
    onChange: (v: string) => void; error?: string; icon: React.ReactNode;
    autoComplete?: string; hint?: string;
}) {
    const [focused, setFocused] = useState(false);
    const [showPass, setShowPass] = useState(false);
    const lifted = focused || value.length > 0;
    const inputType = type === 'password' ? (showPass ? 'text' : 'password') : type;

    return (
        <div style={{ marginBottom: 18 }}>
            <div style={{
                position: 'relative',
                background: focused ? 'rgba(255,255,255,0.88)' : 'rgba(255,255,255,0.62)',
                border: `1.5px solid ${error ? 'rgba(217,54,32,0.55)' : focused ? 'rgba(14,165,233,0.55)' : 'rgba(255,255,255,0.8)'}`,
                borderRadius: 14,
                backdropFilter: 'blur(14px)',
                WebkitBackdropFilter: 'blur(14px)',
                boxShadow: focused ? '0 0 0 3px rgba(14,165,233,0.12), 0 6px 28px rgba(11,31,58,0.07)' : '0 2px 10px rgba(11,31,58,0.04)',
                transition: 'all .28s cubic-bezier(.4,0,.2,1)',
            }}>
                <div style={{
                    position: 'absolute', top: 0, left: 0, right: 0, height: 2,
                    background: 'linear-gradient(90deg, #0EA5E9, #1565C0)',
                    opacity: focused ? 1 : 0, transition: 'opacity .28s ease',
                    borderRadius: '14px 14px 0 0',
                }} />
                <span style={{
                    position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)',
                    pointerEvents: 'none', zIndex: 2,
                    color: focused ? '#0EA5E9' : '#7A9ABE',
                    transition: 'color .25s ease', display: 'flex', alignItems: 'center',
                }}>
                    {icon}
                </span>
                <label htmlFor={id} style={{
                    position: 'absolute', left: 46, top: lifted ? 7 : '50%',
                    transform: lifted ? 'none' : 'translateY(-50%)',
                    fontSize: lifted ? 9.5 : 14, fontWeight: lifted ? 700 : 400,
                    color: error ? '#C4340E' : focused ? '#0EA5E9' : '#4A6A8A',
                    fontFamily: "'Montserrat', sans-serif",
                    letterSpacing: lifted ? '.13em' : 0,
                    textTransform: lifted ? 'uppercase' : 'none',
                    transition: 'all .22s cubic-bezier(.4,0,.2,1)',
                    pointerEvents: 'none', zIndex: 2,
                }}>{label}</label>
                <input
                    id={id} type={inputType} value={value}
                    autoComplete={autoComplete}
                    onChange={e => onChange(e.target.value)}
                    onFocus={() => setFocused(true)}
                    onBlur={() => setFocused(false)}
                    style={{
                        width: '100%', border: 'none', background: 'transparent',
                        padding: lifted ? '20px 42px 7px 46px' : '15px 42px 15px 46px',
                        fontSize: 14, color: '#0B1F3A',
                        fontFamily: "'Open Sans', sans-serif",
                        outline: 'none', transition: 'padding .22s ease',
                    }}
                />
                {type === 'password' && (
                    <button type="button" onClick={() => setShowPass(p => !p)} style={{
                        position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                        background: 'none', border: 'none', cursor: 'pointer',
                        padding: 4, color: '#5A7A9A', display: 'flex', alignItems: 'center',
                    }}>
                        {showPass ? <IconEyeOff size={16} /> : <IconEye size={16} />}
                    </button>
                )}
            </div>
            {error && (
                <p style={{
                    marginTop: 5, marginLeft: 6, fontSize: 11, color: '#C4340E',
                    fontFamily: "'Open Sans', sans-serif", fontWeight: 600,
                    letterSpacing: '.03em', animation: 'shake .4s ease',
                    display: 'flex', alignItems: 'center', gap: 4,
                }}>
                    <IconAlertTriangle size={12} /> {error}
                </p>
            )}
            {hint && !error && (
                <p style={{ marginTop: 4, marginLeft: 6, fontSize: 11, color: '#7A9ABE', fontFamily: "'Open Sans', sans-serif" }}>{hint}</p>
            )}
        </div>
    );
}

// ─── PROGRESS STEP ──────────────────────────────────────────
function StepDot({ num, active, done }: { num: number; active: boolean; done: boolean }) {
    return (
        <div style={{
            width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
            background: done ? 'linear-gradient(135deg, #0EA5E9, #1565C0)' : active ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.38)',
            border: `2px solid ${active ? '#0EA5E9' : done ? 'transparent' : 'rgba(255,255,255,0.5)'}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: active ? '0 0 0 4px rgba(14,165,233,0.2), 0 4px 14px rgba(14,165,233,0.3)' : 'none',
            transition: 'all .4s cubic-bezier(.34,1.4,.64,1)',
            fontWeight: 800,
            color: done ? '#fff' : active ? '#0EA5E9' : 'rgba(255,255,255,0.6)',
            fontFamily: "'Montserrat', sans-serif",
        }}>
            {done ? <IconCheck size={14} /> : <span style={{ fontSize: 12 }}>{num}</span>}
        </div>
    );
}

const BENEFITS = [
    { icon: <IconChartBar size={14} color="#0EA5E9" />, text: 'Akses dashboard penilaian real-time' },
    { icon: <IconCloudUpload size={14} color="#0EA5E9" />, text: 'Upload & kelola desain layang-layangmu' },
    { icon: <IconMedal size={14} color="#0EA5E9" />, text: 'Kesempatan memenangkan hadiah jutaan rupiah' },
];

export default function Register() {
    const { data, setData, post, processing, errors } = useForm({
        name: '', email: '', password: '', password_confirmation: '',
    });
    const [mounted, setMounted] = useState(false);
    const [btnHov, setBtnHov] = useState(false);
    const [step, setStep] = useState(1);
    const [agreed, setAgreed] = useState(false);

    useEffect(() => {
        const t = setTimeout(() => setMounted(true), 80);
        return () => clearTimeout(t);
    }, []);

    const submit = (e: FormEvent) => { e.preventDefault(); post('/register'); };

    const pw = data.password;
    const strength = [pw.length >= 8, /[A-Z]/.test(pw), /[0-9]/.test(pw), /[^A-Za-z0-9]/.test(pw)].filter(Boolean).length;
    const strengthLabel = ['', 'Lemah', 'Sedang', 'Kuat', 'Sangat Kuat'][strength];
    const strengthColor = ['', '#D93620', '#F59E0B', '#0EA5E9', '#22C55E'][strength];

    const card: React.CSSProperties = {
        opacity: mounted ? 1 : 0,
        transform: mounted ? 'translateY(0) scale(1)' : 'translateY(40px) scale(0.96)',
        transition: 'opacity .85s cubic-bezier(.22,1,.36,1), transform .9s cubic-bezier(.22,1,.36,1)',
    };

    return (
        <>
            <Head title="Daftar — Layang-Layang Event 2026" />
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800;900&family=Open+Sans:wght@300;400;600;700&display=swap');
                *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
                body { font-family: 'Open Sans', sans-serif; -webkit-font-smoothing: antialiased; }
                @keyframes shake { 0%,100%{transform:translateX(0)} 20%{transform:translateX(-4px)} 60%{transform:translateX(4px)} 80%{transform:translateX(-2px)} }
                @keyframes orb-drift { 0%,100%{transform:translate(0,0)} 33%{transform:translate(22px,-16px)} 66%{transform:translate(-18px,20px)} }
                @keyframes spin-slow { from{transform:rotate(0)} to{transform:rotate(360deg)} }
                @keyframes shimmer { 0%{background-position:0% 50%} 50%{background-position:100% 50%} 100%{background-position:0% 50%} }
                @keyframes float-kite { 0%,100%{transform:translateY(0) rotate(-6deg)} 50%{transform:translateY(-14px) rotate(6deg)} }
                @keyframes slide-in { from{opacity:0;transform:translateX(24px)} to{opacity:1;transform:translateX(0)} }
                .gradient-text {
                    background: linear-gradient(135deg, #0A2F5E, #1565C0, #0EA5E9, #38BDF8);
                    background-size: 260%; -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent; background-clip: text;
                    animation: shimmer 6s ease infinite;
                }
                ::-webkit-scrollbar { width: 4px; }
                ::-webkit-scrollbar-thumb { background: linear-gradient(#0EA5E9, #1565C0); border-radius: 2px; }
                input:-webkit-autofill { -webkit-box-shadow: 0 0 0 30px rgba(255,255,255,0.88) inset !important; -webkit-text-fill-color: #0B1F3A !important; }
            `}</style>

            <div style={{
                minHeight: '100vh', position: 'relative', overflow: 'hidden',
                background: 'linear-gradient(160deg, #A8D8FF 0%, #C4E5FF 22%, #DDF1FF 48%, #C8E8FF 72%, #B0D8FF 100%)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                padding: 'clamp(20px, 4vw, 40px) clamp(14px, 3vw, 20px)',
            }}>
                <ParticleCanvas />

                {[
                    { w: 700, h: 700, top: '-280px', left: '-200px', c: 'radial-gradient(circle, rgba(14,165,233,0.18) 0%, transparent 60%)', dur: '22s' },
                    { w: 500, h: 500, bottom: '-150px', right: '-150px', c: 'radial-gradient(circle, rgba(21,101,192,0.14) 0%, transparent 60%)', dur: '28s' },
                    { w: 380, h: 380, top: '40%', left: '60%', c: 'radial-gradient(circle, rgba(255,255,255,0.44) 0%, transparent 60%)', dur: '18s' },
                ].map((b, i) => (
                    <div key={i} style={{
                        position: 'fixed', borderRadius: '50%', pointerEvents: 'none', zIndex: 0,
                        width: b.w, height: b.h, background: b.c,
                        top: (b as any).top, left: (b as any).left,
                        right: (b as any).right, bottom: (b as any).bottom,
                        animation: `orb-drift ${b.dur} ease-in-out infinite`,
                        animationDelay: `${-i * 6}s`,
                    }} />
                ))}

                <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0, backgroundImage: 'radial-gradient(rgba(11,31,58,0.07) 1px, transparent 1px)', backgroundSize: '28px 28px' }} />

                <div style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: 500, ...card }}>

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

                            {/* Logo + step dots */}
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 36 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
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
                                        <p style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 800, fontSize: 15, color: '#0B1F3A', lineHeight: 1.1, letterSpacing: '-.01em' }}>Layang-Layang</p>
                                        <p style={{ fontSize: 9.5, color: '#5A8AC0', fontWeight: 700, letterSpacing: '.16em', textTransform: 'uppercase', fontFamily: "'Montserrat', sans-serif" }}>KOMPETISI 2026</p>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                    <StepDot num={1} active={step === 1} done={step > 1} />
                                    <div style={{ width: 20, height: 2, borderRadius: 1, background: step > 1 ? 'linear-gradient(90deg, #0EA5E9, #1565C0)' : 'rgba(11,31,58,0.15)', transition: 'background .4s ease' }} />
                                    <StepDot num={2} active={step === 2} done={step > 2} />
                                </div>
                            </div>

                            <div style={{ marginBottom: 32 }}>
                                <h1 style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 800, fontSize: 'clamp(26px, 4vw, 32px)', color: '#08182E', marginBottom: 8, lineHeight: 1.1, letterSpacing: '-0.02em' }}>
                                    {step === 1
                                        ? <><span>Bergabung</span><br /><span className="gradient-text">Kompetisi</span> 🎨</>
                                        : <><span>Amankan</span><br /><span className="gradient-text">Akunmu</span> 🔐</>
                                    }
                                </h1>
                                <p style={{ fontSize: 13.5, color: '#2C4A6A', fontFamily: "'Open Sans', sans-serif", fontWeight: 400, lineHeight: 1.65 }}>
                                    {step === 1
                                        ? 'Langkah 1 dari 2 — Siapa kamu? Kenalkan dirimu kepada kami!'
                                        : 'Langkah 2 dari 2 — Buat kata sandi yang kuat untuk melindungi akunmu.'}
                                </p>
                            </div>

                            <form onSubmit={submit} style={{ animation: 'slide-in .35s ease' }}>
                                {step === 1 && (
                                    <>
                                        <FloatInput id="name" label="Nama Lengkap" value={data.name} onChange={v => setData('name', v)} error={errors.name} icon={<IconUser size={17} />} autoComplete="name" hint="Nama yang akan tampil di leaderboard" />
                                        <FloatInput id="email" label="Alamat Email" type="email" value={data.email} onChange={v => setData('email', v)} error={errors.email} icon={<IconMail size={17} />} autoComplete="username" hint="Kami tidak akan mengirim spam" />

                                        <div style={{
                                            background: 'linear-gradient(135deg, rgba(14,165,233,0.07), rgba(21,101,192,0.05))',
                                            border: '1px solid rgba(14,165,233,0.2)',
                                            borderRadius: 14, padding: '14px 18px', marginBottom: 22,
                                        }}>
                                            <p style={{ fontSize: 10.5, fontWeight: 700, color: '#0A4A8C', letterSpacing: '.12em', textTransform: 'uppercase', fontFamily: "'Montserrat', sans-serif", marginBottom: 10, display: 'flex', alignItems: 'center', gap: 6 }}>
                                                <IconTrophy size={13} color="#0A4A8C" /> Kamu akan mendapatkan
                                            </p>
                                            {BENEFITS.map(b => (
                                                <p key={b.text} style={{ fontSize: 12.5, color: '#1A3A5C', fontFamily: "'Open Sans', sans-serif", marginBottom: 5, lineHeight: 1.5, display: 'flex', alignItems: 'center', gap: 7 }}>
                                                    <span style={{ flexShrink: 0 }}>{b.icon}</span> {b.text}
                                                </p>
                                            ))}
                                        </div>

                                        <button
                                            type="button"
                                            disabled={!data.name.trim() || !data.email.trim()}
                                            onClick={() => setStep(2)}
                                            onMouseEnter={() => setBtnHov(true)}
                                            onMouseLeave={() => setBtnHov(false)}
                                            style={{
                                                width: '100%', border: 'none',
                                                cursor: !data.name.trim() || !data.email.trim() ? 'not-allowed' : 'pointer',
                                                background: !data.name.trim() || !data.email.trim()
                                                    ? 'linear-gradient(135deg, #93C5FD, #60A5FA)'
                                                    : btnHov ? 'linear-gradient(135deg, #0EA5E9, #1256B8)' : 'linear-gradient(135deg, #1565C0, #0A2F5E)',
                                                color: '#fff', fontFamily: "'Montserrat', sans-serif", fontWeight: 800, fontSize: 14.5, letterSpacing: '.08em',
                                                padding: '16px 28px', borderRadius: 16,
                                                boxShadow: btnHov && data.name && data.email ? '0 16px 44px rgba(14,165,233,0.48), 0 0 0 3px rgba(14,165,233,0.16)' : '0 8px 28px rgba(21,101,192,0.36)',
                                                transform: btnHov && data.name && data.email ? 'translateY(-3px) scale(1.02)' : 'translateY(0) scale(1)',
                                                transition: 'all .3s cubic-bezier(.34,1.4,.64,1)',
                                                opacity: !data.name.trim() || !data.email.trim() ? 0.6 : 1,
                                                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                                            }}
                                        >
                                            Lanjut <IconArrowRight size={16} />
                                        </button>
                                    </>
                                )}

                                {step === 2 && (
                                    <>
                                        <button type="button" onClick={() => setStep(1)} style={{
                                            background: 'none', border: 'none', cursor: 'pointer',
                                            color: '#5A7A9A', fontSize: 12.5, marginBottom: 18,
                                            fontFamily: "'Open Sans', sans-serif", fontWeight: 600,
                                            display: 'flex', alignItems: 'center', gap: 6, padding: 0,
                                        }}>
                                            <IconArrowLeft size={14} /> Kembali ke langkah 1
                                        </button>

                                        <FloatInput id="password" label="Kata Sandi" type="password" value={data.password} onChange={v => setData('password', v)} error={errors.password} icon={<IconKey size={17} />} autoComplete="new-password" />

                                        {pw.length > 0 && (
                                            <div style={{ marginBottom: 16, marginTop: -10 }}>
                                                <div style={{ display: 'flex', gap: 4, marginBottom: 5 }}>
                                                    {[1, 2, 3, 4].map(i => (
                                                        <div key={i} style={{ flex: 1, height: 3, borderRadius: 2, background: strength >= i ? strengthColor : 'rgba(11,31,58,0.1)', transition: 'background .3s ease' }} />
                                                    ))}
                                                </div>
                                                <p style={{ fontSize: 11, color: strengthColor, fontWeight: 700, fontFamily: "'Montserrat', sans-serif", letterSpacing: '.06em' }}>{strengthLabel}</p>
                                            </div>
                                        )}

                                        <FloatInput
                                            id="password_confirmation" label="Konfirmasi Kata Sandi" type="password"
                                            value={data.password_confirmation} onChange={v => setData('password_confirmation', v)}
                                            error={errors.password_confirmation} icon={<IconLock size={17} />} autoComplete="new-password"
                                            hint={data.password_confirmation && data.password === data.password_confirmation ? '✅ Kata sandi cocok' : undefined}
                                        />

                                        <label style={{
                                            display: 'flex', alignItems: 'flex-start', gap: 10,
                                            cursor: 'pointer', marginBottom: 22, padding: '12px 14px',
                                            background: agreed ? 'rgba(14,165,233,0.07)' : 'rgba(255,255,255,0.5)',
                                            border: `1px solid ${agreed ? 'rgba(14,165,233,0.3)' : 'rgba(255,255,255,0.7)'}`,
                                            borderRadius: 12, transition: 'all .25s ease',
                                        }}>
                                            <input type="checkbox" checked={agreed} onChange={e => setAgreed(e.target.checked)} style={{ marginTop: 2, width: 16, height: 16, accentColor: '#0EA5E9', cursor: 'pointer', flexShrink: 0 }} />
                                            <span style={{ fontSize: 12.5, color: '#2C4A6A', fontFamily: "'Open Sans', sans-serif", lineHeight: 1.6 }}>
                                                Saya menyetujui{' '}
                                                <a href="#" style={{ color: '#0EA5E9', fontWeight: 700, textDecoration: 'none' }}>Syarat & Ketentuan</a>
                                                {' '}dan{' '}
                                                <a href="#" style={{ color: '#0EA5E9', fontWeight: 700, textDecoration: 'none' }}>Kebijakan Privasi</a>
                                                {' '}kompetisi ini
                                            </span>
                                        </label>

                                        <button
                                            type="submit"
                                            disabled={processing || !agreed}
                                            onMouseEnter={() => setBtnHov(true)}
                                            onMouseLeave={() => setBtnHov(false)}
                                            style={{
                                                width: '100%', border: 'none',
                                                cursor: processing || !agreed ? 'not-allowed' : 'pointer',
                                                background: processing || !agreed
                                                    ? 'linear-gradient(135deg, #93C5FD, #60A5FA)'
                                                    : btnHov ? 'linear-gradient(135deg, #0EA5E9, #1256B8)' : 'linear-gradient(135deg, #1565C0, #0A2F5E)',
                                                color: '#fff', fontFamily: "'Montserrat', sans-serif", fontWeight: 800, fontSize: 14.5, letterSpacing: '.08em',
                                                padding: '16px 28px', borderRadius: 16,
                                                boxShadow: btnHov && !processing && agreed ? '0 16px 44px rgba(14,165,233,0.48), 0 0 0 3px rgba(14,165,233,0.16)' : '0 8px 28px rgba(21,101,192,0.36)',
                                                transform: btnHov && !processing && agreed ? 'translateY(-3px) scale(1.02)' : 'translateY(0) scale(1)',
                                                transition: 'all .3s cubic-bezier(.34,1.4,.64,1)',
                                                opacity: !agreed ? 0.6 : 1,
                                                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                                            }}
                                        >
                                            {processing ? (
                                                <>
                                                    <span style={{ width: 16, height: 16, borderRadius: '50%', border: '2.5px solid rgba(255,255,255,0.4)', borderTopColor: '#fff', display: 'inline-block', animation: 'spin-slow .8s linear infinite' }} />
                                                    Mendaftarkan...
                                                </>
                                            ) : (
                                                <>Daftar Sekarang <IconUserPlus size={16} /></>
                                            )}
                                        </button>
                                    </>
                                )}
                            </form>

                            <div style={{ display: 'flex', alignItems: 'center', gap: 14, margin: '28px 0' }}>
                                <div style={{ flex: 1, height: 1, background: 'linear-gradient(90deg, transparent, rgba(14,165,233,0.3))' }} />
                                <span style={{ fontSize: 11.5, color: '#7A9ABE', fontFamily: "'Open Sans', sans-serif", fontWeight: 600, letterSpacing: '.08em' }}>SUDAH PUNYA AKUN?</span>
                                <div style={{ flex: 1, height: 1, background: 'linear-gradient(90deg, rgba(14,165,233,0.3), transparent)' }} />
                            </div>

                            <p style={{ textAlign: 'center', fontSize: 13.5, color: '#2C4A6A', fontFamily: "'Open Sans', sans-serif" }}>
                                <Link href={login()} style={{
                                    color: '#1565C0', fontWeight: 700,
                                    fontFamily: "'Montserrat', sans-serif",
                                    textDecoration: 'none', fontSize: 13.5,
                                    display: 'inline-flex', alignItems: 'center', gap: 6,
                                }}>
                                    <IconArrowLeft size={14} /> Masuk ke Akun
                                </Link>
                            </p>
                        </div>
                    </div>

                    <p style={{ textAlign: 'center', marginTop: 22, fontSize: 11.5, color: 'rgba(11,31,58,0.45)', fontFamily: "'Open Sans', sans-serif", letterSpacing: '.04em' }}>
                        🪁 Gratis · Tidak perlu kartu kredit · Mulai dalam 2 menit
                    </p>
                </div>
            </div>
        </>
    );
}

Register.layout = false;