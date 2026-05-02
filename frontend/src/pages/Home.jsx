import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { projectsAPI, skillsAPI, testimonialsAPI } from '../utils/api';
import { ProjectCard, SkillCard, TestimonialCard } from '../components/Cards';
import { ArrowRight, Code2, Zap, Target, Sparkles } from 'lucide-react';
import { useFetch } from '../hooks/useCustom';

export const Home = () => {
  const { fetchData } = useFetch();
  const [projects, setProjects] = useState([]);
  const [skills, setSkills] = useState([]);
  const [testimonials, setTestimonials] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [projectsData, skillsData, testimonialsData] = await Promise.all([
          fetchData(() => projectsAPI.getAll()),
          fetchData(() => skillsAPI.getAll()),
          fetchData(() => testimonialsAPI.getAll()),
        ]);
        setProjects(projectsData?.data?.slice(0, 3) || []);
        setSkills(skillsData?.data?.slice(0, 6) || []);
        setTestimonials(testimonialsData?.data?.slice(0, 3) || []);
      } catch (error) {
        console.error('Error loading data:', error);
      }
    };
    loadData();
  }, [fetchData]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  };

  const marqueeItems = skills.length > 0
    ? skills.map((skill) => skill.name)
    : ['React', 'Node.js', 'MongoDB', 'JavaScript', 'TypeScript', 'AWS', 'GraphQL'];

  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* Hero Section */}
      <section className="relative max-w-8xl mx-auto px-4 py-24 md:py-32 text-center overflow-hidden min-h-[90vh] flex flex-col justify-center">
        {/* Animated Background Gradients */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-500/20 rounded-full blur-[120px] pointer-events-none dark:bg-blue-600/10 animate-pulse-slow"></div>
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-500/20 rounded-full blur-[100px] pointer-events-none dark:bg-purple-600/10"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-indigo-500/20 rounded-full blur-[120px] pointer-events-none dark:bg-indigo-600/10"></div>
        <div className="absolute inset-0 bg-grid-pattern opacity-30 pointer-events-none mask-image-linear-gradient"></div>
        
        <motion.div 
          className="relative z-10"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-sm font-medium mb-8 text-primary border border-blue-200 dark:border-blue-800 shadow-sm backdrop-blur-xl">
            <Sparkles size={16} className="animate-pulse" />
            <span>Available for new projects</span>
          </motion.div>
          
          <motion.h1 variants={itemVariants} className="text-6xl md:text-8xl lg:text-9xl font-bold mb-6 tracking-tight animate-float">
            Full stack <span className="text-gradient drop-shadow-sm">Engineer</span>
          </motion.h1>
          
          <motion.p variants={itemVariants} className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 mb-10 max-w-2xl mx-auto font-light leading-relaxed">
            I craft digital experiences that combine stunning design with robust engineering.
          </motion.p>
          
          <motion.div variants={itemVariants} className="flex gap-4 justify-center flex-wrap">
            <Link
              to="/projects"
              className="group inline-flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground rounded-full hover:scale-105 transition-all font-semibold shadow-[0_0_40px_-10px_rgba(37,99,235,0.5)] hover:shadow-[0_0_60px_-15px_rgba(37,99,235,0.7)]"
            >
              View My Work
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 px-8 py-4 glass text-[var(--foreground)] rounded-full hover:bg-white/30 dark:hover:bg-black/40 hover:scale-105 transition-all font-semibold"
            >
              Get In Touch
            </Link>
          </motion.div>
        </motion.div>

        {/* Stats */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-3 gap-6 mt-32 max-w-4xl mx-auto relative z-10"
        >
          {[
            { label: 'Projects Completed', value: '20+' },
            { label: 'Happy Clients', value: '10+' },
            { label: 'Years Experience', value: '2+' },
          ].map((stat, idx) => (
            <div key={idx} className="glass p-8 rounded-3xl text-center transform hover:-translate-y-2 hover:shadow-2xl transition-all duration-300 border border-white/20 dark:border-white/10 relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="text-4xl md:text-5xl font-bold text-gradient mb-2 relative z-10">{stat.value}</div>
              <p className="text-sm md:text-base text-gray-500 dark:text-gray-400 uppercase tracking-wider font-semibold relative z-10">{stat.label}</p>
            </div>
          ))}
        </motion.div>
      </section>

      {/* Skills Marquee */}
      <section className="max-w-full bg-gradient-to-r from-blue-600/10 to-indigo-600/10 border-y border-gray-200 dark:border-gray-800 py-8 md:py-12 overflow-hidden">
        <div className="relative flex items-center w-full">
          <div className="inline-flex animate-marquee gap-6 md:gap-8">
            {marqueeItems.concat(marqueeItems).concat(marqueeItems).map((skill, idx) => (
              <span key={`${skill}-${idx}`} className="px-6 md:px-8 py-3 md:py-4 rounded-full border border-blue-200 dark:border-blue-800 bg-white dark:bg-slate-900/50 text-sm md:text-base font-semibold text-gray-800 dark:text-gray-100 shadow-sm flex-shrink-0">
                ✨ {skill}
              </span>
            ))}
          </div>
        </div>
        <style>{`
          @keyframes marquee {
            0% { transform: translateX(0); }
            100% { transform: translateX(calc(-66.666% - 1rem)); }
          }
          .animate-marquee {
            animation: marquee 60s linear infinite;
          }
          .animate-marquee:hover {
            animation-play-state: paused;
          }
        `}</style>
      </section>

      {/* Features Section */}
      <section className="max-w-8xl mx-auto px-4 py-14 relative z-10">
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Why Choose Me</h2>
          <p className="text-gray-500 dark:text-gray-400 text-lg">Delivering excellence in every line of code</p>
        </motion.div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { icon: Code2, title: "Clean Code", desc: "Maintainable, scalable code following industry standards." },
            { icon: Zap, title: "High Performance", desc: "Optimized applications that provide smooth user experiences." },
            { icon: Target, title: "Goal Focused", desc: "Understanding your business needs to deliver impactful solutions." }
          ].map((feature, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.2 }}
              className="glass p-8 rounded-2xl hover:bg-white/20 dark:hover:bg-black/30 transition-colors"
            >
              <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-6 text-primary">
                <feature.icon size={32} />
              </div>
              <h3 className="text-2xl font-bold mb-3">{feature.title}</h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Recent Projects */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gray-50 dark:bg-gray-900/50" />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/10 blur-[120px] pointer-events-none rounded-full" />
        <div className="max-w-8xl mx-auto px-4 relative z-10">
          <div className="flex flex-col md:flex-row md:justify-between md:items-end mb-12 gap-4">
            <div className="text-center md:text-left">
              <span className="inline-block px-4 py-1.5 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-semibold text-sm mb-3 border border-blue-100 dark:border-blue-800">
                Portfolio
              </span>
              <h2 className="text-4xl md:text-5xl font-bold mb-2">Recent Work</h2>
              <p className="text-gray-500 dark:text-gray-400 text-lg">Some of my latest creations</p>
            </div>
            <Link to="/projects" className="group hidden md:flex items-center gap-2 text-primary font-semibold hover:text-blue-700 transition-colors">
              View All Projects
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {projects.map((project, idx) => (
              <motion.div
                key={project._id}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
              >
                <ProjectCard project={project} />
              </motion.div>
            ))}
          </div>
          {/* Mobile View All Button */}
          <div className="mt-10 text-center md:hidden">
            <Link
              to="/projects"
              className="group inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full font-semibold shadow-lg shadow-blue-500/30 hover:scale-105 transition-all"
            >
              View All Projects
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section className="max-w-8xl mx-auto px-4 py-14">
        <div className="flex justify-between items-end mb-12">
          <div className="text-center md:text-left">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">My Expertise</h2>
            <p className="text-gray-500 dark:text-gray-400 text-lg">Technologies I work with</p>
          </div>
          <Link to="/expertise" className="group hidden md:flex items-center gap-2 text-primary font-semibold hover:text-blue-700 transition-colors">
            View All Expertise
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {skills.map((skill, idx) => (
            <motion.div
              key={skill._id}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
            >
              <SkillCard skill={skill} />
            </motion.div>
          ))}
        </div>
        <div className="mt-8 text-center md:hidden">
          <Link to="/expertise" className="inline-flex items-center gap-2 text-primary font-semibold hover:text-blue-700 transition-colors">
            View All Expertise
            <ArrowRight size={20} />
          </Link>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-14 bg-gray-50 dark:bg-gray-900/50">
        <div className="max-w-8xl mx-auto px-4">
          <div className="flex justify-between items-end mb-12">
            <div className="text-center md:text-left">
              <h2 className="text-4xl md:text-5xl font-bold mb-4">Client Testimonials</h2>
              <p className="text-gray-500 dark:text-gray-400 text-lg">What people say about my work</p>
            </div>
            <Link to="/testimonials" className="group hidden md:flex items-center gap-2 text-primary font-semibold hover:text-blue-700 transition-colors">
              View All Testimonials
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, idx) => (
              <motion.div
                key={testimonial._id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
              >
                <TestimonialCard testimonial={testimonial} />
              </motion.div>
            ))}
          </div>
          <div className="mt-8 text-center md:hidden">
            <Link to="/testimonials" className="inline-flex items-center gap-2 text-primary font-semibold hover:text-blue-700 transition-colors">
              View All Testimonials
              <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-5xl mx-auto px-4 py-20">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative rounded-[2.5rem] overflow-hidden bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 p-12 text-center text-white shadow-2xl"
        >
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2"></div>
          <div className="relative z-10">
            <h2 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">Ready to Start Your Project?</h2>
            <p className="text-xl md:text-2xl mb-10 text-blue-100 max-w-2xl mx-auto font-light">
              Let's build something extraordinary together. I'm currently available for freelance work.
            </p>
            <Link
              to="/contact"
              className="inline-block px-10 py-5 bg-white text-blue-600 rounded-full hover:scale-105 transition-transform font-bold text-lg shadow-[0_0_40px_-10px_rgba(255,255,255,0.5)]"
            >
              Contact Me Today
            </Link>
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default Home;
