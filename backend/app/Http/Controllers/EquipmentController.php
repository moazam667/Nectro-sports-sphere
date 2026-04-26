<?php

namespace App\Http\Controllers;

use App\Models\Equipment;
use Illuminate\Http\Request;

class EquipmentController extends Controller
{
    public function index()
    {
        return response()->json(Equipment::with('team')->get());
    }

    public function show($id)
    {
        $equipment = Equipment::with('team')->findOrFail($id);
        return response()->json($equipment);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'team_id' => 'required|exists:teams,id',
            'name' => 'required|string|max:255',
            'category' => 'required|string|max:255',
            'quantity' => 'required|integer|min:0',
            'condition' => 'required|in:excellent,good,fair,poor',
            'last_maintenance' => 'nullable|date'
        ]);

        $equipment = Equipment::create($validated);
        return response()->json($equipment->load('team'), 201);
    }

    public function update(Request $request, $id)
    {
        $equipment = Equipment::findOrFail($id);
        
        $validated = $request->validate([
            'team_id' => 'exists:teams,id',
            'name' => 'string|max:255',
            'category' => 'string|max:255',
            'quantity' => 'integer|min:0',
            'condition' => 'in:excellent,good,fair,poor',
            'last_maintenance' => 'nullable|date'
        ]);

        $equipment->update($validated);
        return response()->json($equipment->load('team'));
    }

    public function destroy($id)
    {
        $equipment = Equipment::findOrFail($id);
        $equipment->delete();
        return response()->json(['message' => 'Equipment deleted successfully']);
    }

    public function byTeam($teamId)
    {
        $equipment = Equipment::where('team_id', $teamId)->with('team')->get();
        return response()->json($equipment);
    }
}