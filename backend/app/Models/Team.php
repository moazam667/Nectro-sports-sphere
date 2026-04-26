<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Team extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'sport',
        'city',
        'coach',
        'players',
        'wins',
        'losses',
        'logo'
    ];

    public function players()
    {
        return $this->hasMany(Player::class);
    }

    public function schedules()
    {
        return $this->hasMany(Schedule::class);
    }

    public function attendance()
    {
        return $this->hasMany(Attendance::class);
    }

    public function equipment()
    {
        return $this->hasMany(Equipment::class);
    }
}