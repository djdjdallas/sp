import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Flame, Award } from "lucide-react";

export function StreakAnalytics({ totalUsers, activeStreaks, topStreaker }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Community Streaks</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-primary/10 rounded-lg">
              <Flame className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Active Streaks</p>
              <p className="text-2xl font-bold">{activeStreaks}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-3 bg-primary/10 rounded-lg">
              <TrendingUp className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Streak Rate</p>
              <p className="text-2xl font-bold">
                {((activeStreaks / totalUsers) * 100).toFixed(1)}%
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-3 bg-primary/10 rounded-lg">
              <Award className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Top Streak</p>
              <p className="text-2xl font-bold">
                {topStreaker?.streak || 0} days
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
