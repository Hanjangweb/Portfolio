import React, { useEffect, useState } from 'react';
import { useForm, useFetch } from '../hooks/useCustom';
import { contactAPI, settingsAPI, aiAPI } from '../utils/api';
import toast from 'react-hot-toast';
import { Mail, Phone, MapPin, Send, Github, Linkedin, Twitter, Instagram, Sparkles, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

export const Contact = () => {
  const { fetchData } = useFetch();
  const [settings, setSettings] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const data = await fetchData(() => settingsAPI.get());
        setSettings(data?.data);
      } catch (error) {
        console.error('Error loading settings:', error);
      }
    };
    loadSettings();
  }, []);

  
  const { values, handleChange, handleSubmit, loading, resetForm } = useForm(
    {
      name: '',
      email: '',
      subject: '',
      message: '',
    },
    async (formData) => {
      try {
        await contactAPI.submit(formData);
        toast.success('Message sent successfully!');
        resetForm();
      } catch (error) {
        toast.error(error.message || 'Failed to send message');
      }
    }
  );

  return (
    <div className="min-h-screen relative overflow-hidden py-20 lg:py-32">
      {/* Background decoration */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-[600px] bg-blue-500/15 dark:bg-blue-600/10 blur-[130px] pointer-events-none rounded-full" />
      <div className="absolute top-1/3 right-0 w-[500px] h-[500px] bg-emerald-500/10 dark:bg-emerald-600/10 blur-[100px] pointer-events-none rounded-full" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-indigo-500/10 dark:bg-indigo-600/10 blur-[100px] pointer-events-none rounded-full" />
      <div className="absolute inset-0 bg-grid-pattern opacity-30 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-16 text-center"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 font-semibold text-sm mb-4 border border-emerald-100 dark:border-emerald-800">
            Let's Connect
          </span>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight">Get In <span className="text-gradient">Touch</span></h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
            I'd love to hear about your project. Feel free to reach out!
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-8"
          >
            <div>
              <h2 className="text-2xl font-bold mb-8 text-gray-900 dark:text-white">Contact Information</h2>
              
              <div className="space-y-6">
                <div className="flex items-center gap-6 p-6 bg-white dark:bg-gray-900 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800">
                  <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/20 rounded-2xl flex items-center justify-center text-blue-600">
                    <Mail size={24} />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider">Email</h3>
                    <a href={`mailto:${settings?.email || 'hello@example.com'}`} className="text-lg font-semibold text-gray-900 dark:text-white hover:text-blue-600 transition">
                      {settings?.email || 'hello@example.com'}
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-6 p-6 bg-white dark:bg-gray-900 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800">
                  <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/20 rounded-2xl flex items-center justify-center text-blue-600">
                    <Phone size={24} />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider">Phone</h3>
                    <a href={`tel:${settings?.phone}`} className="text-lg font-semibold text-gray-900 dark:text-white hover:text-blue-600 transition">
                      {settings?.phone || '+1 (234) 567-8900'}
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-6 p-6 bg-white dark:bg-gray-900 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800">
                  <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/20 rounded-2xl flex items-center justify-center text-blue-600">
                    <MapPin size={24} />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider">Location</h3>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white">
                      {settings?.address || 'San Francisco, CA'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div>
              <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Follow Me</h3>
              <div className="flex flex-wrap gap-3">
                {settings?.socialLinks?.github && (
                  <a href={settings.socialLinks.github} target="_blank" rel="noreferrer" title="GitHub"
                    className="w-12 h-12 bg-gray-900 dark:bg-white/10 text-white rounded-2xl flex items-center justify-center hover:scale-110 hover:shadow-lg hover:shadow-gray-900/30 transition-all">
                    <Github size={22} />
                  </a>
                )}
                {settings?.socialLinks?.linkedin && (
                  <a href={settings.socialLinks.linkedin} target="_blank" rel="noreferrer" title="LinkedIn"
                    className="w-12 h-12 bg-blue-600 text-white rounded-2xl flex items-center justify-center hover:scale-110 hover:shadow-lg hover:shadow-blue-600/40 transition-all">
                    <Linkedin size={22} />
                  </a>
                )}
                {settings?.socialLinks?.twitter && (
                  <a href={settings.socialLinks.twitter} target="_blank" rel="noreferrer" title="Twitter"
                    className="w-12 h-12 bg-sky-400 text-white rounded-2xl flex items-center justify-center hover:scale-110 hover:shadow-lg hover:shadow-sky-400/40 transition-all">
                    <Twitter size={22} />
                  </a>
                )}
                {settings?.socialLinks?.instagram && (
                  <a href={settings.socialLinks.instagram} target="_blank" rel="noreferrer" title="Instagram"
                    className="w-12 h-12 bg-gradient-to-br from-pink-500 to-purple-600 text-white rounded-2xl flex items-center justify-center hover:scale-110 hover:shadow-lg hover:shadow-pink-500/40 transition-all">
                    <Instagram size={22} />
                  </a>
                )}
              </div>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 }}
            className="glass p-8 md:p-12 rounded-[2rem] shadow-2xl border border-white/30 dark:border-white/10"
          >
            <h2 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">Send a Message</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-8 text-sm">I typically respond within 24 hours.</p>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Your Name</label>
                  <input
                    type="text"
                    name="name"
                    value={values.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3.5 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary dark:text-white transition-all"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={values.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3.5 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary dark:text-white transition-all"
                    placeholder="your@email.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Subject</label>
                <input
                  type="text"
                  name="subject"
                  value={values.subject}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3.5 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary dark:text-white transition-all"
                  placeholder="What is this about?"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300">Message</label>
                  <button
                    type="button"
                    onClick={async () => {
                      if (!values.subject) {
                        return toast.error('Please enter a subject first');
                      }
                      setAiLoading(true);
                      try {
                        const res = await aiAPI.generate({ prompt: values.subject, type: 'contact' });
                        handleChange({ target: { name: 'message', value: res.data.data } });
                        toast.success('Generated message with AI!');
                      } catch (error) {
                        toast.error('AI Generation failed');
                      } finally {
                        setAiLoading(false);
                      }
                    }}
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
                  name="message"
                  value={values.message}
                  onChange={handleChange}
                  required
                  rows="5"
                  className="w-full px-4 py-3.5 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary dark:text-white resize-none transition-all"
                  placeholder="Describe your project or inquiry..."
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl font-bold flex items-center justify-center gap-3 hover:scale-[1.02] hover:shadow-xl hover:shadow-blue-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-base"
              >
                <Send size={20} />
                {loading ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
