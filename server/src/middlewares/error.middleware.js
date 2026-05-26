export function errorHandler(error, request, response, next) {
  console.error('Error:', error);

  // Prisma errors
  if (error.code === 'P2025') {
    return response.status(404).json({ error: 'Resource not found' });
  }
  if (error.code === 'P2002') {
    return response.status(409).json({ error: 'Unique constraint failed' });
  }
  if (error.code === 'P2003') {
    return response.status(400).json({ error: 'Foreign key constraint failed' });
  }

  // JWT errors
  if (error.name === 'JsonWebTokenError') {
    return response.status(401).json({ error: 'Invalid token' });
  }
  if (error.name === 'TokenExpiredError') {
    return response.status(401).json({ error: 'Token expired' });
  }

  // Validation errors
  if (error instanceof SyntaxError && 'body' in error) {
    return response.status(400).json({ error: 'Invalid JSON in request body' });
  }

  // Default error
  const statusCode = error.statusCode || 500;
  const message = error.message || 'Internal server error';

  response.status(statusCode).json({
    error: message,
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack }),
  });
}
