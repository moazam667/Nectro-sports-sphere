<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Schedule extends Model
{
    use HasFactory;

    protected $fillable = [
        'team_id',
        'opponent',
        'date',
        'time',
        'venue',
        'status',
        'score'
    ];

    protected $casts = [
        'score' => 'array',
        'date' => 'date',
        'time' => 'datetime:H:i'
    ];

    public function team()
    {
        return $this->belongsTo(Team::class);
    }
}