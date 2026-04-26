# Necto Sports Sphere

A comprehensive sports management system with Next.js frontend and Laravel backend.

## Project Structure

```
.
├── app/                    # Next.js frontend pages
├── components/             # React components
├── lib/                    # Utilities and API client
├── backend/                # Laravel backend API
│   ├── app/
│   │   ├── Models/        # Eloquent models
│   │   └── Http/Controllers/  # API controllers
│   ├── database/
│   │   └── migrations/    # Database migrations
│   └── routes/
│       └── api.php        # API routes
└── README.md
```

## Features

- **Teams Management**: Manage 9 teams across 3 sports (Cricket, Football, Basketball) - 3 teams per sport
- **Players Management**: Track player information, positions, and stats
- **Schedules**: Manage upcoming and completed matches
- **Attendance**: Track player attendance for practices and games
- **Equipment Inventory**: Monitor equipment condition and maintenance
- **Dashboard**: Overview of all statistics and recent activities

## Tech Stack

### Frontend
- Next.js 14 (App Router)
- React 18
- TypeScript
- Tailwind CSS
- Shadcn/ui components

### Backend
- Laravel 13
- MySQL database
- RESTful API architecture

## Database

The system uses MySQL with the following tables:
- `teams` - Team information (9 teams: 3 per sport)
- `players` - Player details and stats
- `schedules` - Match schedules and results
- `attendance` - Player attendance records
- `equipment` - Equipment inventory

## Setup Instructions

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. The database is already configured with remote MySQL credentials in `.env`

3. Database tables and seed data are already created. To reset/recreate:
```bash
php setup_database.php
```

4. Start the Laravel development server:
```bash
php -S 0.0.0.0:8000 -t public
```

The API will be available at `http://localhost:8000/api`

### Frontend Setup

1. Install dependencies (from project root):
```bash
npm install
```

2. Create `.env.local` file (already created):
```
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

3. Start the Next.js development server:
```bash
npm run dev
```

The frontend will be available at `http://localhost:3000`

## API Endpoints

### Teams
- `GET /api/teams` - Get all teams
- `GET /api/teams/{id}` - Get team by ID
- `POST /api/teams` - Create new team
- `PUT /api/teams/{id}` - Update team
- `DELETE /api/teams/{id}` - Delete team

### Players
- `GET /api/players` - Get all players
- `GET /api/players/{id}` - Get player by ID
- `GET /api/teams/{teamId}/players` - Get players by team
- `POST /api/players` - Create new player
- `PUT /api/players/{id}` - Update player
- `DELETE /api/players/{id}` - Delete player

### Schedules
- `GET /api/schedules` - Get all schedules
- `GET /api/schedules/{id}` - Get schedule by ID
- `GET /api/teams/{teamId}/schedules` - Get schedules by team
- `GET /api/schedules/status/upcoming` - Get upcoming matches
- `GET /api/schedules/status/completed` - Get completed matches
- `POST /api/schedules` - Create new schedule
- `PUT /api/schedules/{id}` - Update schedule
- `DELETE /api/schedules/{id}` - Delete schedule

### Attendance
- `GET /api/attendance` - Get all attendance records
- `GET /api/attendance/{id}` - Get attendance by ID
- `GET /api/teams/{teamId}/attendance` - Get attendance by team
- `GET /api/teams/{teamId}/attendance/{date}` - Get attendance by team and date
- `POST /api/attendance` - Create attendance record
- `PUT /api/attendance/{id}` - Update attendance
- `DELETE /api/attendance/{id}` - Delete attendance

### Equipment
- `GET /api/equipment` - Get all equipment
- `GET /api/equipment/{id}` - Get equipment by ID
- `GET /api/teams/{teamId}/equipment` - Get equipment by team
- `POST /api/equipment` - Create equipment
- `PUT /api/equipment/{id}` - Update equipment
- `DELETE /api/equipment/{id}` - Delete equipment

### Dashboard
- `GET /api/dashboard/stats` - Get dashboard statistics

## Default Login Credentials

- **Admin**: admin@sports.com / admin123
- **Coach**: coach@sports.com / coach123
- **Viewer**: viewer@sports.com / viewer123

## Teams Data

The system includes 9 teams (3 per sport):

### Cricket
1. Thunder Hawks (Mumbai)
2. Desert Riders (Jaipur)
3. Royal Tigers (Kolkata)

### Football
1. Elite Warriors (Delhi)
2. Ocean Dragons (Chennai)
3. Storm Wolves (Hyderabad)

### Basketball
1. Phoenix Strikers (Bangalore)
2. Mountain Eagles (Pune)
3. Lightning Bolts (Ahmedabad)

## Development

To run both servers simultaneously:

1. Terminal 1 - Backend:
```bash
cd backend && php -S 0.0.0.0:8000 -t public
```

2. Terminal 2 - Frontend:
```bash
npm run dev
```

## Notes

- The backend uses a remote MySQL database (sql12.freesqldatabase.com)
- CORS is configured to allow requests from `http://localhost:3000`
- All API responses are in JSON format
- The frontend uses client-side rendering with React hooks for data fetching
