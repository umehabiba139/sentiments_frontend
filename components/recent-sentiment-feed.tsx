"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useWebSocket } from "./WebSocketProvider";
import { formatDistanceToNow } from "date-fns";

type SentimentItem = {
  id: string;
  cryptocurrency: string;
  source: string;
  content: string;
  sentiment_score: number;
  sentiment_label: string;
  confidence: number;
  timestamp: string;
  metadata: any;
};

type RecentSentimentFeedProps = {
  cryptocurrency?: string;
  source?: string;
  limit?: number;
};

export function RecentSentimentFeed({
  cryptocurrency = "all",
  source = "all",
  limit = 5,
}: RecentSentimentFeedProps) {
  const [feed, setFeed] = useState<SentimentItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { isConnected, sentimentData, subscribeToChannel } = useWebSocket();

  useEffect(() => {
    // Fetch initial data
    const fetchInitialData = async () => {
      setIsLoading(true);

      // Mock data to use when API is unavailable
      const mockFeed = [
        {
          id: "sent1",
          cryptocurrency: "Bitcoin",
          source: "reddit",
          content:
            "Bitcoin is showing strong support at current levels. The technical indicators suggest a potential breakout in the coming days.",
          sentiment_score: 78.5,
          sentiment_label: "positive",
          confidence: 0.89,
          timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
          metadata: {},
        },
        {
          id: "sent2",
          cryptocurrency: "Ethereum",
          source: "twitter",
          content:
            "ETH gas fees are still too high for small transactions. This needs to be addressed for wider adoption.",
          sentiment_score: -42.3,
          sentiment_label: "negative",
          confidence: 0.76,
          timestamp: new Date(Date.now() - 1000 * 60 * 32).toISOString(),
          metadata: {},
        },
        {
          id: "sent3",
          cryptocurrency: "Bitcoin",
          source: "news",
          content:
            "Major institutional investor announces $200M Bitcoin purchase, citing inflation hedge strategy.",
          sentiment_score: 85.7,
          sentiment_label: "positive",
          confidence: 0.92,
          timestamp: new Date(Date.now() - 1000 * 60 * 55).toISOString(),
          metadata: {},
        },
        {
          id: "sent4",
          cryptocurrency: "Solana",
          source: "forexfactory",
          content:
            "Solana network performance remains stable after recent upgrades. Transaction speeds continue to impress.",
          sentiment_score: 62.1,
          sentiment_label: "positive",
          confidence: 0.81,
          timestamp: new Date(Date.now() - 1000 * 60 * 78).toISOString(),
          metadata: {},
        },
        {
          id: "sent5",
          cryptocurrency: "Cardano",
          source: "reddit",
          content:
            "Cardano's slow and methodical approach to development may be frustrating but ensures security and stability.",
          sentiment_score: 12.4,
          sentiment_label: "neutral",
          confidence: 0.65,
          timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
          metadata: {},
        },
      ];

      try {
        try {
          const response = await fetch(
            `/api/sentiment/recent?cryptocurrency=${cryptocurrency}&source=${source}&limit=${limit}`,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );

          if (!response.ok) {
            throw new Error(
              `Error fetching recent sentiment: ${response.statusText}`
            );
          }

          const data = await response.json();
          setFeed(data);
        } catch (apiError) {
          console.warn("API fetch failed, using mock data:", apiError);

          // Filter mock data based on criteria
          let filteredMockFeed = [...mockFeed];

          if (cryptocurrency !== "all") {
            filteredMockFeed = filteredMockFeed.filter(
              (item) =>
                item.cryptocurrency.toLowerCase() ===
                cryptocurrency.toLowerCase()
            );
          }

          if (source !== "all") {
            filteredMockFeed = filteredMockFeed.filter(
              (item) => item.source.toLowerCase() === source.toLowerCase()
            );
          }

          setFeed(filteredMockFeed.slice(0, limit));
        }
      } catch (err) {
        console.error("Error fetching recent sentiment:", err);
        setFeed([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitialData();

    // Subscribe to real-time updates if connected
    if (isConnected) {
      subscribeToChannel("sentiment", { cryptocurrency, source });
    }
  }, [cryptocurrency, source, limit, isConnected, subscribeToChannel]);

  // Update feed when new data comes in via WebSocket
  useEffect(() => {
    if (sentimentData.length > 0) {
      const latestItem = sentimentData[0];

      // Filter based on criteria
      if (
        (cryptocurrency === "all" ||
          latestItem.cryptocurrency === cryptocurrency) &&
        (source === "all" || latestItem.source === source)
      ) {
        setFeed((prev) => {
          // Check if item already exists
          const exists = prev.some((item) => item.id === latestItem.id);
          if (exists) return prev;

          // Add to beginning and limit the array
          return [latestItem as SentimentItem, ...prev].slice(0, limit);
        });
      }
    }
  }, [sentimentData, cryptocurrency, source, limit]);

  // Function to get appropriate icon for source
  const getSourceIcon = (source: string) => {
    switch (source) {
      case "reddit":
        return "🔴";
      case "twitter":
        return "🔵";
      case "forexfactory":
        return "📊";
      case "news":
        return "📰";
      default:
        return "🌐";
    }
  };

  // Function to get color based on sentiment
  const getSentimentColor = (label: string) => {
    switch (label) {
      case "positive":
        return "text-green-600";
      case "negative":
        return "text-red-600";
      default:
        return "text-yellow-600";
    }
  };

  // Truncate content for display
  const truncateContent = (content: string, maxLength = 100) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + "...";
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Sentiment</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex h-[200px] items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Sentiment</CardTitle>
      </CardHeader>
      <CardContent>
        {feed.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">
              No recent sentiment data available
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {feed.map((item) => (
              <div key={item.id} className="border rounded-md p-3">
                <div className="flex items-center gap-2 mb-1">
                  <span>{getSourceIcon(item.source)}</span>
                  <span className="font-semibold">{item.cryptocurrency}</span>
                  <span className="text-xs text-muted-foreground ml-auto">
                    {formatDistanceToNow(new Date(item.timestamp), {
                      addSuffix: true,
                    })}
                  </span>
                </div>
                <p className="text-sm mb-2">{truncateContent(item.content)}</p>
                <div className="flex justify-between items-center text-xs">
                  <span className={getSentimentColor(item.sentiment_label)}>
                    {item.sentiment_label.charAt(0).toUpperCase() +
                      item.sentiment_label.slice(1)}
                    ({item.sentiment_score > 0 ? "+" : ""}
                    {item.sentiment_score.toFixed(1)})
                  </span>
                  <span className="text-muted-foreground">
                    Confidence: {(item.confidence * 100).toFixed(0)}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
