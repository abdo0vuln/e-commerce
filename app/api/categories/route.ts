import { type NextRequest, NextResponse } from "next/server"
import clientPromise from "@/app/lib/mongodb"
import type { Category } from "@/app/lib/models/Product"

export async function GET(request: NextRequest) {
  try {
    const client = await clientPromise
    const db = client.db("algerianstyle")

    const categories = await db.collection<Category>("categories").find({}).toArray()

    return NextResponse.json(categories)
  } catch (error) {
    console.error("Error fetching categories:", error)
    return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const client = await clientPromise
    const db = client.db("algerianstyle")

    const body = await request.json()

    const category: Category = {
      ...body,
      slug: body.name.toLowerCase().replace(/\s+/g, "-"),
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await db.collection<Category>("categories").insertOne(category)

    return NextResponse.json(
      {
        message: "Category created successfully",
        categoryId: result.insertedId,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Error creating category:", error)
    return NextResponse.json({ error: "Failed to create category" }, { status: 500 })
  }
}
