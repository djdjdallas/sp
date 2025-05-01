"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/components/auth/auth-provider";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, HelpCircle, Info, Plus, Trash } from "lucide-react";

export default function MarketplaceListingPage() {
  const { user } = useAuth();
  const router = useRouter();
  const supabase = createClient();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    project_id: "",
    title: "",
    description: "",
    asking_price: "",
    monthly_revenue: "",
    monthly_users: "",
    tech_stack: [],
    included_assets: ["Source code", "Documentation"],
    reason_for_selling: "",
    custom_tech: "",
    custom_asset: "",
  });

  // Tech stack options
  const techOptions = [
    "React",
    "Next.js",
    "Vue",
    "Angular",
    "Svelte",
    "Node.js",
    "Express",
    "Django",
    "Laravel",
    "Ruby on Rails",
    "PostgreSQL",
    "MySQL",
    "MongoDB",
    "Firebase",
    "Supabase",
    "Tailwind CSS",
    "Bootstrap",
    "Material UI",
    "Chakra UI",
    "AWS",
    "Google Cloud",
    "Vercel",
    "Netlify",
    "DigitalOcean",
    "TypeScript",
    "JavaScript",
    "Python",
    "PHP",
    "Ruby",
  ];

  useEffect(() => {
    if (!user) {
      router.push("/auth/login?redirect=/dashboard/marketplace/list");
      return;
    }

    const fetchUserProjects = async () => {
      try {
        setLoading(true);

        // Fetch user's projects
        const { data, error } = await supabase
          .from("projects")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });

        if (error) {
          console.error("Error fetching projects:", error);
          setProjects([]);
        } else {
          setProjects(data || []);

          // If projects exist, pre-select the first one
          if (data && data.length > 0) {
            setFormData((prev) => ({
              ...prev,
              project_id: data[0].id,
              title: data[0].name,
              description: data[0].description || "",
            }));
          }
        }
      } catch (err) {
        console.error("Failed to fetch projects:", err);
        setProjects([]);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProjects();
  }, [user, router, supabase]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleProjectChange = (projectId) => {
    const selectedProject = projects.find((p) => p.id === projectId);
    if (selectedProject) {
      setFormData((prev) => ({
        ...prev,
        project_id: selectedProject.id,
        title: selectedProject.name,
        description: selectedProject.description || "",
      }));
    }
  };

  const handleAddTech = () => {
    if (formData.custom_tech.trim()) {
      setFormData((prev) => ({
        ...prev,
        tech_stack: [...prev.tech_stack, prev.custom_tech.trim()],
        custom_tech: "",
      }));
    }
  };

  const handleRemoveTech = (tech) => {
    setFormData((prev) => ({
      ...prev,
      tech_stack: prev.tech_stack.filter((t) => t !== tech),
    }));
  };

  const handleAddAsset = () => {
    if (formData.custom_asset.trim()) {
      setFormData((prev) => ({
        ...prev,
        included_assets: [...prev.included_assets, prev.custom_asset.trim()],
        custom_asset: "",
      }));
    }
  };

  const handleRemoveAsset = (asset) => {
    setFormData((prev) => ({
      ...prev,
      included_assets: prev.included_assets.filter((a) => a !== asset),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      router.push("/auth/login?redirect=/dashboard/marketplace/list");
      return;
    }

    if (!formData.project_id) {
      setError("Please select a project to list");
      return;
    }

    if (!formData.title || !formData.description) {
      setError("Project title and description are required");
      return;
    }

    if (
      !formData.asking_price ||
      isNaN(parseFloat(formData.asking_price)) ||
      parseFloat(formData.asking_price) <= 0
    ) {
      setError("Please enter a valid asking price");
      return;
    }

    setError(null);
    setSubmitting(true);

    try {
      // Prepare the data for submission
      const listingData = {
        project_id: formData.project_id,
        title: formData.title,
        description: formData.description,
        asking_price: parseFloat(formData.asking_price),
        included_assets: formData.included_assets,
        status: "active",
        monthly_revenue: formData.monthly_revenue
          ? parseFloat(formData.monthly_revenue)
          : null,
        monthly_users: formData.monthly_users
          ? parseInt(formData.monthly_users, 10)
          : null,
        tech_stack: formData.tech_stack.length > 0 ? formData.tech_stack : null,
        reason_for_selling: formData.reason_for_selling || null,
      };

      // Insert into marketplace_listings table
      const { data, error } = await supabase
        .from("marketplace_listings")
        .insert(listingData)
        .select();

      if (error) {
        console.error("Error creating listing:", error);
        setError(error.message);
      } else {
        // Also update the for_sale field on the project
        const { error: projectError } = await supabase
          .from("projects")
          .update({
            for_sale: true,
            asking_price: parseFloat(formData.asking_price),
          })
          .eq("id", formData.project_id);

        if (projectError) {
          console.error("Error updating project:", projectError);
        }

        setSuccess(true);

        // Redirect after a short delay
        setTimeout(() => {
          router.push(`/marketplace/${data[0].id}`);
        }, 2000);
      }
    } catch (err) {
      console.error("Failed to create listing:", err);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-16">Loading your projects...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center mb-8">
        <Button variant="ghost" asChild className="pl-0 mr-4">
          <Link href="/marketplace">
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back to Marketplace
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">List Your Project for Sale</h1>
      </div>

      {projects.length === 0 ? (
        <div className="text-center py-12 border rounded-lg bg-muted/20">
          <Info className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Projects Found</h3>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            You need to create a project before you can list it on the
            marketplace.
          </p>
          <Button asChild>
            <Link href="/dashboard/projects/new">Create a Project</Link>
          </Button>
        </div>
      ) : (
        <Card>
          <form onSubmit={handleSubmit}>
            <CardHeader>
              <CardTitle>Project Listing Details</CardTitle>
              <CardDescription>
                Fill out the information below to list your project for sale
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {success && (
                <Alert className="bg-green-50 text-green-700 border-green-200">
                  <AlertDescription>
                    Your project has been listed successfully! Redirecting to
                    the listing page...
                  </AlertDescription>
                </Alert>
              )}

              {/* Project Selection */}
              <div className="space-y-2">
                <label htmlFor="project_id" className="text-sm font-medium">
                  Select Project *
                </label>
                <Select
                  value={formData.project_id}
                  onValueChange={handleProjectChange}
                  disabled={success}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a project to list" />
                  </SelectTrigger>
                  <SelectContent>
                    {projects.map((project) => (
                      <SelectItem key={project.id} value={project.id}>
                        {project.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Listing Title */}
              <div className="space-y-2">
                <label htmlFor="title" className="text-sm font-medium">
                  Listing Title *
                </label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g., SaaS Task Management App"
                  disabled={success}
                  required
                />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <label htmlFor="description" className="text-sm font-medium">
                  Description *
                </label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Describe your project, its features, and what makes it valuable"
                  rows={5}
                  disabled={success}
                  required
                />
              </div>

              {/* Pricing */}
              <div className="space-y-2">
                <label htmlFor="asking_price" className="text-sm font-medium">
                  Asking Price ($) *
                </label>
                <Input
                  id="asking_price"
                  name="asking_price"
                  type="number"
                  min="1"
                  step="0.01"
                  value={formData.asking_price}
                  onChange={handleChange}
                  placeholder="e.g., 499.99"
                  disabled={success}
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Set a realistic price based on your project's value,
                  complexity, and potential.
                </p>
              </div>

              {/* Revenue & Users */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label
                    htmlFor="monthly_revenue"
                    className="text-sm font-medium"
                  >
                    Monthly Revenue ($)
                  </label>
                  <Input
                    id="monthly_revenue"
                    name="monthly_revenue"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.monthly_revenue}
                    onChange={handleChange}
                    placeholder="e.g., 120"
                    disabled={success}
                  />
                  <p className="text-xs text-muted-foreground">
                    If your project is generating revenue, enter the monthly
                    amount
                  </p>
                </div>
                <div className="space-y-2">
                  <label
                    htmlFor="monthly_users"
                    className="text-sm font-medium"
                  >
                    Monthly Active Users
                  </label>
                  <Input
                    id="monthly_users"
                    name="monthly_users"
                    type="number"
                    min="0"
                    value={formData.monthly_users}
                    onChange={handleChange}
                    placeholder="e.g., 500"
                    disabled={success}
                  />
                </div>
              </div>

              {/* Tech Stack */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Technology Stack</label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {formData.tech_stack.map((tech) => (
                    <Badge
                      key={tech}
                      variant="outline"
                      className="flex items-center gap-1"
                    >
                      {tech}
                      <button
                        type="button"
                        onClick={() => handleRemoveTech(tech)}
                        className="ml-1 rounded-full hover:bg-muted p-0.5"
                        disabled={success}
                      >
                        <Trash className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                  {formData.tech_stack.length === 0 && (
                    <span className="text-sm text-muted-foreground">
                      No technologies added yet
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Select
                    value=""
                    onValueChange={(value) => {
                      if (value && !formData.tech_stack.includes(value)) {
                        setFormData((prev) => ({
                          ...prev,
                          tech_stack: [...prev.tech_stack, value],
                        }));
                      }
                    }}
                    disabled={success}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select technology" />
                    </SelectTrigger>
                    <SelectContent>
                      {techOptions
                        .filter((tech) => !formData.tech_stack.includes(tech))
                        .map((tech) => (
                          <SelectItem key={tech} value={tech}>
                            {tech}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                  <span className="text-muted-foreground">or</span>
                  <div className="flex flex-1 items-center gap-2">
                    <Input
                      placeholder="Add custom technology"
                      value={formData.custom_tech}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          custom_tech: e.target.value,
                        }))
                      }
                      disabled={success}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={handleAddTech}
                      disabled={!formData.custom_tech.trim() || success}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Included Assets */}
              <div className="space-y-2">
                <label className="text-sm font-medium">What's Included</label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {formData.included_assets.map((asset) => (
                    <Badge
                      key={asset}
                      variant="outline"
                      className="flex items-center gap-1"
                    >
                      {asset}
                      <button
                        type="button"
                        onClick={() => handleRemoveAsset(asset)}
                        className="ml-1 rounded-full hover:bg-muted p-0.5"
                        disabled={success}
                      >
                        <Trash className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                  {formData.included_assets.length === 0 && (
                    <span className="text-sm text-muted-foreground">
                      No assets added yet
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Input
                    placeholder="Add item (e.g., Source code, Documentation, User base)"
                    value={formData.custom_asset}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        custom_asset: e.target.value,
                      }))
                    }
                    disabled={success}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={handleAddAsset}
                    disabled={!formData.custom_asset.trim() || success}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  List everything that will be included with the sale (code,
                  assets, domain, etc.)
                </p>
              </div>

              {/* Reason for Selling */}
              <div className="space-y-2">
                <label
                  htmlFor="reason_for_selling"
                  className="text-sm font-medium"
                >
                  Reason for Selling
                </label>
                <Textarea
                  id="reason_for_selling"
                  name="reason_for_selling"
                  value={formData.reason_for_selling}
                  onChange={handleChange}
                  placeholder="Explain why you're selling this project"
                  rows={3}
                  disabled={success}
                />
                <p className="text-xs text-muted-foreground">
                  Being transparent about why you're selling can build trust
                  with potential buyers
                </p>
              </div>

              {/* Terms Agreement */}
              <div className="flex items-start space-x-2 pt-4 border-t">
                <div className="pt-0.5">
                  <Switch id="terms" checked={true} disabled={true} />
                </div>
                <div className="space-y-1">
                  <label
                    htmlFor="terms"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Marketplace Terms & Conditions
                  </label>
                  <p className="text-sm text-muted-foreground">
                    By listing your project, you agree to our{" "}
                    <Link
                      href="/terms"
                      className="text-primary hover:underline"
                      target="_blank"
                    >
                      marketplace terms and conditions
                    </Link>
                    . A 5% fee will be applied to successful sales.
                  </p>
                </div>
              </div>
            </CardContent>

            <CardFooter className="flex justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/marketplace")}
                disabled={submitting || success}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={submitting || success}>
                {submitting ? "Creating Listing..." : "List Project for Sale"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      )}

      {/* Tips for Successfully Selling */}
      <div className="mt-12 border rounded-lg p-6 bg-muted/20">
        <h3 className="text-xl font-semibold mb-4 flex items-center">
          <HelpCircle className="mr-2 h-5 w-5 text-primary" />
          Tips for Successfully Selling Your Project
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <h4 className="font-medium">Set a Realistic Price</h4>
            <p className="text-sm text-muted-foreground">
              Research similar projects to understand market rates. Consider the
              technology used, revenue potential, time invested, and user base
              when setting your price.
            </p>
          </div>
          <div className="space-y-2">
            <h4 className="font-medium">Provide Detailed Information</h4>
            <p className="text-sm text-muted-foreground">
              Be transparent and thorough in your description. Include all
              features, technologies used, metrics, and what's included in the
              purchase.
            </p>
          </div>
          <div className="space-y-2">
            <h4 className="font-medium">Highlight the Value</h4>
            <p className="text-sm text-muted-foreground">
              Emphasize what makes your project valuable to potential buyers:
              revenue, user base, technical innovation, or growth potential.
            </p>
          </div>
          <div className="space-y-2">
            <h4 className="font-medium">Be Responsive</h4>
            <p className="text-sm text-muted-foreground">
              Answer questions quickly and provide additional information when
              requested. Good communication builds trust with potential buyers.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
