"use client"

import * as React from "react"
import { FontSizeIcon, ZoomInIcon } from "@radix-ui/react-icons"

import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function FontSizeToggle({ className }: React.HTMLAttributes<HTMLElement>) {

    return (
        <div className={className}>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="icon">
                        <ZoomInIcon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all" />
                        <span className="sr-only">Toggle text-size</span>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" >
                    <DropdownMenuItem onClick={() => (document.documentElement.style as any).zoom = "100%"}>
                        100%
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => (document.documentElement.style as any).zoom = "125%"}>
                        125%
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => (document.documentElement.style as any).zoom = "145%"}>
                        150%
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    )
}
