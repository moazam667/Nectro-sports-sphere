<?php

namespace App\Http\Controllers;

use App\Models\Player;
use Illuminate\Http\Request;

class PlayerController extends Controller
{
    public function index()
    {
        return response()->json(Player::with('team')->get());
    }

    public function show($id)
    {
        $player = Player::with(['team', 'attendance'])->findOrFail($id);
        return response()->json($player);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'team_id' => 'required|exists:teams,id',
            'position' => 'required|string|max:255',
            'number' => 'required|integer',
            'join_date' => 'required|date',
            'stats' => 'nullable|array'
        ]);

        $player = Player::create($validated);
        return response()->json($player->load('team'), 201);
    }

    public function update(Request $request, $id)
    {
        $player = Player::findOrFail($id);
        
        $validated = $request->validate([
            'name' => 'string|max:255',
            'team_id' => 'exists:teams,id',
            'position' => 'string|max:255',
            'number' => 'integer',
            'join_date' => 'date',
            'stats' => 'nullable|array'
        ]);

        $player->update($validated);
        return response()->json($player->load('team'));
    }

    public function destroy($id)
    {
        $player = Player::findOrFail($id);
        $player->delete();
        return response()->json(['message' => 'Player deleted successfully']);
    }

    public function byTeam($teamId)
    {
        $players = Player::where('team_id', $teamId)->with('team')->get();
        return response()->json($players);
    }
}