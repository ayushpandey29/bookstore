"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { BookOpen, Lock, Eye, EyeOff, ShieldCheck } from "lucide-react"

export default function AdminLoginPage() {
  const router = useRouter()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!username.trim() || !password.trim()) {
      setError("Please enter both username and password")
      return
    }

    setLoading(true)
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      })

      const data = await res.json()

      if (data.success) {
        router.push("/admin/dashboard")
      } else {
        setError(data.error || "Invalid credentials")
      }
    } catch {
      setError("Login failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="mb-8 flex flex-col items-center gap-3">
          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-accent/10">
            <ShieldCheck className="h-7 w-7 text-accent" />
          </div>
          <div className="flex items-center gap-2">
            <BookOpen className="h-6 w-6 text-accent" />
            <span className="text-xl font-bold font-serif text-foreground">BooksCart</span>
          </div>
          <p className="text-sm text-muted-foreground">Admin Panel</p>
        </div>

        {/* Login Card */}
        <div className="rounded-xl border border-border bg-card p-8 shadow-sm">
          <h1 className="text-center text-2xl font-bold font-serif text-card-foreground">
            Admin Login
          </h1>
          <p className="mt-2 text-center text-sm text-muted-foreground">
            Sign in to manage orders and verify payments
          </p>

          <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
            <div>
              <label htmlFor="admin-username" className="block text-sm font-medium text-foreground">
                Username
              </label>
              <input
                id="admin-username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter admin username"
                className="mt-1.5 h-11 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground outline-none transition-all focus:border-accent focus:ring-1 focus:ring-accent"
                autoComplete="username"
              />
            </div>

            <div>
              <label htmlFor="admin-password" className="block text-sm font-medium text-foreground">
                Password
              </label>
              <div className="relative mt-1.5">
                <input
                  id="admin-password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter admin password"
                  className="h-11 w-full rounded-lg border border-border bg-background px-3 pr-10 text-sm text-foreground outline-none transition-all focus:border-accent focus:ring-1 focus:ring-accent"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-md text-muted-foreground transition-colors hover:text-foreground"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="rounded-lg border border-destructive/20 bg-destructive/5 px-4 py-3">
                <p className="text-sm text-destructive">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="mt-2 flex h-11 w-full items-center justify-center rounded-lg bg-accent text-sm font-semibold text-accent-foreground transition-colors hover:bg-accent/90 disabled:opacity-60"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                  </svg>
                  Signing in...
                </span>
              ) : (
                <>
                  <Lock className="mr-2 h-4 w-4" />
                  Sign In
                </>
              )}
            </button>
          </form>
        </div>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          Authorized personnel only. All access is logged.
        </p>
      </div>
    </div>
  )
}
