const BlogPost = require('../models/BlogPost');

// Public - get published posts
exports.getAll = async (req, res) => {
  try {
    const { category, page = 1, limit = 9 } = req.query;
    const filter = { isPublished: true };
    if (category) filter.category = category;

    const posts = await BlogPost.find(filter)
      .sort({ publishedAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await BlogPost.countDocuments(filter);

    res.json({
      posts,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      total,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Public - get by slug
exports.getBySlug = async (req, res) => {
  try {
    const post = await BlogPost.findOne({ slug: req.params.slug, isPublished: true });
    if (!post) return res.status(404).json({ message: 'Blog post not found' });
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Admin - get all (including drafts)
exports.getAllAdmin = async (req, res) => {
  try {
    const posts = await BlogPost.find().sort({ createdAt: -1 });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.create = async (req, res) => {
  try {
    const post = new BlogPost(req.body);
    await post.save();
    res.status(201).json(post);
  } catch (error) {
    res.status(400).json({ message: 'Error creating blog post', error: error.message });
  }
};

exports.update = async (req, res) => {
  try {
    const post = await BlogPost.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Blog post not found' });

    Object.assign(post, req.body);
    if (req.body.isPublished && !post.publishedAt) {
      post.publishedAt = new Date();
    }
    await post.save();
    res.json(post);
  } catch (error) {
    res.status(400).json({ message: 'Error updating blog post', error: error.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const post = await BlogPost.findByIdAndDelete(req.params.id);
    if (!post) return res.status(404).json({ message: 'Blog post not found' });
    res.json({ message: 'Blog post deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
