import React, { useState, useEffect } from 'react';
import { testimonialsAPI, aiAPI, getImageUrl } from '../utils/api';
import { useFetch } from '../hooks/useCustom';
import { Star, MessageSquare, Quote, Send, Sparkles, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

const Testimonials = () => {
  const { fetchData } = useFetch();
  const [testimonials, setTestimonials] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    message: '',
    rating: 5,
  });

  const loadTestimonials = async () => {
    try {
      const data = await fetchData(() => testimonialsAPI.getAll());
      // Only show featured testimonials publicly
      setTestimonials(data?.data?.filter(t => t.featured) || []);
    } catch (error) {
      console.error('Error loading testimonials:', error);
    }
  };

  useEffect(() => {
    loadTestimonials();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await testimonialsAPI.create(formData);
      toast.success('Thank you! Your testimonial has been submitted for review.');
      setShowForm(false);
      setFormData({ name: '', role: '', message: '', rating: 5 });
    } catch (error) {
      toast.error('Failed to submit testimonial. Please try again.');
    }
  };

  const handleGenerateMessage = async () => {
    if (!formData.name || !formData.role) {
      return toast.error('Please enter your name and role first');
    }

    setAiLoading(true);
    try {
      const prompt = `Generate a professional testimonial message from ${formData.name}, a ${formData.role}`;
      const res = await aiAPI.generate({ prompt, type: 'testimonial' });
      setFormData({ ...formData, message: res.data.data });
      toast.success('Generated testimonial message with AI!');
    } catch (error) {
      toast.error('AI Generation failed');
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden py-20 lg:py-32">
      {/* Background decoration */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-[600px] bg-blue-500/15 dark:bg-blue-600/10 blur-[130px] pointer-events-none rounded-full" />
      <div className="absolute top-1/3 right-0 w-[500px] h-[500px] bg-amber-500/10 dark:bg-amber-600/10 blur-[100px] pointer-events-none rounded-full" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-indigo-500/10 dark:bg-indigo-600/10 blur-[100px] pointer-events-none rounded-full" />
      <div className="absolute inset-0 bg-grid-pattern opacity-30 pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 font-semibold text-sm mb-4 border border-amber-100 dark:border-amber-800">
            Social Proof
          </span>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight">Client <span className="text-gradient">Feedback</span></h1>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto text-lg leading-relaxed">
            Hear from the people I've worked with. Their success stories are my greatest motivation.
          </p>
        </div>

        {/* Stats/Action CTA */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
          <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 rounded-3xl p-8 text-white flex flex-col justify-center">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay pointer-events-none" />
            <Quote size={48} className="mb-4 opacity-40" />
            <h2 className="text-3xl font-bold mb-4">Have we worked together?</h2>
            <p className="mb-8 opacity-90 text-lg">
              I value your feedback! Share your experience and help me grow.
            </p>
            <button
              onClick={() => setShowForm(true)}
              className="w-fit bg-white text-blue-600 px-8 py-3 rounded-full font-bold hover:bg-blue-50 hover:scale-105 transition-all shadow-xl relative z-10"
            >
              Leave a Review
            </button>
          </div>

          <div className="glass rounded-3xl p-8 flex flex-col justify-center border border-white/30 dark:border-white/10">
            <div className="flex items-center gap-4 mb-4">
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={24} className="text-amber-400 fill-current" />
                ))}
              </div>
              <span className="text-2xl font-bold">5.0 / 5.0</span>
            </div>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Based on feedback from over 20+ satisfied clients across various industries.
            </p>
          </div>
        </div>

      {/* Submission Form Overlay */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div style={{ marginTop: '3rem' }} className="bg-white dark:bg-gray-900 w-full max-w-lg rounded-3xl p-8 shadow-2xl relative">
            <button
              onClick={() => setShowForm(false)}
              className="absolute top-6 right-6 text-gray-400 hover:text-gray-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
            <h3 className="text-2xl font-bold mb-6">Write a Testimonial</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-2">Your Name</label>
                <input
                  type="text"
                  required
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border-none rounded-xl focus:ring-2 focus:ring-blue-500"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Role/Company</label>
                <input
                  type="text"
                  required
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border-none rounded-xl focus:ring-2 focus:ring-blue-500"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Rating</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setFormData({ ...formData, rating: star })}
                      className={`p-1 ${formData.rating >= star ? 'text-yellow-400' : 'text-gray-300'}`}
                    >
                      <Star size={24} fill={formData.rating >= star ? 'currentColor' : 'none'} />
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-semibold">Your Message</label>
                  <button
                    type="button"
                    onClick={handleGenerateMessage}
                    disabled={aiLoading}
                    className="flex items-center gap-1 text-xs bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-2 py-1 rounded hover:bg-blue-100 dark:hover:bg-blue-900/50 transition disabled:opacity-50"
                  >
                    {aiLoading ? (
                      <>
                        <Loader2 size={14} className="animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Sparkles size={14} />
                        Generate with AI
                      </>
                    )}
                  </button>
                </div>
                <textarea
                  required
                  rows="4"
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border-none rounded-xl focus:ring-2 focus:ring-blue-500"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                ></textarea>
              </div>
              <button
                type="submit"
                className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-blue-700 transition"
              >
                <Send size={18} /> Submit Review
              </button>
            </form>
          </div>
        </div>
      )}

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((t, index) => (
            <motion.div
              key={t._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="glass p-8 rounded-3xl border border-white/30 dark:border-white/10 relative h-full flex flex-col hover:-translate-y-1 hover:shadow-xl transition-all duration-300"
            >
              <div className="flex items-center gap-4 mb-6">
                {t.image ? (
                  <img
                    src={getImageUrl(t.image)}
                    alt={t.name}
                    className="w-14 h-14 rounded-full object-cover border border-gray-200 dark:border-gray-700 shrink-0 shadow-lg"
                  />
                ) : (
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-xl flex-shrink-0 shadow-lg">
                    {t.name.charAt(0)}
                  </div>
                )}
                <div className="min-w-0">
                  <h4 className="font-bold text-gray-900 dark:text-white truncate">{t.name}</h4>
                  <p className="text-sm text-gray-500 truncate">{t.role}</p>
                </div>
              </div>
              <div className="flex gap-1 mb-4">
                {[...Array(t.rating || 5)].map((_, i) => (
                  <Star key={i} size={14} className="text-amber-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-600 dark:text-gray-400 italic leading-relaxed flex-grow">
                &ldquo;{t.message}&rdquo;
              </p>
              <Quote size={32} className="absolute bottom-8 right-8 opacity-5 text-gray-400" />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Testimonials;
