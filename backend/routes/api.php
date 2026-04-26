<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\TeamController;
use App\Http\Controllers\PlayerController;
use App\Http\Controllers\ScheduleController;
use App\Http\Controllers\AttendanceController;
use App\Http\Controllers\EquipmentController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

// Teams routes
Route::apiResource('teams', TeamController::class);

// Players routes
Route::apiResource('players', PlayerController::class);
Route::get('teams/{teamId}/players', [PlayerController::class, 'byTeam']);

// Schedules routes
Route::apiResource('schedules', ScheduleController::class);
Route::get('teams/{teamId}/schedules', [ScheduleController::class, 'byTeam']);
Route::get('schedules/status/upcoming', [ScheduleController::class, 'upcoming']);
Route::get('schedules/status/completed', [ScheduleController::class, 'completed']);

// Attendance routes
Route::apiResource('attendance', AttendanceController::class);
Route::get('teams/{teamId}/attendance', [AttendanceController::class, 'byTeam']);
Route::get('teams/{teamId}/attendance/{date}', [AttendanceController::class, 'byTeamAndDate']);

// Equipment routes
Route::apiResource('equipment', EquipmentController::class);
Route::get('teams/{teamId}/equipment', [EquipmentController::class, 'byTeam']);

// Dashboard stats
Route::get('dashboard/stats', function () {
    return response()->json([
        'total_teams' => \App\Models\Team::count(),
        'total_players' => \App\Models\Player::count(),
        'upcoming_matches' => \App\Models\Schedule::where('status', 'upcoming')->count(),
        'completed_matches' => \App\Models\Schedule::where('status', 'completed')->count(),
    ]);
});