import { ReactNode } from "react"
import { ThemeProvider } from "@/components/ThemeProvider"
import { Inter as FontSans } from "next/font/google"
import { cn } from "@/lib/utils"

import "./global.css"
import { TailwindIndicator } from "@/components/tailwind-indicator"

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
})

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable
        )}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
          <TailwindIndicator />
        </ThemeProvider>
      </body>
    </html>
  )
}
