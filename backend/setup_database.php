<?php

require_once 'vendor/autoload.php';

use Illuminate\Database\Capsule\Manager as Capsule;

// Database configuration
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

$pdo = $capsule->getConnection()->getPdo();

echo "Connected to database successfully!\n";

// Drop existing tables
$tables = ['attendance', 'equipment', 'schedules', 'players', 'teams'];
foreach ($tables as $table) {
    try {
        $pdo->exec("DROP TABLE IF EXISTS $table");
        echo "Dropped table: $table\n";
    } catch (Exception $e) {
        echo "Error dropping $table: " . $e->getMessage() . "\n";
    }
}

// Create teams table
$pdo->exec("
CREATE TABLE teams (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    sport VARCHAR(255) NOT NULL,
    city VARCHAR(255) NOT NULL,
    coach VARCHAR(255) NOT NULL,
    players INT DEFAULT 0,
    wins INT DEFAULT 0,
    losses INT DEFAULT 0,
    logo VARCHAR(255) NULL,
    created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NULL
)");
echo "Created teams table\n";

// Create players table
$pdo->exec("
CREATE TABLE players (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    team_id BIGINT UNSIGNED NOT NULL,
    position VARCHAR(255) NOT NULL,
    number INT NOT NULL,
    join_date DATE NOT NULL,
    stats TEXT NULL,
    created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NULL,
    FOREIGN KEY (team_id) REFERENCES teams(id) ON DELETE CASCADE
)");
echo "Created players table\n";

// Create schedules table
$pdo->exec("
CREATE TABLE schedules (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    team_id BIGINT UNSIGNED NOT NULL,
    opponent VARCHAR(255) NOT NULL,
    date DATE NOT NULL,
    time TIME NOT NULL,
    venue VARCHAR(255) NOT NULL,
    status ENUM('upcoming', 'completed', 'cancelled') DEFAULT 'upcoming',
    score TEXT NULL,
    created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NULL,
    FOREIGN KEY (team_id) REFERENCES teams(id) ON DELETE CASCADE
)");
echo "Created schedules table\n";

// Create attendance table
$pdo->exec("
CREATE TABLE attendance (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    team_id BIGINT UNSIGNED NOT NULL,
    date DATE NOT NULL,
    player_id BIGINT UNSIGNED NOT NULL,
    status ENUM('present', 'absent', 'excused') DEFAULT 'present',
    created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NULL,
    FOREIGN KEY (team_id) REFERENCES teams(id) ON DELETE CASCADE,
    FOREIGN KEY (player_id) REFERENCES players(id) ON DELETE CASCADE
)");
echo "Created attendance table\n";

// Create equipment table
$pdo->exec("
CREATE TABLE equipment (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    team_id BIGINT UNSIGNED NOT NULL,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(255) NOT NULL,
    quantity INT NOT NULL,
    `condition` ENUM('excellent', 'good', 'fair', 'poor') DEFAULT 'good',
    last_maintenance DATE NULL,
    created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NULL,
    FOREIGN KEY (team_id) REFERENCES teams(id) ON DELETE CASCADE
)");
echo "Created equipment table\n";

// Insert teams data (adding a third team for each sport)
$teams = [
    [1, 'Thunder Hawks', 'Cricket', 'Mumbai', 'Rajesh Kumar', 15, 12, 3],
    [2, 'Elite Warriors', 'Football', 'Delhi', 'Amit Singh', 20, 10, 5],
    [3, 'Phoenix Strikers', 'Basketball', 'Bangalore', 'Priya Sharma', 12, 8, 7],
    [4, 'Desert Riders', 'Cricket', 'Jaipur', 'Vikram Patel', 14, 9, 6],
    [5, 'Ocean Dragons', 'Football', 'Chennai', 'Suresh Nair', 18, 11, 4],
    [6, 'Mountain Eagles', 'Basketball', 'Pune', 'Deepa Gupta', 13, 7, 8],
    [7, 'Royal Tigers', 'Cricket', 'Kolkata', 'Arjun Das', 16, 14, 2],
    [8, 'Storm Wolves', 'Football', 'Hyderabad', 'Kiran Reddy', 19, 13, 3],
    [9, 'Lightning Bolts', 'Basketball', 'Ahmedabad', 'Ravi Modi', 14, 10, 5]
];

$stmt = $pdo->prepare("INSERT INTO teams (id, name, sport, city, coach, players, wins, losses) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
foreach ($teams as $team) {
    $stmt->execute($team);
}
echo "Inserted teams data\n";

// Insert players data
$players = [
    [1, 'Virat Kohli', 1, 'Batsman', 18, '2022-01-15', '{"gamesPlayed": 25, "runs": 1200}'],
    [2, 'Jasprit Bumrah', 1, 'Bowler', 93, '2021-06-20', '{"gamesPlayed": 22, "wickets": 45}'],
    [3, 'Lionel Messi', 2, 'Forward', 10, '2023-01-01', '{"gamesPlayed": 18, "goals": 24}'],
    [4, 'LeBron James', 3, 'Forward', 23, '2022-06-15', '{"gamesPlayed": 30, "points": 780}'],
    [5, 'Rohit Sharma', 4, 'Batsman', 45, '2022-03-10', '{"gamesPlayed": 20, "runs": 950}'],
    [6, 'Cristiano Ronaldo', 5, 'Forward', 7, '2023-02-01', '{"gamesPlayed": 25, "goals": 32}'],
    [7, 'Stephen Curry', 6, 'Guard', 30, '2022-09-01', '{"gamesPlayed": 28, "points": 920}'],
    [8, 'MS Dhoni', 7, 'Wicket Keeper', 7, '2021-08-15', '{"gamesPlayed": 30, "runs": 850}'],
    [9, 'Neymar Jr', 8, 'Midfielder', 11, '2022-12-01', '{"gamesPlayed": 22, "goals": 18}'],
    [10, 'Kevin Durant', 9, 'Forward', 35, '2023-03-10', '{"gamesPlayed": 26, "points": 680}']
];

$stmt = $pdo->prepare("INSERT INTO players (id, name, team_id, position, number, join_date, stats) VALUES (?, ?, ?, ?, ?, ?, ?)");
foreach ($players as $player) {
    $stmt->execute($player);
}
echo "Inserted players data\n";

// Insert schedules data
$schedules = [
    [1, 1, 'Desert Riders', '2024-03-15', '19:30:00', 'Arun Jaitley Stadium', 'upcoming', null],
    [2, 1, 'Royal Tigers', '2024-03-08', '15:00:00', 'Feroz Shah Kotla', 'completed', '{"team": 185, "opponent": 162}'],
    [3, 2, 'Ocean Dragons', '2024-03-20', '18:00:00', 'Delhi Stadium', 'upcoming', null],
    [4, 3, 'Mountain Eagles', '2024-03-12', '17:30:00', 'Bangalore Sports Arena', 'completed', '{"team": 95, "opponent": 88}'],
    [5, 7, 'Thunder Hawks', '2024-03-25', '16:00:00', 'Eden Gardens', 'upcoming', null],
    [6, 8, 'Elite Warriors', '2024-03-18', '19:00:00', 'Gachibowli Stadium', 'upcoming', null],
    [7, 9, 'Phoenix Strikers', '2024-03-22', '18:30:00', 'Sardar Patel Stadium', 'upcoming', null]
];

$stmt = $pdo->prepare("INSERT INTO schedules (id, team_id, opponent, date, time, venue, status, score) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
foreach ($schedules as $schedule) {
    $stmt->execute($schedule);
}
echo "Inserted schedules data\n";

// Insert attendance data
$attendance = [
    [1, 1, '2024-03-08', 1, 'present'],
    [2, 1, '2024-03-08', 2, 'present'],
    [3, 2, '2024-03-10', 3, 'absent'],
    [4, 3, '2024-03-12', 4, 'present'],
    [5, 7, '2024-03-15', 8, 'present'],
    [6, 8, '2024-03-16', 9, 'excused'],
    [7, 9, '2024-03-17', 10, 'present']
];

$stmt = $pdo->prepare("INSERT INTO attendance (id, team_id, date, player_id, status) VALUES (?, ?, ?, ?, ?)");
foreach ($attendance as $att) {
    $stmt->execute($att);
}
echo "Inserted attendance data\n";

// Insert equipment data
$equipment = [
    [1, 1, 'Cricket Bats', 'Equipment', 20, 'excellent', '2024-02-15'],
    [2, 1, 'Cricket Balls', 'Consumables', 50, 'good', null],
    [3, 2, 'Soccer Balls', 'Equipment', 15, 'excellent', '2024-02-28'],
    [4, 3, 'Basketball Hoops', 'Equipment', 4, 'good', null],
    [5, 3, 'Training Cones', 'Accessories', 100, 'fair', null],
    [6, 7, 'Cricket Pads', 'Equipment', 25, 'good', '2024-01-20'],
    [7, 8, 'Football Boots', 'Equipment', 30, 'excellent', '2024-03-01'],
    [8, 9, 'Basketball Jerseys', 'Apparel', 20, 'excellent', null]
];

$stmt = $pdo->prepare("INSERT INTO equipment (id, team_id, name, category, quantity, `condition`, last_maintenance) VALUES (?, ?, ?, ?, ?, ?, ?)");
foreach ($equipment as $eq) {
    $stmt->execute($eq);
}
echo "Inserted equipment data\n";

echo "\nDatabase setup completed successfully!\n";
echo "Total teams: " . count($teams) . "\n";
echo "Total players: " . count($players) . "\n";
echo "Total schedules: " . count($schedules) . "\n";
echo "Total attendance records: " . count($attendance) . "\n";
echo "Total equipment items: " . count($equipment) . "\n";