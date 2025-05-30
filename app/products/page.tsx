"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import type { Product } from "@/app/lib/models/Product"

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const searchParams = useSearchParams()
  const category = searchParams.get("category")

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true)
      let url = "/api/products?limit=40"
      if (category) url += `&category=${encodeURIComponent(category)}`
      const res = await fetch(url)
      const data = await res.json()
      setProducts(data.products || [])
      setIsLoading(false)
    }
    fetchProducts()
  }, [category])

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold mb-8">{category ? `Category: ${category}` : "All Products"}</h1>
        {isLoading ? (
          <div className="text-center py-8">Loading products...</div>
        ) : products.length === 0 ? (
          <div className="text-center py-8">No products found.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <Card key={product._id?.toString()} className="group hover:shadow-lg transition-shadow">
                <img
                  src={product.images?.[0] || "/placeholder.svg"}
                  alt={product.name}
                  className="mx-auto h-40 w-40 object-cover rounded-lg"
                />
                {product.isNew && <Badge className="absolute top-2 left-2 bg-green-500">New</Badge>}
                <div className="mt-4 text-lg font-semibold text-gray-900">{product.name}</div>
                <div className="mt-2 flex items-center justify-center space-x-2">
                  <span className="text-lg font-bold text-blue-600">{product.price.toLocaleString()} DA</span>
                  {product.originalPrice && (
                    <span className="text-sm text-gray-400 line-through">{product.originalPrice.toLocaleString()} DA</span>
                  )}
                </div>
                <Link href={`/products/${product._id}`}>
                  <Button className="w-full mt-3">View Details</Button>
                </Link>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
} 