<?php

namespace App\Http\Controllers;

use App\Models\Design;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class PesertaController extends Controller
{
    public function dashboard(): Response
    {
        $userId = (int) Auth::id();

        return Inertia::render('Peserta/Dashboard', [
            'designs' => Design::where('user_id', $userId)
                ->with(['event', 'scores.juri'])
                ->latest()
                ->get(),
            // Tidak perlu passing 'events' karena event dipilih otomatis
        ]);
    }
}