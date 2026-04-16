import { Link } from '@inertiajs/react';
import AppNavbar from '@/components/AppNavbar';

interface AuthUser {
    name: string;
    email: string;
    role: string;
}

interface Score {
    id: number;
    rata_rata: number;
}

interface Design {
    id: number;
    judul: string;
    file_path: string;
    user: { name: string } | null;
    scores: Score[];
}

interface Stats {
    total_peserta: number;
    total_juri: number;
    total_desain: number;
}

interface Props {
    auth: { user: AuthUser };
    stats: Stats;
    recent_designs: Design[];
}

export default function AdminDashboard({ auth, stats, recent_designs }: Props) {
    return (
        <div className="min-h-screen bg-slate-50">
            <AppNavbar user={auth.user} />

            <div className="max-w-6xl mx-auto px-6 py-8">
                <h1 className="text-2xl font-bold text-slate-800 mb-8">Dashboard Admin</h1>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
                    {[
                        { label: 'Total Peserta', value: stats.total_peserta, color: 'bg-sky-500',     icon: '👤' },
                        { label: 'Total Juri',    value: stats.total_juri,    color: 'bg-indigo-500',  icon: '⭐' },
                        { label: 'Total Desain',  value: stats.total_desain,  color: 'bg-emerald-500', icon: '🖼' },
                    ].map((s) => (
                        <div key={s.label} className={`${s.color} text-white rounded-2xl p-6 shadow flex items-center gap-5`}>
                            <div className="text-4xl">{s.icon}</div>
                            <div>
                                <div className="text-4xl font-extrabold">{s.value}</div>
                                <div className="text-sm opacity-80 mt-0.5">{s.label}</div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Quick Links */}
                <div className="flex flex-wrap gap-3 mb-10">
                    <Link
                        href="/admin/users"
                        className="px-5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-700 hover:bg-slate-100 font-medium transition flex items-center gap-2 shadow-sm"
                    >
                        👥 Kelola User & Juri
                    </Link>
                    <Link
                        href="/admin/designs"
                        className="px-5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-700 hover:bg-slate-100 font-medium transition flex items-center gap-2 shadow-sm"
                    >
                        🖼 Lihat Semua Desain
                    </Link>
                </div>

                {/* Recent Designs */}
                <div className="bg-white rounded-2xl shadow-sm p-6">
                    <div className="flex justify-between items-center mb-5">
                        <h2 className="text-lg font-bold text-slate-700">Desain Terbaru</h2>
                        <Link href="/admin/designs" className="text-sm text-sky-600 hover:underline">
                            Lihat semua →
                        </Link>
                    </div>

                    {recent_designs.length === 0 ? (
                        <div className="text-center py-12 text-slate-400">
                            <div className="text-5xl mb-3">🖼</div>
                            <p>Belum ada desain yang diupload</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="text-left text-slate-400 border-b border-slate-100">
                                        <th className="pb-3 font-medium">Desain</th>
                                        <th className="pb-3 font-medium">Peserta</th>
                                        <th className="pb-3 font-medium">Status</th>
                                        <th className="pb-3 font-medium">Rata-rata</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {recent_designs.map((d) => (
                                        <tr key={d.id} className="hover:bg-slate-50 transition">
                                            <td className="py-3">
                                                <div className="flex items-center gap-3">
                                                    <img
                                                        src={`/storage/${d.file_path}`}
                                                        alt={d.judul}
                                                        className="w-12 h-12 rounded-lg object-cover border border-slate-100"
                                                    />
                                                    <span className="font-medium text-slate-700">{d.judul}</span>
                                                </div>
                                            </td>
                                            <td className="py-3 text-slate-500">{d.user?.name ?? '-'}</td>
                                            <td className="py-3">
                                                {d.scores?.length > 0 ? (
                                                    <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-medium">✅ Dinilai</span>
                                                ) : (
                                                    <span className="bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-xs font-medium">⏳ Pending</span>
                                                )}
                                            </td>
                                            <td className="py-3 font-bold text-emerald-600">
                                                {d.scores?.length > 0 ? d.scores[0].rata_rata : '-'}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}