import { useForm } from '@inertiajs/react';
import { FormEvent, useState } from 'react';
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
    tema: number;
    kreativitas: number;
    estetik: number;
    teknik: number;
    rata_rata: number;
    catatan: string | null;
    juri: Juri | null;
}

interface Design {
    id: number;
    judul: string;
    file_path: string;
    deskripsi: string | null;
    scores: Score[];
}

interface Props {
    auth: { user: AuthUser };
    designs: Design[];
}

interface UploadForm {
    judul: string;
    deskripsi: string;
    file: File | null;
    [key: string]: string | File | null;
}

export default function PesertaDashboard({ auth, designs }: Props) {
    const [showUploadForm, setShowUploadForm] = useState(false);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    const { data, setData, post, processing, errors, reset } = useForm<UploadForm>({
        judul:     '',
        deskripsi: '',
        file:      null,
    });

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] ?? null;
        setData('file', file);
        if (file) {
            setPreviewUrl(URL.createObjectURL(file));
        } else {
            setPreviewUrl(null);
        }
    };

    const submit = (e: FormEvent) => {
        e.preventDefault();
        post('/peserta/upload', {
            forceFormData: true,
            onSuccess: () => {
                reset();
                setPreviewUrl(null);
                setShowUploadForm(false);
            },
        });
    };

    const sudahDinilai = designs.filter((d) => d.scores?.length > 0);
    const belumDinilai = designs.filter((d) => d.scores?.length === 0);

    return (
        <div className="min-h-screen bg-sky-50">
            <AppNavbar user={auth.user} />

            <div className="max-w-5xl mx-auto px-6 py-8 space-y-8">

                {/* Sapaan */}
                <div>
                    <h1 className="text-2xl font-bold text-sky-900">Halo, {auth.user.name}! 👋</h1>
                    <p className="text-slate-500 text-sm mt-1">
                        Selamat datang di dashboard peserta — Kompetisi Desain Layang-Layang 2025.
                    </p>
                </div>

                {/* Stat Ringkas */}
                <div className="grid grid-cols-3 gap-4">
                    <div className="bg-white rounded-2xl p-5 shadow-sm text-center border border-sky-50">
                        <p className="text-3xl font-extrabold text-sky-600">{designs.length}</p>
                        <p className="text-xs text-slate-400 mt-1">Total Upload</p>
                    </div>
                    <div className="bg-white rounded-2xl p-5 shadow-sm text-center border border-green-50">
                        <p className="text-3xl font-extrabold text-green-600">{sudahDinilai.length}</p>
                        <p className="text-xs text-slate-400 mt-1">Sudah Dinilai</p>
                    </div>
                    <div className="bg-white rounded-2xl p-5 shadow-sm text-center border border-amber-50">
                        <p className="text-3xl font-extrabold text-amber-500">{belumDinilai.length}</p>
                        <p className="text-xs text-slate-400 mt-1">Menunggu Nilai</p>
                    </div>
                </div>

                {/* Download Juknis */}
                <div className="bg-gradient-to-r from-indigo-500 to-sky-500 rounded-2xl p-6 text-white shadow flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div>
                        <h2 className="text-lg font-bold mb-1">📄 Juknis Lomba Desain Layang-Layang 2025</h2>
                        <p className="text-indigo-100 text-sm">
                            Download petunjuk teknis lengkap sebelum mengikuti kompetisi.
                        </p>
                    </div>
                    <a
                        href="/storage/juknis/juknis-layang-layang-2025.pdf"
                        download
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-shrink-0 bg-white text-indigo-700 font-bold px-6 py-3 rounded-xl hover:bg-indigo-50 transition shadow text-sm whitespace-nowrap"
                    >
                        ⬇️ Download Juknis
                    </a>
                </div>

                {/* Upload Desain */}
                <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                    <div
                        className="flex justify-between items-center px-6 py-5 cursor-pointer hover:bg-sky-50 transition select-none"
                        onClick={() => setShowUploadForm(!showUploadForm)}
                    >
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-sky-100 rounded-xl flex items-center justify-center text-xl">📤</div>
                            <div>
                                <h2 className="font-bold text-slate-800">Upload Desain</h2>
                                <p className="text-xs text-slate-400">JPG / PNG, maksimal 5MB</p>
                            </div>
                        </div>
                        <span className="text-slate-400 text-lg">{showUploadForm ? '▲' : '▼'}</span>
                    </div>

                    {showUploadForm && (
                        <form onSubmit={submit} className="px-6 pb-6 border-t border-slate-100">
                            <div className="grid md:grid-cols-2 gap-5 mt-5">
                                {/* Input */}
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-600 mb-1">
                                            Judul Desain <span className="text-red-400">*</span>
                                        </label>
                                        <input
                                            value={data.judul}
                                            onChange={(e) => setData('judul', e.target.value)}
                                            placeholder="Contoh: Layang-Layang Nusantara"
                                            className="w-full border border-slate-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-sky-400 text-sm"
                                        />
                                        {errors.judul && <p className="text-red-500 text-xs mt-1">{errors.judul}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-600 mb-1">
                                            File Desain <span className="text-red-400">*</span>
                                        </label>
                                        <input
                                            type="file"
                                            accept="image/jpeg,image/png"
                                            onChange={handleFileChange}
                                            className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:bg-sky-100 file:text-sky-700 file:font-medium"
                                        />
                                        {errors.file && <p className="text-red-500 text-xs mt-1">{errors.file}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-600 mb-1">
                                            Deskripsi (opsional)
                                        </label>
                                        <textarea
                                            value={data.deskripsi}
                                            onChange={(e) => setData('deskripsi', e.target.value)}
                                            placeholder="Ceritakan konsep desainmu..."
                                            rows={3}
                                            className="w-full border border-slate-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-sky-400 text-sm resize-none"
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="w-full bg-sky-600 text-white py-3 rounded-xl font-bold hover:bg-sky-700 transition disabled:opacity-50 text-sm shadow"
                                    >
                                        {processing ? 'Mengupload...' : '📤 Upload Desain'}
                                    </button>
                                </div>

                                {/* Preview */}
                                <div className="flex flex-col items-center justify-center">
                                    {previewUrl ? (
                                        <div className="w-full">
                                            <p className="text-xs text-slate-400 mb-2 font-medium text-center">Preview</p>
                                            <img
                                                src={previewUrl}
                                                alt="Preview"
                                                className="w-full max-h-56 object-cover rounded-2xl border border-slate-100 shadow"
                                            />
                                        </div>
                                    ) : (
                                        <div className="w-full h-48 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-300">
                                            <span className="text-4xl mb-2">🖼</span>
                                            <p className="text-sm">Preview gambar muncul di sini</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </form>
                    )}
                </div>

                {/* Desain & Hasil Penilaian */}
                <div>
                    <h2 className="text-xl font-bold text-slate-800 mb-5">📊 Desain & Hasil Penilaian</h2>

                    {designs.length === 0 ? (
                        <div className="bg-white rounded-2xl p-16 text-center text-slate-300 shadow-sm">
                            <div className="text-6xl mb-4">🪁</div>
                            <p className="text-lg font-medium">Kamu belum upload desain apapun.</p>
                            <p className="text-sm mt-1">Klik "Upload Desain" di atas untuk memulai!</p>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {designs.map((d) => (
                                <div key={d.id} className="bg-white rounded-2xl shadow-sm overflow-hidden">
                                    <div className="flex flex-col md:flex-row">
                                        {/* Gambar */}
                                        <div className="md:w-56 flex-shrink-0">
                                            <img
                                                src={`/storage/${d.file_path}`}
                                                alt={d.judul}
                                                className="w-full h-48 md:h-full object-cover"
                                            />
                                        </div>

                                        {/* Konten */}
                                        <div className="flex-1 p-6">
                                            <div className="flex justify-between items-start mb-3">
                                                <div>
                                                    <h3 className="text-lg font-bold text-slate-800">{d.judul}</h3>
                                                    {d.deskripsi && (
                                                        <p className="text-slate-400 text-sm mt-0.5">{d.deskripsi}</p>
                                                    )}
                                                </div>
                                                {d.scores?.length > 0 ? (
                                                    <span className="bg-green-100 text-green-700 text-xs font-bold px-3 py-1 rounded-full flex-shrink-0 ml-2">
                                                        ✅ Sudah Dinilai
                                                    </span>
                                                ) : (
                                                    <span className="bg-amber-100 text-amber-700 text-xs font-bold px-3 py-1 rounded-full flex-shrink-0 ml-2">
                                                        ⏳ Menunggu Penilaian
                                                    </span>
                                                )}
                                            </div>

                                            {d.scores?.length > 0 ? (
                                                <div className="space-y-4">
                                                    {d.scores.map((s) => (
                                                        <div key={s.id}>
                                                            <p className="text-xs text-slate-400 mb-3">
                                                                Dinilai oleh:{' '}
                                                                <span className="font-semibold text-slate-600">{s.juri?.name ?? '-'}</span>
                                                            </p>

                                                            {/* 4 Kriteria */}
                                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
                                                                {(
                                                                    [
                                                                        ['🎨', 'Tema', s.tema],
                                                                        ['💡', 'Kreativitas', s.kreativitas],
                                                                        ['✨', 'Estetik', s.estetik],
                                                                        ['🔧', 'Teknik', s.teknik],
                                                                    ] as [string, string, number][]
                                                                ).map(([icon, label, value]) => (
                                                                    <div key={label} className="bg-sky-50 rounded-xl p-3 text-center">
                                                                        <p className="text-base mb-0.5">{icon}</p>
                                                                        <p className="text-xs text-sky-500 mb-0.5">{label}</p>
                                                                        <p className="text-xl font-extrabold text-sky-700">{value}</p>
                                                                    </div>
                                                                ))}
                                                            </div>

                                                            {/* Rata-rata */}
                                                            <div className="bg-gradient-to-r from-green-400 to-emerald-500 rounded-xl p-4 flex items-center justify-between text-white">
                                                                <div>
                                                                    <p className="text-sm opacity-80">Nilai Rata-rata</p>
                                                                    <p className="text-4xl font-extrabold">{s.rata_rata}</p>
                                                                </div>
                                                                <div className="text-right opacity-80">
                                                                    <p className="text-xs">dari 100 poin</p>
                                                                    <p className="text-3xl">🏆</p>
                                                                </div>
                                                            </div>

                                                            {/* Catatan Juri */}
                                                            {s.catatan && (
                                                                <div className="mt-3 bg-slate-50 rounded-xl p-4 border-l-4 border-sky-400">
                                                                    <p className="text-xs text-slate-400 font-medium mb-1 uppercase tracking-wide">
                                                                        Catatan dari Juri
                                                                    </p>
                                                                    <p className="text-sm text-slate-600 italic">"{s.catatan}"</p>
                                                                </div>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <div className="bg-amber-50 rounded-xl p-4 text-center">
                                                    <p className="text-amber-600 text-sm">
                                                        Desainmu sedang menunggu penilaian dari juri. Bersabarlah! 😊
                                                    </p>
                                                </div>
                                            )}
                                        </div>
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