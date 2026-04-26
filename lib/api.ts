const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

export async function fetchTeams() {
  const response = await fetch(`${API_BASE_URL}/teams`);
  if (!response.ok) throw new Error('Failed to fetch teams');
  return response.json();
}

export async function fetchPlayers() {
  const response = await fetch(`${API_BASE_URL}/players`);
  if (!response.ok) throw new Error('Failed to fetch players');
  return response.json();
}

export async function fetchSchedules() {
  const response = await fetch(`${API_BASE_URL}/schedules`);
  if (!response.ok) throw new Error('Failed to fetch schedules');
  return response.json();
}

export async function fetchAttendance() {
  const response = await fetch(`${API_BASE_URL}/attendance`);
  if (!response.ok) throw new Error('Failed to fetch attendance');
  return response.json();
}

export async function fetchEquipment() {
  const response = await fetch(`${API_BASE_URL}/equipment`);
  if (!response.ok) throw new Error('Failed to fetch equipment');
  return response.json();
}

export async function fetchDashboardStats() {
  const response = await fetch(`${API_BASE_URL}/dashboard/stats`);
  if (!response.ok) throw new Error('Failed to fetch dashboard stats');
  return response.json();
}
