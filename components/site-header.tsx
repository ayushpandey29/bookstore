"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { BookOpen, Search, ShoppingCart, User, Menu, X, LogOut, Package } from "lucide-react"
import { useState, useEffect } from "react"
import { useCartStore } from "@/lib/cart-store"
import { useAuthStore } from "@/lib/auth-store"
import { cn } from "@/lib/utils"

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/categories", label: "Categories" },
  { href: "/bestsellers", label: "Best Sellers" },
  { href: "/new-releases", label: "New Releases" },
]

export function SiteHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pathname = usePathname()
  const itemCount = useCartStore((s) => s.getItemCount())
  const user = useAuthStore((s) => s.user)
  const isHydrated = useAuthStore((s) => s.isHydrated)
  const logout = useAuthStore((s) => s.logout)
  const hydrate = useAuthStore((s) => s.hydrate)

  useEffect(() => {
    hydrate()
  }, [hydrate])

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 lg:px-8">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 transition-opacity hover:opacity-80"
        >
          <BookOpen className="h-7 w-7 text-accent" />
          <span className="text-xl font-bold tracking-tight font-serif text-foreground">
            BooksKart
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-8 md:flex" aria-label="Main navigation">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "text-sm font-medium transition-colors hover:text-accent",
                pathname === link.href
                  ? "text-accent"
                  : "text-muted-foreground"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <Link
            href="/search"
            className="flex h-9 w-9 items-center justify-center rounded-md transition-colors hover:bg-secondary"
            aria-label="Search books"
          >
            <Search className="h-5 w-5 text-foreground" />
          </Link>

          <Link
            href="/cart"
            className="relative flex h-9 w-9 items-center justify-center rounded-md transition-colors hover:bg-secondary"
            aria-label={`Shopping cart with ${itemCount} items`}
          >
            <ShoppingCart className="h-5 w-5 text-foreground" />
            {itemCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-accent text-[11px] font-bold text-accent-foreground">
                {itemCount > 99 ? "99+" : itemCount}
              </span>
            )}
          </Link>

          {/* Auth-aware buttons (desktop) */}
          {isHydrated && user ? (
            <div className="hidden items-center gap-2 sm:flex">
              <Link
                href="/my-orders"
                className="flex h-9 items-center gap-1.5 rounded-md border border-border px-3 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
              >
                <Package className="h-4 w-4" />
                <span>My Orders</span>
              </Link>
              <span className="flex h-9 items-center gap-1.5 rounded-md border border-border px-3 text-sm font-medium text-foreground">
                <User className="h-4 w-4" />
                <span className="max-w-[100px] truncate">{user.name}</span>
              </span>
              <button
                onClick={logout}
                className="flex h-9 w-9 items-center justify-center rounded-md transition-colors hover:bg-secondary"
                aria-label="Sign out"
              >
                <LogOut className="h-4 w-4 text-muted-foreground" />
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="hidden h-9 items-center gap-1.5 rounded-md border border-border px-3 text-sm font-medium transition-colors hover:bg-secondary sm:flex"
            >
              <User className="h-4 w-4" />
              <span>Sign In</span>
            </Link>
          )}

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex h-9 w-9 items-center justify-center rounded-md transition-colors hover:bg-secondary md:hidden"
            aria-label="Toggle menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <nav
          className="border-t border-border bg-background px-4 py-4 md:hidden"
          aria-label="Mobile navigation"
        >
          <div className="flex flex-col gap-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  "rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-secondary",
                  pathname === link.href
                    ? "bg-secondary text-accent"
                    : "text-muted-foreground"
                )}
              >
                {link.label}
              </Link>
            ))}
            {isHydrated && user ? (
              <>
                <div className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-foreground sm:hidden">
                  <User className="h-4 w-4" />
                  {user.name}
                </div>
                <Link
                  href="/my-orders"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary sm:hidden"
                >
                  <Package className="h-4 w-4" />
                  My Orders
                </Link>
                <button
                  onClick={() => {
                    logout()
                    setMobileMenuOpen(false)
                  }}
                  className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary sm:hidden"
                >
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </button>
              </>
            ) : (
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary sm:hidden"
              >
                <User className="h-4 w-4" />
                Sign In
              </Link>
            )}
          </div>
        </nav>
      )}
    </header>
  )
}
