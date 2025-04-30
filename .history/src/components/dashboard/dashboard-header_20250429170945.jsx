"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/components/auth/auth-provider";
import { Button } from "@/components/ui/button";
import { Plus, Bell, Search } from "lucide-react";

export function DashboardHeader() {
  const [notifications, setNotifications] = useState(0);
  const pathname = usePathname();
  const { user } = useAuth();
  const supabase = createClient();

  // Get page title based on current path
  const getPageTitle = () => {
    const path = pathname.split("/").filter(Boolean);

    if (path.length === 1 && path[0] === "dashboard") {
      return "Dashboard";
    }

    if (path.length > 1) {
      // Get the last part of the path and capitalize it
      const lastPart = path[path.length - 1];

      // Handle special cases
      if (lastPart === "new") {
        return "Create New Project";
      }

      // Check if it's a UUID (Project Detail page)
      if (
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
          lastPart
        )
      ) {
        return "Project Details";
      }

      return lastPart.charAt(0).toUpperCase() + lastPart.slice(1);
    }

    return "Dashboard";
  };

  useEffect(() => {
    // Simulate fetching notification count
    const fetchNotifications = async () => {
      if (!user) return;

      // In a real app, you would fetch actual notifications from your database
      // This is just a placeholder
      setNotifications(3);
    };

    fetchNotifications();
  }, [user]);

  return (
    <div className="border-b bg-background/95 backdrop-blur">
      <div className="container mx-auto flex items-center justify-between h-16 px-4">
        <h1 className="text-xl font-bold">{getPageTitle()}</h1>

        <div className="flex items-center gap-4">
          <div className="relative md:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search..."
              className="w-full rounded-md border border-input bg-background pl-8 pr-4 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>

          <Button variant="outline" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            {notifications > 0 && (
              <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs">
                {notifications}
              </span>
            )}
          </Button>

          <Button asChild size="sm">
            <Link href="/dashboard/projects/new">
              <Plus className="h-4 w-4 mr-2" />
              New Project
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
