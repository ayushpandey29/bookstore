"use client"

import { useEffect, useRef } from "react"
import { CheckCircle, X } from "lucide-react"
import Link from "next/link"
import { useCartStore } from "@/lib/cart-store"

export function CartNotification() {
  const notification = useCartStore((s) => s.notification)
  const dismiss = useCartStore((s) => s.dismissNotification)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    // Clear any existing timer
    if (timerRef.current) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }

    if (!notification) return

    // Set auto-dismiss timer for 3 seconds
    timerRef.current = setTimeout(() => {
      dismiss()
      timerRef.current = null
    }, 3000)

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current)
        timerRef.current = null
      }
    }
  }, [notification, dismiss])

  if (!notification) return null

  return (
    <div
      role="alert"
      aria-live="polite"
      className="fixed right-4 top-20 z-[100] w-80 animate-in slide-in-from-right-full fade-in duration-300 rounded-lg border border-border bg-card p-4 shadow-lg"
    >
      <div className="flex items-start gap-3">
        <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-[#2a7d6e]" />
        <div className="flex-1">
          <p className="text-sm font-medium text-card-foreground">
            Added to cart
          </p>
          <p className="mt-0.5 text-sm text-muted-foreground line-clamp-1">
            {notification.book.title}
          </p>
          <Link
            href="/cart"
            onClick={dismiss}
            className="mt-2 inline-block text-sm font-medium text-accent transition-colors hover:text-accent/80"
          >
            View Cart
          </Link>
        </div>
        <button
          onClick={dismiss}
          className="flex h-6 w-6 shrink-0 items-center justify-center rounded-sm transition-colors hover:bg-secondary"
          aria-label="Dismiss notification"
        >
          <X className="h-4 w-4 text-muted-foreground" />
        </button>
      </div>
    </div>
  )
}
