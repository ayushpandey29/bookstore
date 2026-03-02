"use client"

import Link from "next/link"
import { ArrowRight, Search } from "lucide-react"
import { useState } from "react"
import { useRouter } from "next/navigation"

export function HeroSection() {
  const [query, setQuery] = useState("")
  const router = useRouter()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`)
    }
  }

  return (
    <section className="relative overflow-hidden bg-primary text-primary-foreground">
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M15 0v60M30 0v60M45 0v60M0 15h60M0 30h60M0 45h60' stroke='%23fff' stroke-width='.5' fill='none'/%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 py-20 lg:px-8 lg:py-28">
        <div className="max-w-2xl">
          <h1 className="text-4xl font-bold leading-tight font-serif tracking-tight sm:text-5xl lg:text-6xl text-balance">
            Discover Your Next Great Read
          </h1>
          <p className="mt-5 text-lg leading-relaxed opacity-80 text-pretty">
            Explore thousands of titles across every genre. From timeless
            classics to the latest releases, find the perfect book for every
            moment.
          </p>

          {/* Search bar */}
          <form onSubmit={handleSearch} className="mt-8 flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by title, author, or genre..."
                className="h-12 w-full rounded-lg bg-primary-foreground/10 pl-10 pr-4 text-sm text-primary-foreground placeholder:text-primary-foreground/50 outline-none ring-1 ring-primary-foreground/20 transition-all focus:bg-primary-foreground/15 focus:ring-accent"
              />
            </div>
            <button
              type="submit"
              className="flex h-12 items-center gap-2 rounded-lg bg-accent px-5 text-sm font-semibold text-accent-foreground transition-colors hover:bg-accent/90"
            >
              Search
            </button>
          </form>

          {/* Quick links */}
          <div className="mt-6 flex flex-wrap items-center gap-4">
            <Link
              href="/bestsellers"
              className="flex items-center gap-1 text-sm font-medium opacity-70 transition-opacity hover:opacity-100"
            >
              Best Sellers <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/new-releases"
              className="flex items-center gap-1 text-sm font-medium opacity-70 transition-opacity hover:opacity-100"
            >
              New Releases <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/categories"
              className="flex items-center gap-1 text-sm font-medium opacity-70 transition-opacity hover:opacity-100"
            >
              Browse Categories <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
