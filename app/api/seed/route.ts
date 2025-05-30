import { type NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import clientPromise from "@/app/lib/mongodb"
import type { Product } from "@/app/lib/models/Product"
import type { User } from "@/app/lib/models/User"
import type { Category } from "@/app/lib/models/Product"

// This is a development-only route to seed the database
export async function POST(request: NextRequest) {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "This route is only available in development" }, { status: 403 })
  }

  try {
    const client = await clientPromise
    const db = client.db("algerianstyle")

    // Clear existing data
    await db.collection("products").deleteMany({})
    await db.collection("users").deleteMany({})
    await db.collection("categories").deleteMany({})
    await db.collection("orders").deleteMany({})

    // Seed categories
    const categories: Category[] = [
      {
        name: "Traditional",
        slug: "traditional",
        description: "Traditional Algerian clothing",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Modern",
        slug: "modern",
        description: "Modern fashion with Algerian touch",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Hijab",
        slug: "hijab",
        description: "Hijab and modest wear collection",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Abaya",
        slug: "abaya",
        description: "Elegant abaya collection",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]

    await db.collection<Category>("categories").insertMany(categories)

    // Seed products
    const products: Product[] = [
      {
        name: "Traditional Algerian Kaftan",
        description: "Elegant traditional kaftan with intricate embroidery",
        price: 15000,
        originalPrice: 18000,
        category: "Traditional",
        images: ["/placeholder.svg?height=400&width=300"],
        sizes: ["S", "M", "L", "XL"],
        colors: ["Blue", "Green", "Purple"],
        stock: 25,
        sku: "KAF001",
        rating: 4.8,
        reviews: 124,
        isNew: true,
        isFeatured: true,
        tags: ["traditional", "kaftan", "embroidery"],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Modern Hijab Collection",
        description: "Stylish and comfortable hijab set",
        price: 2500,
        originalPrice: 3000,
        category: "Hijab",
        images: ["/placeholder.svg?height=400&width=300"],
        sizes: ["One Size"],
        colors: ["Black", "Navy", "Beige", "Maroon"],
        stock: 50,
        sku: "HIJ001",
        rating: 4.9,
        reviews: 89,
        isNew: false,
        isFeatured: true,
        tags: ["hijab", "modern", "comfortable"],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "a",
        description: "Premium quality abaya with modern design",
        price: 12000,
        originalPrice: 14000,
        category: "Abaya",
        images: ["/placeholder.svg?height=400&width=300"],
        sizes: ["S", "M", "L", "XL", "XXL"],
        colors: ["Black", "Navy", "Grey"],
        stock: 30,
        sku: "ABA001",
        rating: 4.7,
        reviews: 156,
        isNew: true,
        isFeatured: true,
        tags: ["abaya", "elegant", "premium"],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Casual Tunic",
        description: "Comfortable everyday tunic",
        price: 4500,
        originalPrice: 5500,
        category: "Modern",
        images: ["/placeholder.svg?height=400&width=300"],
        sizes: ["S", "M", "L", "XL"],
        colors: ["White", "Pink", "Blue", "Green"],
        stock: 40,
        sku: "TUN001",
        rating: 4.6,
        reviews: 78,
        isNew: false,
        isFeatured: false,
        tags: ["tunic", "casual", "comfortable"],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]

    await db.collection<Product>("products").insertMany(products)

    // Seed users
    const hashedAdminPassword = await bcrypt.hash("admin123", 10)
    const hashedCustomerPassword = await bcrypt.hash("customer123", 10)

    const users: User[] = [
      {
        name: "Admin User",
        email: "admin@algerianstyle.com",
        password: hashedAdminPassword,
        role: "admin",
        wishlist: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Test Customer",
        email: "customer@example.com",
        password: hashedCustomerPassword,
        role: "customer",
        wishlist: [],
        address: {
          street: "123 Main St",
          city: "Algiers",
          state: "Algiers",
          postalCode: "16000",
          country: "Algeria",
        },
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]

    await db.collection<User>("users").insertMany(users)

    return NextResponse.json({
      message: "Database seeded successfully",
      data: {
        categories: categories.length,
        products: products.length,
        users: users.length,
      },
    })
  } catch (error) {
    console.error("Error seeding database:", error)
    return NextResponse.json({ error: "Failed to seed database" }, { status: 500 })
  }
}
