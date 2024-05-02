"use client"

import * as React from "react"
import { useState, useEffect } from "react"

import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Grid3X3Icon } from "lucide-react"

export function GridToggle({ className }: React.HTMLAttributes<HTMLElement>) {
    const [gridBg, setGridBg] = useState(true)
    useEffect(() => {
        const gridBackgroundStyle = gridBg
            ? `repeating-linear-gradient(0deg, #cbd5e135, #cbd5e135 1px, transparent 1px, transparent 20px),
       repeating-linear-gradient(90deg, #cbd5e135, #cbd5e135 1px, transparent 1px, transparent 20px)`
            : "none"
        document.body.style.backgroundImage = gridBackgroundStyle
    }, [gridBg])
    return (
        <div className={className}>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="icon">
                        <Grid3X3Icon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all" />
                        <span className="sr-only">Toggle grid background</span>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" >
                    <DropdownMenuItem onClick={() => setGridBg(true)}>
                        Enable
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setGridBg(false)}>
                        Disable
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    )
}
