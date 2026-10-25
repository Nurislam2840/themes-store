import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req) {
  try {
    const { themeSlug } = await req.json();
    const supabase = await createClient();

    // ১. ইউজার লগইন আছে কিনা চেক
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized - Please log in." }, { status: 401 });
    }

    // ২. ইউজার এই থিমটি কিনেছে কিনা (approved order) চেক
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

    // ৩. থিমের ফাইল পাথ বের করা
    const { data: theme } = await supabase
      .from("themes")
      .select("file_path")
      .eq("slug", themeSlug)
      .single();

    if (!theme?.file_path) {
      return NextResponse.json({ error: "File not found for this theme." }, { status: 404 });
    }

    // ৪. ৬০ সেকেন্ডের জন্য Signed URL তৈরি
    const { data: signedData, error } = await supabase.storage
      .from("secure-downloads")
      .createSignedUrl(theme.file_path, 60);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ url: signedData.signedUrl });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}