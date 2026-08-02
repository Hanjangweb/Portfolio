import React, { useState, useEffect } from 'react';
import { servicesAPI, aiAPI } from '../../utils/api';
import { useFetch } from '../../hooks/useCustom';
import { Plus, Edit2, Trash2, Sparkles, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

export const ManageServices = () => {
  const { fetchData } = useFetch();
  const [services, setServices] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentService, setCurrentService] = useState({ title: '', description: '', icon: 'Briefcase', order: 0 });
  const [isEditing, setIsEditing] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    try {
      const data = await fetchData(() => servicesAPI.getAll());
      setServices(data?.data || []);
    } catch (error) {
      toast.error('Failed to load services');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await servicesAPI.update(currentService._id, currentService);
        toast.success('Service updated successfully');
      } else {
        await servicesAPI.create(currentService);
        toast.success('Service created successfully');
      }
      setIsModalOpen(false);
      loadServices();
      setCurrentService({ title: '', description: '', icon: 'Briefcase', order: 0 });
      setIsEditing(false);
    } catch (error) {
      toast.error('Operation failed');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this service?')) {
      try {
        await servicesAPI.delete(id);
        toast.success('Service deleted successfully');
        loadServices();
      } catch (error) {
        toast.error('Failed to delete service');
      }
    }
  };

  const openEditModal = (service) => {
    setCurrentService(service);
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const openCreateModal = () => {
    setCurrentService({ title: '', description: '', icon: 'Briefcase', order: 0 });
    setIsEditing(false);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Manage Services</h1>
        <button
          onClick={openCreateModal}
          className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition font-semibold shadow-md"
        >
          <Plus size={20} /> Add Service
        </button>
      </div>

      <div className="bg-white dark:bg-[#0f172a] rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 dark:bg-gray-900/50 text-gray-500 dark:text-gray-400 text-sm uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4 font-medium">Title</th>
                <th className="px-6 py-4 font-medium">Description</th>
                <th className="px-6 py-4 font-medium">Icon</th>
                <th className="px-6 py-4 font-medium">Order</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {services.map((service) => (
                <tr key={service._id} className="hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors">
                  <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{service.title}</td>
                  <td className="px-6 py-4 text-gray-600 dark:text-gray-400 max-w-xs truncate">{service.description}</td>
                  <td className="px-6 py-4 text-gray-500 dark:text-gray-400">{service.icon}</td>
                  <td className="px-6 py-4 text-gray-500 dark:text-gray-400">{service.order}</td>
                  <td className="px-6 py-4 text-right">
                    <button onClick={() => openEditModal(service)} className="text-blue-600 hover:text-blue-800 mx-2 p-2 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors">
                      <Edit2 size={18} />
                    </button>
                    <button onClick={() => handleDelete(service._id)} className="text-red-600 hover:text-red-800 p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors">
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-[#0f172a] rounded-2xl w-full max-w-md shadow-2xl overflow-hidden border border-gray-100 dark:border-gray-800">
            <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">{isEditing ? 'Edit Service' : 'Add Service'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                &times;
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Title</label>
                <input
                  type="text"
                  required
                  value={currentService.title}
                  onChange={(e) => setCurrentService({ ...currentService, title: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-primary focus:outline-none dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Icon (Lucide Icon Name)</label>
                <input
                  type="text"
                  value={currentService.icon}
                  onChange={(e) => setCurrentService({ ...currentService, icon: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-primary focus:outline-none dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Order</label>
                <input
                  type="number"
                  value={currentService.order}
                  onChange={(e) => setCurrentService({ ...currentService, order: Number(e.target.value) })}
                  className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-primary focus:outline-none dark:text-white"
                />
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
                  <button
                    type="button"
                    onClick={async () => {
                      if (!currentService.title) {
                        return toast.error('Please enter service title first');
                      }
                      setAiLoading(true);
                      try {
                        const res = await aiAPI.generate({ prompt: currentService.title, type: 'skill' });
                        setCurrentService({ ...currentService, description: res.data.data });
                        toast.success('Generated description with AI!');
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
                        <Loader2 size={12} className="animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Sparkles size={12} />
                        Generate
                      </>
                    )}
                  </button>
                </div>
                <textarea
                  value={currentService.description}
                  required
                  onChange={(e) => setCurrentService({ ...currentService, description: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-primary focus:outline-none dark:text-white h-24 resize-none"
                  placeholder="Describe this service or click Generate to auto-fill"
                ></textarea>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-primary text-white rounded-xl hover:bg-blue-700 font-medium transition-colors shadow-md"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageServices;
