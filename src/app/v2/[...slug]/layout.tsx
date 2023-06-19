import Image from "next/image"
import { ReactNode } from "react"
import icon from "../../../../public/images/logo/react-hook-form-logo-only.svg"
import Link from "next/link"
import { SearchBar } from "@/components/SearchBar"
import { ThemeToggle } from "@/components/theme-toggle"
import { IconGitHub, IconTwitter } from "@/components/ui/icons"

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 flex h-16 w-full items-center justify-between border-b bg-background">
        <div className="container flex h-14 items-center">
          <Link className="mr-6 flex items-center space-x-2" href="/">
            <Image src={icon} alt="React Hook Form logo" className="h-6 w-6" />

            <span className="hidden font-bold sm:inline-block">
              React Hook Form
            </span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            <Link
              className="transition-colors hover:text-foreground/80 text-foreground/60"
              href="/docs"
            >
              Get Started
            </Link>
            <Link
              className="transition-colors hover:text-foreground/80 text-foreground/60"
              href="/docs"
            >
              API
            </Link>
            <Link
              className="transition-colors hover:text-foreground/80 text-foreground/60"
              href="/ts"
            >
              TS
            </Link>
            <Link
              className="transition-colors hover:text-foreground/80 text-foreground/60"
              href="/advanced-usage"
            >
              Advanced
            </Link>

            <Link
              className="transition-colors hover:text-foreground/80 text-foreground/60"
              href="/faqs"
            >
              FAQ
            </Link>

            <Link
              className="transition-colors hover:text-foreground/80 text-foreground/60"
              href="/faqs"
            >
              Tools
            </Link>
            <Link
              className="transition-colors hover:text-foreground/80 text-foreground/60"
              href="/resources"
            >
              Resources
            </Link>
          </nav>
          <div className="flex flex-1 items-center justify-between space-x-2 sm:space-x-4 md:justify-end">
            <SearchBar />
            <nav className="flex items-center space-x-1">
              <Link href="https://github.com/react-hook-form/react-hook-form">
                <div className="inline-flex items-center justify-center text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background hover:bg-accent hover:text-accent-foreground h-9 rounded-md w-9 px-0">
                  <IconGitHub />
                  <span className="sr-only">GitHub</span>
                </div>
              </Link>
              <Link href="https://twitter.com/HookForm">
                <div className="inline-flex items-center justify-center text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background hover:bg-accent hover:text-accent-foreground h-9 rounded-md w-9 px-0">
                  <IconTwitter className="h-5 w-5 " />
                  <span className="sr-only">Twitter</span>
                </div>
              </Link>
              <ThemeToggle />
            </nav>
          </div>
        </div>
      </header>
      <main className="flex-1">{children}</main>
    </div>
  )
}
