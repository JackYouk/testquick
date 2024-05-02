"use client"

import { ColumnDef } from "@tanstack/react-table"

import { Badge } from "@/components/ui/badge"

import {
  LockClosedIcon,
  LockOpen1Icon,
} from "@radix-ui/react-icons"

export const statuses = [
  {
    value: "open",
    label: "Open",
    icon: LockOpen1Icon,
  },
  {
    value: "closed",
    label: "Locked",
    icon: LockClosedIcon,
  },
]

import { DataTableColumnHeader } from "./data-table-column-header"
import { Response } from "@/app/types/test"


export const columns: ColumnDef<any>[] = [
  {
    accessorKey: "id",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Test ID" className="hidden" />
    ),
    cell: ({ row }) => <div className="hidden">{row.getValue("id")}</div>,
    enableSorting: false,
    enableHiding: true,
  },
  {
    accessorKey: "testName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    cell: ({ row }) => {

      return (
        <div className="flex space-x-2">
          <span className="max-w-[500px] truncate font-medium  p-2 border rounded-md">
            {row.getValue("testName")}
          </span>
        </div>
      )
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Created Date" />
    ),
    cell: ({ row }) => {

      return (
        <div className="flex space-x-2">
          <span className="max-w-[500px] truncate font-medium">
            {row.getValue("createdAt")}
          </span>
        </div>
      )
    },
  },
  {
    accessorKey: "courseName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Course Name" />
    ),
    cell: ({ row }) => {

      return (
        <div className="flex space-x-2">
          <span className="max-w-[500px] truncate font-medium">
            {row.getValue("courseName")}
          </span>
        </div>
      )
    },
  },
  {
    accessorKey: "courseSubject",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Subject" />
    ),
    cell: ({ row }) => {

      return (
        <div className="flex space-x-2">
          <span className="max-w-[500px] truncate font-medium">
            {row.getValue("courseSubject")}
          </span>
        </div>
      )
    },
  },
  {
    accessorKey: "numResponses",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Responses" />
    ),
    cell: ({ row }) => {
      const responses: Response[] = row.getValue("responses")
      if (!responses) return null
      return (
        <div className="flex space-x-2">
          {<Badge variant="outline">{responses.length} Students</Badge>}
        </div>
      )
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      const status = statuses.find(
        (status: any) => status.value === row.getValue("status")
      )

      if (!status) {
        return null
      }

      return (
        <div className="flex w-[100px] items-center">
          {status.icon && (
            <status.icon className="mr-2 h-4 w-4 text-muted-foreground" />
          )}
          <span>{status.label}</span>
        </div>
      )
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },

  {
    accessorKey: "responses",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Average Grade" />
    ),
    cell: ({ row }) => {
      const responses: Response[] = row.getValue("responses");
      const calculateAverageGrade = (response: Response) => {
        if (response.responseGrades.length === 0) {
          return 0; // Or handle this case as needed
        }
        const total = response.responseGrades.reduce((acc, grade) => acc + grade, 0);
        const average = total / response.responseGrades.length;
        return (average / 10) * 100; // Scale the average to be out of 100
      };

      const totalAverageOfAverages = responses.reduce((acc, response) => {
        return acc + calculateAverageGrade(response);
      }, 0);

      const overallAverage = responses.length > 0
        ? totalAverageOfAverages / responses.length
        : 0;


      const isAverageANumber = typeof overallAverage === 'number';

      const barWidth = isAverageANumber ? overallAverage : 0;
      const barColor = isAverageANumber && overallAverage >= 75 ? "bg-green-400" : "bg-orange-400";

      return (
        <div className="flex items-center h-6 w-2/3">
          <div className={`h-2 rounded-l-lg ${barColor} transition-width duration-300`}
            style={{ width: `${barWidth}%` }}
            title={isAverageANumber ? overallAverage.toFixed(2) : 'N/A'}> {/* Tooltip for hover */}
          </div>
          <div className={`h-2 ${barWidth === 0 ? 'rounded-lg' : 'rounded-r-lg'} bg-gray-300/90 dark:bg-gray-600/90 transition-width duration-300`}
            style={{ width: `${100 - barWidth}%` }}
            title={isAverageANumber ? overallAverage.toFixed(2) : 'N/A'}> {/* Tooltip for hover */}
          </div>
        </div>
      )
    },
  }

]
