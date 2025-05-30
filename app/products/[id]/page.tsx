"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useCart } from "@/app/contexts/CartContext"
import type { Product } from "@/app/lib/models/Product"

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>()
  const [product, setProduct] = useState<Product | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const { addToCart } = useCart()

  useEffect(() => {
    const fetchProduct = async () => {
      setIsLoading(true)
      const res = await fetch(`/api/products/${id}`)
      const data = await res.json()
      setProduct(data || null)
      setIsLoading(false)
    }
    if (id) fetchProduct()
  }, [id])

  const handleAddToCart = () => {
    if (product) {
      const cartItem = {
        id: typeof product._id === 'string' ? parseInt(product._id, 36) : Number(product._id),
        name: product.name,
        price: product.price,
        image: product.images?.[0] || '',
        quantity: 1,
      }
      addToCart(cartItem)
    }
  }

  const handleBuyNow = () => {
    if (product) {
      const cartItem = {
        id: typeof product._id === 'string' ? parseInt(product._id, 36) : Number(product._id),
        name: product.name,
        price: product.price,
        image: product.images?.[0] || '',
        quantity: 1,
      }
      addToCart(cartItem)
      router.push("/checkout")
    }
  }

  if (isLoading) return <div className="p-8 text-center">Loading...</div>
  if (!product) return <div className="p-8 text-center text-red-600">Product not found.</div>

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <Card className="w-full">
          <CardContent className="flex flex-col md:flex-row gap-12 p-10">
            <div className="flex-shrink-0 relative w-96 h-96">
              <Image
                src={product.images?.[0] || "/placeholder.svg"}
                alt={product.name}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover rounded-lg"
                priority
              />
              {product.isNew && <Badge className="absolute top-2 left-2 bg-green-500">New</Badge>}
            </div>
            <div className="flex-1 flex flex-col justify-between">
              <div>
                <h2 className="text-3xl font-bold mb-4">{product.name}</h2>
                <div className="mb-4 flex items-center space-x-2">
                  <span className="text-2xl font-bold text-blue-600">{product.price.toLocaleString()} DA</span>
                  {product.originalPrice && (
                    <span className="text-lg text-gray-400 line-through">{product.originalPrice.toLocaleString()} DA</span>
                  )}
                </div>
                <div className="mb-4">
                  <span className="font-semibold">Stock:</span> {product.stock > 0 ? product.stock : <span className="text-red-500">Out of stock</span>}
                </div>
                {/* Product Details Section */}
                <div className="mb-6 p-6 bg-white rounded-lg shadow border border-gray-100">
                  <h3 className="text-xl font-semibold mb-3 text-gray-800">Product Details</h3>
                  <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                    {product.description || "No description available for this product."}
                  </p>
                  <p className="mt-4 text-gray-600 text-base">
                    {/* Long description for demo purposes. In a real app, this should come from the product data. */}
                    {`This ${product.name} is crafted with premium materials and designed for both comfort and style. Perfect for any occasion, it features exquisite details and a modern fit. Whether you're dressing up for a special event or looking for everyday elegance, this piece will elevate your wardrobe. Enjoy breathable fabrics, durable stitching, and a timeless look that never goes out of fashion. Available in multiple sizes and colors to suit your preference. Order now and experience the perfect blend of tradition and contemporary design!`}
                  </p>
                </div>
                {/* Add more product details here if needed */}
              </div>
              <div className="flex gap-4 mt-8">
                <Button onClick={handleAddToCart} disabled={product.stock === 0} className="w-44 h-12 text-lg">
                  Add to Cart
                </Button>
                <Button
                  onClick={handleBuyNow}
                  disabled={product.stock === 0}
                  className="w-44 h-12 text-lg bg-gradient-to-r from-blue-600 to-green-500 text-white font-bold shadow-lg hover:from-blue-700 hover:to-green-600 focus:ring-2 focus:ring-blue-400 focus:outline-none transition-all duration-200"
                  style={{ border: 'none' }}
                >
                  Buy Now
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}