"use client"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { signOut } from "next-auth/react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation"

export function UserNav() {
  const router = useRouter();
  const { data: session, status } = useSession();

  const [backgroundStyle, setBackgroundStyle] = useState({});

  useEffect(() => {
    const generatePattern = () => {
      const size = 40; // 5x5 grid
      let pattern = `<svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">`;

      for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
          const rand = Math.random(); // Random number between 0 and 1
          if (rand > 0.5) {
            pattern += `<rect x="${i * 5}" y="${j * 5}" width="5" height="5" fill="#${rand > 0.5 ? 'B3E0FF99' : '99C2FF99'}" />`;
          }
        }
      }

      pattern += `</svg>`;
      return pattern;
    }

    setBackgroundStyle({
      backgroundImage: `url("data:image/svg+xml,${encodeURIComponent(generatePattern())}")`,
      backgroundSize: 'cover',
    });
  }, [session?.user]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src={session?.user?.image ?? ""} alt="@shadcn" />
            <AvatarFallback style={{ ...backgroundStyle }} className="font-bold text-2xl">
              {/* {session?.user?.name?.split(' ').map(n => n[0]).join('') ?? ''} */}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{session?.user?.name ?? ''}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {session?.user?.email ?? ''}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => router.push("/dashboard/settings")}>
            Account
            {/* <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut> */}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => router.push("/dashboard/settings/preferences")}>
            Settings
            {/* <DropdownMenuShortcut>⌘S</DropdownMenuShortcut> */}
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => signOut()}>
          Log out
          {/* <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut> */}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
