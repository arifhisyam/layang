import { Link } from '@inertiajs/react';
import { useState, useRef, useEffect } from 'react';

interface AuthUser {
    name: string;
    email: string;
    role: string;
}

interface Props {
    user: AuthUser;
}

const roleBadge: Record<string, string> = {
    admin:   'bg-purple-100 text-purple-700',
    juri:    'bg-indigo-100 text-indigo-700',
    peserta: 'bg-sky-100 text-sky-700',
};

const roleLabel: Record<string, string> = {
    admin:   'Admin',
    juri:    'Juri',
    peserta: 'Peserta',
};

const avatarColor: Record<string, string> = {
    admin:   'bg-purple-600',
    juri:    'bg-indigo-600',
    peserta: 'bg-sky-600',
};

export default function AppNavbar({ user }: Props) {
    const [open, setOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Tutup dropdown saat klik di luar
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <header className="bg-white border-b border-slate-200 px-6 py-4 sticky top-0 z-50">
            <div className="max-w-6xl mx-auto flex justify-between items-center">

                {/* Logo */}
                <div className="flex items-center gap-3">
                    <span className="text-2xl select-none">🪁</span>
                    <div>
                        <p className="font-extrabold text-slate-800 text-base leading-none">
                            Layang-Layang Event
                        </p>
                        <p className="text-xs text-slate-400 leading-none mt-0.5">
                            Kompetisi Desain 2025
                        </p>
                    </div>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ml-1 ${roleBadge[user.role] ?? 'bg-slate-100 text-slate-600'}`}>
                        {roleLabel[user.role] ?? user.role}
                    </span>
                </div>

                {/* User Dropdown */}
                <div className="relative" ref={dropdownRef}>
                    <button
                        onClick={() => setOpen(!open)}
                        className="flex items-center gap-2 hover:opacity-80 transition focus:outline-none"
                        aria-label="Menu akun"
                    >
                        {/* Avatar */}
                        <div className={`w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm ${avatarColor[user.role] ?? 'bg-slate-500'}`}>
                            {user.name.charAt(0).toUpperCase()}
                        </div>
                        {/* Nama - sembunyikan di layar kecil */}
                        <span className="hidden sm:block text-sm font-semibold text-slate-700 max-w-[120px] truncate">
                            {user.name}
                        </span>
                        {/* Chevron */}
                        <svg
                            className={`w-4 h-4 text-slate-400 transition-transform ${open ? 'rotate-180' : ''}`}
                            fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                        </svg>
                    </button>

                    {/* Dropdown Menu */}
                    {open && (
                        <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-lg border border-slate-100 py-2 z-50">
                            {/* Info user */}
                            <div className="px-4 py-3 border-b border-slate-100">
                                <p className="text-sm font-semibold text-slate-800 truncate">{user.name}</p>
                                <p className="text-xs text-slate-400 truncate">{user.email}</p>
                            </div>

                            {/* Settings */}
                            <Link
                                href="/settings/profile"
                                className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50 transition w-full"
                                onClick={() => setOpen(false)}
                            >
                                <span className="text-base">⚙️</span>
                                Pengaturan Akun
                            </Link>

                            

                            {/* Divider */}
                            <div className="border-t border-slate-100 my-1" />

                            {/* Logout */}
                            <Link
                                href="/logout"
                                method="post"
                                as="button"
                                className="flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition w-full text-left"
                                onClick={() => setOpen(false)}
                            >
                                <span className="text-base">🚪</span>
                                Keluar
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}