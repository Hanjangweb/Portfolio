import React, { useEffect, useState } from 'react';
import { settingsAPI } from '../../utils/api';
import { useFetch } from '../../hooks/useCustom';
import { Save, Mail, Phone, MapPin, Globe, Github, Linkedin, Twitter, Instagram } from 'lucide-react';
import toast from 'react-hot-toast';

export const ManageSettings = () => {
  const { fetchData } = useFetch();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    address: '',
    siteName: '',
    footerText: '',
    socialLinks: {
      github: '',
      linkedin: '',
      twitter: '',
      instagram: ''
    }
  });

  const loadSettings = async () => {
    try {
      const data = await fetchData(() => settingsAPI.get());
      if (data?.data) {
        setFormData(data.data);
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  useEffect(() => {
    loadSettings();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await settingsAPI.update(formData);
      toast.success('Settings updated successfully!');
      loadSettings();
    } catch (error) {
      toast.error('Failed to update settings');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Site Settings</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Manage your contact information and social presence.</p>
        </div>
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="flex items-center gap-2 bg-primary text-white px-6 py-2 rounded-xl hover:bg-blue-700 transition font-bold shadow-lg disabled:opacity-50"
        >
          <Save size={20} /> {loading ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Contact Info */}
        <div className="bg-white dark:bg-[#0f172a] p-8 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm space-y-6">
          <h2 className="text-xl font-bold flex items-center gap-2 text-gray-800 dark:text-white">
            <Mail className="text-primary" size={24} /> Contact Details
          </h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-3 text-gray-400" size={20} />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-900 border-none rounded-2xl focus:ring-2 focus:ring-primary dark:text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Phone Number</label>
              <div className="relative">
                <Phone className="absolute left-4 top-3 text-gray-400" size={20} />
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-900 border-none rounded-2xl focus:ring-2 focus:ring-primary dark:text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Physical Address</label>
              <div className="relative">
                <MapPin className="absolute left-4 top-3 text-gray-400" size={20} />
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-900 border-none rounded-2xl focus:ring-2 focus:ring-primary dark:text-white"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Branding */}
        <div className="bg-white dark:bg-[#0f172a] p-8 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm space-y-6">
          <h2 className="text-xl font-bold flex items-center gap-2 text-gray-800 dark:text-white">
            <Globe className="text-primary" size={24} /> General Branding
          </h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Site Name</label>
              <input
                type="text"
                value={formData.siteName}
                onChange={(e) => setFormData({ ...formData, siteName: e.target.value })}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border-none rounded-2xl focus:ring-2 focus:ring-primary dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Footer Description</label>
              <textarea
                value={formData.footerText}
                onChange={(e) => setFormData({ ...formData, footerText: e.target.value })}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border-none rounded-2xl focus:ring-2 focus:ring-primary dark:text-white h-24 resize-none"
              ></textarea>
            </div>
          </div>
        </div>

        {/* Social Links */}
        <div className="lg:col-span-2 bg-white dark:bg-[#0f172a] p-8 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm space-y-6">
          <h2 className="text-xl font-bold flex items-center gap-2 text-gray-800 dark:text-white">
            <LinkIcon className="text-primary" size={24} /> Social Presence
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">GitHub URL</label>
              <div className="relative">
                <Github className="absolute left-4 top-3 text-gray-400" size={20} />
                <input
                  type="text"
                  value={formData.socialLinks.github}
                  onChange={(e) => setFormData({ ...formData, socialLinks: { ...formData.socialLinks, github: e.target.value } })}
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-900 border-none rounded-2xl focus:ring-2 focus:ring-primary dark:text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">LinkedIn URL</label>
              <div className="relative">
                <Linkedin className="absolute left-4 top-3 text-gray-400" size={20} />
                <input
                  type="text"
                  value={formData.socialLinks.linkedin}
                  onChange={(e) => setFormData({ ...formData, socialLinks: { ...formData.socialLinks, linkedin: e.target.value } })}
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-900 border-none rounded-2xl focus:ring-2 focus:ring-primary dark:text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Twitter URL</label>
              <div className="relative">
                <Twitter className="absolute left-4 top-3 text-gray-400" size={20} />
                <input
                  type="text"
                  value={formData.socialLinks.twitter}
                  onChange={(e) => setFormData({ ...formData, socialLinks: { ...formData.socialLinks, twitter: e.target.value } })}
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-900 border-none rounded-2xl focus:ring-2 focus:ring-primary dark:text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Instagram URL</label>
              <div className="relative">
                <Instagram className="absolute left-4 top-3 text-gray-400" size={20} />
                <input
                  type="text"
                  value={formData.socialLinks.instagram}
                  onChange={(e) => setFormData({ ...formData, socialLinks: { ...formData.socialLinks, instagram: e.target.value } })}
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-900 border-none rounded-2xl focus:ring-2 focus:ring-primary dark:text-white"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Internal aliasing for Link icon to avoid collision with react-router-dom Link if it were used
const LinkIcon = Globe;

export default ManageSettings;
