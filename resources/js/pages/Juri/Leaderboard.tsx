import { useState, useEffect } from 'react';
import { Link } from '@inertiajs/react';
import JuriSidebar from '@/components/JuriSidebar';
import {
    IconTrophy,
    IconMedal,
    IconChartBar,
    IconSearch,
    IconX,
    IconZoomIn,
    IconUser,
    IconPalette,
    IconBulb,
    IconSparkles,
    IconTool,
    IconChevronRight,
    IconUsers,
    IconCrown,
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
    belum_dinilai: number;
}

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700;800;900&family=Plus+Jakarta+Sans:wght@300;400;500;600&display=swap');

  /* ── Base animation keyframes — sama persis dengan referensi ── */
  @keyframes slideFromTop {
    from { opacity: 0; transform: translateY(-36px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes slideFromLeft {
    from { opacity: 0; transform: translateX(-56px); }
    to   { opacity: 1; transform: translateX(0); }
  }
  @keyframes slideFromRight {
    from { opacity: 0; transform: translateX(56px); }
    to   { opacity: 1; transform: translateX(0); }
  }
  @keyframes slideFromBottom {
    from { opacity: 0; transform: translateY(36px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes popIn {
    from { opacity: 0; transform: scale(0.7) rotate(-15deg); }
    to   { opacity: 1; transform: scale(1) rotate(0deg); }
  }
  @keyframes shimmer    { 0%{background-position:0% 50%} 50%{background-position:100% 50%} 100%{background-position:0% 50%} }
  @keyframes orb-drift  { 0%,100%{transform:translate(0,0)} 33%{transform:translate(20px,-14px)} 66%{transform:translate(-16px,18px)} }
  @keyframes bar-grow   { from{width:0} to{width:var(--w)} }
  @keyframes crown-bob  { 0%,100%{transform:translateY(0) rotate(-4deg)} 50%{transform:translateY(-6px) rotate(4deg)} }
  @keyframes float-glow { 0%,100%{box-shadow:0 0 18px rgba(14,165,233,0.45)} 50%{box-shadow:0 0 36px rgba(14,165,233,0.75)} }
  @keyframes modal-in   { from{opacity:0;transform:scale(0.9) translateY(16px)} to{opacity:1;transform:scale(1) translateY(0)} }
  @keyframes backdrop-in{ from{opacity:0} to{opacity:1} }

  /* ── Animation classes — active only when .pd-ready on parent ── */
  .pd-ready .anim-top    { animation: slideFromTop    0.55s cubic-bezier(0.22,1,0.36,1) both; }
  .pd-ready .anim-left   { animation: slideFromLeft   0.55s cubic-bezier(0.22,1,0.36,1) both; }
  .pd-ready .anim-right  { animation: slideFromRight  0.55s cubic-bezier(0.22,1,0.36,1) both; }
  .pd-ready .anim-bottom { animation: slideFromBottom 0.55s cubic-bezier(0.22,1,0.36,1) both; }
  .pd-ready .anim-pop    { animation: popIn 0.45s cubic-bezier(0.34,1.56,0.64,1) both; }

  /* ── Podium stagger ── */
  .pd-ready .podium-0 { animation-delay: 0.12s; }
  .pd-ready .podium-1 { animation-delay: 0.22s; }
  .pd-ready .podium-2 { animation-delay: 0.32s; }

  /* ── Section delays ── */
  .pd-ready .delay-1 { animation-delay: 0.08s; }
  .pd-ready .delay-2 { animation-delay: 0.30s; }
  .pd-ready .delay-3 { animation-delay: 0.38s; }
  .pd-ready .delay-4 { animation-delay: 0.46s; }

  /* ── Before ready: hidden ── */
  .anim-top, .anim-left, .anim-right, .anim-bottom, .anim-pop { opacity: 0; }

  .lb-gradient-text {
    background: linear-gradient(135deg,#0A2F5E 0%,#1565C0 32%,#0EA5E9 62%,#38BDF8 100%);
    background-size:280%; -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text;
    animation: shimmer 7s ease infinite;
  }

  .lb-page { font-family: 'Plus Jakarta Sans', sans-serif; }

  /* ── Sidebar collapse responsive ── */
  .lb-main {
    transition: margin-left 0.35s cubic-bezier(0.22,1,0.36,1);
  }

  .lb-row { transition: all .22s ease; cursor: default; }
  .lb-row:hover { background: rgba(14,165,233,0.06) !important; transform: translateX(3px); }

  .podium-card {
    transition: transform .32s cubic-bezier(.34,1.4,.64,1), box-shadow .32s ease;
  }
  .podium-card:hover { transform: translateY(-6px) scale(1.03); }

  .score-bar-fill { animation: bar-grow .9s cubic-bezier(.4,0,.2,1) both; }
  .crown { animation: crown-bob 2.4s ease-in-out infinite; display: inline-block; }

  .img-trigger { cursor: zoom-in; position: relative; overflow: hidden; }
  .zoom-hint { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; background: rgba(8,24,46,0); transition: background .22s ease; pointer-events: none; border-radius: inherit; }
  .zoom-hint span { font-size: 20px; opacity: 0; transform: scale(0.7); transition: opacity .22s ease, transform .22s ease; }
  .img-trigger:hover .zoom-hint { background: rgba(8,24,46,0.45); }
  .img-trigger:hover .zoom-hint span { opacity: 1; transform: scale(1); }

  .modal-backdrop { position: fixed; inset: 0; z-index: 1000; background: rgba(8,18,40,0.85); backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px); display: flex; align-items: center; justify-content: center; padding: 24px; animation: backdrop-in .2s ease both; cursor: zoom-out; }
  .modal-box { animation: modal-in .3s cubic-bezier(.34,1.2,.64,1) both; max-width: 880px; width: 100%; cursor: default; position: relative; border-radius: 22px; overflow: hidden; box-shadow: 0 32px 100px rgba(0,0,0,0.6); }
  .modal-close { position: absolute; top: 14px; right: 14px; z-index: 10; width: 38px; height: 38px; border-radius: 50%; background: rgba(255,255,255,0.15); border: 1.5px solid rgba(255,255,255,0.25); backdrop-filter: blur(8px); cursor: pointer; color: #fff; display: flex; align-items: center; justify-content: center; transition: all .18s ease; }
  .modal-close:hover { background: rgba(255,255,255,0.28); transform: scale(1.1); }

  @media (max-width: 768px) {
    .lb-main { margin-left: 0 !important; }
  }
`;

const MEDAL_COLORS: Record<number,{ring:string;glow:string;bar:string;text:string;badge:string}> = {
    1:{ring:'#F59E0B',glow:'rgba(245,158,11,0.55)',bar:'linear-gradient(90deg,#F59E0B,#FBBF24)',text:'#B45309',badge:'rgba(245,158,11,0.14)'},
    2:{ring:'#94A3B8',glow:'rgba(148,163,184,0.45)',bar:'linear-gradient(90deg,#94A3B8,#CBD5E1)',text:'#475569',badge:'rgba(148,163,184,0.14)'},
    3:{ring:'#D97706',glow:'rgba(217,119,6,0.45)',bar:'linear-gradient(90deg,#D97706,#F59E0B)',text:'#92400E',badge:'rgba(217,119,6,0.14)'},
};
const DEFAULT_COLOR = {ring:'#0EA5E9',glow:'rgba(14,165,233,0.2)',bar:'linear-gradient(90deg,#0EA5E9,#1565C0)',text:'#1565C0',badge:'rgba(14,165,233,0.08)'};
const mc = (rank:number) => MEDAL_COLORS[rank]??DEFAULT_COLOR;

function ScoreBar({ value, rank }: { value:number; rank:number }) {
    const c = mc(rank);
    return (
        <div style={{ height:6,borderRadius:999,background:'rgba(14,165,233,0.1)',overflow:'hidden',minWidth:60 }}>
            <div className="score-bar-fill" style={{ height:'100%',borderRadius:999,background:c.bar,['--w' as any]:`${value}%`,width:`${value}%` }} />
        </div>
    );
}

interface PreviewItem { src:string; judul:string; peserta:string; score:number; rank:number; nilai_rata_rata: number; }

function ImageModal({ item, onClose }: { item:PreviewItem; onClose:()=>void }) {
    const c = mc(item.rank);
    return (
        <div className="modal-backdrop" onClick={onClose}>
            <div className="modal-box" onClick={e => e.stopPropagation()}>
                <button className="modal-close" onClick={onClose}>
                    <IconX size={16} />
                </button>
                <img src={item.src} alt={item.judul} style={{ width:'100%', display:'block', maxHeight:'75vh', objectFit:'contain', background:'#08122A' }} />
                <div style={{ padding:'20px 24px', background:'rgba(8,24,46,0.95)', display:'flex', alignItems:'center', justifyContent:'space-between', gap:16 }}>
                    <div>
                        <p style={{ fontFamily:"'Montserrat',sans-serif", fontWeight:800, fontSize:16, color:'#fff', marginBottom:4 }}>{item.judul}</p>
                        <p style={{ fontSize:13, color:'#BAE6FD', display:'flex', alignItems:'center', gap:5 }}>
                            <IconUser size={13} /> {item.peserta}
                        </p>
                    </div>
                    <div style={{ display:'flex', alignItems:'center', gap:10, flexShrink:0 }}>
                        <div style={{ background:c.badge, border:`1.5px solid ${c.ring}66`, borderRadius:14, padding:'10px 24px', textAlign:'center' }}>
                            <p style={{ fontFamily:"'Montserrat',sans-serif", fontWeight:900, fontSize:32, color:c.text, lineHeight:1 }}>{item.nilai_rata_rata}</p>
                            <p style={{ fontSize:10, color:'#94A3B8', marginTop:3, fontWeight:600, letterSpacing:'.06em' }}>SKOR</p>
                        </div>
                        <div style={{ background:'rgba(255,255,255,0.06)', border:'1.5px solid rgba(255,255,255,0.12)', borderRadius:14, padding:'10px 20px', textAlign:'center' }}>
                            <p style={{ fontFamily:"'Montserrat',sans-serif", fontWeight:900, fontSize:24, color:'#fff', lineHeight:1 }}>#{item.rank}</p>
                            <p style={{ fontSize:10, color:'#94A3B8', marginTop:3, fontWeight:600, letterSpacing:'.06em' }}>PERINGKAT</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function Leaderboard({ auth, rankings, belum_dinilai }: Props) {
    const [ready, setReady] = useState(false);
    const [preview, setPreview] = useState<PreviewItem | null>(null);
    const [sidebarCollapsed, setSidebarCollapsed] = useState(() =>
    typeof window !== 'undefined'
        ? localStorage.getItem('juri-sidebar-collapsed') === 'true'
        : false
);

    // Trigger animasi setelah mount — sama persis dengan referensi
    useEffect(() => {
        const t = requestAnimationFrame(() => {
            requestAnimationFrame(() => setReady(true));
        });
        return () => cancelAnimationFrame(t);
    }, []);

    // Listen to sidebar collapse state via custom event
    useEffect(() => {
        const handler = (e: CustomEvent) => {
            if (e.detail?.storageKey === 'juri-sidebar-collapsed') {
                setSidebarCollapsed(e.detail?.collapsed ?? false);
            }
        };
        window.addEventListener('sidebarToggle', handler as EventListener);
        return () => window.removeEventListener('sidebarToggle', handler as EventListener);
    }, []);

    const openPreview = (item: RankItem) => {
        setPreview({ src:`/storage/${item.file_path}`, judul:item.judul, peserta:item.peserta, score:item.nilai_rata_rata, rank:item.rank, nilai_rata_rata:item.nilai_rata_rata });
    };

    const maxScore = rankings.length > 0 ? Math.max(...rankings.map(r => r.nilai_rata_rata)) : 100;
    const top3 = rankings.filter(r => r.rank <= 3).sort((a,b) => {
        const order = [2,1,3];
        return order.indexOf(a.rank) - order.indexOf(b.rank);
    });

    const sidebarWidth = sidebarCollapsed ? 64 : 240;

    return (
        <>
            <style>{STYLES}</style>
            {preview && <ImageModal item={preview} onClose={() => setPreview(null)} />}

            <div
                className={`lb-page min-h-screen${ready ? ' pd-ready' : ''}`}
                style={{ background: 'linear-gradient(150deg, #EFF8FF 0%, #DBEFFE 40%, #E0EFFE 100%)', position: 'relative' }}
            >
                {/* Orbs */}
                <div style={{ position:'fixed', inset:0, zIndex:0, pointerEvents:'none', overflow:'hidden' }}>
                    {[
                        { w:600,h:600,top:'-200px',left:'-160px',c:'radial-gradient(circle,rgba(14,165,233,0.15) 0%,transparent 62%)',dur:'24s',delay:'0s' },
                        { w:480,h:480,bottom:'-100px',right:'-120px',c:'radial-gradient(circle,rgba(14,165,233,0.1) 0%,transparent 62%)',dur:'28s',delay:'-8s' },
                    ].map((b,i)=>(
                        <div key={i} style={{ position:'absolute',width:b.w,height:b.h,borderRadius:'50%',top:(b as any).top,left:(b as any).left,right:(b as any).right,bottom:(b as any).bottom,background:b.c,animation:`orb-drift ${b.dur} ease-in-out infinite`,animationDelay:b.delay }} />
                    ))}
                    <div style={{ position:'fixed',inset:0,zIndex:0,pointerEvents:'none',backgroundImage:'radial-gradient(rgba(11,31,58,0.07) 1px,transparent 1px)',backgroundSize:'28px 28px' }} />
                </div>

                {/* Sidebar */}
                <JuriSidebar user={auth.user} activePage="leaderboard" belumDinilai={belum_dinilai} />

                {/* Main */}
                <div
                    className="lb-main"
                    style={{
                        marginLeft: sidebarWidth,
                        minHeight: '100vh',
                        position: 'relative',
                        zIndex: 1,
                        transition: 'margin-left 0.35s cubic-bezier(0.22,1,0.36,1)',
                    }}
                >
                    {/* Top Bar — anim-top */}
                    <div className="anim-top delay-1" style={{ position:'sticky', top:0, zIndex:50, background:'rgba(14,100,180,0.75)', backdropFilter:'blur(28px) saturate(180%)', WebkitBackdropFilter:'blur(28px) saturate(180%)', borderBottom:'1px solid rgba(255,255,255,0.12)', padding:'0 clamp(20px,4vw,40px)', height:62, display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                        <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                            <Link href="/juri/dashboard" style={{ fontFamily:"'Montserrat',sans-serif", fontWeight:600, fontSize:13, color:'rgba(186,230,253,0.7)', textDecoration:'none' }}>Dashboard</Link>
                            <IconChevronRight size={14} color="rgba(186,230,253,0.4)" />
                            <div className="anim-pop delay-1" style={{ width:28, height:28, borderRadius:8, background:'rgba(255,255,255,0.15)', display:'flex', alignItems:'center', justifyContent:'center' }}>
                                <IconTrophy size={14} color="#FDE68A" />
                            </div>
                            <h1 style={{ fontFamily:"'Montserrat',sans-serif", fontWeight:800, fontSize:'clamp(15px,2vw,18px)', color:'#fff' }}>Leaderboard</h1>
                        </div>
                        <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                            <span style={{ display:'flex', alignItems:'center', gap:5, background:'rgba(255,255,255,0.12)', border:'1px solid rgba(255,255,255,0.2)', color:'#BAE6FD', borderRadius:20, padding:'5px 14px', fontSize:11, fontWeight:700, fontFamily:"'Montserrat',sans-serif" }}>
                                <IconUsers size={12} /> {rankings.length} Peserta
                            </span>
                        </div>
                    </div>

                    {/* Content */}
                    <div style={{ maxWidth: 1100, margin: '0 auto', padding:'clamp(24px,4vw,40px)' }}>

                        {/* Header — dari atas */}
                        <div className="anim-top delay-1" style={{ marginBottom:32 }}>
                            <div style={{ display:'flex', alignItems:'center', gap:14 }}>
                                <div className="anim-pop delay-1" style={{
                                    width: 48, height: 48, borderRadius: 16,
                                    background: 'linear-gradient(135deg, #F59E0B, #EF8C07)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    boxShadow: '0 8px 24px rgba(245,158,11,0.4)',
                                }}>
                                    <IconTrophy size={22} color="#fff" />
                                </div>
                                <div>
                                    <p style={{ fontSize:11, fontWeight:700, letterSpacing:'.18em', textTransform:'uppercase', color:'#0EA5E9', marginBottom:4, fontFamily:"'Montserrat',sans-serif" }}>— PERINGKAT —</p>
                                    <h2 style={{ fontFamily:"'Montserrat',sans-serif", fontWeight:800, fontSize:'clamp(20px,3.5vw,34px)', color:'#08182E', lineHeight:1.2, display:'flex', alignItems:'center', gap:12 }}>
                                        <span className="crown"><IconCrown size={28} color="#F59E0B" /></span>
                                        Leader<span className="lb-gradient-text">board</span>
                                    </h2>
                                </div>
                            </div>
                            <p style={{ color:'#1A3A5C', fontSize:14, marginTop:10 }}>
                                Peringkat real-time berdasarkan rata-rata nilai dari semua juri.
                            </p>
                        </div>

                        {rankings.length === 0 ? (
                            <div className="anim-bottom delay-2" style={{ textAlign:'center', padding:'80px 40px', background:'rgba(255,255,255,0.72)', backdropFilter:'blur(20px)', borderRadius:24, border:'1.5px solid rgba(255,255,255,0.88)', boxShadow:'0 6px 24px rgba(11,31,58,0.07)' }}>
                                <IconChartBar size={64} color="#94A3B8" style={{ marginBottom:16 }} />
                                <p style={{ fontFamily:"'Montserrat',sans-serif", fontWeight:700, fontSize:18, color:'#1A3A5C', marginBottom:8 }}>Belum ada data peringkat</p>
                                <p style={{ color:'#4A6A8A', fontSize:14, marginBottom:24 }}>Penilaian belum dimulai atau belum ada desain yang dinilai.</p>
                                <Link href="/juri/designs" style={{ display:'inline-flex', alignItems:'center', gap:7, padding:'11px 26px', borderRadius:999, background:'linear-gradient(135deg,#1565C0,#0EA5E9)', color:'#fff', textDecoration:'none', fontFamily:"'Montserrat',sans-serif", fontWeight:700, fontSize:13, letterSpacing:'.06em', boxShadow:'0 4px 14px rgba(14,165,233,0.35)' }}>
                                    Mulai Menilai <IconChevronRight size={14} />
                                </Link>
                            </div>
                        ) : (
                            <>
                                {/* Podium — dari bawah, stagger */}
                                {top3.length >= 1 && (
                                    <div className="anim-bottom delay-2" style={{ background:'rgba(255,255,255,0.72)', backdropFilter:'blur(20px)', WebkitBackdropFilter:'blur(20px)', border:'1.5px solid rgba(255,255,255,0.88)', borderRadius:24, padding:'32px 28px 0', boxShadow:'0 6px 24px rgba(11,31,58,0.07)', marginBottom:24, overflow:'hidden' }}>
                                        <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:28 }}>
                                            <IconMedal size={18} color="#F59E0B" />
                                            <p style={{ fontSize:11, fontWeight:700, color:'#F59E0B', letterSpacing:'.15em', textTransform:'uppercase', fontFamily:"'Montserrat',sans-serif" }}>— TOP 3 PODIUM —</p>
                                        </div>
                                        <div style={{ display:'flex', alignItems:'flex-end', justifyContent:'center', gap:'clamp(16px,3vw,40px)' }}>
                                            {top3.map((item, pidx) => {
                                                const c = mc(item.rank);
                                                const isFirst = item.rank === 1;
                                                const imgSize = isFirst ? 110 : 88;
                                                const podiumH = item.rank === 1 ? 110 : item.rank === 2 ? 80 : 60;
                                                return (
                                                    <div key={item.id} className={`podium-card anim-pop podium-${pidx}`} style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:10 }}>
                                                        {isFirst && <span className="crown"><IconCrown size={28} color="#F59E0B" /></span>}
                                                        <div className="img-trigger" style={{ borderRadius: isFirst ? 20 : 16 }} onClick={() => openPreview(item)}>
                                                            <img src={`/storage/${item.file_path}`} alt={item.judul} style={{ width:imgSize, height:imgSize, borderRadius: isFirst ? 20 : 16, objectFit:'cover', border:`3px solid ${c.ring}`, boxShadow:`0 8px 28px ${c.glow}`, display:'block', animation: isFirst ? 'float-glow 3s ease-in-out infinite' : 'none' }} />
                                                            <div className="zoom-hint"><span><IconZoomIn size={20} color="#fff" /></span></div>
                                                            <div style={{ position:'absolute', bottom:-8, right:-8, width:28, height:28, borderRadius:'50%', background:c.ring, color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', fontSize:11, fontWeight:900, fontFamily:"'Montserrat',sans-serif", border:'2px solid #fff', boxShadow:`0 2px 8px ${c.glow}` }}>{item.rank}</div>
                                                        </div>
                                                        <div style={{ textAlign:'center', maxWidth:130 }}>
                                                            <p style={{ fontFamily:"'Montserrat',sans-serif", fontWeight:800, fontSize: isFirst ? 14 : 12, color:'#0B1F3A', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', marginBottom:2 }}>{item.peserta}</p>
                                                            <p style={{ fontSize:10, color:'#4A6A8A', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', marginBottom:8 }}>{item.judul}</p>
                                                            <div style={{ display:'inline-block', background:c.badge, color:c.text, border:`1.5px solid ${c.ring}44`, borderRadius:12, padding: isFirst ? '8px 20px' : '6px 16px', fontFamily:"'Montserrat',sans-serif", fontWeight:900, fontSize: isFirst ? 26 : 20 }}>{item.nilai_rata_rata}</div>
                                                        </div>
                                                        <div style={{ width: isFirst ? 90 : 72, height:podiumH, background:`linear-gradient(180deg,${c.ring},${c.ring}bb)`, borderRadius:'10px 10px 0 0', display:'flex', alignItems:'flex-start', justifyContent:'center', paddingTop:10, boxShadow:`0 -4px 16px ${c.glow}` }}>
                                                            <span style={{ fontSize:12, fontWeight:900, color:'rgba(255,255,255,0.85)', fontFamily:"'Montserrat',sans-serif" }}>#{item.rank}</span>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}

                                {/* Tabel — dari kiri */}
                                <div className="anim-left delay-3" style={{ background:'rgba(255,255,255,0.74)', backdropFilter:'blur(20px)', WebkitBackdropFilter:'blur(20px)', border:'1.5px solid rgba(255,255,255,0.88)', borderRadius:24, overflow:'hidden', boxShadow:'0 6px 24px rgba(11,31,58,0.07)' }}>
                                    <div style={{ padding:'18px 24px', borderBottom:'1.5px solid rgba(14,165,233,0.12)', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                                        <p style={{ fontSize:11, fontWeight:700, color:'#0EA5E9', letterSpacing:'.15em', textTransform:'uppercase', fontFamily:"'Montserrat',sans-serif", display:'flex', alignItems:'center', gap:7 }}>
                                            <IconChartBar size={15} /> SEMUA PERINGKAT
                                        </p>
                                        <p style={{ fontSize:11, color:'#4A6A8A', fontFamily:"'Montserrat',sans-serif", fontWeight:600, display:'flex', alignItems:'center', gap:5 }}>
                                            <IconUsers size={13} /> {rankings.length} peserta
                                        </p>
                                    </div>
                                    <div style={{ overflowX:'auto' }}>
                                        <table style={{ width:'100%', borderCollapse:'collapse' }}>
                                            <thead>
                                                <tr style={{ background:'rgba(8,28,58,0.04)', borderBottom:'1.5px solid rgba(14,165,233,0.1)' }}>
                                                    {[
                                                        { label:'#', icon: null },
                                                        { label:'Desain', icon: null },
                                                        { label:'Peserta', icon: <IconUser size={11} /> },
                                                        { label:'Tema', icon: <IconPalette size={11} /> },
                                                        { label:'Kreatif', icon: <IconBulb size={11} /> },
                                                        { label:'Estetik', icon: <IconSparkles size={11} /> },
                                                        { label:'Teknik', icon: <IconTool size={11} /> },
                                                        { label:'Rata-rata', icon: <IconChartBar size={11} /> },
                                                    ].map(h=>(
                                                        <th key={h.label} style={{ padding:'12px 16px', textAlign: h.label==='Desain'||h.label==='Peserta'||h.label==='#' ? 'left' : 'center', fontSize:10, fontWeight:700, letterSpacing:'.12em', textTransform:'uppercase', color:'#0B3A6A', fontFamily:"'Montserrat',sans-serif", whiteSpace:'nowrap' }}>
                                                            <span style={{ display:'inline-flex', alignItems:'center', gap:4 }}>{h.icon}{h.label}</span>
                                                        </th>
                                                    ))}
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {rankings.map(item=>{
                                                    const c = mc(item.rank);
                                                    const isTop = item.rank<=3;
                                                    return (
                                                        <tr key={item.id} className="lb-row" style={{ borderBottom:'1px solid rgba(14,165,233,0.07)', background: isTop ? c.badge : 'transparent' }}>
                                                            <td style={{ padding:'14px 16px', width:52 }}>
                                                                <div style={{ width:32, height:32, borderRadius:'50%', background: isTop ? c.ring : 'rgba(14,165,233,0.1)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:11, fontWeight:900, color: isTop ? '#fff' : '#1565C0', fontFamily:"'Montserrat',sans-serif", boxShadow: isTop ? `0 2px 10px ${c.glow}` : 'none', flexShrink:0 }}>
                                                                    {isTop ? (item.rank === 1 ? '🥇' : item.rank === 2 ? '🥈' : '🥉') : item.rank}
                                                                </div>
                                                            </td>
                                                            <td style={{ padding:'14px 16px' }}>
                                                                <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                                                                    <div className="img-trigger" style={{ width:40, height:40, borderRadius:10, flexShrink:0 }} onClick={() => openPreview(item)}>
                                                                        <img src={`/storage/${item.file_path}`} alt={item.judul} style={{ width:40, height:40, borderRadius:10, objectFit:'cover', border:`1.5px solid ${c.ring}44`, display:'block' }} />
                                                                        <div className="zoom-hint"><span><IconSearch size={14} color="#fff" /></span></div>
                                                                    </div>
                                                                    <span style={{ fontWeight:700, color:'#0B1F3A', fontFamily:"'Montserrat',sans-serif", fontSize:13, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', maxWidth:140 }}>{item.judul}</span>
                                                                </div>
                                                            </td>
                                                            <td style={{ padding:'14px 16px', fontSize:13, color:'#1A3A5C', fontWeight:600, whiteSpace:'nowrap' }}>{item.peserta}</td>
                                                            {(['tema','kreativitas','estetik','teknik'] as const).map(key=>(
                                                                <td key={key} style={{ padding:'14px 16px', textAlign:'center' }}>
                                                                    <span style={{ fontFamily:"'Montserrat',sans-serif", fontWeight:700, fontSize:13, color:'#1A3A5C' }}>{item.detail[key]}</span>
                                                                </td>
                                                            ))}
                                                            <td style={{ padding:'14px 20px 14px 16px', minWidth:110 }}>
                                                                <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:5 }}>
                                                                    <span style={{ fontFamily:"'Montserrat',sans-serif", fontWeight:900, fontSize:15, color: isTop ? c.text : '#1565C0' }}>{item.nilai_rata_rata}</span>
                                                                    <ScoreBar value={(item.nilai_rata_rata/maxScore)*100} rank={item.rank} />
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    );
                                                })}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}