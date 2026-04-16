import { Link } from '@inertiajs/react';
import AppNavbar from '@/components/AppNavbar';

interface AuthUser {
    name: string;
    email: string;
    role: string;
}

interface Design {
    judul: string;
    user: { name: string } | null;
}

interface Penilaian {
    id: number;
    rata_rata: number;
    design: Design | null;
}

interface Props {
    auth: { user: AuthUser };
    total_dinilai: number;
    total_belum_dinilai: number;
    penilaian_terakhir: Penilaian[];
}

export default function JuriDashboard({ auth, total_dinilai, total_belum_dinilai, penilaian_terakhir }: Props) {
    return (
        <div className="min-h-screen bg-indigo-50">
            <AppNavbar user={auth.user} />

            <div className="max-w-4xl mx-auto px-6 py-8">
                <h1 className="text-2xl font-bold text-indigo-900 mb-2">
                    Selamat datang, {auth.user.name}! 👋
                </h1>
                <p className="text-slate-500 text-sm mb-8">
                    Panel penilaian juri — Kompetisi Desain Layang-Layang 2025
                </p>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 mb-8">
                    <div className="bg-indigo-600 text-white rounded-2xl p-6 shadow flex items-center gap-5">
                        <div className="text-4xl">✅</div>
                        <div>
                            <div className="text-4xl font-extrabold">{total_dinilai}</div>
                            <div className="text-sm opacity-80 mt-0.5">Sudah Dinilai</div>
                        </div>
                    </div>
                    <div className="bg-amber-500 text-white rounded-2xl p-6 shadow flex items-center gap-5">
                        <div className="text-4xl">⏳</div>
                        <div>
                            <div className="text-4xl font-extrabold">{total_belum_dinilai}</div>
                            <div className="text-sm opacity-80 mt-0.5">Belum Dinilai</div>
                        </div>
                    </div>
                </div>

                {/* CTA */}
                <Link
                    href="/juri/designs"
                    className="block w-full text-center bg-indigo-600 text-white py-4 rounded-2xl font-bold text-lg hover:bg-indigo-700 transition mb-8 shadow"
                >
                    ⭐ Mulai Menilai Desain →
                </Link>

                {/* Penilaian Terakhir */}
                <div className="bg-white rounded-2xl shadow-sm p-6">
                    <h2 className="font-bold text-slate-700 mb-5 text-lg">Penilaian Terakhir</h2>
                    {penilaian_terakhir.length === 0 ? (
                        <div className="text-center py-10 text-slate-400">
                            <div className="text-4xl mb-3">📋</div>
                            <p>Belum ada penilaian yang diberikan.</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {penilaian_terakhir.map((s) => (
                                <div key={s.id} className="flex items-center justify-between border border-slate-100 rounded-xl p-4 hover:bg-slate-50 transition">
                                    <div>
                                        <p className="font-semibold text-slate-700">{s.design?.judul ?? '-'}</p>
                                        <p className="text-sm text-slate-400">{s.design?.user?.name ?? '-'}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-2xl font-extrabold text-indigo-600">{s.rata_rata}</p>
                                        <p className="text-xs text-slate-400">rata-rata</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}