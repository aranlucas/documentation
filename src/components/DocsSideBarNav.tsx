"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { SidebarNavItem } from "@/types/types"

export interface DocsSidebarNavProps {
  items: SidebarNavItem[]
}

export function DocsSidebarNav({ items }: DocsSidebarNavProps) {
  const pathname = usePathname()

  return items.length ? (
    <div className="w-full">
      {items.map((item, index) => (
        <div key={index} className={cn("pb-8")}>
          <h4 className="mb-1 rounded-md px-2 py-1 text-sm font-medium">
            <Link href={item.pathname}> {item.name}</Link>
          </h4>
          {item.pages ? (
            <DocsSidebarNavItems items={item.pages} pathname={pathname} />
          ) : null}
        </div>
      ))}
    </div>
  ) : null
}

interface DocsSidebarNavItemsProps {
  items: SidebarNavItem[]
  pathname: string | null
}

export function DocsSidebarNavItems({
  items,
  pathname,
}: DocsSidebarNavItemsProps) {
  return items?.length ? (
    <div className="grid grid-flow-row auto-rows-max text-sm">
      {items.map((item, index) =>
        !item.disabled && item.pathname ? (
          <Link
            key={index}
            href={item.pathname}
            className={cn(
              "flex w-full items-center rounded-md p-2 hover:underline",
              {
                "bg-muted": pathname === item.pathname,
              }
            )}
            target={item.external ? "_blank" : ""}
            rel={item.external ? "noreferrer" : ""}
          >
            {item.name}
          </Link>
        ) : (
          <span className="flex w-full cursor-not-allowed items-center rounded-md p-2 opacity-60">
            {item.name}
          </span>
        )
      )}
    </div>
  ) : null
}
