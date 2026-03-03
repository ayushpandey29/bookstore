import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Admin Panel | BooksKart",
  description: "BooksKart administration panel for order management",
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
