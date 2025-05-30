"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"

export default function OrderConfirmationPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const orderId = searchParams.get("orderId")

  const [orderNumber, setOrderNumber] = useState<string | null>(null)

  useEffect(() => {
    // Optionally, get order number from localStorage/sessionStorage if you store it after checkout
    const storedOrderNumber = window.sessionStorage.getItem("orderNumber")
    if (storedOrderNumber) setOrderNumber(storedOrderNumber)
  }, [])

  // In a real application, you would fetch order details here using the orderId
  // useEffect(() => {
  //   if (orderId) {
  //     // Fetch order details
  //   }
  // }, [orderId])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center text-green-600">
            Order Placed Successfully!
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <p className="mb-4">Thank you for your order.</p>
          {orderId && (
            <p className="mb-4">
              Your order number is:{" "}
              <strong>{orderId}</strong>
            </p>
          )}
          <p className="mb-6">
            You will receive an email confirmation shortly.
          </p>
          <Link href="/">
            <Button>Continue Shopping</Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  )
}