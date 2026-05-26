import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

export function verifyToken(request, response, next) {
  try {
    const authHeader = request.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return response.status(401).json({ error: 'Missing or invalid token' });
    }

    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, JWT_SECRET);
    request.user = decoded;
    next();
  } catch (error) {
    console.error('Token verification failed:', error);
    response.status(401).json({ error: 'Invalid or expired token' });
  }
}

export function requireAuth(_request, _response, next) {
  next();
}
