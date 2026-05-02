import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { blogAPI } from '../utils/api';
import { useFetch } from '../hooks/useCustom';
import { ArrowLeft, Calendar, User, Tag, Clock } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { motion } from 'framer-motion';

const BlogPost = () => {
  const { id } = useParams();
  const { fetchData, loading } = useFetch();
  const [post, setPost] = useState(null);

  useEffect(() => {
    const loadPost = async () => {
      try {
        const data = await fetchData(() => blogAPI.getOne(id));
        setPost(data?.data);
      } catch (error) {
        console.error('Error loading post:', error);
      }
    };
    loadPost();
  }, [id, fetchData]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h1 className="text-3xl font-bold mb-4">Post Not Found</h1>
        <Link to="/blog" className="text-primary font-bold flex items-center justify-center gap-2">
          <ArrowLeft size={20} /> Back to Blog
        </Link>
      </div>
    );
  }

  return (
    <article className="max-w-4xl mx-auto px-4 py-12">
      <Link to="/blog" className="inline-flex items-center gap-2 text-gray-500 hover:text-primary transition-colors mb-8 font-medium">
        <ArrowLeft size={20} /> Back to Blog
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center gap-3 mb-6">
          <span className="px-4 py-1.5 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full text-sm font-bold uppercase tracking-wider">
            {post.category}
          </span>
          <span className="text-gray-400">•</span>
          <div className="flex items-center gap-2 text-gray-500 text-sm">
            <Clock size={16} />
            <span>5 min read</span>
          </div>
        </div>

        <h1 className="text-4xl md:text-6xl font-bold mb-8 leading-tight text-gray-900 dark:text-white">
          {post.title}
        </h1>

        <div className="flex flex-wrap items-center gap-6 mb-12 border-y border-gray-100 dark:border-gray-800 py-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-500">
              <User size={20} />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-900 dark:text-white">{post.author || 'Admin'}</p>
              <p className="text-xs text-gray-500">Author</p>
            </div>
          </div>
          <div className="h-8 w-px bg-gray-200 dark:bg-gray-800 hidden md:block"></div>
          <div className="flex items-center gap-3 text-gray-500">
            <Calendar size={20} />
            <div>
              <p className="text-sm font-bold text-gray-900 dark:text-white">
                {new Date(post.createdAt).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}
              </p>
              <p className="text-xs text-gray-500">Published</p>
            </div>
          </div>
        </div>

        {post.image && (
          <div className="mb-12 rounded-[2.5rem] overflow-hidden shadow-2xl border border-gray-100 dark:border-gray-800">
            <img src={post.image} alt={post.title} className="w-full h-auto max-h-[500px] object-cover" />
          </div>
        )}

        {/* --- FIXED CONTENT SECTION --- */}
        <div className="prose prose-lg dark:prose-invert max-w-none 
          prose-headings:font-bold prose-a:text-primary prose-img:rounded-3xl
          break-words overflow-hidden">
          <ReactMarkdown 
            components={{
              // This force-wraps long code blocks and adds horizontal scroll ONLY to the code, not the page
              pre: ({node, ...props}) => (
                <div className="overflow-x-auto w-full my-4 rounded-xl">
                  <pre {...props} />
                </div>
              ),
              code: ({node, inline, ...props}) => (
                inline 
                  ? <code className="break-all bg-gray-100 dark:bg-gray-800 px-1 rounded" {...props} />
                  : <code className="block" {...props} />
              )
            }}
          >
            {post.content}
          </ReactMarkdown>
        </div>
        {/* ------------------------------ */}

        {post.tags && post.tags.length > 0 && (
          <div className="mt-16 pt-8 border-t border-gray-100 dark:border-gray-800">
            <div className="flex flex-wrap gap-3">
              {post.tags.map(tag => (
                <span key={tag} className="flex items-center gap-1.5 px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-xl text-sm font-semibold hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors cursor-default">
                  <Tag size={14} />
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </motion.div>
    </article>
  );
};

export default BlogPost;