"use client";

import { useState, useEffect } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Link from 'next/link';
import { useStore } from '@/context/StoreContext';
import { useAlert } from '@/context/AlertContext';
import { sendApprovalEmail } from '@/lib/emailjs';
import { 
  FaArrowLeft, FaSync, FaCheck, FaTimes, FaUser, FaEnvelope, 
  FaPhone, FaMobileAlt, FaHashtag, FaClock, FaBoxOpen, FaTrash 
} from 'react-icons/fa';

export default function AdminOrdersPage() {
  const { getAllOrders, updateOrderStatus, deleteOrder } = useStore();
  const { showAlert, showConfirm } = useAlert();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [processingId, setProcessingId] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    const result = await getAllOrders();
    if (result.success) setOrders(result.orders);
    setLoading(false);
  };

  const handleApprove = async (id) => {
    const order = orders.find(o => o.id === id);
    if (!order) return;

    setProcessingId(id);
    const result = await updateOrderStatus(id, 'approved');
    
    if (result.success) {
      const emailResult = await sendApprovalEmail({
        customer_name: order.customer_name,
        customer_email: order.customer_email,
        theme_title: order.theme_title,
        theme_price: order.price,
        transaction_id: order.transaction_id,
        order_id: order.id,
      });

      if (emailResult.success) {
        showAlert(
          'Order Approved!',
          `Confirmation email sent to ${order.customer_email}`,
          'success'
        );
      } else {
        showAlert(
          'Order Approved, But Email Failed',
          emailResult.error || 'Please check EmailJS settings.',
          'warning'
        );
      }
      fetchOrders();
    } else {
      showAlert('Failed to Approve', 'Please try again.', 'error');
    }
    setProcessingId(null);
  };

  const handleReject = (id) => {
    showConfirm({
      title: 'Reject this Order?',
      message: 'The customer will not receive the theme. This action can be changed later.',
      confirmText: 'Yes, Reject',
      cancelText: 'Cancel',
      onConfirm: async () => {
        setProcessingId(id);
        await updateOrderStatus(id, 'rejected');
        fetchOrders();
        setProcessingId(null);
        showAlert('Order Rejected', 'The order has been marked as rejected.', 'success');
      }
    });
  };

  const handleDelete = (order) => {
    showConfirm({
      title: 'Delete this Order Permanently?',
      message: `Order #${order.id} (${order.theme_title}) will be permanently deleted. This cannot be undone.`,
      confirmText: 'Yes, Delete',
      cancelText: 'Cancel',
      onConfirm: async () => {
        setProcessingId(order.id);
        const result = await deleteOrder(order.id);
        if (result.success) {
          setOrders(prev => prev.filter(o => o.id !== order.id));
          showAlert('Order Deleted', 'The order has been permanently removed.', 'success');
        } else {
          showAlert('Delete Failed', result.error || 'Something went wrong.', 'error');
        }
        setProcessingId(null);
      }
    });
  };

  const filteredOrders = filter === 'all' ? orders : orders.filter(o => o.status === filter);

  const stats = {
    total: orders.length,
    pending: orders.filter(o => o.status === 'pending').length,
    approved: orders.filter(o => o.status === 'approved').length,
    rejected: orders.filter(o => o.status === 'rejected').length,
  };

  return (
    <main className="min-h-screen bg-gray-950 text-white font-sans flex flex-col">
      <Navbar />
      <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto w-full flex-grow">

        <Link href="/admin" className="inline-flex items-center gap-2 text-gray-400 hover:text-cyan-400 transition mb-8">
          <FaArrowLeft /> Back to Dashboard
        </Link>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold">Manage Orders</h1>
            <p className="text-gray-400 text-sm mt-1">{stats.total} total orders</p>
          </div>
          <button onClick={fetchOrders} className="bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-lg font-semibold transition flex items-center gap-2 text-sm">
            <FaSync /> Refresh
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          <button onClick={() => setFilter('all')} className={`rounded-2xl p-4 text-center transition border ${filter === 'all' ? 'bg-cyan-500/10 border-cyan-500/40' : 'bg-gray-900 border-gray-800'}`}>
            <p className="text-gray-400 text-xs mb-1">All</p>
            <p className="text-2xl font-bold text-white">{stats.total}</p>
          </button>
          <button onClick={() => setFilter('pending')} className={`rounded-2xl p-4 text-center transition border ${filter === 'pending' ? 'bg-yellow-500/10 border-yellow-500/40' : 'bg-gray-900 border-gray-800'}`}>
            <p className="text-yellow-400 text-xs mb-1">Pending</p>
            <p className="text-2xl font-bold text-yellow-400">{stats.pending}</p>
          </button>
          <button onClick={() => setFilter('approved')} className={`rounded-2xl p-4 text-center transition border ${filter === 'approved' ? 'bg-green-500/10 border-green-500/40' : 'bg-gray-900 border-gray-800'}`}>
            <p className="text-green-400 text-xs mb-1">Approved</p>
            <p className="text-2xl font-bold text-green-400">{stats.approved}</p>
          </button>
          <button onClick={() => setFilter('rejected')} className={`rounded-2xl p-4 text-center transition border ${filter === 'rejected' ? 'bg-red-500/10 border-red-500/40' : 'bg-gray-900 border-gray-800'}`}>
            <p className="text-red-400 text-xs mb-1">Rejected</p>
            <p className="text-2xl font-bold text-red-400">{stats.rejected}</p>
          </button>
        </div>

        {loading ? (
          <div className="text-center py-20">
            <div className="w-10 h-10 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="text-center py-20 bg-gray-900 border border-gray-800 rounded-3xl">
            <FaBoxOpen className="text-5xl text-gray-700 mx-auto mb-4" />
            <p className="text-gray-400">No orders found.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <div key={order.id} className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
                <div className="flex flex-col md:flex-row justify-between gap-4 mb-4 pb-4 border-b border-gray-800">
                  <div>
                    <h3 className="text-lg font-bold text-white mb-1">{order.theme_title}</h3>
                    <p className="text-xs text-gray-500">Order ID: #{order.id}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                      order.status === 'approved' ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
                      order.status === 'rejected' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                      'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                    }`}>
                      {order.status.toUpperCase()}
                    </span>
                    <button 
                      onClick={() => handleDelete(order)}
                      disabled={processingId === order.id}
                      className="bg-red-600/20 hover:bg-red-600/40 disabled:bg-gray-700 text-red-400 p-2 rounded-lg transition"
                      title="Delete Order"
                    >
                      <FaTrash size={12} />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm mb-4">
                  <div className="flex items-center gap-2 text-gray-300">
                    <FaUser className="text-cyan-400" /> <span className="text-gray-500">Name:</span> {order.customer_name || 'N/A'}
                  </div>
                  <div className="flex items-center gap-2 text-gray-300 truncate">
                    <FaEnvelope className="text-cyan-400" /> <span className="text-gray-500">Email:</span> {order.customer_email || 'N/A'}
                  </div>
                  <div className="flex items-center gap-2 text-gray-300">
                    <FaPhone className="text-cyan-400" /> <span className="text-gray-500">Phone:</span> {order.customer_phone || 'N/A'}
                  </div>
                  <div className="flex items-center gap-2 text-gray-300">
                    <FaMobileAlt className="text-cyan-400" /> <span className="text-gray-500">Sender:</span> {order.bkash_number || 'N/A'}
                  </div>
                  <div className="flex items-center gap-2 text-yellow-300 font-bold">
                    <FaHashtag className="text-yellow-400" /> TrxID: {order.transaction_id}
                  </div>
                  <div className="flex items-center gap-2 text-gray-500 text-xs">
                    <FaClock /> {new Date(order.created_at).toLocaleString('en-US')}
                  </div>
                </div>

                {order.status === 'pending' && (
                  <div className="flex gap-3 pt-4 border-t border-gray-800">
                    <button 
                      onClick={() => handleApprove(order.id)}
                      disabled={processingId === order.id}
                      className="flex-1 bg-green-500 hover:bg-green-600 disabled:bg-gray-700 text-white font-bold py-2.5 rounded-lg transition flex items-center justify-center gap-2 text-sm"
                    >
                      {processingId === order.id ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Processing...
                        </>
                      ) : (
                        <>
                          <FaCheck /> Approve & Send Email
                        </>
                      )}
                    </button>
                    <button 
                      onClick={() => handleReject(order.id)}
                      disabled={processingId === order.id}
                      className="flex-1 bg-red-500/80 hover:bg-red-600 disabled:bg-gray-700 text-white font-bold py-2.5 rounded-lg transition flex items-center justify-center gap-2 text-sm"
                    >
                      <FaTimes /> Reject
                    </button>
                  </div>
                )}

                {order.status !== 'pending' && (
                  <div className="flex justify-end pt-4 border-t border-gray-800">
                    <button 
                      onClick={() => handleDelete(order)}
                      disabled={processingId === order.id}
                      className="bg-red-600/20 hover:bg-red-600/40 text-red-400 px-4 py-2 rounded-lg font-semibold text-xs flex items-center gap-2 transition"
                    >
                      <FaTrash size={10} /> Delete Order
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

      </div>
      <Footer />
    </main>
  );
}