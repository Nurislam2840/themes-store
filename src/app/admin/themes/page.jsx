"use client";

import { useState, useEffect } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Link from 'next/link';
import { useStore } from '@/context/StoreContext';
import { useAlert } from '@/context/AlertContext';
import { FaPlus, FaEdit, FaTrash, FaArrowLeft, FaTimes, FaUpload } from 'react-icons/fa';

export default function ManageThemes() {
  const { themes, isLoadingThemes, createTheme, updateTheme, deleteTheme, fetchThemes, uploadImage } = useStore();
  const { showAlert, showConfirm } = useAlert();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');

  const emptyForm = {
    title: '', slug: '', category: 'Next.js/React', price: '', image: '',
    tags: '', description: '', features: '', demo_url: '#', buy_url: '#',
    technologies: '', included_files: '', requirements: '',
    version: '1.0.0', last_updated: '', pages_included: '5'
  };
  const [form, setForm] = useState(emptyForm);

  useEffect(() => { fetchThemes(); }, []);

  const generateSlug = (title) => title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => {
      const updated = { ...prev, [name]: value };
      if (name === 'title' && !editingId) updated.slug = generateSlug(value);
      return updated;
    });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { 
      showAlert('File Too Large', 'Maximum file size is 5MB', 'error');
      return; 
    }
    if (!file.type.startsWith('image/')) { 
      showAlert('Invalid File', 'Please upload an image file (JPG, PNG)', 'error');
      return; 
    }
    setUploadError('');
    setIsUploading(true);
    const result = await uploadImage(file);
    setIsUploading(false);
    if (result.success) setForm(prev => ({ ...prev, image: result.url }));
    else showAlert('Upload Failed', result.error || 'Something went wrong', 'error');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.image) { 
      showAlert('Missing Image', 'Please upload a thumbnail image', 'warning');
      return; 
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

    const result = editingId ? await updateTheme(editingId, themeData) : await createTheme(themeData);
    setIsSubmitting(false);

    if (result.success) {
      showAlert(
        editingId ? 'Theme Updated!' : 'Theme Created!',
        `"${themeData.title}" has been ${editingId ? 'updated' : 'added'} successfully.`,
        'success'
      );
      setForm(emptyForm); 
      setEditingId(null); 
      setShowForm(false); 
      setUploadError('');
      fetchThemes();
    } else {
      showAlert('Error', result.error || 'Something went wrong', 'error');
    }
  };

  const handleEdit = (theme) => {
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
    setEditingId(theme.id);
    setShowForm(true);
    setUploadError('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = (theme) => {
    showConfirm({
      title: 'Delete this Theme?',
      message: `"${theme.title}" will be permanently deleted along with all its data. This cannot be undone.`,
      confirmText: 'Yes, Delete',
      cancelText: 'Cancel',
      onConfirm: async () => {
        const result = await deleteTheme(theme.id);
        if (result.success) {
          showAlert('Theme Deleted', `"${theme.title}" has been removed.`, 'success');
        } else {
          showAlert('Delete Failed', result.error || 'Something went wrong.', 'error');
        }
      }
    });
  };

  const handleCancel = () => {
    setForm(emptyForm); setEditingId(null); setShowForm(false); setUploadError('');
  };

  const inputClass = "w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 outline-none focus:border-cyan-500 text-white text-sm";
  const labelClass = "block text-xs text-gray-400 mb-2";

  return (
    <main className="min-h-screen bg-gray-950 text-white font-sans flex flex-col">
      <Navbar />
      <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto w-full flex-grow">

        <Link href="/admin" className="inline-flex items-center gap-2 text-gray-400 hover:text-cyan-400 transition mb-8">
          <FaArrowLeft /> Back to Dashboard
        </Link>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold">Manage Themes</h1>
            <p className="text-gray-400 text-sm mt-1">{themes.length} themes in your store</p>
          </div>
          <button onClick={() => showForm ? handleCancel() : setShowForm(true)}
            className="bg-cyan-600 hover:bg-cyan-700 px-5 py-3 rounded-xl font-bold transition flex items-center gap-2 text-sm">
            {showForm ? <><FaTimes /> Cancel</> : <><FaPlus /> Add New Theme</>}
          </button>
        </div>

        {showForm && (
          <div className="bg-gray-900 border border-gray-800 rounded-3xl p-6 md:p-8 mb-10">
            <h3 className="text-xl font-bold mb-6">{editingId ? 'Edit Theme' : 'Add New Theme'}</h3>

            <form onSubmit={handleSubmit} className="space-y-6">

              <div>
                <h4 className="text-sm font-bold text-cyan-400 mb-3 uppercase tracking-widest">📌 Basic Info</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Theme Title *</label>
                    <input type="text" name="title" value={form.title} onChange={handleChange} required placeholder="e.g. ShopMaster E-commerce" className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Slug (URL) *</label>
                    <input type="text" name="slug" value={form.slug} onChange={handleChange} required placeholder="shopmaster-ecommerce" className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Category *</label>
                    <select name="category" value={form.category} onChange={handleChange} className={inputClass}>
                      <option>Next.js/React</option>
                      <option>WordPress</option>
                      <option>HTML/CSS/JS</option>
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>Price (USD) *</label>
                    <input type="number" name="price" value={form.price} onChange={handleChange} required step="0.01" placeholder="49" className={inputClass} />
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-bold text-cyan-400 mb-3 uppercase tracking-widest">🖼️ Thumbnail Image</h4>
                <div className="bg-gray-800 border-2 border-dashed border-gray-700 rounded-xl p-4">
                  {form.image ? (
                    <div className="flex flex-col items-center gap-3">
                      <img src={form.image} alt="Preview" className="w-full max-w-xs h-40 object-cover rounded-lg border border-gray-700" />
                      <div className="flex gap-2 w-full max-w-xs">
                        <label htmlFor="imageUpload" className="flex-1 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 text-center py-2 rounded-lg font-semibold text-sm cursor-pointer">Change</label>
                        <button type="button" onClick={() => setForm({ ...form, image: '' })} className="flex-1 bg-red-600/20 hover:bg-red-600/30 text-red-400 py-2 rounded-lg font-semibold text-sm">Remove</button>
                      </div>
                    </div>
                  ) : (
                    <label htmlFor="imageUpload" className="cursor-pointer flex flex-col items-center gap-3 py-8">
                      {isUploading ? (
                        <><div className="w-10 h-10 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div><p className="text-sm text-gray-400">Uploading...</p></>
                      ) : (
                        <><div className="w-14 h-14 bg-cyan-500/10 text-cyan-400 rounded-full flex items-center justify-center text-2xl"><FaUpload /></div>
                        <div className="text-center"><p className="text-white font-semibold text-sm">Click to upload thumbnail</p><p className="text-gray-500 text-xs mt-1">JPG, PNG, WebP (Max 5MB)</p></div></>
                      )}
                    </label>
                  )}
                  <input id="imageUpload" type="file" accept="image/*" onChange={handleImageUpload} className="hidden" disabled={isUploading} />
                </div>
                <p className="text-xs text-gray-500 mt-2 mb-2">Or paste URL:</p>
                <input type="url" name="image" value={form.image} onChange={handleChange} placeholder="https://..." className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2 outline-none focus:border-cyan-500 text-white text-xs" />
              </div>

              <div>
                <h4 className="text-sm font-bold text-cyan-400 mb-3 uppercase tracking-widest">📝 Description & Tags</h4>
                <div className="space-y-4">
                  <div>
                    <label className={labelClass}>Short Description</label>
                    <textarea name="description" value={form.description} onChange={handleChange} rows="3" placeholder="A complete logistics theme..." className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Tags (comma separated)</label>
                    <input type="text" name="tags" value={form.tags} onChange={handleChange} placeholder="Next.js, Tailwind CSS, Stripe" className={inputClass} />
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-bold text-cyan-400 mb-3 uppercase tracking-widest">🛠️ Technology & Code Stack</h4>
                <div className="space-y-4">
                  <div>
                    <label className={labelClass}>Technologies Used (comma separated)</label>
                    <input type="text" name="technologies" value={form.technologies} onChange={handleChange} placeholder="Next.js 14, React 18, Tailwind CSS, Framer Motion, Supabase" className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Key Features (one per line)</label>
                    <textarea name="features" value={form.features} onChange={handleChange} rows="4" placeholder={"Next.js 14 App Router\nTailwind CSS\nFully Responsive\nSEO Optimized"} className={inputClass} />
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-bold text-cyan-400 mb-3 uppercase tracking-widest">📦 What's Included</h4>
                <div className="space-y-4">
                  <div>
                    <label className={labelClass}>Included Files & Resources (one per line)</label>
                    <textarea name="included_files" value={form.included_files} onChange={handleChange} rows="4" placeholder={"All source code files\nComplete Documentation PDF\nFigma Design Files\nFree lifetime updates"} className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>System Requirements (one per line)</label>
                    <textarea name="requirements" value={form.requirements} onChange={handleChange} rows="3" placeholder={"Node.js 18 or higher\nnpm or yarn\nBasic knowledge of Next.js"} className={inputClass} />
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-bold text-cyan-400 mb-3 uppercase tracking-widest">📊 Version Info</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className={labelClass}>Version</label>
                    <input type="text" name="version" value={form.version} onChange={handleChange} placeholder="1.0.0" className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Last Updated</label>
                    <input type="text" name="last_updated" value={form.last_updated} onChange={handleChange} placeholder="2024-01-15" className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Pages Included</label>
                    <input type="number" name="pages_included" value={form.pages_included} onChange={handleChange} placeholder="5" className={inputClass} />
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-bold text-cyan-400 mb-3 uppercase tracking-widest">🔗 URLs</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Live Demo URL</label>
                    <input type="text" name="demo_url" value={form.demo_url} onChange={handleChange} className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Buy URL</label>
                    <input type="text" name="buy_url" value={form.buy_url} onChange={handleChange} className={inputClass} />
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t border-gray-800">
                <button type="submit" disabled={isSubmitting || isUploading}
                  className="flex-1 bg-cyan-600 hover:bg-cyan-700 disabled:bg-gray-700 font-bold py-3 rounded-xl transition">
                  {isSubmitting ? 'Saving...' : editingId ? 'Update Theme' : 'Create Theme'}
                </button>
                <button type="button" onClick={handleCancel} className="px-6 bg-gray-800 hover:bg-gray-700 font-bold py-3 rounded-xl transition">Cancel</button>
              </div>
            </form>
          </div>
        )}

        {isLoadingThemes ? (
          <div className="text-center py-20"><div className="w-10 h-10 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto"></div></div>
        ) : themes.length === 0 ? (
          <div className="text-center py-20 bg-gray-900 border border-gray-800 rounded-3xl">
            <p className="text-gray-400 mb-2">No themes loaded from database.</p>
            <p className="text-gray-500 text-sm">Try adding a theme above.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {themes.map((theme) => (
              <div key={theme.id} className="bg-gray-900 border border-gray-800 rounded-2xl p-4 flex flex-col md:flex-row gap-4 items-start md:items-center">
                <img src={theme.image} alt={theme.title} className="w-full md:w-32 h-20 object-cover rounded-lg" />
                <div className="flex-grow">
                  <p className="text-xs text-cyan-400 font-bold uppercase">{theme.category}</p>
                  <h3 className="font-bold text-white text-lg">{theme.title}</h3>
                  <p className="text-sm text-gray-400">${theme.price} • /{theme.slug} • v{theme.version || '1.0.0'}</p>
                </div>
                <div className="flex gap-2 w-full md:w-auto">
                  <button onClick={() => handleEdit(theme)} className="flex-1 md:flex-none bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 px-4 py-2 rounded-lg font-semibold text-sm flex items-center justify-center gap-2">
                    <FaEdit /> Edit
                  </button>
                  <button onClick={() => handleDelete(theme)} className="flex-1 md:flex-none bg-red-600/20 hover:bg-red-600/30 text-red-400 px-4 py-2 rounded-lg font-semibold text-sm flex items-center justify-center gap-2">
                    <FaTrash /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
      <Footer />
    </main>
  );
}