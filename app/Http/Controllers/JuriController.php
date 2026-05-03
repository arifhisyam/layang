<?php

namespace App\Http\Controllers;

use App\Models\Design;
use App\Models\Score;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class JuriController extends Controller
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
        $juriId = (int) Auth::id();

        return Inertia::render('Juri/Dashboard', array_merge($this->authData(), [
            'total_dinilai'       => Score::where('juri_id', $juriId)->count(),
            'total_belum_dinilai' => Design::whereDoesntHave('scores', function ($q) use ($juriId) {
                $q->where('juri_id', $juriId);
            })->count(),
            'penilaian_terakhir'  => Score::where('juri_id', $juriId)
                ->with(['design.user', 'design.event'])
                ->latest()
                ->take(5)
                ->get(),
        ]));
    }

    public function designs(): Response
    {
        $juriId = (int) Auth::id();

        return Inertia::render('Juri/Designs', array_merge($this->authData(), [
            'designs' => Design::with([
                'user',
                'event',
                'scores' => fn ($q) => $q->where('juri_id', $juriId),
            ])->latest()->get(),
        ]));
    }

    public function showDesign(Design $design): Response
    {
        $juriId = (int) Auth::id();

        return Inertia::render('Juri/ScoreDesign', array_merge($this->authData(), [
            'design'        => $design->load(['user', 'event']),
            'existingScore' => Score::where('design_id', $design->id)
                ->where('juri_id', $juriId)
                ->first(),
        ]));
    }
}