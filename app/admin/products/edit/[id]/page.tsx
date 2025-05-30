"use client"

import { useEffect, useState, useRef } from "react"
import { useRouter, useParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"

interface Product {
  _id: string
  name: string
  description: string
  price: number
  originalPrice: number
  category: string
  images: string[]
  sizes: string[]
  colors: string[]
  stock: number
  sku: string
  rating?: number
  reviews?: number
  isNew?: boolean
  isFeatured?: boolean
}

interface Category {
  _id: string
  name: string
  slug: string
}

export default function EditProductPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const { toast } = useToast()
  const [product, setProduct] = useState<Product | null>(null)
  const [categories, setCategories] = useState<Category[]>([])
  const [form, setForm] = useState<Omit<Product, "_id"> | null>(null)
  const [uploadingImage, setUploadingImage] = useState(false)
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProduct = async () => {
      const res = await fetch(`/api/products/${id}`)
      const data = await res.json()
      setProduct(data.product)
      setForm({ ...data.product })
      setLoading(false)
    }
    const fetchCategories = async () => {
      const res = await fetch("/api/categories")
      const data = await res.json()
      setCategories(data || [])
    }
    if (id) fetchProduct()
    fetchCategories()
  }, [id])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (!form) return
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSelectChange = (value: string) => {
    if (!form) return
    setForm({ ...form, category: value })
  }

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!form) return
    setForm({ ...form, [e.target.name]: e.target.checked })
  }

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!form) return
    const file = e.target.files?.[0]
    if (!file) return
    setUploadingImage(true)
    const formData = new FormData()
    formData.append("file", file)
    const res = await fetch("/api/upload", { method: "POST", body: formData })
    const data = await res.json()
    if (data.url) {
      setForm((prev) => prev ? { ...prev, images: [data.url] } : null)
    }
    setUploadingImage(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form) return
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error("Failed to update product")
      toast({ title: "Success", description: "Product updated successfully" })
      router.push("/admin/products")
    } catch (err: any) {
      toast({ title: "Error", description: err.message || "Failed to update product", variant: "destructive" })
    }
  }

  if (loading) return <div className="p-8 text-center">Loading...</div>
  if (!form) return <div className="p-8 text-center text-red-600">Product not found.</div>

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Edit Product</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Product Name</Label>
                <Input id="name" name="name" value={form.name} onChange={handleChange} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sku">SKU</Label>
                <Input id="sku" name="sku" value={form.sku} onChange={handleChange} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="price">Price (DA)</Label>
                <Input id="price" name="price" type="number" value={form.price} onChange={handleChange} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="originalPrice">Original Price (DA)</Label>
                <Input id="originalPrice" name="originalPrice" type="number" value={form.originalPrice} onChange={handleChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select value={form.category} onValueChange={handleSelectChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category._id} value={category.name}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="stock">Stock</Label>
                <Input id="stock" name="stock" type="number" value={form.stock} onChange={handleChange} required />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" name="description" rows={4} value={form.description} onChange={handleChange} required />
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <input type="checkbox" id="isFeatured" name="isFeatured" checked={form.isFeatured} onChange={handleCheckboxChange} className="rounded border-gray-300" />
                <Label htmlFor="isFeatured">Featured Product</Label>
              </div>
              <div className="flex items-center space-x-2">
                <input type="checkbox" id="isNew" name="isNew" checked={form.isNew} onChange={handleCheckboxChange} className="rounded border-gray-300" />
                <Label htmlFor="isNew">New Arrival</Label>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="image">Product Image</Label>
              <input ref={fileInputRef} id="image" type="file" accept="image/*" onChange={handleImageChange} className="block" disabled={uploadingImage} />
              {uploadingImage && <div className="text-blue-600 text-sm">Uploading...</div>}
              {form.images && form.images[0] && (
                <img src={form.images[0]} alt="Preview" className="h-24 w-24 object-cover rounded mt-2 border" />
              )}
            </div>
            <Button className="w-full" type="submit" disabled={uploadingImage}>Update Product</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
} 