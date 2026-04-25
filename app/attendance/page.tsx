'use client';

import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import { Navigation } from '@/components/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { mockAttendance, mockPlayers, mockTeams } from '@/lib/mock-data';
import { CheckCircle, XCircle, HelpCircle } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function AttendancePage() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const [selectedTeam, setSelectedTeam] = useState(mockTeams[0]?.id || '');
  const [selectedDate, setSelectedDate] = useState('2024-03-08');

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  if (!user) return null;

  const filteredAttendance = mockAttendance.filter(
    (record) => record.teamId === selectedTeam && record.date === selectedDate
  );

  const teamPlayers = mockPlayers.filter((p) => p.teamId === selectedTeam);
  const team = mockTeams.find((t) => t.id === selectedTeam);

  const getAttendanceStatus = (playerId: string) => {
    return filteredAttendance.find((a) => a.playerId === playerId)?.status || 'unknown';
  };

  const attendanceStats = {
    present: filteredAttendance.filter((a) => a.status === 'present').length,
    absent: filteredAttendance.filter((a) => a.status === 'absent').length,
    excused: filteredAttendance.filter((a) => a.status === 'excused').length,
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground">Attendance Tracking</h1>
          <p className="text-muted-foreground mt-2">Track player attendance and participation</p>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Select Team</label>
            <select
              value={selectedTeam}
              onChange={(e) => setSelectedTeam(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {mockTeams.map((team) => (
                <option key={team.id} value={team.id}>
                  {team.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Select Date</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Present</p>
                <p className="text-3xl font-bold text-green-600">{attendanceStats.present}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Absent</p>
                <p className="text-3xl font-bold text-red-600">{attendanceStats.absent}</p>
              </div>
              <XCircle className="w-8 h-8 text-red-600" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Excused</p>
                <p className="text-3xl font-bold text-blue-600">{attendanceStats.excused}</p>
              </div>
              <HelpCircle className="w-8 h-8 text-blue-600" />
            </div>
          </Card>
        </div>

        {/* Attendance Table */}
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Player</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Position</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-foreground">Status</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-foreground">Action</th>
                </tr>
              </thead>
              <tbody>
                {teamPlayers.map((player, index) => {
                  const status = getAttendanceStatus(player.id);
                  return (
                    <tr
                      key={player.id}
                      className={`border-b border-border hover:bg-muted/50 transition-colors ${
                        index % 2 === 0 ? 'bg-background' : 'bg-muted/20'
                      }`}
                    >
                      <td className="px-6 py-4 text-foreground font-medium">{player.name}</td>
                      <td className="px-6 py-4 text-foreground">{player.position}</td>
                      <td className="px-6 py-4 text-center">
                        <span
                          className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${
                            status === 'present'
                              ? 'bg-green-500/10 text-green-600'
                              : status === 'absent'
                              ? 'bg-red-500/10 text-red-600'
                              : status === 'excused'
                              ? 'bg-blue-500/10 text-blue-600'
                              : 'bg-gray-500/10 text-gray-600'
                          }`}
                        >
                          {status === 'present' && <CheckCircle className="w-4 h-4" />}
                          {status === 'absent' && <XCircle className="w-4 h-4" />}
                          {status === 'excused' && <HelpCircle className="w-4 h-4" />}
                          {status.charAt(0).toUpperCase() + status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <select
                          value={status}
                          className="px-3 py-1 rounded border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                        >
                          <option value="present">Present</option>
                          <option value="absent">Absent</option>
                          <option value="excused">Excused</option>
                        </select>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {teamPlayers.length === 0 && (
            <div className="p-8 text-center">
              <p className="text-muted-foreground">No players found for this team</p>
            </div>
          )}
        </Card>
      </main>
    </div>
  );
}
