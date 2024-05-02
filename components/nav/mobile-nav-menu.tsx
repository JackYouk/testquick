"use client"

import {
    LogOut,
    MenuIcon,
    Settings,
    User,
    Users,
    PlusCircle,
    PhoneIcon,
    TestTube2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export function MobileNavMenu() {
    const router = useRouter();
    const { data: session, status } = useSession();

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className="w-9 h-9">
                    <MenuIcon />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 mr-6">

                <DropdownMenuLabel>
                    <p className="text-sm font-medium leading-none mb-1">{session?.user?.name ?? ''}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                        {session?.user?.email ?? ''}
                    </p>
                </DropdownMenuLabel>

                <DropdownMenuSeparator />

                <DropdownMenuGroup>
                    <DropdownMenuItem
                        onClick={() => {
                            router.push("/dashboard/tests/create-test")
                        }}
                    >
                        <PlusCircle className="mr-2 h-4 w-4" />
                        <span>Create Test</span>
                    </DropdownMenuItem>
                </DropdownMenuGroup>

                <DropdownMenuSeparator />

                <DropdownMenuGroup>
                    <DropdownMenuItem onClick={() => router.push(`/dashboard/tests`)}>
                        <TestTube2 className="mr-2 h-4 w-4" />
                        <span>Tests</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => router.push(`/dashboard/students`)}>
                        <Users className="mr-2 h-4 w-4" />
                        <span>Students</span>
                    </DropdownMenuItem>
                </DropdownMenuGroup>

                <DropdownMenuSeparator />

                <DropdownMenuGroup>
                    <DropdownMenuItem onClick={() => router.push(`/dashboard/settings`)}>
                        <User className="mr-2 h-4 w-4" />
                        <span>Account</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => router.push(`/dashboard/settings/preferences`)}>
                        <Settings className="mr-2 h-4 w-4" />
                        <span>Settings</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => router.push(`/dashboard/settings/support`)}>
                        <PhoneIcon className="mr-2 h-4 w-4" />
                        <span>Support</span>
                    </DropdownMenuItem>
                </DropdownMenuGroup>

                <DropdownMenuSeparator />

                <DropdownMenuItem onClick={() => signOut()}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
