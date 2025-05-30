export interface User {
  _id?: string
  name: string
  email: string
  password: string
  role: "customer" | "admin"
  phone?: string
  address?: Address
  wishlist?: string[]
  createdAt?: Date
  updatedAt?: Date
}

export interface Address {
  street: string
  city: string
  state: string
  postalCode: string
  country: string
}
