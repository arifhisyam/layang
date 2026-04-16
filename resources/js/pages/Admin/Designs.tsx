import { Link } from '@inertiajs/react';
import AppNavbar from '@/components/AppNavbar';

interface AuthUser {
    name: string;
    email: string;
    role: string;
}

interface Juri {
    name: string;
}

interface Score {
    id: number;
    rata_rata: number;
    juri: Juri | null;
}

interface Design {
    id: number;
    judul: string;
    file_path: string;
    user: { name: string } | null;
    scores: Score[];
}

interface Props {
    auth: { user: AuthUser };
    designs: Design[];
}

export default function AdminDesigns({ auth, designs }: Props) {
    return (
        <div className="min-h-screen bg-slate-50">
            <AppNavbar user={auth.user} />

            <div className="max-w-6xl mx-auto px-6 py-8">
                {/* Breadcrumb */}
                <div className="flex items-center gap-2 text-sm text-slate-400 mb-6">
                    <Link href="/admin/dashboard" className="hover:text-slate-600 transition">Dashboard</Link>
                    <span>/</span>
                    <span className="text-slate-700 font-medium">Semua Desain</span>
                </div>

                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-2xl font-bold text-slate-800">🖼 Semua Desain Peserta</h1>
                    <span className="text-slate-400 text-sm">{designs.length} desain total</span>
                </div>

                {designs.length === 0 ? (
                    <div className="text-center py-24 text-slate-400">
                        <div className="text-6xl mb-4">🖼</div>
                        <p className="text-lg">Belum ada desain yang diupload.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {designs.map((d) => (
                            <div key={d.id} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition">
                                <div className="relative">
                                    <img
                                        src={`/storage/${d.file_path}`}
                                        alt={d.judul}
                                        className="w-full h-48 object-cover"
                                    />
                                    {d.scores?.length > 0 ? (
                                        <span className="absolute top-3 right-3 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                                            ✅ Dinilai
                                        </span>
                                    ) : (
                                        <span className="absolute top-3 right-3 bg-amber-400 text-white text-xs font-bold px-2 py-1 rounded-full">
                                            ⏳ Pending
                                        </span>
                                    )}
                                </div>
                                <div className="p-4">
                                    <h3 className="font-bold text-slate-800 mb-1">{d.judul}</h3>
                                    <p className="text-sm text-slate-400 mb-3">Peserta: {d.user?.name ?? '-'}</p>
                                    {d.scores?.length > 0 ? (
                                        <div className="space-y-2">
                                            {d.scores.map((s) => (
                                                <div key={s.id} className="bg-green-50 rounded-xl p-3 flex justify-between items-center">
                                                    <p className="text-xs text-green-600 font-medium">Juri: {s.juri?.name ?? '-'}</p>
                                                    <p className="text-2xl font-extrabold text-green-700">{s.rata_rata}</p>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="bg-amber-50 rounded-xl p-3 text-center">
                                            <p className="text-xs text-amber-600">Belum ada penilaian</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}