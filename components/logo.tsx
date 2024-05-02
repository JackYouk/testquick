import { cn } from "@/lib/utils";


export function Logo({ className }: React.HTMLAttributes<HTMLElement>) {
    return (
        <h1
            className={cn("'__className_54d61b' text-[35px] md:text-[60px] text-primary text-center", className)}
            style={{
                fontFamily: "__quicksliver_54d61b",
                // fontStretch: "extra-expanded"
            }}
        >
            T e s t Q u i c k <span className="pl-2 gradient-text scale-10">B e t a</span>
        </h1>
    )
}