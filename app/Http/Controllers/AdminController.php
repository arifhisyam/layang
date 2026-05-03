<?php

namespace App\Http\Controllers;

use App\Models\Design;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class AdminController extends Controller
{
    /** Data auth user yang selalu disertakan ke setiap render */
    private function authData(): array
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();

        return [
            'auth' => [
                'user' => [
                    'name'  => $user->name,
                    'email' => $user->email,
                    'role'  => $user->role,
                ],
            ],
        ];
    }

    /** Hitung pending_count — dipakai di beberapa halaman untuk badge sidebar */
    private function pendingCount(): int
    {
        return User::where('role', 'peserta')->where('status', 'pending')->count();
    }

    public function dashboard(): Response
    {
        return Inertia::render('Admin/Dashboard', array_merge($this->authData(), [
            'stats' => [
                'total_peserta' => User::where('role', 'peserta')->where('status', 'approved')->count(),
                'total_juri'    => User::where('role', 'juri')->count(),
                'total_desain'  => Design::count(),
                'pending_count' => $this->pendingCount(),
            ],
            'recent_designs' => Design::with(['user', 'scores'])
                ->latest()
                ->take(10)
                ->get(),
            'top_rankings' => Design::with(['user', 'scores'])
                ->get()
                ->filter(fn ($d) => $d->scores->count() > 0)
                ->map(fn ($d) => [
                    'id'            => $d->id,
                    'judul'         => $d->judul,
                    'file_path'     => $d->file_path,
                    'peserta'       => $d->user?->name ?? '-',
                    'nilai_rata_rata' => round($d->scores->avg('rata_rata'), 1),
                ])
                ->sortByDesc('nilai_rata_rata')
                ->values()
                ->take(5)
                ->map(fn ($item, $idx) => array_merge($item, ['rank' => $idx + 1]))
                ->values(),
        ]));
    }

    public function users(): Response
    {
        return Inertia::render('Admin/Users', array_merge($this->authData(), [
            'pending_users'  => User::where('role', 'peserta')->where('status', 'pending')->latest()->get(),
            'approved_users' => User::where('role', 'peserta')->where('status', 'approved')->latest()->get(),
            'rejected_users' => User::where('role', 'peserta')->where('status', 'rejected')->latest()->get(),
        ]));
    }

    public function juri(): Response
    {
        return Inertia::render('Admin/Juri', array_merge($this->authData(), [
            'juri_users'    => User::where('role', 'juri')->latest()->get(),
            'pending_count' => $this->pendingCount(),
        ]));
    }

    public function createJuri(Request $request): RedirectResponse
    {
        $request->validate([
            'name'     => 'required|string|max:255',
            'email'    => 'required|email|unique:users',
            'password' => 'required|min:8',
        ]);

        User::create([
            'name'     => $request->name,
            'email'    => $request->email,
            'password' => bcrypt($request->password),
            'role'     => 'juri',
            'status'   => 'approved',
        ]);

        return back()->with('success', 'Akun juri berhasil dibuat!');
    }

    public function approve(User $user): RedirectResponse
    {
        abort_if($user->role === 'admin', 403);
        $user->update(['status' => 'approved']);

        return back()->with('success', "Akun {$user->name} berhasil disetujui!");
    }

    public function reject(User $user): RedirectResponse
    {
        abort_if($user->role === 'admin', 403);
        $user->update(['status' => 'rejected']);

        return back()->with('success', "Akun {$user->name} telah ditolak.");
    }

    public function deleteUser(User $user): RedirectResponse
    {
        abort_if($user->role === 'admin', 403, 'Tidak bisa hapus akun admin.');
        $user->delete();

        return back()->with('success', 'User berhasil dihapus.');
    }

    public function allDesigns(): Response
    {
        return Inertia::render('Admin/Designs', array_merge($this->authData(), [
            'designs'       => Design::with(['user', 'scores.juri'])->latest()->get(),
            'pending_count' => $this->pendingCount(),
        ]));
    }
}