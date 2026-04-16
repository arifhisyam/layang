<?php

namespace Database\Seeders;

use App\Models\Event;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
    

    Event::create([
      'nama'            => 'Kompetisi Desain Layang-Layang 2025',
      'deskripsi'       => 'Kompetisi desain layang-layang tingkat nasional',
      'tanggal_mulai'   => '2026-01-01',
      'tanggal_selesai' => '2026-12-31',
      'status'          => 'aktif',
  ]);
    }
}
