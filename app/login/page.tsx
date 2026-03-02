"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { BookOpen, Eye, EyeOff, ArrowRight, Check } from "lucide-react"
import { useAuthStore } from "@/lib/auth-store"

export default function LoginPage() {
  const router = useRouter()
  const login = useAuthStore((s) => s.login)
  const user = useAuthStore((s) => s.user)
  const isHydrated = useAuthStore((s) => s.isHydrated)
  const hydrate = useAuthStore((s) => s.hydrate)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    hydrate()
  }, [hydrate])

  useEffect(() => {
    if (isHydrated && user && !success) {
      router.replace("/")
    }
  }, [isHydrated, user, success, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!email.trim()) {
      setError("Please enter your email address.")
      return
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address.")
      return
    }
    if (!password.trim()) {
      setError("Please enter your password.")
      return
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.")
      return
    }

    setLoading(true)
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })

      const data = await res.json()

      if (res.ok && data.success) {
        login(data.user)
        setSuccess(true)
        setTimeout(() => {
          router.push("/")
        }, 800)
      } else {
        setError(data.error || "Invalid email or password.")
      }
    } catch (err) {
      setError("An error occurred. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center px-4 py-12">
        <div className="w-full max-w-md text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#2a7d6e]/10">
            <Check className="h-8 w-8 text-[#2a7d6e]" />
          </div>
          <h1 className="mt-6 text-2xl font-bold font-serif text-foreground">
            Welcome Back!
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Signed in successfully. Redirecting...
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 transition-opacity hover:opacity-80"
          >
            <BookOpen className="h-8 w-8 text-accent" />
            <span className="text-2xl font-bold font-serif text-foreground">
              BooksCart
            </span>
          </Link>
          <h1 className="mt-6 text-2xl font-bold font-serif text-foreground">
            Welcome Back
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Sign in to your account to continue
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-8" noValidate>
          {error && (
            <div
              className="mb-4 rounded-lg border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive"
              role="alert"
            >
              {error}
            </div>
          )}

          <div className="flex flex-col gap-4">
            <div>
              <label
                htmlFor="login-email"
                className="block text-sm font-medium text-foreground"
              >
                Email Address
              </label>
              <input
                id="login-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="mt-1.5 h-11 w-full rounded-lg border border-border bg-card px-4 text-sm text-card-foreground placeholder:text-muted-foreground outline-none transition-all focus:border-accent focus:ring-1 focus:ring-accent"
                autoComplete="email"
                autoFocus
              />
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="login-password"
                  className="block text-sm font-medium text-foreground"
                >
                  Password
                </label>
                <button
                  type="button"
                  className="text-xs font-medium text-accent transition-colors hover:text-accent/80"
                >
                  Forgot Password?
                </button>
              </div>
              <div className="relative mt-1.5">
                <input
                  id="login-password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="h-11 w-full rounded-lg border border-border bg-card px-4 pr-11 text-sm text-card-foreground placeholder:text-muted-foreground outline-none transition-all focus:border-accent focus:ring-1 focus:ring-accent"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-6 flex h-11 w-full items-center justify-center rounded-lg bg-accent text-sm font-semibold text-accent-foreground transition-colors hover:bg-accent/90 disabled:opacity-60"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <svg
                  className="h-4 w-4 animate-spin"
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
                Signing in...
              </span>
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="relative mt-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-3 text-muted-foreground">
              New to BooksCart?
            </span>
          </div>
        </div>

        <Link
          href="/signup"
          className="mt-6 flex h-11 w-full items-center justify-center rounded-lg border border-border bg-card text-sm font-semibold text-card-foreground transition-colors hover:bg-secondary"
        >
          Create an Account <ArrowRight className="ml-2 h-4 w-4" />
        </Link>
      </div>
    </div>
  )
}
