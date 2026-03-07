"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, Lock, Check } from "lucide-react"
import { useCartStore } from "@/lib/cart-store"

export default function CheckoutPage() {
  const items = useCartStore((s) => s.items)
  const getTotal = useCartStore((s) => s.getTotal)
  const clearCart = useCartStore((s) => s.clearCart)

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    transactionId: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)
  const [orderPlaced, setOrderPlaced] = useState(false)
  const [placedOrderId, setPlacedOrderId] = useState("")

  const total = getTotal()
  const tax = Math.round(total * 0.05)
  const grandTotal = total + tax

  if (items.length === 0 && !orderPlaced) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-center lg:px-8">
        <h1 className="text-2xl font-bold font-serif text-foreground">
          Nothing to Checkout
        </h1>
        <p className="mt-2 text-muted-foreground">
          Your cart is empty. Add some books first!
        </p>
        <Link
          href="/"
          className="mt-6 inline-flex items-center gap-2 rounded-lg bg-accent px-5 py-2.5 text-sm font-semibold text-accent-foreground transition-colors hover:bg-accent/90"
        >
          <ArrowLeft className="h-4 w-4" /> Browse Books
        </Link>
      </div>
    )
  }

  if (orderPlaced) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-center lg:px-8">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#2a7d6e]/10">
          <Check className="h-8 w-8 text-[#2a7d6e]" />
        </div>
        <h1 className="mt-6 text-3xl font-bold font-serif text-foreground">
          Order Confirmed!
        </h1>
        <p className="mt-3 text-muted-foreground">
          Thank you for your purchase. Your books are on their way!
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          Order #{placedOrderId}
        </p>
        <p className="mt-2 text-sm text-muted-foreground">
          Your payment is being verified. We will update your order status once confirmed.
        </p>
        <Link
          href="/"
          className="mt-8 inline-flex items-center gap-2 rounded-lg bg-accent px-6 py-3 text-sm font-semibold text-accent-foreground transition-colors hover:bg-accent/90"
        >
          Continue Shopping
        </Link>
      </div>
    )
  }

  const updateField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev }
        delete next[field]
        return next
      })
    }
  }

  const validate = () => {
    const newErrors: Record<string, string> = {}
    if (!formData.firstName.trim()) newErrors.firstName = "First name is required"
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required"
    if (!formData.email.trim()) newErrors.email = "Email is required"
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      newErrors.email = "Enter a valid email"
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required"
    else if (!/^\d{10}$/.test(formData.phone.replace(/\s/g, "")))
      newErrors.phone = "Enter a valid 10-digit phone number"
    if (!formData.address.trim()) newErrors.address = "Address is required"
    if (!formData.city.trim()) newErrors.city = "City is required"
    if (!formData.state.trim()) newErrors.state = "State is required"
    if (!formData.pincode.trim()) newErrors.pincode = "PIN code is required"
    else if (!/^\d{6}$/.test(formData.pincode.replace(/\s/g, "")))
      newErrors.pincode = "Enter a valid 6-digit PIN code"
    if (!formData.transactionId.trim())
      newErrors.transactionId = "UPI Transaction ID is required"
    return newErrors
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const newErrors = validate()
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setLoading(true)
    try {
      const orderItems = items.map((item) => ({
        bookId: item.book.id,
        title: item.book.title,
        author: item.book.author,
        price: item.book.price,
        quantity: item.quantity,
        cover: item.book.cover,
      }))

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: `${formData.firstName} ${formData.lastName}`,
          customerEmail: formData.email,
          customerPhone: formData.phone,
          shippingAddress: `${formData.address}, ${formData.city}, ${formData.state} - ${formData.pincode}`,
          transactionId: formData.transactionId,
          items: orderItems,
          subtotal: total,
          tax,
          grandTotal,
        }),
      })

      const data = await res.json()
      if (data.success) {
        setPlacedOrderId(data.order.order_id)
        clearCart()
        setOrderPlaced(true)
      } else {
        setErrors({ form: data.error || "Something went wrong" })
      }
    } catch {
      setErrors({ form: "Failed to place order. Please try again." })
    } finally {
      setLoading(false)
    }
  }

  const inputClass = (field: string) =>
    `mt-1.5 h-10 w-full rounded-lg border bg-card px-3 text-sm text-card-foreground outline-none transition-all focus:border-accent focus:ring-1 focus:ring-accent ${errors[field] ? "border-destructive" : "border-border"
    }`

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 lg:px-8">
      <nav className="mb-6 flex items-center gap-2 text-sm text-muted-foreground" aria-label="Breadcrumb">
        <Link href="/" className="transition-colors hover:text-foreground">Home</Link>
        <span>/</span>
        <Link href="/cart" className="transition-colors hover:text-foreground">Cart</Link>
        <span>/</span>
        <span className="text-foreground font-medium">Checkout</span>
      </nav>

      <h1 className="text-3xl font-bold font-serif text-foreground">Checkout</h1>

      <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-8 lg:flex-row">
        {/* Form fields */}
        <div className="flex-1 flex flex-col gap-6">
          {/* Shipping Info */}
          <div className="rounded-lg border border-border bg-card p-6">
            <h2 className="text-lg font-semibold text-card-foreground">
              Shipping Information
            </h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-foreground">
                  First Name
                </label>
                <input
                  id="firstName"
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => updateField("firstName", e.target.value)}
                  className={inputClass("firstName")}
                  autoComplete="given-name"
                />
                {errors.firstName && <p className="mt-1 text-xs text-destructive">{errors.firstName}</p>}
              </div>
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-foreground">
                  Last Name
                </label>
                <input
                  id="lastName"
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => updateField("lastName", e.target.value)}
                  className={inputClass("lastName")}
                  autoComplete="family-name"
                />
                {errors.lastName && <p className="mt-1 text-xs text-destructive">{errors.lastName}</p>}
              </div>
              <div>
                <label htmlFor="checkout-email" className="block text-sm font-medium text-foreground">
                  Email
                </label>
                <input
                  id="checkout-email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => updateField("email", e.target.value)}
                  className={inputClass("email")}
                  autoComplete="email"
                />
                {errors.email && <p className="mt-1 text-xs text-destructive">{errors.email}</p>}
              </div>
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-foreground">
                  Phone Number
                </label>
                <input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, "").substring(0, 10)
                    updateField("phone", val)
                  }}
                  placeholder="10-digit mobile number"
                  className={inputClass("phone")}
                  autoComplete="tel"
                />
                {errors.phone && <p className="mt-1 text-xs text-destructive">{errors.phone}</p>}
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="address" className="block text-sm font-medium text-foreground">
                  Street Address
                </label>
                <input
                  id="address"
                  type="text"
                  value={formData.address}
                  onChange={(e) => updateField("address", e.target.value)}
                  className={inputClass("address")}
                  autoComplete="street-address"
                />
                {errors.address && <p className="mt-1 text-xs text-destructive">{errors.address}</p>}
              </div>
              <div>
                <label htmlFor="city" className="block text-sm font-medium text-foreground">
                  City
                </label>
                <input
                  id="city"
                  type="text"
                  value={formData.city}
                  onChange={(e) => updateField("city", e.target.value)}
                  className={inputClass("city")}
                  autoComplete="address-level2"
                />
                {errors.city && <p className="mt-1 text-xs text-destructive">{errors.city}</p>}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="state" className="block text-sm font-medium text-foreground">
                    State
                  </label>
                  <input
                    id="state"
                    type="text"
                    value={formData.state}
                    onChange={(e) => updateField("state", e.target.value)}
                    className={inputClass("state")}
                    autoComplete="address-level1"
                  />
                  {errors.state && <p className="mt-1 text-xs text-destructive">{errors.state}</p>}
                </div>
                <div>
                  <label htmlFor="pincode" className="block text-sm font-medium text-foreground">
                    PIN Code
                  </label>
                  <input
                    id="pincode"
                    type="text"
                    value={formData.pincode}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, "").substring(0, 6)
                      updateField("pincode", val)
                    }}
                    placeholder="6-digit PIN"
                    className={inputClass("pincode")}
                    autoComplete="postal-code"
                  />
                  {errors.pincode && <p className="mt-1 text-xs text-destructive">{errors.pincode}</p>}
                </div>
              </div>
            </div>
          </div>

          {/* UPI Payment */}
          <div className="rounded-lg border border-border bg-card p-6">
            <div className="flex items-center gap-2">
              <Lock className="h-4 w-4 text-muted-foreground" />
              <h2 className="text-lg font-semibold text-card-foreground">
                Pay via UPI
              </h2>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              Scan the QR code below with any UPI app (Paytm, Google Pay, PhonePe, BHIM) to complete your payment of <span className="font-semibold text-foreground">{"₹"}{grandTotal}</span>
            </p>
            <div className="mt-4 flex justify-center">
              <div className="overflow-hidden rounded-xl border border-border bg-white p-2 shadow-sm">
                <Image
                  src="/images/qr.jpg"
                  alt="UPI QR Code - Scan to pay via Paytm, Google Pay, PhonePe, or BHIM"
                  width={320}
                  height={320}
                  className="h-auto w-[280px] sm:w-[320px]"
                  priority
                />
              </div>
            </div>
            <p className="mt-3 text-center text-xs font-medium text-foreground">
              UPI ID: <span className="text-accent underline">7710734000@ptaxis</span>
            </p>
            <div className="mt-5 border-t border-border pt-5">
              <label htmlFor="transactionId" className="block text-sm font-medium text-foreground">
                UPI Transaction ID / Reference Number
              </label>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Enter the transaction ID from your UPI payment confirmation
              </p>
              <input
                id="transactionId"
                type="text"
                value={formData.transactionId}
                onChange={(e) => updateField("transactionId", e.target.value)}
                placeholder="e.g. 412345678901"
                className={inputClass("transactionId")}
              />
              {errors.transactionId && <p className="mt-1 text-xs text-destructive">{errors.transactionId}</p>}
            </div>
          </div>
        </div>

        {/* Order summary sidebar */}
        <div className="lg:w-80">
          <div className="sticky top-24 rounded-lg border border-border bg-card p-6">
            <h2 className="text-lg font-semibold text-card-foreground">
              Order Summary
            </h2>

            <div className="mt-4 flex flex-col gap-3 border-b border-border pb-4">
              {items.map((item) => (
                <div key={item.book.id} className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-card-foreground truncate">
                      {item.book.title}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Qty: {item.quantity}
                    </p>
                  </div>
                  <span className="ml-3 text-sm font-medium text-card-foreground">
                    {"₹"}{item.book.price * item.quantity}
                  </span>
                </div>
              ))}
            </div>

            <dl className="mt-4 flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <dt className="text-sm text-muted-foreground">Subtotal</dt>
                <dd className="text-sm font-medium text-card-foreground">
                  {"₹"}{total}
                </dd>
              </div>

              <div className="flex items-center justify-between">
                <dt className="text-sm text-muted-foreground">GST (5%)</dt>
                <dd className="text-sm font-medium text-card-foreground">
                  {"₹"}{tax}
                </dd>
              </div>
              <div className="border-t border-border pt-3">
                <div className="flex items-center justify-between">
                  <dt className="text-base font-semibold text-card-foreground">Total</dt>
                  <dd className="text-base font-bold text-card-foreground">
                    {"₹"}{grandTotal}
                  </dd>
                </div>
              </div>
            </dl>

            <button
              type="submit"
              disabled={loading}
              className="mt-5 flex h-12 w-full items-center justify-center rounded-lg bg-accent text-sm font-semibold text-accent-foreground transition-colors hover:bg-accent/90 disabled:opacity-60"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                  </svg>
                  Placing Order...
                </span>
              ) : (
                <>
                  <Lock className="mr-2 h-4 w-4" />
                  {"Place Order - ₹"}{grandTotal}
                </>
              )}
            </button>

            {errors.form && (
              <p className="mt-2 text-center text-sm text-destructive">{errors.form}</p>
            )}

            <p className="mt-3 text-center text-xs text-muted-foreground">
              Secure checkout. Pay via UPI for instant confirmation.
            </p>
          </div>
        </div>
      </form>
    </div>
  )
}
