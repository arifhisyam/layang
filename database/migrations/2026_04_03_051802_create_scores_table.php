<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('scores', function (Blueprint $table) {
            $table->id();
            $table->foreignId('design_id')->constrained()->onDelete('cascade');
            $table->foreignId('juri_id')->constrained('users')->onDelete('cascade');
            $table->decimal('tema', 4, 1);        // 0-100
            $table->decimal('kreativitas', 4, 1); // 0-100
            $table->decimal('estetik', 4, 1);     // 0-100
            $table->decimal('teknik', 4, 1);      // 0-100
            $table->decimal('rata_rata', 5, 2)->storedAs('(tema + kreativitas + estetik + teknik) / 4');
            $table->text('catatan')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('scores');
    }
};
