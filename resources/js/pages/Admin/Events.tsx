import { useForm } from '@inertiajs/react';
import { FormEvent, useState } from 'react';

interface Event {
    id: number;
    nama: string;
    deskripsi: string | null;
    tanggal_mulai: string;
    tanggal_selesai: string;
    status: 'aktif' | 'selesai' | 'draft';
    designs_count: number;
}

interface Props {
    events: Event[];
}

interface EventForm {
    nama: string;
    deskripsi: string;
    tanggal_mulai: string;
    tanggal_selesai: string;
    status: string;
    [key: string]: string;
}

export default function AdminEvents({ events }: Props) {
    const [showForm, setShowForm] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm<EventForm>({
        nama: '',
        deskripsi: '',
        tanggal_mulai: '',
        tanggal_selesai: '',
        status: 'draft',
    });

    const submit = (e: FormEvent) => {
        e.preventDefault();
        post('/admin/events', {
            onSuccess: () => {
                reset();
                setShowForm(false);
            },
        });
    };

    return (
        <div className="min-h-screen bg-slate-50">
            <div className="max-w-5xl mx-auto px-6 py-8">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-slate-800">📅 Kelola Event</h1>
                    <button
                        onClick={() => setShowForm(!showForm)}
                        className="bg-sky-600 text-white px-5 py-2 rounded-xl font-medium hover:bg-sky-700 transition"
                    >
                        + Buat Event
                    </button>
                </div>

                {showForm && (
                    <form onSubmit={submit} className="bg-white rounded-2xl p-6 shadow-sm mb-8">
                        <h2 className="font-bold text-slate-700 mb-4">Event Baru</h2>
                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm text-slate-600 mb-1 block">Nama Event</label>
                                <input
                                    value={data.nama}
                                    onChange={(e) => setData('nama', e.target.value)}
                                    className="w-full border rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-sky-400"
                                />
                                {errors.nama && <p className="text-red-500 text-xs mt-1">{errors.nama}</p>}
                            </div>
                            <div>
                                <label className="text-sm text-slate-600 mb-1 block">Status</label>
                                <select
                                    value={data.status}
                                    onChange={(e) => setData('status', e.target.value)}
                                    className="w-full border rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-sky-400"
                                >
                                    <option value="draft">Draft</option>
                                    <option value="aktif">Aktif</option>
                                    <option value="selesai">Selesai</option>
                                </select>
                            </div>
                            <div>
                                <label className="text-sm text-slate-600 mb-1 block">Tanggal Mulai</label>
                                <input
                                    type="date"
                                    value={data.tanggal_mulai}
                                    onChange={(e) => setData('tanggal_mulai', e.target.value)}
                                    className="w-full border rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-sky-400"
                                />
                                {errors.tanggal_mulai && <p className="text-red-500 text-xs mt-1">{errors.tanggal_mulai}</p>}
                            </div>
                            <div>
                                <label className="text-sm text-slate-600 mb-1 block">Tanggal Selesai</label>
                                <input
                                    type="date"
                                    value={data.tanggal_selesai}
                                    onChange={(e) => setData('tanggal_selesai', e.target.value)}
                                    className="w-full border rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-sky-400"
                                />
                                {errors.tanggal_selesai && <p className="text-red-500 text-xs mt-1">{errors.tanggal_selesai}</p>}
                            </div>
                            <div className="md:col-span-2">
                                <label className="text-sm text-slate-600 mb-1 block">Deskripsi</label>
                                <textarea
                                    value={data.deskripsi}
                                    onChange={(e) => setData('deskripsi', e.target.value)}
                                    rows={3}
                                    className="w-full border rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-sky-400"
                                />
                            </div>
                        </div>
                        <div className="flex gap-3 mt-4">
                            <button
                                type="submit"
                                disabled={processing}
                                className="bg-sky-600 text-white px-6 py-2 rounded-xl font-medium hover:bg-sky-700 transition disabled:opacity-50"
                            >
                                {processing ? 'Menyimpan...' : 'Simpan Event'}
                            </button>
                            <button
                                type="button"
                                onClick={() => setShowForm(false)}
                                className="px-6 py-2 border rounded-xl text-slate-600 hover:bg-slate-50 transition"
                            >
                                Batal
                            </button>
                        </div>
                    </form>
                )}

                <div className="grid gap-4">
                    {events.map((ev) => (
                        <div
                            key={ev.id}
                            className="bg-white rounded-2xl p-5 shadow-sm flex justify-between items-center"
                        >
                            <div>
                                <h3 className="font-bold text-slate-800">{ev.nama}</h3>
                                <p className="text-sm text-slate-400">
                                    {ev.tanggal_mulai} – {ev.tanggal_selesai}
                                </p>
                                <p className="text-sm text-slate-500 mt-1">{ev.designs_count} desain</p>
                            </div>
                            <span
                                className={`px-3 py-1 rounded-full text-xs font-medium ${
                                    ev.status === 'aktif'
                                        ? 'bg-green-100 text-green-700'
                                        : ev.status === 'selesai'
                                        ? 'bg-slate-100 text-slate-600'
                                        : 'bg-amber-100 text-amber-700'
                                }`}
                            >
                                {ev.status}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}