"use client"

import { use, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  Star,
  ShoppingCart,
  ArrowLeft,
  BookOpen,
  Calendar,
  Globe,
  Hash,
  Building2,
  Minus,
  Plus,
} from "lucide-react"
import { getBookById, getBooksByCategory, type Book } from "@/lib/books"
import { useCartStore } from "@/lib/cart-store"
import { BookCard } from "@/components/book-card"
import { cn } from "@/lib/utils"

export default function BookDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const book = getBookById(id)
  const router = useRouter()
  const addItem = useCartStore((s) => s.addItem)
  const [quantity, setQuantity] = useState(1)
  const [showFullDescription, setShowFullDescription] = useState(false)

  if (!book) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-center lg:px-8">
        <h1 className="text-2xl font-bold text-foreground">Book Not Found</h1>
        <p className="mt-2 text-muted-foreground">
          The book you're looking for doesn't exist.
        </p>
        <Link
          href="/"
          className="mt-6 inline-flex items-center gap-2 rounded-lg bg-accent px-5 py-2.5 text-sm font-semibold text-accent-foreground transition-colors hover:bg-accent/90"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Home
        </Link>
      </div>
    )
  }

  const relatedBooks = getBooksByCategory(book.category)
    .filter((b) => b.id !== book.id)
    .slice(0, 4)

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addItem(book)
    }
  }

  const descriptionParagraphs = book.longDescription.split("\n\n")

  return (
    <div>
      {/* Breadcrumb */}
      <div className="border-b border-border bg-secondary/30">
        <div className="mx-auto max-w-7xl px-4 py-3 lg:px-8">
          <nav className="flex items-center gap-2 text-sm text-muted-foreground" aria-label="Breadcrumb">
            <Link href="/" className="transition-colors hover:text-foreground">
              Home
            </Link>
            <span>/</span>
            <Link
              href={`/categories/${encodeURIComponent(book.category.toLowerCase().replace(/ /g, "-"))}`}
              className="transition-colors hover:text-foreground"
            >
              {book.category}
            </Link>
            <span>/</span>
            <span className="text-foreground font-medium line-clamp-1">
              {book.title}
            </span>
          </nav>
        </div>
      </div>

      {/* Book Detail */}
      <section className="mx-auto max-w-7xl px-4 py-10 lg:px-8">
        <div className="flex flex-col gap-10 lg:flex-row">
          {/* Cover Image */}
          <div className="shrink-0 lg:w-[380px]">
            <div className="sticky top-24 overflow-hidden rounded-lg border border-border bg-secondary shadow-sm">
              <img
                src={book.cover}
                alt={`Cover of ${book.title} by ${book.author}`}
                className="aspect-[2/3] w-full object-cover"
              />
            </div>
          </div>

          {/* Book Info */}
          <div className="flex-1">
            <div className="flex flex-wrap gap-2">
              {book.bestSeller && (
                <span className="rounded-sm bg-accent px-2.5 py-1 text-xs font-bold uppercase text-accent-foreground">
                  Best Seller
                </span>
              )}
              {book.newRelease && (
                <span className="rounded-sm bg-primary px-2.5 py-1 text-xs font-bold uppercase text-primary-foreground">
                  New Release
                </span>
              )}
              {book.originalPrice && (
                <span className="rounded-sm bg-[#2a7d6e] px-2.5 py-1 text-xs font-bold uppercase text-[#ffffff]">
                  Sale
                </span>
              )}
            </div>

            <h1 className="mt-4 text-3xl font-bold font-serif leading-tight text-foreground sm:text-4xl text-balance">
              {book.title}
            </h1>
            <p className="mt-2 text-lg text-muted-foreground">
              by{" "}
              <span className="font-medium text-foreground">{book.author}</span>
            </p>

            {/* Rating */}
            <div className="mt-4 flex items-center gap-2">
              <div className="flex" aria-label={`Rating: ${book.rating} out of 5`}>
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={cn(
                      "h-5 w-5",
                      i < Math.floor(book.rating)
                        ? "fill-[#d4a574] text-[#d4a574]"
                        : "fill-border text-border"
                    )}
                  />
                ))}
              </div>
              <span className="text-sm font-medium text-foreground">
                {book.rating}
              </span>
              <span className="text-sm text-muted-foreground">
                ({book.reviewCount.toLocaleString()} reviews)
              </span>
            </div>

            {/* Price */}
            <div className="mt-6 flex items-baseline gap-3">
              <span className="text-3xl font-bold text-foreground">
                {"₹"}{book.price}
              </span>
              {book.originalPrice && (
                <>
                  <span className="text-xl text-muted-foreground line-through">
                    {"₹"}{book.originalPrice}
                  </span>
                  <span className="rounded-sm bg-[#2a7d6e]/10 px-2 py-0.5 text-sm font-semibold text-[#2a7d6e]">
                    Save {"₹"}
                    {book.originalPrice - book.price}
                  </span>
                </>
              )}
            </div>

            {/* Quantity + Add to Cart */}
            <div className="mt-6 flex flex-wrap items-center gap-4">
              <div className="flex items-center rounded-lg border border-border">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="flex h-11 w-11 items-center justify-center transition-colors hover:bg-secondary"
                  aria-label="Decrease quantity"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="flex h-11 w-12 items-center justify-center border-x border-border text-sm font-medium">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="flex h-11 w-11 items-center justify-center transition-colors hover:bg-secondary"
                  aria-label="Increase quantity"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                className="flex h-11 items-center gap-2 rounded-lg bg-accent px-8 text-sm font-semibold text-accent-foreground transition-colors hover:bg-accent/90"
              >
                <ShoppingCart className="h-4 w-4" />
                Add to Cart
              </button>
            </div>

            {/* Short Description */}
            <div className="mt-8 rounded-lg border border-border bg-card p-6">
              <h2 className="text-lg font-semibold text-card-foreground">
                About This Book
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {book.description}
              </p>

              {/* Long Description */}
              <div className="mt-4">
                {showFullDescription ? (
                  <div className="flex flex-col gap-3">
                    {descriptionParagraphs.map((para, i) => (
                      <p
                        key={i}
                        className="text-sm leading-relaxed text-muted-foreground"
                      >
                        {para}
                      </p>
                    ))}
                    <button
                      onClick={() => setShowFullDescription(false)}
                      className="self-start text-sm font-medium text-accent transition-colors hover:text-accent/80"
                    >
                      Show Less
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setShowFullDescription(true)}
                    className="text-sm font-medium text-accent transition-colors hover:text-accent/80"
                  >
                    Read Full Description
                  </button>
                )}
              </div>
            </div>

            {/* Book Details */}
            <div className="mt-6 rounded-lg border border-border bg-card p-6">
              <h2 className="text-lg font-semibold text-card-foreground">
                Product Details
              </h2>
              <dl className="mt-4 grid gap-3 sm:grid-cols-2">
                <div className="flex items-center gap-3">
                  <BookOpen className="h-4 w-4 shrink-0 text-muted-foreground" />
                  <div>
                    <dt className="text-xs uppercase tracking-wider text-muted-foreground">
                      Pages
                    </dt>
                    <dd className="text-sm font-medium text-card-foreground">
                      {book.pages}
                    </dd>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Building2 className="h-4 w-4 shrink-0 text-muted-foreground" />
                  <div>
                    <dt className="text-xs uppercase tracking-wider text-muted-foreground">
                      Publisher
                    </dt>
                    <dd className="text-sm font-medium text-card-foreground">
                      {book.publisher}
                    </dd>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar className="h-4 w-4 shrink-0 text-muted-foreground" />
                  <div>
                    <dt className="text-xs uppercase tracking-wider text-muted-foreground">
                      Published
                    </dt>
                    <dd className="text-sm font-medium text-card-foreground">
                      {new Date(book.publishDate).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </dd>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Globe className="h-4 w-4 shrink-0 text-muted-foreground" />
                  <div>
                    <dt className="text-xs uppercase tracking-wider text-muted-foreground">
                      Language
                    </dt>
                    <dd className="text-sm font-medium text-card-foreground">
                      {book.language}
                    </dd>
                  </div>
                </div>
                <div className="flex items-center gap-3 sm:col-span-2">
                  <Hash className="h-4 w-4 shrink-0 text-muted-foreground" />
                  <div>
                    <dt className="text-xs uppercase tracking-wider text-muted-foreground">
                      ISBN
                    </dt>
                    <dd className="text-sm font-medium text-card-foreground">
                      {book.isbn}
                    </dd>
                  </div>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </section>

      {/* Related Books */}
      {relatedBooks.length > 0 && (
        <section className="border-t border-border bg-secondary/30">
          <div className="mx-auto max-w-7xl px-4 py-14 lg:px-8">
            <h2 className="mb-6 text-2xl font-bold font-serif text-foreground">
              More in {book.category}
            </h2>
            <div className="grid gap-5 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
              {relatedBooks.map((b) => (
                <BookCard key={b.id} book={b} />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
