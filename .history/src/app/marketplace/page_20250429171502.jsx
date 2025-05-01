"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/components/auth/auth-provider";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, FileSearch, Filter, Search, Tag } from "lucide-react";

export default function MarketplacePage() {
  const { user } = useAuth();
  const [listings, setListings] = useState([]);
  const [filteredListings, setFilteredListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [priceFilter, setPriceFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [showFilters, setShowFilters] = useState(false);
  const supabase = createClient();
  const searchParams = useSearchParams();

  useEffect(() => {
    const fetchListings = async () => {
      try {
        setLoading(true);

        // Fetch listings from marketplace_listings table
        // For an actual implementation, this would join with projects table
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
              domain_name,
              live_url,
              image_url,
              user_id
            )
          `
          )
          .eq("status", "active");

        if (error) {
          console.error("Error fetching marketplace listings:", error);
        } else {
          // For demo purposes, if no listings exist yet, create mock data
          const fetchedListings = data || createMockListings();
          setListings(fetchedListings);
          setFilteredListings(fetchedListings);
        }
      } catch (err) {
        console.error("Failed to fetch marketplace listings:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchListings();

    // Apply any filters from URL params
    const category = searchParams.get("category");
    const price = searchParams.get("price");
    const search = searchParams.get("search");

    if (category) setCategoryFilter(category);
    if (price) setPriceFilter(price);
    if (search) setSearchTerm(search);
  }, [supabase, searchParams]);

  // Apply filters whenever filter criteria change
  useEffect(() => {
    let result = [...listings];

    // Apply search term filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (listing) =>
          listing.title?.toLowerCase().includes(term) ||
          listing.description?.toLowerCase().includes(term) ||
          listing.projects?.name?.toLowerCase().includes(term) ||
          listing.projects?.description?.toLowerCase().includes(term)
      );
    }

    // Apply price filter
    if (priceFilter !== "all") {
      if (priceFilter === "under100") {
        result = result.filter((listing) => listing.asking_price < 100);
      } else if (priceFilter === "100to500") {
        result = result.filter(
          (listing) =>
            listing.asking_price >= 100 && listing.asking_price <= 500
        );
      } else if (priceFilter === "500to1000") {
        result = result.filter(
          (listing) =>
            listing.asking_price > 500 && listing.asking_price <= 1000
        );
      } else if (priceFilter === "over1000") {
        result = result.filter((listing) => listing.asking_price > 1000);
      }
    }

    // Apply category filter
    if (categoryFilter !== "all") {
      result = result.filter(
        (listing) => listing.projects?.stage === categoryFilter
      );
    }

    setFilteredListings(result);
  }, [searchTerm, priceFilter, categoryFilter, listings]);

  // Create mock listings for demonstration purposes
  const createMockListings = () => {
    return [
      {
        id: "1",
        title: "Recipe Sharing Platform",
        description:
          "A fully functional recipe sharing platform with user profiles, recipe uploads, and commenting features.",
        asking_price: 499.99,
        included_assets: [
          "Source code",
          "Database schema",
          "User documentation",
        ],
        status: "active",
        created_at: "2024-04-01T12:00:00Z",
        projects: {
          id: "proj-1",
          name: "Recipe Sharing Platform",
          description:
            "A fully functional recipe sharing platform with user profiles, recipe uploads, and commenting features.",
          stage: "launched",
          domain_name: "recipeshare.com",
          live_url: "https://recipeshare.com",
          image_url: null,
          user_id: "user-1",
        },
      },
      {
        id: "2",
        title: "Task Management App",
        description:
          "Simple but effective task management app with Kanban boards and team collaboration.",
        asking_price: 299,
        included_assets: ["Source code", "Logo design", "User base (2K users)"],
        status: "active",
        created_at: "2024-04-05T14:30:00Z",
        projects: {
          id: "proj-2",
          name: "Task Management App",
          description:
            "Simple but effective task management app with Kanban boards and team collaboration.",
          stage: "launched",
          domain_name: "taskflow.io",
          live_url: "https://taskflow.io",
          image_url: null,
          user_id: "user-2",
        },
      },
      {
        id: "3",
        title: "Budget Tracking Tool",
        description:
          "Personal finance tool that helps users track expenses and set budgets.",
        asking_price: 799,
        included_assets: ["Source code", "Mobile app", "User base (5K users)"],
        status: "active",
        created_at: "2024-04-10T09:15:00Z",
        projects: {
          id: "proj-3",
          name: "Budget Tracking Tool",
          description:
            "Personal finance tool that helps users track expenses and set budgets.",
          stage: "mvp",
          domain_name: "budgetbuddy.app",
          live_url: "https://budgetbuddy.app",
          image_url: null,
          user_id: "user-3",
        },
      },
      {
        id: "4",
        title: "Indie Game - Cosmic Explorer",
        description:
          "2D space exploration game built with Unity. Currently generating $200/month.",
        asking_price: 2500,
        included_assets: ["Source code", "Game assets", "Steam listing"],
        status: "active",
        created_at: "2024-04-15T16:45:00Z",
        projects: {
          id: "proj-4",
          name: "Cosmic Explorer",
          description:
            "2D space exploration game built with Unity. Currently generating $200/month.",
          stage: "launched",
          domain_name: "cosmicexplorergame.com",
          live_url: "https://store.steampowered.com/app/cosmic-explorer",
          image_url: null,
          user_id: "user-4",
        },
      },
      {
        id: "5",
        title: "Weather API Service",
        description:
          "RESTful API for weather data with a small but growing subscriber base.",
        asking_price: 1200,
        included_assets: ["Source code", "Server setup", "Current subscribers"],
        status: "active",
        created_at: "2024-04-20T11:30:00Z",
        projects: {
          id: "proj-5",
          name: "Weather API Service",
          description:
            "RESTful API for weather data with a small but growing subscriber base.",
          stage: "launched",
          domain_name: "clearskiesapi.com",
          live_url: "https://api.clearskiesapi.com",
          image_url: null,
          user_id: "user-5",
        },
      },
      {
        id: "6",
        title: "E-learning Platform Concept",
        description:
          "Beautifully designed e-learning platform concept with working prototype.",
        asking_price: 150,
        included_assets: ["Design files", "Prototype", "Market research"],
        status: "active",
        created_at: "2024-04-22T10:00:00Z",
        projects: {
          id: "proj-6",
          name: "E-learning Platform Concept",
          description:
            "Beautifully designed e-learning platform concept with working prototype.",
          stage: "design",
          domain_name: "learnhub.io",
          live_url: "https://prototype.learnhub.io",
          image_url: null,
          user_id: "user-6",
        },
      },
      {
        id: "7",
        title: "Fitness Tracker App",
        description:
          "Mobile app for tracking workouts and nutrition with a growing user base.",
        asking_price: 850,
        included_assets: [
          "Source code",
          "User base (3K users)",
          "Brand assets",
        ],
        status: "active",
        created_at: "2024-04-25T14:20:00Z",
        projects: {
          id: "proj-7",
          name: "Fitness Tracker App",
          description:
            "Mobile app for tracking workouts and nutrition with a growing user base.",
          stage: "mvp",
          domain_name: "fitjourney.app",
          live_url: "https://fitjourney.app",
          image_url: null,
          user_id: "user-7",
        },
      },
      {
        id: "8",
        title: "NFT Marketplace Idea",
        description:
          "Fully researched NFT marketplace idea with wireframes and business plan.",
        asking_price: 75,
        included_assets: ["Business plan", "Wireframes", "Market analysis"],
        status: "active",
        created_at: "2024-04-28T09:10:00Z",
        projects: {
          id: "proj-8",
          name: "NFT Marketplace Idea",
          description:
            "Fully researched NFT marketplace idea with wireframes and business plan.",
          stage: "idea",
          domain_name: "nftspace.io",
          live_url: null,
          image_url: null,
          user_id: "user-8",
        },
      },
    ];
  };

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

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Marketplace</h1>
          <p className="text-muted-foreground mt-2">
            Find side projects for sale or list your own project
          </p>
        </div>
        <div className="flex gap-4">
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center"
          >
            <Filter className="mr-2 h-4 w-4" />
            Filters
          </Button>
          {user && (
            <Button asChild>
              <Link href="/dashboard/marketplace/list">List Your Project</Link>
            </Button>
          )}
        </div>
      </div>

      {/* Search and Filters */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          {!showFilters && (
            <Select value={priceFilter} onValueChange={setPriceFilter}>
              <SelectTrigger className="w-full md:w-40">
                <SelectValue placeholder="Price Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Prices</SelectItem>
                <SelectItem value="under100">Under $100</SelectItem>
                <SelectItem value="100to500">$100 - $500</SelectItem>
                <SelectItem value="500to1000">$500 - $1,000</SelectItem>
                <SelectItem value="over1000">Over $1,000</SelectItem>
              </SelectContent>
            </Select>
          )}
        </div>

        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border rounded-lg bg-muted/20 mt-4">
            <div>
              <label className="text-sm font-medium mb-2 block">
                Price Range
              </label>
              <Select value={priceFilter} onValueChange={setPriceFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Select price range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Prices</SelectItem>
                  <SelectItem value="under100">Under $100</SelectItem>
                  <SelectItem value="100to500">$100 - $500</SelectItem>
                  <SelectItem value="500to1000">$500 - $1,000</SelectItem>
                  <SelectItem value="over1000">Over $1,000</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">
                Project Stage
              </label>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Select project stage" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Stages</SelectItem>
                  <SelectItem value="idea">Idea</SelectItem>
                  <SelectItem value="design">Design</SelectItem>
                  <SelectItem value="mvp">MVP</SelectItem>
                  <SelectItem value="launched">Launched</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button
                variant="outline"
                className="w-full"
                onClick={() => {
                  setSearchTerm("");
                  setPriceFilter("all");
                  setCategoryFilter("all");
                }}
              >
                Reset Filters
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Results Count */}
      <div className="mb-6 flex justify-between items-center">
        <p className="text-muted-foreground">
          {filteredListings.length}{" "}
          {filteredListings.length === 1 ? "project" : "projects"} found
        </p>
        <div className="flex items-center gap-2">
          <Tag className="h-4 w-4 text-muted-foreground" />
          <Select value="newest" onValueChange={() => {}}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="oldest">Oldest First</SelectItem>
              <SelectItem value="priceAsc">Price: Low to High</SelectItem>
              <SelectItem value="priceDesc">Price: High to Low</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Listings */}
      {loading ? (
        <div className="text-center py-12">Loading marketplace listings...</div>
      ) : filteredListings.length === 0 ? (
        <div className="text-center py-12 border rounded-lg bg-muted/20">
          <FileSearch className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No projects found</h3>
          <p className="text-muted-foreground mb-6">
            We couldn't find any projects matching your criteria.
          </p>
          <Button
            variant="outline"
            onClick={() => {
              setSearchTerm("");
              setPriceFilter("all");
              setCategoryFilter("all");
            }}
          >
            Clear Filters
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredListings.map((listing) => (
            <Link key={listing.id} href={`/marketplace/${listing.id}`}>
              <Card className="h-full transition-all hover:shadow-md">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg line-clamp-1">
                      {listing.title || listing.projects?.name}
                    </CardTitle>
                    <Badge className={getStageColor(listing.projects?.stage)}>
                      {listing.projects?.stage || "Unknown"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="h-32 bg-muted rounded-md mb-4 relative overflow-hidden">
                    {listing.projects?.image_url ? (
                      <Image
                        src={listing.projects.image_url}
                        alt={listing.title || listing.projects?.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full text-muted-foreground">
                        No image available
                      </div>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                    {listing.description ||
                      listing.projects?.description ||
                      "No description available"}
                  </p>

                  <div className="mb-2">
                    <span className="font-semibold text-lg">
                      {formatCurrency(listing.asking_price)}
                    </span>
                  </div>

                  {listing.projects?.domain_name && (
                    <div className="text-xs text-muted-foreground mb-2 flex items-center">
                      <span className="font-medium mr-1">Domain:</span>
                      {listing.projects.domain_name}
                    </div>
                  )}
                </CardContent>
                <CardFooter className="border-t pt-4">
                  <div className="w-full flex flex-wrap gap-2">
                    {listing.included_assets &&
                      listing.included_assets
                        .slice(0, 3)
                        .map((asset, index) => (
                          <Badge
                            key={index}
                            variant="outline"
                            className="text-xs"
                          >
                            {asset}
                          </Badge>
                        ))}
                    {listing.included_assets &&
                      listing.included_assets.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{listing.included_assets.length - 3} more
                        </Badge>
                      )}
                  </div>
                </CardFooter>
              </Card>
            </Link>
          ))}
        </div>
      )}

      {/* Pagination */}
      {filteredListings.length > 0 && (
        <div className="flex justify-center mt-12">
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled>
              Previous
            </Button>
            <Button variant="outline" size="sm" className="bg-primary/10">
              1
            </Button>
            <Button variant="outline" size="sm">
              2
            </Button>
            <Button variant="outline" size="sm">
              3
            </Button>
            <Button variant="outline" size="sm">
              Next
            </Button>
          </div>
        </div>
      )}

      {/* Call To Action */}
      <div className="mt-16 p-8 border rounded-lg bg-muted/20 text-center">
        <h2 className="text-2xl font-bold mb-4">
          Ready to sell your side project?
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto mb-6">
          List your side project on our marketplace and connect with potential
          buyers. No fees until your project sells!
        </p>
        <Button asChild size="lg">
          <Link
            href={
              user
                ? "/dashboard/marketplace/list"
                : "/auth/login?redirect=marketplace/list"
            }
          >
            List Your Project
          </Link>
        </Button>
      </div>
    </div>
  );
}
