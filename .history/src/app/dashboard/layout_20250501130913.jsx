"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FolderKanban,
  ShoppingBag,
  Settings,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
} from "lucide-react";
import { useAuth } from "@/components/auth/auth-provider";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { createClient } from "@/lib/supabase/client";

export default function DashboardLayout({ children }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profile, setProfile] = useState(null);
  const pathname = usePathname();
  const { user, signOut } = useAuth();
  const supabase = createClient();

  // Fetch user profile
  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;

      try {
        // First check if users table exists by attempting to fetch the profile
        const { data, error } = await supabase
          .from("users")
          .select("*")
          .eq("id", user.id)
          .limit(1); // Add limit to handle multiple rows

        if (error) {
          console.error("Error fetching profile:", error.message || error);

          // If the table doesn't exist or we get a specific error, create a default profile
          if (
            error.code === "PGRST116" ||
            error.message?.includes("relation") ||
            error.message?.includes("does not exist")
          ) {
            console.log(
              "Users table may not exist. Using user metadata for profile..."
            );
            setProfile({
              id: user.id,
              email: user.email,
              full_name: user.user_metadata?.full_name || null,
              avatar_url: user.user_metadata?.avatar_url || null,
            });
          }
        } else {
          // Use the first row if multiple are returned
          if (data && data.length > 0) {
            setProfile(data[0]);
          } else {
            // No profile exists, create one using user metadata
            setProfile({
              id: user.id,
              email: user.email,
              full_name: user.user_metadata?.full_name || null,
              avatar_url: user.user_metadata?.avatar_url || null,
            });
          }
        }
      } catch (err) {
        console.error("Failed to fetch profile:", err);
        // Fallback to user metadata
        setProfile({
          id: user.id,
          email: user.email,
          full_name: user.user_metadata?.full_name || null,
          avatar_url: user.user_metadata?.avatar_url || null,
        });
      }
    };

    fetchProfile();
  }, [user, supabase]);

  // Get user's initials for avatar fallback
  const getInitials = () => {
    if (!user) return "?";

    const fullName = profile?.full_name || user.user_metadata?.full_name;
    if (fullName) {
      return fullName
        .split(" ")
        .map((name) => name[0])
        .join("")
        .toUpperCase()
        .substring(0, 2);
    }

    return user.email.charAt(0).toUpperCase();
  };

  // Navigation items
  const navItems = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: <LayoutDashboard className="h-5 w-5" />,
      exact: true,
    },
    {
      name: "Projects",
      href: "/dashboard/projects",
      icon: <FolderKanban className="h-5 w-5" />,
      exact: false,
    },
    {
      name: "Metrics",
      href: "/dashboard/metrics",
      icon: <BarChart className="h-5 w-5" />,
      exact: false,
    },
    {
      name: "Marketplace",
      href: "/dashboard/marketplace",
      icon: <ShoppingBag className="h-5 w-5" />,
      exact: false,
    },
    {
      name: "Settings",
      href: "/dashboard/settings",
      icon: <Settings className="h-5 w-5" />,
      exact: false,
    },
  ];

  // Check if a nav item is active
  const isActive = (item) => {
    if (item.exact) {
      return pathname === item.href;
    }
    return pathname.startsWith(item.href);
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Mobile Menu Toggle */}
      <div className="md:hidden flex justify-between items-center p-4 border-b">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </Button>
        <Link href="/" className="font-bold text-lg">
          SideBuilds
        </Link>
        <div className="w-9"></div> {/* Spacer for centering */}
      </div>

      {/* Sidebar - Desktop */}
      <aside
        className={`hidden md:flex flex-col border-r bg-background h-screen sticky top-0 
          ${collapsed ? "w-16" : "w-64"} transition-all duration-300`}
      >
        <div className="flex justify-between items-center p-4 border-b">
          {!collapsed && (
            <Link href="/" className="font-bold text-lg">
              SideBuilds
            </Link>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCollapsed(!collapsed)}
            className={collapsed ? "mx-auto" : "ml-auto"}
          >
            {collapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </Button>
        </div>

        <nav className="flex-1 px-2 py-4 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center px-3 py-2 rounded-md transition-colors
                ${
                  isActive(item)
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                }`}
            >
              <span className="mr-3">{item.icon}</span>
              {!collapsed && <span>{item.name}</span>}
            </Link>
          ))}
        </nav>

        <div className={`p-4 border-t ${collapsed ? "text-center" : ""}`}>
          {profile && !collapsed && (
            <div className="flex items-center mb-3">
              <Avatar className="h-8 w-8 mr-2">
                <AvatarImage
                  src={profile.avatar_url}
                  alt={profile.full_name || "User"}
                />
                <AvatarFallback>{getInitials()}</AvatarFallback>
              </Avatar>
              <div className="overflow-hidden">
                <p className="text-sm font-medium truncate">
                  {profile.full_name || "User"}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {user?.email}
                </p>
              </div>
            </div>
          )}
          {collapsed && profile && (
            <Avatar className="h-8 w-8 mx-auto mb-3">
              <AvatarImage
                src={profile.avatar_url}
                alt={profile.full_name || "User"}
              />
              <AvatarFallback>{getInitials()}</AvatarFallback>
            </Avatar>
          )}
          <Button
            variant="outline"
            size={collapsed ? "icon" : "sm"}
            onClick={signOut}
            className={collapsed ? "w-8 h-8 mx-auto" : "w-full"}
          >
            {collapsed ? "X" : "Sign Out"}
          </Button>
        </div>
      </aside>

      {/* Sidebar - Mobile */}
      <aside
        className={`fixed inset-0 z-50 md:hidden bg-background transform
          ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
          transition-transform duration-300 ease-in-out`}
      >
        <div className="flex justify-between items-center p-4 border-b">
          <Link href="/" className="font-bold text-lg">
            SideBuilds
          </Link>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileOpen(false)}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center px-4 py-3 rounded-md transition-colors
                ${
                  isActive(item)
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                }`}
            >
              <span className="mr-3">{item.icon}</span>
              <span>{item.name}</span>
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t">
          {profile && (
            <div className="flex items-center mb-4">
              <Avatar className="h-10 w-10 mr-3">
                <AvatarImage
                  src={profile.avatar_url}
                  alt={profile.full_name || "User"}
                />
                <AvatarFallback>{getInitials()}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{profile.full_name || "User"}</p>
                <p className="text-sm text-muted-foreground">{user?.email}</p>
              </div>
            </div>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={signOut}
            className="w-full"
          >
            Sign Out
          </Button>
        </div>
      </aside>

      {/* Page Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        <main className="flex-1">{children}</main>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}
    </div>
  );
}
