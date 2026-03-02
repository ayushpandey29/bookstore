"use client"

import { use } from "react"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { categories, getBooksByCategory } from "@/lib/books"
import { BookCard } from "@/components/book-card"

function slugToCategory(slug: string): string | undefined {
  return categories.find(
    (cat) => cat.toLowerCase().replace(/ /g, "-") === slug
  )
}

export default function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = use(params)
  const categoryName = slugToCategory(slug)

  if (!categoryName) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-center lg:px-8">
        <h1 className="text-2xl font-bold text-foreground">
          Category Not Found
        </h1>
        <p className="mt-2 text-muted-foreground">
          This category doesn't exist.
        </p>
        <Link
          href="/categories"
          className="mt-6 inline-flex items-center gap-2 rounded-lg bg-accent px-5 py-2.5 text-sm font-semibold text-accent-foreground transition-colors hover:bg-accent/90"
        >
          <ArrowLeft className="h-4 w-4" /> All Categories
        </Link>
      </div>
    )
  }

  const books = getBooksByCategory(categoryName)

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 lg:px-8">
      {/* Breadcrumb */}
      <nav className="mb-6 flex items-center gap-2 text-sm text-muted-foreground" aria-label="Breadcrumb">
        <Link href="/" className="transition-colors hover:text-foreground">
          Home
        </Link>
        <span>/</span>
        <Link
          href="/categories"
          className="transition-colors hover:text-foreground"
        >
          Categories
        </Link>
        <span>/</span>
        <span className="text-foreground font-medium">{categoryName}</span>
      </nav>

      <h1 className="text-3xl font-bold font-serif text-foreground">
        {categoryName}
      </h1>
      <p className="mt-2 text-muted-foreground">
        {books.length} {books.length === 1 ? "book" : "books"} in this category
      </p>

      {books.length > 0 ? (
        <div className="mt-8 grid gap-5 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
          {books.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      ) : (
        <div className="mt-10 py-16 text-center">
          <p className="text-lg font-medium text-muted-foreground">
            No books in this category yet
          </p>
        </div>
      )}
    </div>
  )
}
