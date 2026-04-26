<?php

namespace App\Http\Controllers;

use App\Models\Team;
use Illuminate\Http\Request;

class TeamController extends Controller
{
    public function index()
    {
        return response()->json(Team::all());
    }

    public function show($id)
    {
        $team = Team::with(['players', 'schedules', 'equipment'])->findOrFail($id);
        return response()->json($team);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'sport' => 'required|string|max:255',
            'city' => 'required|string|max:255',
            'coach' => 'required|string|max:255',
            'players' => 'integer|min:0',
            'wins' => 'integer|min:0',
            'losses' => 'integer|min:0',
            'logo' => 'nullable|string'
        ]);

        $team = Team::create($validated);
        return response()->json($team, 201);
    }

    public function update(Request $request, $id)
    {
        $team = Team::findOrFail($id);
        
        $validated = $request->validate([
            'name' => 'string|max:255',
            'sport' => 'string|max:255',
            'city' => 'string|max:255',
            'coach' => 'string|max:255',
            'players' => 'integer|min:0',
            'wins' => 'integer|min:0',
            'losses' => 'integer|min:0',
            'logo' => 'nullable|string'
        ]);

        $team->update($validated);
        return response()->json($team);
    }

    public function destroy($id)
    {
        $team = Team::findOrFail($id);
        $team->delete();
        return response()->json(['message' => 'Team deleted successfully']);
    }
}