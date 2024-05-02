"use client"

import { ColumnDef } from "@tanstack/react-table"

import { Badge } from "@/components/ui/badge"

import {
  CheckCircledIcon,
  Pencil2Icon,
  StopwatchIcon,
} from "@radix-ui/react-icons"

export const statuses = [
  {
    value: "in progress",
    label: "In Progress",
    icon: StopwatchIcon,
  },
  {
    value: "needsGrade",
    label: "Needs Grade",
    icon: Pencil2Icon,
  },
  {
    value: "graded",
    label: "Graded",
    icon: CheckCircledIcon,
  },
]

import { DataTableColumnHeader } from "./data-table-column-header"
import { DataTableRowActions } from "./data-table-row-actions"
import { Response, Student } from "@/app/types/test"


export const columns: ColumnDef<Student>[] = [

  {
    accessorKey: "id",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="id" className="hidden" />
    ),
    cell: ({ row }) => <div className="hidden">{row.getValue("id")}</div>,
    enableSorting: false,
    enableHiding: true,
  },
  {
    accessorKey: "studentId",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Student ID" />
    ),
    cell: ({ row }) => {

      return (
        <div className="flex space-x-2">
          <span className="max-w-[500px] truncate font-medium">
            {row.getValue("studentId")}
          </span>
        </div>
      )
    },
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    cell: ({ row }) => {

      return (
        <div className="flex space-x-2">
          <span className="max-w-[500px] truncate font-medium">
            {row.getValue("name")}
          </span>
        </div>
      )
    },
  },

  {
    accessorKey: "email",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Email" />
    ),
    cell: ({ row }) => {

      return (
        <div className="flex space-x-2">
          <span className="max-w-[500px] truncate font-medium">
            {row.getValue("email")}
          </span>
        </div>
      )
    },
  },

  {
    accessorKey: "class",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Class" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          {<Badge variant="outline">{row.getValue("class")}</Badge>}
        </div>
      )
    },
  },

  {
    accessorKey: "testingStatus",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Testing Status" />
    ),
    cell: ({ row }) => {
      const status = statuses.find(
        (status: any) => status.value === row.getValue("testingStatus")
      )

      if (!status) {
        return null
      }

      return (
        <div className={`${status.value === "needsGrade" ? "bg-primary/40" : ""} p-1 rounded-lg flex w-[130px] items-center justify-start`}>
          {status.icon && (
            <status.icon className="mr-2 h-4 w-4 text-muted-foreground" />
          )}
          <span className="">{status.label}</span>
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
  // {
  //   id: "actions",
  //   cell: ({ row }) => <DataTableRowActions row={row} />,
  // },
]
