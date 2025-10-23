"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Download, TrendingDown, TrendingUp, Minus } from "lucide-react"
import { SentimentChart } from "@/components/sentiment-chart"
import { RecentTransactions } from "@/components/recent-transactions"
import { RecentSentimentFeed } from "@/components/recent-sentiment-feed"
import { WebSocketClient } from "@/components/websocket-client"

export default function DashboardPage() {
  const [sentimentOverview, setSentimentOverview] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Fetch sentiment overview
  useEffect(() => {
    const fetchSentimentOverview = async () => {
      try {
        // Mock data to use when API is unavailable
        const mockOverview = {
          overall: {
            label: "positive",
            score: 65.8,
            change: 7.2,
          },
          sources: {
            reddit: {
              label: "positive",
              score: 72.5,
            },
            forexfactory: {
              label: "neutral",
              score: 58.3,
            },
            news: {
              label: "positive",
              score: 63.7,
            },
            twitter: {
              label: "positive",
              score: 68.9,
            },
          },
          cryptocurrencies: {
            bitcoin: {
              label: "positive",
              score: 75.2,
              change: 8.5,
            },
            ethereum: {
              label: "positive",
              score: 68.4,
              change: 5.3,
            },
          },
        }

        try {
          const response = await fetch("/api/sentiment/overview", {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          })

          if (!response.ok) {
            throw new Error(`Error fetching sentiment overview: ${response.statusText}`)
          }

          const data = await response.json()
          setSentimentOverview(data)
        } catch (apiError) {
          console.warn("API fetch failed, using mock data:", apiError)
          // Use mock data if API fails
          setSentimentOverview(mockOverview)
        }
      } catch (err) {
        console.error("Error in sentiment overview:", err)
        // Set default mock data even if there's an error
        setSentimentOverview({
          overall: { label: "neutral", score: 50, change: 0 },
          sources: {
            reddit: { label: "neutral", score: 50 },
            forexfactory: { label: "neutral", score: 50 },
            news: { label: "neutral", score: 50 },
          },
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchSentimentOverview()

    // Refresh every 5 minutes
    const interval = setInterval(fetchSentimentOverview, 5 * 60 * 1000)

    return () => clearInterval(interval)
  }, [])

  // Helper function for sentiment cards
  const getSentimentIcon = (label: string, change: number) => {
    if (label === "positive" || change > 5) {
      return <TrendingUp className="h-4 w-4 text-green-500" />
    } else if (label === "negative" || change < -5) {
      return <TrendingDown className="h-4 w-4 text-red-500" />
    } else {
      return <Minus className="h-4 w-4 text-yellow-500" />
    }
  }

  return (
    <WebSocketClient serverUrl={process.env.NEXT_PUBLIC_WS_URL || "http://localhost:5000"}>
      <div className="flex flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <Button variant="outline" size="sm" className="h-8 gap-1">
            <Download className="h-3.5 w-3.5" />
            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">Export Data</span>
          </Button>
        </div>

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="bitcoin">Bitcoin</TabsTrigger>
            <TabsTrigger value="ethereum">Ethereum</TabsTrigger>
            <TabsTrigger value="custom">Custom</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Overall Sentiment</CardTitle>
                  {!isLoading &&
                    sentimentOverview &&
                    getSentimentIcon(sentimentOverview.overall.label, sentimentOverview.overall.change)}
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="animate-pulse h-10 bg-muted rounded"></div>
                  ) : sentimentOverview ? (
                    <>
                      <div className="text-2xl font-bold capitalize">{sentimentOverview.overall.label}</div>
                      <p className="text-xs text-muted-foreground">
                        {sentimentOverview.overall.change > 0 ? "+" : ""}
                        {sentimentOverview.overall.change.toFixed(2)}% from last period
                      </p>
                    </>
                  ) : (
                    <div className="text-2xl font-bold">No Data</div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Reddit Sentiment</CardTitle>
                  {!isLoading &&
                    sentimentOverview &&
                    sentimentOverview.sources.reddit.score &&
                    getSentimentIcon(sentimentOverview.sources.reddit.label, 0)}
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="animate-pulse h-10 bg-muted rounded"></div>
                  ) : sentimentOverview && sentimentOverview.sources.reddit.score !== null ? (
                    <>
                      <div className="text-2xl font-bold capitalize">{sentimentOverview.sources.reddit.label}</div>
                      <p className="text-xs text-muted-foreground">
                        Score: {sentimentOverview.sources.reddit.score.toFixed(1)}
                      </p>
                    </>
                  ) : (
                    <div className="text-2xl font-bold">No Data</div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">ForexFactory Sentiment</CardTitle>
                  {!isLoading &&
                    sentimentOverview &&
                    sentimentOverview.sources.forexfactory.score &&
                    getSentimentIcon(sentimentOverview.sources.forexfactory.label, 0)}
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="animate-pulse h-10 bg-muted rounded"></div>
                  ) : sentimentOverview && sentimentOverview.sources.forexfactory.score !== null ? (
                    <>
                      <div className="text-2xl font-bold capitalize">
                        {sentimentOverview.sources.forexfactory.label}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Score: {sentimentOverview.sources.forexfactory.score.toFixed(1)}
                      </p>
                    </>
                  ) : (
                    <div className="text-2xl font-bold">No Data</div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">News Sentiment</CardTitle>
                  {!isLoading &&
                    sentimentOverview &&
                    sentimentOverview.sources.news.score &&
                    getSentimentIcon(sentimentOverview.sources.news.label, 0)}
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="animate-pulse h-10 bg-muted rounded"></div>
                  ) : sentimentOverview && sentimentOverview.sources.news.score !== null ? (
                    <>
                      <div className="text-2xl font-bold capitalize">{sentimentOverview.sources.news.label}</div>
                      <p className="text-xs text-muted-foreground">
                        Score: {sentimentOverview.sources.news.score.toFixed(1)}
                      </p>
                    </>
                  ) : (
                    <div className="text-2xl font-bold">No Data</div>
                  )}
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
              <Card className="lg:col-span-4">
                <CardHeader>
                  <CardTitle>Sentiment Trends</CardTitle>
                  <CardDescription>Sentiment analysis over the past 30 days</CardDescription>
                </CardHeader>
                <CardContent>
                  <SentimentChart />
                </CardContent>
              </Card>

              <Card className="lg:col-span-3">
                <CardHeader>
                  <CardTitle>Recent Sentiment</CardTitle>
                  <CardDescription>Latest sentiment data from multiple sources</CardDescription>
                </CardHeader>
                <CardContent>
                  <RecentSentimentFeed limit={3} />
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Recent Large Transactions</CardTitle>
                <CardDescription>Monitoring significant blockchain movements</CardDescription>
              </CardHeader>
              <CardContent>
                <RecentTransactions />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="bitcoin" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Bitcoin Sentiment Analysis</CardTitle>
                <CardDescription>Detailed sentiment analysis for Bitcoin</CardDescription>
              </CardHeader>
              <CardContent>
                <SentimentChart cryptocurrency="Bitcoin" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Bitcoin Sentiment</CardTitle>
                <CardDescription>Latest sentiment data for Bitcoin</CardDescription>
              </CardHeader>
              <CardContent>
                <RecentSentimentFeed cryptocurrency="Bitcoin" limit={5} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="ethereum" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Ethereum Sentiment Analysis</CardTitle>
                <CardDescription>Detailed sentiment analysis for Ethereum</CardDescription>
              </CardHeader>
              <CardContent>
                <SentimentChart cryptocurrency="Ethereum" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Ethereum Sentiment</CardTitle>
                <CardDescription>Latest sentiment data for Ethereum</CardDescription>
              </CardHeader>
              <CardContent>
                <RecentSentimentFeed cryptocurrency="Ethereum" limit={5} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="custom" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Custom Analysis</CardTitle>
                <CardDescription>Create your own custom sentiment analysis</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Select Cryptocurrency</label>
                      <select className="w-full rounded-md border border-input p-2">
                        <option value="bitcoin">Bitcoin</option>
                        <option value="ethereum">Ethereum</option>
                        <option value="solana">Solana</option>
                        <option value="cardano">Cardano</option>
                        <option value="dogecoin">Dogecoin</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Select Data Source</label>
                      <select className="w-full rounded-md border border-input p-2">
                        <option value="all">All Sources</option>
                        <option value="reddit">Reddit</option>
                        <option value="forexfactory">ForexFactory</option>
                        <option value="news">News</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Time Period</label>
                      <select className="w-full rounded-md border border-input p-2">
                        <option value="1">Last 24 hours</option>
                        <option value="7">Last 7 days</option>
                        <option value="30">Last 30 days</option>
                        <option value="90">Last 90 days</option>
                      </select>
                    </div>

                    <div className="flex items-end">
                      <Button className="w-full">Apply Filters</Button>
                    </div>
                  </div>

                  <SentimentChart cryptocurrency="Bitcoin" />

                  <RecentSentimentFeed cryptocurrency="Bitcoin" limit={5} />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </WebSocketClient>
  )
}

