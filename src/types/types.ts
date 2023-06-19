export type Pages = {
  pathname: string
  name: string
  pages?: {
    pathname: string
    name: string
  }[]
}[]

export type NavItem = {
  name: string
  pathname: string
  disabled?: boolean
}

export type SidebarNavItem = {
  name: string
  pathname: string
  disabled?: boolean
  external?: boolean
} & (
  | {
      pathname: string
      pages?: never
    }
  | {
      pathname?: string
      pages: NavItem[]
    }
)
