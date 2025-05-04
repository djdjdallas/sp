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
import { ChevronLeft, Plus, Trash, Store, AlertTriangle } from "lucide-react";
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

export default function EditMarketplaceListingPage({ params }) {
  const { user } = useAuth();
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [unlisting, setUnlisting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [resolvedParams, setResolvedParams] = useState(null);
  const [listing, setListing] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    asking_price: "",
    included_assets: [],
    custom_asset: "",
  });

  // Resolve params
  useEffect(() => {
    const resolveParams = async () => {
      const resolved = await params;
      setResolvedParams(resolved);
    };
    resolveParams();
  }, [params]);

  // Fetch listing data
  useEffect(() => {
    const fetchListing = async () => {
      if (!user || !resolvedParams?.id) return;

      try {
        setLoading(true);

        // Fetch the listing with related project data
        const { data, error } = await supabase
          .from("marketplace_listings")
          .select(
            `
            *,
            projects!inner (
              id,
              name,
              description,
              user_id
            )
          `
          )
          .eq("id", resolvedParams.id)
          .single();

        if (error) {
          console.error("Error fetching listing:", error);
          setError("Listing not found");
          return;
        }

        // Check if the user owns this listing
        if (data.projects.user_id !== user.id) {
          setError("You don't have permission to edit this listing");
          return;
        }

        setListing(data);
        setFormData({
          title: data.title || "",
          description: data.description || "",
          asking_price: data.asking_price?.toString() || "",
          included_assets: data.included_assets || [],
          custom_asset: "",
        });
      } catch (err) {
        console.error("Failed to fetch listing:", err);
        setError("Failed to load listing");
      } finally {
        setLoading(false);
      }
    };

    fetchListing();
  }, [user, resolvedParams, supabase]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
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

    if (!user || !listing) {
      return;
    }

    if (!formData.title || !formData.description) {
      setError("Title and description are required");
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
      // Update the listing
      const { error } = await supabase
        .from("marketplace_listings")
        .update({
          title: formData.title,
          description: formData.description,
          asking_price: parseFloat(formData.asking_price),
          included_assets: formData.included_assets,
          updated_at: new Date().toISOString(),
        })
        .eq("id", listing.id);

      if (error) {
        throw error;
      }

      // Also update the asking price on the project
      const { error: projectError } = await supabase
        .from("projects")
        .update({
          asking_price: parseFloat(formData.asking_price),
        })
        .eq("id", listing.project_id);

      if (projectError) {
        console.error("Error updating project:", projectError);
      }

      setSuccess(true);

      // Redirect after a short delay
      setTimeout(() => {
        router.push("/dashboard/marketplace");
      }, 2000);
    } catch (err) {
      console.error("Failed to update listing:", err);
      setError(err.message || "Failed to update listing. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleUnlist = async () => {
    if (!user || !listing) return;

    setUnlisting(true);
    setError(null);

    try {
      // Update the listing status to inactive
      const { error: listingError } = await supabase
        .from("marketplace_listings")
        .update({ status: "inactive" })
        .eq("id", listing.id);

      if (listingError) {
        throw listingError;
      }

      // Update the project's for_sale status
      const { error: projectError } = await supabase
        .from("projects")
        .update({ for_sale: false })
        .eq("id", listing.project_id);

      if (projectError) {
        console.error("Error updating project:", projectError);
      }

      setSuccess(true);

      // Redirect after a short delay
      setTimeout(() => {
        router.push("/dashboard/marketplace");
      }, 2000);
    } catch (err) {
      console.error("Failed to unlist project:", err);
      setError(err.message || "Failed to unlist project. Please try again.");
    } finally {
      setUnlisting(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-16">Loading listing...</div>
      </div>
    );
  }

  if (error && !listing) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <h2 className="text-xl font-semibold mb-2">{error}</h2>
              <Button asChild>
                <Link href="/dashboard/marketplace">Back to Marketplace</Link>
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
          <Link href="/dashboard/marketplace">
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back to Marketplace
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">Edit Listing</h1>
      </div>

      <Card>
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>Edit Listing Details</CardTitle>
            <CardDescription>
              Update your marketplace listing information
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
                  Your listing has been updated successfully! Redirecting...
                </AlertDescription>
              </Alert>
            )}

            {/* Project Name (read-only) */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Project</label>
              <Input value={listing?.projects?.name || ""} disabled />
              <p className="text-xs text-muted-foreground">
                The project cannot be changed
              </p>
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
                Set a realistic price based on your project's value
              </p>
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
            </div>
          </CardContent>

          <CardFooter className="flex justify-between border-t pt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/dashboard/marketplace")}
              disabled={submitting || success}
            >
              Cancel
            </Button>
            <div className="flex gap-2">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    type="button"
                    variant="destructive"
                    disabled={submitting || unlisting || success}
                  >
                    Remove from Marketplace
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Remove from Marketplace?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      This will remove your project from the marketplace. You
                      can always list it again later by creating a new listing.
                      The project itself will not be deleted.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleUnlist}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      {unlisting ? "Removing..." : "Remove Listing"}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
              <Button type="submit" disabled={submitting || success}>
                {submitting ? "Updating..." : "Update Listing"}
              </Button>
            </div>
          </CardFooter>
        </form>
      </Card>

      {/* Warning Section */}
      <div className="mt-6">
        <Card className="border-destructive/50">
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <AlertTriangle className="h-5 w-5 text-destructive mt-0.5" />
              <div>
                <h3 className="font-semibold mb-1">
                  About Removing from Marketplace
                </h3>
                <p className="text-sm text-muted-foreground">
                  Removing your project from the marketplace will set its status
                  to "inactive" and hide it from potential buyers. The project
                  itself will remain in your dashboard. You can create a new
                  listing anytime to sell it again.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
