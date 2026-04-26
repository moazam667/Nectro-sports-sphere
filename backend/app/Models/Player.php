<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Player extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'team_id',
        'position',
        'number',
        'join_date',
        'stats'
    ];

    protected $casts = [
        'stats' => 'array',
        'join_date' => 'date'
    ];

    public function team()
    {
        return $this->belongsTo(Team::class);
    }

    public function attendance()
    {
        return $this->hasMany(Attendance::class);
    }
}