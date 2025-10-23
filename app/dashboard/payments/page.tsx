"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { AlertCircle, CheckCircle2, CreditCard, Download } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Mock data for payment history
const paymentHistory = [
  {
    id: "pay1",
    date: "Mar 25, 2025",
    amount: "$49.99",
    method: "Ethereum",
    status: "Completed",
    description: "Premium Plan - Monthly",
  },
  {
    id: "pay2",
    date: "Feb 25, 2025",
    amount: "$49.99",
    method: "USDC",
    status: "Completed",
    description: "Premium Plan - Monthly",
  },
  {
    id: "pay3",
    date: "Jan 25, 2025",
    amount: "$49.99",
    method: "Bitcoin",
    status: "Completed",
    description: "Premium Plan - Monthly",
  },
  {
    id: "pay4",
    date: "Dec 25, 2024",
    amount: "$49.99",
    method: "Ethereum",
    status: "Completed",
    description: "Premium Plan - Monthly",
  },
  {
    id: "pay5",
    date: "Nov 25, 2024",
    amount: "$49.99",
    method: "USDC",
    status: "Completed",
    description: "Premium Plan - Monthly",
  },
]

export default function PaymentsPage() {
  const [paymentMethod, setPaymentMethod] = useState("eth")
  const [paymentAmount, setPaymentAmount] = useState("49.99")
  const [walletAddress, setWalletAddress] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [paymentSuccess, setPaymentSuccess] = useState(false)
  const [paymentError, setPaymentError] = useState("")

  const handlePayment = async () => {
    setIsProcessing(true)
    setPaymentSuccess(false)
    setPaymentError("")

    try {
      // This would be an API call to your payment processor
      console.log("Processing payment:", {
        method: paymentMethod,
        amount: paymentAmount,
        walletAddress: walletAddress || "Connected wallet",
      })

      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Simulate successful payment
      setPaymentSuccess(true)
    } catch (error) {
      console.error("Payment error:", error)
      setPaymentError("Payment failed. Please try again.")
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="flex flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Payments</h1>
        <Button variant="outline" size="sm" className="h-8 gap-1">
          <Download className="h-3.5 w-3.5" />
          <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">Export History</span>
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Plan</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Premium</div>
            <p className="text-xs text-muted-foreground">$49.99/month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Next Billing Date</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Apr 25, 2025</div>
            <p className="text-xs text-muted-foreground">Auto-renewal enabled</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Payment Method</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Ethereum</div>
            <p className="text-xs text-muted-foreground">Last used on Mar 25, 2025</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$249.95</div>
            <p className="text-xs text-muted-foreground">Last 5 months</p>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col gap-4 md:flex-row">
        <div className="flex-1 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Payment History</CardTitle>
              <CardDescription>View your payment history and receipts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead className="hidden md:table-cell">Method</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paymentHistory.map((payment) => (
                      <TableRow key={payment.id}>
                        <TableCell>{payment.date}</TableCell>
                        <TableCell>{payment.description}</TableCell>
                        <TableCell>{payment.amount}</TableCell>
                        <TableCell className="hidden md:table-cell">{payment.method}</TableCell>
                        <TableCell>
                          <span className="inline-flex items-center rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700">
                            {payment.status}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Subscription Plans</CardTitle>
              <CardDescription>Choose the plan that works for you</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <Card>
                  <CardHeader>
                    <CardTitle>Basic</CardTitle>
                    <CardDescription>For individual users</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">$19.99</div>
                    <p className="text-sm text-muted-foreground">per month</p>
                    <ul className="mt-4 space-y-2 text-sm">
                      <li className="flex items-center">
                        <CheckCircle2 className="mr-2 h-4 w-4 text-green-500" />
                        Basic sentiment analysis
                      </li>
                      <li className="flex items-center">
                        <CheckCircle2 className="mr-2 h-4 w-4 text-green-500" />
                        Limited transaction tracking
                      </li>
                      <li className="flex items-center">
                        <CheckCircle2 className="mr-2 h-4 w-4 text-green-500" />
                        Basic trend predictions
                      </li>
                    </ul>
                  </CardContent>
                  <div className="p-6 pt-0">
                    <Button variant="outline" className="w-full">
                      Downgrade
                    </Button>
                  </div>
                </Card>

                <Card className="border-primary">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>Premium</CardTitle>
                      <span className="rounded-full bg-primary px-2 py-1 text-xs text-primary-foreground">Current</span>
                    </div>
                    <CardDescription>For serious traders</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">$49.99</div>
                    <p className="text-sm text-muted-foreground">per month</p>
                    <ul className="mt-4 space-y-2 text-sm">
                      <li className="flex items-center">
                        <CheckCircle2 className="mr-2 h-4 w-4 text-green-500" />
                        Advanced sentiment analysis
                      </li>
                      <li className="flex items-center">
                        <CheckCircle2 className="mr-2 h-4 w-4 text-green-500" />
                        Full transaction tracking
                      </li>
                      <li className="flex items-center">
                        <CheckCircle2 className="mr-2 h-4 w-4 text-green-500" />
                        Advanced trend predictions
                      </li>
                      <li className="flex items-center">
                        <CheckCircle2 className="mr-2 h-4 w-4 text-green-500" />
                        Real-time alerts
                      </li>
                    </ul>
                  </CardContent>
                  <div className="p-6 pt-0">
                    <Button className="w-full" disabled>
                      Current Plan
                    </Button>
                  </div>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Enterprise</CardTitle>
                    <CardDescription>For organizations</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">$199.99</div>
                    <p className="text-sm text-muted-foreground">per month</p>
                    <ul className="mt-4 space-y-2 text-sm">
                      <li className="flex items-center">
                        <CheckCircle2 className="mr-2 h-4 w-4 text-green-500" />
                        All Premium features
                      </li>
                      <li className="flex items-center">
                        <CheckCircle2 className="mr-2 h-4 w-4 text-green-500" />
                        Custom API access
                      </li>
                      <li className="flex items-center">
                        <CheckCircle2 className="mr-2 h-4 w-4 text-green-500" />
                        Dedicated support
                      </li>
                      <li className="flex items-center">
                        <CheckCircle2 className="mr-2 h-4 w-4 text-green-500" />
                        Multiple user accounts
                      </li>
                    </ul>
                  </CardContent>
                  <div className="p-6 pt-0">
                    <Button variant="outline" className="w-full">
                      Upgrade
                    </Button>
                  </div>
                </Card>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="md:w-80 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Make a Payment</CardTitle>
              <CardDescription>Pay with cryptocurrency</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {paymentSuccess && (
                  <Alert className="bg-green-50 text-green-800 border-green-200">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    <AlertTitle>Success!</AlertTitle>
                    <AlertDescription>Your payment has been processed successfully.</AlertDescription>
                  </Alert>
                )}

                {paymentError && (
                  <Alert className="bg-red-50 text-red-800 border-red-200">
                    <AlertCircle className="h-4 w-4 text-red-600" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{paymentError}</AlertDescription>
                  </Alert>
                )}

                <div className="space-y-2">
                  <Label>Payment Method</Label>
                  <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select payment method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="eth">Ethereum</SelectItem>
                      <SelectItem value="btc">Bitcoin</SelectItem>
                      <SelectItem value="usdc">USDC</SelectItem>
                      <SelectItem value="usdt">USDT</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Amount</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5">$</span>
                    <Input
                      type="text"
                      className="pl-7"
                      value={paymentAmount}
                      onChange={(e) => setPaymentAmount(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Wallet Address (Optional)</Label>
                  <Input
                    placeholder="Enter wallet address..."
                    value={walletAddress}
                    onChange={(e) => setWalletAddress(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">Leave empty to use your connected wallet</p>
                </div>

                <Button className="w-full" onClick={handlePayment} disabled={isProcessing}>
                  {isProcessing ? "Processing..." : "Make Payment"}
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Payment Methods</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="crypto">
                <TabsList className="w-full">
                  <TabsTrigger value="crypto" className="flex-1">
                    Crypto
                  </TabsTrigger>
                  <TabsTrigger value="card" className="flex-1">
                    Card
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="crypto" className="space-y-4 mt-4">
                  <div className="rounded-md border p-3">
                    <div className="flex items-center gap-2">
                      <div className="rounded-full bg-primary/10 p-1">
                        <svg
                          className="h-4 w-4 text-primary"
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M11.767 19.089c4.924.868 6.14-6.025 1.216-6.894m-1.216 6.894L5.86 18.047m5.908 1.042-.347 1.97m1.563-8.864c4.924.869 6.14-6.025 1.215-6.893m-1.215 6.893-3.94-.694m5.155-6.2L8.29 4.26m5.908 1.042.348-1.97M7.48 20.364l3.126-17.727" />
                        </svg>
                      </div>
                      <span className="font-medium">Ethereum</span>
                      <span className="ml-auto text-sm text-muted-foreground">Default</span>
                    </div>
                  </div>

                  <div className="rounded-md border p-3">
                    <div className="flex items-center gap-2">
                      <div className="rounded-full bg-primary/10 p-1">
                        <svg
                          className="h-4 w-4 text-primary"
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M11.767 19.089c4.924.868 6.14-6.025 1.216-6.894m-1.216 6.894L5.86 18.047m5.908 1.042-.347 1.97m1.563-8.864c4.924.869 6.14-6.025 1.215-6.893m-1.215 6.893-3.94-.694m5.155-6.2L8.29 4.26m5.908 1.042.348-1.97M7.48 20.364l3.126-17.727" />
                        </svg>
                      </div>
                      <span className="font-medium">Bitcoin</span>
                    </div>
                  </div>

                  <Button variant="outline" className="w-full">
                    Add Wallet
                  </Button>
                </TabsContent>

                <TabsContent value="card" className="space-y-4 mt-4">
                  <div className="rounded-md border p-3">
                    <div className="flex items-center gap-2">
                      <CreditCard className="h-4 w-4 text-primary" />
                      <span className="font-medium">•••• •••• •••• 4242</span>
                      <span className="ml-auto text-sm text-muted-foreground">Expires 12/25</span>
                    </div>
                  </div>

                  <Button variant="outline" className="w-full">
                    Add Card
                  </Button>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

