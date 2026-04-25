'use client';

import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import { Navigation } from '@/components/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { mockTeams, mockPlayers, mockSchedules } from '@/lib/mock-data';
import { Users, Trophy, Calendar, Activity } from 'lucide-react';
import Link from 'next/link';
import { useEffect } from 'react';

export default function DashboardPage() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  if (!user) return null;

  const upcomingMatches = mockSchedules.filter((s) => s.status === 'upcoming').slice(0, 3);
  const recentMatches = mockSchedules.filter((s) => s.status === 'completed').slice(0, 3);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">
            Welcome back, <span className="text-primary">{user.name}</span>!
          </h1>
          <p className="text-muted-foreground">
            {user.role === 'admin' && 'Manage all sports teams, players, and schedules'}
            {user.role === 'coach' && 'Manage your team and track performance'}
            {user.role === 'viewer' && 'View team statistics and results'}
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Total Teams</p>
                <p className="text-3xl font-bold text-foreground">{mockTeams.length}</p>
              </div>
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-primary" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Total Players</p>
                <p className="text-3xl font-bold text-foreground">{mockPlayers.length}</p>
              </div>
              <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
                <Activity className="w-5 h-5 text-accent" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Upcoming Matches</p>
                <p className="text-3xl font-bold text-foreground">
                  {mockSchedules.filter((s) => s.status === 'upcoming').length}
                </p>
              </div>
              <div className="w-10 h-10 bg-secondary/10 rounded-lg flex items-center justify-center">
                <Calendar className="w-5 h-5 text-secondary" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Total Wins</p>
                <p className="text-3xl font-bold text-foreground">
                  {mockTeams.reduce((sum, team) => sum + team.wins, 0)}
                </p>
              </div>
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <Trophy className="w-5 h-5 text-primary" />
              </div>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Upcoming Matches */}
          <div className="lg:col-span-2">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-foreground">Upcoming Matches</h2>
                <Link href="/schedules">
                  <Button variant="ghost" size="sm">View All</Button>
                </Link>
              </div>

              <div className="space-y-3">
                {upcomingMatches.length > 0 ? (
                  upcomingMatches.map((match) => (
                    <div key={match.id} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg hover:bg-muted transition-colors">
                      <div>
                        <p className="font-semibold text-foreground">
                          {mockTeams.find((t) => t.id === match.teamId)?.name} vs {match.opponent}
                        </p>
                        <p className="text-sm text-muted-foreground">{match.date} at {match.time}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-foreground">{match.venue}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-muted-foreground text-center py-4">No upcoming matches</p>
                )}
              </div>
            </Card>
          </div>

          {/* Quick Actions */}
          <div>
            <Card className="p-6 h-full">
              <h2 className="text-xl font-bold text-foreground mb-4">Quick Actions</h2>
              <div className="space-y-3">
                <Link href="/teams">
                  <Button variant="outline" className="w-full justify-start">
                    <Users className="w-4 h-4 mr-2" />
                    View Teams
                  </Button>
                </Link>
                <Link href="/players">
                  <Button variant="outline" className="w-full justify-start">
                    <Activity className="w-4 h-4 mr-2" />
                    Manage Players
                  </Button>
                </Link>
                <Link href="/schedules">
                  <Button variant="outline" className="w-full justify-start">
                    <Calendar className="w-4 h-4 mr-2" />
                    View Schedule
                  </Button>
                </Link>
                <Link href="/attendance">
                  <Button variant="outline" className="w-full justify-start">
                    <Activity className="w-4 h-4 mr-2" />
                    Attendance
                  </Button>
                </Link>
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
