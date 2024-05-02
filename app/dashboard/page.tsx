"use client"

import { Spinner } from "@/components/ui/spinner"
// DISREGARD FOR BETA - GENERAL STATS HERE?


import { useRouter } from "next/navigation"


export default function Dashboard() {
  const router = useRouter()
  router.push("/dashboard/tests")

  return (
    <>
      <div className="absolute w-full top-0 left-0 w-full min-h-screen flex flex-col justify-center items-center">
        <Spinner />
      </div>
    </>
  )
}
