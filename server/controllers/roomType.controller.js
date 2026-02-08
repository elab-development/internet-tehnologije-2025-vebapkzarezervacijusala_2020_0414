import { prisma } from '../prismaClient.js';

/**
 * @route   GET /api/room-types
 * @access  Public
 * @desc    Returns all room types.
 * @body    None
 * @query   None
 * @returns 200 { roomTypes: RoomType[] }
 *          500 { message }
 */
export async function getAllRoomTypes(req, res) {
  try {
    const roomTypes = await prisma.roomType.findMany({
      orderBy: { id: 'asc' },
    });

    return res.json({ roomTypes });
  } catch (err) {
    return res.status(500).json({ message: 'Server error.' });
  }
}

/**
 * @route   GET /api/room-types/:id
 * @access  Public
 * @desc    Returns one room type by id.
 * @params  {string} id
 * @returns 200 { roomType }
 *          400 { message }
 *          404 { message }
 *          500 { message }
 */
export async function getRoomTypeById(req, res) {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id)) {
      return res.status(400).json({ message: 'Invalid room type id.' });
    }

    const roomType = await prisma.roomType.findUnique({
      where: { id },
    });

    if (!roomType) {
      return res.status(404).json({ message: 'Room type not found.' });
    }

    return res.json({ roomType });
  } catch (err) {
    return res.status(500).json({ message: 'Server error.' });
  }
}

/**
 * @route   POST /api/room-types
 * @access  Private (ADMIN)
 * @desc    Creates a room type.
 * @body    {string} name
 *          {string} [description]
 * @returns 201 { roomType }
 *          400 { message }
 *          409 { message }
 *          500 { message }
 */
export async function createRoomType(req, res) {
  try {
    const { name, description } = req.body;

    if (!name || String(name).trim().length === 0) {
      return res.status(400).json({ message: 'Name is required.' });
    }

    const existing = await prisma.roomType.findUnique({
      where: { name: String(name).trim() },
    });

    if (existing) {
      return res
        .status(409)
        .json({ message: 'Room type with this name already exists.' });
    }

    const roomType = await prisma.roomType.create({
      data: {
        name: String(name).trim(),
        description: description ? String(description).trim() : null,
      },
    });

    return res.status(201).json({ roomType });
  } catch (err) {
    return res.status(500).json({ message: 'Server error.' });
  }
}

/**
 * @route   PUT /api/room-types/:id
 * @access  Private (ADMIN)
 * @desc    Updates room type.
 * @params  {string} id
 * @body    {string} [name]
 *          {string} [description]
 * @returns 200 { roomType }
 *          400, 404, 409, 500
 */
export async function updateRoomType(req, res) {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id)) {
      return res.status(400).json({ message: 'Invalid room type id.' });
    }

    const { name, description } = req.body;

    const existing = await prisma.roomType.findUnique({
      where: { id },
    });

    if (!existing) {
      return res.status(404).json({ message: 'Room type not found.' });
    }

    if (name) {
      const duplicate = await prisma.roomType.findUnique({
        where: { name: String(name).trim() },
      });

      if (duplicate && duplicate.id !== id) {
        return res
          .status(409)
          .json({ message: 'Room type with this name already exists.' });
      }
    }

    const roomType = await prisma.roomType.update({
      where: { id },
      data: {
        ...(name !== undefined ? { name: String(name).trim() } : {}),
        ...(description !== undefined
          ? { description: description ? String(description).trim() : null }
          : {}),
      },
    });

    return res.json({ roomType });
  } catch (err) {
    return res.status(500).json({ message: 'Server error.' });
  }
}

/**
 * @route   DELETE /api/room-types/:id
 * @access  Private (ADMIN)
 * @desc    Deletes room type.
 * @params  {string} id
 * @returns 200 { message }
 *          400, 404, 500
 */
export async function deleteRoomType(req, res) {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id)) {
      return res.status(400).json({ message: 'Invalid room type id.' });
    }

    const existing = await prisma.roomType.findUnique({
      where: { id },
    });

    if (!existing) {
      return res.status(404).json({ message: 'Room type not found.' });
    }

    await prisma.roomType.delete({
      where: { id },
    });

    return res.json({ message: 'Room type deleted successfully.' });
  } catch (err) {
    return res.status(500).json({ message: 'Server error.' });
  }
}
