<?php

namespace App\Http\Controllers;

use App\Models\Design;
use App\Models\Score;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class JuriController extends Controller
{
    private function authData(): array
    {
        /** @var User $user */
        $user = Auth::user();

        return [
            'auth' => [
                'user' => [
                    'id'    => $user->id,
                    'name'  => $user->name,
                    'email' => $user->email,
                    'role'  => $user->role,
                ],
            ],
        ];
    }

    public function dashboard(): Response
    {
        /** @var User $user */
        $user   = Auth::user();
        $juriId = (int) $user->id;

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
        /** @var User $user */
        $user    = Auth::user();
        $designs = Design::with(['user', 'scores'])->get();

        return Inertia::render('Juri/Designs', [
            'auth'    => [
                'user' => [
                    'id'    => $user->id,
                    'name'  => $user->name,
                    'email' => $user->email,
                    'role'  => $user->role,
                ],
            ],
            'designs' => $designs->map(fn($d) => [
                'id'        => $d->id,
                'judul'     => $d->judul,
                'file_path' => $d->file_path,
                'user'      => $d->user ? ['name' => $d->user->name] : null,
                'scores'    => $d->scores->map(fn($s) => [
                    'id'        => $s->id,
                    'juri_id'   => $s->juri_id,
                    'rata_rata' => $s->rata_rata,
                ]),
            ]),
        ]);
    }

    public function showDesign(int $design): Response
    {
        /** @var User $user */
        $user      = Auth::user();
        $juriId    = (int) $user->id;
        $design    = Design::with(['user', 'event', 'scores'])->findOrFail($design);

        $existingScore  = $design->scores->firstWhere('juri_id', $juriId);
        $otherJuriScore = $design->scores->first(fn($s) => $s->juri_id !== $juriId);

        return Inertia::render('Juri/ScoreDesign', [
            'auth'           => [
                'user' => [
                    'id'    => $user->id,
                    'name'  => $user->name,
                    'email' => $user->email,
                    'role'  => $user->role,
                ],
            ],
            'design'         => [
                'id'        => $design->id,
                'judul'     => $design->judul,
                'file_path' => $design->file_path,
                'deskripsi' => $design->deskripsi,
                'user'      => $design->user ? ['name' => $design->user->name] : null,
                'event'     => $design->event ? ['nama' => $design->event->nama] : null,
            ],
            'existingScore'  => $existingScore ? [
                'tema'        => $existingScore->tema,
                'kreativitas' => $existingScore->kreativitas,
                'estetik'     => $existingScore->estetik,
                'teknik'      => $existingScore->teknik,
                'catatan'     => $existingScore->catatan,
                'juri_id'     => $existingScore->juri_id,
            ] : null,
            'otherJuriScore' => $otherJuriScore ? [
                'tema'        => $otherJuriScore->tema,
                'kreativitas' => $otherJuriScore->kreativitas,
                'estetik'     => $otherJuriScore->estetik,
                'teknik'      => $otherJuriScore->teknik,
                'catatan'     => $otherJuriScore->catatan,
                'juri_id'     => $otherJuriScore->juri_id,
            ] : null,
        ]);
    }
}