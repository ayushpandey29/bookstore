"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Search } from "lucide-react"
import { searchBooks } from "@/lib/books"
import { BookCard } from "@/components/book-card"
import Link from "next/link"

function SearchContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const initialQuery = searchParams.get("q") || ""
  const [query, setQuery] = useState(initialQuery)
  const [results, setResults] = useState(searchBooks(initialQuery))

  useEffect(() => {
    const q = searchParams.get("q") || ""
    setQuery(q)
    setResults(searchBooks(q))
  }, [searchParams])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    router.push(`/search?q=${encodeURIComponent(query.trim())}`)
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 lg:px-8">
      <nav className="mb-6 flex items-center gap-2 text-sm text-muted-foreground" aria-label="Breadcrumb">
        <Link href="/" className="transition-colors hover:text-foreground">
          Home
        </Link>
        <span>/</span>
        <span className="text-foreground font-medium">Search</span>
      </nav>

      <h1 className="text-3xl font-bold font-serif text-foreground">
        Search Books
      </h1>

      <form onSubmit={handleSearch} className="mt-6 flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by title, author, or genre..."
            className="h-12 w-full rounded-lg border border-border bg-card pl-10 pr-4 text-sm text-card-foreground placeholder:text-muted-foreground outline-none transition-all focus:border-accent focus:ring-1 focus:ring-accent"
            autoFocus
          />
        </div>
        <button
          type="submit"
          className="flex h-12 items-center gap-2 rounded-lg bg-accent px-5 text-sm font-semibold text-accent-foreground transition-colors hover:bg-accent/90"
        >
          Search
        </button>
      </form>

      {initialQuery && (
        <p className="mt-4 text-sm text-muted-foreground">
          {results.length} {results.length === 1 ? "result" : "results"} for{" "}
          <span className="font-medium text-foreground">
            &quot;{initialQuery}&quot;
          </span>
        </p>
      )}

      {results.length > 0 ? (
        <div className="mt-8 grid gap-5 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
          {results.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      ) : initialQuery ? (
        <div className="mt-10 py-16 text-center">
          <p className="text-lg font-medium text-muted-foreground">
            No books found
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            Try a different search term or browse our categories.
          </p>
          <Link
            href="/categories"
            className="mt-4 inline-flex items-center rounded-lg bg-accent px-5 py-2.5 text-sm font-semibold text-accent-foreground transition-colors hover:bg-accent/90"
          >
            Browse Categories
          </Link>
        </div>
      ) : (
        <div className="mt-10 py-16 text-center">
          <p className="text-lg font-medium text-muted-foreground">
            Start searching
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            Type a book title, author name, or genre to find books.
          </p>
        </div>
      )}
    </div>
  )
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-7xl px-4 py-10 lg:px-8">
          <h1 className="text-3xl font-bold font-serif text-foreground">
            Search Books
          </h1>
          <div className="mt-6 h-12 w-full animate-pulse rounded-lg bg-secondary" />
        </div>
      }
    >
      <SearchContent />
    </Suspense>
  )
}
