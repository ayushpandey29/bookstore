"use client"

import { getBestSellers } from "@/lib/books"
import { BookCard } from "@/components/book-card"
import Link from "next/link"

export default function BestSellersPage() {
  const books = getBestSellers()

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 lg:px-8">
      <nav className="mb-6 flex items-center gap-2 text-sm text-muted-foreground" aria-label="Breadcrumb">
        <Link href="/" className="transition-colors hover:text-foreground">
          Home
        </Link>
        <span>/</span>
        <span className="text-foreground font-medium">Best Sellers</span>
      </nav>

      <h1 className="text-3xl font-bold font-serif text-foreground">
        Best Sellers
      </h1>
      <p className="mt-2 text-muted-foreground">
        Our most popular books loved by readers worldwide
      </p>

      <div className="mt-8 grid gap-5 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
        {books.map((book) => (
          <BookCard key={book.id} book={book} />
        ))}
      </div>
    </div>
  )
}
