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

    if (req.method === "POST") {
      try {
        formData = await req.formData();
        status = formData.get("status");
        tran_id = formData.get("tran_id") || urlTranId;
        amount = formData.get("amount");
        cusName = formData.get("cus_name");
        cusEmail = formData.get("cus_email");
        cusPhone = formData.get("cus_phone");
      } catch (e) {}
    }

    if (!status) status = url.searchParams.get("status");
    if (!tran_id) tran_id = url.searchParams.get("tran_id");
    if (!amount) amount = url.searchParams.get("amount");
    if (!cusName) cusName = url.searchParams.get("cus_name");
    if (!cusEmail) cusEmail = url.searchParams.get("cus_email");
    if (!cusPhone) cusPhone = url.searchParams.get("cus_phone");

    const isValid = status === "VALID" || status === "VALIDATED";

    if (!tran_id) {
      console.error("Missing tran_id");
      return NextResponse.redirect(`${siteUrl}/checkout?status=error`);
    }

    if (isValid) {
      const { data: pending, error: pendingError } = await supabaseAdmin
        .from("pending_orders")
        .select("*")
        .eq("tran_id", tran_id)
        .single();

      if (pendingError || !pending) {
        console.error("Pending order not found:", pendingError);
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

      const { error: orderError } = await supabaseAdmin.from("orders").insert([
        {
          theme_slug: items[0]?.slug ?? "",
          theme_title: items.map((i) => i.title).join(", "),
          price: Number(amount || pending.amount),
          customer_name: cusName || pending.customer_name,
          customer_email: cusEmail || pending.customer_email,
          customer_phone: cusPhone || pending.customer_phone,
          transaction_id: tran_id,
          user_id: pending.user_id, // ইউজার আইডি মূল অর্ডারে যাচ্ছে
          status: "approved",
        },
      ]);

      if (orderError) {
        console.error("DB Error:", orderError);
        return NextResponse.redirect(`${siteUrl}/checkout?status=error`);
      }

      await supabaseAdmin.from("pending_orders").update({ status: "completed" }).eq("tran_id", tran_id);

      return NextResponse.redirect(`${siteUrl}/checkout/success?tran_id=${tran_id}`);
    }

    await supabaseAdmin.from("pending_orders").update({ status: "failed" }).eq("tran_id", tran_id);
    return NextResponse.redirect(`${siteUrl}/checkout?status=fail`);
  } catch (error) {
    console.error("Success Handler Error:", error);
    return NextResponse.redirect(`${siteUrl}/checkout?status=error`);
  }
}

export async function GET(req) {
  return POST(req);
}