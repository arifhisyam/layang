<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Design extends Model
{
    protected $fillable = ['user_id', 'event_id', 'judul', 'deskripsi', 'file_path'];
    public function user()   { return $this->belongsTo(User::class); }
    public function event()  { return $this->belongsTo(Event::class); }
    public function scores() { return $this->hasMany(Score::class); }
    public function getRataRataAttribute() {
    return $this->scores->avg('rata_rata');
}
}
