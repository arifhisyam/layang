<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            // pending  = menunggu persetujuan admin
            // approved = disetujui, bisa login & upload
            // rejected = ditolak admin
            $table->enum('status', ['pending', 'approved', 'rejected'])
                  ->default('pending')
                  ->after('role');
        });

        // Admin & juri yang sudah ada langsung approved
        DB::table('users')
            ->whereIn('role', ['admin', 'juri'])
            ->update(['status' => 'approved']);
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn('status');
        });
    }
};