import React, { useEffect, useState } from 'react';
import { testimonialsAPI } from '../../utils/api';
import { useFetch } from '../../hooks/useCustom';
import toast from 'react-hot-toast';
import { Plus, Trash2, Star } from 'lucide-react';

export const ManageTestimonials = () => {
  const { fetchData } = useFetch();
  const [testimonials, setTestimonials] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    message: '',
    rating: 5,
    image: '',
    featured: false
  });

  const loadTestimonials = async () => {
    try {
      const data = await fetchData(() => testimonialsAPI.getAll());
      setTestimonials(data?.data || []);
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
      toast.success('Testimonial added successfully!');
      setShowForm(false);
      setFormData({ name: '', role: '', message: '', rating: 5, image: '', featured: false });
      loadTestimonials();
    } catch (error) {
      toast.error('Failed to add testimonial');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this testimonial?')) {
      try {
        await testimonialsAPI.delete(id);
        toast.success('Deleted!');
        loadTestimonials();
      } catch (error) {
        toast.error('Delete failed');
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Manage Testimonials</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition font-semibold shadow-md"
        >
          <Plus size={20} /> Add Testimonial
        </button>
      </div>

      {showForm && (
        <div className="bg-white dark:bg-[#0f172a] p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold mb-2">Client Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-primary focus:outline-none dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-bold mb-2">Role/Company</label>
                <input
                  type="text"
                  required
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-primary focus:outline-none dark:text-white"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold mb-2">Rating (1-5 Stars)</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setFormData({ ...formData, rating: star })}
                    className={`p-1 transition-colors ${formData.rating >= star ? 'text-yellow-400' : 'text-gray-300'}`}
                  >
                    <Star size={24} fill={formData.rating >= star ? 'currentColor' : 'none'} />
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold mb-2">Testimonial Message</label>
              <textarea
                required
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-primary focus:outline-none dark:text-white h-24 resize-none"
              ></textarea>
            </div>
            <button
              type="submit"
              className="w-full py-3 bg-primary text-white rounded-xl hover:bg-blue-700 transition font-bold shadow-lg"
            >
              Save Testimonial
            </button>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {testimonials.map((t) => (
          <div key={t._id} className="bg-white dark:bg-[#0f172a] p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm relative group">
            <button
              onClick={() => handleDelete(t._id)}
              className="absolute top-4 right-4 p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-opacity"
            >
              <Trash2 size={18} />
            </button>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center font-bold text-primary">
                {t.name.charAt(0)}
              </div>
              <div>
                <h3 className="font-bold text-gray-900 dark:text-white">{t.name}</h3>
                <p className="text-xs text-gray-500">{t.role}</p>
              </div>
            </div>
            <div className="flex gap-1 mb-3">
              {[...Array(t.rating || 5)].map((_, i) => (
                <Star key={i} size={14} className="text-yellow-400 fill-current" />
              ))}
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3 italic">"{t.message}"</p>
          </div>
        ))}
        {testimonials.length === 0 && (
          <div className="col-span-full py-12 text-center bg-white dark:bg-[#0f172a] rounded-2xl border border-dashed border-gray-200 dark:border-gray-800">
            <p className="text-gray-500">No testimonials added yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageTestimonials;
