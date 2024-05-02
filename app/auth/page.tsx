"use client";
import { CreateAccountCard } from "./create-account-card"
import { Logo } from "@/components/logo";

export default function Auth() {
  return (
    <>
      <div className="p-6 min-h-screen flex flex-col justify-center items-center">
        <div className="flex flex-col justify-center items-center">
          <Logo className="md:text-[45px] text-[22px] pr-2" />
          <CreateAccountCard />
        </div>
      </div>
    </>
  )
}
