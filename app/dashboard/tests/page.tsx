"use client"

import { useEffect, useState } from "react"
import { columns } from "./test-table/columns"
import { DataTable } from "./test-table/data-table"
import { Test } from "@/app/types/test"
import { Spinner } from "@/components/ui/spinner"
import { TestTube2 } from "lucide-react"


export default function Tests() {
  const [tests, setTests] = useState<Test[]>()
  const [loadingTests, setLoadingTests] = useState<boolean>(false);
  const getTests = async () => {
    setLoadingTests(true)
    const response = await fetch("/api/tests/getTests");
    const { formattedTests } = await response.json();
    setTests(formattedTests)
    setLoadingTests(false)
  }

  useEffect(() => {
    getTests()
  }, []);

  if (!tests) {
    return (
      <div className="absolute w-full top-0 left-0 min-h-screen flex flex-col justify-center items-center">
        <Spinner />
      </div>
    )
  }

  return (
    <>
      <div className="flex-col md:flex p-8">
        <h2 className="text-2xl font-bold flex items-center">Tests</h2>
        <div className="flex-1 space-y-4 pt-6">
          <DataTable data={tests} columns={columns} getTests={getTests} loadingTests={loadingTests} />
        </div>
      </div>
    </>
  )
}



// import { Metadata } from "next"

// import { columns } from "./test-table/columns"
// import { DataTable } from "./test-table/data-table"
// import { getServerSession } from "next-auth";
// import { authOptions } from "@/lib/auth";
// import { prisma } from "@/lib/prisma";
// import { formatDate } from "@/lib/utils";


// export default async function Tests() {
//   const session = await getServerSession(authOptions);

//   if (!session?.user?.email) {
//     return <></>
//   }

//   const tests = await prisma.test.findMany({
//     where: {
//       owner: session.user.email
//     },
//     include: {
//       responses: true,
//     }
//   });

//   const formattedTests = tests.map((test) => {
//     return { ...test, createdAt: formatDate(test.createdAt) }
//   })

//   return (
//     <>
//       <div className="flex-col md:flex p-8">
//         <h2 className="text-2xl font-bold">Tests</h2>
//         <div className="flex-1 space-y-4 pt-6">
//           <DataTable data={formattedTests} columns={columns} />
//         </div>
//       </div>
//     </>
//   )
// }