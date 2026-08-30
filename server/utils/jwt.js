import jwt from 'jsonwebtoken';

export function signToken(payload) {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
}

export function verifyToken(token) {
  return jwt.verify(token, process.env.JWT_SECRET);
}

export function setAuthCookie(res, token) {
  const cookieName = process.env.COOKIE_NAME || 'conference_book_cookie';

  res.cookie(cookieName, token, {
    httpOnly: true,
    secure: String(process.env.COOKIE_SECURE).toLowerCase() === 'true',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
}

export function clearAuthCookie(res) {
  const cookieName = process.env.COOKIE_NAME || 'conference_book_cookie';
  res.clearCookie(cookieName, {
    httpOnly: true,
    secure: String(process.env.COOKIE_SECURE).toLowerCase() === 'true',
    sameSite: 'lax',
  });
}
