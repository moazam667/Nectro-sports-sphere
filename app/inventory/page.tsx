'use client';

import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import { Navigation } from '@/components/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { mockEquipment, mockTeams } from '@/lib/mock-data';
import { Package, AlertCircle } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function InventoryPage() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const [selectedTeam, setSelectedTeam] = useState(mockTeams[0]?.id || '');

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  if (!user) return null;

  const filteredEquipment = mockEquipment.filter((eq) => eq.teamId === selectedTeam);
  const team = mockTeams.find((t) => t.id === selectedTeam);

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case 'excellent':
        return 'bg-green-500/10 text-green-600';
      case 'good':
        return 'bg-blue-500/10 text-blue-600';
      case 'fair':
        return 'bg-yellow-500/10 text-yellow-600';
      case 'poor':
        return 'bg-red-500/10 text-red-600';
      default:
        return 'bg-gray-500/10 text-gray-600';
    }
  };

  const totalValue = filteredEquipment.reduce((sum, eq) => sum + eq.quantity, 0);
  const poorConditionItems = filteredEquipment.filter((eq) => eq.condition === 'poor').length;

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-4xl font-bold text-foreground">Equipment Inventory</h1>
              <p className="text-muted-foreground mt-2">Manage team equipment and supplies</p>
            </div>
            {user.role === 'admin' && (
              <Button className="bg-primary hover:bg-primary/90">Add Equipment</Button>
            )}
          </div>

          {/* Team Filter */}
          <div className="max-w-md">
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
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Items</p>
                <p className="text-3xl font-bold text-foreground">{totalValue}</p>
              </div>
              <Package className="w-8 h-8 text-primary" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Equipment Types</p>
                <p className="text-3xl font-bold text-foreground">{filteredEquipment.length}</p>
              </div>
              <Package className="w-8 h-8 text-secondary" />
            </div>
          </Card>

          {poorConditionItems > 0 && (
            <Card className="p-6 border-red-500/20 bg-red-500/5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Needs Maintenance</p>
                  <p className="text-3xl font-bold text-red-600">{poorConditionItems}</p>
                </div>
                <AlertCircle className="w-8 h-8 text-red-600" />
              </div>
            </Card>
          )}
        </div>

        {/* Equipment Table */}
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Equipment</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Category</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-foreground">Quantity</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-foreground">Condition</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Last Maintenance</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-foreground">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredEquipment.map((equipment, index) => (
                  <tr
                    key={equipment.id}
                    className={`border-b border-border hover:bg-muted/50 transition-colors ${
                      index % 2 === 0 ? 'bg-background' : 'bg-muted/20'
                    }`}
                  >
                    <td className="px-6 py-4 text-foreground font-medium">{equipment.name}</td>
                    <td className="px-6 py-4 text-foreground text-sm">{equipment.category}</td>
                    <td className="px-6 py-4 text-center">
                      <span className="inline-flex items-center justify-center w-8 h-8 bg-primary/10 rounded font-bold text-primary">
                        {equipment.quantity}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium capitalize ${
                        getConditionColor(equipment.condition)
                      }`}>
                        {equipment.condition}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-foreground text-sm">
                      {equipment.lastMaintenance || 'N/A'}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <Button variant="ghost" size="sm">Edit</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredEquipment.length === 0 && (
            <div className="p-8 text-center">
              <p className="text-muted-foreground">No equipment found for this team</p>
            </div>
          )}
        </Card>
      </main>
    </div>
  );
}
