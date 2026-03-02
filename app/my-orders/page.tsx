"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
    Package,
    CheckCircle2,
    Truck,
    Clock,
    XCircle,
    ArrowLeft,
    ChevronDown,
    ChevronUp,
    Search,
    ShoppingBag,
    IndianRupee,
} from "lucide-react"
import { useAuthStore } from "@/lib/auth-store"

interface OrderItem {
    bookId: string
    title: string
    author: string
    price: number
    quantity: number
    cover: string
}

interface Order {
    id: number
    order_id: string
    customer_name: string
    customer_email: string
    customer_phone: string
    shipping_address: string
    transaction_id: string
    items: OrderItem[] | string
    subtotal: number
    shipping: number
    tax: number
    grand_total: number
    status: string
    created_at: string
    updated_at: string
}

const statusConfig: Record<
    string,
    { label: string; color: string; bg: string; icon: React.ElementType; description: string }
> = {
    processing: {
        label: "Processing",
        color: "text-amber-700",
        bg: "bg-amber-50 border-amber-200",
        icon: Clock,
        description: "Your order is being reviewed and payment is being verified.",
    },
    confirmed: {
        label: "Confirmed",
        color: "text-blue-700",
        bg: "bg-blue-50 border-blue-200",
        icon: CheckCircle2,
        description: "Payment verified! Your order is being prepared.",
    },
    shipped: {
        label: "Shipped",
        color: "text-indigo-700",
        bg: "bg-indigo-50 border-indigo-200",
        icon: Truck,
        description: "Your order has been shipped and is on its way!",
    },
    delivered: {
        label: "Delivered",
        color: "text-emerald-700",
        bg: "bg-emerald-50 border-emerald-200",
        icon: Package,
        description: "Your order has been delivered. Enjoy your books!",
    },
    cancelled: {
        label: "Cancelled",
        color: "text-red-700",
        bg: "bg-red-50 border-red-200",
        icon: XCircle,
        description: "This order has been cancelled.",
    },
}

const statusSteps = ["processing", "confirmed", "shipped", "delivered"]

export default function MyOrdersPage() {
    const router = useRouter()
    const user = useAuthStore((s) => s.user)
    const isHydrated = useAuthStore((s) => s.isHydrated)
    const hydrate = useAuthStore((s) => s.hydrate)

    const [orders, setOrders] = useState<Order[]>([])
    const [loading, setLoading] = useState(true)
    const [expandedOrder, setExpandedOrder] = useState<string | null>(null)
    const [searchQuery, setSearchQuery] = useState("")

    useEffect(() => {
        hydrate()
    }, [hydrate])

    const fetchOrders = useCallback(async () => {
        if (!user?.email) return
        try {
            setLoading(true)
            const res = await fetch(`/api/orders?email=${encodeURIComponent(user.email)}`)
            if (res.ok) {
                const data = await res.json()
                setOrders(data.orders || [])
            }
        } catch {
            console.error("Failed to fetch orders")
        } finally {
            setLoading(false)
        }
    }, [user?.email])

    useEffect(() => {
        if (isHydrated && user) {
            fetchOrders()
        } else if (isHydrated && !user) {
            setLoading(false)
        }
    }, [isHydrated, user, fetchOrders])

    const getOrderItems = (items: OrderItem[] | string): OrderItem[] => {
        if (typeof items === "string") {
            try {
                return JSON.parse(items)
            } catch {
                return []
            }
        }
        return items
    }

    const filteredOrders = orders.filter((order) => {
        if (!searchQuery) return true
        const q = searchQuery.toLowerCase()
        return (
            order.order_id.toLowerCase().includes(q) ||
            order.transaction_id?.toLowerCase().includes(q)
        )
    })

    const getStepIndex = (status: string) => statusSteps.indexOf(status)

    // Not logged in
    if (isHydrated && !user) {
        return (
            <div className="mx-auto max-w-7xl px-4 py-20 text-center lg:px-8">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-secondary">
                    <ShoppingBag className="h-8 w-8 text-muted-foreground" />
                </div>
                <h1 className="mt-6 text-2xl font-bold font-serif text-foreground">
                    Sign in to view your orders
                </h1>
                <p className="mt-2 text-sm text-muted-foreground">
                    Log in with your email to see your order history and track shipments.
                </p>
                <Link
                    href="/login"
                    className="mt-6 inline-flex items-center gap-2 rounded-lg bg-accent px-6 py-3 text-sm font-semibold text-accent-foreground transition-colors hover:bg-accent/90"
                >
                    Sign In
                </Link>
            </div>
        )
    }

    return (
        <div className="mx-auto max-w-4xl px-4 py-10 lg:px-8">
            {/* Header */}
            <div className="flex items-center gap-3">
                <button
                    onClick={() => router.back()}
                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-border transition-colors hover:bg-secondary"
                    aria-label="Go back"
                >
                    <ArrowLeft className="h-4 w-4" />
                </button>
                <div>
                    <h1 className="text-2xl font-bold font-serif text-foreground">
                        My Orders
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Track and manage your orders
                    </p>
                </div>
            </div>

            {/* Search */}
            {orders.length > 0 && (
                <div className="relative mt-6">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search by order ID or transaction ID..."
                        className="h-10 w-full rounded-lg border border-border bg-card pl-9 pr-3 text-sm text-card-foreground outline-none transition-all focus:border-accent focus:ring-1 focus:ring-accent"
                    />
                </div>
            )}

            {/* Orders List */}
            <div className="mt-6 flex flex-col gap-4">
                {loading ? (
                    <div className="flex flex-col items-center gap-3 py-20">
                        <svg
                            className="h-8 w-8 animate-spin text-muted-foreground"
                            viewBox="0 0 24 24"
                            fill="none"
                        >
                            <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                            />
                            <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                            />
                        </svg>
                        <p className="text-sm text-muted-foreground">
                            Loading your orders...
                        </p>
                    </div>
                ) : filteredOrders.length === 0 ? (
                    <div className="flex flex-col items-center gap-3 py-20">
                        <ShoppingBag className="h-12 w-12 text-muted-foreground/30" />
                        <h2 className="text-lg font-semibold text-foreground">
                            {searchQuery ? "No orders found" : "No orders yet"}
                        </h2>
                        <p className="text-sm text-muted-foreground">
                            {searchQuery
                                ? "Try a different search term."
                                : "When you place an order, it will appear here."}
                        </p>
                        {!searchQuery && (
                            <Link
                                href="/"
                                className="mt-2 inline-flex items-center gap-2 rounded-lg bg-accent px-5 py-2.5 text-sm font-semibold text-accent-foreground transition-colors hover:bg-accent/90"
                            >
                                Browse Books
                            </Link>
                        )}
                    </div>
                ) : (
                    filteredOrders.map((order) => {
                        const config =
                            statusConfig[order.status] || statusConfig.processing
                        const StatusIcon = config.icon
                        const isExpanded = expandedOrder === order.order_id
                        const items = getOrderItems(order.items)
                        const currentStep = getStepIndex(order.status)
                        const isCancelled = order.status === "cancelled"

                        return (
                            <div
                                key={order.order_id}
                                className="overflow-hidden rounded-xl border border-border bg-card transition-shadow hover:shadow-sm"
                            >
                                {/* Order Header */}
                                <button
                                    onClick={() =>
                                        setExpandedOrder(isExpanded ? null : order.order_id)
                                    }
                                    className="flex w-full items-center gap-4 p-4 text-left"
                                >
                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-secondary">
                                        <StatusIcon className={`h-5 w-5 ${config.color}`} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex flex-wrap items-center gap-2">
                                            <span className="text-sm font-bold text-card-foreground">
                                                {order.order_id}
                                            </span>
                                            <span
                                                className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${config.bg} ${config.color}`}
                                            >
                                                <StatusIcon className="h-3 w-3" />
                                                {config.label}
                                            </span>
                                        </div>
                                        <p className="mt-0.5 text-xs text-muted-foreground">
                                            {new Date(order.created_at).toLocaleDateString("en-IN", {
                                                day: "numeric",
                                                month: "long",
                                                year: "numeric",
                                            })}
                                            {" · "}
                                            {items.length} {items.length === 1 ? "item" : "items"}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className="flex items-center text-sm font-bold text-card-foreground">
                                            <IndianRupee className="h-3.5 w-3.5" />
                                            {Number(order.grand_total).toLocaleString("en-IN")}
                                        </span>
                                        {isExpanded ? (
                                            <ChevronUp className="h-4 w-4 text-muted-foreground" />
                                        ) : (
                                            <ChevronDown className="h-4 w-4 text-muted-foreground" />
                                        )}
                                    </div>
                                </button>

                                {/* Expanded Details */}
                                {isExpanded && (
                                    <div className="border-t border-border bg-secondary/30 p-4">
                                        {/* Status Message */}
                                        <div
                                            className={`rounded-lg border p-3 ${config.bg}`}
                                        >
                                            <p className={`text-sm font-medium ${config.color}`}>
                                                {config.description}
                                            </p>
                                        </div>

                                        {/* Progress Tracker */}
                                        {!isCancelled && (
                                            <div className="mt-5">
                                                <div className="flex items-center justify-between">
                                                    {statusSteps.map((step, idx) => {
                                                        const stepConf =
                                                            statusConfig[step] || statusConfig.processing
                                                        const StepIcon = stepConf.icon
                                                        const isActive = idx <= currentStep
                                                        return (
                                                            <div
                                                                key={step}
                                                                className="flex flex-1 flex-col items-center"
                                                            >
                                                                <div
                                                                    className={`flex h-8 w-8 items-center justify-center rounded-full border-2 transition-colors ${isActive
                                                                            ? `${stepConf.bg} ${stepConf.color} border-current`
                                                                            : "border-border bg-card text-muted-foreground/40"
                                                                        }`}
                                                                >
                                                                    <StepIcon className="h-4 w-4" />
                                                                </div>
                                                                <span
                                                                    className={`mt-1.5 text-[10px] font-semibold ${isActive
                                                                            ? stepConf.color
                                                                            : "text-muted-foreground/40"
                                                                        }`}
                                                                >
                                                                    {stepConf.label}
                                                                </span>
                                                            </div>
                                                        )
                                                    })}
                                                </div>
                                            </div>
                                        )}

                                        {/* Items */}
                                        <div className="mt-5">
                                            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                                Items ({items.length})
                                            </h4>
                                            <div className="mt-2 flex flex-col gap-2">
                                                {items.map((item, idx) => (
                                                    <div
                                                        key={idx}
                                                        className="flex items-center gap-3 rounded-lg border border-border bg-card p-3"
                                                    >
                                                        <div className="flex-1 min-w-0">
                                                            <p className="text-sm font-medium text-card-foreground truncate">
                                                                {item.title}
                                                            </p>
                                                            <p className="text-xs text-muted-foreground">
                                                                {item.author} · Qty: {item.quantity}
                                                            </p>
                                                        </div>
                                                        <span className="flex items-center text-sm font-medium text-card-foreground">
                                                            {"₹"}
                                                            {(item.price * item.quantity).toLocaleString(
                                                                "en-IN"
                                                            )}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Order Summary */}
                                        <div className="mt-4 grid gap-4 sm:grid-cols-2">
                                            <div>
                                                <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                                    Shipping To
                                                </h4>
                                                <p className="mt-1 text-sm text-card-foreground">
                                                    {order.shipping_address}
                                                </p>
                                            </div>
                                            <div>
                                                <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                                    Payment
                                                </h4>
                                                <p className="mt-1 text-sm text-card-foreground">
                                                    <span className="font-medium">TXN:</span>{" "}
                                                    <span className="font-mono text-accent">
                                                        {order.transaction_id}
                                                    </span>
                                                </p>
                                                <div className="mt-1 flex flex-col gap-0.5 text-sm text-muted-foreground">
                                                    <span>
                                                        Subtotal: {"₹"}
                                                        {Number(order.subtotal).toLocaleString("en-IN")}
                                                    </span>
                                                    <span>
                                                        Shipping:{" "}
                                                        {Number(order.shipping) === 0
                                                            ? "Free"
                                                            : `₹${order.shipping}`}
                                                    </span>
                                                    <span>
                                                        Tax: {"₹"}
                                                        {Number(order.tax).toLocaleString("en-IN")}
                                                    </span>
                                                    <span className="font-semibold text-card-foreground">
                                                        Total: {"₹"}
                                                        {Number(order.grand_total).toLocaleString("en-IN")}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )
                    })
                )}
            </div>
        </div>
    )
}
