import { prisma } from '../prismaClient.js';
import { parseDateOnlyToUtcRange } from '../utils/helpers.js';

// pomoćna: start of day UTC
function startOfUtcDay(d) {
  return new Date(
    Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate(), 0, 0, 0, 0),
  );
}

// pomoćna: add days UTC
function addUtcDays(d, days) {
  const x = new Date(d);
  x.setUTCDate(x.getUTCDate() + days);
  return x;
}

/**
 * @route   GET /api/admin/stats?days=30
 * @access  Private (ADMIN)
 * @desc    Returns admin KPIs and chart datasets for dashboard.
 *
 * Query:
 *  - days (optional): number of days for "reservationsPerDay" chart (default 30, max 365)
 *
 * Returns:
 *  {
 *    kpis: {...},
 *    charts: {
 *      reservationsPerDay: [{ date: 'YYYY-MM-DD', count: number }],
 *      reservationsByBuilding: [{ buildingId, buildingName, count }],
 *      reservationsByRoomType: [{ roomTypeId, roomTypeName, count }],
 *      topRooms: [{ roomId, roomName, buildingName, roomTypeName, count }]
 *    }
 *  }
 */
export async function getAdminStats(req, res) {
  try {
    const daysRaw = req.query.days;
    let days = 30;

    if (daysRaw !== undefined) {
      const n = Number(daysRaw);
      if (!Number.isInteger(n) || n <= 0) {
        return res
          .status(400)
          .json({ message: 'days must be a positive integer.' });
      }
      days = Math.min(n, 365);
    }

    const now = new Date();

    // "today" range (UTC) – koristiš već helper koji pravi UTC range iz YYYY-MM-DD
    const todayStr = now.toISOString().slice(0, 10);
    const todayRange = parseDateOnlyToUtcRange(todayStr);

    // upcoming 7 days range (UTC)
    const startToday = startOfUtcDay(now);
    const endNext7 = addUtcDays(startToday, 7); // [today, today+7)
    // KPI COUNT upita radimo paralelno
    const [
      usersCount,
      adminsCount,
      buildingsCount,
      roomTypesCount,
      roomsCount,
      reservationsCount,
      reservationsTodayCount,
      reservationsNext7DaysCount,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { role: 'ADMIN' } }),
      prisma.building.count(),
      prisma.roomType.count(),
      prisma.room.count(),
      prisma.reservation.count(),
      prisma.reservation.count({
        where: todayRange
          ? { startTime: { gte: todayRange.start, lte: todayRange.end } }
          : undefined,
      }),
      prisma.reservation.count({
        where: {
          startTime: { gte: startToday, lt: endNext7 },
        },
      }),
    ]);

    // Chart: reservations per day (last N days)
    const chartStart = addUtcDays(startToday, -days + 1); // uključuje današnji dan
    const reservationsInPeriod = await prisma.reservation.findMany({
      where: {
        startTime: { gte: chartStart, lt: addUtcDays(startToday, 1) }, // do sutra 00:00
      },
      select: { startTime: true },
    });

    // grupisanje u JS da izbegnemo RAW SQL
    const perDayMap = new Map(); // YYYY-MM-DD -> count
    for (const r of reservationsInPeriod) {
      const key = r.startTime.toISOString().slice(0, 10);
      perDayMap.set(key, (perDayMap.get(key) || 0) + 1);
    }

    // popuni sve dane (i one sa 0)
    const reservationsPerDay = [];
    for (let i = 0; i < days; i++) {
      const d = addUtcDays(chartStart, i);
      const key = d.toISOString().slice(0, 10);
      reservationsPerDay.push({ date: key, count: perDayMap.get(key) || 0 });
    }

    // Chart: reservations by building
    const byBuildingRaw = await prisma.reservation.groupBy({
      by: ['roomId'],
      _count: { _all: true },
    });

    // roomId -> buildingId (batch fetch)
    const roomIds = byBuildingRaw.map((x) => x.roomId);
    const rooms = roomIds.length
      ? await prisma.room.findMany({
          where: { id: { in: roomIds } },
          select: {
            id: true,
            buildingId: true,
            building: { select: { id: true, name: true } },
            roomType: { select: { id: true, name: true } },
            name: true,
          },
        })
      : [];

    // building aggregation
    const buildingMap = new Map(); // buildingId -> {buildingId, buildingName, count}
    const roomTypeMap = new Map(); // roomTypeId -> {roomTypeId, roomTypeName, count}
    const topRoomsTemp = []; // {roomId, roomName, buildingName, roomTypeName, count}

    const roomsById = new Map(rooms.map((r) => [r.id, r]));

    for (const row of byBuildingRaw) {
      const room = roomsById.get(row.roomId);
      if (!room) continue;

      const count = row._count._all;

      // building
      const bId = room.buildingId;
      const bName = room.building?.name || 'Unknown';
      const bEntry = buildingMap.get(bId) || {
        buildingId: bId,
        buildingName: bName,
        count: 0,
      };
      bEntry.count += count;
      buildingMap.set(bId, bEntry);

      // roomType
      const rtId = room.roomType?.id;
      const rtName = room.roomType?.name || 'Unknown';
      if (rtId !== undefined && rtId !== null) {
        const rtEntry = roomTypeMap.get(rtId) || {
          roomTypeId: rtId,
          roomTypeName: rtName,
          count: 0,
        };
        rtEntry.count += count;
        roomTypeMap.set(rtId, rtEntry);
      }

      // top rooms
      topRoomsTemp.push({
        roomId: room.id,
        roomName: room.name,
        buildingName: bName,
        roomTypeName: rtName,
        count,
      });
    }

    const reservationsByBuilding = Array.from(buildingMap.values()).sort(
      (a, b) => b.count - a.count,
    );
    const reservationsByRoomType = Array.from(roomTypeMap.values()).sort(
      (a, b) => b.count - a.count,
    );
    const topRooms = topRoomsTemp.sort((a, b) => b.count - a.count).slice(0, 5);

    return res.json({
      kpis: {
        usersCount,
        adminsCount,
        buildingsCount,
        roomTypesCount,
        roomsCount,
        reservationsCount,
        reservationsTodayCount,
        reservationsNext7DaysCount,
      },
      charts: {
        reservationsPerDay,
        reservationsByBuilding,
        reservationsByRoomType,
        topRooms,
      },
      meta: {
        days,
        generatedAt: new Date().toISOString(),
      },
    });
  } catch (err) {
    return res.status(500).json({ message: 'Server error.' });
  }
}
