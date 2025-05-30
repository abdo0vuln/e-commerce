"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useCart } from "../contexts/CartContext"

export default function CheckoutPage() {
  const { cartItems, total, clearCart } = useCart()
  const router = useRouter()
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
    country: "Algeria",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    try {
      const order = {
        items: cartItems.map(item => ({
          productId: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          size: item.size,
          color: item.color,
          image: item.image,
        })),
        subtotal: total,
        shipping: total > 10000 ? 0 : 500,
        discount: 0, // You can add promo code logic here
        total: total > 10000 ? total : total + 500,
        shippingAddress: form,
      }
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(order),
      })
      if (!res.ok) throw new Error("Failed to place order")
      clearCart()
      router.push("/order-confirmation")
    } catch (err: any) {
      setError(err.message || "Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-xl mx-auto px-4">
        <Card>
          <CardHeader>
            <CardTitle>Checkout</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <Input name="name" placeholder="Full Name" value={form.name} onChange={handleChange} required />
              <Input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} required />
              <Input name="phone" placeholder="Phone Number" value={form.phone} onChange={handleChange} required />
              <Input name="address" placeholder="Address" value={form.address} onChange={handleChange} required />
              <Input name="city" placeholder="City" value={form.city} onChange={handleChange} required />
              <Input name="postalCode" placeholder="Postal Code" value={form.postalCode} onChange={handleChange} required />
              <Input name="country" placeholder="Country" value={form.country} onChange={handleChange} required />
              {error && <div className="text-red-600 text-sm">{error}</div>}
              <Button className="w-full" type="submit" disabled={loading}>
                {loading ? "Placing Order..." : "Place Order"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 