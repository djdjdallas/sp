"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/auth-provider";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import {
  Globe,
  Github,
  DollarSign,
  Users,
  BarChart,
  Edit,
  Trash2,
  Lock,
  LockOpen,
  ShoppingBag,
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function ProjectDetail({ params }) {
  const { user } = useAuth();
  const router = useRouter();
  const supabase = createClient();
  const [project, setProject] = useState(null);
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [resolvedParams, setResolvedParams] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState(null);

  // First, resolve the params
  useEffect(() => {
    const resolveParams = async () => {
      const resolved = await params;
      setResolvedParams(resolved);
    };
    resolveParams();
  }, [params]);

  useEffect(() => {
    const fetchProject = async () => {
      if (!user || !resolvedParams) return;

      try {
        // Fetch project details
        const { data: projectData, error: projectError } = await supabase
          .from("projects")
          .select("*")
          .eq("id", resolvedParams.id)
          .single();

        if (projectError) {
          console.error("Error fetching project:", projectError);
          setError(projectError.message);
          return;
        }

        setProject(projectData);

        // Fetch latest metrics for the project
        const { data: metricsData, error: metricsError } = await supabase
          .from("project_metrics")
          .select("*")
          .eq("project_id", resolvedParams.id)
          .order("metric_date", { ascending: false })
          .limit(1)
          .single();

        if (metricsError) {
          // If no metrics exist yet, that's okay - we'll show zero values
          if (metricsError.code === "PGRST116") {
            console.log("No metrics found for this project");
            setMetrics({ users: 0, traffic: 0, revenue: 0 });
          } else {
            console.error("Error fetching metrics:", metricsError);
          }
        } else {
          setMetrics(metricsData);
        }
      } catch (err) {
        console.error("Failed to fetch project:", err);
        setError("Failed to load project");
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [user, resolvedParams, supabase]);

  const handleDelete = async () => {
    setDeleting(true);
    setDeleteError(null);

    try {
      // Check and delete related records
      const relatedChecks = await Promise.all([
        supabase
          .from("project_metrics")
          .select("id")
          .eq("project_id", project.id)
          .limit(1),
        supabase
          .from("tasks")
          .select("id")
          .eq("project_id", project.id)
          .limit(1),
        supabase
          .from("marketplace_listings")
          .select("id")
          .eq("project_id", project.id)
          .limit(1),
      ]);

      // Delete project metrics if they exist
      if (relatedChecks[0].data && relatedChecks[0].data.length > 0) {
        const { error } = await supabase
          .from("project_metrics")
          .delete()
          .eq("project_id", project.id);

        if (error) throw error;
      }

      // Delete tasks if they exist
      if (relatedChecks[1].data && relatedChecks[1].data.length > 0) {
        const { error } = await supabase
          .from("tasks")
          .delete()
          .eq("project_id", project.id);

        if (error) throw error;
      }

      // Delete marketplace listings if they exist
      if (relatedChecks[2].data && relatedChecks[2].data.length > 0) {
        const { error } = await supabase
          .from("marketplace_listings")
          .delete()
          .eq("project_id", project.id);

        if (error) throw error;
      }

      // Delete the project
      const { error: deleteError } = await supabase
        .from("projects")
        .delete()
        .eq("id", project.id);

      if (deleteError) {
        throw deleteError;
      }

      // If project image exists, optionally delete it from storage
      if (project.image_url) {
        const imagePathMatch = project.image_url.match(/project-images\/(.+)$/);
        if (imagePathMatch && imagePathMatch[1]) {
          const imagePath = imagePathMatch[1];
          const { error: storageError } = await supabase.storage
            .from("project-images")
            .remove([imagePath]);

          if (storageError) {
            console.error("Error deleting image:", storageError);
            // Don't fail the entire delete if image deletion fails
          }
        }
      }

      // Redirect to projects page after successful deletion
      router.push("/dashboard/projects");
    } catch (err) {
      console.error("Failed to delete project:", err);
      setDeleteError(
        err.message || "Failed to delete project. Please try again."
      );
    } finally {
      setDeleting(false);
    }
  };

  const stageColors = {
    idea: "bg-yellow-100 text-yellow-800",
    design: "bg-blue-100 text-blue-800",
    mvp: "bg-purple-100 text-purple-800",
    launched: "bg-green-100 text-green-800",
    archived: "bg-gray-100 text-gray-800",
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent" />
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <h2 className="text-xl font-semibold mb-2">
                {error || "Project not found"}
              </h2>
              <p className="text-muted-foreground mb-4">
                The project you're looking for doesn't exist or you don't have
                permission to view it.
              </p>
              <Button asChild>
                <Link href="/dashboard/projects">Back to Projects</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const isOwner = project.user_id === user?.id;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-start mb-8">
        <div>
          <div className="flex items-center gap-4">
            <h1 className="text-3xl font-bold">{project.name}</h1>
            <Badge className={stageColors[project.stage] || "bg-gray-100"}>
              {project.stage}
            </Badge>
            {project.is_public ? (
              <LockOpen className="h-5 w-5 text-green-500" />
            ) : (
              <Lock className="h-5 w-5 text-yellow-500" />
            )}
          </div>
          <p className="text-muted-foreground mt-2">{project.description}</p>
        </div>

        {isOwner && (
          <div className="flex gap-2">
            <Button variant="outline" size="sm" asChild>
              <Link href={`/dashboard/projects/${resolvedParams.id}/edit`}>
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Link>
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-destructive"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete
                    your project and all associated data including metrics,
                    tasks, and marketplace listings.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel disabled={deleting}>
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDelete}
                    disabled={deleting}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    {deleting ? "Deleting..." : "Yes, delete project"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Project Links */}
        <Card>
          <CardHeader>
            <CardTitle>Project Links</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {project.domain_name && (
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{project.domain_name}</span>
              </div>
            )}
            {project.repo_url && (
              <div className="flex items-center gap-2">
                <Github className="h-4 w-4 text-muted-foreground" />
                <a
                  href={project.repo_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-primary hover:underline"
                >
                  Repository
                </a>
              </div>
            )}
            {project.live_url && (
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4 text-muted-foreground" />
                <a
                  href={project.live_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-primary hover:underline"
                >
                  Live Site
                </a>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Project Metrics */}
        <Card>
          <CardHeader>
            <CardTitle>Metrics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">
                {metrics?.users ? metrics.users.toLocaleString() : 0} Users
              </span>
            </div>
            <div className="flex items-center gap-2">
              <BarChart className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">
                {metrics?.traffic ? metrics.traffic.toLocaleString() : 0} Visits
              </span>
            </div>
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">
                ${metrics?.revenue ? metrics.revenue.toFixed(2) : "0.00"}{" "}
                Revenue
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Project Status */}
        <Card>
          <CardHeader>
            <CardTitle>Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Last Updated</p>
              <p className="text-sm">
                {formatDistanceToNow(new Date(project.updated_at))} ago
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Created</p>
              <p className="text-sm">
                {formatDistanceToNow(new Date(project.created_at))} ago
              </p>
            </div>
            {project.for_sale && (
              <div>
                <p className="text-sm text-muted-foreground">For Sale</p>
                <Badge
                  variant="outline"
                  className="border-green-500 text-green-500"
                >
                  ${project.asking_price || "Contact for price"}
                </Badge>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Project Image */}
      {project.image_url && (
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="relative h-64 md:h-96 w-full rounded-lg overflow-hidden">
              <img
                src={project.image_url}
                alt={project.name}
                className="w-full h-full object-cover"
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Marketplace Section */}
      {isOwner && !project.for_sale && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">List on Marketplace</h3>
                <p className="text-sm text-muted-foreground">
                  Add your project to the marketplace and connect with potential
                  buyers
                </p>
              </div>
              <Button asChild>
                <Link href="/dashboard/marketplace/list">
                  <ShoppingBag className="h-4 w-4 mr-2" />
                  List Project
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
