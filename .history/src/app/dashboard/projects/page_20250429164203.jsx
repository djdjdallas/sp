"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/components/auth/auth-provider";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";

export default function ProjectsPage() {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const fetchProjects = async () => {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from("projects")
          .select("*")
          .order("updated_at", { ascending: false });

        if (error) {
          console.error("Error fetching projects:", error);
        } else {
          setProjects(data || []);
        }
      } catch (err) {
        console.error("Failed to fetch projects:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [user, supabase]);

  const stageColors = {
    idea: "bg-yellow-100 text-yellow-800",
    design: "bg-blue-100 text-blue-800",
    mvp: "bg-purple-100 text-purple-800",
    launched: "bg-green-100 text-green-800",
    archived: "bg-gray-100 text-gray-800",
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Your Projects</h1>
        <Button asChild>
          <Link href="/dashboard/projects/new">New Project</Link>
        </Button>
      </div>

      {loading ? (
        <div className="text-center py-12">Loading projects...</div>
      ) : projects.length === 0 ? (
        <div className="text-center py-12">
          <p className="mb-4">You don't have any projects yet.</p>
          <Button asChild>
            <Link href="/dashboard/projects/new">
              Create Your First Project
            </Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <Link key={project.id} href={`/dashboard/projects/${project.id}`}>
              <Card className="h-full transition-all hover:shadow-md">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{project.name}</CardTitle>
                    <Badge
                      className={stageColors[project.stage] || "bg-gray-100"}
                    >
                      {project.stage}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                    {project.description || "No description"}
                  </p>

                  <div className="flex justify-between text-xs text-muted-foreground mt-4">
                    <div>
                      {project.is_public ? (
                        <Badge variant="outline">Public</Badge>
                      ) : (
                        <Badge variant="outline">Private</Badge>
                      )}
                    </div>
                    <div>
                      Updated{" "}
                      {formatDistanceToNow(new Date(project.updated_at))} ago
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
