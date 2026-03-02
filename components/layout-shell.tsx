"use client"

import { usePathname } from "next/navigation"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { CartNotification } from "@/components/cart-notification"

export function LayoutShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isAdmin = pathname.startsWith("/admin")

  if (isAdmin) {
    return <main className="min-h-screen">{children}</main>
  }

  return (
    <>
      <SiteHeader />
      <CartNotification />
      <main className="min-h-[calc(100vh-4rem)]">{children}</main>
      <SiteFooter />
    </>
  )
}
