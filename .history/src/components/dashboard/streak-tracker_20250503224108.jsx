import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, CheckCircle2, Flame, Trophy, Loader2 } from "lucide-react";
import {
  differenceInCalendarDays,
  format,
  startOfToday,
  parseISO,
  isYesterday,
  isToday,
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
  const [loggingActivity, setLoggingActivity] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    if (userId) {
      fetchStreakData();
    }
  }, [userId]);

  const fetchStreakData = async () => {
    if (!userId) return;

    try {
      // Fetch user's streak data
      const { data: streakInfo, error: streakError } = await supabase
        .from("user_streaks")
        .select("*")
        .eq("user_id", userId)
        .maybeSingle(); // Use maybeSingle instead of single to handle no records

      if (streakError && streakError.code !== "PGRST116") {
        console.error("Error fetching streak data:", streakError);
        return;
      }

      // Check if user has logged activity today
      const today = startOfToday();
      const { data: todayLogs, error: logError } = await supabase
        .from("activity_logs")
        .select("*")
        .eq("user_id", userId)
        .gte("created_at", today.toISOString())
        .limit(1);

      if (logError && logError.code !== "PGRST116") {
        console.error("Error fetching activity logs:", logError);
      }

      // If there's no streak data at all, set defaults
      let currentStreak = streakInfo?.current_streak || 0;
      let longestStreak = streakInfo?.longest_streak || 0;

      // If there's streak data, check if we need to reset the streak
      if (streakInfo && streakInfo.last_activity_date) {
        const lastActivity = new Date(streakInfo.last_activity_date);

        // If last activity was not today or yesterday, reset current streak
        if (!isToday(lastActivity) && !isYesterday(lastActivity)) {
          currentStreak = 0; // Reset streak but keep the longest streak record
        }
      }

      setStreakData({
        currentStreak,
        longestStreak,
        todayCompleted: todayLogs && todayLogs.length > 0,
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
      setStreakData((prev) => ({ ...prev, loading: false }));
    }
  };

  const logTodayActivity = async () => {
    if (!userId || loggingActivity || streakData.todayCompleted) return;

    setLoggingActivity(true);
    try {
      // First, check if there's already an activity log for today
      const today = startOfToday();
      const { data: existingLogs, error: checkError } = await supabase
        .from("activity_logs")
        .select("id")
        .eq("user_id", userId)
        .gte("created_at", today.toISOString())
        .limit(1);

      if (checkError) throw checkError;

      // If already logged today, don't log again
      if (existingLogs && existingLogs.length > 0) {
        await fetchStreakData();
        return;
      }

      // Log activity
      const { error: logError } = await supabase.from("activity_logs").insert({
        user_id: userId,
        activity_type: "daily_work",
        description: "Daily project work completed",
      });

      if (logError) throw logError;

      // Get current streak data
      const { data: currentStreakData, error: fetchError } = await supabase
        .from("user_streaks")
        .select("*")
        .eq("user_id", userId)
        .maybeSingle();

      if (fetchError) throw fetchError;

      let newStreak = 1;
      let newLongest = 1;

      // If there's existing streak data, calculate new streak
      if (currentStreakData) {
        const lastActivityDate = currentStreakData.last_activity_date
          ? new Date(currentStreakData.last_activity_date)
          : null;

        if (lastActivityDate) {
          // If last activity was yesterday, continue the streak
          if (isYesterday(lastActivityDate)) {
            newStreak = currentStreakData.current_streak + 1;
            newLongest = Math.max(newStreak, currentStreakData.longest_streak);
          }
          // If last activity was today, keep the same streak
          else if (isToday(lastActivityDate)) {
            newStreak = currentStreakData.current_streak;
            newLongest = currentStreakData.longest_streak;
          }
          // If last activity was more than 1 day ago, reset streak to 1
          else {
            newStreak = 1;
            newLongest = Math.max(1, currentStreakData.longest_streak);
          }
        }
      }

      // Update streak data
      const { error: streakError } = await supabase
        .from("user_streaks")
        .upsert({
          user_id: userId,
          current_streak: newStreak,
          longest_streak: newLongest,
          last_activity_date: new Date().toISOString(),
        });

      if (streakError) throw streakError;

      await fetchStreakData();
    } catch (error) {
      console.error("Error logging activity:", error);
      // You might want to show an error message to the user here
    } finally {
      setLoggingActivity(false);
    }
  };

  if (streakData.loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center p-6">
          <Loader2 className="h-6 w-6 animate-spin mr-2" />
          Loading streak data...
        </CardContent>
      </Card>
    );
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
            <Button
              onClick={logTodayActivity}
              size="sm"
              disabled={loggingActivity}
            >
              {loggingActivity ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Logging...
                </>
              ) : (
                "Log Work"
              )}
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
