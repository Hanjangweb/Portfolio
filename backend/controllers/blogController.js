import BlogPost from "../models/BlogPost.js";
import { asyncHandler } from "../middleware/errorHandler.js";

// Get all blog posts
export const getBlogPosts = asyncHandler(async (req, res) => {
  const { published, tag, search, page = 1, limit = 10 } = req.query;
  let query = published !== undefined ? { published: published === 'true' } : {};

  if (tag) {
    query.tags = tag;
  }

  if (search) {
    query.$or = [
      { title: { $regex: search, $options: "i" } },
      { excerpt: { $regex: search, $options: "i" } },
      { content: { $regex: search, $options: "i" } },
    ];
  }

  const skip = (page - 1) * limit;
  const posts = await BlogPost.find(query)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));

  const total = await BlogPost.countDocuments(query);

  res.json({
    success: true,
    count: posts.length,
    total,
    totalPages: Math.ceil(total / limit),
    currentPage: parseInt(page),
    data: posts,
  });
});

// Get single blog post by id
export const getBlogPost = asyncHandler(async (req, res) => {
  const post = await BlogPost.findById(req.params.id);

  if (!post) {
    return res.status(404).json({ message: "Blog post not found" });
  }

  // Increment views
  post.views += 1;
  await post.save();

  res.json({
    success: true,
    data: post,
  });
});

// Create blog post (Admin)
export const createBlogPost = asyncHandler(async (req, res) => {
  const { title, excerpt, content, image, category, tags, published } = req.body;

  if (!title || !excerpt || !content) {
    return res.status(400).json({ message: "Please provide required fields" });
  }

  const post = await BlogPost.create({
    title,
    excerpt,
    content,
    image,
    category: category || 'other',
    tags: tags || [],
    published: published !== undefined ? published : true,
  });

  res.status(201).json({
    success: true,
    message: "Blog post created",
    data: post,
  });
});

// Update blog post (Admin)
export const updateBlogPost = asyncHandler(async (req, res) => {
  let post = await BlogPost.findById(req.params.id);

  if (!post) {
    return res.status(404).json({ message: "Blog post not found" });
  }

  post = await BlogPost.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.json({
    success: true,
    message: "Blog post updated",
    data: post,
  });
});

// Delete blog post (Admin)
export const deleteBlogPost = asyncHandler(async (req, res) => {
  const post = await BlogPost.findByIdAndDelete(req.params.id);

  if (!post) {
    return res.status(404).json({ message: "Blog post not found" });
  }

  res.json({
    success: true,
    message: "Blog post deleted",
  });
});

// Get all tags
export const getAllTags = asyncHandler(async (req, res) => {
  const tags = await BlogPost.distinct("tags", { published: true });
  
  res.json({
    success: true,
    data: tags,
  });
});
