import { prisma } from '../prismaClient.js';
import { verifyToken } from '../utils/jwt.js';

export async function requireAuth(req, res, next) {
  try {
    const cookieName = process.env.COOKIE_NAME || 'conference_book_cookie';
    const token = req.cookies?.[cookieName];

    if (!token) {
      return res.status(401).json({ message: 'Not authenticated.' });
    }

    const decoded = verifyToken(token);
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        fullName: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    if (!user) {
      return res.status(401).json({ message: 'Account does not exist.' });
    }

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid session.' });
  }
}

export function requireRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user)
      return res.status(401).json({ message: 'Not authenticated.' });

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Forbidden.' });
    }

    next();
  };
}
