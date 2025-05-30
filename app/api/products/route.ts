import { type NextRequest, NextResponse } from "next/server"
import clientPromise from "@/app/lib/mongodb"
import type { Product } from "@/app/lib/models/Product"

export async function GET(request: NextRequest) {
  try {
    const client = await clientPromise
    const db = client.db("algerianstyle")

    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category")
    const featured = searchParams.get("featured")
    const limit = Number.parseInt(searchParams.get("limit") || "20")
    const page = Number.parseInt(searchParams.get("page") || "1")
    const skip = (page - 1) * limit

    const query: any = {}

    if (category) {
      query.category = category
    }

    if (featured === "true") {
      query.isFeatured = true
    }

    const products = await db.collection<Product>("products").find(query).skip(skip).limit(limit).toArray()

    const total = await db.collection<Product>("products").countDocuments(query)

    return NextResponse.json({
      products,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Error fetching products:", error)
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const client = await clientPromise
    const db = client.db("algerianstyle")

    const body = await request.json()

    // Validate required fields
    if (!body.name || !body.price || !body.category) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const product: Product = {
      ...body,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await db.collection<Product>("products").insertOne(product)

    return NextResponse.json(
      {
        message: "Product created successfully",
        productId: result.insertedId,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Error creating product:", error)
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 })
  }
}
