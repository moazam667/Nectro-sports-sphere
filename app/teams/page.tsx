'use client';

import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import { Navigation } from '@/components/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { mockTeams } from '@/lib/mock-data';
import { Trophy, MapPin, Users, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import { useEffect } from 'react';

export default function TeamsPage() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();

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

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold text-foreground">Teams</h1>
            <p className="text-muted-foreground mt-2">Manage all sports teams</p>
          </div>
          {user.role === 'admin' && (
            <Button className="bg-primary hover:bg-primary/90">Add Team</Button>
          )}
        </div>

        {/* Teams by Sport */}
        {Object.entries(teamsBySport).map(([sport, teams]) => (
          <div key={sport} className="mb-12">
            <h2 className="text-2xl font-bold text-foreground mb-4">{sport}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {teams.map((team) => (
                <Card key={team.id} className="p-6 hover:shadow-lg transition-shadow cursor-pointer group">
                  <Link href={`/teams/${team.id}`}>
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">
                          {team.name}
                        </h3>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                          <MapPin className="w-4 h-4" />
                          {team.city}
                        </div>
                      </div>
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                        <Trophy className="w-6 h-6 text-primary" />
                      </div>
                    </div>

                    <div className="bg-muted/50 rounded-lg p-3 mb-4">
                      <p className="text-sm text-muted-foreground">Coach</p>
                      <p className="font-semibold text-foreground">{team.coach}</p>
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                      <div className="text-center p-3 bg-primary/5 rounded">
                        <div className="flex items-center justify-center gap-1 mb-1">
                          <Users className="w-4 h-4 text-primary" />
                        </div>
                        <p className="text-xs text-muted-foreground">Players</p>
                        <p className="font-bold text-foreground">{team.players}</p>
                      </div>
                      <div className="text-center p-3 bg-green-500/5 rounded">
                        <div className="flex items-center justify-center gap-1 mb-1">
                          <TrendingUp className="w-4 h-4 text-green-500" />
                        </div>
                        <p className="text-xs text-muted-foreground">Wins</p>
                        <p className="font-bold text-foreground">{team.wins}</p>
                      </div>
                      <div className="text-center p-3 bg-red-500/5 rounded">
                        <p className="text-xs text-muted-foreground">Losses</p>
                        <p className="font-bold text-foreground">{team.losses}</p>
                      </div>
                    </div>
                  </Link>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </main>
    </div>
  );
}
