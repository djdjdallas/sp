"use client";

import { useState } from "react";
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

export default function NewProject() {
  const { user } = useAuth();
  const router = useRouter();
  const supabase = createClient();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    stage: "idea",
    is_public: false,
    domain_name: "",
    repo_url: "",
    live_url: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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
    setLoading(true);
    setError(null);

    if (!formData.name.trim()) {
      setError("Project name is required");
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from("projects")
        .insert({
          user_id: user.id,
          name: formData.name,
          description: formData.description,
          stage: formData.stage,
          status: "active",
          is_public: formData.is_public,
          domain_name: formData.domain_name,
          repo_url: formData.repo_url,
          live_url: formData.live_url,
        })
        .select();

      if (error) {
        console.error("Error creating project:", error);
        setError(error.message);
      } else {
        router.push(`/dashboard/projects/${data[0].id}`);
      }
    } catch (err) {
      console.error("Failed to create project:", err);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Create New Project</h1>
        <Button variant="outline" asChild>
          <Link href="/dashboard">Back to Dashboard</Link>
        </Button>
      </div>

      <Card>
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>Project Details</CardTitle>
            <CardDescription>
              Fill in the details below to create your new project
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
          </CardContent>
          <CardFooter>
            <div className="flex gap-4 justify-end w-full">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/dashboard")}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? "Creating..." : "Create Project"}
              </Button>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
