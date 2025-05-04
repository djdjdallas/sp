// src/app/api/activity/log/route.js
import { createServerActionClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { startOfToday } from "date-fns";

export async function POST(request) {
  const supabase = createServerActionClient({ cookies });

  // Check if user is authenticated
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const {
      activity_type = "daily_work",
      description = "Daily project work completed",
    } = await request.json();

    // Check if user already logged activity today
    const today = startOfToday();
    const { data: existingLogs, error: checkError } = await supabase
      .from("activity_logs")
      .select("id")
      .eq("user_id", session.user.id)
      .gte("created_at", today.toISOString())
      .limit(1);

    if (checkError) {
      console.error("Error checking existing logs:", checkError);
      throw checkError;
    }

    if (existingLogs && existingLogs.length > 0) {
      return NextResponse.json(
        { message: "Activity already logged for today" },
        { status: 200 }
      );
    }

    // Log the activity
    const { error: logError } = await supabase.from("activity_logs").insert({
      user_id: session.user.id,
      activity_type,
      description,
    });

    if (logError) {
      console.error("Error logging activity:", logError);
      throw logError;
    }

    // Update the streak using RPC function if available
    const { error: updateError } = await supabase.rpc("update_user_streak", {
      p_user_id: session.user.id,
    });

    if (updateError) {
      console.error("Error updating streak via RPC:", updateError);

      // Fallback to manual streak update
      const { data: currentStreak, error: fetchError } = await supabase
        .from("user_streaks")
        .select("*")
        .eq("user_id", session.user.id)
        .maybeSingle();

      if (!fetchError) {
        let newStreak = 1;
        let newLongest = 1;

        if (currentStreak) {
          // Check if the last activity was yesterday
          const lastActivityDate = currentStreak.last_activity_date
            ? new Date(currentStreak.last_activity_date)
            : null;
          const yesterday = new Date(today);
          yesterday.setDate(yesterday.getDate() - 1);

          if (
            lastActivityDate &&
            lastActivityDate.toDateString() === yesterday.toDateString()
          ) {
            // Continue the streak
            newStreak = currentStreak.current_streak + 1;
            newLongest = Math.max(newStreak, currentStreak.longest_streak);
          }
        }

        await supabase.from("user_streaks").upsert({
          user_id: session.user.id,
          current_streak: newStreak,
          longest_streak: newLongest,
          last_activity_date: new Date().toISOString(),
        });
      }
    }

    // Get updated streak data
    const { data: updatedStreak } = await supabase
      .from("user_streaks")
      .select("*")
      .eq("user_id", session.user.id)
      .single();

    return NextResponse.json({
      message: "Activity logged successfully",
      streak: updatedStreak,
    });
  } catch (error) {
    console.error("Failed to log activity:", error);
    return NextResponse.json(
      { error: "Failed to log activity" },
      { status: 500 }
    );
  }
}
