"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import type { Order } from "@/app/lib/models/Order"

export default function AdminOrderDetailPage() {
  const { id } = useParams<{ id: string }>()
  const [order, setOrder] = useState<Order | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await fetch(`/api/orders/${id}`)
        const data = await res.json()
        setOrder(data.order || null)
      } catch (err) {
        setOrder(null)
      } finally {
        setIsLoading(false)
      }
    }
    if (id) fetchOrder()
  }, [id])

  if (isLoading) return <div className="p-8 text-center">Loading order...</div>
  if (!order) return <div className="p-8 text-center text-red-600">Order not found.</div>

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Order #{order.orderNumber}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <h3 className="font-semibold mb-2">Customer Info</h3>
            <div>Name: {order.shippingAddress?.name}</div>
            <div>Phone: {order.shippingAddress?.phone}</div>
            <div>Address: {order.shippingAddress?.street}, {order.shippingAddress?.city}, {order.shippingAddress?.country}</div>
          </div>
          <div className="mb-6">
            <h3 className="font-semibold mb-2">Order Status</h3>
            <Badge>{order.status}</Badge>
            <span className="ml-4">Payment: {order.paymentStatus}</span>
            <div className="mt-2 text-sm text-gray-500">Placed on: {order.createdAt ? new Date(order.createdAt).toLocaleString() : '-'}</div>
          </div>
          <div className="mb-6">
            <h3 className="font-semibold mb-2">Items</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Qty</TableHead>
                  <TableHead>Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {order.items.map((item, idx) => (
                  <TableRow key={idx}>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>{item.price.toLocaleString()} DA</TableCell>
                    <TableCell>{item.quantity}</TableCell>
                    <TableCell>{(item.price * item.quantity).toLocaleString()} DA</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <div className="mb-2">Subtotal: {order.subtotal.toLocaleString()} DA</div>
          <div className="mb-2">Shipping: {order.shipping.toLocaleString()} DA</div>
          <div className="mb-2">Discount: {order.discount.toLocaleString()} DA</div>
          <div className="font-bold text-lg">Total: {order.total.toLocaleString()} DA</div>
        </CardContent>
      </Card>
    </div>
  )
} 