<?php

namespace App\Http\Controllers;

use App\Models\Design;
use App\Models\Score;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class LeaderboardController extends Controller
{
    /**
     * Ambil data leaderboard — ranking desain berdasarkan rata-rata nilai juri.
     * Hanya desain yang sudah dinilai minimal 1 juri yang masuk ranking.
     */
    private function getRankings(): array
    {
        return Design::select(
                'designs.id',
                'designs.judul',
                'designs.file_path',
                'designs.user_id',
                DB::raw('AVG((scores.tema + scores.kreativitas + scores.estetik + scores.teknik) / 4) as nilai_rata_rata'),
                DB::raw('COUNT(scores.id) as jumlah_juri'),
                DB::raw('AVG(scores.tema) as avg_tema'),
                DB::raw('AVG(scores.kreativitas) as avg_kreativitas'),
                DB::raw('AVG(scores.estetik) as avg_estetik'),
                DB::raw('AVG(scores.teknik) as avg_teknik')
            )
            ->join('scores', 'designs.id', '=', 'scores.design_id')
            ->with('user:id,name')
            ->groupBy('designs.id', 'designs.judul', 'designs.file_path', 'designs.user_id')
            ->orderByDesc('nilai_rata_rata')
            ->get()
            ->map(function ($item, $index) {
                return [
                    'rank'             => $index + 1,
                    'id'               => $item->id,
                    'judul'            => $item->judul,
                    'file_path'        => $item->file_path,
                    'peserta'          => $item->user?->name ?? '-',
                    'user_id'          => $item->user_id,
                    'nilai_rata_rata'  => round($item->nilai_rata_rata, 2),
                    'jumlah_juri'      => $item->jumlah_juri,
                    'detail' => [
                        'tema'        => round($item->avg_tema, 1),
                        'kreativitas' => round($item->avg_kreativitas, 1),
                        'estetik'     => round($item->avg_estetik, 1),
                        'teknik'      => round($item->avg_teknik, 1),
                    ],
                ];
            })
            ->toArray();
    }

    /** Leaderboard publik — tanpa login */
    public function public(): Response
    {
        return Inertia::render('Leaderboard', [
            'rankings' => $this->getRankings(),
        ]);
    }

    /** Leaderboard untuk admin */
    public function admin(): Response
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();

        return Inertia::render('Admin/Leaderboard', [
            'auth'     => ['user' => ['name' => $user->name, 'email' => $user->email, 'role' => $user->role]],
            'rankings' => $this->getRankings(),
        ]);
    }

    /** Leaderboard untuk juri */
    public function juri(): Response
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();

        $belumDinilai = Design::whereDoesntHave('scores', function ($q) use ($user) {
            $q->where('juri_id', $user->id);
        })->count();

        return Inertia::render('Juri/Leaderboard', [
            'auth'          => ['user' => ['name' => $user->name, 'email' => $user->email, 'role' => $user->role]],
            'rankings'      => $this->getRankings(),
            'belum_dinilai' => $belumDinilai,
        ]);
    }

    /** Leaderboard untuk peserta — dengan highlight posisi sendiri */
    public function peserta(): Response
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();
        $rankings = $this->getRankings();

        // Cari posisi peserta yang sedang login
        $myRank = null;
        foreach ($rankings as $item) {
            if ($item['user_id'] === $user->id) {
                $myRank = $item;
                break;
            }
        }

        return Inertia::render('Peserta/Leaderboard', [
            'auth'     => ['user' => ['name' => $user->name, 'email' => $user->email, 'role' => $user->role]],
            'rankings' => $rankings,
            'my_rank'  => $myRank,
        ]);
    }
}