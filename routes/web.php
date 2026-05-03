<?php

use App\Http\Controllers\AdminController;
use App\Http\Controllers\DesignController;
use App\Http\Controllers\JuriController;
use App\Http\Controllers\LeaderboardController;
use App\Http\Controllers\PesertaController;
use App\Http\Controllers\ScoreController;
use App\Models\Design;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Laravel\Fortify\Features;

// ── Landing page ──────────────────────────────────────
Route::get('/', function () {
    // Ambil desain dengan rata-rata nilai tertinggi (maks 12 karya untuk galeri)
    $galleryDesigns = Design::with(['user:id,name', 'scores'])
        ->has('scores') // hanya yang sudah dinilai
        ->get()
        ->map(function ($design) {
            $avgScore = $design->scores->avg(function ($score) {
                return ($score->tema + $score->kreativitas + $score->estetik + $score->teknik) / 4;
            });
            return [
                'id'           => $design->id,
                'judul'        => $design->judul,
                'deskripsi'    => $design->deskripsi,
                'file_path'    => $design->file_path,
                'user'         => ['name' => $design->user->name],
                'avg_score'    => round($avgScore ?? 0, 2),
                'total_scores' => $design->scores->count(),
            ];
        })
        ->sortByDesc('avg_score')
        ->take(12)
        ->values();

    return inertia('Welcome', [
        'canRegister'    => Features::enabled(Features::registration()),
        'galleryDesigns' => $galleryDesigns,
    ]);
})->name('home');

// ── Leaderboard publik (tanpa login) ─────────────────
Route::get('/leaderboard', [LeaderboardController::class, 'public'])->name('leaderboard');

// ── Redirect dashboard berdasarkan role ───────────────
Route::middleware(['auth', 'approved'])->get('/dashboard', function () {
    /** @var \App\Models\User $user */
    $user = Auth::user();

    return match ($user->role) {
        'admin'  => redirect()->route('admin.dashboard'),
        'juri'   => redirect()->route('juri.dashboard'),
        default  => redirect()->route('peserta.dashboard'),
    };
})->name('dashboard');

// ── Admin ─────────────────────────────────────────────
Route::middleware(['auth', 'verified', 'role:admin'])
    ->prefix('admin')
    ->name('admin.')
    ->group(function () {
        Route::get('/dashboard',             [AdminController::class, 'dashboard'])->name('dashboard');

        // Kelola user (peserta)
        Route::get('/users',                 [AdminController::class, 'users'])->name('users');
        Route::post('/users/{user}/approve', [AdminController::class, 'approve'])->name('users.approve');
        Route::post('/users/{user}/reject',  [AdminController::class, 'reject'])->name('users.reject');
        Route::delete('/users/{user}',       [AdminController::class, 'deleteUser'])->name('users.destroy');

        // Kelola juri (halaman terpisah)
        Route::get('/juri',                  [AdminController::class, 'juri'])->name('juri');
        Route::post('/users/juri',           [AdminController::class, 'createJuri'])->name('users.juri');

        // Desain & leaderboard
        Route::get('/designs',               [AdminController::class, 'allDesigns'])->name('designs');
        Route::delete('/designs/{design}',   [DesignController::class, 'destroyAdmin'])->name('designs.destroy');
        Route::get('/leaderboard',           [LeaderboardController::class, 'admin'])->name('leaderboard');
    });

// ── Juri ──────────────────────────────────────────────
Route::middleware(['auth', 'verified', 'approved', 'role:juri'])
    ->prefix('juri')
    ->name('juri.')
    ->group(function () {
        Route::get('/dashboard',                 [JuriController::class, 'dashboard'])->name('dashboard');
        Route::get('/designs',                   [JuriController::class, 'designs'])->name('designs');
        Route::get('/designs/{design}',          [JuriController::class, 'showDesign'])->name('designs.show');
        Route::post('/designs/{design}/score',   [ScoreController::class, 'store'])->name('score.store');
        Route::put('/designs/{design}/score',    [ScoreController::class, 'update'])->name('score.update');
        Route::get('/leaderboard',               [LeaderboardController::class, 'juri'])->name('leaderboard');
    });

// ── Peserta ───────────────────────────────────────────
Route::middleware(['auth', 'verified', 'approved', 'role:peserta'])
    ->prefix('peserta')
    ->name('peserta.')
    ->group(function () {
        Route::get('/dashboard',           [PesertaController::class, 'dashboard'])->name('dashboard');
        Route::get('/upload',              [PesertaController::class, 'upload'])->name('upload');
        Route::post('/upload',             [DesignController::class, 'upload'])->name('upload');
        Route::delete('/designs/{design}', [DesignController::class, 'destroy'])->name('designs.destroy');
        Route::get('/leaderboard',         [LeaderboardController::class, 'peserta'])->name('leaderboard');
    });

require __DIR__ . '/settings.php';