const fs = require("fs");
const { createClient } = require("@supabase/supabase-js");

// Initialize Supabase Client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://oshrozyekhvnkaranlwi.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || "sb_publishable_S43yC6RLKlkLdO_AJjdPXw_hF1X0ltn";
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const sampleImageUrls = [
  { name: "mango-terbeka.jpg", url: "https://images.unsplash.com/photo-1553279768-865429fa0078?q=80&w=600" },
  { name: "mango-rupali.jpg", url: "https://images.unsplash.com/photo-1601493700631-2b16ec4b4716?q=80&w=600" },
  { name: "mango-langra.jpg", url: "https://images.unsplash.com/photo-1591073113125-e46713c829ed?q=80&w=600" },
  { name: "lichi-dinajpur.webp", url: "https://pub-fbc89431f7ed4d21a4222f885f3cb56d.r2.dev/demo21/img_6a29705e78cec3.58156451.webp" },
  { name: "dates-medjool.webp", url: "https://pub-fbc89431f7ed4d21a4222f885f3cb56d.r2.dev/demo21/img_6a297090d49979.25000568.webp" },
  { name: "dates-ajwa.jpg", url: "https://images.unsplash.com/photo-1596591606975-97ee5cef3a1e?q=80&w=600" },
  { name: "pure-honey.jpg", url: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=600" },
  { name: "gawa-ghee.jpg", url: "https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?auto=format&fit=crop&w=600" },
  { name: "mustard-oil.jpg", url: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=600" }
];

async function uploadImagesToSupabase() {
  console.log("Starting Image migration to Supabase Storage bucket ('product-images')...\n");

  for (const img of sampleImageUrls) {
    try {
      console.log(`Downloading ${img.name}...`);
      const response = await fetch(img.url);
      const arrayBuffer = await response.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      // Upload to Supabase Storage
      const { data, error } = await supabase.storage
        .from("product-images")
        .upload(`products/${img.name}`, buffer, {
          contentType: "image/jpeg",
          upsert: true
        });

      if (error) {
        console.error(`Failed to upload ${img.name}:`, error.message);
      } else {
        const publicUrl = `${supabaseUrl}/storage/v1/object/public/product-images/products/${img.name}`;
        console.log(`Successfully uploaded: ${img.name} -> ${publicUrl}`);
      }
    } catch (e) {
      console.error(`Error processing ${img.name}:`, e.message);
    }
  }

  console.log("\nImage Migration Complete!");
}

uploadImagesToSupabase();
