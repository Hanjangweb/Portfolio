import React from 'react';
import { ExternalLink, Github, ArrowRight, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getImageUrl } from '../utils/api';

// ─── PROJECT CARD ─────────────────────────────────────────────────
export const ProjectCard = ({ project }) => {
  const MAX_PILLS = 3;
  const visibleTech = project.technologies?.slice(0, MAX_PILLS) || [];
  const extraCount = (project.technologies?.length || 0) - MAX_PILLS;

  return (
    <div className="group bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl overflow-hidden flex flex-col h-full hover:-translate-y-1 hover:shadow-xl transition-all duration-300">

      {/* Thumbnail */}
      <div className="relative aspect-video overflow-hidden bg-gray-100 dark:bg-gray-800 flex-shrink-0">
        <img
          src={project.image ? getImageUrl(project.image) : 'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=800&q=80'}
          alt={project.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
        />

        {/* Gradient overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Featured badge */}
        {project.featured && (
          <span className="absolute top-3 left-3 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm text-gray-700 dark:text-gray-300 text-[11px] font-medium px-3 py-1 rounded-full border border-gray-200 dark:border-gray-700">
            Featured
          </span>
        )}

        {/* Hover action buttons */}
        <div className="absolute bottom-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
          {project.link && (
            <a
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 rounded-lg bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm flex items-center justify-center text-gray-800 dark:text-gray-200 hover:bg-white dark:hover:bg-gray-800 transition-colors text-sm font-bold"
              title="Live Demo"
            >
              ↗
            </a>
          )}
          {project.github && (
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 rounded-lg bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm flex items-center justify-center text-gray-800 dark:text-gray-200 hover:bg-white dark:hover:bg-gray-800 transition-colors"
              title="GitHub"
            >
              <Github size={13} />
            </a>
          )}
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-col flex-1 gap-3 p-4">

        {/* Title — 1 line clamp */}
        <h3 className="text-[15px] font-semibold text-gray-900 dark:text-gray-100 leading-snug line-clamp-1">
          {project.title}
        </h3>

        {/* Description — 2 line clamp */}
        <p className="text-[13px] text-gray-500 dark:text-gray-400 leading-relaxed line-clamp-2 flex-1">
          {project.description}
        </p>

        {/* Tech pills with overflow count */}
        <div className="flex flex-wrap gap-1.5">
          {visibleTech.map((tech) => (
            <span
              key={tech}
              className="text-[11px] font-medium px-2.5 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700"
            >
              {tech}
            </span>
          ))}
          {extraCount > 0 && (
            <span className="text-[11px] text-gray-400 dark:text-gray-500 self-center pl-0.5">
              +{extraCount} more
            </span>
          )}
        </div>

        {/* Footer buttons */}
        <div className="flex gap-2 pt-3 border-t border-gray-100 dark:border-gray-800 mt-auto">
          {project.link && (
            <a
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-1.5 text-[12px] font-medium py-2 px-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors"
            >
              <ExternalLink size={12} />
              Live Demo
            </a>
          )}
          {project.github && (
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-1.5 text-[12px] font-medium py-2 px-3 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <Github size={12} />
              Source
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

// ─── SKILL CARD ───────────────────────────────────────────────────
export const SkillCard = ({ skill }) => {
  const level = skill.level || 80;

  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-4 hover:border-gray-300 dark:hover:border-gray-600 transition-colors duration-200">

      {/* Header */}
      <div className="flex items-start justify-between gap-2 mb-3">
        {/* Name — 1 line clamp */}
        <h3 className="text-[14px] font-semibold text-gray-900 dark:text-gray-100 line-clamp-1 flex-1">
          {skill.name}
        </h3>
        <span className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-2 py-0.5 rounded-full shrink-0">
          {level}%
        </span>
      </div>

      {/* Progress bar */}
      <div className="h-1.5 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden mb-3">
        <div
          className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-700 ease-out"
          style={{ width: `${level}%` }}
        />
      </div>

      {/* Description — 2 line clamp */}
      <p className="text-[12px] text-gray-500 dark:text-gray-400 leading-relaxed line-clamp-4">
        {skill.description}
      </p>
    </div>
  );
};

// ─── BLOG CARD ────────────────────────────────────────────────────
export const BlogCard = ({ post }) => {
  return (
    <article className="group bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl overflow-hidden flex flex-col hover:-translate-y-1 hover:shadow-lg hover:border-gray-200 dark:hover:border-gray-700 transition-all duration-300">

      {/* Thumbnail */}
      {post.image && (
        <div className="aspect-[2/1] bg-gray-100 dark:bg-gray-800 overflow-hidden flex-shrink-0">
          <img
            src={getImageUrl(post.image)}
            alt={post.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          />
        </div>
      )}

      {/* Body */}
      <div className="flex flex-col flex-1 gap-2.5 p-4">

        {/* Meta row */}
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
            {post.category}
          </span>
          <span className="text-[11px] text-gray-400 dark:text-gray-500">
            {new Date(post.createdAt).toLocaleDateString(undefined, {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            })}
          </span>
        </div>

        {/* Title — 2 line clamp */}
        <h2 className="text-[15px] font-semibold text-gray-900 dark:text-gray-100 leading-snug line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200">
          {post.title}
        </h2>

        {/* Excerpt — 3 line clamp */}
        <p className="text-[12px] text-gray-500 dark:text-gray-400 leading-relaxed line-clamp-4 flex-1">
          {post.excerpt}
        </p>

        {/* Read link */}
        <Link
          to={`/blog/${post._id}`}
          className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 pt-3 border-t border-gray-100 dark:border-gray-800 mt-auto transition-colors group/link"
        >
          Read Article
          <ArrowRight size={13} className="group-hover/link:translate-x-1 transition-transform duration-200" />
        </Link>
      </div>
    </article>
  );
};

// ─── TESTIMONIAL CARD ─────────────────────────────────────────────
const AVATAR_COLORS = [
  'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
  'bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400',
  'bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400',
  'bg-orange-50 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400',
  'bg-teal-50 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400',
];

export const TestimonialCard = ({ testimonial }) => {
  const initials = testimonial.name
    .split(' ')
    .slice(0, 2)
    .map((n) => n[0])
    .join('');

  const colorClass = AVATAR_COLORS[testimonial.name.charCodeAt(0) % AVATAR_COLORS.length];
  const rating = testimonial.rating || 5;

  return (
    <div className="group bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-4 hover:border-gray-300 dark:hover:border-gray-600 hover:-translate-y-1 hover:shadow-lg transition-all duration-300">

      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        {testimonial.image ? (
          <img
            src={getImageUrl(testimonial.image)}
            alt={testimonial.name}
            className="w-10 h-10 rounded-full object-cover border border-gray-200 dark:border-gray-700 shrink-0"
          />
        ) : (
          <div className={`w-10 h-10 rounded-full flex items-center justify-center text-[13px] font-semibold shrink-0 ${colorClass}`}>
            {initials}
          </div>
        )}

        <div className="min-w-0">
          {/* Name — 1 line clamp */}
          <p className="text-[14px] font-semibold text-gray-900 dark:text-gray-100 line-clamp-1">
            {testimonial.name}
          </p>
          {/* Role — 1 line clamp */}
          <p className="text-[11px] text-gray-400 dark:text-gray-500 line-clamp-1">
            {testimonial.role}
          </p>
        </div>
      </div>

      {/* Quote — 4 line clamp */}
      <blockquote className="border-l-2 border-gray-200 dark:border-gray-700 pl-3 mb-4">
        <p className="text-[13px] text-gray-600 dark:text-gray-400 leading-relaxed italic line-clamp-4">
          {testimonial.message}
        </p>
      </blockquote>

      {/* Stars */}
      <div className="flex gap-0.5">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            size={13}
            className={
              i < rating
                ? 'text-amber-400 fill-amber-400'
                : 'text-gray-200 dark:text-gray-700 fill-gray-200 dark:fill-gray-700'
            }
          />
        ))}
      </div>
    </div>
  );
};

export default { ProjectCard, SkillCard, BlogCard, TestimonialCard };