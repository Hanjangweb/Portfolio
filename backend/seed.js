import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import Project from './models/Project.js';
import Skill from './models/Skill.js';
import BlogPost from './models/BlogPost.js';
import Testimonial from './models/Testimonial.js';

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected for seeding');
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    process.exit(1);
  }
};

const generateSlug = (title) => {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
};

const seedData = async () => {
  try {
    // Clear existing data
    await User.deleteMany();
    await Project.deleteMany();
    await Skill.deleteMany();
    await BlogPost.deleteMany();
    await Testimonial.deleteMany();

    // Create admin user
    const adminUser = await User.create({
      name: 'Admin User',
      email: 'admin@example.com',
      password: 'password',
      role: 'admin',
    });

    console.log('Admin user created:', adminUser.email);

    // Create sample projects
    const projects = [
      {
        title: 'E-Commerce Platform',
        description: 'A full-stack e-commerce solution with React, Node.js, and MongoDB. Features include user authentication, payment processing, and admin dashboard.',
        image: 'https://via.placeholder.com/400x300/4F46E5/FFFFFF?text=E-Commerce',
        technologies: ['React', 'Node.js', 'MongoDB', 'Stripe', 'Tailwind CSS'],
        link: 'https://example-ecommerce.com',
        github: 'https://github.com/example/ecommerce',
        category: 'web',
        featured: true,
      },
      {
        title: 'Task Management App',
        description: 'A collaborative task management application with real-time updates, drag-and-drop functionality, and team collaboration features.',
        image: 'https://via.placeholder.com/400x300/059669/FFFFFF?text=Task+Manager',
        technologies: ['React', 'Express', 'Socket.io', 'PostgreSQL'],
        link: 'https://example-tasks.com',
        github: 'https://github.com/example/tasks',
        category: 'web',
        featured: true,
      },
      {
        title: 'Weather Dashboard',
        description: 'A responsive weather dashboard with location-based forecasts, interactive maps, and weather alerts.',
        image: 'https://via.placeholder.com/400x300/F59E0B/FFFFFF?text=Weather+App',
        technologies: ['Vue.js', 'OpenWeather API', 'Chart.js'],
        link: 'https://example-weather.com',
        github: 'https://github.com/example/weather',
        category: 'web',
      },
    ];

    await Project.insertMany(projects);
    console.log('Projects seeded');

    // Create sample skills
    const skills = [
      { name: 'JavaScript', category: 'frontend', level: 95, description: 'Modern ES6+ JavaScript development' },
      { name: 'React', category: 'frontend', level: 90, description: 'Component-based UI development' },
      { name: 'Node.js', category: 'backend', level: 85, description: 'Server-side JavaScript runtime' },
      { name: 'Python', category: 'backend', level: 80, description: 'Data processing and automation' },
      { name: 'MongoDB', category: 'database', level: 85, description: 'NoSQL database design' },
      { name: 'PostgreSQL', category: 'database', level: 75, description: 'Relational database management' },
      { name: 'AWS', category: 'tools', level: 70, description: 'Cloud infrastructure and deployment' },
      { name: 'Docker', category: 'tools', level: 75, description: 'Containerization and deployment' },
    ];

    await Skill.insertMany(skills);
    console.log('Skills seeded');

    // Create sample blog posts
    const blogPosts = [
      {
        title: 'Building Modern Web Applications with React',
        slug: generateSlug('Building Modern Web Applications with React'),
        excerpt: 'Learn how to build scalable and maintainable web applications using React and modern development practices.',
        content: 'React has revolutionized the way we build web applications...',
        category: 'web',
        tags: ['react', 'javascript', 'web-development'],
        published: true,
      },
      {
        title: 'The Future of Full-Stack Development',
        slug: generateSlug('The Future of Full-Stack Development'),
        excerpt: 'Exploring the latest trends and technologies shaping the future of full-stack development.',
        content: 'Full-stack development continues to evolve...',
        category: 'tutorial',
        tags: ['fullstack', 'nodejs', 'mongodb'],
        published: true,
      },
      {
        title: 'Optimizing Database Performance',
        slug: generateSlug('Optimizing Database Performance'),
        excerpt: 'Best practices for optimizing database queries and improving application performance.',
        content: 'Database optimization is crucial for application performance...',
        category: 'tutorial',
        tags: ['database', 'performance', 'mongodb'],
        published: true,
      },
    ];

    await BlogPost.insertMany(blogPosts);
    console.log('Blog posts seeded');

    // Create sample testimonials
    const testimonials = [
      {
        name: 'John Smith',
        role: 'CEO, TechCorp',
        message: 'Outstanding work! The portfolio website exceeded our expectations and helped us attract top talent.',
        rating: 5,
        featured: true,
      },
      {
        name: 'Sarah Johnson',
        role: 'Product Manager, StartupXYZ',
        message: 'Professional, responsive, and delivered on time. Highly recommend for any web development project.',
        rating: 5,
        featured: true,
      },
      {
        name: 'Mike Davis',
        role: 'CTO, InnovateLabs',
        message: 'Great attention to detail and excellent communication throughout the project.',
        rating: 5,
        featured: true,
      },
    ];

    await Testimonial.insertMany(testimonials);
    console.log('Testimonials seeded');

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

connectDB().then(seedData);