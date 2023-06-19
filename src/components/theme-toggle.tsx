"use client"

import * as React from "react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"
import { IconMoon, IconSun } from "@/components/ui/icons"

export function ThemeToggle() {
  const { setTheme, theme } = useTheme()
  const [_, startTransition] = React.useTransition()

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => {
        startTransition(() => {
          setTheme(theme === "light" ? "dark" : "light")
        })
      }}
    >
      <IconMoon className="absolute rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <IconSun className="rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}
