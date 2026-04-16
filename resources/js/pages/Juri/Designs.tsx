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

interface Props {
    auth: { user: AuthUser };
    designs: Design[];
}

export default function JuriDesigns({ auth, designs }: Props) {
    const belumDinilai = designs.filter((d) => d.scores?.length === 0);
    const sudahDinilai = designs.filter((d) => d.scores?.length > 0);

    return (
        <div className="min-h-screen bg-indigo-50">
            <AppNavbar user={auth.user} />

            <div className="max-w-5xl mx-auto px-6 py-8">
                {/* Breadcrumb */}
                <div className="flex items-center gap-2 text-sm text-slate-400 mb-6">
                    <Link href="/juri/dashboard" className="hover:text-slate-600 transition">Dashboard</Link>
                    <span>/</span>
                    <span className="text-slate-700 font-medium">Daftar Desain</span>
                </div>

                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-2xl font-bold text-indigo-900">🖼 Desain Peserta</h1>
                    <div className="flex gap-3 text-sm">
                        <span className="bg-amber-100 text-amber-700 px-3 py-1 rounded-full font-medium">
                            {belumDinilai.length} belum dinilai
                        </span>
                        <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full font-medium">
                            {sudahDinilai.length} sudah dinilai
                        </span>
                    </div>
                </div>

                {designs.length === 0 ? (
                    <div className="text-center py-24 text-indigo-300">
                        <div className="text-6xl mb-4">🖼</div>
                        <p className="text-lg">Belum ada desain yang diupload peserta.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {designs.map((d) => (
                            <div key={d.id} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition">
                                <div className="relative">
                                    <img
                                        src={`/storage/${d.file_path}`}
                                        alt={d.judul}
                                        className="w-full h-52 object-cover"
                                    />
                                    {d.scores?.length > 0 && (
                                        <span className="absolute top-3 right-3 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                                            ✅ Sudah dinilai
                                        </span>
                                    )}
                                </div>
                                <div className="p-5">
                                    <h3 className="font-bold text-slate-800 text-lg mb-1">{d.judul}</h3>
                                    <p className="text-slate-400 text-sm mb-4">
                                        Peserta: <span className="font-medium text-slate-600">{d.user?.name ?? '-'}</span>
                                    </p>
                                    {d.scores?.length > 0 ? (
                                        <div className="bg-green-50 rounded-xl p-3 flex justify-between items-center">
                                            <span className="text-green-700 text-sm font-medium">Nilai sudah diberikan</span>
                                            <span className="text-2xl font-extrabold text-green-700">{d.scores[0].rata_rata}</span>
                                        </div>
                                    ) : (
                                        <Link
                                            href={`/juri/designs/${d.id}`}
                                            className="block text-center bg-indigo-600 text-white py-2.5 rounded-xl font-semibold hover:bg-indigo-700 transition text-sm"
                                        >
                                            ⭐ Nilai Sekarang
                                        </Link>
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