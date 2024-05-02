"use client"

import { useEffect, useState } from "react"
import { columns } from "./student-table/columns"
import { DataTable } from "./student-table/data-table"
import { Spinner } from "@/components/ui/spinner"
import { Student } from "@/app/types/test"


export default function Students() {
  const [students, setStudents] = useState<Student[]>();
  const [loadingStudents, setLoadingStudents] = useState<boolean>(false);
  const getStudents = async () => {
    setLoadingStudents(true);
    const response = await fetch("/api/students/getStudents");
    const { students } = await response.json();
    setStudents(students);
    setLoadingStudents(false);
  }
  useEffect(() => {
    getStudents();
  }, []);

  if (!students) {
    return (
      <div className="absolute w-full top-0 left-0 min-h-screen flex flex-col justify-center items-center">
        <Spinner />
      </div>
    )
  }

  return (
    <>
      <div className="flex-col md:flex p-8">
        <h2 className="text-2xl font-bold">Students</h2>
        <div className="flex-1 space-y-4 pt-6">
          <DataTable data={students} columns={columns} getStudents={getStudents} loadingStudents={loadingStudents} />
        </div>
      </div>
    </>
  )
}



// import { columns } from "./student-table/columns"
// import { DataTable } from "./student-table/data-table"


// async function getStudents() {
//   const students = [
//     {
//       id: "11904",
//       name: "Jack Youkstetter",
//       email: "jackyoukstetter1@gmail.com",
//       class: "MATH3E",
//       status: "in progress",
//       average: 78.5
//     },
//   ];

//   const createUniqueStudent = (baseStudent: any, index: number) => {
//     return {
//       ...baseStudent,
//       id: (parseInt(baseStudent.id, 10) + index).toString(),
//       name: `Student ${index}`,
//       email: `student${index}@example.com`,
//       average: baseStudent.average - (index % 5) // Adjusts the average slightly for variety
//     };
//   };
//   const studentArray = [];
//   for (let i = 0; i < 100; i++) {
//     studentArray.push(createUniqueStudent(students[0], i));
//   }

//   return studentArray;
// }

// export default async function Students() {
//   const students = await getStudents();

//   return (
//     <>
//       <div className="flex-col md:flex p-8">
//         <h2 className="text-2xl font-bold">Students</h2>
//         <div className="flex-1 space-y-4 pt-6">
//           <DataTable data={students} columns={columns} />
//         </div>
//       </div>
//     </>
//   )
// }
