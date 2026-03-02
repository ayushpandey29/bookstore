"use client"

import { HeroSection } from "@/components/hero-section"
import { BookCard } from "@/components/book-card"
import { getFeaturedBooks, getBestSellers, getNewReleases, categories } from "@/lib/books"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

export default function HomePage() {
  const featured = getFeaturedBooks()
  const bestSellers = getBestSellers()
  const newReleases = getNewReleases()

  return (
    <div>
      <HeroSection />

      {/* Featured Books */}
      <section className="mx-auto max-w-7xl px-4 py-14 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold font-serif text-foreground">
              Featured Books
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Handpicked selections from our editors
            </p>
          </div>
        </div>
        <div className="grid gap-5 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
          {featured.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      </section>

      {/* Best Sellers */}
      <section className="bg-secondary/50">
        <div className="mx-auto max-w-7xl px-4 py-14 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold font-serif text-foreground">
                Best Sellers
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                The most popular books right now
              </p>
            </div>
            <Link
              href="/bestsellers"
              className="flex items-center gap-1 text-sm font-medium text-accent transition-colors hover:text-accent/80"
            >
              View All <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid gap-5 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
            {bestSellers.slice(0, 4).map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="mx-auto max-w-7xl px-4 py-14 lg:px-8">
        <h2 className="text-2xl font-bold font-serif text-foreground mb-2">
          Browse by Category
        </h2>
        <p className="text-sm text-muted-foreground mb-6">
          Find exactly what you're looking for
        </p>
        <div className="grid gap-3 grid-cols-2 sm:grid-cols-4">
          {categories.map((cat) => (
            <Link
              key={cat}
              href={`/categories/${encodeURIComponent(cat.toLowerCase().replace(/ /g, "-"))}`}
              className="flex items-center justify-between rounded-lg border border-border bg-card p-4 transition-all hover:border-accent hover:shadow-sm"
            >
              <span className="text-sm font-medium text-card-foreground">
                {cat}
              </span>
              <ArrowRight className="h-4 w-4 text-muted-foreground" />
            </Link>
          ))}
        </div>
      </section>

      {/* New Releases */}
      <section className="bg-secondary/50">
        <div className="mx-auto max-w-7xl px-4 py-14 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold font-serif text-foreground">
                New Releases
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Fresh arrivals to our shelves
              </p>
            </div>
            <Link
              href="/new-releases"
              className="flex items-center gap-1 text-sm font-medium text-accent transition-colors hover:text-accent/80"
            >
              View All <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid gap-5 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
            {newReleases.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
