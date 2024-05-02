"use client"

import { Cross2Icon } from "@radix-ui/react-icons"
import { Table } from "@tanstack/react-table"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DataTableViewOptions } from "./data-table-view-options"

import {
  ArrowDownIcon,
  ArrowRightIcon,
  ArrowUpIcon,
  CheckCircledIcon,
  Pencil2Icon,
  CircleIcon,
  CrossCircledIcon,
  QuestionMarkCircledIcon,
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

import { DataTableFacetedFilter } from "./data-table-faceted-filter"
import { useState } from "react"
import { RefreshCcwDotIcon } from "lucide-react"

interface DataTableToolbarProps<TData> {
  table: Table<TData>
  getStudents: () => void
  loadingStudents: boolean
}

export function DataTableToolbar<TData>({
  table,
  getStudents,
  loadingStudents
}: DataTableToolbarProps<TData>) {

  const [filterValue, setFilterValue] = useState<string>('');
  const isFiltered = table.getState().globalFilter !== undefined;

  const onFilterChange = (value: string) => {
    setFilterValue(value);
    // Set a global filter instead of a column filter.
    // Note that you might need to adjust the implementation based on your global filtering logic.
    table.setGlobalFilter(value);
  };

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="Search..."
          value={filterValue}
          onChange={(event) => onFilterChange(event.target.value)}
          className="h-8 w-[150px] lg:w-[250px]"
        />
        {/* {table.getColumn("class") && (
          <DataTableFacetedFilter
            column={table.getColumn("class")}
            title="Class"
            options={statuses}
          />
        )} */}
        {table.getColumn("testingStatus") && (
          <DataTableFacetedFilter
            column={table.getColumn("testingStatus")}
            title="Status"
            options={statuses}
          />
        )}
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <Cross2Icon className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
      <Button
        variant="outline"
        size="sm"
        className="mr-2 hidden h-8 lg:flex"
        onClick={() => {
          getStudents()
        }}
        disabled={!!loadingStudents}
      >
        <RefreshCcwDotIcon className={`mr-2 h-4 w-4 ${loadingStudents ? 'animate-spin' : ''}`} />
        Refresh
      </Button>
      <DataTableViewOptions table={table} />
    </div>
  )
}
