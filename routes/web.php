<?php

use App\Http\Controllers\AdminController;
use App\Http\Controllers\DesignController;
use App\Http\Controllers\JuriController;
use App\Http\Controllers\PesertaController;
use App\Http\Controllers\ScoreController;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Laravel\Fortify\Features;

// ── Landing page ──────────────────────────────────────
Route::inertia('/', 'Welcome', [
    'canRegister' => Features::enabled(Features::registration()),
])->name('home');

// ── Redirect dashboard berdasarkan role ───────────────
Route::middleware('auth')->get('/dashboard', function () {
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
        Route::get('/dashboard',          [AdminController::class, 'dashboard'])->name('dashboard');
        Route::get('/users',              [AdminController::class, 'users'])->name('users');
        Route::post('/users/juri',        [AdminController::class, 'createJuri'])->name('users.juri');
        Route::delete('/users/{user}',    [AdminController::class, 'deleteUser'])->name('users.destroy');
        Route::get('/designs',            [AdminController::class, 'allDesigns'])->name('designs');
    });

// ── Juri ──────────────────────────────────────────────
Route::middleware(['auth', 'verified', 'role:juri'])
    ->prefix('juri')
    ->name('juri.')
    ->group(function () {
        Route::get('/dashboard',                 [JuriController::class, 'dashboard'])->name('dashboard');
        Route::get('/designs',                   [JuriController::class, 'designs'])->name('designs');
        Route::get('/designs/{design}',          [JuriController::class, 'showDesign'])->name('designs.show');
        Route::post('/designs/{design}/score',   [ScoreController::class, 'store'])->name('score.store');
        Route::put('/designs/{design}/score',    [ScoreController::class, 'update'])->name('score.update');
    });

// ── Peserta ───────────────────────────────────────────
Route::middleware(['auth', 'verified', 'role:peserta'])
    ->prefix('peserta')
    ->name('peserta.')
    ->group(function () {
        Route::get('/dashboard',           [PesertaController::class, 'dashboard'])->name('dashboard');
        Route::post('/upload',             [DesignController::class, 'upload'])->name('upload');
        Route::delete('/designs/{design}', [DesignController::class, 'destroy'])->name('designs.destroy');
    });

require __DIR__ . '/settings.php';