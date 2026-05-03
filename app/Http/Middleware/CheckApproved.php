<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class CheckApproved
{
    public function handle(Request $request, Closure $next): Response
    {
        $user = Auth::user();

        if (!$user) {
            return redirect()->route('login');
        }

        // Admin & juri selalu diizinkan (status approved otomatis saat dibuat)
        if (in_array($user->role, ['admin', 'juri'])) {
            return $next($request);
        }

        // Peserta pending → logout & beri pesan
        if ($user->status === 'pending') {
            Auth::logout();
            $request->session()->invalidate();
            $request->session()->regenerateToken();

            return redirect()->route('login')
                ->withErrors(['email' => 'Akunmu sedang menunggu persetujuan admin. Harap bersabar.']);
        }

        // Peserta rejected → logout & beri pesan
        if ($user->status === 'rejected') {
            Auth::logout();
            $request->session()->invalidate();
            $request->session()->regenerateToken();

            return redirect()->route('login')
                ->withErrors(['email' => 'Akunmu telah ditolak admin. Hubungi panitia untuk informasi lebih lanjut.']);
        }

        return $next($request);
    }
}