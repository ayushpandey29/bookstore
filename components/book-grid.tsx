"use client"

import type { Book } from "@/lib/books"
import { BookCard } from "./book-card"

interface BookGridProps {
  books: Book[]
  title?: string
  subtitle?: string
}

export function BookGrid({ books, title, subtitle }: BookGridProps) {
  if (books.length === 0) {
    return (
      <div className="py-16 text-center">
        <p className="text-lg font-medium text-muted-foreground">
          No books found
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          Try adjusting your search or browse our categories.
        </p>
      </div>
    )
  }

  return (
    <section>
      {(title || subtitle) && (
        <div className="mb-6">
          {title && (
            <h2 className="text-2xl font-bold font-serif text-foreground">
              {title}
            </h2>
          )}
          {subtitle && (
            <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
          )}
        </div>
      )}
      <div className="grid gap-5 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
        {books.map((book) => (
          <BookCard key={book.id} book={book} />
        ))}
      </div>
    </section>
  )
}
