const mongoose = require('mongoose');

const blogPostSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Blog title is required'],
    trim: true,
  },
  slug: {
    type: String,
    unique: true,
    lowercase: true,
  },
  content: {
    type: String,
    required: [true, 'Blog content is required'],
  },
  excerpt: {
    type: String,
    default: '',
  },
  thumbnail: {
    type: String,
    default: '',
  },
  author: {
    type: String,
    default: 'Vantaigo Team',
  },
  category: {
    type: String,
    default: 'Company Updates',
  },
  tags: [{
    type: String,
    trim: true,
  }],
  isPublished: {
    type: Boolean,
    default: false,
  },
  publishedAt: {
    type: Date,
  },
}, { timestamps: true });

// Auto-generate slug from title before saving
blogPostSchema.pre('save', function () {
  if (this.isModified('title')) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
  if (this.isPublished && !this.publishedAt) {
    this.publishedAt = new Date();
  }
});

module.exports = mongoose.model('BlogPost', blogPostSchema);
