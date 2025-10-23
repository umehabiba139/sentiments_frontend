import { Card, CardContent } from "@/components/ui/card"
import { TrendingDown, TrendingUp, Minus } from "lucide-react"
import { Progress } from "@/components/ui/progress"

interface TrendPredictionCardProps {
  coin: string
  prediction: "Bullish" | "Bearish" | "Neutral"
  confidence: number
  trend: "up" | "down" | "neutral"
}

export function TrendPredictionCard({ coin, prediction, confidence, trend }: TrendPredictionCardProps) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium">{coin}</p>
            <div className="flex items-center gap-1">
              <p
                className={`text-lg font-bold ${
                  trend === "up" ? "text-green-500" : trend === "down" ? "text-red-500" : "text-yellow-500"
                }`}
              >
                {prediction}
              </p>
              {trend === "up" ? (
                <TrendingUp className="h-4 w-4 text-green-500" />
              ) : trend === "down" ? (
                <TrendingDown className="h-4 w-4 text-red-500" />
              ) : (
                <Minus className="h-4 w-4 text-yellow-500" />
              )}
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm font-medium">Confidence</p>
            <p className="text-lg font-bold">{confidence}%</p>
          </div>
        </div>
        <Progress
          value={confidence}
          className={`mt-2 ${trend === "up" ? "bg-green-100" : trend === "down" ? "bg-red-100" : "bg-yellow-100"}`}
          indicatorClassName={trend === "up" ? "bg-green-500" : trend === "down" ? "bg-red-500" : "bg-yellow-500"}
        />
      </CardContent>
    </Card>
  )
}

