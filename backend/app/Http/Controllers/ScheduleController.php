<?php

namespace App\Http\Controllers;

use App\Models\Schedule;
use Illuminate\Http\Request;

class ScheduleController extends Controller
{
    public function index()
    {
        return response()->json(Schedule::with('team')->get());
    }

    public function show($id)
    {
        $schedule = Schedule::with('team')->findOrFail($id);
        return response()->json($schedule);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'team_id' => 'required|exists:teams,id',
            'opponent' => 'required|string|max:255',
            'date' => 'required|date',
            'time' => 'required|date_format:H:i',
            'venue' => 'required|string|max:255',
            'status' => 'in:upcoming,completed,cancelled',
            'score' => 'nullable|array'
        ]);

        $schedule = Schedule::create($validated);
        return response()->json($schedule->load('team'), 201);
    }

    public function update(Request $request, $id)
    {
        $schedule = Schedule::findOrFail($id);
        
        $validated = $request->validate([
            'team_id' => 'exists:teams,id',
            'opponent' => 'string|max:255',
            'date' => 'date',
            'time' => 'date_format:H:i',
            'venue' => 'string|max:255',
            'status' => 'in:upcoming,completed,cancelled',
            'score' => 'nullable|array'
        ]);

        $schedule->update($validated);
        return response()->json($schedule->load('team'));
    }

    public function destroy($id)
    {
        $schedule = Schedule::findOrFail($id);
        $schedule->delete();
        return response()->json(['message' => 'Schedule deleted successfully']);
    }

    public function byTeam($teamId)
    {
        $schedules = Schedule::where('team_id', $teamId)->with('team')->get();
        return response()->json($schedules);
    }

    public function upcoming()
    {
        $schedules = Schedule::where('status', 'upcoming')->with('team')->get();
        return response()->json($schedules);
    }

    public function completed()
    {
        $schedules = Schedule::where('status', 'completed')->with('team')->get();
        return response()->json($schedules);
    }
}