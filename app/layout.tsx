import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { CartProvider } from "./contexts/CartContext"
import { AuthProvider } from "./contexts/AuthContext"
import Navbar from "@/components/Navbar"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "AlgerianStyle - Authentic Algerian Fashion",
  description:
    "Discover authentic Algerian fashion with traditional and modern clothing for women. Shop kaftans, hijabs, abayas, and more.",
  keywords: "Algerian fashion, traditional clothing, hijab, abaya, kaftan, women fashion, Algeria",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <CartProvider>
            <Navbar />
            {children}
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
