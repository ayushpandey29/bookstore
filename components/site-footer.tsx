"use client"

import Link from "next/link"
import { BookOpen, Github } from "lucide-react"
import { useAuthStore } from "@/lib/auth-store"

export function SiteFooter() {
  const user = useAuthStore((s) => s.user)

  return (
    <footer className="border-t border-border bg-primary text-primary-foreground">
      <div className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center gap-2 transition-opacity hover:opacity-80">
              <BookOpen className="h-6 w-6 text-accent" />
              <span className="text-lg font-bold font-serif">BooksCart</span>
            </Link>
            <p className="mt-3 text-sm leading-relaxed opacity-70">
              Your destination for the world's best books. Discover, explore,
              and find your next great read.
            </p>
          </div>

          {/* Shop */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider">Shop</h3>
            <ul className="mt-3 flex flex-col gap-2">
              <li>
                <Link href="/categories" className="text-sm opacity-70 transition-opacity hover:opacity-100">
                  All Categories
                </Link>
              </li>
              <li>
                <Link href="/bestsellers" className="text-sm opacity-70 transition-opacity hover:opacity-100">
                  Best Sellers
                </Link>
              </li>
              <li>
                <Link href="/new-releases" className="text-sm opacity-70 transition-opacity hover:opacity-100">
                  New Releases
                </Link>
              </li>
            </ul>
          </div>

          {/* Account */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider">Account</h3>
            <ul className="mt-3 flex flex-col gap-2">
              {user ? (
                <>
                  <li>
                    <span className="text-sm opacity-70">
                      Signed in as {user.name}
                    </span>
                  </li>
                  <li>
                    <Link href="/cart" className="text-sm opacity-70 transition-opacity hover:opacity-100">
                      Shopping Cart
                    </Link>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <Link href="/login" className="text-sm opacity-70 transition-opacity hover:opacity-100">
                      Sign In
                    </Link>
                  </li>
                  <li>
                    <Link href="/signup" className="text-sm opacity-70 transition-opacity hover:opacity-100">
                      Create Account
                    </Link>
                  </li>
                  <li>
                    <Link href="/cart" className="text-sm opacity-70 transition-opacity hover:opacity-100">
                      Shopping Cart
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </div>

          {/* Help */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider">Help</h3>
            <ul className="mt-3 flex flex-col gap-2">
              <li>
                <span className="text-sm opacity-70">Shipping & Returns</span>
              </li>
              <li>
                <span className="text-sm opacity-70">FAQ</span>
              </li>
              <li>
                <span className="text-sm opacity-70">Contact Us</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-primary-foreground/10 pt-6 flex flex-col items-center gap-2 text-sm opacity-50">
          <p>© 2026 BooksCart. All rights reserved.</p>
          <Link
            href="https://github.com/avikmasanta"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 transition-opacity hover:opacity-100"
          >
            <Github className="h-4 w-4" />
            <span>Developed by avikmasanta</span>
          </Link>
        </div>
      </div>
    </footer>
  )
}
