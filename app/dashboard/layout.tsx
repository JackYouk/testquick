"use client"

import { useSession } from "next-auth/react"
import { usePathname, useRouter } from "next/navigation"

import { UserNav } from "@/components/nav/user-nav"
import { MobileNavMenu } from "@/components/nav/mobile-nav-menu"
import { Button } from "@/components/ui/button"
import { Logo } from "@/components/logo"
import { PlusCircle, TestTube2, Users2 } from "lucide-react"
import { Spinner } from "@/components/ui/spinner"


export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const activePage = usePathname();

    const { status } = useSession({
        required: true,
        onUnauthenticated() {
            router.push("/auth")
        },
    });

    if (status === "loading") {
        return (
            <>
                <div className="w-full h-screen flex flex-col justify-center items-center">
                    <Logo className="text-[25px] md:text-[50px]" />
                    <Spinner />
                </div>
            </>
        )
    }


    return (
        <>
            {/* Computer Client Nav */}
            <div className="border-b hidden bg-blur-md bg-background/70 md:flex md:fixed z-50 md:top-0 w-full">
                <div className="flex h-16 items-center px-4 w-full">
                    <Logo className="pt-1 md:text-[30px]" />
                    {/* <MainNav className="mx-6" /> */}

                    <div className="ml-auto flex items-center space-x-4">
                        <Button
                            size="sm"
                            variant={activePage === ("/dashboard/tests") ? "default" : "outline"}
                            className="text-sm flex items-center"
                            onClick={() => router.push("/dashboard/tests")}
                        >
                            Tests <TestTube2 className="ml-2 w-4 h-4" />
                        </Button>
                        <Button
                            size="sm"
                            variant={activePage.startsWith("/dashboard/students") ? "default" : "outline"}
                            className="text-sm flex items-center"
                            onClick={() => router.push("/dashboard/students")}
                        >
                            Students <Users2 className="ml-2 w-5 h-5" />
                        </Button>
                        <Button
                            size="sm"
                            variant={activePage === "/dashboard/tests/create-test" ? "default" : "outline"}
                            className="text-sm flex items-center"
                            onClick={() => {
                                router.push("/dashboard/tests/create-test")
                            }}
                        >
                            Create Test <PlusCircle className="ml-2 w-4 h-4" />
                        </Button>
                        <UserNav />
                    </div>
                </div>
            </div>

            {/* Mobile client nav */}
            <div className="border-b bg-blur-md bg-background/70 fixed top-0 z-50 md:hidden px-6 w-full">
                <div className="flex justify-between items-center w-full">
                    <Logo className="pt-1 text-[19px]" />
                    <div className="ml-auto flex items-center space-x-4 py-2">
                        <MobileNavMenu />
                    </div>
                </div>
            </div>

            <div className="pt-11 md:pt-16">{children}</div>
        </>
    )
}