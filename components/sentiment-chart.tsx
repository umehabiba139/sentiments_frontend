"use client"

import { useEffect, useState } from "react"
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from "recharts"

type SentimentChartProps = {
  cryptocurrency?: string
  frame?: string
}

export function SentimentChart({ cryptocurrency = "BTC", frame = "7d" }: SentimentChartProps) {
  const [data, setData] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchSentimentData = async () => {
      setIsLoading(true)
      setError(null)

      try {
        const response = await fetch(`http://localhost:8000/api/sentiment-timeseries?coin=${cryptocurrency}&timeframe=${frame}`)


        if (!response.ok) {
          throw new Error(`Error fetching sentiment data: ${response.statusText}`)
        }

        const result = await response.json()

        if (result && result.series) {
          const formattedData = result.series.map((item: any) => ({
            timestamp: new Date(item.timestamp).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            }),
            Positive: item.positive,
            Neutral: item.neutral,
            Negative: item.negative,
          }))
          setData(formattedData)
        } else {
          setData([])
        }
      } catch (err) {
        console.error("Error fetching sentiment chart data:", err)
        setError(err instanceof Error ? err.message : "Unknown error occurred")
      } finally {
        setIsLoading(false)
      }
    }

    fetchSentimentData()
  }, [cryptocurrency, frame])

  if (isLoading) {
    return (
      <div className="flex h-[300px] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex h-[300px] items-center justify-center">
        <p className="text-red-500">Error loading sentiment data: {error}</p>
      </div>
    )
  }

  if (data.length === 0) {
    return (
      <div className="flex h-[300px] items-center justify-center">
        <p className="text-muted-foreground">No sentiment data available</p>
      </div>
    )
  }

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{
            top: 10,
            right: 20,
            left: 0,
            bottom: 0,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="timestamp" />
          <YAxis domain={[0, 100]} />
          <Tooltip />
          <Legend />
          <Bar dataKey="Positive" fill="#22c55e" />
          <Bar dataKey="Neutral" fill="#3b82f6" />
          <Bar dataKey="Negative" fill="#ef4444" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
