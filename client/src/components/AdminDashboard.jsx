import { useEffect, useMemo, useState } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar,
  Legend,
} from 'recharts';
import {
  Users,
  Shield,
  Building2,
  DoorOpen,
  Tag,
  CalendarClock,
  BarChart3,
} from 'lucide-react';

import { useAdminStatsStore } from '../stores/adminStatsStore';

function StatCard({ icon: Icon, label, value }) {
  return (
    <div className='rounded-2xl border bg-white p-5 shadow-sm'>
      <div className='flex items-start gap-4'>
        <div className='flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100 text-gray-700'>
          <Icon className='h-6 w-6' />
        </div>

        <div className='flex-1'>
          <p className='text-sm text-gray-500'>{label}</p>
          <p className='mt-1 text-2xl font-bold text-gray-900'>{value}</p>
        </div>
      </div>
    </div>
  );
}

function ChartCard({ title, icon: Icon, right, children }) {
  return (
    <div className='rounded-2xl border bg-white p-6 shadow-sm'>
      <div className='mb-4 flex items-center justify-between gap-3'>
        <div className='flex items-center gap-2'>
          <div className='flex h-9 w-9 items-center justify-center rounded-xl bg-gray-100 text-gray-700'>
            <Icon className='h-5 w-5' />
          </div>
          <h2 className='text-lg font-semibold text-gray-900'>{title}</h2>
        </div>
        {right}
      </div>

      <div className='h-80'>{children}</div>
    </div>
  );
}

export default function AdminDashboard() {
  const stats = useAdminStatsStore((s) => s.stats);
  const isLoading = useAdminStatsStore((s) => s.isLoading);
  const error = useAdminStatsStore((s) => s.error);
  const fetchAdminStats = useAdminStatsStore((s) => s.fetchAdminStats);

  const [days, setDays] = useState(30);

  useEffect(() => {
    fetchAdminStats({ days }).catch(() => {});
  }, [days, fetchAdminStats]);

  const kpis = stats?.kpis;
  const charts = stats?.charts;

  const reservationsPerDay = charts?.reservationsPerDay || [];
  const reservationsByBuilding = useMemo(() => {
    return (charts?.reservationsByBuilding || []).map((x) => ({
      name: x.buildingName,
      count: x.count,
    }));
  }, [charts]);

  const reservationsByRoomType = useMemo(() => {
    return (charts?.reservationsByRoomType || []).map((x) => ({
      name: x.roomTypeName,
      count: x.count,
    }));
  }, [charts]);

  const topRooms = charts?.topRooms || [];

  return (
    <div className='space-y-8'>
      {/* Header */}
      <div className='rounded-2xl border bg-white p-6 shadow-sm'>
        <div className='flex items-start justify-between gap-4'>
          <div className='flex items-start gap-4'>
            <div className='flex h-12 w-12 items-center justify-center rounded-xl bg-gray-900 text-white'>
              <BarChart3 className='h-6 w-6' />
            </div>
            <div>
              <h1 className='text-2xl font-bold text-gray-900'>
                Admin Dashboard
              </h1>
              <p className='mt-1 text-sm text-gray-600'>
                KPIs and analytics for ConferenceBook.
              </p>
            </div>
          </div>

          <div className='flex items-center gap-2'>
            <select
              className='rounded-xl border bg-white px-3 py-2 text-sm font-medium text-gray-900 hover:bg-gray-50'
              value={days}
              onChange={(e) => setDays(Number(e.target.value))}
              disabled={isLoading}
            >
              <option value={7}>Last 7 days</option>
              <option value={30}>Last 30 days</option>
              <option value={90}>Last 90 days</option>
              <option value={180}>Last 180 days</option>
            </select>

            <button
              onClick={() => fetchAdminStats({ days })}
              className='rounded-xl border px-3 py-2 text-sm font-medium hover:bg-gray-50'
              type='button'
              disabled={isLoading}
            >
              Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Loading / error */}
      {isLoading && (
        <div className='flex justify-center py-10'>
          <div className='h-8 w-8 animate-spin rounded-full border-2 border-gray-300 border-t-gray-900'></div>
        </div>
      )}

      {error && (
        <div className='rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-red-700'>
          {error}
        </div>
      )}

      {/* KPIs */}
      {kpis && (
        <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
          <StatCard icon={Users} label='Users' value={kpis.usersCount} />
          <StatCard icon={Shield} label='Admins' value={kpis.adminsCount} />
          <StatCard
            icon={Building2}
            label='Buildings'
            value={kpis.buildingsCount}
          />
          <StatCard icon={DoorOpen} label='Rooms' value={kpis.roomsCount} />
          <StatCard icon={Tag} label='Room types' value={kpis.roomTypesCount} />
          <StatCard
            icon={CalendarClock}
            label='Reservations (total)'
            value={kpis.reservationsCount}
          />
          <StatCard
            icon={CalendarClock}
            label='Reservations (today)'
            value={kpis.reservationsTodayCount}
          />
          <StatCard
            icon={CalendarClock}
            label='Next 7 days'
            value={kpis.reservationsNext7DaysCount}
          />
        </div>
      )}

      {/* Charts grid */}
      <div className='grid gap-6 lg:grid-cols-2'>
        {/* Line chart */}
        <ChartCard
          title='Reservations per day'
          icon={CalendarClock}
          right={
            <span className='text-xs text-gray-500'>
              {stats?.meta?.generatedAt
                ? `Updated: ${new Date(stats.meta.generatedAt).toLocaleString()}`
                : null}
            </span>
          }
        >
          <ResponsiveContainer width='100%' height='100%'>
            <LineChart data={reservationsPerDay}>
              <CartesianGrid strokeDasharray='3 3' />
              <XAxis dataKey='date' tick={{ fontSize: 12 }} />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Line
                type='monotone'
                dataKey='count'
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Bar chart - building */}
        <ChartCard title='Reservations by building' icon={Building2}>
          <ResponsiveContainer width='100%' height='100%'>
            <BarChart data={reservationsByBuilding}>
              <CartesianGrid strokeDasharray='3 3' />
              <XAxis dataKey='name' tick={{ fontSize: 12 }} interval={0} />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Legend />
              <Bar dataKey='count' />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Bar chart - room type */}
        <ChartCard title='Reservations by room type' icon={Tag}>
          <ResponsiveContainer width='100%' height='100%'>
            <BarChart data={reservationsByRoomType}>
              <CartesianGrid strokeDasharray='3 3' />
              <XAxis dataKey='name' tick={{ fontSize: 12 }} interval={0} />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Legend />
              <Bar dataKey='count' />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Top rooms table */}
        <div className='rounded-2xl border bg-white p-6 shadow-sm'>
          <div className='mb-4 flex items-center gap-2'>
            <div className='flex h-9 w-9 items-center justify-center rounded-xl bg-gray-100 text-gray-700'>
              <DoorOpen className='h-5 w-5' />
            </div>
            <h2 className='text-lg font-semibold text-gray-900'>
              Top rooms (by reservations)
            </h2>
          </div>

          {topRooms.length === 0 ? (
            <p className='text-sm text-gray-600'>No data yet.</p>
          ) : (
            <div className='overflow-x-auto'>
              <table className='w-full text-left text-sm'>
                <thead>
                  <tr className='border-b text-gray-600'>
                    <th className='py-2 pr-4'>Room</th>
                    <th className='py-2 pr-4'>Building</th>
                    <th className='py-2 pr-4'>Type</th>
                    <th className='py-2 pr-0'>Count</th>
                  </tr>
                </thead>
                <tbody>
                  {topRooms.map((r) => (
                    <tr key={r.roomId} className='border-b last:border-b-0'>
                      <td className='py-3 pr-4 font-medium text-gray-900'>
                        {r.roomName}
                      </td>
                      <td className='py-3 pr-4 text-gray-700'>
                        {r.buildingName}
                      </td>
                      <td className='py-3 pr-4 text-gray-700'>
                        {r.roomTypeName}
                      </td>
                      <td className='py-3 pr-0 font-medium text-gray-900'>
                        {r.count}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
