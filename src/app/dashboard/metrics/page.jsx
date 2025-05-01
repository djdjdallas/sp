// src/app/dashboard/metrics/page.jsx
"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/components/auth/auth-provider";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import {
  DollarSign,
  Users,
  Rocket,
  Package,
  TrendingUp,
  Calendar,
} from "lucide-react";
import { formatDistanceToNow, subDays, format } from "date-fns";

export default function MetricsPage() {
  const { user } = useAuth();
  const [metrics, setMetrics] = useState(null);
  const [projects, setProjects] = useState([]);
  const [timeRange, setTimeRange] = useState("30d");
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const fetchMetricsData = async () => {
      if (!user) return;

      setLoading(true);
      try {
        // Fetch all user projects
        const { data: projectsData, error: projectsError } = await supabase
          .from("projects")
          .select("*")
          .eq("user_id", user.id);

        if (projectsError) throw projectsError;

        setProjects(projectsData || []);

        // Fetch metrics for all projects
        const projectIds = projectsData?.map((p) => p.id) || [];

        if (projectIds.length > 0) {
          const { data: metricsData, error: metricsError } = await supabase
            .from("project_metrics")
            .select("*")
            .in("project_id", projectIds)
            .gte(
              "metric_date",
              subDays(
                new Date(),
                timeRange === "7d" ? 7 : timeRange === "30d" ? 30 : 90
              )
                .toISOString()
                .split("T")[0]
            )
            .order("metric_date", { ascending: true });

          if (metricsError) throw metricsError;

          // Calculate aggregated metrics
          const aggregated = calculateAggregatedMetrics(
            projectsData,
            metricsData || []
          );
          setMetrics(aggregated);
        } else {
          // No projects yet
          setMetrics({
            totalProjects: 0,
            activeProjects: 0,
            totalRevenue: 0,
            totalUsers: 0,
            topProject: null,
            revenueChart: [],
            userChart: [],
            projectStageDistribution: [],
            latestActivity: [],
          });
        }
      } catch (error) {
        console.error("Error fetching metrics:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMetricsData();
  }, [user, timeRange, supabase]);

  const calculateAggregatedMetrics = (projects, metrics) => {
    // Basic project counts
    const totalProjects = projects.length;
    const activeProjects = projects.filter((p) => p.status === "active").length;

    // Stage distribution for pie chart
    const stageDistribution = projects.reduce((acc, project) => {
      acc[project.stage] = (acc[project.stage] || 0) + 1;
      return acc;
    }, {});

    const projectStageDistribution = Object.entries(stageDistribution).map(
      ([name, value]) => ({ name, value })
    );

    // Revenue and user metrics
    let totalRevenue = 0;
    let totalUsers = 0;
    const dailyMetrics = metrics.reduce((acc, metric) => {
      const date = metric.metric_date;
      if (!acc[date]) {
        acc[date] = { revenue: 0, users: 0, traffic: 0 };
      }
      acc[date].revenue += metric.revenue || 0;
      acc[date].users += metric.users || 0;
      acc[date].traffic += metric.traffic || 0;

      totalRevenue += metric.revenue || 0;
      totalUsers += metric.users || 0;

      return acc;
    }, {});

    // Prepare chart data
    const revenueChart = Object.entries(dailyMetrics).map(([date, data]) => ({
      date: format(new Date(date), "MMM dd"),
      revenue: data.revenue,
    }));

    const userChart = Object.entries(dailyMetrics).map(([date, data]) => ({
      date: format(new Date(date), "MMM dd"),
      users: data.users,
    }));

    // Find top project by revenue
    const projectRevenues = projects.map((project) => {
      const projectMetrics = metrics.filter((m) => m.project_id === project.id);
      const revenue = projectMetrics.reduce(
        (sum, m) => sum + (m.revenue || 0),
        0
      );
      return { ...project, totalRevenue: revenue };
    });

    const topProject = projectRevenues.reduce(
      (top, project) =>
        project.totalRevenue > (top?.totalRevenue || 0) ? project : top,
      null
    );

    // Latest activity
    const latestActivity = metrics
      .sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0))
      .slice(0, 5)
      .map((metric) => {
        const project = projects.find((p) => p.id === metric.project_id);
        return {
          date: metric.metric_date,
          projectName: project?.name || "Unknown Project",
          revenue: metric.revenue,
          users: metric.users,
          traffic: metric.traffic,
        };
      });

    return {
      totalProjects,
      activeProjects,
      totalRevenue,
      totalUsers,
      topProject,
      revenueChart,
      userChart,
      projectStageDistribution,
      latestActivity,
    };
  };

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent" />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Project Metrics</h1>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select time range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7d">Last 7 days</SelectItem>
            <SelectItem value="30d">Last 30 days</SelectItem>
            <SelectItem value="90d">Last 90 days</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Total Projects
            </CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {metrics?.totalProjects || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              {metrics?.activeProjects} active
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${metrics?.totalRevenue?.toLocaleString() || 0}
            </div>
            <p className="text-xs text-muted-foreground">Across all projects</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {metrics?.totalUsers?.toLocaleString() || 0}
            </div>
            <p className="text-xs text-muted-foreground">Across all projects</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Top Project</CardTitle>
            <Rocket className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {metrics?.topProject?.name || "N/A"}
            </div>
            <p className="text-xs text-muted-foreground">
              ${metrics?.topProject?.totalRevenue || 0} revenue
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Revenue Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Revenue Over Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={metrics?.revenueChart || []}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    stroke="#8884d8"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Users Chart */}
        <Card>
          <CardHeader>
            <CardTitle>User Growth</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={metrics?.userChart || []}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="users" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Additional Charts and Data */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Project Stage Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Project Stage Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={metrics?.projectStageDistribution || []}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) =>
                      `${name} (${(percent * 100).toFixed(0)}%)`
                    }
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {metrics?.projectStageDistribution?.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Latest Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Latest Metrics Updates</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {metrics?.latestActivity?.map((activity, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between border-b pb-2 last:border-0"
                >
                  <div>
                    <p className="font-medium">{activity.projectName}</p>
                    <p className="text-sm text-muted-foreground">
                      {format(new Date(activity.date), "MMM dd, yyyy")}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm">${activity.revenue || 0} revenue</p>
                    <p className="text-sm text-muted-foreground">
                      {activity.users || 0} users
                    </p>
                  </div>
                </div>
              ))}
              {(!metrics?.latestActivity ||
                metrics.latestActivity.length === 0) && (
                <p className="text-center text-muted-foreground py-4">
                  No metrics updates yet
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Project-specific metrics link */}
      <div className="mt-8">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">
                  Individual Project Metrics
                </h3>
                <p className="text-sm text-muted-foreground">
                  View detailed metrics for specific projects
                </p>
              </div>
              <Button asChild variant="outline">
                <a href="/dashboard/projects">View Projects</a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
