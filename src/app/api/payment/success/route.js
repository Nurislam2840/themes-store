// src/app/api/payment/success/route.js
import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function POST(req) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://127.0.0.1:3000";

  try {
    const url = new URL(req.url);
    const urlTranId = url.searchParams.get("tran_id");

    let formData = null;
    let status = null;
    let tran_id = urlTranId;
    let amount = null;
    let cusName = null;
    let cusEmail = null;
    let cusPhone = null;
    let val_id = null;

    if (req.method === "POST") {
      try {
        formData = await req.formData();
        status = formData.get("status");
        tran_id = formData.get("tran_id") || urlTranId;
        amount = formData.get("amount");
        cusName = formData.get("cus_name");
        cusEmail = formData.get("cus_email");
        cusPhone = formData.get("cus_phone");
        val_id = formData.get("val_id");
      } catch (e) {}
    }

    if (!status) status = url.searchParams.get("status");
    if (!tran_id) tran_id = url.searchParams.get("tran_id");
    if (!amount) amount = url.searchParams.get("amount");
    if (!val_id) val_id = url.searchParams.get("val_id");

    const isValidStatus = status === "VALID" || status === "VALIDATED";

    if (!tran_id || !isValidStatus || !val_id) {
      console.error("Missing or invalid payment data");
      if (tran_id) {
        await supabaseAdmin.from("pending_orders").update({ status: "failed" }).eq("tran_id", tran_id);
      }
      return NextResponse.redirect(`${siteUrl}/checkout?status=fail`);
    }

    // ✅ SSLCommerz সার্ভারের সাথে ভ্যালিডেশন
    const validationParams = new URLSearchParams();
    validationParams.append("val_id", val_id);
    validationParams.append("store_id", process.env.SSLCOMMERZ_STORE_ID);
    validationParams.append("store_passwd", process.env.SSLCOMMERZ_STORE_PASSWORD);
    validationParams.append("format", "json");

    const sslBase = process.env.SSLCOMMERZ_BASE_URL || "https://sandbox.sslcommerz.com";
    const validationRes = await fetch(
      `${sslBase}/validator/api/validationserverAPI.php?${validationParams.toString()}`,
      { method: "GET" }
    );
    const validationData = await validationRes.json();

    if (validationData.status !== "VALID" && validationData.status !== "VALIDATED") {
      console.error("Payment validation failed:", validationData);
      await supabaseAdmin.from("pending_orders").update({ status: "failed" }).eq("tran_id", tran_id);
      return NextResponse.redirect(`${siteUrl}/checkout?status=fail`);
    }

    const { data: pending } = await supabaseAdmin
      .from("pending_orders")
      .select("*")
      .eq("tran_id", tran_id)
      .single();

    if (!pending) {
      return NextResponse.redirect(`${siteUrl}/checkout?status=error`);
    }

    // ✅ Amount tampering check
    const paidAmount = parseFloat(validationData.amount);
    const expectedAmount = parseFloat(pending.amount);

    if (Math.abs(paidAmount - expectedAmount) > 1) {
      console.error(`Amount mismatch: Paid ${paidAmount}, Expected ${expectedAmount}`);
      await supabaseAdmin.from("pending_orders").update({ status: "failed" }).eq("tran_id", tran_id);
      return NextResponse.redirect(`${siteUrl}/checkout?status=error`);
    }

    // ✅ Duplicate prevention #1: pending_orders already completed
    if (pending.status === "completed") {
      return NextResponse.redirect(`${siteUrl}/checkout/success?tran_id=${tran_id}`);
    }

    // ✅ Duplicate prevention #2: orders-এ same tran_id আগে থেকেই আছে কিনা
    const { data: existingOrder } = await supabaseAdmin
      .from("orders")
      .select("id")
      .eq("transaction_id", tran_id)
      .maybeSingle();

    if (existingOrder) {
      // order আগেই insert হয়েছে, শুধু pending_orders আপডেট করে redirect
      await supabaseAdmin.from("pending_orders").update({ status: "completed" }).eq("tran_id", tran_id);
      return NextResponse.redirect(`${siteUrl}/checkout/success?tran_id=${tran_id}`);
    }

    let items = [];
    try {
      items = typeof pending.items === "string" ? JSON.parse(pending.items) : pending.items;
    } catch {
      items = [];
    }

    // অর্ডার সেভ
    const { error: orderError } = await supabaseAdmin.from("orders").insert([
      {
        theme_slug: items[0]?.slug ?? "",
        theme_title: items.map((i) => i.title).join(", "),
        price: Number(paidAmount),
        customer_name: cusName || pending.customer_name,
        customer_email: cusEmail || pending.customer_email,
        customer_phone: cusPhone || pending.customer_phone,
        transaction_id: tran_id,
        user_id: pending.user_id,
        status: "approved",
      },
    ]);

    if (orderError) {
      console.error("DB Error:", orderError);
      return NextResponse.redirect(`${siteUrl}/checkout?status=error`);
    }

    await supabaseAdmin.from("pending_orders").update({ status: "completed" }).eq("tran_id", tran_id);
    return NextResponse.redirect(`${siteUrl}/checkout/success?tran_id=${tran_id}`);

  } catch (error) {
    console.error("Success Handler Error:", error);
    return NextResponse.redirect(`${siteUrl}/checkout?status=error`);
  }
}

export async function GET(req) {
  return POST(req);
}