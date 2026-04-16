import { useForm, Link } from '@inertiajs/react';
import { FormEvent } from 'react';
import AppNavbar from '@/components/AppNavbar';

interface AuthUser {
    name: string;
    email: string;
    role: string;
}

interface Design {
    id: number;
    judul: string;
    file_path: string;
    deskripsi: string | null;
    user: { name: string } | null;
    event: { nama: string } | null;
}

interface ExistingScore {
    tema: number;
    kreativitas: number;
    estetik: number;
    teknik: number;
    catatan: string | null;
}

interface Props {
    auth: { user: AuthUser };
    design: Design;
    existingScore: ExistingScore | null;
}

// ← Fix utama: type alias spesifik agar setData tidak error
type ScoreField = 'tema' | 'kreativitas' | 'estetik' | 'teknik';

interface ScoreForm {
    tema: number;
    kreativitas: number;
    estetik: number;
    teknik: number;
    catatan: string;
}

export default function ScoreDesign({ auth, design, existingScore }: Props) {
    const { data, setData, post, put, processing, errors } = useForm<ScoreForm>({
        tema:        existingScore?.tema        ?? 0,
        kreativitas: existingScore?.kreativitas ?? 0,
        estetik:     existingScore?.estetik     ?? 0,
        teknik:      existingScore?.teknik      ?? 0,
        catatan:     existingScore?.catatan     ?? '',
    });

    const submit = (e: FormEvent) => {
        e.preventDefault();
        if (existingScore) {
            put(`/juri/designs/${design.id}/score`);
        } else {
            post(`/juri/designs/${design.id}/score`);
        }
    };

    const avg = (
        (Number(data.tema) + Number(data.kreativitas) + Number(data.estetik) + Number(data.teknik)) / 4
    ).toFixed(1);

    // Komponen slider — ScoreField memastikan setData tidak error
    const ScoreSlider = ({ label, field }: { label: string; field: ScoreField }) => (
        <div className="bg-sky-50 rounded-2xl p-5">
            <div className="flex justify-between items-center mb-3">
                <label className="font-semibold text-sky-800 text-base">{label}</label>
                <span className="text-3xl font-extrabold text-sky-600 w-14 text-right">{data[field]}</span>
            </div>
            <input
                type="range"
                min={0}
                max={100}
                step={1}
                value={Number(data[field])}
                onChange={(e) => setData(field, Number(e.target.value))}
                className="w-full accent-sky-500 h-2"
            />
            <div className="flex justify-between text-xs text-sky-300 mt-1">
                <span>0 — Sangat Kurang</span>
                <span>100 — Sempurna</span>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-sky-50">
            <AppNavbar user={auth.user} />

            <div className="max-w-4xl mx-auto px-6 py-8">
                {/* Breadcrumb */}
                <div className="flex items-center gap-2 text-sm text-slate-400 mb-6">
                    <Link href="/juri/dashboard" className="hover:text-slate-600 transition">Dashboard</Link>
                    <span>/</span>
                    <Link href="/juri/designs" className="hover:text-slate-600 transition">Desain</Link>
                    <span>/</span>
                    <span className="text-slate-700 font-medium">Nilai</span>
                </div>

                <h1 className="text-2xl font-bold text-sky-900 mb-6">⭐ Form Penilaian Desain</h1>

                <div className="grid md:grid-cols-2 gap-8">
                    {/* Preview Desain */}
                    <div className="space-y-4">
                        <img
                            src={`/storage/${design.file_path}`}
                            alt={design.judul}
                            className="w-full rounded-2xl shadow-md object-cover max-h-80"
                        />
                        <div className="bg-white rounded-2xl p-5 shadow-sm">
                            <h2 className="text-xl font-bold text-sky-800 mb-2">{design.judul}</h2>
                            <div className="space-y-1">
                                <p className="text-sm text-slate-500">
                                    <span className="font-medium text-slate-600">Peserta:</span>{' '}
                                    {design.user?.name ?? '-'}
                                </p>
                                <p className="text-sm text-slate-500">
                                    <span className="font-medium text-slate-600">Event:</span>{' '}
                                    {design.event?.nama ?? '-'}
                                </p>
                            </div>
                            {design.deskripsi && (
                                <div className="mt-3 pt-3 border-t border-slate-100">
                                    <p className="text-xs text-slate-400 mb-1 font-medium uppercase tracking-wide">Deskripsi</p>
                                    <p className="text-sm text-slate-600">{design.deskripsi}</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Form Nilai */}
                    <form onSubmit={submit} className="space-y-4">
                        <ScoreSlider label="🎨 Tema"        field="tema" />
                        <ScoreSlider label="💡 Kreativitas" field="kreativitas" />
                        <ScoreSlider label="✨ Estetik"     field="estetik" />
                        <ScoreSlider label="🔧 Teknik"      field="teknik" />

                        {/* Live Average */}
                        <div className="bg-gradient-to-r from-sky-500 to-indigo-500 rounded-2xl p-5 text-center text-white shadow">
                            <p className="text-sm opacity-80 mb-1">Rata-rata Sementara</p>
                            <p className="text-6xl font-extrabold">{avg}</p>
                            <p className="text-sm opacity-70 mt-1">dari 100 poin</p>
                        </div>

                        <div>
                            <label className="text-sm font-medium text-slate-600 mb-1 block">
                                Catatan untuk peserta (opsional)
                            </label>
                            <textarea
                                value={data.catatan}
                                onChange={(e) => setData('catatan', e.target.value)}
                                placeholder="Berikan masukan atau komentar untuk peserta..."
                                rows={3}
                                className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-sky-400 text-sm resize-none"
                            />
                            {errors.catatan && <p className="text-red-500 text-xs mt-1">{errors.catatan}</p>}
                        </div>

                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full bg-sky-600 text-white py-3.5 rounded-xl font-bold hover:bg-sky-700 transition text-lg disabled:opacity-50 shadow"
                        >
                            {processing ? 'Menyimpan...' : existingScore ? '✏️ Update Penilaian' : '✅ Kirim Penilaian'}
                        </button>

                        {existingScore && (
                            <p className="text-center text-xs text-slate-400">
                                Anda sudah pernah menilai desain ini. Klik update untuk memperbarui.
                            </p>
                        )}
                    </form>
                </div>
            </div>
        </div>
    );
}