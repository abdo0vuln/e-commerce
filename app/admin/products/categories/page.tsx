"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Plus, Edit, Trash2, AlertTriangle, Check, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/app/contexts/AuthContext"

interface Category {
  _id: string
  name: string
  slug: string
  description?: string
  image?: string
  count?: number
  createdAt?: string
  updatedAt?: string
}

export default function CategoriesPage() {
  const { user } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null)
  const [isEditMode, setIsEditMode] = useState(false)
  const [editCategoryId, setEditCategoryId] = useState<string | null>(null)

  // New category form state
  const [newCategory, setNewCategory] = useState({
    name: "",
    description: "",
    image: "/placeholder.svg?height=200&width=200",
  })

  useEffect(() => {
    if (!user || user.role !== "admin") {
      router.push("/auth")
      return
    }

    const fetchCategories = async () => {
      try {
        const response = await fetch("/api/categories")
        const data = await response.json()
        setCategories(data || [])
      } catch (error) {
        console.error("Error fetching categories:", error)
        toast({
          title: "Error",
          description: "Failed to load categories. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchCategories()
  }, [user, router, toast])

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      if (isEditMode && editCategoryId) {
        // Update existing category
        const response = await fetch(`/api/categories/${editCategoryId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newCategory),
        })

        if (response.ok) {
          toast({
            title: "Success",
            description: "Category updated successfully",
          })

          // Update category in list
          setCategories(
            categories.map((cat) =>
              cat._id === editCategoryId
                ? { ...cat, ...newCategory, slug: newCategory.name.toLowerCase().replace(/\s+/g, "-") }
                : cat,
            ),
          )
        } else {
          const error = await response.json()
          throw new Error(error.message || "Failed to update category")
        }
      } else {
        // Add new category
        const response = await fetch("/api/categories", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newCategory),
        })

        if (response.ok) {
          const data = await response.json()
          toast({
            title: "Success",
            description: "Category added successfully",
          })

          // Add new category to list
          const newCategoryWithId = {
            _id: data.categoryId,
            name: newCategory.name,
            slug: newCategory.name.toLowerCase().replace(/\s+/g, "-"),
            description: newCategory.description,
            image: newCategory.image,
            count: 0,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          }

          setCategories([...categories, newCategoryWithId])
        } else {
          const error = await response.json()
          throw new Error(error.message || "Failed to add category")
        }
      }

      // Reset form and close dialog
      resetForm()
    } catch (error) {
      console.error("Error with category:", error)
      toast({
        title: "Error",
        description: (error instanceof Error ? error.message : "") || "Failed to process category. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleDeleteCategory = async () => {
    if (!categoryToDelete) return

    try {
      const response = await fetch(`/api/categories/${categoryToDelete}`, {
        method: "DELETE",
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Category deleted successfully",
        })

        // Remove category from list
        setCategories(categories.filter((category) => category._id !== categoryToDelete))
        setCategoryToDelete(null)
        setIsDeleteDialogOpen(false)
      } else {
        const error = await response.json()
        throw new Error(error.message || "Failed to delete category")
      }
    } catch (error) {
      console.error("Error deleting category:", error)
      toast({
        title: "Error",
        description: (error instanceof Error ? error.message : "") || "Failed to delete category. Please try again.",
        variant: "destructive",
      })
    }
  }

  const confirmDelete = (categoryId: string) => {
    setCategoryToDelete(categoryId)
    setIsDeleteDialogOpen(true)
  }

  const editCategory = (category: Category) => {
    setNewCategory({
      name: category.name,
      description: category.description || "",
      image: category.image || "/placeholder.svg?height=200&width=200",
    })
    setEditCategoryId(category._id)
    setIsEditMode(true)
    setIsAddCategoryOpen(true)
  }

  const resetForm = () => {
    setNewCategory({
      name: "",
      description: "",
      image: "/placeholder.svg?height=200&width=200",
    })
    setIsEditMode(false)
    setEditCategoryId(null)
    setIsAddCategoryOpen(false)
  }

  if (!user || user.role !== "admin") {
    return null // Router will redirect, no need to render anything
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Categories Management</h1>
          <p className="text-gray-500">Manage your product categories</p>
        </div>
        <Button onClick={() => setIsAddCategoryOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Category
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-8 text-center">Loading categories...</div>
          ) : categories.length === 0 ? (
            <div className="p-8 text-center">
              <h3 className="text-lg font-medium">No categories found</h3>
              <p className="text-gray-500 mb-4">Get started by adding your first category</p>
              <Button onClick={() => setIsAddCategoryOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Category
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Category</TableHead>
                  <TableHead>Slug</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Products</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {categories.map((category) => (
                  <TableRow key={category._id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <div className="h-10 w-10 bg-gray-100 rounded-md overflow-hidden">
                          <img
                            src={category.image || "/placeholder.svg?height=40&width=40"}
                            alt={category.name}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div className="font-medium">{category.name}</div>
                      </div>
                    </TableCell>
                    <TableCell className="text-gray-500">{category.slug}</TableCell>
                    <TableCell className="max-w-xs truncate">{category.description || "No description"}</TableCell>
                    <TableCell>{category.count || 0}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button variant="ghost" size="sm" onClick={() => editCategory(category)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => confirmDelete(category._id)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Add/Edit Category Dialog */}
      <Dialog
        open={isAddCategoryOpen}
        onOpenChange={(open) => {
          if (!open) resetForm()
          setIsAddCategoryOpen(open)
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{isEditMode ? "Edit Category" : "Add New Category"}</DialogTitle>
            <DialogDescription>
              {isEditMode ? "Update the details of this category." : "Fill in the details to add a new category."}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleAddCategory} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Category Name</Label>
              <Input
                id="name"
                value={newCategory.name}
                onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                rows={3}
                value={newCategory.description}
                onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="image">Image URL</Label>
              <Input
                id="image"
                value={newCategory.image}
                onChange={(e) => setNewCategory({ ...newCategory, image: e.target.value })}
                placeholder="/placeholder.svg?height=200&width=200"
              />
              <div className="mt-2 flex justify-center">
                <div className="h-20 w-20 bg-gray-100 rounded-md overflow-hidden">
                  <img
                    src={newCategory.image || "/placeholder.svg?height=80&width=80"}
                    alt="Category preview"
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={resetForm}>
                Cancel
              </Button>
              <Button type="submit">{isEditMode ? "Update Category" : "Add Category"}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this category? This will not delete the products in this category.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-center text-amber-500 my-4">
            <AlertTriangle className="h-16 w-16" />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteCategory}>
              <Check className="h-4 w-4 mr-2" />
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
