// src/components/analytics/analytics-dashboard.jsx
"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  Activity,
  Users,
  DollarSign,
  TrendingUp,
  ShoppingCart,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";

export function AnalyticsDashboard({ projectId, metrics, trafficSources }) {
  const [timeRange, setTimeRange] = useState("7d");
  const [activeTab, setActiveTab] = useState("overview");

  // Process data for charts
  const processedData = processMetricsData(metrics, timeRange);
  const trafficData = processTrafficData(trafficSources);

  return (
    <div className="space-y-6">
      {/* Time Range Selector */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Analytics Dashboard</h2>
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className="px-4 py-2 border rounded-md"
        >
          <option value="7d">Last 7 days</option>
          <option value="30d">Last 30 days</option>
          <option value="90d">Last 90 days</option>
        </select>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total Visitors"
          value={processedData.totalVisitors}
          change={processedData.visitorChange}
          icon={<Users className="h-4 w-4" />}
        />
        <MetricCard
          title="Page Views"
          value={processedData.totalPageViews}
          change={processedData.pageViewChange}
          icon={<Activity className="h-4 w-4" />}
        />
        <MetricCard
          title="Revenue"
          value={`$${processedData.totalRevenue}`}
          change={processedData.revenueChange}
          icon={<DollarSign className="h-4 w-4" />}
        />
        <MetricCard
          title="Conversion Rate"
          value={`${processedData.conversionRate}%`}
          change={processedData.conversionChange}
          icon={<TrendingUp className="h-4 w-4" />}
        />
      </div>

      {/* Analytics Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="traffic">Traffic</TabsTrigger>
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
          <TabsTrigger value="engagement">Engagement</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Visitors & Page Views Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Visitors & Page Views</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={processedData.timelineData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="visitors"
                      stroke="#8884d8"
                      name="Visitors"
                    />
                    <Line
                      type="monotone"
                      dataKey="pageViews"
                      stroke="#82ca9d"
                      name="Page Views"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Traffic Sources Pie Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Traffic Sources</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={trafficData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      label
                    >
                      {trafficData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="traffic">
          {/* Detailed Traffic Analysis */}
          <TrafficAnalysis trafficSources={trafficSources} />
        </TabsContent>

        <TabsContent value="revenue">
          {/* Revenue Analytics */}
          <RevenueAnalytics metrics={metrics} />
        </TabsContent>

        <TabsContent value="engagement">
          {/* User Engagement Metrics */}
          <EngagementMetrics metrics={metrics} />
        </TabsContent>
      </Tabs>

      {/* Call-to-Action */}
      <Card className="bg-gradient-to-r from-primary/10 to-primary/5">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Want deeper insights?</h3>
              <p className="text-sm text-muted-foreground">
                Upgrade to Pro for advanced analytics and custom reports
              </p>
            </div>
            <Button asChild>
              <Link href="/dashboard/settings/billing">Upgrade to Pro</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Helper component for metric cards
function MetricCard({ title, value, change, icon }) {
  const isPositive = change >= 0;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <div className="flex items-center text-sm">
          {isPositive ? (
            <ArrowUpRight className="h-4 w-4 text-green-500" />
          ) : (
            <ArrowDownRight className="h-4 w-4 text-red-500" />
          )}
          <span className={isPositive ? "text-green-500" : "text-red-500"}>
            {Math.abs(change)}%
          </span>
          <span className="text-muted-foreground ml-1">vs last period</span>
        </div>
      </CardContent>
    </Card>
  );
}

// Data processing functions
function processMetricsData(metrics, timeRange) {
  // Process your metrics data for charts and summary
  // Implementation based on your specific data structure
}

function processTrafficData(trafficSources) {
  // Process traffic sources for pie chart
  // Implementation based on your specific data structure
}

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];
