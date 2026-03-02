"use client"

import Link from "next/link"
import { Star, ShoppingCart } from "lucide-react"
import type { Book } from "@/lib/books"
import { useCartStore } from "@/lib/cart-store"
import { cn } from "@/lib/utils"

export function BookCard({ book }: { book: Book }) {
  const addItem = useCartStore((s) => s.addItem)

  return (
    <div className="group flex flex-col overflow-hidden rounded-lg border border-border bg-card transition-shadow hover:shadow-md">
      <Link
        href={`/book/${book.id}`}
        className="relative aspect-[2/3] overflow-hidden bg-secondary"
      >
        <img
          src={book.cover}
          alt={`Cover of ${book.title} by ${book.author}`}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
        {/* Badges */}
        <div className="absolute left-2 top-2 flex flex-col gap-1">
          {book.bestSeller && (
            <span className="rounded-sm bg-accent px-2 py-0.5 text-[11px] font-bold uppercase text-accent-foreground">
              Best Seller
            </span>
          )}
          {book.newRelease && (
            <span className="rounded-sm bg-primary px-2 py-0.5 text-[11px] font-bold uppercase text-primary-foreground">
              New
            </span>
          )}
          {book.originalPrice && (
            <span className="rounded-sm bg-[#2a7d6e] px-2 py-0.5 text-[11px] font-bold uppercase text-[#ffffff]">
              Sale
            </span>
          )}
        </div>
      </Link>

      <div className="flex flex-1 flex-col p-4">
        <Link href={`/book/${book.id}`}>
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            {book.category}
          </p>
          <h3 className="mt-1 text-sm font-semibold leading-snug text-card-foreground line-clamp-2 transition-colors hover:text-accent">
            {book.title}
          </h3>
          <p className="mt-0.5 text-sm text-muted-foreground">{book.author}</p>
        </Link>

        {/* Rating */}
        <div className="mt-2 flex items-center gap-1">
          <div className="flex" aria-label={`Rating: ${book.rating} out of 5`}>
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={cn(
                  "h-3.5 w-3.5",
                  i < Math.floor(book.rating)
                    ? "fill-[#d4a574] text-[#d4a574]"
                    : "fill-border text-border"
                )}
              />
            ))}
          </div>
          <span className="text-xs text-muted-foreground">
            ({book.reviewCount.toLocaleString()})
          </span>
        </div>

        {/* Price + Add to cart */}
        <div className="mt-auto flex items-center justify-between pt-3">
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-bold text-card-foreground">
              {"₹"}{book.price}
            </span>
            {book.originalPrice && (
              <span className="text-sm text-muted-foreground line-through">
                {"₹"}{book.originalPrice}
              </span>
            )}
          </div>
          <button
            onClick={() => addItem(book)}
            className="flex h-9 w-9 items-center justify-center rounded-md bg-accent text-accent-foreground transition-colors hover:bg-accent/90"
            aria-label={`Add ${book.title} to cart`}
          >
            <ShoppingCart className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
