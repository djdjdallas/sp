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

    // Create project-images bucket if it doesn't exist
    const { data: projectBucket, error: projectError } =
      await supabase.storage.createBucket("project-images", {
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
      console.log("project-images bucket already exists");
    } else {
      console.log("Created project-images bucket");
    }

    // Create user-avatars bucket if it doesn't exist
    const { data: avatarBucket, error: avatarError } =
      await supabase.storage.createBucket("user-avatars", {
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
      console.log("user-avatars bucket already exists");
    } else {
      console.log("Created user-avatars bucket");
    }

    console.log("Storage setup complete");
  } catch (error) {
    console.error("Error setting up storage:", error);
  }
}

// Add storage bucket policies
async function setupStoragePolicies() {
  try {
    console.log("Setting up storage policies...");

    // Storage policies for project-images bucket
    const projectImagesPolicies = [
      // Allow public read access
      {
        name: "Public Access",
        definition: `bucket_id = 'project-images'`,
        operation: "SELECT",
      },
      // Allow authenticated users to upload
      {
        name: "Authenticated users can upload images",
        definition: `bucket_id = 'project-images' AND auth.role() = 'authenticated'`,
        operation: "INSERT",
      },
      // Allow users to update their own uploads
      {
        name: "Users can update own images",
        definition: `bucket_id = 'project-images' AND auth.uid() = owner`,
        operation: "UPDATE",
      },
      // Allow users to delete their own uploads
      {
        name: "Users can delete own images",
        definition: `bucket_id = 'project-images' AND auth.uid() = owner`,
        operation: "DELETE",
      },
    ];

    // Storage policies for user-avatars bucket
    const userAvatarsPolicies = [
      // Allow public read access
      {
        name: "Public Access for avatars",
        definition: `bucket_id = 'user-avatars'`,
        operation: "SELECT",
      },
      // Allow authenticated users to upload
      {
        name: "Authenticated users can upload avatars",
        definition: `bucket_id = 'user-avatars' AND auth.role() = 'authenticated'`,
        operation: "INSERT",
      },
      // Allow users to update their own uploads
      {
        name: "Users can update own avatars",
        definition: `bucket_id = 'user-avatars' AND auth.uid() = owner`,
        operation: "UPDATE",
      },
      // Allow users to delete their own uploads
      {
        name: "Users can delete own avatars",
        definition: `bucket_id = 'user-avatars' AND auth.uid() = owner`,
        operation: "DELETE",
      },
    ];

    console.log(
      "Note: Storage policies need to be set up manually in the Supabase dashboard."
    );
    console.log(
      "Go to Storage -> Policies and create the following policies for each bucket:"
    );
    console.log("\nFor project-images bucket:");
    projectImagesPolicies.forEach((policy) => {
      console.log(
        `- ${policy.name} (${policy.operation}): ${policy.definition}`
      );
    });
    console.log("\nFor user-avatars bucket:");
    userAvatarsPolicies.forEach((policy) => {
      console.log(
        `- ${policy.name} (${policy.operation}): ${policy.definition}`
      );
    });
  } catch (error) {
    console.error("Error setting up storage policies:", error);
  }
}

// Run the setup
async function main() {
  await setupStorage();
  await setupStoragePolicies();
}

main();
