import { Head, Link } from '@inertiajs/react';
import { login, register } from '@/routes';
import { useEffect, useRef, useState, CSSProperties } from 'react';

interface RankItem {
    rank: number;
    id: number;
    judul: string;
    file_path: string;
    peserta: string;
    user_id: number;
    nilai_rata_rata: number;
    jumlah_juri: number;
    detail: {
        tema: number;
        kreativitas: number;
        estetik: number;
        teknik: number;
    };
}

interface Props {
    rankings: RankItem[];
}

// ─── REVEAL HOOK ───────────────────────────────────────────
function useReveal(threshold = 0.10) {
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

// ─── NAVBAR (sama seperti landing) ─────────────────────────
function Nav({ scrolled }: { scrolled: boolean }) {
    const [expanded, setExpanded] = useState(false);
    const [loginHov, setLoginHov] = useState(false);
    const [regHov, setRegHov] = useState(false);

    useEffect(() => {
        const t = setTimeout(() => setExpanded(true), 300);
        return () => clearTimeout(t);
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
                background: scrolled ? 'rgba(14,100,180,0.82)' : 'rgba(14,100,180,0.55)',
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
                    <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0, textDecoration: 'none' }}>
                        <div style={{
                            width: 42, height: 42, borderRadius: '50%',
                            background: 'linear-gradient(135deg, #0EA5E9, #1565C0)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            flexShrink: 0, boxShadow: '0 0 18px rgba(14,165,233,0.55)',
                            overflow: 'hidden', padding: 2,
                        }}>
                            <img src="/images/logo.png" alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                        </div>
                        <div style={{
                            opacity: expanded ? 1 : 0,
                            transform: expanded ? 'translateX(0)' : 'translateX(-10px)',
                            transition: 'opacity .5s .3s ease, transform .5s .3s ease',
                            whiteSpace: 'nowrap',
                        }}>
                            <p style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 800, fontSize: 12, color: '#fff', lineHeight: 1, letterSpacing: '-.01em' }}>Layang-Layang</p>
                            <p style={{ fontSize: 8, color: '#BAE6FD', fontWeight: 600, letterSpacing: '.14em', textTransform: 'uppercase', fontFamily: "'Open Sans', sans-serif" }}>KOMPETISI 2026</p>
                        </div>
                    </Link>

                    <div style={{
                        display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0,
                        opacity: expanded ? 1 : 0,
                        transform: expanded ? 'translateX(0)' : 'translateX(10px)',
                        transition: 'opacity .5s .5s ease, transform .5s .5s ease',
                    }}>
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
                                whiteSpace: 'nowrap', transition: 'all .24s ease',
                                display: 'inline-flex', alignItems: 'center', gap: 5,
                            }}>
                            <i className="ti ti-login" style={{ fontSize: 13 }} />
                            Masuk
                        </Link>
                        <Link href={register()}
                            onMouseEnter={() => setRegHov(true)}
                            onMouseLeave={() => setRegHov(false)}
                            style={{
                                background: regHov ? 'linear-gradient(135deg, #FF6E50, #E84025)' : 'linear-gradient(135deg, #FF5733, #D93620)',
                                color: '#fff', textDecoration: 'none',
                                fontFamily: "'Montserrat', sans-serif",
                                fontWeight: 700, fontSize: 11.5,
                                padding: '7px 14px', borderRadius: 999,
                                boxShadow: regHov ? '0 10px 30px rgba(255,87,51,0.7)' : '0 4px 16px rgba(255,87,51,0.45)',
                                whiteSpace: 'nowrap', letterSpacing: '.05em',
                                transition: 'all .28s cubic-bezier(.34,1.4,.64,1)',
                                display: 'inline-flex', alignItems: 'center', gap: 5,
                            }}>
                            <i className="ti ti-user-plus" style={{ fontSize: 13 }} />
                            Daftar
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

// ─── PODIUM CARD ───────────────────────────────────────────
function PodiumCard({ item, isCenter }: { item: RankItem; isCenter: boolean }) {
    const [hov, setHov] = useState(false);
    const [imgLoaded, setImgLoaded] = useState(false);

    const configs = {
        1: { medal: '🥇', color: '#F59E0B', bg: 'linear-gradient(135deg, #FEF3C7, #FDE68A)', border: 'rgba(245,158,11,0.5)', glow: 'rgba(245,158,11,0.35)', podiumH: 120, size: 148 },
        2: { medal: '🥈', color: '#94A3B8', bg: 'linear-gradient(135deg, #F1F5F9, #E2E8F0)', border: 'rgba(148,163,184,0.5)', glow: 'rgba(148,163,184,0.25)', podiumH: 88, size: 116 },
        3: { medal: '🥉', color: '#CD7C2F', bg: 'linear-gradient(135deg, #FEF3E2, #FDE8C2)', border: 'rgba(205,124,47,0.5)', glow: 'rgba(205,124,47,0.25)', podiumH: 68, size: 104 },
    };
    const cfg = configs[item.rank as 1|2|3] ?? configs[3];

    return (
        <div
            onMouseEnter={() => setHov(true)}
            onMouseLeave={() => setHov(false)}
            style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center',
                transform: hov ? 'translateY(-10px)' : isCenter ? 'translateY(-16px)' : 'translateY(0)',
                transition: 'transform .45s cubic-bezier(.34,1.4,.64,1)',
                zIndex: isCenter ? 2 : 1,
            }}
        >
            {/* Photo card */}
            <div style={{
                position: 'relative',
                marginBottom: 12,
                filter: hov ? `drop-shadow(0 20px 40px ${cfg.glow})` : `drop-shadow(0 8px 24px ${cfg.glow})`,
                transition: 'filter .4s ease',
            }}>
                {/* Glow ring */}
                <div style={{
                    position: 'absolute', inset: -4, borderRadius: 20,
                    border: `2px solid ${cfg.color}`,
                    opacity: hov ? 0.8 : 0.4,
                    transition: 'opacity .35s ease',
                    animation: isCenter ? 'ring-pulse-gold 2.8s ease-out infinite' : 'none',
                }} />

                <div style={{
                    width: cfg.size, height: cfg.size,
                    borderRadius: 18, overflow: 'hidden',
                    border: `3px solid ${cfg.color}`,
                    background: 'rgba(196,229,255,0.3)',
                    position: 'relative',
                }}>
                    {!imgLoaded && (
                        <div style={{
                            position: 'absolute', inset: 0,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            background: 'rgba(14,165,233,0.06)',
                        }}>
                            <i className="ti ti-photo" style={{ fontSize: 28, color: 'rgba(14,165,233,0.3)' }} />
                        </div>
                    )}
                    <img
                        src={`/storage/${item.file_path}`}
                        alt={item.judul}
                        onLoad={() => setImgLoaded(true)}
                        style={{
                            width: '100%', height: '100%', objectFit: 'cover',
                            display: imgLoaded ? 'block' : 'none',
                            transform: hov ? 'scale(1.07)' : 'scale(1)',
                            transition: 'transform .5s cubic-bezier(.34,1.2,.64,1)',
                        }}
                    />
                </div>

                {/* Medal badge */}
                <div style={{
                    position: 'absolute', top: -12, right: -12,
                    width: 36, height: 36, borderRadius: '50%',
                    background: 'rgba(255,255,255,0.95)',
                    backdropFilter: 'blur(10px)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 18,
                    boxShadow: `0 4px 16px ${cfg.glow}, 0 0 0 2px ${cfg.color}44`,
                    animation: isCenter ? 'bounce-medal 2.2s ease-in-out infinite' : 'none',
                }}>
                    {cfg.medal}
                </div>
            </div>

            {/* Info */}
            <div style={{
                textAlign: 'center',
                maxWidth: cfg.size + 16,
                marginBottom: 14,
            }}>
                <p style={{
                    fontFamily: "'Montserrat', sans-serif",
                    fontWeight: 800,
                    fontSize: isCenter ? 15 : 13,
                    color: '#0B1F3A',
                    marginBottom: 3,
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                    maxWidth: cfg.size + 16,
                }}>{item.peserta}</p>
                <p style={{
                    fontSize: 11, color: '#4A7A9B',
                    fontFamily: "'Open Sans', sans-serif",
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                    maxWidth: cfg.size + 16,
                    marginBottom: 6,
                }}>{item.judul}</p>
                <div style={{
                    display: 'inline-flex', alignItems: 'center', gap: 4,
                    background: cfg.bg,
                    border: `1px solid ${cfg.border}`,
                    borderRadius: 999,
                    padding: '4px 12px',
                    boxShadow: `0 4px 14px ${cfg.glow}`,
                }}>
                    <i className="ti ti-star-filled" style={{ fontSize: 11, color: cfg.color }} />
                    <span style={{
                        fontFamily: "'Montserrat', sans-serif",
                        fontWeight: 800, fontSize: isCenter ? 18 : 15,
                        color: cfg.color,
                    }}>{item.nilai_rata_rata}</span>
                </div>
            </div>

            {/* Podium block */}
            <div style={{
                width: isCenter ? 88 : 72,
                height: cfg.podiumH,
                borderRadius: '14px 14px 0 0',
                background: item.rank === 1
                    ? 'linear-gradient(180deg, #F59E0B, #D97706)'
                    : item.rank === 2
                    ? 'linear-gradient(180deg, #94A3B8, #64748B)'
                    : 'linear-gradient(180deg, #CD7C2F, #A0521A)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: `0 -8px 28px ${cfg.glow}`,
                position: 'relative', overflow: 'hidden',
            }}>
                {/* Sheen */}
                <div style={{
                    position: 'absolute', top: 0, left: 0, right: 0, height: '40%',
                    background: 'rgba(255,255,255,0.18)',
                    borderRadius: '14px 14px 0 0',
                }} />
                <span style={{
                    fontFamily: "'Montserrat', sans-serif",
                    fontWeight: 900, fontSize: 22,
                    color: 'rgba(255,255,255,0.92)',
                    position: 'relative', zIndex: 1,
                    textShadow: '0 2px 8px rgba(0,0,0,0.2)',
                }}>#{item.rank}</span>
            </div>
        </div>
    );
}

// ─── CRITERIA BAR ──────────────────────────────────────────
function CritBar({ label, value, color }: { label: string; value: number; color: string }) {
    const [width, setWidth] = useState(0);
    useEffect(() => {
        const t = setTimeout(() => setWidth(value), 120);
        return () => clearTimeout(t);
    }, [value]);

    return (
        <div style={{ marginBottom: 4 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                <span style={{ fontSize: 9, color: '#4A7A9B', fontFamily: "'Open Sans', sans-serif", letterSpacing: '.06em', textTransform: 'uppercase' }}>{label}</span>
                <span style={{ fontSize: 9, fontFamily: "'Montserrat', sans-serif", fontWeight: 700, color }}>{value}</span>
            </div>
            <div style={{ height: 4, background: 'rgba(14,165,233,0.1)', borderRadius: 2, overflow: 'hidden' }}>
                <div style={{
                    height: '100%',
                    width: `${width}%`,
                    background: `linear-gradient(90deg, ${color}, ${color}99)`,
                    borderRadius: 2,
                    transition: 'width 1s cubic-bezier(.22,1,.36,1)',
                }} />
            </div>
        </div>
    );
}

// ─── ROW CARD ──────────────────────────────────────────────
function RankRow({ item, delay }: { item: RankItem; delay: number }) {
    const { ref, visible } = useReveal(0.05);
    const [hov, setHov] = useState(false);
    const [expanded, setExpanded] = useState(false);

    const isTop3 = item.rank <= 3;
    const medalColors: Record<number, string> = { 1: '#F59E0B', 2: '#94A3B8', 3: '#CD7C2F' };
    const medalEmoji: Record<number, string> = { 1: '🥇', 2: '🥈', 3: '🥉' };
    const rankColor = medalColors[item.rank] ?? '#0EA5E9';

    return (
        <div
            ref={ref}
            onMouseEnter={() => setHov(true)}
            onMouseLeave={() => setHov(false)}
            style={{
                opacity: visible ? 1 : 0,
                transform: visible ? 'translateX(0)' : 'translateX(-24px)',
                transition: `opacity .6s ${delay}ms ease, transform .6s ${delay}ms cubic-bezier(.34,1.2,.64,1)`,
            }}
        >
            <div
                onClick={() => setExpanded(e => !e)}
                style={{
                    display: 'grid',
                    gridTemplateColumns: '52px 1fr auto',
                    alignItems: 'center',
                    gap: 'clamp(8px, 2vw, 16px)',
                    padding: 'clamp(10px, 2vw, 16px) clamp(12px, 3vw, 24px)',
                    background: hov
                        ? isTop3 ? 'rgba(255,255,255,0.96)' : 'rgba(255,255,255,0.82)'
                        : isTop3 ? 'rgba(255,255,255,0.72)' : 'rgba(255,255,255,0.52)',
                    backdropFilter: 'blur(18px)',
                    WebkitBackdropFilter: 'blur(18px)',
                    border: `1.5px solid ${hov ? rankColor + '33' : 'rgba(255,255,255,0.82)'}`,
                    borderRadius: expanded ? '18px 18px 0 0' : 18,
                    boxShadow: hov
                        ? `0 12px 40px rgba(11,31,58,0.12), 0 0 0 1px ${rankColor}22`
                        : '0 2px 12px rgba(11,31,58,0.06)',
                    cursor: 'pointer',
                    transition: 'all .3s cubic-bezier(.34,1.2,.64,1)',
                    position: 'relative',
                }}
            >
                {/* Top accent bar for top 3 */}
                {isTop3 && (
                    <div style={{
                        position: 'absolute', top: 0, left: 0, right: 0, height: 2.5,
                        background: `linear-gradient(90deg, ${rankColor}, ${rankColor}55)`,
                        borderRadius: '18px 18px 0 0',
                        opacity: hov ? 1 : 0.5,
                        transition: 'opacity .3s ease',
                    }} />
                )}

                {/* Rank */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    {isTop3 ? (
                        <div style={{
                            width: 40, height: 40, borderRadius: '50%',
                            background: rankColor + '15',
                            border: `2px solid ${rankColor}44`,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: 18,
                            transform: hov ? 'scale(1.12) rotate(-8deg)' : 'scale(1)',
                            transition: 'transform .35s cubic-bezier(.34,1.56,.64,1)',
                        }}>
                            {medalEmoji[item.rank]}
                        </div>
                    ) : (
                        <div style={{
                            width: 36, height: 36, borderRadius: '50%',
                            background: hov ? 'rgba(14,165,233,0.12)' : 'rgba(14,165,233,0.06)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            transition: 'background .3s ease',
                        }}>
                            <span style={{
                                fontFamily: "'Montserrat', sans-serif",
                                fontWeight: 800, fontSize: 12,
                                color: '#4A7A9B',
                            }}>#{item.rank}</span>
                        </div>
                    )}
                </div>

                {/* Desain info */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 'clamp(8px, 2vw, 14px)', overflow: 'hidden' }}>
                    <div style={{
                        width: 'clamp(40px, 8vw, 52px)',
                        height: 'clamp(40px, 8vw, 52px)',
                        borderRadius: 12, overflow: 'hidden', flexShrink: 0,
                        border: `2px solid ${rankColor}33`,
                        boxShadow: hov ? `0 6px 20px ${rankColor}28` : 'none',
                        transition: 'box-shadow .3s ease',
                    }}>
                        <img
                            src={`/storage/${item.file_path}`}
                            alt={item.judul}
                            style={{
                                width: '100%', height: '100%', objectFit: 'cover',
                                transform: hov ? 'scale(1.1)' : 'scale(1)',
                                transition: 'transform .45s cubic-bezier(.34,1.2,.64,1)',
                            }}
                        />
                    </div>
                    <div style={{ overflow: 'hidden' }}>
                        <p style={{
                            fontFamily: "'Montserrat', sans-serif",
                            fontWeight: 700, fontSize: 'clamp(12px, 2.5vw, 14px)',
                            color: '#0B1F3A', marginBottom: 3,
                            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                        }}>{item.judul}</p>
                        <p style={{
                            fontSize: 'clamp(10px, 2vw, 12px)', color: '#4A7A9B',
                            fontFamily: "'Open Sans', sans-serif",
                            display: 'flex', alignItems: 'center', gap: 4,
                        }}>
                            <i className="ti ti-user-circle" style={{ fontSize: 12 }} />
                            {item.peserta}
                        </p>
                    </div>
                </div>

                {/* Score + expand hint */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
                    <div style={{
                        textAlign: 'right',
                    }}>
                        <div style={{
                            display: 'inline-flex', alignItems: 'center', gap: 5,
                            background: isTop3
                                ? `linear-gradient(135deg, ${rankColor}20, ${rankColor}10)`
                                : 'rgba(14,165,233,0.08)',
                            border: `1.5px solid ${rankColor}33`,
                            borderRadius: 999, padding: '5px 12px',
                        }}>
                            <i className="ti ti-star-filled" style={{ fontSize: 11, color: isTop3 ? rankColor : '#0EA5E9' }} />
                            <span style={{
                                fontFamily: "'Montserrat', sans-serif",
                                fontWeight: 800,
                                fontSize: 'clamp(14px, 3vw, 18px)',
                                color: isTop3 ? rankColor : '#1565C0',
                            }}>{item.nilai_rata_rata}</span>
                        </div>
                        <p style={{
                            fontSize: 9, color: '#94A3B8',
                            fontFamily: "'Open Sans', sans-serif",
                            marginTop: 3, textAlign: 'center',
                            letterSpacing: '.05em',
                        }}>{item.jumlah_juri} juri</p>
                    </div>
                    <i className={`ti ti-chevron-${expanded ? 'up' : 'down'}`} style={{
                        fontSize: 14, color: '#94A3B8',
                        transition: 'transform .3s ease',
                        flexShrink: 0,
                    }} />
                </div>
            </div>

            {/* Expanded detail */}
            <div style={{
                maxHeight: expanded ? 120 : 0,
                overflow: 'hidden',
                transition: 'max-height .45s cubic-bezier(.4,0,.2,1)',
            }}>
                <div style={{
                    background: 'rgba(255,255,255,0.88)',
                    backdropFilter: 'blur(16px)',
                    border: `1.5px solid ${rankColor}22`,
                    borderTop: 'none',
                    borderRadius: '0 0 18px 18px',
                    padding: '14px clamp(12px, 3vw, 24px) 16px',
                }}>
                    <p style={{
                        fontSize: 10, fontWeight: 700, letterSpacing: '.12em',
                        textTransform: 'uppercase', color: '#4A7A9B',
                        fontFamily: "'Montserrat', sans-serif",
                        marginBottom: 10,
                    }}>Detail Penilaian</p>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px 24px' }}>
                        <CritBar label="Tema" value={item.detail.tema} color="#0EA5E9" />
                        <CritBar label="Kreativitas" value={item.detail.kreativitas} color="#1565C0" />
                        <CritBar label="Estetik" value={item.detail.estetik} color="#A86100" />
                        <CritBar label="Teknik" value={item.detail.teknik} color="#C4340E" />
                    </div>
                </div>
            </div>
        </div>
    );
}

// ─── MAIN ──────────────────────────────────────────────────
export default function Leaderboard({ rankings }: Props) {
    const [scrolled, setScrolled] = useState(false);
    const [heroIn, setHeroIn] = useState(false);
    const headerReveal = useReveal(0.05);
    const tableReveal = useReveal(0.05);

    useEffect(() => {
        const t = setTimeout(() => setHeroIn(true), 100);
        const onScroll = () => setScrolled(window.scrollY > 60);
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => { clearTimeout(t); window.removeEventListener('scroll', onScroll); };
    }, []);

    const top3 = rankings.slice(0, 3);
    const rest = rankings.slice(3);
    // Podium order: 2nd - 1st - 3rd
    const podiumOrder = [top3[1], top3[0], top3[2]].filter(Boolean) as RankItem[];

    const slide = (d: number): CSSProperties => ({
        opacity: heroIn ? 1 : 0,
        transform: heroIn ? 'translateY(0)' : 'translateY(32px)',
        transition: `opacity .9s ease ${d}ms, transform .95s cubic-bezier(.22,1,.36,1) ${d}ms`,
    });

    return (
        <>
            <Head title="Leaderboard — Layang-Layang Event" />
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800;900&family=Open+Sans:wght@300;400;500;600;700&display=swap');
                *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
                html { scroll-behavior: smooth; }
                body { font-family: 'Open Sans', sans-serif; -webkit-font-smoothing: antialiased; overflow-x: hidden; }
                ::-webkit-scrollbar { width: 5px; }
                ::-webkit-scrollbar-track { background: #C8E9FF; }
                ::-webkit-scrollbar-thumb { background: linear-gradient(#0EA5E9, #1565C0); border-radius: 3px; }

                @keyframes orb-drift { 0%,100%{transform:translate(0,0)} 33%{transform:translate(26px,-18px)} 66%{transform:translate(-20px,24px)} }
                @keyframes shimmer { 0%{background-position:0% 50%} 50%{background-position:100% 50%} 100%{background-position:0% 50%} }
                @keyframes ring-pulse-gold { 0%{opacity:.5;transform:scale(1)} 100%{opacity:0;transform:scale(1.14)} }
                @keyframes bounce-medal { 0%,100%{transform:translateY(0) rotate(0deg)} 40%{transform:translateY(-6px) rotate(-8deg)} 70%{transform:translateY(-3px) rotate(4deg)} }
                @keyframes float-med { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-12px)} }
                @keyframes trophy-spin { 0%{transform:rotateY(0deg)} 100%{transform:rotateY(360deg)} }
                @keyframes blink-dot { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.4;transform:scale(0.7)} }

                .gradient-text-sky {
                    background: linear-gradient(135deg, #0A2F5E 0%, #1565C0 32%, #0EA5E9 62%, #38BDF8 100%);
                    background-size: 280%;
                    -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
                    animation: shimmer 7s ease infinite;
                }
                .gradient-text-gold {
                    background: linear-gradient(135deg, #A86100, #F59E0B 52%, #A86100);
                    background-size: 200%;
                    -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
                    animation: shimmer 4.5s ease infinite;
                }

                .section-wrap {
                    max-width: 900px; margin: 0 auto;
                    padding: clamp(24px, 5vw, 56px) clamp(16px, 5vw, 36px);
                    position: relative; z-index: 1;
                }

                .podium-stage {
                    display: flex;
                    align-items: flex-end;
                    justify-content: center;
                    gap: clamp(8px, 3vw, 28px);
                }

                .rank-list {
                    display: flex;
                    flex-direction: column;
                    gap: clamp(8px, 1.5vw, 12px);
                }

                @media (max-width: 480px) {
                    .podium-stage { gap: 6px; }
                }
            `}</style>

            <div style={{
                minHeight: '100vh',
                background: 'linear-gradient(170deg, #A8D8FF 0%, #C4E5FF 16%, #DDF1FF 38%, #CBE8FF 62%, #B0D8FF 100%)',
                position: 'relative', overflowX: 'hidden',
            }}>

                {/* Orb background */}
                <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none', overflow: 'hidden' }}>
                    {[
                        { w: 600, h: 600, top: '-200px', left: '-160px', c: 'radial-gradient(circle, rgba(14,165,233,0.16) 0%, transparent 62%)', dur: '24s', delay: '0s' },
                        { w: 500, h: 500, top: '20%', right: '-140px', c: 'radial-gradient(circle, rgba(255,255,255,0.5) 0%, transparent 62%)', dur: '30s', delay: '-7s' },
                        { w: 400, h: 400, bottom: '-80px', left: '24%', c: 'radial-gradient(circle, rgba(14,165,233,0.10) 0%, transparent 60%)', dur: '21s', delay: '-13s' },
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

                {/* Dot grid */}
                <div style={{
                    position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none',
                    backgroundImage: 'radial-gradient(rgba(11,31,58,0.07) 1px, transparent 1px)',
                    backgroundSize: '30px 30px',
                }} />

                <Nav scrolled={scrolled} />

                {/* ─── HEADER ──────────────────────────────── */}
                <div style={{ paddingTop: 'clamp(90px, 18vw, 140px)', textAlign: 'center', position: 'relative', zIndex: 1, padding: 'clamp(90px, 18vw, 140px) clamp(16px, 5vw, 36px) 0' }}>

                    {/* Eyebrow */}
                    <div style={slide(80)}>
                        <span style={{
                            display: 'inline-flex', alignItems: 'center', gap: 8,
                            background: 'rgba(255,255,255,0.74)',
                            border: '1.5px solid rgba(245,158,11,0.35)',
                            backdropFilter: 'blur(14px)',
                            color: '#92400E', letterSpacing: '.12em',
                            textTransform: 'uppercase', marginBottom: 18,
                            fontFamily: "'Montserrat', sans-serif",
                            boxShadow: '0 4px 18px rgba(245,158,11,0.12)',
                            padding: '5px 16px', borderRadius: 999,
                            fontSize: 'clamp(9px, 2.5vw, 11px)', fontWeight: 700,
                        }}>
                            <span style={{
                                width: 7, height: 7, borderRadius: '50%',
                                background: '#F59E0B', display: 'inline-block',
                                boxShadow: '0 0 10px rgba(245,158,11,0.8)',
                                animation: 'blink-dot 1.6s ease-in-out infinite',
                                flexShrink: 0,
                            }} />
                            Live Ranking · 2026
                        </span>
                    </div>

                    {/* Trophy + Title */}
                    <div style={slide(160)}>
                        <div style={{
                            fontSize: 'clamp(48px, 12vw, 80px)',
                            marginBottom: 8,
                            display: 'inline-block',
                            animation: 'float-med 3.5s ease-in-out infinite',
                            filter: 'drop-shadow(0 8px 24px rgba(245,158,11,0.4))',
                        }}>🏆</div>
                        <h1 style={{
                            fontFamily: "'Montserrat', sans-serif",
                            fontWeight: 900,
                            fontSize: 'clamp(32px, 8vw, 68px)',
                            lineHeight: 1.08, letterSpacing: '-0.025em',
                            marginBottom: 14,
                        }}>
                            <span className="gradient-text-sky">LEADER</span>
                            <span className="gradient-text-gold">BOARD</span>
                        </h1>
                    </div>

                    <div style={slide(280)}>
                        <p style={{
                            fontSize: 'clamp(13px, 3.5vw, 16px)',
                            color: '#1A3A5C',
                            fontFamily: "'Open Sans', sans-serif",
                            fontWeight: 300, lineHeight: 1.8,
                            maxWidth: 480, margin: '0 auto clamp(16px, 4vw, 36px)',
                        }}>
                            Ranking peserta berdasarkan <strong style={{ color: '#1256A8', fontWeight: 700 }}>rata-rata penilaian juri profesional</strong> dari 4 kriteria utama
                        </p>
                    </div>
                </div>

                {rankings.length === 0 ? (
                    /* ─── EMPTY STATE ─── */
                    <div className="section-wrap" style={{ textAlign: 'center' }}>
                        <div style={{
                            background: 'rgba(255,255,255,0.68)',
                            backdropFilter: 'blur(20px)',
                            border: '1.5px solid rgba(255,255,255,0.88)',
                            borderRadius: 28,
                            padding: 'clamp(48px, 10vw, 96px) clamp(24px, 6vw, 64px)',
                            boxShadow: '0 8px 32px rgba(11,31,58,0.08)',
                        }}>
                            <div style={{
                                width: 100, height: 100, borderRadius: '50%',
                                background: 'rgba(14,165,233,0.07)',
                                border: '2px dashed rgba(14,165,233,0.28)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                margin: '0 auto 24px', fontSize: 40,
                            }}>📋</div>
                            <h3 style={{
                                fontFamily: "'Montserrat', sans-serif",
                                fontWeight: 800, fontSize: 'clamp(18px, 4vw, 24px)',
                                color: '#0B1F3A', marginBottom: 12,
                            }}>Belum Ada Penilaian</h3>
                            <p style={{
                                fontSize: 'clamp(13px, 3vw, 15px)', color: '#4A7A9B',
                                fontFamily: "'Open Sans', sans-serif",
                                maxWidth: 360, margin: '0 auto 28px', lineHeight: 1.8,
                            }}>
                                Leaderboard akan muncul setelah juri memberikan penilaian pertama.
                            </p>
                            <Link href="/" style={{
                                display: 'inline-flex', alignItems: 'center', gap: 8,
                                background: 'linear-gradient(135deg, #0EA5E9, #1565C0)',
                                color: '#fff', textDecoration: 'none',
                                fontFamily: "'Montserrat', sans-serif", fontWeight: 700,
                                fontSize: 13, padding: '11px 24px', borderRadius: 999,
                                boxShadow: '0 8px 28px rgba(14,165,233,0.35)',
                            }}>
                                <i className="ti ti-arrow-left" style={{ fontSize: 15 }} />
                                Kembali ke Beranda
                            </Link>
                        </div>
                    </div>
                ) : (
                    <>
                        {/* ─── PODIUM ──────────────────────────── */}
                        {top3.length > 0 && (
                            <div className="section-wrap" style={{ paddingBottom: 0 }}>
                                <div style={{
                                    background: 'rgba(255,255,255,0.42)',
                                    backdropFilter: 'blur(24px)',
                                    border: '1.5px solid rgba(255,255,255,0.78)',
                                    borderRadius: 32,
                                    padding: 'clamp(28px, 5vw, 56px) clamp(16px, 4vw, 48px) 0',
                                    boxShadow: '0 8px 40px rgba(11,31,58,0.09)',
                                    overflow: 'hidden',
                                    position: 'relative',
                                }}>
                                    {/* Subtle section label */}
                                    <p style={{
                                        textAlign: 'center', marginBottom: 'clamp(20px, 4vw, 40px)',
                                        fontSize: 10, fontWeight: 700, letterSpacing: '.18em',
                                        textTransform: 'uppercase', color: '#A86100',
                                        fontFamily: "'Montserrat', sans-serif",
                                    }}>— PODIUM JUARA —</p>

                                    <div className="podium-stage">
                                        {podiumOrder.map((item) => (
                                            <PodiumCard key={item.id} item={item} isCenter={item.rank === 1} />
                                        ))}
                                    </div>

                                    {/* Stage floor */}
                                    <div style={{
                                        height: 18,
                                        background: 'linear-gradient(180deg, rgba(14,165,233,0.14) 0%, rgba(14,165,233,0.06) 100%)',
                                        borderTop: '1.5px solid rgba(14,165,233,0.18)',
                                        marginTop: 0,
                                    }} />
                                </div>
                            </div>
                        )}

                        {/* ─── DIVIDER ─────────────────────────── */}
                        <div style={{ maxWidth: 900, margin: '0 auto', padding: 'clamp(20px, 4vw, 36px) clamp(16px, 5vw, 36px) 0' }}>
                            <div style={{ height: 1.5, background: 'linear-gradient(90deg, transparent, rgba(14,165,233,0.45), rgba(21,101,192,0.35), transparent)', borderRadius: 1 }} />
                        </div>

                        {/* ─── RANKING LIST ─────────────────────── */}
                        <div className="section-wrap">
                            {/* Section header */}
                            <div ref={tableReveal.ref} style={{
                                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                flexWrap: 'wrap', gap: 10,
                                marginBottom: 'clamp(16px, 3vw, 28px)',
                                opacity: tableReveal.visible ? 1 : 0,
                                transform: tableReveal.visible ? 'translateY(0)' : 'translateY(18px)',
                                transition: 'opacity .7s ease, transform .7s ease',
                            }}>
                                <div>
                                    <p style={{
                                        fontSize: 'clamp(9px, 2.5vw, 11px)', fontWeight: 700,
                                        letterSpacing: '.18em', textTransform: 'uppercase',
                                        color: '#0EA5E9', marginBottom: 6,
                                        fontFamily: "'Montserrat', sans-serif",
                                    }}>— SEMUA RANKING —</p>
                                    <h2 style={{
                                        fontFamily: "'Montserrat', sans-serif",
                                        fontWeight: 800,
                                        fontSize: 'clamp(20px, 4.5vw, 32px)',
                                        color: '#0B1F3A', lineHeight: 1.1,
                                    }}>
                                        <span className="gradient-text-sky">Daftar Peserta</span>
                                    </h2>
                                </div>
                                <div style={{
                                    background: 'rgba(255,255,255,0.72)',
                                    backdropFilter: 'blur(14px)',
                                    border: '1.5px solid rgba(255,255,255,0.88)',
                                    borderRadius: 999, padding: '8px 18px',
                                    display: 'flex', alignItems: 'center', gap: 8,
                                    boxShadow: '0 4px 16px rgba(11,31,58,0.07)',
                                }}>
                                    <i className="ti ti-users" style={{ fontSize: 15, color: '#0EA5E9' }} />
                                    <span style={{
                                        fontFamily: "'Montserrat', sans-serif",
                                        fontWeight: 700, fontSize: 14,
                                        color: '#0B1F3A',
                                    }}>{rankings.length}</span>
                                    <span style={{
                                        fontSize: 11, color: '#4A7A9B',
                                        fontFamily: "'Open Sans', sans-serif",
                                    }}>peserta dinilai</span>
                                </div>
                            </div>

                            {/* Hint */}
                            <p style={{
                                fontSize: 11, color: '#94A3B8',
                                fontFamily: "'Open Sans', sans-serif",
                                marginBottom: 'clamp(12px, 2.5vw, 20px)',
                                display: 'flex', alignItems: 'center', gap: 5,
                            }}>
                                <i className="ti ti-info-circle" style={{ fontSize: 13 }} />
                                Klik kartu untuk melihat detail penilaian per kriteria
                            </p>

                            <div className="rank-list">
                                {rankings.map((item, i) => (
                                    <RankRow key={item.id} item={item} delay={Math.min(i * 40, 320)} />
                                ))}
                            </div>
                        </div>
                    </>
                )}

                {/* ─── BACK LINK ───────────────────────────── */}
                <div style={{ textAlign: 'center', padding: '0 16px clamp(40px, 8vw, 80px)', position: 'relative', zIndex: 1 }}>
                    <Link href="/" style={{
                        display: 'inline-flex', alignItems: 'center', gap: 8,
                        background: 'rgba(255,255,255,0.70)',
                        color: '#0B2855',
                        textDecoration: 'none',
                        fontFamily: "'Open Sans', sans-serif", fontWeight: 700,
                        fontSize: 'clamp(12px, 3vw, 14px)',
                        padding: 'clamp(10px, 2.5vw, 13px) clamp(20px, 5vw, 32px)',
                        borderRadius: 999,
                        border: '1.5px solid rgba(14,165,233,0.35)',
                        backdropFilter: 'blur(14px)',
                        boxShadow: '0 4px 18px rgba(14,165,233,0.1)',
                        transition: 'all .3s ease',
                    }}
                        onMouseEnter={e => {
                            (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.95)';
                            (e.currentTarget as HTMLElement).style.transform = 'translateY(-3px)';
                            (e.currentTarget as HTMLElement).style.boxShadow = '0 12px 32px rgba(14,165,233,0.18)';
                        }}
                        onMouseLeave={e => {
                            (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.70)';
                            (e.currentTarget as HTMLElement).style.transform = '';
                            (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 18px rgba(14,165,233,0.1)';
                        }}
                    >
                        <i className="ti ti-arrow-left" style={{ fontSize: 15 }} />
                        Kembali ke Beranda
                    </Link>
                </div>

                {/* ─── FOOTER ──────────────────────────────── */}
                <div style={{
                    borderTop: '1px solid rgba(14,165,233,0.18)',
                    textAlign: 'center',
                    padding: 'clamp(18px, 3vw, 30px) clamp(16px, 5vw, 36px)',
                    color: '#1A3A5C', position: 'relative', zIndex: 1,
                    fontFamily: "'Open Sans', sans-serif", fontWeight: 400,
                    fontSize: 'clamp(11px, 3vw, 13px)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                }}>
                    <img src="/images/logo.png" alt="Logo" style={{
                        width: 'clamp(20px, 4vw, 28px)', height: 'clamp(20px, 4vw, 28px)',
                        objectFit: 'contain',
                        filter: 'drop-shadow(0 0 8px rgba(14,165,233,0.48))',
                    }} />
                    © 2025{' '}
                    <strong style={{ color: '#1565C0', fontFamily: "'Montserrat', sans-serif", fontWeight: 700 }}>Layang-Layang Event</strong>
                    {' '}· All rights reserved.
                </div>
            </div>
        </>
    );
}