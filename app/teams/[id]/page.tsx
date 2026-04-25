'use client';

import { useAuth } from '@/lib/auth-context';
import { useRouter, useParams } from 'next/navigation';
import { Navigation } from '@/components/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { mockTeams, mockPlayers, mockSchedules } from '@/lib/mock-data';
import { ArrowLeft, Trophy, Users, MapPin, Calendar, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import { useEffect } from 'react';

export default function TeamDetailPage() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const params = useParams();
  const teamId = params.id as string;

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  if (!user) return null;

  const team = mockTeams.find((t) => t.id === teamId);
  if (!team) return null;

  const teamPlayers = mockPlayers.filter((p) => p.teamId === teamId);
  const teamSchedules = mockSchedules.filter((s) => s.teamId === teamId);
  const upcomingMatches = teamSchedules.filter((s) => s.status === 'upcoming');
  const completedMatches = teamSchedules.filter((s) => s.status === 'completed');

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Link href="/teams" className="inline-flex items-center gap-2 text-primary hover:text-primary/80 mb-6">
          <ArrowLeft className="w-4 h-4" />
          Back to Teams
        </Link>

        {/* Team Header */}
        <Card className="p-8 mb-8">
          <div className="flex items-start justify-between gap-8">
            <div className="flex-1">
              <h1 className="text-4xl font-bold text-foreground mb-2">{team.name}</h1>
              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Trophy className="w-4 h-4" />
                  {team.sport}
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  {team.city}
                </div>
              </div>
            </div>
            <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center">
              <Trophy className="w-8 h-8 text-primary" />
            </div>
          </div>
        </Card>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Coach</p>
                <p className="text-lg font-bold text-foreground">{team.coach}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Total Players</p>
                <p className="text-3xl font-bold text-foreground">{teamPlayers.length}</p>
              </div>
              <Users className="w-5 h-5 text-primary" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Wins</p>
                <p className="text-3xl font-bold text-green-600">{team.wins}</p>
              </div>
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Losses</p>
                <p className="text-3xl font-bold text-red-600">{team.losses}</p>
              </div>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Squad */}
          <div className="lg:col-span-2">
            <Card className="p-6 mb-8">
              <h2 className="text-2xl font-bold text-foreground mb-6">Squad</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {teamPlayers.map((player) => (
                  <div key={player.id} className="p-4 bg-muted/50 rounded-lg hover:bg-muted transition-colors">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="font-semibold text-foreground">{player.name}</p>
                        <p className="text-sm text-muted-foreground">{player.position}</p>
                      </div>
                      <span className="inline-flex items-center justify-center w-8 h-8 bg-primary rounded font-bold text-primary-foreground">
                        {player.number}
                      </span>
                    </div>
                    {player.stats && (
                      <div className="text-xs text-muted-foreground">
                        {player.stats.gamesPlayed && <p>Games: {player.stats.gamesPlayed}</p>}
                        {player.stats.runs && <p>Runs: {player.stats.runs}</p>}
                        {player.stats.points && <p>Points: {player.stats.points}</p>}
                        {player.stats.goals && <p>Goals: {player.stats.goals}</p>}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Recent Activity */}
          <div>
            <Card className="p-6">
              <h2 className="text-xl font-bold text-foreground mb-4">Recent Matches</h2>
              <div className="space-y-3">
                {completedMatches.slice(0, 3).map((match) => (
                  <div key={match.id} className="p-3 bg-muted/50 rounded">
                    <p className="font-medium text-foreground text-sm">{match.opponent}</p>
                    {match.score && (
                      <p className="text-lg font-bold text-foreground mt-1">
                        {match.score.team} - {match.score.opponent}
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground mt-1">{match.date}</p>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>

        {/* Upcoming Matches */}
        {upcomingMatches.length > 0 && (
          <Card className="p-6 mt-8">
            <h2 className="text-2xl font-bold text-foreground mb-4">Upcoming Matches</h2>
            <div className="grid grid-cols-1 gap-4">
              {upcomingMatches.map((match) => (
                <div key={match.id} className="flex items-center justify-between p-4 bg-muted/50 rounded hover:bg-muted transition-colors">
                  <div>
                    <p className="font-semibold text-foreground">{team.name} vs {match.opponent}</p>
                    <div className="flex gap-4 text-sm text-muted-foreground mt-1">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" /> {match.date}
                      </span>
                      <span>{match.time}</span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" /> {match.venue}
                      </span>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">View</Button>
                </div>
              ))}
            </div>
          </Card>
        )}
      </main>
    </div>
  );
}
