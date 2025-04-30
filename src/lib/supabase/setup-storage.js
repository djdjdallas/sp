/*
  This script should be run once to set up the storage buckets for the application.
  It can be run directly with Node.js after adding your Supabase credentials.
  
  Example usage:
  NODE_ENV=development node setup-storage.js
*/

const { createClient } = require("@supabase/supabase-js");

// Replace with your Supabase URL and service role key (NOT the anon key)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Create a Supabase client with the service role key
const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function setupStorage() {
  try {
    console.log("Setting up storage buckets...");

    // Create project_images bucket if it doesn't exist
    const { data: projectBucket, error: projectError } =
      await supabase.storage.createBucket("project_images", {
        public: true, // Files are publicly accessible
        fileSizeLimit: 10485760, // 10MB
        allowedMimeTypes: [
          "image/png",
          "image/jpeg",
          "image/gif",
          "image/webp",
        ],
      });

    if (projectError && !projectError.message.includes("already exists")) {
      throw projectError;
    } else if (projectError) {
      console.log("project_images bucket already exists");
    } else {
      console.log("Created project_images bucket");
    }

    // Create user_avatars bucket if it doesn't exist
    const { data: avatarBucket, error: avatarError } =
      await supabase.storage.createBucket("user_avatars", {
        public: true, // Files are publicly accessible
        fileSizeLimit: 5242880, // 5MB
        allowedMimeTypes: [
          "image/png",
          "image/jpeg",
          "image/gif",
          "image/webp",
        ],
      });

    if (avatarError && !avatarError.message.includes("already exists")) {
      throw avatarError;
    } else if (avatarError) {
      console.log("user_avatars bucket already exists");
    } else {
      console.log("Created user_avatars bucket");
    }

    // Set public access for project_images bucket
    const { error: projectPolicyError } = await supabase.storage
      .from("project_images")
      .setPublic();

    if (projectPolicyError) {
      console.error(
        "Error setting public access for project_images:",
        projectPolicyError
      );
    } else {
      console.log("Set public access for project_images bucket");
    }

    // Set public access for user_avatars bucket
    const { error: avatarPolicyError } = await supabase.storage
      .from("user_avatars")
      .setPublic();

    if (avatarPolicyError) {
      console.error(
        "Error setting public access for user_avatars:",
        avatarPolicyError
      );
    } else {
      console.log("Set public access for user_avatars bucket");
    }

    console.log("Storage setup complete");
  } catch (error) {
    console.error("Error setting up storage:", error);
  }
}

setupStorage();
