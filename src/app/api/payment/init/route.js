// src/app/api/payment/init/route.js
import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { rateLimit } from "@/lib/rateLimit"; // ✅ ইমপোর্ট

export async function POST(req) {
  try {
    // ✅ রেট লিমিট চেক (১ মিনিটে সর্বোচ্চ ৫ বার পেমেন্ট শুরু করা যাবে)
    const ip = req.headers.get("x-forwarded-for") || "unknown";
    const limitResult = rateLimit(ip, 5, 60000);
    if (!limitResult.success) {
      return NextResponse.json({ success: false, error: limitResult.message }, { status: 429 });
    }

    const body = await req.json();
    const { customerName, customerEmail, customerPhone, customerAddress, items, userId } = body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ success: false, error: "No items in cart" }, { status: 400 });
    }

    const themeSlugs = items.map((i) => i.slug).filter(Boolean);
    if (themeSlugs.length === 0) {
      return NextResponse.json({ success: false, error: "Invalid items" }, { status: 400 });
    }

    const { data: dbThemes, error: dbError } = await supabaseAdmin
      .from("themes")
      .select("id, slug, title, price")
      .in("slug", themeSlugs);

    if (dbError || !dbThemes || dbThemes.length === 0) {
      return NextResponse.json({ success: false, error: "Themes not found" }, { status: 400 });
    }

    const themeMap = new Map(dbThemes.map((t) => [t.slug, t]));

    const verifiedItems = items.map((item) => {
      const dbTheme = themeMap.get(item.slug);
      if (!dbTheme) throw new Error(`Theme not found: ${item.slug}`);
      return {
        themeId: dbTheme.id,
        slug: dbTheme.slug,
        title: dbTheme.title,
        price: Number(dbTheme.price),
        quantity: Number(item.quantity || 1),
      };
    });

    const verifiedAmount = verifiedItems.reduce((sum, i) => sum + i.price * i.quantity, 0);

    if (!Number.isFinite(verifiedAmount) || verifiedAmount <= 0) {
      return NextResponse.json({ success: false, error: "Invalid amount" }, { status: 400 });
    }

    const tran_id = `TRX_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://127.0.0.1:3000";

    const { error: orderError } = await supabaseAdmin
      .from("pending_orders")
      .insert([{
        tran_id, amount: verifiedAmount, items: verifiedItems, customer_name: customerName,
        customer_email: customerEmail, customer_phone: customerPhone, customer_address: customerAddress,
        user_id: userId, status: "pending",
      }]);

    if (orderError) {
      return NextResponse.json({ success: false, error: "Could not create order" }, { status: 500 });
    }

    const formData = new URLSearchParams();
    formData.append("store_id", process.env.SSLCOMMERZ_STORE_ID);
    formData.append("store_passwd", process.env.SSLCOMMERZ_STORE_PASSWORD);
    formData.append("total_amount", verifiedAmount.toString());
    formData.append("currency", "BDT");
    formData.append("tran_id", tran_id);
    formData.append("success_url", `${siteUrl}/api/payment/success?tran_id=${tran_id}`);
    formData.append("fail_url", `${siteUrl}/checkout?status=fail`);
    formData.append("cancel_url", `${siteUrl}/checkout?status=cancel`);
    formData.append("cus_name", customerName);
    formData.append("cus_email", customerEmail);
    formData.append("cus_add1", customerAddress || "Dhaka");
    formData.append("cus_city", "Dhaka");
    formData.append("cus_postcode", "1200");
    formData.append("cus_country", "Bangladesh");
    formData.append("cus_phone", customerPhone);
    formData.append("product_name", verifiedItems.map((i) => i.title).join(", ").slice(0, 200));
    formData.append("product_category", "Digital Theme");
    formData.append("product_profile", "digital-goods");

    const sslBase = process.env.SSLCOMMERZ_BASE_URL || "https://sandbox.sslcommerz.com";
    const response = await fetch(`${sslBase}/gwprocess/v4/api.php`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: formData.toString(),
    });

    const data = await response.json();

    if (data.status === "SUCCESS") {
      return NextResponse.json({ success: true, gatewayUrl: data.GatewayPageURL, tran_id });
    } else {
      await supabaseAdmin.from("pending_orders").delete().eq("tran_id", tran_id);
      return NextResponse.json({ success: false, error: data.failedreason || "Payment gateway rejected" });
    }
  } catch (error) {
    console.error("Payment Init Error:", error);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}