import { useForm } from '@inertiajs/react';
import { FormEvent, useState, useEffect, useRef } from 'react';
import PesertaSidebar from '@/components/PesertaSidebar';
import PageTransition from '@/components/PageTransition';

interface AuthUser { name: string; email: string; role: string; }
interface Design {
    id: number; judul: string; file_path: string; deskripsi: string | null;
    created_at: string;
}
interface Props {
    auth: { user: AuthUser };
    designs: Design[];
    max_uploads?: number;
}
interface UploadForm {
    judul: string; deskripsi: string; file: File | null;
    [key: string]: string | File | null;
}

/* ─────────────────────────────────────────
   Firework particle types & helpers
───────────────────────────────────────── */
interface Particle {
    x: number; y: number;
    vx: number; vy: number;
    color: string;
    size: number;
    life: number;       // 1 → 0
    shape: 'streak';
    angle: number;
}

interface Burst { id: number; particles: Particle[]; }

const SPARK_COLORS = [
    '#0EA5E9','#38BDF8','#7DD3FC',   // biru muda
    '#BAE6FD','#E0F2FE','#93C5FD',   // biru sangat muda
    '#60A5FA','#2563EB','#0284C7',   // biru medium
];

function rnd(a: number, b: number) { return a + Math.random() * (b - a); }
function pick<T>(arr: T[]): T { return arr[Math.floor(Math.random() * arr.length)]; }

function makeBurst(x: number, y: number): Burst {
    const count = Math.floor(rnd(20, 32));
    const particles: Particle[] = Array.from({ length: count }, (_, i) => {
        const angle = (i / count) * Math.PI * 2 + rnd(-0.25, 0.25);
        const speed = rnd(2.8, 8.5);
        return {
            x, y,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            color: pick(SPARK_COLORS),
            size: rnd(3, 7),
            life: 1,
            shape: 'streak',
            angle,
        };
    });
    return { id: performance.now() + Math.random(), particles };
}

/* ─────────────────────────────────────────
   Canvas overlay – percikan kembang api
───────────────────────────────────────── */
function FireworkCanvas() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const burstsRef = useRef<Burst[]>([]);
    const rafRef    = useRef<number>(0);

    useEffect(() => {
        const canvas = canvasRef.current!;
        const ctx    = canvas.getContext('2d')!;

        const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
        resize();
        window.addEventListener('resize', resize);

        const loop = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            burstsRef.current = burstsRef.current.filter(burst => {
                let alive = false;
                burst.particles.forEach(p => {
                    p.life -= 0.026;
                    if (p.life <= 0) return;
                    alive = true;

                    p.x  += p.vx;
                    p.y  += p.vy;
                    p.vy += 0.20;   // gravity
                    p.vx *= 0.975;  // drag horizontal

                    const a = Math.max(0, p.life);
                    ctx.globalAlpha = a;
                    ctx.strokeStyle = p.color;

                    // streak – garis percikan panjang
                    ctx.lineWidth = Math.max(0.5, p.size * p.life * 0.55);
                    ctx.beginPath();
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(p.x - p.vx * 2.6, p.y - p.vy * 2.6);
                    ctx.stroke();
                });
                ctx.globalAlpha = 1;
                return alive;
            });

            rafRef.current = requestAnimationFrame(loop);
        };
        rafRef.current = requestAnimationFrame(loop);

        const onClick = (e: MouseEvent) => {
            burstsRef.current.push(makeBurst(e.clientX, e.clientY));
        };
        window.addEventListener('click', onClick);

        return () => {
            cancelAnimationFrame(rafRef.current);
            window.removeEventListener('resize', resize);
            window.removeEventListener('click', onClick);
        };
    }, []);

    return (
        <canvas ref={canvasRef} style={{
            position: 'fixed', inset: 0,
            pointerEvents: 'none',
            zIndex: 99999,
        }} />
    );
}

/* ─────────────────────────────────────────
   CSS
───────────────────────────────────────── */
const PAGE_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700;800;900&family=Plus+Jakarta+Sans:wght@300;400;500;600&display=swap');
  @import url('https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@3.9.0/dist/tabler-icons.min.css');

  @keyframes slideFromTop    { from{opacity:0;transform:translateY(-36px)} to{opacity:1;transform:translateY(0)} }
  @keyframes slideFromLeft   { from{opacity:0;transform:translateX(-56px)} to{opacity:1;transform:translateX(0)} }
  @keyframes slideFromRight  { from{opacity:0;transform:translateX(56px)}  to{opacity:1;transform:translateX(0)} }
  @keyframes slideFromBottom { from{opacity:0;transform:translateY(36px)}  to{opacity:1;transform:translateY(0)} }
  @keyframes popIn           { from{opacity:0;transform:scale(0.7) rotate(-15deg)} to{opacity:1;transform:scale(1) rotate(0deg)} }
  @keyframes fadeScale       { from{opacity:0;transform:scale(0.93)} to{opacity:1;transform:scale(1)} }
  @keyframes float-kite      { 0%,100%{transform:translateY(0) rotate(-3deg)} 50%{transform:translateY(-10px) rotate(3deg)} }
  @keyframes spin-slow       { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }

  /* ── Anim helpers ── */
  .pu-ready .anim-top    { animation: slideFromTop    0.55s cubic-bezier(0.22,1,0.36,1) both; }
  .pu-ready .anim-left   { animation: slideFromLeft   0.55s cubic-bezier(0.22,1,0.36,1) both; }
  .pu-ready .anim-right  { animation: slideFromRight  0.55s cubic-bezier(0.22,1,0.36,1) both; }
  .pu-ready .anim-bottom { animation: slideFromBottom 0.55s cubic-bezier(0.22,1,0.36,1) both; }
  .pu-ready .anim-pop    { animation: popIn           0.45s cubic-bezier(0.34,1.56,0.64,1) both; }
  .pu-ready .anim-scale  { animation: fadeScale       0.45s cubic-bezier(0.22,1,0.36,1) both; }

  .pu-ready .delay-1 { animation-delay:0.06s; }
  .pu-ready .delay-2 { animation-delay:0.14s; }
  .pu-ready .delay-3 { animation-delay:0.22s; }
  .pu-ready .delay-4 { animation-delay:0.30s; }
  .pu-ready .delay-5 { animation-delay:0.38s; }
  .pu-ready .delay-6 { animation-delay:0.46s; }

  .pu-ready .row-anim { animation: slideFromLeft 0.45s cubic-bezier(0.22,1,0.36,1) both; }
  .pu-ready .row-0{animation-delay:0.30s;} .pu-ready .row-1{animation-delay:0.36s;}
  .pu-ready .row-2{animation-delay:0.42s;} .pu-ready .row-3{animation-delay:0.48s;}
  .pu-ready .row-4{animation-delay:0.54s;} .pu-ready .row-5{animation-delay:0.60s;}

  .anim-top,.anim-left,.anim-right,.anim-bottom,.anim-pop,.anim-scale,.row-anim { opacity:0; }

  .pu-page { font-family:'Plus Jakarta Sans',sans-serif; }
  .pu-card {
    background:rgba(255,255,255,0.75); backdrop-filter:blur(20px);
    border:1px solid rgba(255,255,255,0.9); border-radius:24px;
  }
  .pu-input {
    width:100%; border:1.5px solid rgba(14,165,233,0.2); border-radius:12px; padding:11px 15px;
    font-family:'Plus Jakarta Sans',sans-serif; font-size:14px;
    background:rgba(255,255,255,0.8); color:#1A3A5C;
    transition:border-color .2s,box-shadow .2s; outline:none; box-sizing:border-box;
  }
  .pu-input:focus { border-color:#0EA5E9; box-shadow:0 0 0 3px rgba(14,165,233,0.12); }
  .pu-upload-zone {
    border:2.5px dashed rgba(14,165,233,0.3); border-radius:20px; cursor:pointer;
    transition:border-color .2s,background .2s,transform .2s; background:rgba(239,248,255,0.5);
    display:flex; flex-direction:column; align-items:center; justify-content:center;
    gap:14px; padding:48px 32px; text-align:center;
  }
  .pu-upload-zone:hover,.pu-upload-zone.drag {
    border-color:#0EA5E9; background:rgba(14,165,233,0.06); transform:scale(1.01);
  }
  .pu-submit-btn {
    display:flex; align-items:center; justify-content:center; gap:10px;
    background:linear-gradient(135deg,#0EA5E9,#1565C0); color:#fff; border:none; width:100%;
    font-family:'Montserrat',sans-serif; font-weight:800; font-size:15px;
    padding:15px 24px; border-radius:14px; cursor:pointer;
    box-shadow:0 8px 28px rgba(14,165,233,0.38); transition:transform .2s,box-shadow .2s;
    position:relative; overflow:hidden;
  }
  .pu-submit-btn:hover:not(:disabled) { transform:translateY(-2px); box-shadow:0 12px 36px rgba(14,165,233,0.48); }
  .pu-submit-btn:disabled { background:#94A3B8; box-shadow:none; cursor:not-allowed; }
  .pu-design-thumb {
    background:rgba(255,255,255,0.8); border:1px solid rgba(255,255,255,0.9);
    border-radius:18px; overflow:hidden; transition:transform .22s ease,box-shadow .22s ease;
  }
  .pu-design-thumb:hover { transform:translateY(-4px); box-shadow:0 16px 40px rgba(14,100,180,0.14); }

  @media(max-width:768px){
    .pu-mobile-spacer{height:56px;} .pu-main{padding-bottom:80px!important;}
    .pu-form-grid{grid-template-columns:1fr!important;}
    .pu-designs-grid{grid-template-columns:repeat(2,1fr)!important;}
  }
  @media(max-width:480px){ .pu-designs-grid{grid-template-columns:1fr!important;} }
`;

/* ─────────────────────────────────────────
   Main Component
───────────────────────────────────────── */
export default function PesertaUpload({ auth, designs, max_uploads = 5 }: Props) {
    const [previewUrl, setPreviewUrl]   = useState<string | null>(null);
    const [previewName, setPreviewName] = useState<string>('');
    const [dragOver, setDragOver]       = useState(false);
    const [success, setSuccess]         = useState(false);
    const [ready, setReady]             = useState(false);

    /* Trigger animasi masuk (identik dengan leaderboard) */
    useEffect(() => {
        const t = requestAnimationFrame(() => requestAnimationFrame(() => setReady(true)));
        return () => cancelAnimationFrame(t);
    }, []);

    const { data, setData, post, processing, errors, reset } = useForm<UploadForm>({
        judul: '', deskripsi: '', file: null,
    });

    const handleFile = (file: File | null) => {
        if (!file) { setPreviewUrl(null); setPreviewName(''); setData('file', null); return; }
        setData('file', file);
        setPreviewName(file.name);
        setPreviewUrl(URL.createObjectURL(file));
    };

    const submit = (e: FormEvent) => {
        e.preventDefault();
        post('/peserta/upload', {
            forceFormData: true,
            onSuccess: () => {
                reset(); setPreviewUrl(null); setPreviewName('');
                setSuccess(true); setTimeout(() => setSuccess(false), 4000);
            },
        });
    };

    const remaining = max_uploads - designs.length;

    return (
        <>
            <style>{PAGE_STYLES}</style>

            {/* ── Percikan kembang api – canvas transparan di atas segalanya ── */}
            <FireworkCanvas />

            <div
                className={`pu-page min-h-screen flex${ready ? ' pu-ready' : ''}`}
                style={{ background: 'linear-gradient(150deg,#EFF8FF 0%,#DBEFFE 40%,#E0EFFE 100%)' }}
            >
                <PesertaSidebar user={auth.user} activePage="upload" />

                <PageTransition>
                    <main className="pu-main flex-1 min-w-0 overflow-y-auto" style={{ padding: 0 }}>
                        <div className="pu-mobile-spacer" />
                        <div style={{ maxWidth: 860, margin: '0 auto', padding: '36px 24px 60px' }}>

                            {/* ══ HEADER ══ */}
                            <div className="anim-top delay-1" style={{ marginBottom: 32 }}>
                                <div style={{ display:'flex', alignItems:'center', gap:14 }}>
                                    <div className="anim-pop delay-1" style={{
                                        width:48, height:48, borderRadius:16,
                                        background:'linear-gradient(135deg,#0EA5E9,#1565C0)',
                                        display:'flex', alignItems:'center', justifyContent:'center',
                                        boxShadow:'0 8px 24px rgba(14,165,233,0.35)',
                                    }}>
                                        <i className="ti ti-cloud-upload" style={{ fontSize:22, color:'#fff' }} />
                                    </div>
                                    <div>
                                        <h1 style={{ fontFamily:"'Montserrat',sans-serif", fontWeight:900, fontSize:22, color:'#0B1F3A', lineHeight:1.2 }}>Upload Desain</h1>
                                        <p style={{ fontSize:13, color:'#6B8AAA', fontWeight:500, marginTop:2 }}>
                                            {designs.length}/{max_uploads} slot terpakai · Sisa {remaining} upload
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* ══ SUCCESS TOAST ══ */}
                            {success && (
                                <div className="anim-right" style={{
                                    background:'rgba(16,185,129,0.1)', border:'1.5px solid rgba(16,185,129,0.3)',
                                    borderRadius:14, padding:'14px 20px', marginBottom:24,
                                    display:'flex', alignItems:'center', gap:12,
                                }}>
                                    <i className="ti ti-circle-check" style={{ fontSize:22, color:'#10B981' }} />
                                    <div>
                                        <p style={{ fontFamily:"'Montserrat',sans-serif", fontWeight:700, fontSize:14, color:'#065F46' }}>Desain berhasil diupload!</p>
                                        <p style={{ fontSize:12, color:'#047857', marginTop:2 }}>Desainmu sudah masuk dan menunggu penilaian dari juri.</p>
                                    </div>
                                </div>
                            )}

                            {/* ══ QUOTA WARNING ══ */}
                            {remaining === 0 && (
                                <div className="anim-left delay-2" style={{
                                    background:'rgba(245,158,11,0.08)', border:'1.5px solid rgba(245,158,11,0.3)',
                                    borderRadius:14, padding:'14px 20px', marginBottom:24,
                                    display:'flex', alignItems:'center', gap:12,
                                }}>
                                    <i className="ti ti-alert-triangle" style={{ fontSize:22, color:'#D97706' }} />
                                    <div>
                                        <p style={{ fontFamily:"'Montserrat',sans-serif", fontWeight:700, fontSize:14, color:'#92400E' }}>Kuota upload penuh</p>
                                        <p style={{ fontSize:12, color:'#B45309', marginTop:2 }}>Kamu sudah mencapai batas maksimal {max_uploads} desain.</p>
                                    </div>
                                </div>
                            )}

                            {/* ══ PROGRESS BAR ══ */}
                            <div className="pu-card anim-bottom delay-2" style={{ padding:'20px 24px', marginBottom:24 }}>
                                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:10 }}>
                                    <span style={{ fontSize:12, fontWeight:700, color:'#4A6A8A', letterSpacing:'.06em', textTransform:'uppercase' }}>Slot Upload</span>
                                    <span style={{ fontFamily:"'Montserrat',sans-serif", fontWeight:800, fontSize:13, color:'#0EA5E9' }}>{designs.length}/{max_uploads}</span>
                                </div>
                                <div style={{ height:8, background:'rgba(14,165,233,0.12)', borderRadius:999, overflow:'hidden' }}>
                                    <div style={{
                                        height:'100%', width:`${(designs.length / max_uploads) * 100}%`,
                                        background: designs.length >= max_uploads
                                            ? 'linear-gradient(90deg,#EF4444,#DC2626)'
                                            : 'linear-gradient(90deg,#0EA5E9,#1565C0)',
                                        borderRadius:999, transition:'width .6s ease',
                                    }} />
                                </div>
                                <div style={{ display:'flex', justifyContent:'space-between', marginTop:8 }}>
                                    <span style={{ fontSize:11, color:'#8AACCC' }}>Terpakai: {designs.length}</span>
                                    <span style={{ fontSize:11, color:'#8AACCC' }}>Sisa: {remaining}</span>
                                </div>
                            </div>

                            {/* ══ UPLOAD FORM ══ */}
                            {remaining > 0 && (
                                <div className="pu-card anim-left delay-3" style={{ marginBottom:32 }}>
                                    <div style={{ padding:'22px 28px 18px', borderBottom:'1px solid rgba(14,165,233,0.1)' }}>
                                        <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                                            <div className="anim-pop delay-3" style={{
                                                width:38, height:38, borderRadius:12,
                                                background:'linear-gradient(135deg,#0EA5E9,#1565C0)',
                                                display:'flex', alignItems:'center', justifyContent:'center',
                                            }}>
                                                <i className="ti ti-plus" style={{ fontSize:18, color:'#fff' }} />
                                            </div>
                                            <div>
                                                <p style={{ fontFamily:"'Montserrat',sans-serif", fontWeight:800, fontSize:15, color:'#0B1F3A' }}>Tambah Desain Baru</p>
                                                <p style={{ fontSize:12, color:'#8AACCC', marginTop:1 }}>Isi form di bawah dan upload file desainmu</p>
                                            </div>
                                        </div>
                                    </div>

                                    <form onSubmit={submit} style={{ padding:'24px 28px' }}>
                                        <div className="pu-form-grid" style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:28 }}>

                                            {/* Kiri */}
                                            <div style={{ display:'flex', flexDirection:'column', gap:18 }}>
                                                <div>
                                                    <label style={{ display:'block', fontSize:11, fontWeight:700, color:'#4A6A8A', marginBottom:8, letterSpacing:'.1em', textTransform:'uppercase' }}>
                                                        Judul Desain <span style={{ color:'#EF4444' }}>*</span>
                                                    </label>
                                                    <input className="pu-input" value={data.judul}
                                                        onChange={e => setData('judul', e.target.value)}
                                                        placeholder="Contoh: Layang-Layang Nusantara" maxLength={100} />
                                                    <div style={{ display:'flex', justifyContent:'space-between', marginTop:5 }}>
                                                        {errors.judul ? <p style={{ fontSize:11, color:'#EF4444' }}>{errors.judul}</p> : <span />}
                                                        <span style={{ fontSize:10, color:'#8AACCC' }}>{data.judul.length}/100</span>
                                                    </div>
                                                </div>

                                                <div>
                                                    <label style={{ display:'block', fontSize:11, fontWeight:700, color:'#4A6A8A', marginBottom:8, letterSpacing:'.1em', textTransform:'uppercase' }}>
                                                        Deskripsi <span style={{ fontSize:10, color:'#8AACCC', fontWeight:500, textTransform:'none' }}>(opsional)</span>
                                                    </label>
                                                    <textarea className="pu-input" value={data.deskripsi}
                                                        onChange={e => setData('deskripsi', e.target.value)}
                                                        placeholder="Ceritakan konsep, inspirasi, dan makna desainmu..."
                                                        rows={5} style={{ resize:'vertical', minHeight:100 }} />
                                                </div>

                                                <div style={{ background:'rgba(99,102,241,0.06)', border:'1px solid rgba(99,102,241,0.15)', borderRadius:14, padding:'14px 16px' }}>
                                                    <p style={{ fontSize:11, fontWeight:700, color:'#6366F1', letterSpacing:'.1em', textTransform:'uppercase', marginBottom:8 }}>
                                                        <i className="ti ti-info-circle" style={{ marginRight:5 }} />Tips Upload
                                                    </p>
                                                    {['Format file: JPG atau PNG','Ukuran maksimal: 5MB per file',`Kamu bisa upload maks. ${max_uploads} desain`,'Pastikan gambar berkualitas tinggi'].map((tip, i) => (
                                                        <p key={i} style={{ fontSize:12, color:'#4A5C8A', display:'flex', alignItems:'center', gap:6, marginBottom:i < 3 ? 5 : 0 }}>
                                                            <i className="ti ti-check" style={{ fontSize:12, color:'#6366F1', flexShrink:0 }} />{tip}
                                                        </p>
                                                    ))}
                                                </div>

                                                <button type="submit" disabled={processing} className="pu-submit-btn">
                                                    {processing
                                                        ? <><i className="ti ti-loader-2" style={{ fontSize:18, animation:'spin-slow 1s linear infinite' }} />Mengupload...</>
                                                        : <><i className="ti ti-cloud-upload" style={{ fontSize:18 }} />Upload Desain Sekarang</>
                                                    }
                                                </button>
                                            </div>

                                            {/* Kanan – file zone */}
                                            <div className="anim-right delay-4">
                                                <label style={{ display:'block', fontSize:11, fontWeight:700, color:'#4A6A8A', marginBottom:8, letterSpacing:'.1em', textTransform:'uppercase' }}>
                                                    File Gambar <span style={{ color:'#EF4444' }}>*</span>
                                                </label>
                                                <input type="file" id="pu-file" accept="image/jpeg,image/png" style={{ display:'none' }}
                                                    onChange={e => handleFile(e.target.files?.[0] ?? null)} />

                                                {previewUrl ? (
                                                    <div style={{ borderRadius:18, overflow:'hidden', border:'2px solid rgba(14,165,233,0.25)', position:'relative' }}>
                                                        <img src={previewUrl} alt="Preview" style={{ width:'100%', height:260, objectFit:'cover', display:'block' }} />
                                                        <div style={{ position:'absolute', inset:0, background:'linear-gradient(to bottom,transparent 50%,rgba(0,0,0,0.5))' }} />
                                                        <div style={{ position:'absolute', bottom:0, left:0, right:0, padding:'12px 16px', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                                                            <p style={{ fontSize:12, color:'#fff', fontWeight:600, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', maxWidth:'70%' }}>
                                                                <i className="ti ti-photo-check" style={{ marginRight:5, color:'#34D399' }} />{previewName}
                                                            </p>
                                                            <button type="button" onClick={() => handleFile(null)} style={{ background:'rgba(239,68,68,0.85)', border:'none', borderRadius:8, color:'#fff', padding:'5px 10px', cursor:'pointer', fontSize:11, fontWeight:700, display:'flex', alignItems:'center', gap:4 }}>
                                                                <i className="ti ti-x" style={{ fontSize:12 }} /> Ganti
                                                            </button>
                                                        </div>
                                                        <label htmlFor="pu-file" style={{ position:'absolute', inset:0, cursor:'pointer' }} />
                                                    </div>
                                                ) : (
                                                    <label htmlFor="pu-file"
                                                        className={`pu-upload-zone${dragOver ? ' drag' : ''}`}
                                                        style={{ height:260 }}
                                                        onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                                                        onDragLeave={() => setDragOver(false)}
                                                        onDrop={e => { e.preventDefault(); setDragOver(false); handleFile(e.dataTransfer.files[0] ?? null); }}
                                                    >
                                                        <div style={{ width:72, height:72, borderRadius:20, background:'rgba(14,165,233,0.1)', display:'flex', alignItems:'center', justifyContent:'center', border:'1px solid rgba(14,165,233,0.2)' }}>
                                                            <i className="ti ti-photo-plus" style={{ fontSize:32, color:'#0EA5E9' }} />
                                                        </div>
                                                        <div>
                                                            <p style={{ fontFamily:"'Montserrat',sans-serif", fontWeight:800, fontSize:15, color:'#0EA5E9', marginBottom:6 }}>Klik atau drag & drop gambar</p>
                                                            <p style={{ fontSize:12, color:'#8AACCC' }}>Mendukung JPG dan PNG · Maks. 5MB</p>
                                                        </div>
                                                        <div style={{ display:'flex', gap:8 }}>
                                                            {['JPG','PNG'].map(f => (
                                                                <span key={f} style={{ background:'rgba(14,165,233,0.1)', color:'#0EA5E9', border:'1px solid rgba(14,165,233,0.2)', borderRadius:8, padding:'3px 10px', fontSize:11, fontWeight:700 }}>{f}</span>
                                                            ))}
                                                        </div>
                                                    </label>
                                                )}
                                                {errors.file && <p style={{ color:'#EF4444', fontSize:11, marginTop:6 }}>{errors.file}</p>}
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            )}

                            {/* ══ MY DESIGNS ══ */}
                            <div className="anim-bottom delay-5">
                                <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:20 }}>
                                    <div className="anim-pop delay-5" style={{ width:38, height:38, borderRadius:12, background:'linear-gradient(135deg,#6366F1,#4338CA)', display:'flex', alignItems:'center', justifyContent:'center' }}>
                                        <i className="ti ti-photo" style={{ fontSize:18, color:'#fff' }} />
                                    </div>
                                    <h2 style={{ fontFamily:"'Montserrat',sans-serif", fontWeight:800, fontSize:18, color:'#0B1F3A' }}>Desain Saya</h2>
                                    <span style={{ marginLeft:'auto', background:'rgba(14,165,233,0.12)', color:'#0EA5E9', borderRadius:999, padding:'4px 14px', fontSize:12, fontWeight:700, fontFamily:"'Montserrat',sans-serif" }}>
                                        {designs.length} desain
                                    </span>
                                </div>

                                {designs.length === 0 ? (
                                    <div className="pu-card anim-scale delay-6" style={{ padding:'60px 40px', textAlign:'center' }}>
                                        <div style={{ fontSize:54, marginBottom:14, animation:'float-kite 3s ease-in-out infinite' }}>🪁</div>
                                        <p style={{ fontFamily:"'Montserrat',sans-serif", fontWeight:800, fontSize:18, color:'#0B1F3A', marginBottom:8 }}>Belum Ada Upload</p>
                                        <p style={{ fontSize:14, color:'#8AACCC' }}>Upload desain pertamamu menggunakan form di atas!</p>
                                    </div>
                                ) : (
                                    <div className="pu-designs-grid" style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:18 }}>
                                        {designs.map((d, i) => (
                                            <div key={d.id} className={`pu-design-thumb row-anim row-${Math.min(i, 5)}`}>
                                                <div style={{ position:'relative', overflow:'hidden', height:170 }}>
                                                    <img src={`/storage/${d.file_path}`} alt={d.judul}
                                                        style={{ width:'100%', height:'100%', objectFit:'cover', display:'block', transition:'transform .3s ease' }}
                                                        onMouseEnter={e => (e.currentTarget as HTMLImageElement).style.transform = 'scale(1.07)'}
                                                        onMouseLeave={e => (e.currentTarget as HTMLImageElement).style.transform = ''} />
                                                    <div style={{ position:'absolute', inset:0, background:'linear-gradient(to bottom,transparent 40%,rgba(11,31,58,0.6))' }} />
                                                    <div style={{ position:'absolute', top:10, right:10 }}>
                                                        <span style={{ background:'rgba(255,255,255,0.9)', borderRadius:999, padding:'3px 10px', fontSize:10, fontWeight:800, color:'#0EA5E9', fontFamily:"'Montserrat',sans-serif" }}>#{i + 1}</span>
                                                    </div>
                                                </div>
                                                <div style={{ padding:'14px 16px' }}>
                                                    <p style={{ fontFamily:"'Montserrat',sans-serif", fontWeight:800, fontSize:13, color:'#0B1F3A', marginBottom:4, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{d.judul}</p>
                                                    {d.deskripsi && <p style={{ fontSize:11, color:'#8AACCC', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', marginBottom:8 }}>{d.deskripsi}</p>}
                                                    <p style={{ fontSize:10, color:'#AAC4D8', display:'flex', alignItems:'center', gap:4 }}>
                                                        <i className="ti ti-calendar" style={{ fontSize:11 }} />
                                                        {new Date(d.created_at).toLocaleDateString('id-ID', { day:'numeric', month:'long', year:'numeric' })}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                        </div>
                    </main>
                </PageTransition>
            </div>
        </>
    );
}