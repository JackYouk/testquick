"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts"


interface DataItem {

}

interface BarGraphProps {
  data: DataItem[];
}

export function BarGraph({ data }: BarGraphProps) {
  if (!data || data.length === 0) return <div className="italic text-xs text-gray-500 text-start w-full">No data</div>
  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data}>
        <XAxis
          dataKey="gradeStr"
          stroke="#888888"
          fontSize={10}
          tickLine={false}
          axisLine={true}
        />
        <Bar dataKey="gradeNum" className="fill-primary" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}
