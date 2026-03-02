import type { Metadata, Viewport } from "next"
import { Geist, Geist_Mono, Playfair_Display } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { LayoutShell } from "@/components/layout-shell"
import "./globals.css"

const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
})

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
})

const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
})

export const metadata: Metadata = {
  title: {
    default: "BooksCart - Your Destination for Great Books",
    template: "%s | BooksCart",
  },
  description:
    "Discover, explore, and find your next great read at BooksCart. Browse thousands of titles across fiction, non-fiction, and more.",
}

export const viewport: Viewport = {
  themeColor: "#faf8f5",
  width: "device-width",
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${playfairDisplay.variable} font-sans antialiased`}
      >
        <LayoutShell>{children}</LayoutShell>
        <Analytics />
      </body>
    </html>
  )
}
