<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Event extends Model
{
    protected $fillable = ['nama', 'deskripsi', 'tanggal_mulai', 'tanggal_selesai', 'status'];
    public function designs() { return $this->hasMany(Design::class); }
}
