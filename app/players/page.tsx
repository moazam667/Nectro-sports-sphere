'use client';

import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import { Navigation } from '@/components/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { fetchPlayers } from '@/lib/api';
import { User, Trophy, Shirt } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import type { Player } from '@/lib/mock-data';

export default function PlayersPage() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    fetchPlayers()
      .then(setPlayers)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [isAuthenticated, router]);

  if (!user) return null;

  const filteredPlayers = players.filter((player) =>
    player.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-4xl font-bold text-foreground">Players</h1>
              <p className="text-muted-foreground mt-2">Manage all team players</p>
            </div>
            {user.role === 'admin' && (
              <Button className="bg-primary hover:bg-primary/90">Add Player</Button>
            )}
          </div>

          {/* Search */}
          <div className="max-w-md">
            <Input
              placeholder="Search players..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
          </div>
        </div>

        {loading ? (
          <p className="text-center text-muted-foreground">Loading players...</p>
        ) : (
          <>
            {/* Players Table */}
            <Card className="overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border bg-muted/50">
                      <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Player</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Team</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Position</th>
                      <th className="px-6 py-4 text-center text-sm font-semibold text-foreground">Number</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Join Date</th>
                      <th className="px-6 py-4 text-center text-sm font-semibold text-foreground">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPlayers.map((player: any, index) => {
                      return (
                        <tr
                          key={player.id}
                          className={`border-b border-border hover:bg-muted/50 transition-colors ${
                            index % 2 === 0 ? 'bg-background' : 'bg-muted/20'
                          }`}
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                                <User className="w-5 h-5 text-primary" />
                              </div>
                              <div>
                                <p className="font-medium text-foreground">{player.name}</p>
                                <p className="text-xs text-muted-foreground">ID: {player.id}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-foreground">{player.team?.name || 'N/A'}</td>
                          <td className="px-6 py-4 text-foreground">{player.position}</td>
                          <td className="px-6 py-4 text-center">
                            <span className="inline-flex items-center justify-center w-8 h-8 bg-primary/10 rounded font-bold text-primary">
                              {player.number}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-foreground">{player.join_date}</td>
                          <td className="px-6 py-4 text-center">
                            <Button variant="ghost" size="sm">View</Button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {filteredPlayers.length === 0 && (
                <div className="p-8 text-center">
                  <p className="text-muted-foreground">No players found</p>
                </div>
              )}
            </Card>
          </>
        )}
      </main>
    </div>
  );
}
