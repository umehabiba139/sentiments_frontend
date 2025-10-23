"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ArrowDown, ArrowUp, Download, ExternalLink, Search } from "lucide-react"
import { WebSocketClient } from "@/components/websocket-client"

// Mock data for transactions
const allTransactions = [
  {
    id: "tx1",
    type: "Bitcoin",
    amount: "245.89 BTC",
    value: "$14,324,567",
    from: "0x1a2b...3c4d",
    to: "0x5e6f...7g8h",
    time: "10 minutes ago",
    direction: "outgoing",
  },
  {
    id: "tx2",
    type: "Ethereum",
    amount: "1,245.56 ETH",
    value: "$3,245,678",
    from: "0x9i8j...7k6l",
    to: "0x5m4n...3o2p",
    time: "25 minutes ago",
    direction: "incoming",
  },
  {
    id: "tx3",
    type: "USDT",
    amount: "5,000,000 USDT",
    value: "$5,000,000",
    from: "0xq1r2...s3t4",
    to: "0xu5v6...w7x8",
    time: "45 minutes ago",
    direction: "outgoing",
  },
  {
    id: "tx4",
    type: "Bitcoin",
    amount: "78.34 BTC",
    value: "$4,567,890",
    from: "0xy9z8...7a6b",
    to: "0xc5d4...e3f2",
    time: "1 hour ago",
    direction: "incoming",
  },
  {
    id: "tx5",
    type: "Ethereum",
    amount: "890.12 ETH",
    value: "$2,321,456",
    from: "0xg1h2...i3j4",
    to: "0xk5l6...m7n8",
    time: "2 hours ago",
    direction: "outgoing",
  },
  {
    id: "tx6",
    type: "Bitcoin",
    amount: "156.78 BTC",
    value: "$9,123,456",
    from: "0xo1p2...q3r4",
    to: "0xs5t6...u7v8",
    time: "3 hours ago",
    direction: "incoming",
  },
  {
    id: "tx7",
    type: "USDC",
    amount: "3,500,000 USDC",
    value: "$3,500,000",
    from: "0xw9x8...y7z6",
    to: "0xa5b4...c3d2",
    time: "4 hours ago",
    direction: "outgoing",
  },
  {
    id: "tx8",
    type: "Solana",
    amount: "12,345 SOL",
    value: "$987,600",
    from: "0xe1f2...g3h4",
    to: "0xi5j6...k7l8",
    time: "5 hours ago",
    direction: "incoming",
  },
  {
    id: "tx9",
    type: "Bitcoin",
    amount: "67.89 BTC",
    value: "$3,954,321",
    from: "0xm9n8...o7p6",
    to: "0xq5r4...s3t2",
    time: "6 hours ago",
    direction: "outgoing",
  },
  {
    id: "tx10",
    type: "Ethereum",
    amount: "456.78 ETH",
    value: "$1,192,345",
    from: "0xu1v2...w3x4",
    to: "0xy5z6...a7b8",
    time: "7 hours ago",
    direction: "incoming",
  },
]

export default function TransactionsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [page, setPage] = useState(1)
  const [filter, setFilter] = useState("all")
  const pageSize = 5

  // Filter transactions based on search query and filter
  const filteredTransactions = allTransactions.filter((tx) => {
    const matchesSearch =
      tx.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.from.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.to.toLowerCase().includes(searchQuery.toLowerCase())

    if (filter === "all") return matchesSearch
    if (filter === "incoming") return matchesSearch && tx.direction === "incoming"
    if (filter === "outgoing") return matchesSearch && tx.direction === "outgoing"

    return matchesSearch
  })

  const totalPages = Math.ceil(filteredTransactions.length / pageSize)

  const paginatedTransactions = filteredTransactions.slice((page - 1) * pageSize, page * pageSize)

  return (
    <WebSocketClient serverUrl={process.env.NEXT_PUBLIC_WS_URL || "http://localhost:5000"}>
      <div className="flex flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Transaction Tracking</h1>
          <Button variant="outline" size="sm" className="h-8 gap-1">
            <Download className="h-3.5 w-3.5" />
            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">Export Data</span>
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Transactions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1,245</div>
              <p className="text-xs text-muted-foreground">+123 from yesterday</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Bitcoin Transactions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">567</div>
              <p className="text-xs text-muted-foreground">+45 from yesterday</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Ethereum Transactions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">432</div>
              <p className="text-xs text-muted-foreground">+38 from yesterday</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Other Transactions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">246</div>
              <p className="text-xs text-muted-foreground">+40 from yesterday</p>
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-col gap-4 md:flex-row">
          <div className="flex-1 space-y-4">
            <Card className="flex-1">
              <CardHeader>
                <CardTitle>Transaction Tracking</CardTitle>
                <CardDescription>Monitor large cryptocurrency transactions</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search by wallet address or cryptocurrency..."
                        className="pl-8"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="w-full md:w-48">
                    <Select value={filter} onValueChange={setFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder="Filter transactions" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Transactions</SelectItem>
                        <SelectItem value="incoming">Incoming Only</SelectItem>
                        <SelectItem value="outgoing">Outgoing Only</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Type</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead className="hidden md:table-cell">Value</TableHead>
                        <TableHead className="hidden md:table-cell">From</TableHead>
                        <TableHead className="hidden md:table-cell">To</TableHead>
                        <TableHead>Time</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {paginatedTransactions.length > 0 ? (
                        paginatedTransactions.map((tx) => (
                          <TableRow key={tx.id}>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                {tx.direction === "incoming" ? (
                                  <ArrowDown className="h-4 w-4 text-green-500" />
                                ) : (
                                  <ArrowUp className="h-4 w-4 text-red-500" />
                                )}
                                {tx.type}
                              </div>
                            </TableCell>
                            <TableCell>{tx.amount}</TableCell>
                            <TableCell className="hidden md:table-cell">{tx.value}</TableCell>
                            <TableCell className="hidden md:table-cell">{tx.from}</TableCell>
                            <TableCell className="hidden md:table-cell">{tx.to}</TableCell>
                            <TableCell>{tx.time}</TableCell>
                            <TableCell className="text-right">
                              <Button variant="ghost" size="icon">
                                <ExternalLink className="h-4 w-4" />
                                <span className="sr-only">View transaction</span>
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={7} className="h-24 text-center">
                            No transactions found.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>

                {totalPages > 1 && (
                  <div className="flex items-center justify-end space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage(page > 1 ? page - 1 : 1)}
                      disabled={page === 1}
                    >
                      Previous
                    </Button>
                    <div className="text-sm text-muted-foreground">
                      Page {page} of {totalPages}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage(page < totalPages ? page + 1 : totalPages)}
                      disabled={page === totalPages}
                    >
                      Next
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Wallet Lookup</CardTitle>
                <CardDescription>Search for a specific wallet address</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <div className="grid flex-1 gap-2">
                      <Label htmlFor="wallet-search">Wallet Address</Label>
                      <Input id="wallet-search" placeholder="Enter wallet address..." />
                    </div>
                    <div className="mt-8">
                      <Button type="submit">Search</Button>
                    </div>
                  </div>

                  <div className="rounded-md border p-4 text-center">
                    <p className="text-muted-foreground">Enter a wallet address to see its transaction history</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="md:w-80 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Transaction Alerts</CardTitle>
                <CardDescription>Get notified about large transactions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Cryptocurrency</Label>
                    <Select defaultValue="all">
                      <SelectTrigger>
                        <SelectValue placeholder="Select cryptocurrency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Cryptocurrencies</SelectItem>
                        <SelectItem value="btc">Bitcoin</SelectItem>
                        <SelectItem value="eth">Ethereum</SelectItem>
                        <SelectItem value="sol">Solana</SelectItem>
                        <SelectItem value="usdt">USDT</SelectItem>
                        <SelectItem value="usdc">USDC</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Minimum Transaction Value</Label>
                    <Select defaultValue="1m">
                      <SelectTrigger>
                        <SelectValue placeholder="Select minimum value" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="100k">$100,000+</SelectItem>
                        <SelectItem value="500k">$500,000+</SelectItem>
                        <SelectItem value="1m">$1,000,000+</SelectItem>
                        <SelectItem value="5m">$5,000,000+</SelectItem>
                        <SelectItem value="10m">$10,000,000+</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Alert Method</Label>
                    <Select defaultValue="email">
                      <SelectTrigger>
                        <SelectValue placeholder="Select alert method" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="email">Email</SelectItem>
                        <SelectItem value="push">Push Notification</SelectItem>
                        <SelectItem value="both">Both</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button className="w-full">Save Alert Settings</Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Alerts</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="rounded-md border p-3">
                    <div className="flex items-center gap-2">
                      <ArrowUp className="h-4 w-4 text-red-500" />
                      <span className="font-medium">Bitcoin</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      245.89 BTC ($14,324,567) transferred 10 minutes ago
                    </p>
                  </div>

                  <div className="rounded-md border p-3">
                    <div className="flex items-center gap-2">
                      <ArrowDown className="h-4 w-4 text-green-500" />
                      <span className="font-medium">Ethereum</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      1,245.56 ETH ($3,245,678) received 25 minutes ago
                    </p>
                  </div>

                  <div className="rounded-md border p-3">
                    <div className="flex items-center gap-2">
                      <ArrowUp className="h-4 w-4 text-red-500" />
                      <span className="font-medium">USDT</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">5,000,000 USDT transferred 45 minutes ago</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </WebSocketClient>
  )
}

