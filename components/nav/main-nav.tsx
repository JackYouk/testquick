"use client"
import Link from "next/link"

import { cn } from "@/lib/utils"
import { usePathname } from "next/navigation";

interface MainNavProps extends React.HTMLAttributes<HTMLElement> {
  className?: string;
}

export function MainNav({
  className,
  ...props
}: MainNavProps) {
  const activePage = usePathname()

  return (
    <nav
      className={cn("flex pl-4 items-center space-x-4 lg:space-x-6", className)}
      {...props}
    >
      {/* <Link
        href="/dashboard"
        className={`text-sm font-medium ${activePage === "/dashboard" ? "" : "text-muted-foreground"} transition-colors hover:text-primary`}
      >
        Overview
      </Link> */}
      <Link
        href="/dashboard/tests"
        className={`text-md font-bold ${activePage.startsWith("/dashboard/tests") ? "" : "text-muted-foreground"} transition-colors hover:text-primary`}
      >
        Tests
      </Link>
      <Link
        href="/dashboard/students"
        className={`text-md font-bold ${activePage.startsWith("/dashboard/students") ? "" : "text-muted-foreground"} transition-colors hover:text-primary`}
      >
        Students
      </Link>
    </nav>
  )
}
