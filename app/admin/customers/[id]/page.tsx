"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

interface User {
  _id: string
  name: string
  email: string
  role: string
}

interface Order {
  _id: string
  orderNumber: string
  total: number
  status: string
  createdAt?: string
}

export default function AdminCustomerDetailPage() {
  const { id } = useParams<{ id: string }>()
  const [user, setUser] = useState<User | null>(null)
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchUserAndOrders = async () => {
      try {
        const userRes = await fetch(`/api/users/${id}`)
        const userData = await userRes.json()
        setUser(userData.user || null)
        const ordersRes = await fetch(`/api/orders?userId=${id}`)
        const ordersData = await ordersRes.json()
        setOrders(ordersData.orders || [])
      } catch (err) {
        setUser(null)
        setOrders([])
      } finally {
        setIsLoading(false)
      }
    }
    if (id) fetchUserAndOrders()
  }, [id])

  if (isLoading) return <div className="p-8 text-center">Loading customer...</div>
  if (!user) return <div className="p-8 text-center text-red-600">Customer not found.</div>

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Customer: {user.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <h3 className="font-semibold mb-2">User Info</h3>
            <div>Name: {user.name}</div>
            <div>Email: {user.email}</div>
            <div>Role: <Badge>{user.role}</Badge></div>
          </div>
          <div className="mb-6">
            <h3 className="font-semibold mb-2">Orders</h3>
            {orders.length === 0 ? (
              <div className="text-gray-500">No orders found for this customer.</div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order #</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.map((order) => (
                    <TableRow key={order._id}>
                      <TableCell>{order.orderNumber}</TableCell>
                      <TableCell>{order.total.toLocaleString()} DA</TableCell>
                      <TableCell><Badge>{order.status}</Badge></TableCell>
                      <TableCell>{order.createdAt ? new Date(order.createdAt).toLocaleDateString() : '-'}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 