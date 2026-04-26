<?php

namespace App\Http\Controllers;

use App\Models\Attendance;
use Illuminate\Http\Request;

class AttendanceController extends Controller
{
    public function index()
    {
        return response()->json(Attendance::with(['team', 'player'])->get());
    }

    public function show($id)
    {
        $attendance = Attendance::with(['team', 'player'])->findOrFail($id);
        return response()->json($attendance);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'team_id' => 'required|exists:teams,id',
            'date' => 'required|date',
            'player_id' => 'required|exists:players,id',
            'status' => 'required|in:present,absent,excused'
        ]);

        $attendance = Attendance::create($validated);
        return response()->json($attendance->load(['team', 'player']), 201);
    }

    public function update(Request $request, $id)
    {
        $attendance = Attendance::findOrFail($id);
        
        $validated = $request->validate([
            'team_id' => 'exists:teams,id',
            'date' => 'date',
            'player_id' => 'exists:players,id',
            'status' => 'in:present,absent,excused'
        ]);

        $attendance->update($validated);
        return response()->json($attendance->load(['team', 'player']));
    }

    public function destroy($id)
    {
        $attendance = Attendance::findOrFail($id);
        $attendance->delete();
        return response()->json(['message' => 'Attendance record deleted successfully']);
    }

    public function byTeamAndDate($teamId, $date)
    {
        $attendance = Attendance::where('team_id', $teamId)
            ->where('date', $date)
            ->with(['team', 'player'])
            ->get();
        return response()->json($attendance);
    }

    public function byTeam($teamId)
    {
        $attendance = Attendance::where('team_id', $teamId)->with(['team', 'player'])->get();
        return response()->json($attendance);
    }
}