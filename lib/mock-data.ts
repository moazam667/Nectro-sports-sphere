export interface Team {
  id: string;
  name: string;
  sport: string;
  city: string;
  coach: string;
  players: number;
  wins: number;
  losses: number;
  logo?: string;
}

export interface Player {
  id: string;
  name: string;
  teamId: string;
  position: string;
  number: number;
  joinDate: string;
  stats?: {
    gamesPlayed: number;
    goals?: number;
    runs?: number;
    points?: number;
  };
}

export interface Schedule {
  id: string;
  teamId: string;
  opponent: string;
  date: string;
  time: string;
  venue: string;
  status: 'upcoming' | 'completed' | 'cancelled';
  score?: { team: number; opponent: number };
}

export interface Attendance {
  id: string;
  teamId: string;
  date: string;
  playerId: string;
  status: 'present' | 'absent' | 'excused';
}

export interface Equipment {
  id: string;
  teamId: string;
  name: string;
  category: string;
  quantity: number;
  condition: 'excellent' | 'good' | 'fair' | 'poor';
  lastMaintenance?: string;
}

// Mock Teams Data
export const mockTeams: Team[] = [
  {
    id: 'team-1',
    name: 'Thunder Hawks',
    sport: 'Cricket',
    city: 'Mumbai',
    coach: 'Rajesh Kumar',
    players: 15,
    wins: 12,
    losses: 3,
  },
  {
    id: 'team-2',
    name: 'Elite Warriors',
    sport: 'Football',
    city: 'Delhi',
    coach: 'Amit Singh',
    players: 20,
    wins: 10,
    losses: 5,
  },
  {
    id: 'team-3',
    name: 'Phoenix Strikers',
    sport: 'Basketball',
    city: 'Bangalore',
    coach: 'Priya Sharma',
    players: 12,
    wins: 8,
    losses: 7,
  },
  {
    id: 'team-4',
    name: 'Desert Riders',
    sport: 'Cricket',
    city: 'Jaipur',
    coach: 'Vikram Patel',
    players: 14,
    wins: 9,
    losses: 6,
  },
  {
    id: 'team-5',
    name: 'Ocean Dragons',
    sport: 'Football',
    city: 'Chennai',
    coach: 'Suresh Nair',
    players: 18,
    wins: 11,
    losses: 4,
  },
  {
    id: 'team-6',
    name: 'Mountain Eagles',
    sport: 'Basketball',
    city: 'Pune',
    coach: 'Deepa Gupta',
    players: 13,
    wins: 7,
    losses: 8,
  },
];

// Mock Players Data
export const mockPlayers: Player[] = [
  {
    id: 'player-1',
    name: 'Virat Kohli',
    teamId: 'team-1',
    position: 'Batsman',
    number: 18,
    joinDate: '2022-01-15',
    stats: { gamesPlayed: 25, runs: 1200 },
  },
  {
    id: 'player-2',
    name: 'Jasprit Bumrah',
    teamId: 'team-1',
    position: 'Bowler',
    number: 93,
    joinDate: '2021-06-20',
    stats: { gamesPlayed: 22, goals: 45 },
  },
  {
    id: 'player-3',
    name: 'Lionel Messi',
    teamId: 'team-2',
    position: 'Forward',
    number: 10,
    joinDate: '2023-01-01',
    stats: { gamesPlayed: 18, goals: 24 },
  },
  {
    id: 'player-4',
    name: 'LeBron James',
    teamId: 'team-3',
    position: 'Forward',
    number: 23,
    joinDate: '2022-06-15',
    stats: { gamesPlayed: 30, points: 780 },
  },
  {
    id: 'player-5',
    name: 'Rohit Sharma',
    teamId: 'team-4',
    position: 'Batsman',
    number: 45,
    joinDate: '2022-03-10',
    stats: { gamesPlayed: 20, runs: 950 },
  },
  {
    id: 'player-6',
    name: 'Cristiano Ronaldo',
    teamId: 'team-5',
    position: 'Forward',
    number: 7,
    joinDate: '2023-02-01',
    stats: { gamesPlayed: 25, goals: 32 },
  },
  {
    id: 'player-7',
    name: 'Stephen Curry',
    teamId: 'team-6',
    position: 'Guard',
    number: 30,
    joinDate: '2022-09-01',
    stats: { gamesPlayed: 28, points: 920 },
  },
];

// Mock Schedule Data
export const mockSchedules: Schedule[] = [
  {
    id: 'sch-1',
    teamId: 'team-1',
    opponent: 'Desert Riders',
    date: '2024-03-15',
    time: '19:30',
    venue: 'Arun Jaitley Stadium',
    status: 'upcoming',
  },
  {
    id: 'sch-2',
    teamId: 'team-1',
    opponent: 'Elite Warriors',
    date: '2024-03-08',
    time: '15:00',
    venue: 'Feroz Shah Kotla',
    status: 'completed',
    score: { team: 185, opponent: 162 },
  },
  {
    id: 'sch-3',
    teamId: 'team-2',
    opponent: 'Ocean Dragons',
    date: '2024-03-20',
    time: '18:00',
    venue: 'Delhi Stadium',
    status: 'upcoming',
  },
  {
    id: 'sch-4',
    teamId: 'team-3',
    opponent: 'Mountain Eagles',
    date: '2024-03-12',
    time: '17:30',
    venue: 'Bangalore Sports Arena',
    status: 'completed',
    score: { team: 95, opponent: 88 },
  },
];

// Mock Attendance Data
export const mockAttendance: Attendance[] = [
  {
    id: 'att-1',
    teamId: 'team-1',
    date: '2024-03-08',
    playerId: 'player-1',
    status: 'present',
  },
  {
    id: 'att-2',
    teamId: 'team-1',
    date: '2024-03-08',
    playerId: 'player-2',
    status: 'present',
  },
  {
    id: 'att-3',
    teamId: 'team-2',
    date: '2024-03-10',
    playerId: 'player-3',
    status: 'absent',
  },
  {
    id: 'att-4',
    teamId: 'team-3',
    date: '2024-03-12',
    playerId: 'player-4',
    status: 'present',
  },
];

// Mock Equipment Data
export const mockEquipment: Equipment[] = [
  {
    id: 'eq-1',
    teamId: 'team-1',
    name: 'Cricket Bats',
    category: 'Equipment',
    quantity: 20,
    condition: 'excellent',
    lastMaintenance: '2024-02-15',
  },
  {
    id: 'eq-2',
    teamId: 'team-1',
    name: 'Cricket Balls',
    category: 'Consumables',
    quantity: 50,
    condition: 'good',
  },
  {
    id: 'eq-3',
    teamId: 'team-2',
    name: 'Soccer Balls',
    category: 'Equipment',
    quantity: 15,
    condition: 'excellent',
    lastMaintenance: '2024-02-28',
  },
  {
    id: 'eq-4',
    teamId: 'team-3',
    name: 'Basketball Hoops',
    category: 'Equipment',
    quantity: 4,
    condition: 'good',
  },
  {
    id: 'eq-5',
    teamId: 'team-3',
    name: 'Training Cones',
    category: 'Accessories',
    quantity: 100,
    condition: 'fair',
  },
];
