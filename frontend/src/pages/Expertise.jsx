import React, { useState, useEffect } from 'react';
import { skillsAPI } from '../utils/api';
import { useFetch } from '../hooks/useCustom';
import { SkillCard } from '../components/Cards';
import { motion } from 'framer-motion';

const Expertise = () => {
  const { fetchData, loading } = useFetch();
  const [skills, setSkills] = useState([]);

  useEffect(() => {
    const loadSkills = async () => {
      try {
        const data = await fetchData(() => skillsAPI.getAll());
        setSkills(data?.data || []);
      } catch (error) {
        console.error('Error loading skills:', error);
      }
    };
    loadSkills();
  }, [fetchData]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-16 lg:py-24 relative">
      {/* Background decoration */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-64 bg-blue-500/10 dark:bg-blue-500/5 blur-[100px] pointer-events-none rounded-full" />
      
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-16 relative z-10"
      >
        <span className="inline-block px-4 py-1.5 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-semibold text-sm mb-4 border border-blue-100 dark:border-blue-800">
          Technical Arsenal
        </span>
        <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">
          My <span className="text-gradient">Expertise</span>
        </h1>
        <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto text-lg leading-relaxed">
          A comprehensive overview of the technologies and tools I use to build robust, scalable, and visually stunning applications.
        </p>
      </motion.div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : (
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {skills.map((skill, index) => (
            <motion.div
              key={skill._id || index}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 }
              }}
              whileHover={{ y: -5 }}
              transition={{ duration: 0.2 }}
            >
              <SkillCard skill={skill} />
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default Expertise;
