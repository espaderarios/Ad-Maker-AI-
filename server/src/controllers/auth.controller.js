import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../config/db.js';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

export async function login(request, response) {
  try {
    const { email, password } = request.body;

    if (!email || !password) {
      return response.status(400).json({ error: 'Email and password required' });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return response.status(401).json({ error: 'Invalid credentials' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return response.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });

    response.json({ token, user: { id: user.id, email: user.email, name: user.name } });
  } catch (error) {
    console.error('Login error:', error);
    response.status(500).json({ error: 'Internal server error' });
  }
}

export async function signup(request, response) {
  try {
    const { email, password, name } = request.body;

    if (!email || !password) {
      return response.status(400).json({ error: 'Email and password required' });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return response.status(409).json({ error: 'Email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: { email, password: hashedPassword, name },
    });

    const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });

    response.status(201).json({ token, user: { id: user.id, email: user.email, name: user.name } });
  } catch (error) {
    console.error('Signup error:', error);
    response.status(500).json({ error: 'Internal server error' });
  }
}

// --- Password reset and email verification helpers ---
export async function forgotPassword(request, response) {
  try {
    const { email } = request.body;
    if (!email) return response.status(400).json({ error: 'Email required' });

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return response.status(404).json({ error: 'User not found' });

    const token = jwt.sign({ userId: user.id, type: 'reset' }, JWT_SECRET, { expiresIn: '1h' });

    // In production send email. For now return the link so caller can copy it.
    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password?token=${token}`;
    console.log('Password reset link (dev):', resetUrl);
    return response.json({ resetUrl });
  } catch (error) {
    console.error('Forgot password error:', error);
    response.status(500).json({ error: 'Internal server error' });
  }
}

export async function resetPassword(request, response) {
  try {
    const { token, password } = request.body;
    if (!token || !password) return response.status(400).json({ error: 'Token and new password required' });

    let payload;
    try {
      payload = jwt.verify(token, JWT_SECRET);
    } catch (err) {
      return response.status(400).json({ error: 'Invalid or expired token' });
    }

    if (payload.type !== 'reset') return response.status(400).json({ error: 'Invalid token type' });

    const hashed = await bcrypt.hash(password, 10);
    const user = await prisma.user.update({ where: { id: payload.userId }, data: { password: hashed } });
    return response.json({ message: 'Password updated' });
  } catch (error) {
    console.error('Reset password error:', error);
    response.status(500).json({ error: 'Internal server error' });
  }
}

export async function sendVerification(request, response) {
  try {
    const { email } = request.body;
    if (!email) return response.status(400).json({ error: 'Email required' });

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return response.status(404).json({ error: 'User not found' });

    const token = jwt.sign({ userId: user.id, type: 'verify' }, JWT_SECRET, { expiresIn: '7d' });
    const verifyUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/verify-email?token=${token}`;
    console.log('Email verification link (dev):', verifyUrl);
    return response.json({ verifyUrl });
  } catch (error) {
    console.error('Send verification error:', error);
    response.status(500).json({ error: 'Internal server error' });
  }
}

export async function verifyEmail(request, response) {
  try {
    const { token } = request.body;
    if (!token) return response.status(400).json({ error: 'Token required' });

    let payload;
    try {
      payload = jwt.verify(token, JWT_SECRET);
    } catch (err) {
      return response.status(400).json({ error: 'Invalid or expired token' });
    }

    if (payload.type !== 'verify') return response.status(400).json({ error: 'Invalid token type' });

    // Note: schema has no emailVerified field yet. Consider adding it to Prisma schema and regenerating client.
    // For now just return success so frontend can proceed.
    return response.json({ message: 'Email verified (client-side flag only until schema updated)' });
  } catch (error) {
    console.error('Verify email error:', error);
    response.status(500).json({ error: 'Internal server error' });
  }
}
