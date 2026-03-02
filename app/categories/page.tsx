"use client"

import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { categories, getBooksByCategory } from "@/lib/books"

export default function CategoriesPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 lg:px-8">
      <h1 className="text-3xl font-bold font-serif text-foreground">
        Browse Categories
      </h1>
      <p className="mt-2 text-muted-foreground">
        Explore our collection organized by genre
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((cat) => {
          const count = getBooksByCategory(cat).length
          return (
            <Link
              key={cat}
              href={`/categories/${encodeURIComponent(cat.toLowerCase().replace(/ /g, "-"))}`}
              className="group flex items-center justify-between rounded-lg border border-border bg-card p-6 transition-all hover:border-accent hover:shadow-md"
            >
              <div>
                <h2 className="text-lg font-semibold text-card-foreground group-hover:text-accent transition-colors">
                  {cat}
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  {count} {count === 1 ? "book" : "books"}
                </p>
              </div>
              <ArrowRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-accent" />
            </Link>
          )
        })}
      </div>
    </div>
  )
}
