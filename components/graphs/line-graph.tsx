import { useTheme } from "next-themes"
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

// import { useConfig } from "@/hooks/use-config"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

interface DataItem {
  average: number;
  top: number;
  low: number;
}

interface LineGraphProps {
  data: DataItem[]; // An array of DataItem objects
}

export function LineGraph({ data }: LineGraphProps) {
   const { theme } = useTheme()

//   const theme = themes.find((theme) => theme.name === config.theme)

  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle>Metrics</CardTitle>
        <CardDescription>
          Average, top, and lowest scores for each question.
        </CardDescription>
      </CardHeader>
      <CardContent className="py-4">
        <div className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{
                top: 5,
                right: 10,
                left: 10,
                bottom: 0,
              }}
            >
              <XAxis
                allowDecimals={false}
                tickFormatter={(value, index) => `${index + 1}`} // Starting index at 1
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="rounded-lg border bg-background p-2 shadow-sm">
                        <div className="grid grid-cols-2 gap-2">
                          <div className="flex flex-col">
                            <span className="text-[0.70rem] uppercase text-muted-foreground">
                              Average
                            </span>
                            <span className="font-bold ">
                              {payload[0].value}
                            </span>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-[0.70rem] uppercase text-muted-foreground">
                              Top
                            </span>
                            <span className="font-bold text-muted-foreground">
                              {payload[1].value}
                            </span>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-[0.70rem] uppercase text-muted-foreground">
                              Low
                            </span>
                            <span className="font-bold text-muted-foreground">
                              {payload[2].value}
                            </span>
                          </div>
                        </div>
                      </div>
                    )
                  }

                  return null
                }}
              />
              <Line
                type="monotone"
                strokeWidth={2}
                dataKey="average"
                activeDot={{
                  r: 6,
                  style: { fill: "var(--theme-primary)" },
                }}
                style={
                  {
                    stroke: "var(--theme-primary)",
                    "--theme-primary": `${theme === "light" ? "#2563EB" : "#3B82F6"}`,
                  } as React.CSSProperties
                }
              />
              <Line
                type="monotone"
                dataKey="top"
                strokeWidth={2}
                activeDot={{
                  r: 8,
                  style: { fill: "var(--theme-primary)", opacity: 0.25 },
                }}
                style={
                  {
                    stroke: "var(--theme-primary)",
                    opacity: 0.25,
                    "--theme-primary": `${theme === "light" ? "green" : "green"}`,
                  } as React.CSSProperties
                }
              />
              <Line
                type="monotone"
                dataKey="low"
                strokeWidth={2}
                activeDot={{
                  r: 8,
                  style: { fill: "var(--theme-primary)", opacity: 0.25 },
                }}
                style={
                  {
                    stroke: "var(--theme-primary)",
                    opacity: 0.25,
                    "--theme-primary": `${theme === "light" ? "red" : "red"}`,
                  } as React.CSSProperties
                }
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
