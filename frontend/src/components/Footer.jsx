import React, { useEffect, useState } from 'react';
import { Github, Linkedin, Twitter, Mail, Instagram, ExternalLink, FileText, ChevronRight, Download, Code2 } from 'lucide-react';
import { footerAPI, settingsAPI } from '../utils/api';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const getSocialIcon = (socialName) => {
  const name = socialName?.toLowerCase() || '';
  if (name.includes('github')) return Github;
  if (name.includes('linkedin')) return Linkedin;
  if (name.includes('twitter') || name.includes('x.com')) return Twitter;
  if (name.includes('instagram')) return Instagram;
  if (name.includes('email') || name.includes('mail')) return Mail;
  return ExternalLink;
};

export const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [footerLinks, setFooterLinks] = useState([]);
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [linksRes, settingsRes] = await Promise.all([
          footerAPI.getAll(),
          settingsAPI.get()
        ]);
        setFooterLinks(linksRes.data.data || []);
        setSettings(settingsRes.data.data);
      } catch (error) {
        console.error('Error fetching footer data:', error);
      }
    };
    fetchData();
  }, []);

  const sections = ['Menu', 'Resources', 'Follow'];
  
  // Map old section name to new for backward compatibility
  const getSectionLinks = (section) => {
    if (section === 'Menu') {
      return footerLinks.filter(link => link.section === 'Quick Links' || link.section === 'Menu');
    }
    return footerLinks.filter(link => link.section === section);
  };

  const handleDownload = (link) => {
    try {
      const a = document.createElement('a');
      a.href = link.url;
      a.download = link.name || 'download';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      toast.success(`Downloaded ${link.name}`);
    } catch (error) {
      toast.error('Download failed');
    }
  };

  return (
    <footer className="relative bg-[#020617] text-white mt-20 border-t border-gray-800/50 min-h-[500px] flex flex-col overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-blue-600/10 blur-[100px] pointer-events-none rounded-full" />
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.02] pointer-events-none"></div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 py-12 md:py-16 w-full flex-grow">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 mb-12 md:mb-16">
          {/* Brand Section */}
          <div className="col-span-1">
            <h3 className="font-bold text-2xl md:text-3xl mb-4 md:mb-6 bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent inline-flex items-center gap-2">
              <Code2 size={28} className="text-blue-500" />
              {settings?.siteName || 'Portfolio'}
            </h3>
            <p className="text-gray-400 leading-relaxed text-sm max-w-xs">
              {settings?.footerText || 'Full-stack developer passionate about creating amazing digital experiences.'}
            </p>
          </div>

          {/* Sections */}
          {sections.map(section => (
            <div key={section} className={`col-span-1 ${section === 'Follow' ? 'flex flex-col' : ''}`}>
              <h4 className="font-bold text-base md:text-lg mb-4 md:mb-8 text-white relative inline-block">
                {section}
                <span className="absolute -bottom-2 left-0 w-8 h-1 bg-primary rounded-full"></span>
              </h4>
              <ul className={`space-y-3 md:space-y-4 list-none p-0 m-0 ${section === 'Follow' ? 'flex flex-wrap gap-2' : ''}`}>
                {getSectionLinks(section)
                  .sort((a, b) => a.order - b.order)
                  .map(link => {
                    const isResume = link.name.toLowerCase().includes('resume');
                    const isDownloadable = link.url.endsWith('.pdf') || isResume;
                    const SocialIcon = section === 'Follow' ? getSocialIcon(link.name) : null;
                    
                    return (
                      <li key={link._id} className="group">
                        {section === 'Follow' ? (
                          // Social Links with Icons
                          <a 
                            href={link.url} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            title={link.name}
                            className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 transition-all border border-white/5 hover:border-white/20"
                          >
                            {SocialIcon ? <SocialIcon size={18} /> : <ExternalLink size={18} />}
                          </a>
                        ) : isDownloadable && link.url.startsWith('http') ? (
                          // Download Link
                          <button 
                            onClick={() => handleDownload(link)}
                            className="text-gray-400 hover:text-blue-400 transition-all flex items-center gap-3 text-sm md:text-base"
                          >
                            <Download size={16} />
                            <span>{link.name}</span>
                          </button>
                        ) : link.url.startsWith('http') ? (
                          // External Link
                          <a 
                            href={link.url} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="text-gray-400 hover:text-blue-400 transition-all flex items-center gap-3 text-sm md:text-base"
                          >
                            <FileText size={14} />
                            {link.name}
                          </a>
                        ) : (
                          // Internal Link
                          <Link 
                            to={link.url} 
                            className="text-gray-400 hover:text-blue-400 transition-all flex items-center gap-3 text-sm md:text-base"
                          >
                            <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                            {link.name}
                          </Link>
                        )}
                      </li>
                    );
                  })}
                
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800/50 pt-8 md:pt-10 flex flex-col md:flex-row justify-between items-center gap-6 md:gap-8">
          <p className="text-gray-500 text-xs md:text-sm font-medium text-center md:text-left">
            © {currentYear} {settings?.siteName || 'Portfolio'}. Crafted with <span className="text-red-500">❤️</span> using MERN.
          </p>
          
          {/* Social Icons (if Follow section is empty) */}
          {footerLinks.filter(link => link.section === 'Follow').length === 0 && (
            <div className="flex gap-3 md:gap-4 ">
              {settings?.socialLinks?.github && (
                <a href={settings.socialLinks.github} target="_blank" rel="noreferrer" title="GitHub" className="w-9 md:w-10 h-9 md:h-10 rounded-lg bg-white/5 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-all border border-white/5 hover:border-white/20"><Github size={18} /></a>
              )}
              {settings?.socialLinks?.linkedin && (
                <a href={settings.socialLinks.linkedin} target="_blank" rel="noreferrer" title="LinkedIn" className="w-9 md:w-10 h-9 md:h-10 rounded-lg bg-white/5 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-all border border-white/5 hover:border-white/20"><Linkedin size={18} /></a>
              )}
              {settings?.socialLinks?.twitter && (
                <a href={settings.socialLinks.twitter} target="_blank" rel="noreferrer" title="Twitter" className="w-9 md:w-10 h-9 md:h-10 rounded-lg bg-white/5 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-all border border-white/5 hover:border-white/20"><Twitter size={18} /></a>
              )}
              {settings?.socialLinks?.instagram && (
                <a href={settings.socialLinks.instagram} target="_blank" rel="noreferrer" title="Instagram" className="w-9 md:w-10 h-9 md:h-10 rounded-lg bg-white/5 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-all border border-white/5 hover:border-white/20"><Instagram size={18} /></a>
              )}
              {settings?.email && (
                <a href={`mailto:${settings.email}`} title="Email" className="w-9 md:w-10 h-9 md:h-10 rounded-lg bg-white/5 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-all border border-white/5 hover:border-white/20"><Mail size={18} /></a>
              )}
            </div>
          )}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
