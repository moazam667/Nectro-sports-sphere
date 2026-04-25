'use client';

import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import { Navigation } from '@/components/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { mockSchedules, mockTeams } from '@/lib/mock-data';
import { Calendar, MapPin, CheckCircle, Clock } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function SchedulesPage() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'completed'>('all');

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  if (!user) return null;

  const filteredSchedules = mockSchedules.filter((schedule) => {
    if (filter === 'upcoming') return schedule.status === 'upcoming';
    if (filter === 'completed') return schedule.status === 'completed';
    return true;
  });

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-4xl font-bold text-foreground">Match Schedule</h1>
              <p className="text-muted-foreground mt-2">View all scheduled matches</p>
            </div>
            {user.role === 'admin' && (
              <Button className="bg-primary hover:bg-primary/90">Add Schedule</Button>
            )}
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-2">
            {(['all', 'upcoming', 'completed'] as const).map((tab) => (
              <Button
                key={tab}
                variant={filter === tab ? 'default' : 'outline'}
                onClick={() => setFilter(tab)}
                className="capitalize"
              >
                {tab}
              </Button>
            ))}
          </div>
        </div>

        {/* Schedules Grid */}
        <div className="grid grid-cols-1 gap-4">
          {filteredSchedules.map((schedule) => {
            const team = mockTeams.find((t) => t.id === schedule.teamId);
            return (
              <Card key={schedule.id} className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      {schedule.status === 'completed' ? (
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      ) : (
                        <Clock className="w-5 h-5 text-primary" />
                      )}
                      <span className={`text-sm font-medium capitalize ${
                        schedule.status === 'completed' ? 'text-green-600' : 'text-primary'
                      }`}>
                        {schedule.status}
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-foreground mb-2">
                      {team?.name} vs {schedule.opponent}
                    </h3>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <p className="text-xs text-muted-foreground">Date</p>
                        <p className="font-semibold text-foreground">{schedule.date}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Time</p>
                        <p className="font-semibold text-foreground">{schedule.time}</p>
                      </div>
                      <div className="md:col-span-2">
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                          <MapPin className="w-3 h-3" /> Venue
                        </p>
                        <p className="font-semibold text-foreground">{schedule.venue}</p>
                      </div>
                    </div>
                  </div>

                  {schedule.status === 'completed' && schedule.score && (
                    <div className="flex items-center gap-4 bg-muted/50 px-6 py-4 rounded-lg">
                      <div className="text-center">
                        <p className="text-sm text-muted-foreground mb-1">Final Score</p>
                        <p className="text-3xl font-bold text-foreground">{schedule.score.team}</p>
                      </div>
                      <p className="text-2xl text-muted-foreground">-</p>
                      <div className="text-center">
                        <p className="text-sm text-muted-foreground mb-1">Opponent</p>
                        <p className="text-3xl font-bold text-foreground">{schedule.score.opponent}</p>
                      </div>
                    </div>
                  )}

                  {schedule.status === 'upcoming' && user.role === 'admin' && (
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">Edit</Button>
                      <Button variant="outline" size="sm">Cancel</Button>
                    </div>
                  )}
                </div>
              </Card>
            );
          })}
        </div>

        {filteredSchedules.length === 0 && (
          <Card className="p-8 text-center">
            <p className="text-muted-foreground">No {filter !== 'all' ? filter : ''} matches found</p>
          </Card>
        )}
      </main>
    </div>
  );
}
