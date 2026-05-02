import React, { useEffect, useState } from 'react';
import { projectsAPI, uploadAPI, aiAPI, getImageUrl } from '../../utils/api';
import { useFetch, useForm } from '../../hooks/useCustom';
import toast from 'react-hot-toast';
import { Plus, Trash2, Edit2, Upload, Sparkles, Loader2 } from 'lucide-react';

export const ManageProjects = () => {
  const { fetchData } = useFetch();
  const [projects, setProjects] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);

  const { values, handleChange, handleSubmit, loading, resetForm, setValues } = useForm(
    {
      title: '',
      description: '',
      image: '',
      link: '',
      github: '',
      category: 'web',
      technologies: '',
    },
    async (formData) => {
      try {
        const techArray = formData.technologies.split(',').map(t => t.trim());
        const data = { ...formData, technologies: techArray };

        if (editingId) {
          await projectsAPI.update(editingId, data);
          toast.success('Project updated successfully!');
          setEditingId(null);
        } else {
          await projectsAPI.create(data);
          toast.success('Project created successfully!');
        }
        
        resetForm();
        setShowForm(false);
        loadProjects();
      } catch (error) {
        toast.error(error.response?.data?.message || 'Error saving project');
      }
    }
  );

  const loadProjects = async () => {
    try {
      const data = await fetchData(() => projectsAPI.getAll());
      setProjects(data?.data || []);
    } catch (error) {
      console.error('Error loading projects:', error);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const handleEdit = (project) => {
    setValues({
      title: project.title,
      description: project.description,
      image: project.image || '',
      link: project.link || '',
      github: project.github || '',
      category: project.category,
      technologies: project.technologies?.join(', ') || '',
    });
    setEditingId(project._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure?')) {
      try {
        await projectsAPI.delete(id);
        toast.success('Project deleted successfully!');
        loadProjects();
      } catch (error) {
        toast.error('Error deleting project');
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
      setValues({ ...values, image: res.data.data });
      toast.success('Image uploaded!');
    } catch (error) {
      toast.error('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleGenerateDescription = async () => {
    if (!values.title) {
      return toast.error('Please enter a project title first');
    }

    setAiLoading(true);
    try {
      const res = await aiAPI.generate({ prompt: values.title, type: 'description' });
      setValues({ ...values, description: res.data.data });
      toast.success('Description generated with AI!');
    } catch (error) {
      toast.error('AI Generation failed');
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Manage Projects</h1>
        <button
          onClick={() => {
            setShowForm(!showForm);
            if (showForm) {
              resetForm();
              setEditingId(null);
            }
          }}
          className="flex items-center gap-2 px-6 py-2 bg-primary text-white rounded-xl hover:bg-blue-700 transition font-semibold shadow-md"
        >
          {showForm ? 'Cancel' : <><Plus size={20} /> Add Project</>}
        </button>
      </div>

      {showForm && (
        <div className="bg-white dark:bg-[#0f172a] p-8 rounded-[2rem] border border-gray-100 dark:border-gray-800 shadow-sm animate-fade-in">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">{editingId ? 'Edit' : 'Add'} Project</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Title</label>
                <input
                  type="text"
                  name="title"
                  value={values.title}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border-none rounded-xl focus:ring-2 focus:ring-primary dark:text-white"
                  placeholder="Project Name"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Category</label>
                <select
                  name="category"
                  value={values.category}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border-none rounded-xl focus:ring-2 focus:ring-primary dark:text-white"
                >
                  <option value="web">Web</option>
                  <option value="mobile">Mobile</option>
                  <option value="design">Design</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300">Description</label>
                <button
                  type="button"
                  onClick={handleGenerateDescription}
                  disabled={aiLoading}
                  className="flex items-center gap-1.5 text-xs font-bold text-primary hover:text-blue-700 transition bg-blue-50 dark:bg-blue-900/30 px-3 py-1.5 rounded-full"
                >
                  {aiLoading ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
                  AI Generate
                </button>
              </div>
              <textarea
                name="description"
                value={values.description}
                onChange={handleChange}
                required
                rows="4"
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border-none rounded-xl focus:ring-2 focus:ring-primary dark:text-white"
                placeholder="Describe your project..."
              ></textarea>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Project Image</label>
                <div className="flex flex-col gap-4">
                  {values.image && (
                    <img 
                      src={values.image} 
                      alt="Preview" 
                      className="w-full h-32 object-cover rounded-xl border border-gray-100 dark:border-gray-800"
                    />
                  )}
                  <div className="relative group">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    />
                    <div className="flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-xl group-hover:bg-gray-200 dark:group-hover:bg-gray-700 transition border-2 border-dashed border-gray-300 dark:border-gray-700">
                      {uploading ? <Loader2 size={20} className="animate-spin" /> : <Upload size={20} />}
                      <span className="font-bold text-sm">{uploading ? 'Uploading...' : 'Choose Image'}</span>
                    </div>
                  </div>
                  <input
                    type="text"
                    name="image"
                    value={values.image}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border-none rounded-lg text-xs text-gray-400"
                    placeholder="Or enter URL"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Technologies (comma-separated)</label>
                <input
                  type="text"
                  name="technologies"
                  value={values.technologies}
                  onChange={handleChange}
                  placeholder="React, Node.js, MongoDB"
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border-none rounded-xl focus:ring-2 focus:ring-primary dark:text-white"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Live Link</label>
                <input
                  type="url"
                  name="link"
                  value={values.link}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border-none rounded-xl focus:ring-2 focus:ring-primary dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">GitHub Link</label>
                <input
                  type="url"
                  name="github"
                  value={values.github}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border-none rounded-xl focus:ring-2 focus:ring-primary dark:text-white"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-primary text-white rounded-xl font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-600/20 disabled:opacity-50"
            >
              {loading ? 'Saving...' : editingId ? 'Update Project' : 'Create Project'}
            </button>
          </form>
        </div>
      )}

      {/* Projects Table */}
      <div className="bg-white dark:bg-[#0f172a] rounded-[2rem] border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-900/50 text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider">
                <th className="py-4 px-6 font-bold">Project</th>
                <th className="py-4 px-6 font-bold">Category</th>
                <th className="py-4 px-6 font-bold">Tech</th>
                <th className="py-4 px-6 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {projects.map((project) => (
                <tr key={project._id} className="hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors group">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <img src={project.image ? getImageUrl(project.image) : ''} alt="" className="w-10 h-10 rounded-lg object-cover" />
                      <span className="font-bold text-gray-900 dark:text-white">{project.title}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full text-xs font-bold uppercase">
                      {project.category}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-sm text-gray-500 dark:text-gray-400">
                    {project.technologies?.slice(0, 2).join(', ')}...
                  </td>
                  <td className="py-4 px-6 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => handleEdit(project)}
                        className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(project._id)}
                        className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition"
                      >
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
    </div>
  );
};

export default ManageProjects;
