import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Admin Panel | BooksCart",
  description: "BooksCart administration panel for order management",
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
