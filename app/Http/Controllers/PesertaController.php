<?php

namespace App\Http\Controllers;

use App\Models\Design;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class PesertaController extends Controller
{
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

    public function dashboard(): Response
    {
        $userId = (int) Auth::id();

        return Inertia::render('Peserta/Dashboard', array_merge($this->authData(), [
            'designs' => Design::where('user_id', $userId)
                ->with(['event', 'scores.juri'])
                ->latest()
                ->get(),
        ]));
    }

    public function upload(): Response
    {
        $userId = (int) Auth::id();

        return Inertia::render('Peserta/Upload', array_merge($this->authData(), [
            'designs'     => Design::where('user_id', $userId)->latest()->get(),
            'max_uploads' => 5,
        ]));
    }
}