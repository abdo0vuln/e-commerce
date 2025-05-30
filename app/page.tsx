"use client"

import { useState, useEffect } from "react"
import { ShoppingBag, Star, Heart } from "lucide-react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { useCart } from "./contexts/CartContext"
import { useAuth } from "./contexts/AuthContext"
import { useRouter } from "next/navigation"
import type { Product } from "@/app/lib/models/Product"

const categories = [
	{ name: "Traditional", image: "/images/categories/traditional.jpg", count: 45 },
	{ name: "Modern", image: "/images/categories/modern.jpg", count: 32 },
	{ name: "Hijab", image: "/images/categories/hijab.jpg", count: 28 },
	{ name: "Abaya", image: "/images/categories/abaya.jpg", count: 19 },
]

export default function HomePage() {
	const [searchQuery, setSearchQuery] = useState("")
	const [wishlist, setWishlist] = useState<string[]>([])
	const { addToCart, cartItems, total, clearCart } = useCart()
	const { user } = useAuth()
	const [featuredProducts, setFeaturedProducts] = useState<Product[]>([])
	const [isLoading, setIsLoading] = useState(true)
	const router = useRouter()
	const [form, setForm] = useState({
		name: "",
		email: "",
		phone: "",
		address: "",
		city: "",
		postalCode: "",
		country: "Algeria",
	})
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState("")

	useEffect(() => {
		const fetchProducts = async () => {
			try {
				const response = await fetch("/api/products?featured=true&limit=4")
				const data = await response.json()
				setFeaturedProducts(data.products || [])
			} catch (error) {
				console.error("Error fetching products:", error)
			} finally {
				setIsLoading(false)
			}
		}

		fetchProducts()
	}, [])

	const toggleWishlist = (productId: string) => {
		setWishlist((prev) => (prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]))
	}

	const handleAddToCart = (product: any) => {
		addToCart({
			id: product.id,
			name: product.name,
			price: product.price,
			image: product.image,
			quantity: 1,
		})
	}

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setForm({ ...form, [e.target.name]: e.target.value })
	}

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		setLoading(true)
		setError("")
		try {
			const order = {
				items: cartItems.map((item) => ({
					productId: item.id,
					name: item.name,
					price: item.price,
					quantity: item.quantity,
					size: item.size,
					color: item.color,
					image: item.image,
				})),
				subtotal: total,
				shipping: total > 10000 ? 0 : 500,
				discount: 0, // You can add promo code logic here
				total: total > 10000 ? total : total + 500,
				shippingAddress: form,
			}
			const res = await fetch("/api/orders", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(order),
			})
			if (!res.ok) throw new Error("Failed to place order")
			clearCart()
			router.push("/order-confirmation")
		} catch (err: any) {
			setError(err.message || "Something went wrong")
		} finally {
			setLoading(false)
		}
	}

	return (
		<main>
			{/* Hero Section */}
			<section className="bg-blue-600 text-white py-20">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="text-center">
						<h1 className="text-4xl md:text-6xl font-bold mb-6">Discover Authentic Algerian Fashion</h1>
						<p className="text-xl md:text-2xl mb-8 text-blue-100">Traditional elegance meets modern style</p>
						<Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
							Shop Now
						</Button>
					</div>
				</div>
			</section>

			{/* Categories */}
			<section className="py-16">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<h2 className="text-3xl font-bold text-center mb-12">Shop by Category</h2>
					<div className="grid grid-cols-2 md:grid-cols-4 gap-6">
						{categories.map((category) => (
							<Link key={category.name} href={{ pathname: "/products", query: { category: category.name } }}>
								<Card className="group cursor-pointer hover:shadow-lg transition-shadow">
									<CardContent className="p-6 text-center">
										<div className="relative w-20 h-20 mx-auto mb-4 rounded-full bg-gray-200 group-hover:bg-blue-100 transition-colors">
											<Image
												src={category.image || "/placeholder.svg"}
												alt={category.name}
												fill
												sizes="80px"
												className="rounded-full object-cover"
											/>
										</div>
										<h3 className="font-semibold text-lg mb-2">{category.name}</h3>
										<p className="text-gray-600">{category.count} items</p>
									</CardContent>
								</Card>
							</Link>
						))}
					</div>
				</div>
			</section>

			{/* Featured Products */}
			<section className="py-16 bg-white">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="flex justify-between items-center mb-12">
						<h2 className="text-3xl font-bold">Featured Products</h2>
						<Link href="/products">
							<Button variant="outline">View All</Button>
						</Link>
					</div>
					{isLoading ? (
						<div className="text-center py-8">Loading products...</div>
					) : (
						<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
							{featuredProducts.map((product) => (
								<Card key={product._id?.toString()} className="group hover:shadow-lg transition-shadow">
									<img
										src={product.images?.[0] || "/placeholder.svg"}
										alt={product.name}
										className="mx-auto h-40 w-40 object-cover rounded-lg"
									/>
									{product.isNew && <Badge className="absolute top-2 left-2 bg-green-500">New</Badge>}
									<Button
										variant="ghost"
										size="icon"
										className={`absolute top-2 right-2 ${wishlist.includes(product._id?.toString() || "") ? "text-red-500" : "text-gray-400"}`}
										onClick={() => toggleWishlist(product._id?.toString() || "")}
									>
										<Heart className="h-5 w-5" fill={wishlist.includes(product._id?.toString() || "") ? "currentColor" : "none"} />
									</Button>
									<div className="mt-4 text-lg font-semibold text-gray-900">{product.name}</div>
									<div className="flex items-center justify-center mt-2">
										<Star className="h-4 w-4 text-yellow-400" />
										<span className="ml-1 text-sm text-gray-600">{product.rating ?? 0}</span>
										<span className="ml-1 text-sm text-gray-400">({product.reviews ?? 0})</span>
									</div>
									<div className="mt-2 flex items-center justify-center space-x-2">
										<span className="text-lg font-bold text-blue-600">{product.price.toLocaleString()} DA</span>
										{product.originalPrice && (
											<span className="text-sm text-gray-400 line-through">{product.originalPrice.toLocaleString()} DA</span>
										)}
									</div>
									<Button className="w-full mt-3" onClick={() => handleAddToCart(product)}>
										Add to Cart
									</Button>
								</Card>
							))}
						</div>
					)}
				</div>
			</section>

			{/* Newsletter */}
			<section className="py-16 bg-gray-900 text-white">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
					<h2 className="text-3xl font-bold mb-4">Stay Updated</h2>
					<p className="text-xl mb-8 text-gray-300">Get the latest fashion trends and exclusive offers</p>
					<div className="max-w-md mx-auto flex gap-4">
						<Input type="email" placeholder="Enter your email" className="bg-white text-gray-900" />
						<Button className="bg-blue-600 hover:bg-blue-700">Subscribe</Button>
					</div>
				</div>
			</section>

			{/* Footer */}
			<footer className="bg-gray-800 text-white py-12">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="grid grid-cols-1 md:grid-cols-4 gap-8">
						<div>
							<div className="flex items-center space-x-2 mb-4">
								<ShoppingBag className="h-8 w-8 text-blue-400" />
								<span className="text-xl font-bold">AlgerianStyle</span>
							</div>
							<p className="text-gray-400">Authentic Algerian fashion for the modern world.</p>
						</div>
						<div>
							<h3 className="font-semibold mb-4">Quick Links</h3>
							<ul className="space-y-2 text-gray-400">
								<li>
									<Link href="/about" className="hover:text-white">
										About Us
									</Link>
								</li>
								<li>
									<Link href="/contact" className="hover:text-white">
										Contact
									</Link>
								</li>
								<li>
									<Link href="/shipping" className="hover:text-white">
										Shipping Info
									</Link>
								</li>
								<li>
									<Link href="/returns" className="hover:text-white">
										Returns
									</Link>
								</li>
							</ul>
						</div>
						<div>
							<h3 className="font-semibold mb-4">Categories</h3>
							<ul className="space-y-2 text-gray-400">
								<li>
									<Link href="/traditional" className="hover:text-white">
										Traditional
									</Link>
								</li>
								<li>
									<Link href="/modern" className="hover:text-white">
										Modern
									</Link>
								</li>
								<li>
									<Link href="/hijab" className="hover:text-white">
										Hijab
									</Link>
								</li>
								<li>
									<Link href="/abaya" className="hover:text-white">
										Abaya
									</Link>
								</li>
							</ul>
						</div>
						<div>
							<h3 className="font-semibold mb-4">Contact Info</h3>
							<div className="text-gray-400 space-y-2">
								<p>Algiers, Algeria</p>
								<p>+213 XXX XXX XXX</p>
								<p>info@algerianstyle.com</p>
							</div>
						</div>
					</div>
					<div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
						<p>&copy; 2024 AlgerianStyle. All rights reserved.</p>
					</div>
				</div>
			</footer>
		</main>
	)
}
