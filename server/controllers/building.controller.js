import { prisma } from '../prismaClient.js';

/**
 * @route   GET /api/buildings
 * @access  Public
 * @desc    Returns all buildings.
 * @body    None
 * @query   None
 * @returns 200 { buildings: Building[] }
 *          500 { message } - Server error
 */
export async function getAllBuildings(req, res) {
  try {
    const buildings = await prisma.building.findMany({
      orderBy: { id: 'asc' },
    });
    return res.json({ buildings });
  } catch (err) {
    return res.status(500).json({ message: 'Server error.' });
  }
}

/**
 * @route   GET /api/buildings/:id
 * @access  Public
 * @desc    Returns a single building by id.
 * @body    None
 * @query   None
 * @params  {string} id - Building id
 * @returns 200 { building }
 *          400 { message } - Invalid id
 *          404 { message } - Building not found
 *          500 { message } - Server error
 */
export async function getBuildingById(req, res) {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id)) {
      return res.status(400).json({ message: 'Invalid building id.' });
    }

    const building = await prisma.building.findUnique({
      where: { id },
    });

    if (!building) {
      return res.status(404).json({ message: 'Building not found.' });
    }

    return res.json({ building });
  } catch (err) {
    return res.status(500).json({ message: 'Server error.' });
  }
}

/**
 * @route   POST /api/buildings
 * @access  Private (ADMIN)
 * @desc    Creates a new building.
 * @body    {string} name - Building name
 *          {string} address - Building address
 *          {string} [description] - Optional description
 * @query   None
 * @returns 201 { building }
 *          400 { message } - Validation error
 *          500 { message } - Server error
 */
export async function createBuilding(req, res) {
  try {
    const { name, address, description } = req.body;

    if (!name || !address) {
      return res
        .status(400)
        .json({ message: 'Name and address are required.' });
    }

    const building = await prisma.building.create({
      data: {
        name: String(name).trim(),
        address: String(address).trim(),
        description: description ? String(description).trim() : null,
      },
    });

    return res.status(201).json({ building });
  } catch (err) {
    return res.status(500).json({ message: 'Server error.' });
  }
}

/**
 * @route   PUT /api/buildings/:id
 * @access  Private (ADMIN)
 * @desc    Updates an existing building by id.
 * @body    {string} [name] - Building name
 *          {string} [address] - Building address
 *          {string} [description] - Building description
 * @query   None
 * @params  {string} id - Building id
 * @returns 200 { building }
 *          400 { message } - Validation error
 *          404 { message } - Not found
 *          500 { message } - Server error
 */
export async function updateBuilding(req, res) {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) {
      return res.status(400).json({ message: 'Invalid building id.' });
    }

    const { name, address, description } = req.body;

    if (name !== undefined && String(name).trim().length === 0) {
      return res.status(400).json({ message: 'Name cannot be empty.' });
    }
    if (address !== undefined && String(address).trim().length === 0) {
      return res.status(400).json({ message: 'Address cannot be empty.' });
    }

    const existing = await prisma.building.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ message: 'Building not found.' });
    }

    const building = await prisma.building.update({
      where: { id },
      data: {
        ...(name !== undefined ? { name: String(name).trim() } : {}),
        ...(address !== undefined ? { address: String(address).trim() } : {}),
        ...(description !== undefined
          ? { description: description ? String(description).trim() : null }
          : {}),
      },
    });

    return res.json({ building });
  } catch (err) {
    return res.status(500).json({ message: 'Server error.' });
  }
}

/**
 * @route   DELETE /api/buildings/:id
 * @access  Private (ADMIN)
 * @desc    Deletes a building by id.
 * @body    None
 * @query   None
 * @params  {string} id - Building id
 * @returns 200 { message }
 *          400 { message } - Invalid id
 *          404 { message } - Not found
 *          500 { message } - Server error
 */
export async function deleteBuilding(req, res) {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) {
      return res.status(400).json({ message: 'Invalid building id.' });
    }

    const existing = await prisma.building.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ message: 'Building not found.' });
    }

    await prisma.building.delete({ where: { id } });
    return res.json({ message: 'Building deleted successfully.' });
  } catch (err) {
    return res.status(500).json({ message: 'Server error.' });
  }
}
