// src/app/api/marketplace/route.js
import { createServerActionClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(request) {
  const supabase = createServerActionClient({ cookies });

  // Check if user is authenticated
  const {
    data: { session },
  } = await supabase.auth.getSession();

  try {
    // Parse URL and query parameters
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const price = searchParams.get("price");
    const search = searchParams.get("search");
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "9", 10);

    // Build query
    let query = supabase
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
      .eq("status", "active")
      .order("created_at", { ascending: false });

    // Apply filters if provided
    if (category && category !== "all") {
      query = query.eq("projects.stage", category);
    }

    if (price && price !== "all") {
      switch (price) {
        case "under100":
          query = query.lt("asking_price", 100);
          break;
        case "100to500":
          query = query.gte("asking_price", 100).lte("asking_price", 500);
          break;
        case "500to1000":
          query = query.gt("asking_price", 500).lte("asking_price", 1000);
          break;
        case "over1000":
          query = query.gt("asking_price", 1000);
          break;
      }
    }

    if (search) {
      query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`);
    }

    // Apply pagination
    query = query.range((page - 1) * limit, page * limit - 1);

    const { data, error, count } = await query;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    // Get total count for pagination
    const { count: totalCount, error: countError } = await supabase
      .from("marketplace_listings")
      .select("*", { count: "exact", head: true })
      .eq("status", "active");

    if (countError) {
      console.error("Error getting count:", countError);
    }

    return NextResponse.json({
      listings: data,
      pagination: {
        total: totalCount || 0,
        page,
        limit,
        totalPages: Math.ceil((totalCount || 0) / limit),
      },
    });
  } catch (error) {
    console.error("Error in marketplace GET:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  const supabase = createServerActionClient({ cookies });

  // Check if user is authenticated
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const requestData = await request.json();

    // Validate required fields
    if (
      !requestData.project_id ||
      !requestData.title ||
      !requestData.description ||
      !requestData.asking_price
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check if user owns the project
    const { data: project, error: projectError } = await supabase
      .from("projects")
      .select("user_id")
      .eq("id", requestData.project_id)
      .single();

    if (projectError || !project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    if (project.user_id !== session.user.id) {
      return NextResponse.json(
        { error: "You do not have permission to list this project" },
        { status: 403 }
      );
    }

    // Check if project is already listed
    const { data: existingListing, error: listingError } = await supabase
      .from("marketplace_listings")
      .select("id")
      .eq("project_id", requestData.project_id)
      .eq("status", "active")
      .single();

    if (existingListing) {
      return NextResponse.json(
        { error: "This project is already listed in the marketplace" },
        { status: 400 }
      );
    }

    // Create listing
    const listingData = {
      project_id: requestData.project_id,
      title: requestData.title,
      description: requestData.description,
      asking_price: parseFloat(requestData.asking_price),
      included_assets: requestData.included_assets || null,
      status: "active",
      monthly_revenue: requestData.monthly_revenue
        ? parseFloat(requestData.monthly_revenue)
        : null,
      monthly_users: requestData.monthly_users
        ? parseInt(requestData.monthly_users, 10)
        : null,
      tech_stack: requestData.tech_stack || null,
      reason_for_selling: requestData.reason_for_selling || null,
    };

    const { data, error } = await supabase
      .from("marketplace_listings")
      .insert(listingData)
      .select();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    // Update project's for_sale status
    const { error: updateError } = await supabase
      .from("projects")
      .update({
        for_sale: true,
        asking_price: parseFloat(requestData.asking_price),
      })
      .eq("id", requestData.project_id);

    if (updateError) {
      console.error("Error updating project:", updateError);
    }

    return NextResponse.json({ listing: data[0] });
  } catch (error) {
    console.error("Error in marketplace POST:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(request) {
  const supabase = createServerActionClient({ cookies });

  // Check if user is authenticated
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const requestData = await request.json();

    if (!requestData.id) {
      return NextResponse.json(
        { error: "Listing ID is required" },
        { status: 400 }
      );
    }

    // Check if user owns the listing
    const { data: listing, error: listingError } = await supabase
      .from("marketplace_listings")
      .select(
        `
        *,
        projects (
          user_id
        )
      `
      )
      .eq("id", requestData.id)
      .single();

    if (listingError || !listing) {
      return NextResponse.json({ error: "Listing not found" }, { status: 404 });
    }

    if (listing.projects?.user_id !== session.user.id) {
      return NextResponse.json(
        { error: "You do not have permission to update this listing" },
        { status: 403 }
      );
    }

    // Update listing
    const updateData = {};

    // Only update fields that are provided
    if (requestData.title) updateData.title = requestData.title;
    if (requestData.description)
      updateData.description = requestData.description;
    if (requestData.asking_price)
      updateData.asking_price = parseFloat(requestData.asking_price);
    if (requestData.status) updateData.status = requestData.status;
    if (requestData.included_assets)
      updateData.included_assets = requestData.included_assets;
    if (requestData.monthly_revenue !== undefined) {
      updateData.monthly_revenue = requestData.monthly_revenue
        ? parseFloat(requestData.monthly_revenue)
        : null;
    }
    if (requestData.monthly_users !== undefined) {
      updateData.monthly_users = requestData.monthly_users
        ? parseInt(requestData.monthly_users, 10)
        : null;
    }
    if (requestData.tech_stack) updateData.tech_stack = requestData.tech_stack;
    if (requestData.reason_for_selling !== undefined)
      updateData.reason_for_selling = requestData.reason_for_selling;

    // If no fields to update
    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { error: "No fields to update" },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("marketplace_listings")
      .update(updateData)
      .eq("id", requestData.id)
      .select();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    // If asking_price was updated, also update the project
    if (requestData.asking_price) {
      const { error: updateError } = await supabase
        .from("projects")
        .update({
          asking_price: parseFloat(requestData.asking_price),
        })
        .eq("id", listing.project_id);

      if (updateError) {
        console.error("Error updating project:", updateError);
      }
    }

    // If status was changed to inactive or sold, update project
    if (requestData.status && requestData.status !== "active") {
      const { error: updateError } = await supabase
        .from("projects")
        .update({
          for_sale: false,
        })
        .eq("id", listing.project_id);

      if (updateError) {
        console.error("Error updating project:", updateError);
      }
    }

    return NextResponse.json({ listing: data[0] });
  } catch (error) {
    console.error("Error in marketplace PUT:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  const supabase = createServerActionClient({ cookies });

  // Check if user is authenticated
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Listing ID is required" },
        { status: 400 }
      );
    }

    // Check if user owns the listing
    const { data: listing, error: listingError } = await supabase
      .from("marketplace_listings")
      .select(
        `
        project_id,
        projects (
          user_id
        )
      `
      )
      .eq("id", id)
      .single();

    if (listingError || !listing) {
      return NextResponse.json({ error: "Listing not found" }, { status: 404 });
    }

    if (listing.projects?.user_id !== session.user.id) {
      return NextResponse.json(
        { error: "You do not have permission to delete this listing" },
        { status: 403 }
      );
    }

    // Delete listing (or mark as inactive)
    const { error } = await supabase
      .from("marketplace_listings")
      .update({ status: "inactive" })
      .eq("id", id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    // Update project for_sale status
    const { error: updateError } = await supabase
      .from("projects")
      .update({
        for_sale: false,
      })
      .eq("id", listing.project_id);

    if (updateError) {
      console.error("Error updating project:", updateError);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error in marketplace DELETE:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
