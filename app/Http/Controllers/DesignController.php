<?php

namespace App\Http\Controllers;

use App\Models\Design;
use App\Models\Event;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class DesignController extends Controller
{
    public function upload(Request $request): RedirectResponse
    {
        $request->validate([
            'judul'     => 'required|string|max:255',
            'file'      => 'required|image|mimes:jpg,jpeg,png|max:5120',
            'deskripsi' => 'nullable|string|max:1000',
        ]);

        // Ambil event aktif secara otomatis (karena hanya 1 event layang-layang)
        $event = Event::where('status', 'aktif')->first();

        if (!$event) {
            return back()->withErrors(['file' => 'Belum ada event aktif saat ini. Hubungi panitia.']);
        }

        $path = $request->file('file')->store('designs', 'public');

        Design::create([
            'user_id'   => (int) Auth::id(),
            'event_id'  => $event->id,
            'judul'     => $request->judul,
            'deskripsi' => $request->deskripsi,
            'file_path' => $path,
        ]);

        return back()->with('success', 'Desain berhasil diupload!');
    }

    public function destroy(Design $design): RedirectResponse
    {
        abort_if($design->user_id !== (int) Auth::id(), 403);
        Storage::disk('public')->delete($design->file_path);
        $design->delete();

        return back()->with('success', 'Desain berhasil dihapus.');
    }
}