"use client";

import { useState, useEffect } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { useStore } from '@/context/StoreContext';
import { useAlert } from '@/context/AlertContext';
import { sendApprovalEmail } from '@/lib/emailjs';
import { 
  FaLock, FaLayerGroup, FaShoppingCart, FaStar, FaSync, FaCheck, FaTimes,
  FaUser, FaEnvelope, FaPhone, FaMobileAlt, FaHashtag, FaClock, FaBoxOpen,
  FaComments, FaChartLine, FaPlus, FaEdit, FaTrash, FaUpload, FaSearch,
  FaUserCircle, FaHome
} from 'react-icons/fa';

export default function AdminPage() {
  const { 
    themes, isLoadingThemes, createTheme, updateTheme, deleteTheme, fetchThemes, uploadImage,
    getAllOrders, updateOrderStatus, deleteOrder,
    getAllReviews, deleteReview
  } = useStore();
  const { showAlert, showConfirm } = useAlert();

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [orders, setOrders] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [processingId, setProcessingId] = useState(null);

  // Theme form states
  const [showThemeForm, setShowThemeForm] = useState(false);
  const [editingThemeId, setEditingThemeId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const emptyForm = {
    title: '', slug: '', category: 'Next.js/React', price: '', image: '',
    tags: '', description: '', features: '', demo_url: '#', buy_url: '#',
    technologies: '', included_files: '', requirements: '',
    version: '1.0.0', last_updated: '', pages_included: '5'
  };
  const [form, setForm] = useState(emptyForm);

  // Order filter & review search
  const [orderFilter, setOrderFilter] = useState('all');
  const [reviewSearch, setReviewSearch] = useState('');

  // Session check
  useEffect(() => {
    const adminSession = localStorage.getItem('nurislam_admin');
    if (adminSession) setIsAuthenticated(true);
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchThemes();
      fetchAllData();
    }
  }, [isAuthenticated]);

  const fetchAllData = async () => {
    setLoading(true);
    const ordersResult = await getAllOrders();
    if (ordersResult.success) setOrders(ordersResult.orders);
    const reviewsResult = await getAllReviews();
    if (reviewsResult.success) setReviews(reviewsResult.reviews);
    setLoading(false);
  };

  const handleLogin = (e) => {
    e.preventDefault();
    const adminPass = process.env.NEXT_PUBLIC_ADMIN_PASSWORD;
    if (password === adminPass) {
      setIsAuthenticated(true);
      localStorage.setItem('nurislam_admin', 'true');
      setLoginError('');
    } else {
      setLoginError('Incorrect password!');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('nurislam_admin');
    setPassword('');
  };

  // ============== THEME HANDLERS ==============
  const generateSlug = (title) => title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => {
      const updated = { ...prev, [name]: value };
      if (name === 'title' && !editingThemeId) updated.slug = generateSlug(value);
      return updated;
    });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      showAlert('File Too Large', 'Maximum file size is 5MB', 'error'); return;
    }
    if (!file.type.startsWith('image/')) {
      showAlert('Invalid File', 'Please upload an image (JPG, PNG)', 'error'); return;
    }
    setIsUploading(true);
    const result = await uploadImage(file);
    setIsUploading(false);
    if (result.success) setForm(prev => ({ ...prev, image: result.url }));
    else showAlert('Upload Failed', result.error || 'Error', 'error');
  };

  const handleThemeSubmit = async (e) => {
    e.preventDefault();
    if (!form.image) {
      showAlert('Missing Image', 'Please upload a thumbnail', 'warning'); return;
    }
    setIsSubmitting(true);
    const themeData = {
      title: form.title.trim(),
      slug: form.slug.trim(),
      category: form.category,
      price: parseFloat(form.price),
      image: form.image,
      description: form.description.trim(),
      demo_url: form.demo_url.trim() || '#',
      buy_url: form.buy_url.trim() || '#',
      tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
      features: form.features.split('\n').map(f => f.trim()).filter(Boolean),
      technologies: form.technologies.split(',').map(t => t.trim()).filter(Boolean),
      included_files: form.included_files.split('\n').map(f => f.trim()).filter(Boolean),
      requirements: form.requirements.split('\n').map(r => r.trim()).filter(Boolean),
      version: form.version.trim() || '1.0.0',
      last_updated: form.last_updated.trim() || new Date().toISOString().split('T')[0],
      pages_included: parseInt(form.pages_included) || 5,
    };
    const result = editingThemeId ? await updateTheme(editingThemeId, themeData) : await createTheme(themeData);
    setIsSubmitting(false);
    if (result.success) {
      showAlert(
        editingThemeId ? 'Theme Updated!' : 'Theme Created!',
        `"${themeData.title}" has been ${editingThemeId ? 'updated' : 'added'}.`,
        'success'
      );
      setForm(emptyForm); setEditingThemeId(null); setShowThemeForm(false);
      fetchThemes();
    } else {
      showAlert('Error', result.error || 'Error', 'error');
    }
  };

  const handleThemeEdit = (theme) => {
    setForm({
      title: theme.title || '', slug: theme.slug || '', category: theme.category || 'Next.js/React',
      price: theme.price || '', image: theme.image || '',
      tags: (theme.tags || []).join(', '),
      description: theme.description || '',
      features: (theme.features || []).join('\n'),
      demo_url: theme.demo_url || '#', buy_url: theme.buy_url || '#',
      technologies: (theme.technologies || []).join(', '),
      included_files: (theme.included_files || []).join('\n'),
      requirements: (theme.requirements || []).join('\n'),
      version: theme.version || '1.0.0',
      last_updated: theme.last_updated || '',
      pages_included: theme.pages_included || '5',
    });
    setEditingThemeId(theme.id);
    setShowThemeForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleThemeDelete = (theme) => {
    showConfirm({
      title: 'Delete this Theme?',
      message: `"${theme.title}" will be permanently deleted. This cannot be undone.`,
      confirmText: 'Yes, Delete',
      cancelText: 'Cancel',
      onConfirm: async () => {
        const result = await deleteTheme(theme.id);
        if (result.success) {
          showAlert('Theme Deleted', `"${theme.title}" has been removed.`, 'success');
        } else {
          showAlert('Failed', result.error || 'Error', 'error');
        }
      }
    });
  };

  const handleThemeCancel = () => {
    setForm(emptyForm); setEditingThemeId(null); setShowThemeForm(false);
  };

  // ============== ORDER HANDLERS ==============
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
        showAlert('Order Approved!', `Confirmation email sent to ${order.customer_email}`, 'success');
      } else {
        showAlert('Order Approved, But Email Failed', emailResult.error || 'Check EmailJS', 'warning');
      }
      fetchAllData();
    } else {
      showAlert('Failed', 'Could not approve.', 'error');
    }
    setProcessingId(null);
  };

  const handleReject = (id) => {
    showConfirm({
      title: 'Reject this Order?',
      message: 'The customer will not receive the theme.',
      confirmText: 'Yes, Reject',
      cancelText: 'Cancel',
      onConfirm: async () => {
        setProcessingId(id);
        await updateOrderStatus(id, 'rejected');
        fetchAllData();
        setProcessingId(null);
        showAlert('Order Rejected', 'Order marked as rejected.', 'success');
      }
    });
  };

  const handleOrderDelete = (order) => {
    showConfirm({
      title: 'Delete this Order?',
      message: `Order #${order.id} (${order.theme_title}) will be permanently deleted.`,
      confirmText: 'Yes, Delete',
      cancelText: 'Cancel',
      onConfirm: async () => {
        setProcessingId(order.id);
        const result = await deleteOrder(order.id);
        if (result.success) {
          setOrders(prev => prev.filter(o => o.id !== order.id));
          showAlert('Order Deleted', 'Order removed successfully.', 'success');
        } else {
          showAlert('Failed', result.error || 'Error', 'error');
        }
        setProcessingId(null);
      }
    });
  };

  // ============== REVIEW HANDLERS ==============
  const handleReviewDelete = (review) => {
    showConfirm({
      title: 'Delete this Review?',
      message: `Review by "${review.name}" will be permanently deleted.`,
      confirmText: 'Yes, Delete',
      cancelText: 'Cancel',
      onConfirm: async () => {
        const result = await deleteReview(review.id, review.theme_slug);
        if (result.success) {
          setReviews(prev => prev.filter(r => r.id !== review.id));
          showAlert('Review Deleted', 'Review removed successfully.', 'success');
        } else {
          showAlert('Failed', 'Could not delete review.', 'error');
        }
      }
    });
  };

  // ============== COMPUTED ==============
  const totalThemes = themes.length;
  const pendingOrders = orders.filter(o => o.status === 'pending').length;
  const approvedOrders = orders.filter(o => o.status === 'approved').length;
  const rejectedOrders = orders.filter(o => o.status === 'rejected').length;
  const totalReviews = reviews.length;
  const avgRating = reviews.length > 0 
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1) 
    : '0.0';

  const filteredOrders = orderFilter === 'all' ? orders : orders.filter(o => o.status === orderFilter);
  const filteredReviews = reviews.filter(r =>
    r.name?.toLowerCase().includes(reviewSearch.toLowerCase()) ||
    r.theme_slug?.toLowerCase().includes(reviewSearch.toLowerCase()) ||
    r.comment?.toLowerCase().includes(reviewSearch.toLowerCase())
  );

  const inputClass = "w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 outline-none focus:border-cyan-500 text-white text-sm";
  const labelClass = "block text-xs text-gray-400 mb-2";

  // ============== LOGIN SCREEN ==============
  if (!isAuthenticated) {
    return (
      <main className="min-h-screen bg-gray-950 text-white font-sans flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center px-6 pt-20">
          <div className="bg-gray-900 border border-gray-800 rounded-3xl p-8 w-full max-w-md shadow-2xl">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-cyan-500/10 text-cyan-400 rounded-full flex items-center justify-center text-3xl mx-auto mb-4">
                <FaLock />
              </div>
              <h1 className="text-2xl font-bold mb-1">Themes Store</h1>
              <p className="text-cyan-400 text-xs font-semibold mb-3 tracking-widest">ADMIN PANEL</p>
              <p className="text-gray-400 text-sm">Enter password to access dashboard</p>
            </div>
            {loginError && (
              <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-xl mb-4 text-sm text-center">
                {loginError}
              </div>
            )}
            <form onSubmit={handleLogin} className="space-y-4">
              <input 
                type="password" 
                placeholder="Admin Password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className={inputClass}
              />
              <button type="submit" className="w-full bg-cyan-600 hover:bg-cyan-700 font-bold py-3 rounded-xl transition">
                Login
              </button>
            </form>
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  // ============== DASHBOARD ==============
  return (
    <main className="min-h-screen bg-gray-950 text-white font-sans flex flex-col">
      <Navbar />
      
      <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto w-full flex-grow">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold text-cyan-400 tracking-widest">THEMES STORE</span>
              <span className="text-gray-600">•</span>
              <span className="text-xs font-bold text-gray-500 tracking-widest">ADMIN</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-1">Admin Panel</h1>
            <p className="text-gray-400 text-sm">Manage everything from one place</p>
          </div>
          <div className="flex gap-3">
            <button onClick={() => { fetchThemes(); fetchAllData(); }} className="bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-lg font-semibold transition flex items-center gap-2 text-sm">
              <FaSync /> Refresh
            </button>
            <button onClick={handleLogout} className="bg-red-500/20 hover:bg-red-500/30 text-red-400 px-4 py-2 rounded-lg font-semibold transition text-sm">
              Logout
            </button>
          </div>
        </div>

        {/* TABS */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2 -mx-1 px-1">
          {[
            { id: 'dashboard', name: 'Dashboard', icon: <FaHome /> },
            { id: 'themes', name: 'Themes', icon: <FaLayerGroup />, badge: totalThemes },
            { id: 'orders', name: 'Orders', icon: <FaShoppingCart />, badge: pendingOrders, badgeColor: 'yellow' },
            { id: 'reviews', name: 'Reviews', icon: <FaComments />, badge: totalReviews },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-sm whitespace-nowrap transition-all border ${
                activeTab === tab.id 
                  ? 'bg-cyan-600 text-white border-cyan-600 shadow-[0_0_15px_rgba(8,145,178,0.4)]' 
                  : 'bg-gray-900 text-gray-400 border-gray-800 hover:border-cyan-500 hover:text-white'
              }`}
            >
              {tab.icon} {tab.name}
              {tab.badge !== undefined && tab.badge > 0 && (
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  tab.badgeColor === 'yellow' ? 'bg-yellow-500 text-black' : 'bg-gray-700 text-white'
                }`}>
                  {tab.badge}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* ==================== DASHBOARD TAB ==================== */}
        {activeTab === 'dashboard' && (
          <div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-gradient-to-br from-cyan-500/10 to-cyan-600/5 border border-cyan-500/20 rounded-2xl p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 bg-cyan-500/20 text-cyan-400 rounded-xl flex items-center justify-center"><FaLayerGroup /></div>
                  <FaChartLine className="text-cyan-500/40" />
                </div>
                <p className="text-gray-400 text-xs mb-1">Total Themes</p>
                <p className="text-3xl font-bold text-white">{totalThemes}</p>
              </div>
              <div className="bg-gradient-to-br from-yellow-500/10 to-yellow-600/5 border border-yellow-500/20 rounded-2xl p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 bg-yellow-500/20 text-yellow-400 rounded-xl flex items-center justify-center"><FaClock /></div>
                  <FaChartLine className="text-yellow-500/40" />
                </div>
                <p className="text-gray-400 text-xs mb-1">Pending Orders</p>
                <p className="text-3xl font-bold text-yellow-400">{pendingOrders}</p>
              </div>
              <div className="bg-gradient-to-br from-green-500/10 to-green-600/5 border border-green-500/20 rounded-2xl p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 bg-green-500/20 text-green-400 rounded-xl flex items-center justify-center"><FaCheck /></div>
                  <FaChartLine className="text-green-500/40" />
                </div>
                <p className="text-gray-400 text-xs mb-1">Approved</p>
                <p className="text-3xl font-bold text-green-400">{approvedOrders}</p>
              </div>
              <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 border border-purple-500/20 rounded-2xl p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 bg-purple-500/20 text-purple-400 rounded-xl flex items-center justify-center"><FaStar /></div>
                  <FaChartLine className="text-purple-500/40" />
                </div>
                <p className="text-gray-400 text-xs mb-1">Reviews</p>
                <p className="text-3xl font-bold text-purple-400">{totalReviews}</p>
              </div>
            </div>

            <div className="bg-gray-900 border border-gray-800 rounded-3xl p-6 mb-6">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-xl font-bold">Recent Orders</h2>
                <button onClick={() => setActiveTab('orders')} className="text-cyan-400 text-sm hover:underline">
                  View All →
                </button>
              </div>
              {loading ? (
                <div className="text-center py-8"><div className="w-8 h-8 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto"></div></div>
              ) : orders.slice(0, 3).length === 0 ? (
                <div className="text-center py-8"><FaBoxOpen className="text-3xl text-gray-700 mx-auto mb-2" /><p className="text-gray-500 text-sm">No orders yet</p></div>
              ) : (
                <div className="space-y-3">
                  {orders.slice(0, 3).map((order) => (
                    <div key={order.id} className="bg-gray-950 border border-gray-800 rounded-xl p-4 flex flex-col md:flex-row justify-between gap-3 items-start md:items-center">
                      <div>
                        <h4 className="font-bold text-white text-sm">{order.theme_title}</h4>
                        <p className="text-xs text-gray-500">#{order.id} • {order.customer_name || 'N/A'} • TrxID: {order.transaction_id}</p>
                      </div>
                      <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                        order.status === 'approved' ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
                        order.status === 'rejected' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                        'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                      }`}>
                        {order.status.toUpperCase()}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-gray-900 border border-gray-800 rounded-3xl p-6">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-xl font-bold">Recent Reviews</h2>
                <button onClick={() => setActiveTab('reviews')} className="text-cyan-400 text-sm hover:underline">
                  View All →
                </button>
              </div>
              {reviews.slice(0, 3).length === 0 ? (
                <div className="text-center py-8"><FaStar className="text-3xl text-gray-700 mx-auto mb-2" /><p className="text-gray-500 text-sm">No reviews yet</p></div>
              ) : (
                <div className="space-y-3">
                  {reviews.slice(0, 3).map((review) => (
                    <div key={review.id} className="bg-gray-950 border border-gray-800 rounded-xl p-4">
                      <div className="flex text-yellow-400 text-xs mb-2">
                        {[1,2,3,4,5].map(s => <FaStar key={s} className={s <= review.rating ? 'text-yellow-400' : 'text-gray-700'} />)}
                      </div>
                      <p className="text-xs text-white font-semibold mb-1">{review.name}</p>
                      <p className="text-xs text-gray-400 line-clamp-2">{review.comment}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ==================== THEMES TAB ==================== */}
        {activeTab === 'themes' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-2xl font-bold">Manage Themes</h2>
                <p className="text-gray-400 text-sm">{totalThemes} themes in store</p>
              </div>
              <button 
                onClick={() => showThemeForm ? handleThemeCancel() : setShowThemeForm(true)}
                className="bg-cyan-600 hover:bg-cyan-700 px-5 py-3 rounded-xl font-bold transition flex items-center gap-2 text-sm"
              >
                {showThemeForm ? <><FaTimes /> Cancel</> : <><FaPlus /> Add Theme</>}
              </button>
            </div>

            {showThemeForm && (
              <div className="bg-gray-900 border border-gray-800 rounded-3xl p-6 mb-8">
                <h3 className="text-lg font-bold mb-6">{editingThemeId ? 'Edit Theme' : 'Add New Theme'}</h3>
                <form onSubmit={handleThemeSubmit} className="space-y-5">

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div><label className={labelClass}>Title *</label><input type="text" name="title" value={form.title} onChange={handleFormChange} required placeholder="Theme name" className={inputClass} /></div>
                    <div><label className={labelClass}>Slug *</label><input type="text" name="slug" value={form.slug} onChange={handleFormChange} required placeholder="theme-slug" className={inputClass} /></div>
                    <div><label className={labelClass}>Category *</label>
                      <select name="category" value={form.category} onChange={handleFormChange} className={inputClass}>
                        <option>Next.js/React</option><option>WordPress</option><option>HTML/CSS/JS</option>
                      </select>
                    </div>
                    <div><label className={labelClass}>Price USD *</label><input type="number" name="price" value={form.price} onChange={handleFormChange} required step="0.01" placeholder="49" className={inputClass} /></div>
                  </div>

                  <div>
                    <label className={labelClass}>Thumbnail *</label>
                    <div className="bg-gray-800 border-2 border-dashed border-gray-700 rounded-xl p-4">
                      {form.image ? (
                        <div className="flex flex-col items-center gap-3">
                          <img src={form.image} alt="Preview" className="w-32 h-20 object-cover rounded-lg border border-gray-700" />
                          <div className="flex gap-2">
                            <label htmlFor="imageUpload" className="bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 px-4 py-1.5 rounded-lg font-semibold text-xs cursor-pointer">Change</label>
                            <button type="button" onClick={() => setForm({ ...form, image: '' })} className="bg-red-600/20 text-red-400 px-4 py-1.5 rounded-lg font-semibold text-xs">Remove</button>
                          </div>
                        </div>
                      ) : (
                        <label htmlFor="imageUpload" className="cursor-pointer flex flex-col items-center gap-2 py-6">
                          {isUploading ? (
                            <div className="w-8 h-8 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
                          ) : (
                            <><FaUpload className="text-2xl text-cyan-400" /><p className="text-xs text-gray-400">Click to upload</p></>
                          )}
                        </label>
                      )}
                      <input id="imageUpload" type="file" accept="image/*" onChange={handleImageUpload} className="hidden" disabled={isUploading} />
                    </div>
                  </div>

                  <div><label className={labelClass}>Description</label><textarea name="description" value={form.description} onChange={handleFormChange} rows="2" className={inputClass} /></div>
                  <div><label className={labelClass}>Tags (comma separated)</label><input type="text" name="tags" value={form.tags} onChange={handleFormChange} placeholder="Next.js, Tailwind" className={inputClass} /></div>
                  <div><label className={labelClass}>Technologies (comma separated)</label><input type="text" name="technologies" value={form.technologies} onChange={handleFormChange} placeholder="Next.js 14, React, Tailwind, Supabase" className={inputClass} /></div>
                  <div><label className={labelClass}>Features (one per line)</label><textarea name="features" value={form.features} onChange={handleFormChange} rows="3" className={inputClass} /></div>
                  <div><label className={labelClass}>Included Files (one per line)</label><textarea name="included_files" value={form.included_files} onChange={handleFormChange} rows="3" className={inputClass} /></div>
                  <div><label className={labelClass}>Requirements (one per line)</label><textarea name="requirements" value={form.requirements} onChange={handleFormChange} rows="2" className={inputClass} /></div>

                  <div className="grid grid-cols-3 gap-4">
                    <div><label className={labelClass}>Version</label><input type="text" name="version" value={form.version} onChange={handleFormChange} className={inputClass} /></div>
                    <div><label className={labelClass}>Updated</label><input type="text" name="last_updated" value={form.last_updated} onChange={handleFormChange} placeholder="2025-01-15" className={inputClass} /></div>
                    <div><label className={labelClass}>Pages</label><input type="number" name="pages_included" value={form.pages_included} onChange={handleFormChange} className={inputClass} /></div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div><label className={labelClass}>Demo URL</label><input type="text" name="demo_url" value={form.demo_url} onChange={handleFormChange} className={inputClass} /></div>
                    <div><label className={labelClass}>Buy URL</label><input type="text" name="buy_url" value={form.buy_url} onChange={handleFormChange} className={inputClass} /></div>
                  </div>

                  <div className="flex gap-3 pt-4 border-t border-gray-800">
                    <button type="submit" disabled={isSubmitting || isUploading}
                      className="flex-1 bg-cyan-600 hover:bg-cyan-700 disabled:bg-gray-700 font-bold py-3 rounded-xl transition">
                      {isSubmitting ? 'Saving...' : editingThemeId ? 'Update' : 'Create'}
                    </button>
                    <button type="button" onClick={handleThemeCancel} className="px-6 bg-gray-800 hover:bg-gray-700 font-bold py-3 rounded-xl transition">Cancel</button>
                  </div>
                </form>
              </div>
            )}

            {isLoadingThemes ? (
              <div className="text-center py-20"><div className="w-10 h-10 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto"></div></div>
            ) : (
              <div className="space-y-3">
                {themes.map((theme) => (
                  <div key={theme.id} className="bg-gray-900 border border-gray-800 rounded-2xl p-4 flex flex-col md:flex-row gap-4 items-start md:items-center">
                    <img src={theme.image} alt={theme.title} className="w-full md:w-24 h-16 object-cover rounded-lg" />
                    <div className="flex-grow">
                      <p className="text-xs text-cyan-400 font-bold uppercase">{theme.category}</p>
                      <h3 className="font-bold text-white">{theme.title}</h3>
                      <p className="text-xs text-gray-400">${theme.price} • v{theme.version || '1.0.0'}</p>
                    </div>
                    <div className="flex gap-2 w-full md:w-auto">
                      <button onClick={() => handleThemeEdit(theme)} className="flex-1 md:flex-none bg-blue-600/20 text-blue-400 px-3 py-2 rounded-lg font-semibold text-xs flex items-center justify-center gap-1">
                        <FaEdit /> Edit
                      </button>
                      <button onClick={() => handleThemeDelete(theme)} className="flex-1 md:flex-none bg-red-600/20 text-red-400 px-3 py-2 rounded-lg font-semibold text-xs flex items-center justify-center gap-1">
                        <FaTrash /> Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ==================== ORDERS TAB ==================== */}
        {activeTab === 'orders' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-2xl font-bold">Manage Orders</h2>
                <p className="text-gray-400 text-sm">{orders.length} total orders</p>
              </div>
              <button onClick={fetchAllData} className="bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-lg font-semibold transition flex items-center gap-2 text-sm">
                <FaSync /> Refresh
              </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
              <button onClick={() => setOrderFilter('all')} className={`rounded-2xl p-3 text-center transition border ${orderFilter === 'all' ? 'bg-cyan-500/10 border-cyan-500/40' : 'bg-gray-900 border-gray-800'}`}>
                <p className="text-gray-400 text-xs">All</p><p className="text-xl font-bold text-white">{orders.length}</p>
              </button>
              <button onClick={() => setOrderFilter('pending')} className={`rounded-2xl p-3 text-center transition border ${orderFilter === 'pending' ? 'bg-yellow-500/10 border-yellow-500/40' : 'bg-gray-900 border-gray-800'}`}>
                <p className="text-yellow-400 text-xs">Pending</p><p className="text-xl font-bold text-yellow-400">{pendingOrders}</p>
              </button>
              <button onClick={() => setOrderFilter('approved')} className={`rounded-2xl p-3 text-center transition border ${orderFilter === 'approved' ? 'bg-green-500/10 border-green-500/40' : 'bg-gray-900 border-gray-800'}`}>
                <p className="text-green-400 text-xs">Approved</p><p className="text-xl font-bold text-green-400">{approvedOrders}</p>
              </button>
              <button onClick={() => setOrderFilter('rejected')} className={`rounded-2xl p-3 text-center transition border ${orderFilter === 'rejected' ? 'bg-red-500/10 border-red-500/40' : 'bg-gray-900 border-gray-800'}`}>
                <p className="text-red-400 text-xs">Rejected</p><p className="text-xl font-bold text-red-400">{rejectedOrders}</p>
              </button>
            </div>

            {loading ? (
              <div className="text-center py-20"><div className="w-10 h-10 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto"></div></div>
            ) : filteredOrders.length === 0 ? (
              <div className="text-center py-16 bg-gray-900 border border-gray-800 rounded-3xl">
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
                        }`}>{order.status.toUpperCase()}</span>
                        <button onClick={() => handleOrderDelete(order)} disabled={processingId === order.id}
                          className="bg-red-600/20 hover:bg-red-600/40 text-red-400 p-2 rounded-lg transition">
                          <FaTrash size={12} />
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm mb-4">
                      <div className="flex items-center gap-2 text-gray-300"><FaUser className="text-cyan-400" /> <span className="text-gray-500">Name:</span> {order.customer_name || 'N/A'}</div>
                      <div className="flex items-center gap-2 text-gray-300 truncate"><FaEnvelope className="text-cyan-400" /> <span className="text-gray-500">Email:</span> {order.customer_email || 'N/A'}</div>
                      <div className="flex items-center gap-2 text-gray-300"><FaPhone className="text-cyan-400" /> <span className="text-gray-500">Phone:</span> {order.customer_phone || 'N/A'}</div>
                      <div className="flex items-center gap-2 text-gray-300"><FaMobileAlt className="text-cyan-400" /> <span className="text-gray-500">Sender:</span> {order.bkash_number || 'N/A'}</div>
                      <div className="flex items-center gap-2 text-yellow-300 font-bold"><FaHashtag className="text-yellow-400" /> TrxID: {order.transaction_id}</div>
                      <div className="flex items-center gap-2 text-gray-500 text-xs"><FaClock /> {new Date(order.created_at).toLocaleString('en-US')}</div>
                    </div>

                    {order.status === 'pending' ? (
                      <div className="flex gap-3 pt-4 border-t border-gray-800">
                        <button onClick={() => handleApprove(order.id)} disabled={processingId === order.id}
                          className="flex-1 bg-green-500 hover:bg-green-600 disabled:bg-gray-700 text-white font-bold py-2.5 rounded-lg transition flex items-center justify-center gap-2 text-sm">
                          {processingId === order.id ? (
                            <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> Processing...</>
                          ) : (
                            <><FaCheck /> Approve & Send Email</>
                          )}
                        </button>
                        <button onClick={() => handleReject(order.id)} disabled={processingId === order.id}
                          className="flex-1 bg-red-500/80 hover:bg-red-600 disabled:bg-gray-700 text-white font-bold py-2.5 rounded-lg transition flex items-center justify-center gap-2 text-sm">
                          <FaTimes /> Reject
                        </button>
                      </div>
                    ) : (
                      <div className="flex justify-end pt-4 border-t border-gray-800">
                        <button onClick={() => handleOrderDelete(order)} disabled={processingId === order.id}
                          className="bg-red-600/20 hover:bg-red-600/40 text-red-400 px-4 py-2 rounded-lg font-semibold text-xs flex items-center gap-2">
                          <FaTrash size={10} /> Delete Order
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ==================== REVIEWS TAB ==================== */}
        {activeTab === 'reviews' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-2xl font-bold">Manage Reviews</h2>
                <p className="text-gray-400 text-sm">{totalReviews} reviews • Avg: {avgRating} ⭐</p>
              </div>
              <button onClick={fetchAllData} className="bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-lg font-semibold transition flex items-center gap-2 text-sm">
                <FaSync /> Refresh
              </button>
            </div>

            <div className="relative mb-6">
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
              <input 
                type="text"
                placeholder="Search reviews..."
                value={reviewSearch}
                onChange={(e) => setReviewSearch(e.target.value)}
                className="w-full bg-gray-900 text-white pl-12 pr-4 py-3 rounded-xl outline-none border border-gray-800 focus:border-cyan-500 transition text-sm"
              />
            </div>

            {filteredReviews.length === 0 ? (
              <div className="text-center py-16 bg-gray-900 border border-gray-800 rounded-3xl">
                <FaComments className="text-5xl text-gray-700 mx-auto mb-4" />
                <p className="text-gray-400">{reviewSearch ? 'No matching reviews.' : 'No reviews yet.'}</p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredReviews.map((review) => (
                  <div key={review.id} className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center text-2xl text-cyan-400 flex-shrink-0">
                        <FaUserCircle />
                      </div>
                      <div className="flex-grow min-w-0">
                        <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-2 mb-2">
                          <div>
                            <h4 className="font-bold text-white">{review.name}</h4>
                            <p className="text-xs text-gray-500">{new Date(review.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</p>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="flex text-yellow-400 text-sm">
                              {[1,2,3,4,5].map(s => <FaStar key={s} className={s <= review.rating ? 'text-yellow-400' : 'text-gray-700'} />)}
                            </div>
                            <button onClick={() => handleReviewDelete(review)}
                              className="bg-red-600/20 hover:bg-red-600/40 text-red-400 p-2 rounded-lg transition">
                              <FaTrash size={12} />
                            </button>
                          </div>
                        </div>
                        <p className="text-xs text-cyan-400 font-mono mb-2">Theme: {review.theme_slug}</p>
                        <p className="text-gray-300 text-sm leading-relaxed">{review.comment}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </div>
      <Footer />
    </main>
  );
}