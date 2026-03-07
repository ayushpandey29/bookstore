"use client"

import { useEffect, useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import {
  BookOpen,
  LogOut,
  RefreshCw,
  Package,
  CheckCircle2,
  Truck,
  XCircle,
  Clock,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  Search,
  IndianRupee,
} from "lucide-react"

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

const statusConfig: Record<string, { label: string; color: string; bg: string; icon: React.ElementType }> = {
  processing: { label: "Processing", color: "text-amber-700", bg: "bg-amber-50 border-amber-200", icon: Clock },
  confirmed: { label: "Confirmed", color: "text-blue-700", bg: "bg-blue-50 border-blue-200", icon: CheckCircle2 },
  shipped: { label: "Shipped", color: "text-indigo-700", bg: "bg-indigo-50 border-indigo-200", icon: Truck },
  delivered: { label: "Delivered", color: "text-emerald-700", bg: "bg-emerald-50 border-emerald-200", icon: Package },
  cancelled: { label: "Cancelled", color: "text-red-700", bg: "bg-red-50 border-red-200", icon: XCircle },
}

export default function AdminDashboardPage() {
  const router = useRouter()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [authenticated, setAuthenticated] = useState(false)
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null)
  const [updatingOrder, setUpdatingOrder] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  const checkAuth = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/session")
      if (res.ok) {
        setAuthenticated(true)
        return true
      }
      router.push("/admin")
      return false
    } catch {
      router.push("/admin")
      return false
    }
  }, [router])

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true)
      const res = await fetch("/api/admin/orders")
      if (res.ok) {
        const data = await res.json()
        setOrders(data.orders)
      } else if (res.status === 401) {
        router.push("/admin")
      }
    } catch {
      console.error("Failed to fetch orders")
    } finally {
      setLoading(false)
    }
  }, [router])

  useEffect(() => {
    checkAuth().then((ok) => {
      if (ok) fetchOrders()
    })
  }, [checkAuth, fetchOrders])

  const updateOrderStatus = async (orderId: string, status: string) => {
    setUpdatingOrder(orderId)
    try {
      const res = await fetch("/api/admin/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, status }),
      })
      if (res.ok) {
        setOrders((prev) =>
          prev.map((o) => (o.order_id === orderId ? { ...o, status } : o))
        )
      }
    } catch {
      console.error("Failed to update order")
    } finally {
      setUpdatingOrder(null)
    }
  }

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" })
    router.push("/admin")
  }

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
    const matchesSearch =
      !searchQuery ||
      order.order_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.transaction_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer_email.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || order.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const stats = {
    total: orders.length,
    processing: orders.filter((o) => o.status === "processing").length,
    confirmed: orders.filter((o) => o.status === "confirmed").length,
    delivered: orders.filter((o) => o.status === "delivered").length,
    revenue: orders
      .filter((o) => o.status !== "cancelled")
      .reduce((sum, o) => sum + Number(o.grand_total), 0),
  }

  if (!authenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex items-center gap-2 text-muted-foreground">
          <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
          </svg>
          Verifying access...
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Admin Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent/10">
              <ShieldCheck className="h-5 w-5 text-accent" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-accent" />
                <span className="text-sm font-bold font-serif text-foreground">BooksKart</span>
              </div>
              <p className="text-xs text-muted-foreground">Admin Dashboard</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => fetchOrders()}
              disabled={loading}
              className="flex h-9 items-center gap-1.5 rounded-lg border border-border px-3 text-sm font-medium text-foreground transition-colors hover:bg-secondary disabled:opacity-50"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
              <span className="hidden sm:inline">Refresh</span>
            </button>
            <button
              onClick={handleLogout}
              className="flex h-9 items-center gap-1.5 rounded-lg border border-border px-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-6 lg:px-8">
        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-5">
          <div className="rounded-xl border border-border bg-card p-4">
            <p className="text-xs font-medium text-muted-foreground">Total Orders</p>
            <p className="mt-1 text-2xl font-bold text-card-foreground">{stats.total}</p>
          </div>
          <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
            <p className="text-xs font-medium text-amber-700">Processing</p>
            <p className="mt-1 text-2xl font-bold text-amber-800">{stats.processing}</p>
          </div>
          <div className="rounded-xl border border-blue-200 bg-blue-50 p-4">
            <p className="text-xs font-medium text-blue-700">Confirmed</p>
            <p className="mt-1 text-2xl font-bold text-blue-800">{stats.confirmed}</p>
          </div>
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
            <p className="text-xs font-medium text-emerald-700">Delivered</p>
            <p className="mt-1 text-2xl font-bold text-emerald-800">{stats.delivered}</p>
          </div>
          <div className="col-span-2 rounded-xl border border-border bg-card p-4 sm:col-span-1">
            <p className="text-xs font-medium text-muted-foreground">Revenue</p>
            <p className="mt-1 flex items-center text-2xl font-bold text-card-foreground">
              <IndianRupee className="h-5 w-5" />
              {stats.revenue.toLocaleString("en-IN")}
            </p>
          </div>
        </div>

        {/* Search & Filter */}
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by order ID, name, email, or transaction ID..."
              className="h-10 w-full rounded-lg border border-border bg-card pl-9 pr-3 text-sm text-card-foreground outline-none transition-all focus:border-accent focus:ring-1 focus:ring-accent"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-10 rounded-lg border border-border bg-card px-3 text-sm text-card-foreground outline-none transition-all focus:border-accent focus:ring-1 focus:ring-accent"
          >
            <option value="all">All Statuses</option>
            <option value="processing">Processing</option>
            <option value="confirmed">Confirmed</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        {/* Orders List */}
        <div className="mt-6 flex flex-col gap-3">
          {loading && orders.length === 0 ? (
            <div className="flex flex-col items-center gap-3 py-20">
              <svg className="h-8 w-8 animate-spin text-muted-foreground" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
              </svg>
              <p className="text-sm text-muted-foreground">Loading orders...</p>
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="flex flex-col items-center gap-2 py-20">
              <Package className="h-10 w-10 text-muted-foreground/40" />
              <p className="text-sm font-medium text-muted-foreground">
                {searchQuery || statusFilter !== "all" ? "No orders match your filters" : "No orders yet"}
              </p>
            </div>
          ) : (
            filteredOrders.map((order) => {
              const config = statusConfig[order.status] || statusConfig.processing
              const StatusIcon = config.icon
              const isExpanded = expandedOrder === order.order_id
              const items = getOrderItems(order.items)

              return (
                <div
                  key={order.order_id}
                  className="overflow-hidden rounded-xl border border-border bg-card transition-shadow hover:shadow-sm"
                >
                  {/* Order Header */}
                  <button
                    onClick={() => setExpandedOrder(isExpanded ? null : order.order_id)}
                    className="flex w-full items-center gap-4 p-4 text-left"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-sm font-bold text-card-foreground">{order.order_id}</span>
                        <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${config.bg} ${config.color}`}>
                          <StatusIcon className="h-3 w-3" />
                          {config.label}
                        </span>
                      </div>
                      <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-muted-foreground">
                        <span>{order.customer_name}</span>
                        <span className="hidden sm:inline">|</span>
                        <span className="font-mono">TXN: {order.transaction_id}</span>
                        <span className="hidden sm:inline">|</span>
                        <span>{new Date(order.created_at).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-bold text-card-foreground">
                        {"₹"}{Number(order.grand_total).toLocaleString("en-IN")}
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
                      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {/* Customer Info */}
                        <div>
                          <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Customer</h4>
                          <p className="mt-1 text-sm font-medium text-card-foreground">{order.customer_name}</p>
                          <p className="text-sm text-muted-foreground">{order.customer_email}</p>
                          <p className="text-sm text-muted-foreground">{order.customer_phone}</p>
                        </div>

                        {/* Shipping */}
                        <div>
                          <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Shipping Address</h4>
                          <p className="mt-1 text-sm text-card-foreground">{order.shipping_address}</p>
                        </div>

                        {/* Payment */}
                        <div>
                          <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Payment</h4>
                          <p className="mt-1 text-sm text-card-foreground">
                            <span className="font-medium">Transaction ID:</span>{" "}
                            <span className="font-mono text-accent">{order.transaction_id}</span>
                          </p>
                          <div className="mt-1 flex flex-col gap-0.5 text-sm text-muted-foreground">
                            <span>Subtotal: {"₹"}{Number(order.subtotal).toLocaleString("en-IN")}</span>
                            <span>Tax: {"₹"}{Number(order.tax).toLocaleString("en-IN")}</span>
                            <span className="font-semibold text-card-foreground">
                              Total: {"₹"}{Number(order.grand_total).toLocaleString("en-IN")}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Items */}
                      <div className="mt-4">
                        <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Items ({items.length})</h4>
                        <div className="mt-2 flex flex-col gap-2">
                          {items.map((item, idx) => (
                            <div key={idx} className="flex items-center gap-3 rounded-lg border border-border bg-card p-2.5">
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-card-foreground truncate">{item.title}</p>
                                <p className="text-xs text-muted-foreground">{item.author} | Qty: {item.quantity}</p>
                              </div>
                              <span className="text-sm font-medium text-card-foreground">
                                {"₹"}{(item.price * item.quantity).toLocaleString("en-IN")}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Status Update Actions */}
                      <div className="mt-5 border-t border-border pt-4">
                        <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Update Order Status</h4>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {order.status === "processing" && (
                            <>
                              <button
                                onClick={() => updateOrderStatus(order.order_id, "confirmed")}
                                disabled={updatingOrder === order.order_id}
                                className="flex h-9 items-center gap-1.5 rounded-lg bg-blue-600 px-4 text-sm font-semibold text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
                              >
                                <CheckCircle2 className="h-4 w-4" />
                                Approve Payment
                              </button>
                              <button
                                onClick={() => updateOrderStatus(order.order_id, "cancelled")}
                                disabled={updatingOrder === order.order_id}
                                className="flex h-9 items-center gap-1.5 rounded-lg border border-red-300 bg-red-50 px-4 text-sm font-semibold text-red-700 transition-colors hover:bg-red-100 disabled:opacity-50"
                              >
                                <XCircle className="h-4 w-4" />
                                Reject
                              </button>
                            </>
                          )}
                          {order.status === "confirmed" && (
                            <button
                              onClick={() => updateOrderStatus(order.order_id, "shipped")}
                              disabled={updatingOrder === order.order_id}
                              className="flex h-9 items-center gap-1.5 rounded-lg bg-indigo-600 px-4 text-sm font-semibold text-white transition-colors hover:bg-indigo-700 disabled:opacity-50"
                            >
                              <Truck className="h-4 w-4" />
                              Mark as Shipped
                            </button>
                          )}
                          {order.status === "shipped" && (
                            <button
                              onClick={() => updateOrderStatus(order.order_id, "delivered")}
                              disabled={updatingOrder === order.order_id}
                              className="flex h-9 items-center gap-1.5 rounded-lg bg-emerald-600 px-4 text-sm font-semibold text-white transition-colors hover:bg-emerald-700 disabled:opacity-50"
                            >
                              <Package className="h-4 w-4" />
                              Mark as Delivered
                            </button>
                          )}
                          {(order.status === "delivered" || order.status === "cancelled") && (
                            <p className="flex h-9 items-center text-sm text-muted-foreground">
                              No further actions available for this order.
                            </p>
                          )}
                          {updatingOrder === order.order_id && (
                            <span className="flex h-9 items-center gap-1.5 text-sm text-muted-foreground">
                              <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                              </svg>
                              Updating...
                            </span>
                          )}
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
    </div>
  )
}
