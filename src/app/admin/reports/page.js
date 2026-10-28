// src/app/admin/reports/page.js
"use client";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
const supabase = createClient();
import Link from "next/link";
import { FaArrowLeft, FaFilePdf, FaSpinner, FaCalendarAlt } from "react-icons/fa";

export default function AdminReportsPage() {
  const [date, setDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [reportData, setReportData] = useState(null);

  const generateReport = async () => {
    if (!date) return alert("Please select a date first.");
    setLoading(true);
    setReportData(null);

    // নির্দিষ্ট দিনের অর্ডারগুলো আনা (start of day থেকে end of day)
    const startOfDay = `${date}T00:00:00.000Z`;
    const endOfDay = `${date}T23:59:59.999Z`;

    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .eq("status", "approved")
      .gte("created_at", startOfDay)
      .lte("created_at", endOfDay);

    if (error) {
      alert("Failed to fetch report data");
    } else {
      const totalAmount = data.reduce((sum, order) => sum + Number(order.price), 0);
      setReportData({ orders: data, totalAmount, date });
    }
    setLoading(false);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-[#09090B] pt-10 pb-20 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Link href="/admin" className="inline-flex items-center gap-2 text-brand-muted hover:text-brand-gold mb-4 text-sm font-medium">
            <FaArrowLeft /> Back to Dashboard
          </Link>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white flex items-center gap-3">
            <FaFilePdf className="text-brand-gold" /> Generate Reports
          </h1>
          <p className="text-brand-muted text-sm mt-2">Select a date to generate a PDF report for that specific day.</p>
        </div>

        <div className="bg-[#121214] border border-white/10 rounded-3xl p-6 md:p-8 mb-8 shadow-2xl print:hidden">
          <div className="flex flex-col md:flex-row items-end gap-4">
            <div className="flex-1 w-full">
              <label className="block text-sm text-brand-muted mb-2">Select Date</label>
              <div className="relative">
                <FaCalendarAlt className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-muted" />
                <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-full bg-[#09090B] border border-white/10 rounded-xl pl-11 pr-4 py-3 text-white text-sm outline-none focus:border-brand-gold" />
              </div>
            </div>
            <button onClick={generateReport} disabled={loading} className="w-full md:w-auto bg-brand-gold hover:bg-brand-gold-hover text-black font-bold px-8 py-3 rounded-xl flex items-center justify-center gap-2">
              {loading ? <FaSpinner className="animate-spin" /> : "Generate Report"}
            </button>
          </div>
        </div>

        {/* Report Output Area (This part gets printed) */}
        {reportData && (
          <div className="bg-white text-black rounded-3xl p-8 print:shadow-none print:p-0 print:m-0">
            <div className="text-center border-b border-gray-200 pb-6 mb-6">
              <h2 className="text-3xl font-extrabold">Sales Report</h2>
              <p className="text-gray-500 mt-1">Date: {new Date(reportData.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
              <p className="text-gray-500 text-sm mt-1">Generated on: {new Date().toLocaleString()}</p>
            </div>

            <div className="flex justify-between items-center mb-6 bg-gray-50 p-4 rounded-xl border border-gray-100">
              <div>
                <p className="text-gray-500 text-sm">Total Orders</p>
                <p className="text-2xl font-bold">{reportData.orders.length}</p>
              </div>
              <div className="text-right">
                <p className="text-gray-500 text-sm">Total Revenue</p>
                <p className="text-2xl font-bold text-green-600">৳{reportData.totalAmount.toFixed(2)}</p>
              </div>
            </div>

            {reportData.orders.length === 0 ? (
              <p className="text-center text-gray-500 py-10">No orders were placed on this date.</p>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-300">
                    <th className="py-2 text-sm font-bold">Tran. ID</th>
                    <th className="py-2 text-sm font-bold">Theme</th>
                    <th className="py-2 text-sm font-bold">Customer</th>
                    <th className="py-2 text-sm font-bold text-right">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {reportData.orders.map((order) => (
                    <tr key={order.id} className="border-b border-gray-100 text-sm">
                      <td className="py-2 font-mono text-xs">{order.transaction_id}</td>
                      <td className="py-2">{order.theme_title}</td>
                      <td className="py-2">{order.customer_email}</td>
                      <td className="py-2 text-right font-bold">৳{order.price}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            <div className="mt-8 text-center print:hidden">
              <button onClick={handlePrint} className="bg-gray-900 hover:bg-black text-white font-bold px-8 py-3 rounded-xl flex items-center justify-center gap-2 mx-auto">
                <FaFilePdf /> Save as PDF / Print
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}