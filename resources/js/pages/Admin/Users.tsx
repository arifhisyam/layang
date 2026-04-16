import { useForm, router, Link } from '@inertiajs/react';
import { FormEvent, useState } from 'react';
import AppNavbar from '@/components/AppNavbar';

interface AuthUser {
    name: string;
    email: string;
    role: string;
}

interface User {
    id: number;
    name: string;
    email: string;
    role: string;
}

interface Props {
    auth: { user: AuthUser };
    users: User[];
}

interface UserForm {
    name: string;
    email: string;
    password: string;
    [key: string]: string;
}

export default function AdminUsers({ auth, users }: Props) {
    const [showForm, setShowForm] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm<UserForm>({
        name: '',
        email: '',
        password: '',
    });

    const submit = (e: FormEvent) => {
        e.preventDefault();
        post('/admin/users/juri', {
            onSuccess: () => { reset(); setShowForm(false); },
        });
    };

    const hapus = (id: number) => {
        if (confirm('Hapus user ini? Tindakan ini tidak bisa dibatalkan.')) {
            router.delete(`/admin/users/${id}`);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50">
            <AppNavbar user={auth.user} />

            <div className="max-w-5xl mx-auto px-6 py-8">
                {/* Breadcrumb */}
                <div className="flex items-center gap-2 text-sm text-slate-400 mb-6">
                    <Link href="/admin/dashboard" className="hover:text-slate-600 transition">Dashboard</Link>
                    <span>/</span>
                    <span className="text-slate-700 font-medium">Kelola User</span>
                </div>

                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-2xl font-bold text-slate-800">👥 Kelola User & Juri</h1>
                    <button
                        onClick={() => setShowForm(!showForm)}
                        className="bg-indigo-600 text-white px-5 py-2 rounded-xl font-medium hover:bg-indigo-700 transition shadow"
                    >
                        + Tambah Juri
                    </button>
                </div>

                {/* Form Tambah Juri */}
                {showForm && (
                    <form onSubmit={submit} className="bg-white rounded-2xl p-6 shadow-sm mb-8 border border-indigo-100">
                        <h2 className="font-bold text-slate-700 mb-5 text-lg">Buat Akun Juri Baru</h2>
                        <div className="grid md:grid-cols-3 gap-4">
                            <div>
                                <label className="text-sm text-slate-600 mb-1 block font-medium">Nama Lengkap</label>
                                <input
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    placeholder="Nama juri..."
                                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-400 text-sm"
                                />
                                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                            </div>
                            <div>
                                <label className="text-sm text-slate-600 mb-1 block font-medium">Email</label>
                                <input
                                    type="email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    placeholder="email@domain.com"
                                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-400 text-sm"
                                />
                                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                            </div>
                            <div>
                                <label className="text-sm text-slate-600 mb-1 block font-medium">Password</label>
                                <input
                                    type="password"
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    placeholder="Min. 8 karakter"
                                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-400 text-sm"
                                />
                                {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                            </div>
                        </div>
                        <div className="flex gap-3 mt-5">
                            <button
                                type="submit"
                                disabled={processing}
                                className="bg-indigo-600 text-white px-6 py-2.5 rounded-xl font-medium hover:bg-indigo-700 transition disabled:opacity-50 text-sm"
                            >
                                {processing ? 'Menyimpan...' : '✓ Buat Akun Juri'}
                            </button>
                            <button
                                type="button"
                                onClick={() => setShowForm(false)}
                                className="px-6 py-2.5 border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 transition text-sm"
                            >
                                Batal
                            </button>
                        </div>
                    </form>
                )}

                {/* Tabel User */}
                <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                    {users.length === 0 ? (
                        <div className="text-center py-16 text-slate-400">
                            <div className="text-5xl mb-3">👥</div>
                            <p>Belum ada user terdaftar.</p>
                        </div>
                    ) : (
                        <table className="w-full text-sm">
                            <thead className="bg-slate-50 border-b border-slate-100">
                                <tr className="text-left text-slate-400">
                                    <th className="px-6 py-4 font-medium">Nama</th>
                                    <th className="px-6 py-4 font-medium">Email</th>
                                    <th className="px-6 py-4 font-medium">Role</th>
                                    <th className="px-6 py-4 font-medium">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {users.map((u) => (
                                    <tr key={u.id} className="hover:bg-slate-50 transition">
                                        <td className="px-6 py-4 font-medium text-slate-700">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-bold text-sm">
                                                    {u.name.charAt(0).toUpperCase()}
                                                </div>
                                                {u.name}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-slate-500">{u.email}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${u.role === 'juri' ? 'bg-indigo-100 text-indigo-700' : 'bg-sky-100 text-sky-700'}`}>
                                                {u.role === 'juri' ? '⭐ Juri' : '👤 Peserta'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <button
                                                onClick={() => hapus(u.id)}
                                                className="text-red-400 hover:text-red-600 text-xs font-medium transition hover:underline"
                                            >
                                                Hapus
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
}