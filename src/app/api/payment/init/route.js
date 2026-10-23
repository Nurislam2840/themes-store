import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function POST(req) {
  try {
    const body = await req.json();
    const {
      amount,
      customerName,
      customerEmail,
      customerPhone,
      customerAddress,
      items,
      userId,
    } = body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ success: false, error: "No items in cart" }, { status: 400 });
    }

    const tran_id = `TRX_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://127.0.0.1:3000";

    const { error: orderError } = await supabaseAdmin
      .from("pending_orders")
      .insert([
        {
          tran_id,
          amount: Number(amount),
          items: items,
          customer_name: customerName,
          customer_email: customerEmail,
          customer_phone: customerPhone,
          customer_address: customerAddress,
          user_id: userId,
          status: "pending",
        },
      ]);

    if (orderError) {
      console.error("Pending order insert error:", orderError);
      return NextResponse.json({ success: false, error: "Could not create order: " + orderError.message }, { status: 500 });
    }

    const formData = new URLSearchParams();
    formData.append("store_id", process.env.SSLCOMMERZ_STORE_ID);
    formData.append("store_passwd", process.env.SSLCOMMERZ_STORE_PASSWORD);
    formData.append("total_amount", amount.toString());
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

    formData.append("product_name", items.map((i) => i.title).join(", ").slice(0, 200));
    formData.append("product_category", "Digital Theme");
    formData.append("product_profile", "digital-goods");

    const response = await fetch("https://sandbox.sslcommerz.com/gwprocess/v4/api.php", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: formData.toString(),
    });

    const data = await response.json();

    if (data.status === "SUCCESS") {
      return NextResponse.json({
        success: true,
        gatewayUrl: data.GatewayPageURL,
        tran_id,
      });
    } else {
      await supabaseAdmin.from("pending_orders").delete().eq("tran_id", tran_id);
      return NextResponse.json({ success: false, error: data.failedreason || "Payment gateway rejected" });
    }
  } catch (error) {
    console.error("Payment Init Error:", error);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}

export async function GET(req) {
  return POST(req);
}