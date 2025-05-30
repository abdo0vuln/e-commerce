import Link from "next/link"
import Image from "next/image"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Heart, Star } from "lucide-react"
import type { Product } from "@/app/lib/models/Product"

interface ProductCardProps {
  product: Product
  onAddToCart?: (product: Product) => void
  onWishlist?: (productId: string) => void
  isWishlisted?: boolean
  showAddToCart?: boolean
  showWishlist?: boolean
  showViewDetails?: boolean
  className?: string
}

export default function ProductCard({
  product,
  onAddToCart,
  onWishlist,
  isWishlisted,
  showAddToCart = true,
  showWishlist = true,
  showViewDetails = true,
  className = "",
}: ProductCardProps) {
  return (
    <Card className={`group hover:shadow-lg transition-shadow relative ${className}`}>
      <Link href={`/products/${product._id?.toString()}`}> 
        <div className="relative w-40 h-40 mx-auto mt-4">
          <Image
            src={product.images?.[0] || "/placeholder.svg"}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover rounded-lg"
            priority={product.isFeatured}
          />
        </div>
      </Link>
      {product.isNew && <Badge className="absolute top-2 left-2 bg-green-500">New</Badge>}
      {showWishlist && onWishlist && (
        <Button
          variant="ghost"
          size="icon"
          className={`absolute top-2 right-2 ${isWishlisted ? "text-red-500" : "text-gray-400"}`}
          onClick={() => onWishlist(product._id?.toString() || "")}
        >
          <Heart className="h-5 w-5" fill={isWishlisted ? "currentColor" : "none"} />
        </Button>
      )}
      <div className="p-4">
        <h3 className="font-semibold text-lg text-center mb-2">{product.name}</h3>
        <div className="flex items-center justify-center space-x-2 mb-2">
          <Star className="h-4 w-4 text-yellow-400" />
          <span className="text-sm text-gray-600">{product.rating ?? 0}</span>
          <span className="text-sm text-gray-400">({product.reviews ?? 0})</span>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-blue-600">{product.price.toLocaleString()} DA</div>
          {product.originalPrice && product.originalPrice > product.price && (
            <div className="text-sm text-gray-500 line-through">
              {product.originalPrice.toLocaleString()} DA
            </div>
          )}
        </div>
        {showAddToCart && onAddToCart && (
          <Button
            className="w-full mt-4"
            onClick={() => onAddToCart(product)}
            disabled={product.stock === 0}
          >
            {product.stock > 0 ? "Add to Cart" : "Out of Stock"}
          </Button>
        )}
      </div>
    </Card>
  )
}