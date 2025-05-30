import type { NextRequest } from "next/server"
import jwt from "jsonwebtoken"

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"

export interface AuthUser {
  userId: string
  email: string
  role: "customer" | "admin"
}

export async function verifyAuth(request: NextRequest): Promise<AuthUser | null> {
  try {
    // Check for token in cookies
    const token = request.cookies.get("auth-token")?.value

    if (!token) {
      // Check for token in Authorization header
      const authHeader = request.headers.get("authorization")
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return null
      }
      const headerToken = authHeader.substring(7)

      const decoded = jwt.verify(headerToken, JWT_SECRET) as AuthUser
      return decoded
    }

    const decoded = jwt.verify(token, JWT_SECRET) as AuthUser
    return decoded
  } catch (error) {
    console.error("Auth verification error:", error)
    return null
  }
}
