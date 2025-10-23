"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { io, type Socket } from "socket.io-client"

// Define the event types
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

// WebSocket client component
export function WebSocketClient({
  serverUrl,
  children,
}: {
  serverUrl: string
  children: React.ReactNode
}) {
  const [socket, setSocket] = useState<Socket | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [sentimentData, setSentimentData] = useState<SentimentData[]>([])
  const [trendData, setTrendData] = useState<TrendData[]>([])
  const [transactionData, setTransactionData] = useState<TransactionData[]>([])

  useEffect(() => {
    // Mock data for when WebSocket is unavailable
    const mockSentimentData: SentimentData[] = [
      {
        id: "s1",
        cryptocurrency: "Bitcoin",
        source: "reddit",
        sentiment_score: 75.2,
        sentiment_label: "positive",
        timestamp: new Date().toISOString(),
      },
      {
        id: "s2",
        cryptocurrency: "Ethereum",
        source: "twitter",
        sentiment_score: -32.5,
        sentiment_label: "negative",
        timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
      },
    ]

    const mockTrendData: TrendData[] = [
      {
        id: "t1",
        cryptocurrency: "Bitcoin",
        prediction: "bullish",
        confidence: 0.85,
        timeframe: "24h",
        created_at: new Date().toISOString(),
        valid_until: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString(),
      },
    ]

    const mockTransactionData: TransactionData[] = [
      {
        id: "tx1",
        cryptocurrency: "Bitcoin",
        amount: 245.89,
        value_usd: 14324567,
        from_address: "0x1a2b3c4d",
        to_address: "0x5e6f7g8h",
        transaction_hash: "0xabcdef1234567890",
        timestamp: new Date().toISOString(),
      },
    ]

    try {
      // Initialize socket connection
      const newSocket = io(serverUrl, {
        reconnectionAttempts: 3,
        timeout: 5000,
      })

      // Set up event listeners
      newSocket.on("connect", () => {
        console.log("Connected to WebSocket server")
        setIsConnected(true)
      })

      newSocket.on("disconnect", () => {
        console.log("Disconnected from WebSocket server")
        setIsConnected(false)
      })

      newSocket.on("connect_error", (error) => {
        console.warn("WebSocket connection error:", error)
        // Use mock data when connection fails
        setSentimentData(mockSentimentData)
        setTrendData(mockTrendData)
        setTransactionData(mockTransactionData)
      })

      newSocket.on("initial_data", (data: { channel: string; data: DataType[] }) => {
        console.log(`Received initial ${data.channel} data:`, data.data)

        if (data.channel === "sentiment") {
          setSentimentData(data.data as SentimentData[])
        } else if (data.channel === "trends") {
          setTrendData(data.data as TrendData[])
        } else if (data.channel === "transactions") {
          setTransactionData(data.data as TransactionData[])
        }
      })

      newSocket.on("new_data", (data: { channel: string; data: DataType }) => {
        console.log(`Received new ${data.channel} data:`, data.data)

        if (data.channel === "sentiment") {
          setSentimentData((prev) => [data.data as SentimentData, ...prev.slice(0, 99)])
        } else if (data.channel === "trends") {
          setTrendData((prev) => [data.data as TrendData, ...prev.slice(0, 99)])
        } else if (data.channel === "transactions") {
          setTransactionData((prev) => [data.data as TransactionData, ...prev.slice(0, 99)])
        }
      })

      setSocket(newSocket)

      // Set initial mock data in case the connection fails
      if (sentimentData.length === 0) {
        setSentimentData(mockSentimentData)
      }
      if (trendData.length === 0) {
        setTrendData(mockTrendData)
      }
      if (transactionData.length === 0) {
        setTransactionData(mockTransactionData)
      }

      // Clean up on unmount
      return () => {
        newSocket.disconnect()
      }
    } catch (error) {
      console.error("Error setting up WebSocket:", error)
      // Use mock data when setup fails
      setSentimentData(mockSentimentData)
      setTrendData(mockTrendData)
      setTransactionData(mockTransactionData)
      setIsConnected(false)
    }
  }, [serverUrl])

  // Subscribe to a specific data channel
  const subscribeToChannel = (channel: string, filters: any = {}) => {
    if (socket && isConnected) {
      console.log(`Subscribing to ${channel} with filters:`, filters)
      socket.emit("subscribe", { channel, filters })
    } else {
      console.log(`WebSocket not connected, can't subscribe to ${channel}`)
    }
  }

  // Unsubscribe from a specific data channel
  const unsubscribeFromChannel = (channel: string, filters: any = {}) => {
    if (socket && isConnected) {
      console.log(`Unsubscribing from ${channel} with filters:`, filters)
      socket.emit("unsubscribe", { channel, filters })
    } else {
      console.log(`WebSocket not connected, can't unsubscribe from ${channel}`)
    }
  }

  // Provider value
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

// Create a context to share WebSocket data across components
import { createContext, useContext } from "react"

const WebSocketContext = createContext<WebSocketContextProps | undefined>(undefined)

export function useWebSocket() {
  const context = useContext(WebSocketContext)
  if (context === undefined) {
    throw new Error("useWebSocket must be used within a WebSocketProvider")
  }
  return context
}

