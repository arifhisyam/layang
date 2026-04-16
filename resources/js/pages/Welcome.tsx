import { Head, Link } from '@inertiajs/react';
import { login, register, dashboard } from '@/routes';

interface AuthUser {
    name: string;
    email: string;
}

interface Props {
    auth: { user: AuthUser | null };
    canRegister?: boolean;
}

export default function Welcome({ auth, canRegister = true }: Props) {
    return (
        <>
            <Head title="Layang-Layang Event — Kompetisi Desain 2025" />

            <div className="min-h-screen bg-gradient-to-br from-sky-100 via-blue-50 to-indigo-100">

                {/* ── Navbar ── */}
                <nav className="w-full px-8 py-5 flex justify-between items-center max-w-6xl mx-auto">
                    <div className="flex items-center gap-3">
                        <span className="text-4xl select-none">🪁</span>
                        <div>
                            <p className="text-xl font-extrabold text-sky-900 leading-none">Layang-Layang Event</p>
                            <p className="text-xs text-sky-500">Kompetisi Desain Nasional 2025</p>
                        </div>
                    </div>
                    <div className="flex gap-3 items-center">
                        {auth.user ? (
                            <Link
                                href={dashboard()}
                                className="px-5 py-2 bg-sky-600 text-white rounded-xl font-semibold hover:bg-sky-700 transition shadow"
                            >
                                Dashboard →
                            </Link>
                        ) : (
                            <>
                                <Link
                                    href={login()}
                                    className="px-5 py-2 text-sky-700 font-semibold hover:text-sky-900 transition"
                                >
                                    Masuk
                                </Link>
                                {canRegister && (
                                    <Link
                                        href={register()}
                                        className="px-5 py-2 bg-sky-600 text-white rounded-xl font-semibold hover:bg-sky-700 transition shadow"
                                    >
                                        Daftar Sekarang
                                    </Link>
                                )}
                            </>
                        )}
                    </div>
                </nav>

                {/* ── Hero ── */}
                <div className="max-w-6xl mx-auto px-8 pt-16 pb-12 flex flex-col lg:flex-row items-center gap-12">
                    <div className="flex-1 text-center lg:text-left">
                        <span className="inline-block bg-sky-100 text-sky-700 text-xs font-bold px-4 py-1.5 rounded-full mb-4 tracking-wide uppercase">
                            🏆 Open Registration 2025
                        </span>
                        <h1 className="text-5xl lg:text-6xl font-extrabold text-sky-900 leading-tight mb-5">
                            Kompetisi<br />
                            <span className="text-sky-500">Desain</span>{' '}
                            <span className="text-indigo-500">Layang-Layang</span>
                        </h1>
                        <p className="text-lg text-slate-600 mb-8 max-w-lg">
                            Tunjukkan kreativitas dan keahlianmu! Upload desain layang-layangmu,
                            dapatkan penilaian langsung dari juri profesional, dan raih juara.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
                            {canRegister && !auth.user && (
                                <Link
                                    href={register()}
                                    className="px-8 py-4 bg-sky-600 text-white text-lg font-bold rounded-2xl hover:bg-sky-700 shadow-lg hover:shadow-xl transition-all text-center"
                                >
                                    Ikut Sekarang →
                                </Link>
                            )}
                            {!auth.user && (
                                <Link
                                    href={login()}
                                    className="px-8 py-4 bg-white text-sky-700 text-lg font-bold rounded-2xl border-2 border-sky-200 hover:border-sky-400 transition-all text-center"
                                >
                                    Sudah Punya Akun
                                </Link>
                            )}
                        </div>
                    </div>

                    {/* Ilustrasi */}
                    <div className="flex-shrink-0">
                        <div className="relative">
                            <div className="w-64 h-64 lg:w-80 lg:h-80 bg-gradient-to-br from-sky-300 to-indigo-400 rounded-full flex items-center justify-center shadow-2xl">
                                <span className="text-9xl lg:text-[8rem] select-none">🪁</span>
                            </div>
                            <div className="absolute -top-4 -right-4 bg-white rounded-2xl px-4 py-3 shadow-lg border border-sky-100">
                                <p className="text-xs text-slate-500">Total Peserta</p>
                                <p className="text-2xl font-extrabold text-sky-700">500+</p>
                            </div>
                            <div className="absolute -bottom-4 -left-4 bg-white rounded-2xl px-4 py-3 shadow-lg border border-indigo-100">
                                <p className="text-xs text-slate-500">Total Hadiah</p>
                                <p className="text-lg font-extrabold text-indigo-700">Jutaan Rp</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── Cara Ikut ── */}
                <div className="max-w-6xl mx-auto px-8 py-16">
                    <h2 className="text-3xl font-extrabold text-sky-900 text-center mb-3">Cara Ikut Kompetisi</h2>
                    <p className="text-center text-slate-500 mb-12">Mudah, cepat, dan transparan</p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[
                            { step: '01', icon: '📝', title: 'Daftar Akun', desc: 'Buat akun peserta secara gratis dan lengkapi profil kamu.', color: 'from-sky-400 to-sky-600' },
                            { step: '02', icon: '📤', title: 'Upload Desain', desc: 'Upload foto desain layang-layangmu dalam format JPG/PNG.', color: 'from-indigo-400 to-indigo-600' },
                            { step: '03', icon: '🏆', title: 'Terima Penilaian', desc: 'Juri menilai berdasarkan 4 kriteria dan hasilnya langsung masuk ke dashboardmu.', color: 'from-emerald-400 to-emerald-600' },
                        ].map((item) => (
                            <div key={item.step} className="bg-white rounded-3xl p-8 shadow-sm hover:shadow-md transition relative overflow-hidden">
                                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center text-2xl mb-5 shadow`}>
                                    {item.icon}
                                </div>
                                <span className="absolute top-6 right-6 text-6xl font-extrabold text-slate-50 select-none">{item.step}</span>
                                <h3 className="text-lg font-bold text-slate-800 mb-2">{item.title}</h3>
                                <p className="text-slate-500 text-sm leading-relaxed">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ── Kriteria Penilaian ── */}
                <div className="max-w-6xl mx-auto px-8 pb-16">
                    <h2 className="text-3xl font-extrabold text-sky-900 text-center mb-3">Kriteria Penilaian</h2>
                    <p className="text-center text-slate-500 mb-12">Setiap kriteria dinilai 0–100 poin oleh juri profesional</p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[
                            { icon: '🎨', label: 'Tema',        desc: 'Kesesuaian dengan tema lomba' },
                            { icon: '💡', label: 'Kreativitas', desc: 'Orisinalitas dan inovasi desain' },
                            { icon: '✨', label: 'Estetik',     desc: 'Keindahan dan komposisi visual' },
                            { icon: '🔧', label: 'Teknik',      desc: 'Kualitas dan detail teknis' },
                        ].map((k) => (
                            <div key={k.label} className="bg-white/80 backdrop-blur rounded-2xl p-6 text-center shadow-sm hover:shadow-md transition">
                                <div className="text-4xl mb-3">{k.icon}</div>
                                <h3 className="font-bold text-sky-800 mb-1">{k.label}</h3>
                                <p className="text-xs text-slate-500">{k.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ── CTA ── */}
                {canRegister && !auth.user && (
                    <div className="max-w-6xl mx-auto px-8 pb-20">
                        <div className="bg-gradient-to-r from-sky-500 to-indigo-600 rounded-3xl p-12 text-center text-white shadow-xl">
                            <h2 className="text-3xl font-extrabold mb-3">Siap Ikut Kompetisi?</h2>
                            <p className="text-sky-100 mb-8 text-lg">
                                Daftar sekarang dan jadilah bagian dari kompetisi desain layang-layang terbesar!
                            </p>
                            <Link
                                href={register()}
                                className="inline-block px-10 py-4 bg-white text-sky-700 font-extrabold text-lg rounded-2xl hover:bg-sky-50 transition shadow-lg"
                            >
                                Daftar Gratis Sekarang →
                            </Link>
                        </div>
                    </div>
                )}

                {/* Footer */}
                <div className="text-center pb-8 text-slate-400 text-sm">
                    © 2025 Layang-Layang Event. All rights reserved.
                </div>
            </div>
        </>
        
    );
    
}