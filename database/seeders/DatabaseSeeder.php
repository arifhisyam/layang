<?php

namespace Database\Seeders;

use App\Models\Event;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // firstOrCreate — jika email sudah ada, tidak akan membuat duplikat
        User::firstOrCreate(
            ['email' => 'admin@layang.com'],
            [
                'name'     => 'Admin Utama',
                'password' => Hash::make('admin123'),
                'role'     => 'admin',
                'status'   => 'approved',
            ]
        );

        // Event lomba — hanya buat jika belum ada
        Event::firstOrCreate(
            ['nama' => 'Kompetisi Desain Layang-Layang 2025'],
            [
                'deskripsi'       => 'Kompetisi desain layang-layang tingkat nasional tahun 2025.',
                'tanggal_mulai'   => '2025-01-01',
                'tanggal_selesai' => '2025-12-31',
                'status'          => 'aktif',
            ]
        );
    }
}