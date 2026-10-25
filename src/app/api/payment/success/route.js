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
    let val_id = null; // নতুন: ভ্যালিডেশন আইডি

    if (req.method === "POST") {
      try {
        formData = await req.formData();
        status = formData.get("status");
        tran_id = formData.get("tran_id") || urlTranId;
        amount = formData.get("amount");
        cusName = formData.get("cus_name");
        cusEmail = formData.get("cus_email");
        cusPhone = formData.get("cus_phone");
        val_id = formData.get("val_id"); // নতুন
      } catch (e) {}
    }

    if (!status) status = url.searchParams.get("status");
    if (!tran_id) tran_id = url.searchParams.get("tran_id");
    if (!amount) amount = url.searchParams.get("amount");
    if (!val_id) val_id = url.searchParams.get("val_id"); // নতুন

    const isValidStatus = status === "VALID" || status === "VALIDATED";

    if (!tran_id || !isValidStatus || !val_id) {
      console.error("Missing or invalid payment data");
      if (tran_id) {
        await supabaseAdmin.from("pending_orders").update({ status: "failed" }).eq("tran_id", tran_id);
      }
      return NextResponse.redirect(`${siteUrl}/checkout?status=fail`);
    }

    // 🚨 সবচেয়ে গুরুত্বপূর্ণ ধাপ: SSLCommerz সার্ভারের সাথে সরাসরি ভ্যালিডেট করা
    const validationParams = new URLSearchParams();
    validationParams.append("val_id", val_id);
    validationParams.append("store_id", process.env.SSLCOMMERZ_STORE_ID);
    validationParams.append("store_passwd", process.env.SSLCOMMERZ_STORE_PASSWORD);
    validationParams.append("format", "json");

    const validationRes = await fetch(
      `https://sandbox.sslcommerz.com/validator/api/validationserverAPI.php?${validationParams.toString()}`,
      { method: "GET" }
    );
    const validationData = await validationRes.json();

    // চেক করা হচ্ছে SSLCommerz সত্যিই এই পেমেন্টকে VALID বলছে কিনা
    if (validationData.status !== "VALID" && validationData.status !== "VALIDATED") {
      console.error("Payment validation failed:", validationData);
      await supabaseAdmin.from("pending_orders").update({ status: "failed" }).eq("tran_id", tran_id);
      return NextResponse.redirect(`${siteUrl}/checkout?status=fail`);
    }

    // চেক করা হচ্ছে পেমেন্টের অ্যামাউন্ট আমাদের ডাটাবেসের অ্যামাউন্টের সাথে মিলছে কিনা
    const { data: pending } = await supabaseAdmin
      .from("pending_orders")
      .select("*")
      .eq("tran_id", tran_id)
      .single();

    if (!pending) {
      return NextResponse.redirect(`${siteUrl}/checkout?status=error`);
    }

    const paidAmount = parseFloat(validationData.amount);
    const expectedAmount = parseFloat(pending.amount);

    // 🚨 অ্যামাউন্ট টেম্পারিং চেক
    if (Math.abs(paidAmount - expectedAmount) > 1) {
      console.error(`Amount mismatch: Paid ${paidAmount}, Expected ${expectedAmount}`);
      await supabaseAdmin.from("pending_orders").update({ status: "failed" }).eq("tran_id", tran_id);
      return NextResponse.redirect(`${siteUrl}/checkout?status=error`);
    }

    if (pending.status === "completed") {
      return NextResponse.redirect(`${siteUrl}/checkout/success?tran_id=${tran_id}`);
    }

    let items = [];
    try {
      items = typeof pending.items === "string" ? JSON.parse(pending.items) : pending.items;
    } catch {
      items = [];
    }

    // অর্ডার সেভ করা
    const { error: orderError } = await supabaseAdmin.from("orders").insert([
      {
        theme_slug: items[0]?.slug ?? "",
        theme_title: items.map((i) => i.title).join(", "),
        price: Number(amount || pending.amount),
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