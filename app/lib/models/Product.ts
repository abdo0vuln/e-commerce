export interface Product {
  _id?: string | import('mongodb').ObjectId
  name: string
  description: string
  price: number
  originalPrice?: number
  category: string
  subcategory?: string
  images: string[]
  sizes: string[]
  colors: string[]
  stock: number
  sku: string
  rating?: number
  reviews?: number
  isNew?: boolean
  isFeatured?: boolean
  tags?: string[]
  createdAt?: Date
  updatedAt?: Date
}

export interface Category {
  _id?: string | import('mongodb').ObjectId
  name: string
  slug: string
  description?: string
  image?: string
  parentId?: string
  createdAt?: Date
  updatedAt?: Date
}
