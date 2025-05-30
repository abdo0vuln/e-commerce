export interface Order {
  _id?: string | import('mongodb').ObjectId
  userId: string
  orderNumber: string
  items: OrderItem[]
  subtotal: number
  shipping: number
  discount: number
  total: number
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled"
  paymentMethod: string
  paymentStatus: "pending" | "paid" | "failed"
  shippingAddress: Address
  billingAddress?: Address
  notes?: string
  createdAt?: Date
  updatedAt?: Date
}

export interface OrderItem {
  productId: string | import('mongodb').ObjectId
  name: string
  price: number
  quantity: number
  size?: string
  color?: string
  image: string
}

interface Address {
  name: string
  street: string
  city: string
  state: string
  postalCode: string
  country: string
  phone: string
}
