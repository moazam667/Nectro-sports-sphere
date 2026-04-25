'use client';

import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import { Navigation } from '@/components/navigation';
import { Card } from '@/components/ui/card';
import { mockTeams, mockPlayers, mockSchedules } from '@/lib/mock-data';
import { BarChart3, TrendingUp, Award, Users } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function StatsPage() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const [selectedSport, setSelectedSport] = useState('all');

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  if (!user) return null;

  // Group teams by sport
  const teamsBySport = mockTeams.reduce(
    (acc, team) => {
      if (!acc[team.sport]) acc[team.sport] = [];
      acc[team.sport].push(team);
      return acc;
    },
    {} as Record<string, typeof mockTeams>
  );

  const sports = Object.keys(teamsBySport);
  const filteredTeams = selectedSport === 'all' 
    ? mockTeams 
    : teamsBySport[selectedSport] || [];

  // Calculate statistics
  const totalMatches = mockSchedules.length;
  const completedMatches = mockSchedules.filter((s) => s.status === 'completed').length;
  const upcomingMatches = mockSchedules.filter((s) => s.status === 'upcoming').length;

  // Get top performers
  const playerStats = mockPlayers.map((player) => {
    const team = mockTeams.find((t) => t.id === player.teamId);
    return {
      ...player,
      teamName: team?.name,
      totalStats: (player.stats?.runs || 0) + (player.stats?.goals || 0) + (player.stats?.points || 0),
    };
  }).sort((a, b) => b.totalStats - a.totalStats);

  // Team standings
  const standings = filteredTeams
    .sort((a, b) => {
      const aWinRate = b.wins / (b.wins + b.losses);
      const bWinRate = a.wins / (a.wins + a.losses);
      return aWinRate - bWinRate;
    })
    .slice(0, 10);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Live Statistics</h1>
          <p className="text-muted-foreground">Multi-sport performance analytics and standings</p>
        </div>

        {/* Overall Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Total Matches</p>
                <p className="text-3xl font-bold text-foreground">{totalMatches}</p>
              </div>
              <BarChart3 className="w-5 h-5 text-primary" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Completed</p>
                <p className="text-3xl font-bold text-green-600">{completedMatches}</p>
              </div>
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Upcoming</p>
                <p className="text-3xl font-bold text-blue-600">{upcomingMatches}</p>
              </div>
              <Award className="w-5 h-5 text-blue-600" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Total Players</p>
                <p className="text-3xl font-bold text-primary">{mockPlayers.length}</p>
              </div>
              <Users className="w-5 h-5 text-primary" />
            </div>
          </Card>
        </div>

        {/* Sport Filter */}
        <div className="mb-8">
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setSelectedSport('all')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                selectedSport === 'all'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted hover:bg-muted/80 text-foreground'
              }`}
            >
              All Sports
            </button>
            {sports.map((sport) => (
              <button
                key={sport}
                onClick={() => setSelectedSport(sport)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  selectedSport === sport
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted hover:bg-muted/80 text-foreground'
                }`}
              >
                {sport}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Team Standings */}
          <Card className="p-6">
            <h2 className="text-2xl font-bold text-foreground mb-6">Team Standings</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="px-3 py-2 text-left text-sm font-semibold text-muted-foreground">Rank</th>
                    <th className="px-3 py-2 text-left text-sm font-semibold text-muted-foreground">Team</th>
                    <th className="px-3 py-2 text-center text-sm font-semibold text-muted-foreground">W</th>
                    <th className="px-3 py-2 text-center text-sm font-semibold text-muted-foreground">L</th>
                    <th className="px-3 py-2 text-right text-sm font-semibold text-muted-foreground">Rate</th>
                  </tr>
                </thead>
                <tbody>
                  {standings.map((team, index) => {
                    const winRate = ((team.wins / (team.wins + team.losses)) * 100).toFixed(1);
                    return (
                      <tr key={team.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                        <td className="px-3 py-3 font-bold text-foreground">{index + 1}</td>
                        <td className="px-3 py-3 text-foreground font-medium">{team.name}</td>
                        <td className="px-3 py-3 text-center text-green-600 font-semibold">{team.wins}</td>
                        <td className="px-3 py-3 text-center text-red-600 font-semibold">{team.losses}</td>
                        <td className="px-3 py-3 text-right">
                          <span className="inline-flex items-center justify-center w-10 h-10 bg-primary/10 rounded font-semibold text-primary text-sm">
                            {winRate}%
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>

          {/* Top Performers */}
          <Card className="p-6">
            <h2 className="text-2xl font-bold text-foreground mb-6">Top Performers</h2>
            <div className="space-y-3">
              {playerStats.slice(0, 8).map((player, index) => (
                <div key={player.id} className="flex items-center justify-between p-3 bg-muted/50 rounded hover:bg-muted transition-colors">
                  <div className="flex items-center gap-3 flex-1">
                    <span className="inline-flex items-center justify-center w-6 h-6 bg-primary/10 rounded-full text-xs font-bold text-primary">
                      {index + 1}
                    </span>
                    <div>
                      <p className="font-semibold text-foreground text-sm">{player.name}</p>
                      <p className="text-xs text-muted-foreground">{player.teamName}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-foreground">{player.totalStats}</p>
                    <p className="text-xs text-muted-foreground">points</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Detailed Stats by Team */}
        <Card className="p-6 mt-8">
          <h2 className="text-2xl font-bold text-foreground mb-6">
            {selectedSport === 'all' ? 'All Teams' : `${selectedSport} Teams`} Performance
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTeams.map((team) => {
              const winRate = ((team.wins / (team.wins + team.losses)) * 100).toFixed(1);
              return (
                <div key={team.id} className="p-4 border border-border rounded-lg hover:shadow-lg transition-shadow">
                  <h3 className="font-bold text-foreground mb-3">{team.name}</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Coach:</span>
                      <span className="font-medium text-foreground">{team.coach}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Players:</span>
                      <span className="font-medium text-foreground">{team.players}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Record:</span>
                      <span className="font-medium text-foreground">{team.wins}W - {team.losses}L</span>
                    </div>
                    <div className="pt-2 mt-2 border-t border-border">
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Win Rate:</span>
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-primary transition-all"
                              style={{ width: `${winRate}%` }}
                            />
                          </div>
                          <span className="font-bold text-primary text-sm">{winRate}%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </main>
    </div>
  );
}
