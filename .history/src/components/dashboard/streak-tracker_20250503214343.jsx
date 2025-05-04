import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, CheckCircle2, Flame, Trophy } from "lucide-react";
import {
  differenceInCalendarDays,
  format,
  startOfToday,
  parseISO,
} from "date-fns";
import { createClient } from "@/lib/supabase/client";

export function StreakTracker({ userId }) {
  const [streakData, setStreakData] = useState({
    currentStreak: 0,
    longestStreak: 0,
    todayCompleted: false,
    loading: true,
  });
  const [milestones, setMilestones] = useState([]);
  const supabase = createClient();

  useEffect(() => {
    fetchStreakData();
  }, [userId]);

  const fetchStreakData = async () => {
    try {
      // Fetch user's streak data
      const { data: streakInfo, error: streakError } = await supabase
        .from("user_streaks")
        .select("*")
        .eq("user_id", userId)
        .single();

      if (streakError && streakError.code !== "PGRST116") {
        console.error("Error fetching streak data:", streakError);
        return;
      }

      // Check if user has logged activity today
      const today = startOfToday();
      const { data: todayLog, error: logError } = await supabase
        .from("activity_logs")
        .select("*")
        .eq("user_id", userId)
        .gte("created_at", today.toISOString())
        .limit(1)
        .single();

      setStreakData({
        currentStreak: streakInfo?.current_streak || 0,
        longestStreak: streakInfo?.longest_streak || 0,
        todayCompleted: !!todayLog,
        loading: false,
      });

      // Calculate milestones
      const streakMilestones = [
        { days: 7, title: "Week Warrior", icon: "🔥", color: "bg-orange-500" },
        { days: 30, title: "Monthly Master", icon: "🚀", color: "bg-blue-500" },
        {
          days: 100,
          title: "Century Champ",
          icon: "💯",
          color: "bg-purple-500",
        },
        {
          days: 365,
          title: "Yearly Legend",
          icon: "🏆",
          color: "bg-yellow-500",
        },
      ];

      const achieved = streakMilestones.filter(
        (milestone) => (streakInfo?.current_streak || 0) >= milestone.days
      );
      setMilestones(achieved);
    } catch (error) {
      console.error("Error in fetchStreakData:", error);
    }
  };

  const logTodayActivity = async () => {
    try {
      // Log activity
      const { error: logError } = await supabase.from("activity_logs").insert({
        user_id: userId,
        activity_type: "daily_work",
        description: "Daily project work completed",
      });

      if (logError) throw logError;

      // Update streak (this would be better handled with a database function)
      const newStreak = streakData.currentStreak + 1;
      const { error: streakError } = await supabase
        .from("user_streaks")
        .upsert({
          user_id: userId,
          current_streak: newStreak,
          longest_streak: Math.max(newStreak, streakData.longestStreak),
          last_activity_date: new Date().toISOString(),
        });

      if (streakError) throw streakError;

      await fetchStreakData();
    } catch (error) {
      console.error("Error logging activity:", error);
    }
  };

  if (streakData.loading) {
    return <div>Loading streak data...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Build Streak</span>
          <Flame
            className={`h-6 w-6 ${
              streakData.currentStreak > 0
                ? "text-orange-500 animate-pulse"
                : "text-gray-300"
            }`}
          />
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Streak Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-4 rounded-lg bg-muted">
            <div className="text-3xl font-bold text-primary">
              {streakData.currentStreak}
            </div>
            <div className="text-sm text-muted-foreground">Current Streak</div>
          </div>
          <div className="text-center p-4 rounded-lg bg-muted">
            <div className="text-3xl font-bold text-primary">
              {streakData.longestStreak}
            </div>
            <div className="text-sm text-muted-foreground">Longest Streak</div>
          </div>
        </div>

        {/* Today's Status */}
        <div className="flex items-center justify-between p-4 border rounded-lg">
          <div className="flex items-center gap-3">
            <Calendar className="h-5 w-5 text-muted-foreground" />
            <div>
              <div className="font-medium">Today's Progress</div>
              <div className="text-sm text-muted-foreground">
                {format(new Date(), "MMMM d, yyyy")}
              </div>
            </div>
          </div>

          {streakData.todayCompleted ? (
            <Badge className="flex items-center gap-1 bg-green-500">
              <CheckCircle2 className="h-4 w-4" />
              Completed
            </Badge>
          ) : (
            <Button onClick={logTodayActivity} size="sm">
              Log Work
            </Button>
          )}
        </div>

        {/* Milestones */}
        {milestones.length > 0 && (
          <div>
            <h4 className="font-medium mb-3">Achievements Unlocked</h4>
            <div className="grid grid-cols-2 gap-3">
              {milestones.map((milestone) => (
                <div
                  key={milestone.days}
                  className={`p-3 rounded-lg text-white ${milestone.color}`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">{milestone.title}</div>
                      <div className="text-sm opacity-90">
                        {milestone.days} days
                      </div>
                    </div>
                    <div className="text-2xl">{milestone.icon}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
