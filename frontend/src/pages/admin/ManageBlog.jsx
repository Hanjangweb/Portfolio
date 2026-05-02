import React, { useState, useEffect } from 'react';
import { blogAPI, uploadAPI, aiAPI, getImageUrl } from '../../utils/api';
import { useFetch } from '../../hooks/useCustom';
import { Plus, Edit2, Trash2, Upload, Sparkles, Loader2, X, Send } from 'lucide-react';
import toast from 'react-hot-toast';

export const ManageBlog = () => {
  const { fetchData } = useFetch();
  const [posts, setPosts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPost, setCurrentPost] = useState({ title: '', excerpt: '', content: '', category: '', image: '' });
  const [isEditing, setIsEditing] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [loadingType, setLoadingType] = useState(''); // 'content', 'excerpt'

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      const data = await fetchData(() => blogAPI.getAll(1, 100));
      setPosts(data?.data || []);
    } catch (error) {
      toast.error('Failed to load blog posts');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await blogAPI.update(currentPost._id, currentPost);
        toast.success('Post updated successfully');
      } else {
        await blogAPI.create(currentPost);
        toast.success('Post created successfully');
      }
      setIsModalOpen(false);
      loadPosts();
      setCurrentPost({ title: '', excerpt: '', content: '', category: '', image: '' });
      setIsEditing(false);
    } catch (error) {
      toast.error('Operation failed');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        await blogAPI.delete(id);
        toast.success('Post deleted successfully');
        loadPosts();
      } catch (error) {
        toast.error('Failed to delete post');
      }
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    setUploading(true);
    try {
      const res = await uploadAPI.uploadImage(formData);
      setCurrentPost({ ...currentPost, image: res.data.data });
      toast.success('Image uploaded!');
    } catch (error) {
      toast.error('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleAiGenerate = async (type) => {
    if (!currentPost.title) {
      return toast.error('Please enter a title first');
    }

    setAiLoading(true);
    setLoadingType(type);
    try {
      const res = await aiAPI.generate({ prompt: currentPost.title, type });
      if (type === 'blog') {
        setCurrentPost({ ...currentPost, content: res.data.data });
      } else if (type === 'excerpt') {
        setCurrentPost({ ...currentPost, excerpt: res.data.data });
      }
      toast.success(`Generated ${type} with AI!`);
    } catch (error) {
      toast.error('AI Generation failed');
    } finally {
      setAiLoading(false);
      setLoadingType('');
    }
  };

  const openEditModal = (post) => {
    setCurrentPost(post);
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const openCreateModal = () => {
    setCurrentPost({ title: '', excerpt: '', content: '', category: 'Web Development', image: '' });
    setIsEditing(false);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Manage Blog</h1>
        <button
          onClick={openCreateModal}
          className="flex items-center gap-2 bg-primary text-white px-6 py-2 rounded-xl hover:bg-blue-700 transition font-bold shadow-md"
        >
          <Plus size={20} /> Add Post
        </button>
      </div>

      <div className="bg-white dark:bg-[#0f172a] rounded-[2rem] border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 dark:bg-gray-900/50 text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4 font-bold">Title</th>
                <th className="px-6 py-4 font-bold">Category</th>
                <th className="px-6 py-4 font-bold">Date</th>
                <th className="px-6 py-4 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {posts.map((post) => (
                <tr key={post._id} className="hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {post.image && <img src={getImageUrl(post.image)} alt="" className="w-8 h-8 rounded-lg object-cover" />}
                      <span className="font-bold text-gray-900 dark:text-white line-clamp-1">{post.title}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 uppercase tracking-tighter">
                      {post.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-500 dark:text-gray-400 text-sm">
                    {new Date(post.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-1">
                      <button onClick={() => openEditModal(post)} className="text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 p-2 rounded-lg transition">
                        <Edit2 size={18} />
                      </button>
                      <button onClick={() => handleDelete(post._id)} className="text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 p-2 rounded-lg transition">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-[#0f172a] rounded-[2.5rem] w-full max-w-4xl shadow-2xl overflow-hidden border border-gray-100 dark:border-gray-800 max-h-[90vh] flex flex-col animate-in fade-in zoom-in duration-300">
            <div className="px-8 py-6 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center bg-gray-50/50 dark:bg-gray-900/50">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{isEditing ? 'Edit Post' : 'Create New Post'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition">
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-8 space-y-6 overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="col-span-2">
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Post Title</label>
                  <input
                    type="text"
                    required
                    value={currentPost.title}
                    onChange={(e) => setCurrentPost({ ...currentPost, title: e.target.value })}
                    className="w-full px-6 py-4 bg-gray-50 dark:bg-gray-900 border-none rounded-2xl focus:ring-2 focus:ring-primary dark:text-white text-lg font-semibold"
                    placeholder="Enter a catchy title..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Category</label>
                  <input
                    type="text"
                    required
                    value={currentPost.category}
                    onChange={(e) => setCurrentPost({ ...currentPost, category: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border-none rounded-xl focus:ring-2 focus:ring-primary dark:text-white"
                    placeholder="e.g. Technology"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Featured Image</label>
                  <div className="flex gap-4 items-center">
                    {currentPost.image && <img src={currentPost.image} className="w-12 h-12 rounded-lg object-cover border border-gray-200" alt="Post" />}
                    <div className="relative flex-1">
                      <input type="file" onChange={handleImageUpload} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                      <div className="flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 dark:bg-gray-800 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-700">
                        {uploading ? <Loader2 size={18} className="animate-spin" /> : <Upload size={18} />}
                        <span className="text-sm font-bold">{uploading ? 'Uploading...' : 'Upload Image'}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-span-2">
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300">Short Excerpt</label>
                    <button
                      type="button"
                      onClick={() => handleAiGenerate('excerpt')}
                      disabled={aiLoading}
                      className="flex items-center gap-1.5 text-xs font-bold text-primary bg-blue-50 dark:bg-blue-900/30 px-3 py-1.5 rounded-full hover:bg-blue-100 transition"
                    >
                      {aiLoading && loadingType === 'excerpt' ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />}
                      AI Suggest
                    </button>
                  </div>
                  <textarea
                    required
                    value={currentPost.excerpt}
                    onChange={(e) => setCurrentPost({ ...currentPost, excerpt: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border-none rounded-xl focus:ring-2 focus:ring-primary dark:text-white h-20 resize-none"
                    placeholder="A brief summary for the card view..."
                  ></textarea>
                </div>

                <div className="col-span-2">
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300">Full Content (Markdown)</label>
                    <button
                      type="button"
                      onClick={() => handleAiGenerate('blog')}
                      disabled={aiLoading}
                      className="flex items-center gap-1.5 text-xs font-bold text-primary bg-blue-50 dark:bg-blue-900/30 px-4 py-2 rounded-full hover:bg-blue-100 transition"
                    >
                      {aiLoading && loadingType === 'blog' ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
                      Write Post with AI
                    </button>
                  </div>
                  <textarea
                    required
                    value={currentPost.content}
                    onChange={(e) => setCurrentPost({ ...currentPost, content: e.target.value })}
                    className="w-full px-6 py-4 bg-gray-50 dark:bg-gray-900 border-none rounded-2xl focus:ring-2 focus:ring-primary dark:text-white h-64 resize-none font-mono text-sm leading-relaxed"
                    placeholder="Type your story here or use AI to generate a draft..."
                  ></textarea>
                </div>
              </div>
              <div className="flex justify-end gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-8 py-3 text-gray-600 dark:text-gray-400 font-bold hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-10 py-3 bg-primary text-white rounded-xl font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-600/20 flex items-center gap-2"
                >
                  <Send size={18} />
                  {isEditing ? 'Update Post' : 'Publish Post'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageBlog;
