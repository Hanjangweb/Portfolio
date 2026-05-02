import React, { useEffect, useState } from 'react';
import { footerAPI } from '../../utils/api';
import { useFetch } from '../../hooks/useCustom';
import { Plus, Trash2, Link as LinkIcon, ExternalLink, Download, FileText } from 'lucide-react';
import toast from 'react-hot-toast';

export const ManageFooter = () => {
  const { fetchData } = useFetch();
  const [links, setLinks] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    url: '',
    section: 'Menu',
    order: 0
  });
  const [uploading, setUploading] = useState(false);

  const loadLinks = async () => {
    try {
      const data = await fetchData(() => footerAPI.getAll());
      setLinks(data?.data || []);
    } catch (error) {
      console.error('Error loading footer links:', error);
    }
  };

  useEffect(() => {
    loadLinks();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await footerAPI.update(editingId, formData);
        toast.success('Link updated!');
      } else {
        await footerAPI.create(formData);
        toast.success('Link added!');
      }
      setShowForm(false);
      setEditingId(null);
      setFormData({ name: '', url: '', section: 'Menu', order: 0 });
      loadLinks();
    } catch (error) {
      toast.error('Failed to save link');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Remove this link?')) {
      try {
        await footerAPI.delete(id);
        toast.success('Removed!');
        loadLinks();
      } catch (error) {
        toast.error('Delete failed');
      }
    }
  };

  const handleEdit = (link) => {
    setFormData(link);
    setEditingId(link._id);
    setShowForm(true);
  };

  const handleResumeUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      const formDataUpload = new FormData();
      formDataUpload.append('resume', file);
      
      const response = await fetch('http://localhost:5000/api/upload/resume', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: formDataUpload
      });

      if (!response.ok) throw new Error('Upload failed');
      const data = await response.json();
      
      setFormData({ 
        ...formData, 
        name: 'Resume',
        url: data.data,
        section: 'Resources'
      });
      toast.success('Resume uploaded successfully!');
    } catch (error) {
      toast.error('Failed to upload resume: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  const sections = ['Quick Links', 'Resources', 'Follow'];
  const isResume = formData.name.toLowerCase().includes('resume');
  const isDownloadable = formData.url.endsWith('.pdf') || isResume;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">Manage Footer Links</h1>
        <button
          onClick={() => {
            setShowForm(!showForm);
            if (!showForm) {
              setEditingId(null);
              setFormData({ name: '', url: '', section: 'Menu', order: 0 });
            }
          }}
          className="flex items-center gap-2 bg-primary text-white px-4 md:px-6 py-2 md:py-3 rounded-xl hover:bg-blue-700 transition font-semibold text-sm md:text-base w-full sm:w-auto justify-center sm:justify-start"
        >
          <Plus size={20} /> {showForm ? 'Cancel' : 'Add Link'}
        </button>
      </div>

      {showForm && (
        <div className="bg-white dark:bg-gray-900 p-6 md:p-8 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
          <h2 className="text-xl font-bold mb-6 text-gray-900 dark:text-white">{editingId ? 'Edit' : 'Add New'} Link</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            <div>
              <label className="block text-sm font-bold mb-2 text-gray-700 dark:text-gray-300">Link Name</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border-none rounded-xl focus:ring-2 focus:ring-primary dark:text-white"
                placeholder="e.g. Home, GitHub, Resume, etc."
              />
            </div>
            <div>
              <label className="block text-sm font-bold mb-2 text-gray-700 dark:text-gray-300">URL / Path</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  required
                  value={formData.url}
                  onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                  className="flex-1 px-4 py-3 bg-gray-50 dark:bg-gray-800 border-none rounded-xl focus:ring-2 focus:ring-primary dark:text-white"
                  placeholder="e.g. /projects or https://... or https://.../resume.pdf"
                />
                {formData.name.toLowerCase().includes('resume') && (
                  <label className="px-4 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-semibold cursor-pointer transition flex items-center gap-2 whitespace-nowrap">
                    <FileText size={18} />
                    {uploading ? 'Uploading...' : 'Upload'}
                    <input
                      type="file"
                      accept=".pdf"
                      onChange={handleResumeUpload}
                      disabled={uploading}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold mb-2 text-gray-700 dark:text-gray-300">Section</label>
              <select
                value={formData.section}
                onChange={(e) => setFormData({ ...formData, section: e.target.value })}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border-none rounded-xl focus:ring-2 focus:ring-primary dark:text-white"
              >
                {sections.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold mb-2 text-gray-700 dark:text-gray-300">Order</label>
              <input
                type="number"
                value={formData.order}
                onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border-none rounded-xl focus:ring-2 focus:ring-primary dark:text-white"
              />
            </div>
            {isDownloadable && (
              <div className="md:col-span-2 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg text-blue-800 dark:text-blue-300 text-sm">
                💡 <strong>Tip:</strong> This link will show a download icon in the footer for easy PDF access.
              </div>
            )}
            <div className="md:col-span-2 flex gap-4">
              <button
                type="submit"
                className="flex-1 py-3 bg-primary text-white rounded-xl font-bold hover:bg-blue-700 transition"
              >
                {editingId ? 'Update Link' : 'Save Link'}
              </button>
              {editingId && (
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingId(null);
                    setFormData({ name: '', url: '', section: 'Menu', order: 0 });
                  }}
                  className="flex-1 py-3 bg-gray-300 dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl font-bold hover:bg-gray-400 transition"
                >
                  Reset
                </button>
              )}
            </div>
          </form>
        </div>
      )}

      {/* Links by Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {sections.map(section => (
          <div key={section} className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <div className="flex-1">
                <h2 className="font-bold text-base md:text-lg text-gray-700 dark:text-gray-300">{section}</h2>
              </div>
              <span className="bg-primary/20 text-primary px-3 py-1 rounded-full text-sm font-semibold">
                {links.filter(l => l.section === section).length}
              </span>
            </div>
            <div className="space-y-3">
              {links.filter(l => l.section === section).sort((a, b) => a.order - b.order).map(link => {
                const isResume = link.name.toLowerCase().includes('resume');
                const isDownloadable = link.url.endsWith('.pdf') || isResume;
                
                return (
                  <div key={link._id} className="bg-white dark:bg-gray-900 p-4 rounded-xl border border-gray-100 dark:border-gray-800 hover:border-primary/30 transition group">
                    <div className="flex items-start gap-3 mb-3">
                      <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded-lg text-gray-400 flex-shrink-0 mt-1">
                        {isDownloadable ? <Download size={16} /> : link.url.startsWith('http') ? <ExternalLink size={16} /> : <LinkIcon size={16} />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-sm text-gray-900 dark:text-white">{link.name}</p>
                        <p className="text-xs text-gray-500 truncate">{link.url}</p>
                        <p className="text-xs text-gray-400 mt-1">Order: {link.order}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(link)}
                        className="flex-1 py-2 px-3 text-sm bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/40 transition font-semibold"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(link._id)}
                        className="py-2 px-3 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                );
              })}
              {links.filter(l => l.section === section).length === 0 && (
                <div className="p-6 text-center text-gray-400 border border-dashed border-gray-200 dark:border-gray-800 rounded-xl">
                  <LinkIcon size={24} className="mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No links in this section</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManageFooter;
