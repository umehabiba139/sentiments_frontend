"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { TrendPredictionCard } from "@/components/trend-prediction-card"
import { Download, Search } from "lucide-react"
import { WebSocketClient } from "@/components/websocket-client"

export default function TrendsPage() {
  const [searchQuery, setSearchQuery] = useState("")

  return (
    <WebSocketClient serverUrl={process.env.NEXT_PUBLIC_WS_URL || "http://localhost:5000"}>
      <div className="flex flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Trend Prediction</h1>
          <Button variant="outline" size="sm" className="h-8 gap-1">
            <Download className="h-3.5 w-3.5" />
            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">Export Data</span>
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Short-term Predictions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">85% Accuracy</div>
              <p className="text-xs text-muted-foreground">+5% from last month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Mid-term Predictions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">78% Accuracy</div>
              <p className="text-xs text-muted-foreground">+2% from last month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Long-term Predictions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">72% Accuracy</div>
              <p className="text-xs text-muted-foreground">-3% from last month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Overall Accuracy</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">79% Accuracy</div>
              <p className="text-xs text-muted-foreground">+1% from last month</p>
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-col gap-4 md:flex-row">
          <div className="flex-1 space-y-4">
            <Card className="flex-1">
              <CardHeader>
                <CardTitle>Trend Predictions</CardTitle>
                <CardDescription>AI-powered market trend predictions</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="short" className="space-y-4">
                  <TabsList>
                    <TabsTrigger value="short">Short-term (24h)</TabsTrigger>
                    <TabsTrigger value="mid">Mid-term (7d)</TabsTrigger>
                    <TabsTrigger value="long">Long-term (30d)</TabsTrigger>
                  </TabsList>

                  <TabsContent value="short" className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <TrendPredictionCard coin="Bitcoin" prediction="Bullish" confidence={92} trend="up" />
                      <TrendPredictionCard coin="Ethereum" prediction="Bullish" confidence={87} trend="up" />
                      <TrendPredictionCard coin="Solana" prediction="Bullish" confidence={83} trend="up" />
                      <TrendPredictionCard coin="Cardano" prediction="Neutral" confidence={65} trend="neutral" />
                      <TrendPredictionCard coin="Dogecoin" prediction="Bearish" confidence={78} trend="down" />
                      <TrendPredictionCard coin="Polkadot" prediction="Neutral" confidence={61} trend="neutral" />
                    </div>
                  </TabsContent>

                  <TabsContent value="mid" className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <TrendPredictionCard coin="Bitcoin" prediction="Bullish" confidence={85} trend="up" />
                      <TrendPredictionCard coin="Ethereum" prediction="Bullish" confidence={82} trend="up" />
                      <TrendPredictionCard coin="Solana" prediction="Neutral" confidence={68} trend="neutral" />
                      <TrendPredictionCard coin="Cardano" prediction="Bearish" confidence={72} trend="down" />
                      <TrendPredictionCard coin="Dogecoin" prediction="Bearish" confidence={75} trend="down" />
                      <TrendPredictionCard coin="Polkadot" prediction="Bullish" confidence={77} trend="up" />
                    </div>
                  </TabsContent>

                  <TabsContent value="long" className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <TrendPredictionCard coin="Bitcoin" prediction="Bullish" confidence={79} trend="up" />
                      <TrendPredictionCard coin="Ethereum" prediction="Bullish" confidence={76} trend="up" />
                      <TrendPredictionCard coin="Solana" prediction="Bullish" confidence={71} trend="up" />
                      <TrendPredictionCard coin="Cardano" prediction="Neutral" confidence={65} trend="neutral" />
                      <TrendPredictionCard coin="Dogecoin" prediction="Bearish" confidence={68} trend="down" />
                      <TrendPredictionCard coin="Polkadot" prediction="Bullish" confidence={70} trend="up" />
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Historical Accuracy</CardTitle>
                <CardDescription>Track record of prediction accuracy</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] flex items-center justify-center">
                  <p className="text-muted-foreground">Historical accuracy chart will appear here</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="md:w-80 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Search</CardTitle>
                <CardDescription>Search for specific cryptocurrencies</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <div className="grid flex-1 gap-2">
                      <Label htmlFor="search">Cryptocurrency</Label>
                      <div className="relative">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="search"
                          placeholder="Bitcoin, Ethereum, etc."
                          className="pl-8"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="mt-8">
                      <Button type="submit">Search</Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Prediction Timeframe</Label>
                    <Select defaultValue="short">
                      <SelectTrigger>
                        <SelectValue placeholder="Select timeframe" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="short">Short-term (24h)</SelectItem>
                        <SelectItem value="mid">Mid-term (7d)</SelectItem>
                        <SelectItem value="long">Long-term (30d)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Confidence Threshold</Label>
                    <Select defaultValue="all">
                      <SelectTrigger>
                        <SelectValue placeholder="Select threshold" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Predictions</SelectItem>
                        <SelectItem value="high">High Confidence ({">"}80%)</SelectItem>
                        <SelectItem value="medium">Medium Confidence (60-80%)</SelectItem>
                        <SelectItem value="low">Low Confidence ({"<"}60%)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button className="w-full">Apply Filters</Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Alert Settings</CardTitle>
                <CardDescription>Get notified about significant changes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Alert Threshold</Label>
                    <Select defaultValue="high">
                      <SelectTrigger>
                        <SelectValue placeholder="Select threshold" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="high">High Confidence Only</SelectItem>
                        <SelectItem value="medium">Medium & High Confidence</SelectItem>
                        <SelectItem value="all">All Predictions</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button className="w-full">Save Alert Settings</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </WebSocketClient>
  )
}

