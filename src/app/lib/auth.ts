import { NextRequest } from 'next/server'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET!

export interface DecodedToken {
  userId: string
  email: string
  iat: number
  exp: number
}

export async function verifyToken(request: NextRequest): Promise<DecodedToken | null> {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '') 
                 || request.cookies.get('auth-token')?.value

    if (!token) {
      return null
    }

    const decoded = jwt.verify(token, JWT_SECRET) as DecodedToken
    return decoded
  } catch (error) {
    return null
  }
}