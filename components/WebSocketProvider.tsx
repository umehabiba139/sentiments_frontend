"use client"

import React, { createContext, useContext, useEffect, useState } from "react"
import { io, type Socket } from "socket.io-client"

// Types
type SentimentData = {
  id: string
  cryptocurrency: string
  source: string
  sentiment_score: number
  sentiment_label: string
  timestamp: string
}

type TrendData = {
  id: string
  cryptocurrency: string
  prediction: string
  confidence: number
  timeframe: string
  created_at: string
  valid_until: string
}

type TransactionData = {
  id: string
  cryptocurrency: string
  amount: number
  value_usd: number
  from_address: string
  to_address: string
  transaction_hash: string
  timestamp: string
}

type DataType = SentimentData | TrendData | TransactionData

type WebSocketContextProps = {
  isConnected: boolean
  sentimentData: SentimentData[]
  trendData: TrendData[]
  transactionData: TransactionData[]
  subscribeToChannel: (channel: string, filters?: any) => void
  unsubscribeFromChannel: (channel: string, filters?: any) => void
}

// Context
const WebSocketContext = createContext<WebSocketContextProps | undefined>(undefined)

export function useWebSocket() {
  const context = useContext(WebSocketContext)
  if (!context) throw new Error("useWebSocket must be used within a WebSocketProvider")
  return context
}

// Provider component
export function WebSocketProvider({ serverUrl, children }: { serverUrl: string; children: React.ReactNode }) {
  const [socket, setSocket] = useState<Socket | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [sentimentData, setSentimentData] = useState<SentimentData[]>([])
  const [trendData, setTrendData] = useState<TrendData[]>([])
  const [transactionData, setTransactionData] = useState<TransactionData[]>([])

  useEffect(() => {
    const newSocket = io(serverUrl, { reconnectionAttempts: 3, timeout: 5000 })

    newSocket.on("connect", () => setIsConnected(true))
    newSocket.on("disconnect", () => setIsConnected(false))

    newSocket.on("initial_data", (data: { channel: string; data: DataType[] }) => {
      if (data.channel === "sentiment") setSentimentData(data.data as SentimentData[])
      if (data.channel === "trends") setTrendData(data.data as TrendData[])
      if (data.channel === "transactions") setTransactionData(data.data as TransactionData[])
    })

    newSocket.on("new_data", (data: { channel: string; data: DataType }) => {
      if (data.channel === "sentiment")
        setSentimentData((prev) => [data.data as SentimentData, ...prev.slice(0, 99)])
      if (data.channel === "trends")
        setTrendData((prev) => [data.data as TrendData, ...prev.slice(0, 99)])
      if (data.channel === "transactions")
        setTransactionData((prev) => [data.data as TransactionData, ...prev.slice(0, 99)])
    })

    setSocket(newSocket)
    return () => newSocket.disconnect()
  }, [serverUrl])

  const subscribeToChannel = (channel: string, filters: any = {}) => {
    if (socket && isConnected) socket.emit("subscribe", { channel, filters })
  }

  const unsubscribeFromChannel = (channel: string, filters: any = {}) => {
    if (socket && isConnected) socket.emit("unsubscribe", { channel, filters })
  }

  const value: WebSocketContextProps = {
    isConnected,
    sentimentData,
    trendData,
    transactionData,
    subscribeToChannel,
    unsubscribeFromChannel,
  }

  return <WebSocketContext.Provider value={value}>{children}</WebSocketContext.Provider>
}
