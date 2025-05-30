"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  BarChart,
  Settings,
  ChevronDown,
  Menu,
  X,
  LogOut,
  ShoppingBag,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "../contexts/AuthContext"
import { useRouter } from "next/navigation"

interface SidebarItem {
  title: string
  href: string
  icon: React.ReactNode
  submenu?: { title: string; href: string }[]
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null)

  useEffect(() => {
    // Close mobile menu when path changes
    setIsMobileMenuOpen(false)
  }, [pathname])

  useEffect(() => {
    // Check if user is admin
    if (!user || user.role !== "admin") {
      router.push("/auth")
    }
  }, [user, router])

  const sidebarItems: SidebarItem[] = [
    {
      title: "Dashboard",
      href: "/admin",
      icon: <LayoutDashboard className="h-5 w-5" />,
    },
    {
      title: "Products",
      href: "/admin/products",
      icon: <Package className="h-5 w-5" />,
      submenu: [
        { title: "All Products", href: "/admin/products" },
        { title: "Categories", href: "/admin/products/categories" },
      ],
    },
    {
      title: "Orders",
      href: "/admin/orders",
      icon: <ShoppingCart className="h-5 w-5" />,
    },
    {
      title: "Customers",
      href: "/admin/customers",
      icon: <Users className="h-5 w-5" />,
    },
    {
      title: "Analytics",
      href: "/admin/analytics",
      icon: <BarChart className="h-5 w-5" />,
    },
    {
      title: "Settings",
      href: "/admin/settings",
      icon: <Settings className="h-5 w-5" />,
    },
  ]

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  const toggleSubmenu = (title: string) => {
    setOpenSubmenu(openSubmenu === title ? null : title)
  }

  if (!user || user.role !== "admin") {
    return null // Router will redirect, no need to render anything
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Mobile Header */}
      <div className="md:hidden bg-white border-b p-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <ShoppingBag className="h-6 w-6 text-blue-600" />
          <span className="font-bold text-xl">Admin</span>
        </div>
        <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </Button>
      </div>

      {/* Mobile Sidebar */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-white pt-16">
          <div className="p-4 space-y-4">
            {sidebarItems.map((item) => (
              <div key={item.title}>
                {item.submenu ? (
                  <div>
                    <button
                      onClick={() => toggleSubmenu(item.title)}
                      className={`w-full flex items-center justify-between p-2 rounded-md ${
                        pathname.startsWith(item.href) ? "bg-blue-50 text-blue-600" : "hover:bg-gray-100"
                      }`}
                    >
                      <div className="flex items-center">
                        {item.icon}
                        <span className="ml-3 font-medium">{item.title}</span>
                      </div>
                      <ChevronDown
                        className={`h-4 w-4 transition-transform ${
                          openSubmenu === item.title ? "transform rotate-180" : ""
                        }`}
                      />
                    </button>
                    {openSubmenu === item.title && (
                      <div className="ml-6 mt-2 space-y-2">
                        {item.submenu.map((subitem) => (
                          <Link
                            key={subitem.href}
                            href={subitem.href}
                            className={`block p-2 rounded-md ${
                              pathname === subitem.href ? "bg-blue-50 text-blue-600" : "hover:bg-gray-100"
                            }`}
                          >
                            {subitem.title}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    href={item.href}
                    className={`flex items-center p-2 rounded-md ${
                      pathname === item.href ? "bg-blue-50 text-blue-600" : "hover:bg-gray-100"
                    }`}
                  >
                    {item.icon}
                    <span className="ml-3 font-medium">{item.title}</span>
                  </Link>
                )}
              </div>
            ))}
            <button
              onClick={handleLogout}
              className="w-full flex items-center p-2 text-red-600 hover:bg-red-50 rounded-md"
            >
              <LogOut className="h-5 w-5" />
              <span className="ml-3 font-medium">Logout</span>
            </button>
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 bg-white border-r z-30 transition-all duration-300 hidden md:block ${
          isSidebarOpen ? "w-64" : "w-20"
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="p-4 border-b flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <ShoppingBag className="h-6 w-6 text-blue-600" />
              {isSidebarOpen && <span className="font-bold text-xl">Admin</span>}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="hidden md:flex"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>

          <div className="flex-1 py-4 overflow-y-auto">
            <nav className="px-2 space-y-1">
              {sidebarItems.map((item) => (
                <div key={item.title}>
                  {item.submenu ? (
                    <div className="mb-2">
                      <button
                        onClick={() => toggleSubmenu(item.title)}
                        className={`w-full flex items-center justify-between p-2 rounded-md ${
                          pathname.startsWith(item.href) ? "bg-blue-50 text-blue-600" : "hover:bg-gray-100"
                        }`}
                      >
                        <div className="flex items-center">
                          {item.icon}
                          {isSidebarOpen && <span className="ml-3 font-medium">{item.title}</span>}
                        </div>
                        {isSidebarOpen && (
                          <ChevronDown
                            className={`h-4 w-4 transition-transform ${
                              openSubmenu === item.title ? "transform rotate-180" : ""
                            }`}
                          />
                        )}
                      </button>
                      {isSidebarOpen && openSubmenu === item.title && (
                        <div className="ml-6 mt-2 space-y-2">
                          {item.submenu.map((subitem) => (
                            <Link
                              key={subitem.href}
                              href={subitem.href}
                              className={`block p-2 rounded-md ${
                                pathname === subitem.href ? "bg-blue-50 text-blue-600" : "hover:bg-gray-100"
                              }`}
                            >
                              {subitem.title}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <Link
                      href={item.href}
                      className={`flex items-center p-2 rounded-md ${
                        pathname === item.href ? "bg-blue-50 text-blue-600" : "hover:bg-gray-100"
                      }`}
                    >
                      {item.icon}
                      {isSidebarOpen && <span className="ml-3 font-medium">{item.title}</span>}
                    </Link>
                  )}
                </div>
              ))}
            </nav>
          </div>

          <div className="p-4 border-t">
            <Button
              variant="ghost"
              className={`w-full justify-start text-red-600 hover:bg-red-50 hover:text-red-700 ${
                !isSidebarOpen && "justify-center"
              }`}
              onClick={handleLogout}
            >
              <LogOut className="h-5 w-5" />
              {isSidebarOpen && <span className="ml-2">Logout</span>}
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className={`min-h-screen transition-all duration-300 ${isSidebarOpen ? "md:ml-64" : "md:ml-20"}`}>
        <div className="p-0 md:p-0">
          <div className="bg-white shadow-sm border-b hidden md:block">
            <div className="flex h-16 items-center justify-between px-4">
              <h1 className="text-xl font-bold">Admin Dashboard</h1>
              <div className="flex items-center space-x-4">
                <Link href="/" className="text-sm text-blue-600 hover:text-blue-800">
                  View Store
                </Link>
                <div className="text-sm">
                  Welcome, <span className="font-medium">{user?.name}</span>
                </div>
              </div>
            </div>
          </div>
          <main className="bg-gray-50">{children}</main>
        </div>
      </div>
    </div>
  )
}
