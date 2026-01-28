"use client"

import Link from "next/link"
import { useRef, useState } from "react"
import { usePathname } from "next/navigation"
import { ChevronDown } from "lucide-react"
import { HomeIcon, type HomeIconHandle } from "@/components/ui/home"
import { CartIcon as ShoppingCartIcon, type CartIconHandle } from "@/components/ui/cart"
import { BoxIcon, type BoxIconHandle } from "@/components/ui/box"
import { UsersIcon, type UsersIconHandle } from "@/components/ui/users"
import { ChartLineIcon, type ChartLineIconHandle } from "@/components/ui/chart-line"
import { SettingsIcon, type SettingsIconHandle } from "@/components/ui/settings"
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@/components/ui/collapsible"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
  SidebarHeader,
  useSidebar,
} from "@/components/ui/sidebar"
import { cn } from "@/lib/utils"

type IconHandle =
  | HomeIconHandle
  | CartIconHandle
  | BoxIconHandle
  | UsersIconHandle
  | ChartLineIconHandle
  | SettingsIconHandle

type MenuItemType = {
  title: string
  url?: string
  icon: typeof HomeIcon
  items?: {
    title: string
    url: string
  }[]
}

const menuItems: MenuItemType[] = [
  {
    title: "Dashboard",
    url: "/auth/dashboard",
    icon: HomeIcon,
  },
  {
    title: "Orders",
    url: "/auth/orders",
    icon: ShoppingCartIcon,
  },
  {
    title: "Products",
    url: "/auth/products",
    icon: BoxIcon,
  },
  {
    title: "Customers",
    url: "/auth/customers",
    icon: UsersIcon,
  },
  {
    title: "Analytics",
    icon: ChartLineIcon,
    items: [
      {
        title: "Live",
        url: "/auth/analytics/live",
      },
      {
        title: "Reports",
        url: "/auth/analytics/reports",
      },
    ],
  },
  {
    title: "Settings",
    url: "/auth/settings",
    icon: SettingsIcon,
  },
]

function MenuItem({ item }: { item: MenuItemType }) {
  const iconRef = useRef<IconHandle>(null)
  const Icon = item.icon
  const { isMobile, setOpenMobile } = useSidebar()

  const handleMouseEnter = () => {
    iconRef.current?.startAnimation()
  }

  const handleMouseLeave = () => {
    iconRef.current?.stopAnimation()
  }

  const handleClick = () => {
    // Close sidebar on mobile when clicking a navigation link
    if (isMobile) {
      setOpenMobile(false)
    }
  }

  if (!item.url) return null

  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        asChild
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <Link href={item.url} onClick={handleClick}>
          <Icon ref={iconRef} size={20} />
          <span>{item.title}</span>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  )
}

function MenuItemWithSubmenu({ item }: { item: MenuItemType }) {
  const iconRef = useRef<IconHandle>(null)
  const Icon = item.icon
  const { isMobile, setOpenMobile } = useSidebar()
  const pathname = usePathname()

  // Check if any submenu item is active
  const isActive =
    item.items?.some((subItem) => pathname.startsWith(subItem.url)) ?? false

  // Default open if active
  const [open, setOpen] = useState(isActive)

  const handleMouseEnter = () => {
    iconRef.current?.startAnimation()
  }

  const handleMouseLeave = () => {
    iconRef.current?.stopAnimation()
  }

  const handleSubItemClick = () => {
    if (isMobile) {
      setOpenMobile(false)
    }
  }

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <SidebarMenuItem>
        <CollapsibleTrigger asChild>
          <SidebarMenuButton
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            isActive={isActive}
          >
            <Icon ref={iconRef} size={20} />
            <span>{item.title}</span>
            <ChevronDown
              className={cn(
                "ml-auto size-4 transition-transform",
                open && "rotate-180"
              )}
            />
          </SidebarMenuButton>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <SidebarMenuSub>
            {item.items?.map((subItem) => (
              <SidebarMenuSubItem key={subItem.title}>
                <SidebarMenuSubButton
                  asChild
                  isActive={pathname === subItem.url}
                >
                  <Link href={subItem.url} onClick={handleSubItemClick}>
                    <span>{subItem.title}</span>
                  </Link>
                </SidebarMenuSubButton>
              </SidebarMenuSubItem>
            ))}
          </SidebarMenuSub>
        </CollapsibleContent>
      </SidebarMenuItem>
    </Collapsible>
  )
}

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarHeader className="border-b border-border p-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <span className="text-sm font-bold">YZY</span>
          </div>
          <span className="font-bold">Admin</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) =>
                item.items ? (
                  <MenuItemWithSubmenu key={item.title} item={item} />
                ) : (
                  <MenuItem key={item.title} item={item} />
                )
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
