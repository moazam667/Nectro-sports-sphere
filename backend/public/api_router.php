<?php

header('Access-Control-Allow-Origin: http://localhost:3000');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once __DIR__ . '/../vendor/autoload.php';

use Illuminate\Database\Capsule\Manager as Capsule;

$capsule = new Capsule;
$capsule->addConnection([
    'driver' => 'mysql',
    'host' => 'sql12.freesqldatabase.com',
    'database' => 'sql12824418',
    'username' => 'sql12824418',
    'password' => 'gd3kAuMgPQ',
    'charset' => 'utf8mb4',
    'collation' => 'utf8mb4_unicode_ci',
    'prefix' => '',
]);

$capsule->setAsGlobal();
$capsule->bootEloquent();

$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$uri = str_replace('/api', '', $uri);
$method = $_SERVER['REQUEST_METHOD'];

try {
    // Teams endpoints
    if ($uri === '/teams' && $method === 'GET') {
        $teams = Capsule::table('teams')->get();
        echo json_encode($teams);
    }
    elseif (preg_match('/^\/teams\/(\d+)$/', $uri, $matches) && $method === 'GET') {
        $team = Capsule::table('teams')->where('id', $matches[1])->first();
        echo json_encode($team);
    }
    // Players endpoints
    elseif ($uri === '/players' && $method === 'GET') {
        $players = Capsule::table('players')
            ->leftJoin('teams', 'players.team_id', '=', 'teams.id')
            ->select('players.*', 'teams.name as team_name', 'teams.sport as team_sport')
            ->get();
        
        $result = [];
        foreach ($players as $player) {
            $p = (array)$player;
            $p['team'] = [
                'name' => $player->team_name,
                'sport' => $player->team_sport
            ];
            unset($p['team_name'], $p['team_sport']);
            $result[] = $p;
        }
        echo json_encode($result);
    }
    elseif (preg_match('/^\/teams\/(\d+)\/players$/', $uri, $matches) && $method === 'GET') {
        $players = Capsule::table('players')->where('team_id', $matches[1])->get();
        echo json_encode($players);
    }
    // Schedules endpoints
    elseif ($uri === '/schedules' && $method === 'GET') {
        $schedules = Capsule::table('schedules')
            ->leftJoin('teams', 'schedules.team_id', '=', 'teams.id')
            ->select('schedules.*', 'teams.name as team_name')
            ->get();
        
        $result = [];
        foreach ($schedules as $schedule) {
            $s = (array)$schedule;
            $s['team'] = ['name' => $schedule->team_name];
            unset($s['team_name']);
            $result[] = $s;
        }
        echo json_encode($result);
    }
    elseif (preg_match('/^\/teams\/(\d+)\/schedules$/', $uri, $matches) && $method === 'GET') {
        $schedules = Capsule::table('schedules')->where('team_id', $matches[1])->get();
        echo json_encode($schedules);
    }
    elseif ($uri === '/schedules/status/upcoming' && $method === 'GET') {
        $schedules = Capsule::table('schedules')->where('status', 'upcoming')->get();
        echo json_encode($schedules);
    }
    elseif ($uri === '/schedules/status/completed' && $method === 'GET') {
        $schedules = Capsule::table('schedules')->where('status', 'completed')->get();
        echo json_encode($schedules);
    }
    // Attendance endpoints
    elseif ($uri === '/attendance' && $method === 'GET') {
        $attendance = Capsule::table('attendance')
            ->leftJoin('teams', 'attendance.team_id', '=', 'teams.id')
            ->leftJoin('players', 'attendance.player_id', '=', 'players.id')
            ->select('attendance.*', 'teams.name as team_name', 'players.name as player_name')
            ->get();
        
        $result = [];
        foreach ($attendance as $att) {
            $a = (array)$att;
            $a['team'] = ['name' => $att->team_name];
            $a['player'] = ['name' => $att->player_name];
            unset($a['team_name'], $a['player_name']);
            $result[] = $a;
        }
        echo json_encode($result);
    }
    elseif (preg_match('/^\/teams\/(\d+)\/attendance$/', $uri, $matches) && $method === 'GET') {
        $attendance = Capsule::table('attendance')->where('team_id', $matches[1])->get();
        echo json_encode($attendance);
    }
    // Equipment endpoints
    elseif ($uri === '/equipment' && $method === 'GET') {
        $equipment = Capsule::table('equipment')
            ->leftJoin('teams', 'equipment.team_id', '=', 'teams.id')
            ->select('equipment.*', 'teams.name as team_name')
            ->get();
        
        $result = [];
        foreach ($equipment as $eq) {
            $e = (array)$eq;
            $e['team'] = ['name' => $eq->team_name];
            unset($e['team_name']);
            $result[] = $e;
        }
        echo json_encode($result);
    }
    elseif (preg_match('/^\/teams\/(\d+)\/equipment$/', $uri, $matches) && $method === 'GET') {
        $equipment = Capsule::table('equipment')->where('team_id', $matches[1])->get();
        echo json_encode($equipment);
    }
    // Dashboard stats
    elseif ($uri === '/dashboard/stats' && $method === 'GET') {
        $stats = [
            'total_teams' => Capsule::table('teams')->count(),
            'total_players' => Capsule::table('players')->count(),
            'upcoming_matches' => Capsule::table('schedules')->where('status', 'upcoming')->count(),
            'completed_matches' => Capsule::table('schedules')->where('status', 'completed')->count(),
        ];
        echo json_encode($stats);
    }
    else {
        http_response_code(404);
        echo json_encode(['error' => 'Endpoint not found']);
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}
