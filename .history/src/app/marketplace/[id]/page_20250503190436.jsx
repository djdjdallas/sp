"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/components/auth/auth-provider";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  ChevronLeft,
  Globe,
  Code,
  DollarSign,
  Users,
  Calendar,
  MessageSquare,
  CheckCircle,
  BarChart,
  Tag,
  Store,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export default function MarketplaceListingDetailPage() {
  const { user } = useAuth();
  const router = useRouter();
  const params = useParams();
  const supabase = createClient();
  const [listing, setListing] = useState(null);
  const [seller, setSeller] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchListingDetails = async () => {
      if (!params.id) return;

      try {
        setLoading(true);

        // Fetch listing with project and seller details
        const { data, error: listingError } = await supabase
          .from("marketplace_listings")
          .select(
            `
            *,
            projects (
              id,
              name,
              description,
              stage,
              domain_name,
              live_url,
              repo_url,
              image_url,
              user_id,
              created_at
            )
          `
          )
          .eq("id", params.id)
          .eq("status", "active")
          .single();

        if (listingError || !data) {
          setError("Listing not found or no longer available");
          return;
        }

        setListing(data);

        // Fetch seller details
        if (data.projects?.user_id) {
          const { data: sellerData, error: sellerError } = await supabase
            .from("users")
            .select("*")
            .eq("id", data.projects.user_id)
            .single();

          if (!sellerError && sellerData) {
            setSeller(sellerData);
          }
        }
      } catch (err) {
        console.error("Failed to fetch listing details:", err);
        setError("Failed to load listing details");
      } finally {
        setLoading(false);
      }
    };

    fetchListingDetails();
  }, [params.id, supabase]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getStageColor = (stage) => {
    const colors = {
      idea: "bg-yellow-100 text-yellow-800",
      design: "bg-blue-100 text-blue-800",
      mvp: "bg-purple-100 text-purple-800",
      launched: "bg-green-100 text-green-800",
      archived: "bg-gray-100 text-gray-800",
    };
    return colors[stage] || "bg-gray-100 text-gray-800";
  };

  const isOwner = user?.id === listing?.projects?.user_id;

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-16">Loading listing details...</div>
      </div>
    );
  }

  if (error || !listing) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <h2 className="text-xl font-semibold mb-2">{error}</h2>
              <Button asChild>
                <Link href="/marketplace">Back to Marketplace</Link>
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
        <Button variant="ghost" asChild className="pl-0">
          <Link href="/marketplace">
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back to Marketplace
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Header */}
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold mb-2">{listing.title}</h1>
              <div className="flex items-center gap-4">
                <Badge className={getStageColor(listing.projects?.stage)}>
                  {listing.projects?.stage}
                </Badge>
                <span className="text-muted-foreground">
                  Listed{" "}
                  {formatDistanceToNow(new Date(listing.created_at), {
                    addSuffix: true,
                  })}
                </span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold">
                {formatCurrency(listing.asking_price)}
              </div>
              {isOwner && (
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-2"
                  onClick={() =>
                    router.push(`/dashboard/marketplace/edit/${listing.id}`)
                  }
                >
                  Edit Listing
                </Button>
              )}
            </div>
          </div>

          {/* Project Image */}
          {listing.projects?.image_url && (
            <div className="relative w-full h-96 rounded-lg border overflow-hidden">
              <Image
                src={listing.projects.image_url}
                alt={listing.title}
                fill
                className="object-cover"
              />
            </div>
          )}

          {/* Description */}
          <Card>
            <CardHeader>
              <CardTitle>About this Project</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-wrap">{listing.description}</p>
            </CardContent>
          </Card>

          {/* Key Metrics */}
          {(listing.monthly_revenue || listing.monthly_users) && (
            <Card>
              <CardHeader>
                <CardTitle>Key Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {listing.monthly_revenue && (
                    <div className="flex items-center gap-3">
                      <DollarSign className="h-8 w-8 text-green-500" />
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Monthly Revenue
                        </p>
                        <p className="text-2xl font-bold">
                          {formatCurrency(listing.monthly_revenue)}
                        </p>
                      </div>
                    </div>
                  )}
                  {listing.monthly_users && (
                    <div className="flex items-center gap-3">
                      <Users className="h-8 w-8 text-blue-500" />
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Monthly Active Users
                        </p>
                        <p className="text-2xl font-bold">
                          {listing.monthly_users.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Tech Stack */}
          {listing.tech_stack && listing.tech_stack.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Technology Stack</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {listing.tech_stack.map((tech) => (
                    <Badge key={tech} variant="secondary">
                      {tech}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* What's Included */}
          <Card>
            <CardHeader>
              <CardTitle>What's Included</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {listing.included_assets.map((asset, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    {asset}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Reason for Selling */}
          {listing.reason_for_selling && (
            <Card>
              <CardHeader>
                <CardTitle>Why I'm Selling</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-wrap">
                  {listing.reason_for_selling}
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Project Links */}
          <Card>
            <CardHeader>
              <CardTitle>Project Links</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {listing.projects?.live_url && (
                <a
                  href={listing.projects.live_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-primary hover:underline"
                >
                  <Globe className="h-4 w-4" />
                  Visit Live Site
                </a>
              )}
              {listing.projects?.domain_name && (
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4 text-muted-foreground" />
                  <span>{listing.projects.domain_name}</span>
                </div>
              )}
              {listing.projects?.repo_url && (
                <a
                  href={listing.projects.repo_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-primary hover:underline"
                >
                  <Code className="h-4 w-4" />
                  View Repository
                </a>
              )}
            </CardContent>
          </Card>

          {/* Seller Info */}
          <Card>
            <CardHeader>
              <CardTitle>Seller Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4 mb-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage
                    src={seller?.avatar_url}
                    alt={seller?.full_name}
                  />
                  <AvatarFallback>
                    {seller?.full_name?.charAt(0) || "S"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold">
                    {seller?.full_name || "Seller"}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Member since{" "}
                    {seller?.created_at
                      ? new Date(seller.created_at).toLocaleDateString()
                      : "Unknown"}
                  </p>
                </div>
              </div>

              {!isOwner && (
                <Button className="w-full" size="lg">
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Contact Seller
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Facts</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Project Age</p>
                  <p className="font-medium">
                    {formatDistanceToNow(
                      new Date(listing.projects?.created_at)
                    )}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Store className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Listed</p>
                  <p className="font-medium">
                    {formatDistanceToNow(new Date(listing.created_at), {
                      addSuffix: true,
                    })}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Tag className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Project Stage</p>
                  <p className="font-medium capitalize">
                    {listing.projects?.stage}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
