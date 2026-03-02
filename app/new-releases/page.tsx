"use client"

import { getNewReleases } from "@/lib/books"
import { BookCard } from "@/components/book-card"
import Link from "next/link"

export default function NewReleasesPage() {
  const books = getNewReleases()

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 lg:px-8">
      <nav className="mb-6 flex items-center gap-2 text-sm text-muted-foreground" aria-label="Breadcrumb">
        <Link href="/" className="transition-colors hover:text-foreground">
          Home
        </Link>
        <span>/</span>
        <span className="text-foreground font-medium">New Releases</span>
      </nav>

      <h1 className="text-3xl font-bold font-serif text-foreground">
        New Releases
      </h1>
      <p className="mt-2 text-muted-foreground">
        Fresh arrivals and the latest titles on our shelves
      </p>

      <div className="mt-8 grid gap-5 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
        {books.map((book) => (
          <BookCard key={book.id} book={book} />
        ))}
      </div>
    </div>
  )
}
