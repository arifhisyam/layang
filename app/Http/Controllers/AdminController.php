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
        return ['auth' => ['user' => Auth::user()->only('name', 'email', 'role')]];
    }

    public function dashboard(): Response
    {
        return Inertia::render('Admin/Dashboard', array_merge($this->authData(), [
            'stats' => [
                'total_peserta' => User::where('role', 'peserta')->count(),
                'total_juri'    => User::where('role', 'juri')->count(),
                'total_desain'  => Design::count(),
            ],
            'recent_designs' => Design::with(['user', 'scores'])
                ->latest()
                ->take(10)
                ->get(),
        ]));
    }

    public function users(): Response
    {
        return Inertia::render('Admin/Users', array_merge($this->authData(), [
            'users' => User::whereIn('role', ['juri', 'peserta'])->latest()->get(),
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
        ]);

        return back()->with('success', 'Akun juri berhasil dibuat!');
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
            'designs' => Design::with(['user', 'scores.juri'])->latest()->get(),
        ]));
    }
}