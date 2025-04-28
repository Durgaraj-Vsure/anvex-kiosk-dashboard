import { useQuery } from '@tanstack/react-query';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, Title } from 'chart.js';
import { Doughnut, Line } from 'react-chartjs-2';
import { getDevices, getSessions, getIncidents } from '../../services/api';
import { format } from 'date-fns';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, Title);

export default function Dashboard() {
  const { data: devicesData } = useQuery({
    queryKey: ['devices'],
    queryFn: () => getDevices({ page: 1, limit: 100 }),
  });

  const { data: sessionsData } = useQuery({
    queryKey: ['sessions'],
    queryFn: () => getSessions({ page: 1, limit: 100 }),
  });

  const { data: incidentsData } = useQuery({
    queryKey: ['incidents'],
    queryFn: () => getIncidents({ page: 1, limit: 100 }),
  });

  // Process data for charts
  const activeDevices = devicesData?.data.filter(device => device.is_active).length || 0;
  const inactiveDevices = (devicesData?.data.length || 0) - activeDevices;

  const deviceStatusData = {
    labels: ['Active', 'Inactive'],
    datasets: [
      {
        data: [activeDevices, inactiveDevices],
        backgroundColor: ['#0ea5e9', '#94a3b8'],
        hoverBackgroundColor: ['#0284c7', '#64748b'],
      },
    ],
  };

  // Process session data for line chart
  const sessionsByDate = sessionsData?.data.reduce((acc: { [key: string]: number }, session) => {
    const date = format(new Date(session.created_at), 'MMM dd');
    acc[date] = (acc[date] || 0) + 1;
    return acc;
  }, {}) || {};

  const sessionChartData = {
    labels: Object.keys(sessionsByDate),
    datasets: [
      {
        label: 'Sessions',
        data: Object.values(sessionsByDate),
        borderColor: '#0ea5e9',
        backgroundColor: 'rgba(14, 165, 233, 0.1)',
        tension: 0.4,
      },
    ],
  };

  // Process incident data
  const incidentsByStatus = incidentsData?.data.reduce((acc: { [key: string]: number }, incident) => {
    acc[incident.status] = (acc[incident.status] || 0) + 1;
    return acc;
  }, {}) || {};

  const incidentStatusData = {
    labels: Object.keys(incidentsByStatus),
    datasets: [
      {
        data: Object.values(incidentsByStatus),
        backgroundColor: ['#0ea5e9', '#ef4444', '#f59e0b'],
        hoverBackgroundColor: ['#0284c7', '#dc2626', '#d97706'],
      },
    ],
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="card">
          <h3 className="text-lg font-medium text-gray-900">Total Devices</h3>
          <p className="mt-2 text-3xl font-bold text-primary-600">{devicesData?.data.length || 0}</p>
        </div>
        <div className="card">
          <h3 className="text-lg font-medium text-gray-900">Active Sessions</h3>
          <p className="mt-2 text-3xl font-bold text-primary-600">{sessionsData?.data.length || 0}</p>
        </div>
        <div className="card">
          <h3 className="text-lg font-medium text-gray-900">Total Incidents</h3>
          <p className="mt-2 text-3xl font-bold text-primary-600">{incidentsData?.data.length || 0}</p>
        </div>
        <div className="card">
          <h3 className="text-lg font-medium text-gray-900">Active Devices</h3>
          <p className="mt-2 text-3xl font-bold text-primary-600">{activeDevices}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="card">
          <h3 className="text-lg font-medium text-gray-900">Device Status</h3>
          <div className="mt-4 h-64">
            <Doughnut data={deviceStatusData} options={{ maintainAspectRatio: false }} />
          </div>
        </div>
        <div className="card">
          <h3 className="text-lg font-medium text-gray-900">Incident Status</h3>
          <div className="mt-4 h-64">
            <Doughnut data={incidentStatusData} options={{ maintainAspectRatio: false }} />
          </div>
        </div>
      </div>

      <div className="card">
        <h3 className="text-lg font-medium text-gray-900">Sessions Over Time</h3>
        <div className="mt-4 h-64">
          <Line
            data={sessionChartData}
            options={{
              maintainAspectRatio: false,
              scales: {
                y: {
                  beginAtZero: true,
                  ticks: {
                    stepSize: 1,
                  },
                },
              },
            }}
          />
        </div>
      </div>
    </div>
  );
} 