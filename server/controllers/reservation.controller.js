import { prisma } from '../prismaClient.js';
import {
  isValidIsoDateTime,
  parseDateOnlyToUtcRange,
  isWithinWorkingHours,
  isSameUtcDay,
} from '../utils/helpers.js';

/**
 * @route   GET /api/reservations?roomId=1&date=YYYY-MM-DD
 * @access  Private (any authenticated user)
 * @desc    Returns reservations for a specific room and exact date (date-only).
 * @query   {string} roomId - required
 *          {string} date - required (YYYY-MM-DD)
 * @returns 200 { reservations: Reservation[] }
 *          400 { message }
 *          500 { message }
 */
export async function getReservationsByRoomAndDate(req, res) {
  try {
    const roomId = Number(req.query.roomId);
    const dateStr = req.query.date;

    if (!Number.isInteger(roomId)) {
      return res
        .status(400)
        .json({ message: 'roomId is required and must be a number.' });
    }

    const range = parseDateOnlyToUtcRange(dateStr);
    if (!range) {
      return res
        .status(400)
        .json({ message: 'date is required in format YYYY-MM-DD.' });
    }

    const reservations = await prisma.reservation.findMany({
      where: {
        roomId,
        startTime: { gte: range.start, lte: range.end },
      },
      include: {
        user: { select: { id: true, fullName: true, email: true, role: true } },
        room: {
          select: {
            id: true,
            name: true,
            capacity: true,
            buildingId: true,
            roomTypeId: true,
          },
        },
      },
      orderBy: { startTime: 'asc' },
    });

    return res.json({ reservations });
  } catch (err) {
    return res.status(500).json({ message: 'Server error.' });
  }
}

/**
 * @route   GET /api/reservations/my-upcoming
 * @access  Private (any authenticated user)
 * @desc    Returns upcoming reservations for the logged-in user (endTime > now).
 * @query   None
 * @returns 200 { reservations: Reservation[] }
 *          500 { message }
 */
export async function getMyUpcomingReservations(req, res) {
  try {
    const now = new Date();

    const reservations = await prisma.reservation.findMany({
      where: {
        userId: req.user.id,
        endTime: { gt: now },
      },
      include: {
        room: {
          include: {
            building: true,
            roomType: true,
          },
        },
      },
      orderBy: { startTime: 'asc' },
    });

    return res.json({ reservations });
  } catch (err) {
    return res.status(500).json({ message: 'Server error.' });
  }
}

/**
 * @route   POST /api/reservations
 * @access  Private (USER only)
 * @desc    Creates a reservation for the logged-in user.
 * @body    {number} roomId
 *          {string} startTime (ISO datetime)
 *          {string} endTime (ISO datetime)
 * @returns 201 { reservation }
 *          400 { message }
 *          404 { message }
 *          409 { message } - Overlap conflict
 *          500 { message }
 */
export async function createReservation(req, res) {
  try {
    const { roomId, startTime, endTime } = req.body;

    if (!roomId || !startTime || !endTime) {
      return res
        .status(400)
        .json({ message: 'roomId, startTime and endTime are required.' });
    }

    const roomIdNum = Number(roomId);
    if (!Number.isInteger(roomIdNum)) {
      return res.status(400).json({ message: 'roomId must be a number.' });
    }

    if (!isValidIsoDateTime(startTime) || !isValidIsoDateTime(endTime)) {
      return res.status(400).json({
        message: 'startTime and endTime must be valid ISO datetime strings.',
      });
    }

    const start = new Date(startTime);
    const end = new Date(endTime);

    if (start >= end) {
      return res
        .status(400)
        .json({ message: 'startTime must be before endTime.' });
    }

    if (!isSameUtcDay(start, end)) {
      return res.status(400).json({
        message: 'startTime and endTime must be on the same day.',
      });
    }

    const room = await prisma.room.findUnique({
      where: { id: roomIdNum },
      select: {
        id: true,
        workingHoursStart: true,
        workingHoursEnd: true,
      },
    });

    if (!room) {
      return res.status(404).json({ message: 'Room not found.' });
    }

    if (
      !isWithinWorkingHours(
        start,
        end,
        room.workingHoursStart,
        room.workingHoursEnd,
      )
    ) {
      return res.status(400).json({
        message: 'Reservation time is outside the room working hours.',
      });
    }

    const conflict = await prisma.reservation.findFirst({
      where: {
        roomId: roomIdNum,
        startTime: { lt: end },
        endTime: { gt: start },
      },
      select: { id: true },
    });

    if (conflict) {
      return res.status(409).json({
        message: 'Reservation overlaps with an existing reservation.',
      });
    }

    const reservation = await prisma.reservation.create({
      data: {
        roomId: roomIdNum,
        userId: req.user.id,
        startTime: start,
        endTime: end,
      },
      include: {
        user: { select: { id: true, fullName: true, email: true, role: true } },
        room: { select: { id: true, name: true } },
      },
    });

    return res.status(201).json({ reservation });
  } catch (err) {
    return res.status(500).json({ message: 'Server error.' });
  }
}

/**
 * @route   PUT /api/reservations/:id
 * @access  Private (USER only, only own reservation)
 * @desc    Updates reservation times (startTime/endTime only) for the logged-in user.
 * @params  {string} id
 * @body    {string} startTime (ISO datetime)
 *          {string} endTime (ISO datetime)
 * @returns 200 { reservation }
 *          400 { message }
 *          403 { message }
 *          404 { message }
 *          409 { message } - Overlap conflict
 *          500 { message }
 */
export async function updateReservationTime(req, res) {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) {
      return res.status(400).json({ message: 'Invalid reservation id.' });
    }

    const { startTime, endTime } = req.body;

    if (!startTime || !endTime) {
      return res
        .status(400)
        .json({ message: 'startTime and endTime are required.' });
    }

    if (!isValidIsoDateTime(startTime) || !isValidIsoDateTime(endTime)) {
      return res.status(400).json({
        message: 'startTime and endTime must be valid ISO datetime strings.',
      });
    }

    const start = new Date(startTime);
    const end = new Date(endTime);

    if (start >= end) {
      return res
        .status(400)
        .json({ message: 'startTime must be before endTime.' });
    }

    if (!isSameUtcDay(start, end)) {
      return res.status(400).json({
        message: 'startTime and endTime must be on the same day.',
      });
    }

    const existing = await prisma.reservation.findUnique({
      where: { id },
      select: { id: true, userId: true, roomId: true },
    });

    if (!existing) {
      return res.status(404).json({ message: 'Reservation not found.' });
    }

    if (existing.userId !== req.user.id) {
      return res
        .status(403)
        .json({ message: 'You can only update your own reservation.' });
    }

    const room = await prisma.room.findUnique({
      where: { id: existing.roomId },
      select: { workingHoursStart: true, workingHoursEnd: true },
    });

    if (!room) {
      return res.status(404).json({ message: 'Room not found.' });
    }

    if (
      !isWithinWorkingHours(
        start,
        end,
        room.workingHoursStart,
        room.workingHoursEnd,
      )
    ) {
      return res.status(400).json({
        message: 'Reservation time is outside the room working hours.',
      });
    }

    const conflict = await prisma.reservation.findFirst({
      where: {
        roomId: existing.roomId,
        id: { not: id },
        startTime: { lt: end },
        endTime: { gt: start },
      },
      select: { id: true },
    });

    if (conflict) {
      return res.status(409).json({
        message: 'Reservation overlaps with an existing reservation.',
      });
    }

    const reservation = await prisma.reservation.update({
      where: { id },
      data: { startTime: start, endTime: end },
      include: {
        user: { select: { id: true, fullName: true, email: true, role: true } },
        room: { select: { id: true, name: true } },
      },
    });

    return res.json({ reservation });
  } catch (err) {
    return res.status(500).json({ message: 'Server error.' });
  }
}

/**
 * @route   DELETE /api/reservations/:id
 * @access  Private (USER only, only own reservation)
 * @desc    Deletes a reservation owned by the logged-in user.
 * @params  {string} id
 * @returns 200 { message }
 *          400 { message }
 *          403 { message }
 *          404 { message }
 *          500 { message }
 */
export async function deleteReservation(req, res) {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) {
      return res.status(400).json({ message: 'Invalid reservation id.' });
    }

    const existing = await prisma.reservation.findUnique({
      where: { id },
      select: { id: true, userId: true },
    });

    if (!existing) {
      return res.status(404).json({ message: 'Reservation not found.' });
    }

    if (existing.userId !== req.user.id) {
      return res
        .status(403)
        .json({ message: 'You can only delete your own reservation.' });
    }

    await prisma.reservation.delete({ where: { id } });
    return res.json({ message: 'Reservation deleted successfully.' });
  } catch (err) {
    return res.status(500).json({ message: 'Server error.' });
  }
}
