"use client"

import { useEffect, useState } from "react"
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { useWebSocket } from "./websocket-client"

type SentimentChartProps = {
  cryptocurrency?: string
  days?: number
  source?: string
}

export function SentimentChart({ cryptocurrency = "all", days = 30, source = "all" }: SentimentChartProps) {
  const [data, setData] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { isConnected, subscribeToChannel } = useWebSocket()

  useEffect(() => {
    // Fetch historical data first
    const fetchSentimentTrends = async () => {
      setIsLoading(true)
      setError(null)

      try {
        // Mock data to use when API is unavailable
        const mockData = [
          { date: "2025-03-01", bitcoin: 45, ethereum: 30, overall: 38, reddit: 42, twitter: 35, news: 28 },
          { date: "2025-03-02", bitcoin: 48, ethereum: 32, overall: 40, reddit: 45, twitter: 38, news: 30 },
          { date: "2025-03-03", bitcoin: 52, ethereum: 35, overall: 43, reddit: 48, twitter: 40, news: 32 },
          { date: "2025-03-04", bitcoin: 56, ethereum: 38, overall: 47, reddit: 50, twitter: 42, news: 35 },
          { date: "2025-03-05", bitcoin: 60, ethereum: 42, overall: 51, reddit: 55, twitter: 45, news: 38 },
          { date: "2025-03-06", bitcoin: 58, ethereum: 40, overall: 49, reddit: 53, twitter: 43, news: 36 },
          { date: "2025-03-07", bitcoin: 62, ethereum: 45, overall: 53, reddit: 58, twitter: 48, news: 40 },
          { date: "2025-03-08", bitcoin: 65, ethereum: 48, overall: 56, reddit: 60, twitter: 50, news: 42 },
          { date: "2025-03-09", bitcoin: 63, ethereum: 46, overall: 54, reddit: 58, twitter: 48, news: 41 },
          { date: "2025-03-10", bitcoin: 67, ethereum: 50, overall: 58, reddit: 62, twitter: 52, news: 45 },
          { date: "2025-03-11", bitcoin: 70, ethereum: 53, overall: 61, reddit: 65, twitter: 55, news: 48 },
          { date: "2025-03-12", bitcoin: 68, ethereum: 51, overall: 59, reddit: 63, twitter: 53, news: 46 },
          { date: "2025-03-13", bitcoin: 72, ethereum: 55, overall: 63, reddit: 67, twitter: 57, news: 50 },
          { date: "2025-03-14", bitcoin: 75, ethereum: 58, overall: 66, reddit: 70, twitter: 60, news: 53 },
          { date: "2025-03-15", bitcoin: 73, ethereum: 56, overall: 64, reddit: 68, twitter: 58, news: 51 },
          { date: "2025-03-16", bitcoin: 77, ethereum: 60, overall: 68, reddit: 72, twitter: 62, news: 55 },
          { date: "2025-03-17", bitcoin: 80, ethereum: 63, overall: 71, reddit: 75, twitter: 65, news: 58 },
          { date: "2025-03-18", bitcoin: 78, ethereum: 61, overall: 69, reddit: 73, twitter: 63, news: 56 },
          { date: "2025-03-19", bitcoin: 82, ethereum: 65, overall: 73, reddit: 77, twitter: 67, news: 60 },
          { date: "2025-03-20", bitcoin: 85, ethereum: 68, overall: 76, reddit: 80, twitter: 70, news: 63 },
          { date: "2025-03-21", bitcoin: 83, ethereum: 66, overall: 74, reddit: 78, twitter: 68, news: 61 },
          { date: "2025-03-22", bitcoin: 87, ethereum: 70, overall: 78, reddit: 82, twitter: 72, news: 65 },
          { date: "2025-03-23", bitcoin: 90, ethereum: 73, overall: 81, reddit: 85, twitter: 75, news: 68 },
          { date: "2025-03-24", bitcoin: 88, ethereum: 71, overall: 79, reddit: 83, twitter: 73, news: 66 },
          { date: "2025-03-25", bitcoin: 92, ethereum: 75, overall: 83, reddit: 87, twitter: 77, news: 70 },
          { date: "2025-03-26", bitcoin: 95, ethereum: 78, overall: 86, reddit: 90, twitter: 80, news: 73 },
          { date: "2025-03-27", bitcoin: 93, ethereum: 76, overall: 84, reddit: 88, twitter: 78, news: 71 },
          { date: "2025-03-28", bitcoin: 97, ethereum: 80, overall: 88, reddit: 92, twitter: 82, news: 75 },
          { date: "2025-03-29", bitcoin: 94, ethereum: 77, overall: 85, reddit: 89, twitter: 79, news: 72 },
          { date: "2025-03-30", bitcoin: 90, ethereum: 73, overall: 81, reddit: 85, twitter: 75, news: 68 },
        ]

        try {
          // Try to fetch from API first
          const response = await fetch(
            `/api/sentiment/trends?cryptocurrency=${cryptocurrency}&days=${days}&source=${source}`,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            },
          )

          if (!response.ok) {
            throw new Error(`Error fetching sentiment data: ${response.statusText}`)
          }

          const fetchedData = await response.json()
          setData(fetchedData)
        } catch (apiError) {
          console.warn("API fetch failed, using mock data:", apiError)
          // Use mock data if API fails
          setData(mockData)
        }
      } catch (err) {
        console.error("Error in sentiment chart:", err)
        setError(err instanceof Error ? err.message : "Unknown error occurred")
        // Still set mock data even if there's an error
        setData([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchSentimentTrends()

    // Subscribe to real-time updates if connected
    if (isConnected) {
      subscribeToChannel("sentiment", { cryptocurrency, source })
    }

    // Refresh data every 5 minutes
    const interval = setInterval(fetchSentimentTrends, 5 * 60 * 1000)

    return () => clearInterval(interval)
  }, [cryptocurrency, days, source, isConnected, subscribeToChannel])

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
        <LineChart
          data={data}
          margin={{
            top: 5,
            right: 10,
            left: 10,
            bottom: 0,
          }}
        >
          <XAxis dataKey="date" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
          <YAxis
            stroke="#888888"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `${value}`}
            domain={[-100, 100]}
          />
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                return (
                  <div className="rounded-lg border bg-background p-2 shadow-sm">
                    <div className="grid grid-cols-2 gap-2">
                      <div className="flex flex-col">
                        <span className="text-[0.70rem] uppercase text-muted-foreground">Date</span>
                        <span className="font-bold text-muted-foreground">{payload[0].payload.date}</span>
                      </div>

                      {payload.map((entry, index) => (
                        <div key={index} className="flex flex-col">
                          <span className="text-[0.70rem] uppercase text-muted-foreground">{entry.name}</span>
                          <span className="font-bold" style={{ color: entry.color }}>
                            {entry.value}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              }

              return null
            }}
          />

          {/* Lines for each data series (dynamic based on available data) */}
          {cryptocurrency === "all" ? (
            <>
              {data[0]?.bitcoin !== undefined && (
                <Line
                  type="monotone"
                  dataKey="bitcoin"
                  name="Bitcoin"
                  stroke="#ff8f00"
                  strokeWidth={2}
                  activeDot={{
                    r: 6,
                    style: { fill: "#ff8f00", opacity: 0.8 },
                  }}
                />
              )}

              {data[0]?.ethereum !== undefined && (
                <Line
                  type="monotone"
                  dataKey="ethereum"
                  name="Ethereum"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  activeDot={{
                    r: 6,
                    style: { fill: "#3b82f6", opacity: 0.8 },
                  }}
                />
              )}

              {data[0]?.cardano !== undefined && (
                <Line
                  type="monotone"
                  dataKey="cardano"
                  name="Cardano"
                  stroke="#8b5cf6"
                  strokeWidth={2}
                  activeDot={{
                    r: 6,
                    style: { fill: "#8b5cf6", opacity: 0.8 },
                  }}
                />
              )}

              {data[0]?.solana !== undefined && (
                <Line
                  type="monotone"
                  dataKey="solana"
                  name="Solana"
                  stroke="#10b981"
                  strokeWidth={2}
                  activeDot={{
                    r: 6,
                    style: { fill: "#10b981", opacity: 0.8 },
                  }}
                />
              )}

              {data[0]?.dogecoin !== undefined && (
                <Line
                  type="monotone"
                  dataKey="dogecoin"
                  name="Dogecoin"
                  stroke="#f43f5e"
                  strokeWidth={2}
                  activeDot={{
                    r: 6,
                    style: { fill: "#f43f5e", opacity: 0.8 },
                  }}
                />
              )}

              {data[0]?.overall !== undefined && (
                <Line
                  type="monotone"
                  dataKey="overall"
                  name="Overall"
                  stroke="#000000"
                  strokeWidth={2}
                  activeDot={{
                    r: 6,
                    style: { fill: "#000000", opacity: 0.8 },
                  }}
                />
              )}
            </>
          ) : (
            <>
              {source === "all" || source === "overall" ? (
                <Line
                  type="monotone"
                  dataKey="overall"
                  name="Overall"
                  stroke="#000000"
                  strokeWidth={2}
                  activeDot={{
                    r: 6,
                    style: { fill: "#000000", opacity: 0.8 },
                  }}
                />
              ) : null}

              {(source === "all" || source === "reddit") && data[0]?.reddit !== undefined ? (
                <Line
                  type="monotone"
                  dataKey="reddit"
                  name="Reddit"
                  stroke="#ff4500"
                  strokeWidth={2}
                  activeDot={{
                    r: 6,
                    style: { fill: "#ff4500", opacity: 0.8 },
                  }}
                />
              ) : null}

              {(source === "all" || source === "twitter") && data[0]?.twitter !== undefined ? (
                <Line
                  type="monotone"
                  dataKey="twitter"
                  name="Twitter"
                  stroke="#1da1f2"
                  strokeWidth={2}
                  activeDot={{
                    r: 6,
                    style: { fill: "#1da1f2", opacity: 0.8 },
                  }}
                />
              ) : null}

              {(source === "all" || source === "forexfactory") && data[0]?.forexfactory !== undefined ? (
                <Line
                  type="monotone"
                  dataKey="forexfactory"
                  name="ForexFactory"
                  stroke="#8b5cf6"
                  strokeWidth={2}
                  activeDot={{
                    r: 6,
                    style: { fill: "#8b5cf6", opacity: 0.8 },
                  }}
                />
              ) : null}

              {(source === "all" || source === "news") && data[0]?.news !== undefined ? (
                <Line
                  type="monotone"
                  dataKey="news"
                  name="News"
                  stroke="#10b981"
                  strokeWidth={2}
                  activeDot={{
                    r: 6,
                    style: { fill: "#10b981", opacity: 0.8 },
                  }}
                />
              ) : null}
            </>
          )}
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

