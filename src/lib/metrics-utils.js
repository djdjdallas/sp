// src/lib/metrics-utils.js
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export const calculateGrowth = (current, previous) => {
  if (!previous) return 0;
  return ((current - previous) / previous) * 100;
};

export const aggregateMetricsByPeriod = (metrics, period = "daily") => {
  // Implementation for aggregating metrics by day, week, or month
  // Would depend on specific needs and data structure
  return metrics;
};

export const getTopProjects = (projects, metrics, limit = 5) => {
  const projectRevenues = projects.map((project) => {
    const projectMetrics = metrics.filter((m) => m.project_id === project.id);
    const revenue = projectMetrics.reduce(
      (sum, m) => sum + (m.revenue || 0),
      0
    );
    return { ...project, totalRevenue: revenue };
  });

  return projectRevenues
    .sort((a, b) => b.totalRevenue - a.totalRevenue)
    .slice(0, limit);
};
