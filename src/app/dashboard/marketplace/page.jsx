"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/components/auth/auth-provider";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Package, DollarSign } from "lucide-react";

export default function DashboardMarketplacePage() {
  const { user } = useAuth();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const fetchUserListings = async () => {
      if (!user) return;

      try {
        setLoading(true);

        // Fetch user's marketplace listings
        const { data, error } = await supabase
          .from("marketplace_listings")
          .select(
            `
            *,
            projects (
              id,
              name,
              description,
              stage,
              live_url
            )
          `
          )
          .eq("projects.user_id", user.id)
          .order("created_at", { ascending: false });

        if (error) {
          console.error("Error fetching marketplace listings:", error);
        } else {
          setListings(data || []);
        }
      } catch (err) {
        console.error("Failed to fetch marketplace listings:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserListings();
  }, [user, supabase]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Your Marketplace Listings</h1>
          <p className="text-muted-foreground mt-2">
            Manage your projects listed in the marketplace
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/marketplace/list">
            <Plus className="mr-2 h-4 w-4" />
            Create New Listing
          </Link>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Active Listings</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">
              {listings.filter((l) => l.status === "active").length}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Total Views</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">0</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Total Inquiries</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">0</p>
          </CardContent>
        </Card>
      </div>

      {/* Listings Table/Grid */}
      {loading ? (
        <div className="text-center py-12">Loading your listings...</div>
      ) : listings.length === 0 ? (
        <div className="text-center py-12 border rounded-lg bg-muted/20">
          <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No listings yet</h3>
          <p className="text-muted-foreground mb-6">
            Start by creating your first marketplace listing
          </p>
          <Button asChild>
            <Link href="/dashboard/marketplace/list">Create Listing</Link>
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {listings.map((listing) => (
            <Card key={listing.id}>
              <CardContent className="pt-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold">{listing.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      Project: {listing.projects?.name}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold">${listing.asking_price}</p>
                    <div
                      className={`text-sm ${
                        listing.status === "active"
                          ? "text-green-600"
                          : "text-yellow-600"
                      }`}
                    >
                      {listing.status}
                    </div>
                  </div>
                </div>
                <div className="mt-4 flex gap-2">
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/marketplace/${listing.id}`}>
                      View Listing
                    </Link>
                  </Button>
                  <Button variant="outline" size="sm">
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-destructive"
                  >
                    Deactivate
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
