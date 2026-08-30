import { prisma } from '../prismaClient.js';

/**
 * @route   GET /api/rooms?buildingId=1&roomTypeId=2&minCapacity=10
 * @access  Public
 * @desc    Returns rooms with optional filters (extensible).
 * @query   {string} [buildingId]
 *          {string} [roomTypeId]
 *          {string} [minCapacity]
 *          {string} [maxCapacity]
 * @returns 200 { rooms: Room[] }
 *          400 { message }
 *          500 { message }
 */
export async function getAllRooms(req, res) {
  try {
    const { buildingId, roomTypeId, minCapacity, maxCapacity } = req.query;

    const where = {};

    // buildingId filter
    if (buildingId !== undefined) {
      const id = Number(buildingId);
      if (!Number.isInteger(id)) {
        return res
          .status(400)
          .json({ message: 'buildingId must be a number.' });
      }
      where.buildingId = id;
    }

    // roomTypeId filter
    if (roomTypeId !== undefined) {
      const id = Number(roomTypeId);
      if (!Number.isInteger(id)) {
        return res
          .status(400)
          .json({ message: 'roomTypeId must be a number.' });
      }
      where.roomTypeId = id;
    }

    // capacity filters
    if (minCapacity !== undefined || maxCapacity !== undefined) {
      where.capacity = {};
      if (minCapacity !== undefined) {
        const v = Number(minCapacity);
        if (!Number.isInteger(v)) {
          return res
            .status(400)
            .json({ message: 'minCapacity must be a number.' });
        }
        where.capacity.gte = v;
      }
      if (maxCapacity !== undefined) {
        const v = Number(maxCapacity);
        if (!Number.isInteger(v)) {
          return res
            .status(400)
            .json({ message: 'maxCapacity must be a number.' });
        }
        where.capacity.lte = v;
      }
    }

    const rooms = await prisma.room.findMany({
      where,
      include: { building: true, roomType: true },
      orderBy: { id: 'asc' },
    });

    return res.json({ rooms });
  } catch {
    return res.status(500).json({ message: 'Server error.' });
  }
}

/**
 * @route   GET /api/rooms/:id
 * @access  Public
 * @desc    Returns a single room.
 */
export async function getRoomById(req, res) {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id)) {
      return res.status(400).json({ message: 'Invalid room id.' });
    }

    const room = await prisma.room.findUnique({
      where: { id },
      include: {
        building: true,
        roomType: true,
      },
    });

    if (!room) {
      return res.status(404).json({ message: 'Room not found.' });
    }

    return res.json({ room });
  } catch {
    return res.status(500).json({ message: 'Server error.' });
  }
}

/**
 * @route   POST /api/rooms
 * @access  Private (ADMIN)
 * @desc    Creates a room.
 */
export async function createRoom(req, res) {
  try {
    const {
      name,
      capacity,
      buildingId,
      roomTypeId,
      workingHoursStart,
      workingHoursEnd,
    } = req.body;

    if (
      !name ||
      !capacity ||
      !buildingId ||
      !roomTypeId ||
      !workingHoursStart ||
      !workingHoursEnd
    ) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    const building = await prisma.building.findUnique({
      where: { id: Number(buildingId) },
    });

    if (!building) {
      return res.status(404).json({ message: 'Building not found.' });
    }

    const roomType = await prisma.roomType.findUnique({
      where: { id: Number(roomTypeId) },
    });

    if (!roomType) {
      return res.status(404).json({ message: 'Room type not found.' });
    }

    const room = await prisma.room.create({
      data: {
        name: String(name).trim(),
        capacity: Number(capacity),
        buildingId: Number(buildingId),
        roomTypeId: Number(roomTypeId),
        workingHoursStart: new Date(workingHoursStart),
        workingHoursEnd: new Date(workingHoursEnd),
      },
      include: {
        building: true,
        roomType: true,
      },
    });

    return res.status(201).json({ room });
  } catch {
    return res.status(500).json({ message: 'Server error.' });
  }
}

/**
 * @route   PUT /api/rooms/:id
 * @access  Private (ADMIN)
 * @desc    Updates a room.
 */
export async function updateRoom(req, res) {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id)) {
      return res.status(400).json({ message: 'Invalid room id.' });
    }

    const existing = await prisma.room.findUnique({ where: { id } });

    if (!existing) {
      return res.status(404).json({ message: 'Room not found.' });
    }

    const {
      name,
      capacity,
      buildingId,
      roomTypeId,
      workingHoursStart,
      workingHoursEnd,
    } = req.body;

    const room = await prisma.room.update({
      where: { id },
      data: {
        ...(name && { name: String(name).trim() }),
        ...(capacity && { capacity: Number(capacity) }),
        ...(buildingId && { buildingId: Number(buildingId) }),
        ...(roomTypeId && { roomTypeId: Number(roomTypeId) }),
        ...(workingHoursStart && {
          workingHoursStart: new Date(workingHoursStart),
        }),
        ...(workingHoursEnd && {
          workingHoursEnd: new Date(workingHoursEnd),
        }),
      },
      include: {
        building: true,
        roomType: true,
      },
    });

    return res.json({ room });
  } catch {
    return res.status(500).json({ message: 'Server error.' });
  }
}

/**
 * @route   DELETE /api/rooms/:id
 * @access  Private (ADMIN)
 * @desc    Deletes a room.
 */
export async function deleteRoom(req, res) {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id)) {
      return res.status(400).json({ message: 'Invalid room id.' });
    }

    const existing = await prisma.room.findUnique({ where: { id } });

    if (!existing) {
      return res.status(404).json({ message: 'Room not found.' });
    }

    await prisma.room.delete({ where: { id } });

    return res.json({ message: 'Room deleted successfully.' });
  } catch {
    return res.status(500).json({ message: 'Server error.' });
  }
}
