import bcrypt from 'bcryptjs';
import { prisma } from '../prismaClient.js';
import { signToken, setAuthCookie, clearAuthCookie } from '../utils/jwt.js';
import { isValidEmail } from '../utils/helpers.js';

/**
 * @route   POST /api/auth/register
 * @access  Public
 * @desc    Registers a new user account and sets a JWT httpOnly cookie on success.
 * @body    {string} fullName - User's full name
 *          {string} email - User's email (must be valid, unique)
 *          {string} password - Plain password (min 6 chars)
 * @query   None
 * @returns 201 { user: { id, fullName, email, role, createdAt } }
 *          400 { message } - Validation error
 *          409 { message } - Email already exists
 *          500 { message } - Server error
 */
export async function register(req, res) {
  try {
    const { fullName, email, password } = req.body;

    if (!fullName || !email || !password) {
      return res.status(400).json({ message: 'All fields are required.' });
    }
    if (!isValidEmail(email)) {
      return res.status(400).json({ message: 'Email is not valid.' });
    }
    if (String(password).length < 6) {
      return res
        .status(400)
        .json({ message: 'Password must be at least 6 characters long.' });
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return res
        .status(409)
        .json({ message: 'A user with this email already exists.' });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: { fullName, email, passwordHash },
      select: {
        id: true,
        fullName: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    const token = signToken({ userId: user.id, role: user.role });
    setAuthCookie(res, token);

    return res.status(201).json({ user });
  } catch (err) {
    return res.status(500).json({ message: 'Server error.' });
  }
}

/**
 * @route   POST /api/auth/login
 * @access  Public
 * @desc    Logs in a user and sets a JWT httpOnly cookie on success.
 * @body    {string} email - User's email
 *          {string} password - Plain password
 * @query   None
 * @returns 200 { user: { id, fullName, email, role, createdAt } }
 *          400 { message } - Missing credentials
 *          401 { message } - Invalid credentials
 *          500 { message } - Server error
 */
export async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: 'Email and password are required.' });
    }

    const userRecord = await prisma.user.findUnique({ where: { email } });
    if (!userRecord) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const ok = await bcrypt.compare(password, userRecord.passwordHash);
    if (!ok) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const safeUser = {
      id: userRecord.id,
      fullName: userRecord.fullName,
      email: userRecord.email,
      role: userRecord.role,
      createdAt: userRecord.createdAt,
    };

    const token = signToken({ userId: userRecord.id, role: userRecord.role });
    setAuthCookie(res, token);

    return res.json({ user: safeUser });
  } catch (err) {
    return res.status(500).json({ message: 'Server error.' });
  }
}

/**
 * @route   POST /api/auth/logout
 * @access  Public (works even if already logged out)
 * @desc    Logs out the user by clearing the auth cookie.
 * @body    None
 * @query   None
 * @returns 200 { message }
 */
export async function logout(req, res) {
  clearAuthCookie(res);
  return res.json({ message: 'Successfully logged out.' });
}

/**
 * @route   GET /api/auth/me
 * @access  Private (requires auth cookie)
 * @desc    Returns the currently authenticated user's profile.
 * @body    None
 * @query   None
 * @middleware requireAuth (sets req.user)
 * @returns 200 { user }
 */
export async function me(req, res) {
  return res.json({ user: req.user });
}
