"use client"

import Link from "next/link"
import { Minus, Plus, Trash2, ArrowLeft, ShoppingCart } from "lucide-react"
import { useCartStore } from "@/lib/cart-store"

export default function CartPage() {
  const items = useCartStore((s) => s.items)
  const removeItem = useCartStore((s) => s.removeItem)
  const updateQuantity = useCartStore((s) => s.updateQuantity)
  const clearCart = useCartStore((s) => s.clearCart)
  const getTotal = useCartStore((s) => s.getTotal)

  const total = getTotal()
  const tax = Math.round(total * 0.05)
  const grandTotal = total + tax

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-center lg:px-8">
        <ShoppingCart className="mx-auto h-16 w-16 text-muted-foreground/30" />
        <h1 className="mt-4 text-2xl font-bold font-serif text-foreground">
          Your Cart is Empty
        </h1>
        <p className="mt-2 text-muted-foreground">
          Looks like you haven't added any books yet.
        </p>
        <Link
          href="/"
          className="mt-6 inline-flex items-center gap-2 rounded-lg bg-accent px-5 py-2.5 text-sm font-semibold text-accent-foreground transition-colors hover:bg-accent/90"
        >
          <ArrowLeft className="h-4 w-4" /> Continue Shopping
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 lg:px-8">
      <nav className="mb-6 flex items-center gap-2 text-sm text-muted-foreground" aria-label="Breadcrumb">
        <Link href="/" className="transition-colors hover:text-foreground">
          Home
        </Link>
        <span>/</span>
        <span className="text-foreground font-medium">Cart</span>
      </nav>

      <h1 className="text-3xl font-bold font-serif text-foreground">
        Shopping Cart
      </h1>
      <p className="mt-1 text-sm text-muted-foreground">
        {items.length} {items.length === 1 ? "item" : "items"} in your cart
      </p>

      <div className="mt-8 flex flex-col gap-8 lg:flex-row">
        {/* Cart items */}
        <div className="flex-1">
          <div className="flex flex-col gap-4">
            {items.map((item) => (
              <div
                key={item.book.id}
                className="flex gap-4 rounded-lg border border-border bg-card p-4"
              >
                <Link href={`/book/${item.book.id}`} className="shrink-0">
                  <img
                    src={item.book.cover}
                    alt={`Cover of ${item.book.title}`}
                    className="h-28 w-20 rounded object-cover"
                    loading="lazy"
                  />
                </Link>
                <div className="flex flex-1 flex-col">
                  <div className="flex items-start justify-between">
                    <div>
                      <Link
                        href={`/book/${item.book.id}`}
                        className="text-sm font-semibold text-card-foreground transition-colors hover:text-accent"
                      >
                        {item.book.title}
                      </Link>
                      <p className="text-sm text-muted-foreground">
                        {item.book.author}
                      </p>
                    </div>
                    <button
                      onClick={() => removeItem(item.book.id)}
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md transition-colors hover:bg-secondary"
                      aria-label={`Remove ${item.book.title} from cart`}
                    >
                      <Trash2 className="h-4 w-4 text-muted-foreground" />
                    </button>
                  </div>

                  <div className="mt-auto flex items-center justify-between pt-2">
                    <div className="flex items-center rounded border border-border">
                      <button
                        onClick={() =>
                          updateQuantity(item.book.id, item.quantity - 1)
                        }
                        className="flex h-8 w-8 items-center justify-center transition-colors hover:bg-secondary"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="flex h-8 w-10 items-center justify-center border-x border-border text-sm font-medium">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateQuantity(item.book.id, item.quantity + 1)
                        }
                        className="flex h-8 w-8 items-center justify-center transition-colors hover:bg-secondary"
                        aria-label="Increase quantity"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>
                    <span className="text-sm font-bold text-card-foreground">
                      {"₹"}{item.book.price * item.quantity}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 flex items-center justify-between">
            <Link
              href="/"
              className="flex items-center gap-1 text-sm font-medium text-accent transition-colors hover:text-accent/80"
            >
              <ArrowLeft className="h-4 w-4" /> Continue Shopping
            </Link>
            <button
              onClick={clearCart}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-destructive"
            >
              Clear Cart
            </button>
          </div>
        </div>

        {/* Order summary */}
        <div className="lg:w-80">
          <div className="sticky top-24 rounded-lg border border-border bg-card p-6">
            <h2 className="text-lg font-semibold text-card-foreground">
              Order Summary
            </h2>
            <dl className="mt-4 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <dt className="text-sm text-muted-foreground">Subtotal</dt>
                <dd className="text-sm font-medium text-card-foreground">
                  {"₹"}{total}
                </dd>
              </div>

              <div className="flex items-center justify-between">
                <dt className="text-sm text-muted-foreground">
                  Estimated GST
                </dt>
                <dd className="text-sm font-medium text-card-foreground">
                  {"₹"}{tax}
                </dd>
              </div>
              <div className="border-t border-border pt-3">
                <div className="flex items-center justify-between">
                  <dt className="text-base font-semibold text-card-foreground">
                    Total
                  </dt>
                  <dd className="text-base font-bold text-card-foreground">
                    {"₹"}{grandTotal}
                  </dd>
                </div>
              </div>
            </dl>



            <Link
              href="/checkout"
              className="mt-5 flex w-full items-center justify-center rounded-lg bg-accent py-3 text-sm font-semibold text-accent-foreground transition-colors hover:bg-accent/90"
            >
              Proceed to Checkout
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
