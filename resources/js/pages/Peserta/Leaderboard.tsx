import { Link } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import PesertaSidebar from '@/components/PesertaSidebar';
import {
    IconTrophy,
    IconUsers,
    IconCrown,
    IconBrush,
    IconBulb,
    IconSparkles,
    IconTool,
    IconHourglass,
    IconClipboardList,
    IconListNumbers,
    IconMedal,
    IconUserStar,
} from '@tabler/icons-react';

interface AuthUser { name: string; email: string; role: string; }
interface RankItem {
    rank: number; id: number; judul: string; file_path: string;
    peserta: string; user_id: number; nilai_rata_rata: number; jumlah_juri: number;
    detail: { tema: number; kreativitas: number; estetik: number; teknik: number; };
}
interface Props {
    auth: { user: AuthUser };
    rankings: RankItem[];
    my_rank: RankItem | null;
}

const PAGE_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700;800;900&family=Plus+Jakarta+Sans:wght@300;400;500;600&display=swap');

  @keyframes float-medal { 0%,100%{transform:translateY(0) rotate(-4deg)} 50%{transform:translateY(-8px) rotate(4deg)} }

  @keyframes slideFromTop    { from{opacity:0;transform:translateY(-36px)} to{opacity:1;transform:translateY(0)} }
  @keyframes slideFromLeft   { from{opacity:0;transform:translateX(-56px)} to{opacity:1;transform:translateX(0)} }
  @keyframes slideFromRight  { from{opacity:0;transform:translateX(56px)}  to{opacity:1;transform:translateX(0)} }
  @keyframes slideFromBottom { from{opacity:0;transform:translateY(36px)}  to{opacity:1;transform:translateY(0)} }
  @keyframes popIn           { from{opacity:0;transform:scale(0.7) rotate(-15deg)} to{opacity:1;transform:scale(1) rotate(0deg)} }
  @keyframes fadeScale       { from{opacity:0;transform:scale(0.93)} to{opacity:1;transform:scale(1)} }

  .pl-ready .anim-top    { animation: slideFromTop    0.55s cubic-bezier(0.22,1,0.36,1) both; }
  .pl-ready .anim-left   { animation: slideFromLeft   0.55s cubic-bezier(0.22,1,0.36,1) both; }
  .pl-ready .anim-right  { animation: slideFromRight  0.55s cubic-bezier(0.22,1,0.36,1) both; }
  .pl-ready .anim-bottom { animation: slideFromBottom 0.55s cubic-bezier(0.22,1,0.36,1) both; }
  .pl-ready .anim-pop    { animation: popIn           0.45s cubic-bezier(0.34,1.56,0.64,1) both; }
  .pl-ready .anim-scale  { animation: fadeScale       0.45s cubic-bezier(0.22,1,0.36,1) both; }

  .pl-ready .delay-1 { animation-delay: 0.06s; }
  .pl-ready .delay-2 { animation-delay: 0.14s; }
  .pl-ready .delay-3 { animation-delay: 0.22s; }
  .pl-ready .delay-4 { animation-delay: 0.30s; }
  .pl-ready .delay-5 { animation-delay: 0.38s; }

  .pl-ready .podium-0 { animation-delay: 0.28s; }
  .pl-ready .podium-1 { animation-delay: 0.14s; }
  .pl-ready .podium-2 { animation-delay: 0.42s; }

  .pl-ready .row-anim { animation: slideFromLeft 0.45s cubic-bezier(0.22,1,0.36,1) both; }
  .pl-ready .row-0  { animation-delay: 0.36s; }
  .pl-ready .row-1  { animation-delay: 0.42s; }
  .pl-ready .row-2  { animation-delay: 0.48s; }
  .pl-ready .row-3  { animation-delay: 0.54s; }
  .pl-ready .row-4  { animation-delay: 0.60s; }
  .pl-ready .row-5  { animation-delay: 0.66s; }
  .pl-ready .row-6  { animation-delay: 0.72s; }
  .pl-ready .row-7  { animation-delay: 0.78s; }
  .pl-ready .row-8  { animation-delay: 0.84s; }
  .pl-ready .row-9  { animation-delay: 0.90s; }

  .anim-top, .anim-left, .anim-right, .anim-bottom, .anim-pop, .anim-scale, .row-anim { opacity: 0; }

  .pl-page { font-family:'Plus Jakarta Sans',sans-serif; }

  .pl-card {
    background: rgba(255,255,255,0.75);
    backdrop-filter: blur(20px);
    border: 1px solid rgba(255,255,255,0.9);
    border-radius: 24px;
  }
  .pl-podium-item {
    display: flex; flex-direction: column; align-items: center; gap: 12px;
    transition: transform .25s ease;
  }
  .pl-podium-item:hover { transform: translateY(-4px); }

  .pl-row {
    display: flex; align-items: center;
    border-bottom: 1px solid rgba(14,165,233,0.06);
    transition: background .18s ease;
  }
  .pl-row:last-child { border-bottom: none; }
  .pl-row:hover { background: rgba(14,165,233,0.04); }
  .pl-row.is-me { background: rgba(14,165,233,0.06); position: relative; }
  .pl-row.is-me::before {
    content:''; position:absolute; left:0; top:0; bottom:0; width:3px;
    background:linear-gradient(180deg,#0EA5E9,#1565C0); border-radius:0 2px 2px 0;
  }
  .pl-rank-badge {
    width:34px; height:34px; border-radius:10px;
    display:flex; align-items:center; justify-content:center;
    font-family:'Montserrat',sans-serif; font-weight:900; font-size:13px;
  }
  .pl-main::-webkit-scrollbar { width: 5px; }
  .pl-main::-webkit-scrollbar-track { background: transparent; }
  .pl-main::-webkit-scrollbar-thumb { background: rgba(14,100,180,0.2); border-radius: 10px; }
  .pl-chip {
    display:inline-flex; align-items:center; gap:4px;
    background:rgba(14,165,233,0.08); border:1px solid rgba(14,165,233,0.15);
    border-radius:999px; padding:3px 10px; font-size:11px; font-weight:600; color:#4A6A8A;
  }

  @media (max-width: 768px) {
    .pl-mobile-spacer { height: 56px; }
    .pl-main { padding-bottom: 80px !important; }
    .pl-podium-wrap { gap: 16px !important; }
    .pl-table-row-detail { display: none !important; }
  }
`;

const MEDAL = (rank: number) => {
    if (rank === 1) return { color: '#F59E0B', bg: 'rgba(245,158,11,0.12)', gradient: 'linear-gradient(135deg, #F59E0B, #D97706)' };
    if (rank === 2) return { color: '#94A3B8', bg: 'rgba(148,163,184,0.12)', gradient: 'linear-gradient(135deg, #94A3B8, #64748B)' };
    if (rank === 3) return { color: '#D97706', bg: 'rgba(217,119,6,0.12)',   gradient: 'linear-gradient(135deg, #D97706, #B45309)' };
    return { color: '#94A3B8', bg: 'rgba(148,163,184,0.08)', gradient: '' };
};
const RANK_GRADIENT: Record<number,string> = {
    1: 'linear-gradient(135deg, #F59E0B, #D97706)',
    2: 'linear-gradient(135deg, #94A3B8, #64748B)',
    3: 'linear-gradient(135deg, #D97706, #B45309)',
};
const MY_BANNER_GRADIENT = (rank: number) =>
    rank === 1 ? 'linear-gradient(135deg, #F59E0B, #EF8C07)' :
    rank === 2 ? 'linear-gradient(135deg, #94A3B8, #64748B)' :
    rank === 3 ? 'linear-gradient(135deg, #D97706, #B45309)' :
    'linear-gradient(135deg, #0EA5E9, #1565C0)';

const CRITERIA = [
    { Icon: IconBrush,    label: 'Tema',    key: 'tema'        as const, color: '#6366F1' },
    { Icon: IconBulb,     label: 'Kreatif', key: 'kreativitas' as const, color: '#EC4899' },
    { Icon: IconSparkles, label: 'Estetik', key: 'estetik'     as const, color: '#F59E0B' },
    { Icon: IconTool,     label: 'Teknik',  key: 'teknik'      as const, color: '#10B981' },
];

export default function PesertaLeaderboard({ auth, rankings, my_rank }: Props) {
    const [ready, setReady] = useState(false);

    useEffect(() => {
        const t = requestAnimationFrame(() => requestAnimationFrame(() => setReady(true)));
        return () => cancelAnimationFrame(t);
    }, []);

    const top3        = rankings.slice(0, 3);
    const podiumOrder = [top3[1], top3[0], top3[2]].filter(Boolean);

    return (
        <>
            <style>{PAGE_STYLES}</style>
            <div className={`pl-page min-h-screen flex${ready ? ' pl-ready' : ''}`}
                style={{ background: 'linear-gradient(150deg, #EFF8FF 0%, #DBEFFE 40%, #E0EFFE 100%)' }}>

                <PesertaSidebar user={auth.user} activePage="leaderboard" />

                <main className="pl-main flex-1 min-w-0 overflow-y-auto" style={{ padding: 0 }}>
                    <div className="pl-mobile-spacer" />
                    <div style={{ maxWidth: 900, margin: '0 auto', padding: '36px 24px 60px' }}>

                        {/* ══ HEADER ══ */}
                        <div className="anim-top delay-1" style={{ marginBottom: 32 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
                                <div className="anim-pop delay-1" style={{
                                    width: 48, height: 48, borderRadius: 16,
                                    background: 'linear-gradient(135deg, #F59E0B, #D97706)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    boxShadow: '0 8px 24px rgba(245,158,11,0.4)',
                                }}>
                                    <IconTrophy size={22} color="#fff" />
                                </div>
                                <div>
                                    <h1 style={{ fontFamily: "'Montserrat',sans-serif", fontWeight: 900, fontSize: 22, color: '#0B1F3A', lineHeight: 1.2 }}>Leaderboard</h1>
                                    <p style={{ fontSize: 13, color: '#6B8AAA', fontWeight: 500, marginTop: 2 }}>Kompetisi Desain Layang-Layang 2026</p>
                                </div>
                                <div style={{ marginLeft: 'auto' }}>
                                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, background: 'rgba(245,158,11,0.12)', color: '#D97706', border: '1px solid rgba(245,158,11,0.25)', borderRadius: 999, padding: '6px 16px', fontSize: 12, fontWeight: 700, fontFamily: "'Montserrat',sans-serif" }}>
                                        <IconUsers size={13} />{rankings.length} peserta
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* ══ MY RANK BANNER ══ */}
                        {my_rank ? (
                            <div className="anim-left delay-2" style={{
                                background: MY_BANNER_GRADIENT(my_rank.rank),
                                borderRadius: 24, padding: '24px 28px', marginBottom: 28,
                                position: 'relative', overflow: 'hidden',
                                boxShadow: my_rank.rank <= 3 ? '0 12px 40px rgba(245,158,11,0.35)' : '0 12px 40px rgba(14,165,233,0.35)',
                            }}>
                                <div style={{ position: 'absolute', top: -30, right: -30, width: 160, height: 160, borderRadius: '50%', background: 'rgba(255,255,255,0.07)' }} />
                                <div style={{ position: 'absolute', bottom: -40, right: 120, width: 120, height: 120, borderRadius: '50%', background: 'rgba(255,255,255,0.04)' }} />
                                <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
                                    <div style={{ fontFamily: "'Montserrat',sans-serif", fontWeight: 900, fontSize: 60, color: 'rgba(255,255,255,0.2)', lineHeight: 1, flexShrink: 0 }}>#{my_rank.rank}</div>
                                    <img src={`/storage/${my_rank.file_path}`} alt={my_rank.judul}
                                        style={{ width: 70, height: 70, borderRadius: 18, objectFit: 'cover', border: '3px solid rgba(255,255,255,0.4)', flexShrink: 0, boxShadow: '0 6px 20px rgba(0,0,0,0.2)' }} />
                                    <div style={{ flex: 1, minWidth: 140 }}>
                                        <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.65)', fontWeight: 700, letterSpacing: '.14em', textTransform: 'uppercase', marginBottom: 5 }}>Posisimu Saat Ini</p>
                                        <p style={{ fontFamily: "'Montserrat',sans-serif", fontWeight: 800, fontSize: 18, color: '#fff', lineHeight: 1.2, marginBottom: 8 }}>{my_rank.judul}</p>
                                        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                                            {CRITERIA.map(c => (
                                                <span key={c.key} style={{ fontSize: 12, color: 'rgba(255,255,255,0.8)', display: 'flex', alignItems: 'center', gap: 4 }}>
                                                    <c.Icon size={13} />{my_rank.detail[c.key]}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                                        <p style={{ fontFamily: "'Montserrat',sans-serif", fontWeight: 900, fontSize: 44, color: '#fff', lineHeight: 1 }}>{my_rank.nilai_rata_rata}</p>
                                        <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.65)', marginTop: 2 }}>rata-rata</p>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="anim-left delay-2" style={{
                                background: 'rgba(255,255,255,0.7)', border: '1.5px solid rgba(245,158,11,0.25)',
                                borderRadius: 20, padding: '18px 22px', marginBottom: 28,
                                display: 'flex', alignItems: 'center', gap: 14, backdropFilter: 'blur(12px)',
                            }}>
                                <div style={{ width: 44, height: 44, borderRadius: 14, background: 'rgba(245,158,11,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                    <IconHourglass size={22} color="#D97706" />
                                </div>
                                <div>
                                    <p style={{ fontFamily: "'Montserrat',sans-serif", fontWeight: 700, fontSize: 14, color: '#92400E' }}>Belum Ada Penilaian</p>
                                    <p style={{ fontSize: 13, color: '#B45309', marginTop: 2 }}>Posisimu akan muncul di sini setelah juri memberikan nilai.</p>
                                </div>
                            </div>
                        )}

                        {rankings.length === 0 ? (
                            <div className="pl-card anim-scale delay-3" style={{ padding: '70px 40px', textAlign: 'center' }}>
                                <IconClipboardList size={56} color="rgba(14,165,233,0.2)" style={{ display: 'block', margin: '0 auto 16px' }} />
                                <p style={{ fontFamily: "'Montserrat',sans-serif", fontWeight: 800, fontSize: 18, color: '#0B1F3A', marginBottom: 8 }}>Belum Ada Penilaian</p>
                                <p style={{ fontSize: 14, color: '#8AACCC' }}>Leaderboard akan terisi saat juri mulai memberikan penilaian.</p>
                            </div>
                        ) : (<>
                            {/* ══ PODIUM ══ */}
                            {top3.length >= 1 && (
                                <div className="pl-card anim-bottom delay-3" style={{
                                    padding: '36px 28px 32px', marginBottom: 24,
                                    background: 'linear-gradient(180deg, rgba(255,255,255,0.85) 0%, rgba(255,248,232,0.85) 100%)',
                                }}>
                                    <div style={{ textAlign: 'center', marginBottom: 32 }}>
                                        <p style={{ fontFamily: "'Montserrat',sans-serif", fontWeight: 800, fontSize: 14, color: '#0B1F3A', letterSpacing: '.06em', textTransform: 'uppercase', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                                            <IconTrophy size={16} color="#F59E0B" />Top 3 Terbaik
                                        </p>
                                    </div>
                                    <div className="pl-podium-wrap" style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-end', gap: 28 }}>
                                        {podiumOrder.map((item, pi) => {
                                            const isFirst = item.rank === 1;
                                            const podiumH = item.rank === 1 ? 96 : item.rank === 2 ? 70 : 56;
                                            const imgSize = isFirst ? 100 : 78;
                                            const medal   = MEDAL(item.rank);
                                            return (
                                                <div key={item.id} className={`pl-podium-item anim-bottom podium-${pi}`} style={{ position: 'relative' }}>
                                                    {isFirst && (
                                                        <div style={{ position: 'absolute', top: -18, left: '50%', transform: 'translateX(-50%)', animation: 'float-medal 2.5s ease-in-out infinite' }}>
                                                            <IconCrown size={22} color="#F59E0B" />
                                                        </div>
                                                    )}
                                                    <img src={`/storage/${item.file_path}`} alt={item.judul}
                                                        style={{ width: imgSize, height: imgSize, borderRadius: isFirst ? 24 : 18, objectFit: 'cover', border: `3px solid ${medal.color}`, boxShadow: `0 8px 28px ${medal.color}55` }} />
                                                    <div style={{ textAlign: 'center', maxWidth: 120 }}>
                                                        <p style={{ fontFamily: "'Montserrat',sans-serif", fontWeight: 800, fontSize: isFirst ? 14 : 12, color: '#0B1F3A', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.peserta}</p>
                                                        <p style={{ fontSize: 11, color: '#8AACCC', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginTop: 2 }}>{item.judul}</p>
                                                        <p style={{ fontFamily: "'Montserrat',sans-serif", fontWeight: 900, fontSize: isFirst ? 24 : 20, color: medal.color, marginTop: 4 }}>{item.nilai_rata_rata}</p>
                                                    </div>
                                                    <div style={{
                                                        width: isFirst ? 100 : 82, height: podiumH,
                                                        background: item.rank <= 3 ? RANK_GRADIENT[item.rank] : 'linear-gradient(135deg, #CBD5E1, #94A3B8)',
                                                        borderRadius: '14px 14px 0 0', display: 'flex', flexDirection: 'column',
                                                        alignItems: 'center', justifyContent: 'flex-start', paddingTop: 10,
                                                        boxShadow: `0 -4px 20px ${medal.color}33`,
                                                    }}>
                                                        <span style={{ fontFamily: "'Montserrat',sans-serif", fontWeight: 900, fontSize: isFirst ? 22 : 18, color: 'rgba(255,255,255,0.9)' }}>#{item.rank}</span>
                                                        {item.jumlah_juri > 0 && <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.65)', fontWeight: 600, letterSpacing: '.08em' }}>{item.jumlah_juri} JURI</span>}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                            {/* ══ RANKING TABLE ══ */}
                            <div className="pl-card anim-bottom delay-4" style={{ overflow: 'hidden' }}>
                                <div style={{ padding: '18px 24px', borderBottom: '1px solid rgba(14,165,233,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                        <IconListNumbers size={18} color="#0EA5E9" />
                                        <p style={{ fontFamily: "'Montserrat',sans-serif", fontWeight: 800, fontSize: 14, color: '#0B1F3A' }}>Semua Ranking</p>
                                    </div>
                                    <span style={{ fontSize: 12, color: '#8AACCC' }}>{rankings.length} peserta dinilai</span>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '54px 1fr 120px 56px 56px 56px 56px 70px', padding: '10px 20px', background: 'rgba(14,165,233,0.04)', borderBottom: '1px solid rgba(14,165,233,0.08)' }}>
                                    {['#', 'Desain & Peserta', 'Kategori Detail', 'Tema', 'Kreatif', 'Estetik', 'Teknik', 'Nilai'].map((h, i) => (
                                        <p key={h} className={i === 2 ? 'pl-table-row-detail' : ''} style={{ fontSize: 10, fontWeight: 700, color: '#8AACCC', textTransform: 'uppercase', letterSpacing: '.1em', textAlign: i >= 3 ? 'center' : 'left' }}>{h}</p>
                                    ))}
                                </div>

                                {rankings.map((item, idx) => {
                                    const isMe      = my_rank?.id === item.id;
                                    const medal     = MEDAL(item.rank);
                                    const rankBg    = item.rank === 1 ? 'rgba(245,158,11,0.12)' : item.rank === 2 ? 'rgba(148,163,184,0.1)' : item.rank === 3 ? 'rgba(217,119,6,0.1)' : isMe ? 'rgba(14,165,233,0.08)' : 'rgba(148,163,184,0.06)';
                                    const rankColor = item.rank <= 3 ? medal.color : isMe ? '#0EA5E9' : '#94A3B8';
                                    return (
                                        <div key={item.id} className={`pl-row row-anim row-${Math.min(idx, 9)}${isMe ? ' is-me' : ''}`}
                                            style={{ display: 'grid', gridTemplateColumns: '54px 1fr 120px 56px 56px 56px 56px 70px', padding: '14px 20px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                                <div className="pl-rank-badge" style={{ background: rankBg, color: rankColor }}>
                                                    {item.rank <= 3 ? <IconMedal size={16} color={rankColor} /> : item.rank}
                                                </div>
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0 }}>
                                                <img src={`/storage/${item.file_path}`} alt={item.judul}
                                                    style={{ width: 44, height: 44, borderRadius: 12, objectFit: 'cover', flexShrink: 0, border: `2px solid ${item.rank <= 3 ? medal.color + '55' : 'rgba(14,165,233,0.15)'}` }} />
                                                <div style={{ minWidth: 0 }}>
                                                    <p style={{ fontFamily: "'Montserrat',sans-serif", fontWeight: 700, fontSize: 13, color: '#0B1F3A', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.judul}</p>
                                                    <p style={{ fontSize: 11, color: '#6B8AAA', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginTop: 2 }}>
                                                        {item.peserta}{isMe && <span style={{ marginLeft: 6, color: '#0EA5E9', fontWeight: 700 }}>← kamu</span>}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="pl-table-row-detail" style={{ display: 'flex', alignItems: 'center' }}>
                                                <span className="pl-chip"><IconUserStar size={12} color="#6366F1" />{item.jumlah_juri} juri</span>
                                            </div>
                                            {CRITERIA.map(c => (
                                                <div key={c.key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                    <span style={{ fontFamily: "'Montserrat',sans-serif", fontWeight: 700, fontSize: 14, color: isMe ? c.color : '#4A6A8A' }}>{item.detail[c.key]}</span>
                                                </div>
                                            ))}
                                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                <span style={{ fontFamily: "'Montserrat',sans-serif", fontWeight: 900, fontSize: 16, color: rankColor, background: rankBg, borderRadius: 10, padding: '4px 10px' }}>
                                                    {item.nilai_rata_rata}
                                                </span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </>)}
                    </div>
                </main>
            </div>
        </>
    );
}