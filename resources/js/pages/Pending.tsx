import { Head, Link } from '@inertiajs/react';
import { login } from '@/routes';

export default function Pending() {
    return (
        <>
            <Head title="Menunggu Persetujuan — Layang-Layang Event" />
            <div className="min-h-screen bg-gradient-to-br from-sky-50 to-indigo-100 flex items-center justify-center px-4">
                <div className="max-w-md w-full bg-white rounded-3xl shadow-lg p-10 text-center">

                    {/* Ikon animasi */}
                    <div className="w-24 h-24 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6 text-5xl">
                        ⏳
                    </div>

                    <h1 className="text-2xl font-extrabold text-slate-800 mb-3">
                        Pendaftaran Berhasil!
                    </h1>
                    <p className="text-slate-500 mb-6 leading-relaxed">
                        Akunmu sedang menunggu persetujuan dari admin panitia.
                        Kamu akan bisa masuk dan mengikuti lomba setelah akunmu disetujui.
                    </p>

                    {/* Timeline */}
                    <div className="text-left space-y-3 mb-8">
                        {[
                            { icon: '✅', label: 'Daftar akun',           done: true },
                            { icon: '⏳', label: 'Menunggu persetujuan admin', done: false },
                            { icon: '🔓', label: 'Akun aktif — bisa login & upload', done: false },
                        ].map((step, i) => (
                            <div key={i} className={`flex items-center gap-3 px-4 py-3 rounded-xl ${step.done ? 'bg-green-50' : 'bg-slate-50'}`}>
                                <span className="text-xl">{step.icon}</span>
                                <span className={`text-sm font-medium ${step.done ? 'text-green-700' : 'text-slate-500'}`}>
                                    {step.label}
                                </span>
                            </div>
                        ))}
                    </div>

                    <p className="text-xs text-slate-400 mb-6">
                        Jika sudah disetujui, silakan masuk dengan email dan password yang telah kamu daftarkan.
                    </p>

                    <Link
                        href={login()}
                        className="block w-full bg-sky-600 text-white py-3 rounded-xl font-bold hover:bg-sky-700 transition text-center"
                    >
                        Coba Masuk
                    </Link>
                </div>
            </div>
        </>
    );
}