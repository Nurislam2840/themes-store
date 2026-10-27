// src/app/api/download/route.js
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { orderSchema } from "@/lib/validations/themeSchema";

export async function POST(req) {
  try {
    const body = await req.json();
    
    const result = orderSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    const { themeSlug } = result.data;
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized - Please log in." }, { status: 401 });
    }

    const { data: order } = await supabase
      .from("orders")
      .select("id")
      .eq("user_id", user.id)
      .eq("status", "approved")
      .eq("theme_slug", themeSlug)
      .maybeSingle();

    if (!order) {
      return NextResponse.json({ error: "Purchase required." }, { status: 403 });
    }

    const { data: theme } = await supabase
      .from("themes")
      .select("file_path")
      .eq("slug", themeSlug)
      .single();

    if (!theme?.file_path) {
      return NextResponse.json({ error: "File not found for this theme." }, { status: 404 });
    }

    let finalPath = theme.file_path;
    if (!finalPath.startsWith("themes/")) {
      finalPath = `themes/${finalPath}`;
    }

    // ✅ Path traversal protection
    if (finalPath.includes("..") || finalPath.startsWith("/") || finalPath.includes("\\")) {
      console.error("Suspicious path detected:", finalPath);
      return NextResponse.json({ error: "Invalid file path." }, { status: 400 });
    }

    const { data: signedData, error } = await supabase.storage
      .from("secure-downloads")
      .createSignedUrl(finalPath, 60);

    if (error) {
      console.error("Signed URL Error:", error);
      return NextResponse.json({ error: "Download failed. Please contact support." }, { status: 500 });
    }

    return NextResponse.json({ url: signedData.signedUrl });
  } catch (err) {
    console.error("Download API Error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}