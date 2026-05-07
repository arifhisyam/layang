<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Score extends Model
{
    protected $fillable = ['design_id', 'juri_id', 'tema', 'kreativitas', 'estetik', 'teknik', 'catatan'];
    public function design() { return $this->belongsTo(Design::class); }
    public function juri()   { return $this->belongsTo(User::class, 'juri_id'); }
    public function getRataRataAttribute(): float
{
    return round(($this->tema + $this->kreativitas + $this->estetik + $this->teknik) / 4, 2);
}
}
