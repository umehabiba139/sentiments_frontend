"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Download, TrendingDown, TrendingUp, Minus } from "lucide-react"
import { SentimentChart } from "@/components/sentiment-chart"
import { RecentTransactions } from "@/components/recent-transactions"
import { RecentSentimentFeed } from "@/components/recent-sentiment-feed"
import { WebSocketClient } from "@/components/WebSocketProvider"

export default function DashboardPage() {
  const [sentimentOverview, setSentimentOverview] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [redditSentiment, setRedditSentiment] = useState<{ label: string; score: number } | null>(null)
  const [redditLoading, setRedditLoading] = useState(true)

  const fetchRedditSentiment = async (coin = "BTC", timeframe = "7d") => {
  setRedditLoading(true)
  try {
    const res = await fetch(`http://localhost:8000/api/sentiment-timeseries?coin=${coin}&timeframe=${timeframe}`)
    if (!res.ok) throw new Error("Failed to fetch Reddit sentiment")
    const data = await res.json()

    if (data.series && data.series.length > 0) {
      // Get the latest record
      const latest = data.series[data.series.length - 1]

      // Find highest sentiment among positive, neutral, negative
      const highest = Object.entries(latest)
        .filter(([key]) => ["positive", "neutral", "negative"].includes(key))
        .sort((a, b) => b[1] - a[1])[0]

      setRedditSentiment({ label: highest[0], score: highest[1] })
    } else {
      setRedditSentiment({ label: "N/A", score: 0 })
    }
  } catch (err) {
    console.error(err)
    setRedditSentiment({ label: "N/A", score: 0 })
  } finally {
    setRedditLoading(false)
  }
}

useEffect(() => {
  fetchRedditSentiment()
}, [])



  useEffect(() => {
    // Mock data only
    const mockOverview = {
      overall: { label: "positive", score: 65.8, change: 7.2 },
      sources: {
        reddit: { label: "positive", score: 72.5 },
        forexfactory: { label: "neutral", score: 58.3 },
        news: { label: "positive", score: 63.7 },
      },
      cryptocurrencies: {
        bitcoin: { label: "positive", score: 75.2, change: 8.5 },
        ethereum: { label: "positive", score: 68.4, change: 5.3 },
      },
    }

    // Simulate loading
    setTimeout(() => {
      setSentimentOverview(mockOverview)
      setIsLoading(false)
    }, 500)
  }, [])

  const getSentimentIcon = (label: string, change: number) => {
    if (label === "positive" || change > 5) return <TrendingUp className="h-4 w-4 text-green-500" />
    if (label === "negative" || change < -5) return <TrendingDown className="h-4 w-4 text-red-500" />
    return <Minus className="h-4 w-4 text-yellow-500" />
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

          {/* Overview Tab */}
<TabsContent value="overview" className="space-y-4">
  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
    {/* Overall Sentiment */}
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Overall Sentiment</CardTitle>
        {!isLoading && sentimentOverview && getSentimentIcon(sentimentOverview.overall.label, sentimentOverview.overall.change)}
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="animate-pulse h-10 bg-muted rounded"></div>
        ) : sentimentOverview ? (
          <>
            <div className="text-2xl font-bold capitalize">{sentimentOverview.overall.label}</div>
            <p className="text-xs text-muted-foreground">
              {`${sentimentOverview.overall.change > 0 ? "+" : ""}${sentimentOverview.overall.change.toFixed(2)}% from last period`}
            </p>
          </>
        ) : (
          <div className="text-2xl font-bold">No Data</div>
        )}
      </CardContent>
    </Card>

    {/* Reddit Sentiment */}
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Reddit Sentiment</CardTitle>
        {!redditLoading && redditSentiment && getSentimentIcon(redditSentiment.label, 0)}
      </CardHeader>
      <CardContent>
        {redditLoading ? (
          <div className="animate-pulse h-10 bg-muted rounded"></div>
        ) : redditSentiment ? (
          <>
            <div className="text-2xl font-bold capitalize">{redditSentiment.label}</div>
            <p className="text-xs text-muted-foreground">
              Score: {redditSentiment.score.toFixed(1)}%
            </p>
          </>
        ) : (
          <div className="text-2xl font-bold">No Data</div>
        )}
      </CardContent>
    </Card>

    {/* ForexFactory Sentiment (still mock) */}
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Forexfactory Sentiment</CardTitle>
        {!isLoading && sentimentOverview && getSentimentIcon(sentimentOverview.sources.forexfactory.label, 0)}
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="animate-pulse h-10 bg-muted rounded"></div>
        ) : sentimentOverview ? (
          <>
            <div className="text-2xl font-bold capitalize">{sentimentOverview.sources.forexfactory.label}</div>
            <p className="text-xs text-muted-foreground">
              Score: {sentimentOverview.sources.forexfactory.score.toFixed(1)}
            </p>
          </>
        ) : (
          <div className="text-2xl font-bold">No Data</div>
        )}
      </CardContent>
    </Card>

    {/* News Sentiment (still mock) */}
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">News Sentiment</CardTitle>
        {!isLoading && sentimentOverview && getSentimentIcon(sentimentOverview.sources.news.label, 0)}
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="animate-pulse h-10 bg-muted rounded"></div>
        ) : sentimentOverview ? (
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
</TabsContent>


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

          {/* Bitcoin Tab */}
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

          {/* Ethereum Tab */}
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

          {/* Custom Tab */}
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
