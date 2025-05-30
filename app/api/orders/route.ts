import { type NextRequest, NextResponse } from "next/server"
import clientPromise from "@/app/lib/mongodb"
import type { Order } from "@/app/lib/models/Order"
import { verifyAuth } from "@/app/lib/auth"

export async function GET(request: NextRequest) {
  try {
    const user = await verifyAuth(request)
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const client = await clientPromise
    const db = client.db("algerianstyle")

    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status")
    const limit = Number.parseInt(searchParams.get("limit") || "20")
    const page = Number.parseInt(searchParams.get("page") || "1")
    const skip = (page - 1) * limit

    const query: any = {}

    // If not admin, only show user's own orders
    if (user.role !== "admin") {
      query.userId = user.userId
    }

    if (status) {
      query.status = status
    }

    const orders = await db
      .collection<Order>("orders")
      .find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .toArray()

    const total = await db.collection<Order>("orders").countDocuments(query)

    return NextResponse.json({
      orders,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Error fetching orders:", error)
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await verifyAuth(request)
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const client = await clientPromise
    const db = client.db("algerianstyle")

    const body = await request.json()

    // Generate order number
    const orderCount = await db.collection<Order>("orders").countDocuments()
    const orderNumber = `ORD-${String(orderCount + 1).padStart(6, "0")}`

    const order: Order = {
      ...body,
      userId: user.userId,
      orderNumber,
      status: "pending",
      paymentStatus: "pending",
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await db.collection<Order>("orders").insertOne(order)

    // Update product stock
    for (const item of order.items) {
      await db.collection("products").updateOne({ _id: item.productId }, { $inc: { stock: -item.quantity } })
    }

    return NextResponse.json(
      {
        message: "Order created successfully",
        orderId: result.insertedId,
        orderNumber,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Error creating order:", error)
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 })
  }
}
