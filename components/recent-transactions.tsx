"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { ArrowDown, ArrowUp, ExternalLink } from "lucide-react"

// Mock data for recent transactions
const transactions = [
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
]

export function RecentTransactions() {
  const [page, setPage] = useState(1)
  const pageSize = 5
  const totalPages = Math.ceil(transactions.length / pageSize)

  const paginatedTransactions = transactions.slice((page - 1) * pageSize, page * pageSize)

  return (
    <div className="space-y-4">
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
            {paginatedTransactions.map((tx) => (
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
            ))}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-end space-x-2">
          <Button variant="outline" size="sm" onClick={() => setPage(page > 1 ? page - 1 : 1)} disabled={page === 1}>
            Previous
          </Button>
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
    </div>
  )
}

