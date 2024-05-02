"use client"

import { signIn, useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import Link from "next/link"
import { Spinner } from "@/components/ui/spinner"


export function CreateAccountCard() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState("");
    const { data: session, status } = useSession();

    const checkAndRedirectNewUser = async () => {
        setLoading(true);
        try {
            const response = await fetch(`/api/checkNewUser`);
            const data = await response.json();
            if (data.newUser) {
                router.push("/dashboard/tests");
            } else {
                router.push("/dashboard/tests");
            }
        } catch (error) {
            console.error("There was an error fetching the user's newUser status:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (status === 'authenticated' && session.user) {
            checkAndRedirectNewUser();
        }
    }, [status, session?.user]);

    const googleLogin = async () => {
        await signIn("google");
    };

    const emailLogin = async () => {
        const emailRegex: RegExp = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
        if (emailRegex.test(email) === false) return console.log("error not valid email")
        await signIn("email", { email: email });
    }

    if (status === 'loading' || loading) {
        return (
            <div className="flex justify-center items-center">
                <Spinner />
            </div>
        )
    }

    return (
        <Card>
            <CardHeader className="space-y-1">
                {/* <CardTitle className="text-2xl">Login/Register</CardTitle> */}
                <CardDescription>
                    Select an option below to login to an existing account or register a new one.
                    <div>
                        By clicking continue, you agree to our{" "}
                        <Link
                            href="/tos"
                            className="underline underline-offset-4 hover:text-primary"
                        >
                            Terms of Service
                        </Link>{" "}
                        and{" "}
                        <Link
                            href="/privacy-policy"
                            className="underline underline-offset-4 hover:text-primary"
                        >
                            Privacy Policy
                        </Link>
                        .
                    </div>
                </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
                <div className="grid ">
                    <Button onClick={() => googleLogin()} variant="outline">
                        <svg role="img" viewBox="0 0 24 24" className="mr-2 h-4 w-4">
                            <path
                                fill="currentColor"
                                d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                            />
                        </svg>
                        Continue with Google
                    </Button>
                </div>
                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-background px-2 text-muted-foreground">
                            Or continue with
                        </span>
                    </div>
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                        id="email"
                        type="email"
                        placeholder="hello@testquick.org"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                    />
                </div>
            </CardContent>
            <CardFooter>
                <Button onClick={() => emailLogin()} className="w-full">Continue with Email</Button>
            </CardFooter>
        </Card>
    )
}
