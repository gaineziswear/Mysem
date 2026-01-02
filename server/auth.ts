// server/auth.ts - Authentication System for SEMDEX

import { z } from 'zod';
import jwt from 'jsonwebtoken';
import { db } from './db';
import { users, auditLogs } from '../drizzle/schema';
import { eq, or } from 'drizzle-orm';

const JWT_SECRET = process.env.JWT_SECRET || 'semdex-secret-key-2026';
const JWT_EXPIRY = '30d'; // 30 days

// Hardcoded user credentials
const VALID_USERS = [
  {
    email: 'pbernardproxy@gmail.com',
    phone: '+230 54557219',
    fullName: 'Patrick Ian Bernard',
  },
  {
    email: 'audrey.l.brutus@gmail.com',
    phone: '+230 54951814',
    fullName: 'Marie Audrey Laura Brutus',
  },
];

// Login input schema
export const loginSchema = z.object({
  identifier: z.string().min(1), // Email or phone
  method: z.enum(['email', 'phone', 'magic-link', 'local']),
  deviceInfo: z.string().optional(),
});

// Generate JWT token
export function generateToken(userId: number, email: string): string {
  return jwt.sign(
    { userId, email, platform: 'SEMDEX' },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRY }
  );
}

// Verify JWT token
export function verifyToken(token: string): { userId: number; email: string } | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    return { userId: decoded.userId, email: decoded.email };
  } catch {
    return null;
  }
}

// Validate user credentials
export async function validateUser(identifier: string): Promise<typeof users.$inferSelect | null> {
  // Check if identifier matches hardcoded users
  const isValid = VALID_USERS.some(
    (u) => u.email === identifier || u.phone === identifier
  );

  if (!isValid) {
    return null;
  }

  // Fetch user from database
  const [user] = await db
    .select()
    .from(users)
    .where(
      or(
        eq(users.email, identifier),
        eq(users.phone, identifier)
      )
    )
    .limit(1);

  return user || null;
}

// Login procedure
export async function login(input: z.infer<typeof loginSchema>, ipAddress?: string) {
  const { identifier, method, deviceInfo } = input;

  // Validate user
  const user = await validateUser(identifier);
  
  if (!user) {
    throw new Error('Invalid credentials. Only authorized users can access SEMDEX.');
  }

  // Update last login
  await db
    .update(users)
    .set({ lastLogin: new Date() })
    .where(eq(users.id, user.id));

  // Log authentication
  await db.insert(auditLogs).values({
    userId: user.id,
    action: 'LOGIN',
    module: 'AUTH',
    details: `User logged in via ${method}`,
    ipAddress,
    userAgent: deviceInfo,
  });

  // Generate token
  const token = generateToken(user.id, user.email);

  return {
    success: true,
    token,
    user: {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      sharesOwned: user.sharesOwned,
    },
  };
}

// Logout procedure
export async function logout(userId: number, ipAddress?: string) {
  // Log logout
  await db.insert(auditLogs).values({
    userId,
    action: 'LOGOUT',
    module: 'AUTH',
    details: 'User logged out',
    ipAddress,
  });

  return { success: true };
}

// Get current user
export async function getCurrentUser(token: string) {
  const decoded = verifyToken(token);
  
  if (!decoded) {
    return null;
  }

  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.id, decoded.userId))
    .limit(1);

  return user || null;
}

// Magic link generation (email-based)
export async function generateMagicLink(email: string): Promise<string> {
  const user = await validateUser(email);
  
  if (!user) {
    throw new Error('Invalid email address');
  }

  const token = generateToken(user.id, user.email);
  const magicLink = `semdex://auth/magic?token=${token}`;
  
  // In production, send this via email
  console.log(`Magic link for ${email}: ${magicLink}`);
  
  return magicLink;
}

// Local device access (biometric/PIN)
export async function localDeviceLogin(deviceId: string): Promise<any> {
  // Check if device is registered
  const storedUserId = localStorage.getItem(`semdex_device_${deviceId}`);
  
  if (!storedUserId) {
    throw new Error('Device not registered');
  }

  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.id, parseInt(storedUserId)))
    .limit(1);

  if (!user) {
    throw new Error('User not found');
  }

  const token = generateToken(user.id, user.email);
  
  return {
    success: true,
    token,
    user: {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      sharesOwned: user.sharesOwned,
    },
  };
}
