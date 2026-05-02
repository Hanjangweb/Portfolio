import React, { useEffect, useState } from 'react';
import { blogAPI } from '../utils/api';
import { BlogCard } from '../components/Cards';
import { useFetch } from '../hooks/useCustom';
import { Search } from 'lucide-react';

export const Blog = () => {
  const { fetchData, loading } = useFetch();
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);

  useEffect(() => {
    const loadBlogPosts = async () => {
      try {
        const data = await fetchData(() => blogAPI.getAll(page, 12));
        setPosts(data?.data || []);
        setFilteredPosts(data?.data || []);
      } catch (error) {
        console.error('Error loading blog posts:', error);
      }
    };
    loadBlogPosts();
  }, [fetchData, page]);

  const handleSearch = (term) => {
    setSearchTerm(term);
    const filtered = posts.filter(
      (post) =>
        post.title.toLowerCase().includes(term.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(term.toLowerCase()) ||
        post.category.toLowerCase().includes(term.toLowerCase())
    );
    setFilteredPosts(filtered);
  };

  return (
    <div className="min-h-screen relative overflow-hidden py-20 lg:py-32">
      {/* Background decoration - matching hero style */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-[600px] bg-blue-500/15 dark:bg-blue-600/10 blur-[130px] pointer-events-none rounded-full" />
      <div className="absolute top-1/3 right-0 w-[500px] h-[500px] bg-purple-500/15 dark:bg-purple-600/10 blur-[100px] pointer-events-none rounded-full" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-indigo-500/10 dark:bg-indigo-600/10 blur-[100px] pointer-events-none rounded-full" />
      <div className="absolute inset-0 bg-grid-pattern opacity-30 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="mb-16 text-center">
          <span className="inline-block px-4 py-1.5 rounded-full bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 font-semibold text-sm mb-4 border border-purple-100 dark:border-purple-800">
            Writing &amp; Insights
          </span>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight">
            Blog &amp; <span className="text-gradient">Articles</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Insights, tutorials, and thoughts on modern web development
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-12 max-w-2xl mx-auto">
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-500" />
            <div className="relative">
              <Search className="absolute left-4 top-4 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search articles by title, topic, or category..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-2xl border border-white/20 dark:border-white/10 bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary shadow-lg transition-all"
              />
            </div>
          </div>
        </div>

        {/* Blog Posts Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-24">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary" />
          </div>
        ) : filteredPosts.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {filteredPosts.map((post, i) => (
              <div
                key={post._id}
                style={{ animationDelay: `${i * 60}ms` }}
                className="animate-slide-up"
              >
                <BlogCard post={post} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-24 glass rounded-3xl">
            <div className="w-20 h-20 bg-gray-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="text-gray-400" size={32} />
            </div>
            <h3 className="text-2xl font-bold mb-2">No articles found</h3>
            <p className="text-gray-500 dark:text-gray-400">Try a different search term.</p>
          </div>
        )}

        {/* Pagination */}
        <div className="flex justify-center gap-4 mt-12">
          <button
            onClick={() => setPage(Math.max(1, page - 1))}
            disabled={page === 1}
            className="px-6 py-3 rounded-full border border-gray-200 dark:border-gray-700 bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm dark:text-white hover:border-primary hover:text-primary transition-all disabled:opacity-40 font-medium"
          >
            ← Previous
          </button>
          <span className="px-6 py-3 glass rounded-full dark:text-white font-semibold">
            Page {page}
          </span>
          <button
            onClick={() => setPage(page + 1)}
            className="px-6 py-3 rounded-full border border-gray-200 dark:border-gray-700 bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm dark:text-white hover:border-primary hover:text-primary transition-all font-medium"
          >
            Next →
          </button>
        </div>
      </div>
    </div>
  );
};

export default Blog;
