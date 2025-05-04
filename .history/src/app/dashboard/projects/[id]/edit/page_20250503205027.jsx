// src/app/dashboard/projects/[id]/edit/page.jsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/components/auth/auth-provider";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ImageUpload } from "@/components/ui/image-upload";
import { ChevronLeft } from "lucide-react";

export default function EditProject({ params }) {
  const { user } = useAuth();
  const router = useRouter();
  const supabase = createClient();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [resolvedParams, setResolvedParams] = useState(null);

  // Form data state
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    stage: "",
    is_public: false,
    domain_name: "",
    repo_url: "",
    live_url: "",
    image_url: null,
  });

  // Resolve params
  useEffect(() => {
    const resolveParams = async () => {
      const resolved = await params;
      setResolvedParams(resolved);
    };
    resolveParams();
  }, [params]);

  // Fetch project data
  useEffect(() => {
    const fetchProject = async () => {
      if (!user || !resolvedParams) return;

      try {
        const { data, error } = await supabase
          .from("projects")
          .select("*")
          .eq("id", resolvedParams.id)
          .single();

        if (error) {
          console.error("Error fetching project:", error);
          setError(error.message);
          return;
        }

        if (data.user_id !== user.id) {
          setError("You don't have permission to edit this project");
          return;
        }

        setProject(data);
        setFormData({
          name: data.name || "",
          description: data.description || "",
          stage: data.stage || "",
          is_public: data.is_public || false,
          domain_name: data.domain_name || "",
          repo_url: data.repo_url || "",
          live_url: data.live_url || "",
          image_url: data.image_url || null,
        });
      } catch (err) {
        console.error("Failed to fetch project:", err);
        setError("Failed to load project");
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [user, resolvedParams, supabase]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSelectChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSwitchChange = (name, checked) => {
    setFormData({
      ...formData,
      [name]: checked,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    if (!formData.name.trim()) {
      setError("Project name is required");
      setSubmitting(false);
      return;
    }

    try {
      const { error } = await supabase
        .from("projects")
        .update({
          name: formData.name,
          description: formData.description,
          stage: formData.stage,
          is_public: formData.is_public,
          domain_name: formData.domain_name,
          repo_url: formData.repo_url,
          live_url: formData.live_url,
          image_url: formData.image_url,
          updated_at: new Date().toISOString(),
        })
        .eq("id", resolvedParams.id);

      if (error) {
        console.error("Error updating project:", error);
        setError(error.message || "Failed to update project");
      } else {
        router.push(`/dashboard/projects/${resolvedParams.id}`);
      }
    } catch (err) {
      console.error("Failed to update project:", err);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setSubmitting(false);
    }
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

  if (error && !project) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <h2 className="text-xl font-semibold mb-2">{error}</h2>
              <Button asChild>
                <Link href="/dashboard/projects">Back to Projects</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center mb-8">
        <Button variant="ghost" asChild className="pl-0 mr-4">
          <Link href={`/dashboard/projects/${resolvedParams.id}`}>
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back to Project
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">Edit Project</h1>
      </div>

      <Card>
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>Edit Project Details</CardTitle>
            <CardDescription>
              Update your project information below
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">
                Project Name *
              </label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="My Awesome Project"
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="description" className="text-sm font-medium">
                Description
              </label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="A brief description of your project"
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="stage" className="text-sm font-medium">
                Project Stage *
              </label>
              <Select
                value={formData.stage}
                onValueChange={(value) => handleSelectChange("stage", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select stage" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="idea">Idea</SelectItem>
                  <SelectItem value="design">Design</SelectItem>
                  <SelectItem value="mvp">MVP</SelectItem>
                  <SelectItem value="launched">Launched</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="domain_name" className="text-sm font-medium">
                  Domain Name
                </label>
                <Input
                  id="domain_name"
                  name="domain_name"
                  value={formData.domain_name}
                  onChange={handleChange}
                  placeholder="example.com"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="repo_url" className="text-sm font-medium">
                  Repository URL
                </label>
                <Input
                  id="repo_url"
                  name="repo_url"
                  value={formData.repo_url}
                  onChange={handleChange}
                  placeholder="https://github.com/username/repo"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="live_url" className="text-sm font-medium">
                Live URL
              </label>
              <Input
                id="live_url"
                name="live_url"
                value={formData.live_url}
                onChange={handleChange}
                placeholder="https://myproject.com"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="is_public"
                checked={formData.is_public}
                onCheckedChange={(checked) =>
                  handleSwitchChange("is_public", checked)
                }
              />
              <label htmlFor="is_public" className="text-sm font-medium">
                Make this project public
              </label>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Project Image</label>
              <ImageUpload
                onUploadComplete={(url) => {
                  setFormData({
                    ...formData,
                    image_url: url,
                  });
                }}
                storageBucket="project-images"
                initialImage={formData.image_url}
              />
              <p className="text-xs text-muted-foreground">
                Upload a screenshot or logo for your project (optional)
              </p>
            </div>
          </CardContent>
          <CardFooter>
            <div className="flex gap-4 justify-end w-full">
              <Button
                type="button"
                variant="outline"
                onClick={() =>
                  router.push(`/dashboard/projects/${resolvedParams.id}`)
                }
                disabled={submitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={submitting}>
                {submitting ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
