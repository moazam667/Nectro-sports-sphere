<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Equipment extends Model
{
    use HasFactory;

    protected $fillable = [
        'team_id',
        'name',
        'category',
        'quantity',
        'condition',
        'last_maintenance'
    ];

    protected $casts = [
        'last_maintenance' => 'date'
    ];

    public function team()
    {
        return $this->belongsTo(Team::class);
    }
}