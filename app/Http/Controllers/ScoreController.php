<?php

namespace App\Http\Controllers;

use App\Models\Score;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ScoreController extends Controller
{
    private function validateScore(Request $request): array
    {
        return $request->validate([
            'tema'        => 'required|numeric|min:0|max:100',
            'kreativitas' => 'required|numeric|min:0|max:100',
            'estetik'     => 'required|numeric|min:0|max:100',
            'teknik'      => 'required|numeric|min:0|max:100',
            'catatan'     => 'nullable|string|max:1000',
        ]);
    }

    public function store(Request $request, int $design): RedirectResponse
{
    // Cek: apakah sudah ada juri lain yang menilai karya ini?
    $sudahDinilai = Score::where('design_id', $design)->exists();
    if ($sudahDinilai) {
        return back()->withErrors(['error' => 'Karya ini sudah dinilai oleh juri lain.']);
    }

    // Cek: apakah juri ini sudah pernah menilai karya ini?
    $sudahSendiri = Score::where('design_id', $design)
        ->where('juri_id', Auth::id())
        ->exists();
    if ($sudahSendiri) {
        return back()->withErrors(['error' => 'Kamu sudah menilai karya ini.']);
    }

    $data = $this->validateScore($request);
    Score::create(array_merge($data, [
        'design_id' => $design,
        'juri_id'   => (int) Auth::id(),
    ]));

    return back()->with('success', 'Penilaian berhasil disimpan!');
}
    public function update(Request $request, int $design): RedirectResponse
    {
        $data = $this->validateScore($request);

        Score::where('design_id', $design)
            ->where('juri_id', (int) Auth::id())
            ->update($data);

        return back()->with('success', 'Penilaian berhasil diupdate!');
    }
}