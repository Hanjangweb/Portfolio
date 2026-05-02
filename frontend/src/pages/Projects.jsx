import React, { useEffect, useState } from 'react';
import { projectsAPI } from '../utils/api';
import { ProjectCard } from '../components/Cards';
import { useFetch } from '../hooks/useCustom';
import { Filter, Search } from 'lucide-react';
import { motion } from 'framer-motion';

export const Projects = () => {
  const { fetchData, loading } = useFetch();
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const loadProjects = async () => {
      try {
        const data = await fetchData(() => projectsAPI.getAll());
        setProjects(data?.data || []);
        setFilteredProjects(data?.data || []);
      } catch (error) {
        console.error('Error loading projects:', error);
      }
    };
    loadProjects();
  }, [fetchData]);

  const categories = ['all', ...new Set(projects.map(p => p.category))];

  const handleCategoryFilter = (category) => {
    setSelectedCategory(category);
    filterProjects(category, searchTerm);
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
    filterProjects(selectedCategory, term);
  };

  const filterProjects = (category, search) => {
    let filtered = projects;
    if (category !== 'all') {
      filtered = filtered.filter(p => p.category === category);
    }
    if (search) {
      filtered = filtered.filter(p => 
        p.title.toLowerCase().includes(search.toLowerCase()) ||
        p.description.toLowerCase().includes(search.toLowerCase()) ||
        p.technologies?.some(t => t.toLowerCase().includes(search.toLowerCase()))
      );
    }
    setFilteredProjects(filtered);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden py-20 lg:py-32">
      {/* Background decoration */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-[500px] bg-blue-500/10 dark:bg-blue-600/10 blur-[120px] pointer-events-none rounded-full" />
      <div className="absolute inset-0 bg-grid-pattern opacity-30 pointer-events-none mask-image-linear-gradient"></div>

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-16 text-center"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-semibold text-sm mb-4 border border-blue-100 dark:border-blue-800">
            Portfolio
          </span>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight">
            My <span className="text-gradient drop-shadow-sm">Projects</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Explore my portfolio of web applications, designs, and digital solutions crafted with modern technologies.
          </p>
        </motion.div>

        {/* Search Bar */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8 max-w-2xl mx-auto"
        >
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-500"></div>
            <div className="relative">
              <Search className="absolute left-4 top-4 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search projects by name, description, or technology..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-2xl border border-white/20 dark:border-white/10 bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary shadow-lg transition-all"
              />
            </div>
          </div>
        </motion.div>

        {/* Filter Buttons */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex flex-wrap gap-3 justify-center mb-16"
        >
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => handleCategoryFilter(category)}
              className={`px-6 py-2.5 rounded-full transition-all duration-300 font-semibold flex items-center gap-2 ${
                selectedCategory === category
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/30 scale-105'
                  : 'bg-white/50 dark:bg-slate-800/50 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:border-blue-500 hover:text-blue-500 backdrop-blur-sm'
              }`}
            >
              <Filter size={16} />
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </motion.div>

        {/* Projects Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-24">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : filteredProjects.length > 0 ? (
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {filteredProjects.map((project) => (
              <motion.div
                key={project._id}
                variants={{
                  hidden: { opacity: 0, y: 30 },
                  visible: { opacity: 1, y: 0 }
                }}
              >
                <ProjectCard project={project} />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-24 glass rounded-3xl"
          >
            <div className="w-20 h-20 bg-gray-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="text-gray-400" size={32} />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">No projects found</h3>
            <p className="text-gray-500 dark:text-gray-400">Try adjusting your search or filter criteria.</p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Projects;
