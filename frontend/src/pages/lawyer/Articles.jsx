import { useEffect, useState } from "react";
import API from "../../api/axios";
import toast from "react-hot-toast";
import {
  FileText,
  Plus,
  Edit2,
  Trash2,
  Save,
  X,
  BookOpen,
  Calendar,
  Clock,
  Eye,
  ChevronRight,
  AlertCircle,
  CheckCircle,
  PenTool,
  Archive,
  RefreshCw,
  Search,
  Filter,
  Download,
  Share2,
  Star,
  Award,
  Users,
  MessageCircle,
  TrendingUp,
  Sparkles
} from "lucide-react";

export default function Articles() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [showPreview, setShowPreview] = useState(false);

  // form state
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [tags, setTags] = useState([]);
  const [currentTag, setCurrentTag] = useState("");

  // edit state
  const [editingId, setEditingId] = useState(null);
  const [editSubject, setEditSubject] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editCategory, setEditCategory] = useState("");
  const [editTags, setEditTags] = useState([]);

  // Categories for filtering
  const categories = [
    "Criminal Law",
    "Civil Law",
    "Corporate Law",
    "Family Law",
    "Property Law",
    "Tax Law",
    "Employment Law",
    "Intellectual Property"
  ];

  const fetchArticles = async () => {
    try {
      setLoading(true);
      const res = await API.get("/lawyer/article");
      setArticles(res.data);
    } catch (err) {
      console.log(err);
      toast.error(err?.response?.data?.msg || "Failed to load articles");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  const handleAddArticle = async (e) => {
    e.preventDefault();

    if (!subject.trim() || !description.trim()) {
      return toast.error("Subject and Description are required!");
    }

    try {
      setSubmitting(true);
      const res = await API.post("/lawyer/article", {
        subject,
        description,
        category,
        tags
      });

      toast.success(res.data?.msg || "Article added");
      setSubject("");
      setDescription("");
      setCategory("");
      setTags([]);
      fetchArticles();
    } catch (err) {
      console.log(err);
      toast.error(err?.response?.data?.error || "Failed to add article");
    } finally {
      setSubmitting(false);
    }
  };

  const startEdit = (article) => {
    setEditingId(article._id);
    setEditSubject(article.subject);
    setEditDescription(article.description);
    setEditCategory(article.category || "");
    setEditTags(article.tags || []);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditSubject("");
    setEditDescription("");
    setEditCategory("");
    setEditTags([]);
  };

  const handleUpdate = async (id) => {
    if (!editSubject.trim() || !editDescription.trim()) {
      return toast.error("Subject and Description are required!");
    }

    try {
      await API.put(`/lawyer/article/${id}`, {
        subject: editSubject,
        description: editDescription,
        category: editCategory,
        tags: editTags
      });

      toast.success("Article updated");
      cancelEdit();
      fetchArticles();
    } catch (err) {
      console.log(err);
      toast.error(err?.response?.data?.error || "Failed to update article");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this article?")) return;

    try {
      const res = await API.delete(`/lawyer/article/${id}`);
      toast.success(res.data?.msg || "Article deleted");
      fetchArticles();
    } catch (err) {
      console.log(err);
      toast.error(err?.response?.data?.error || "Failed to delete article");
    }
  };

  const addTag = () => {
    if (currentTag.trim() && !tags.includes(currentTag.trim())) {
      setTags([...tags, currentTag.trim()]);
      setCurrentTag("");
    }
  };

  const removeTag = (tagToRemove) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  // Filter articles based on search and category
  const filteredArticles = articles.filter(article => {
    const matchesSearch = article.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterStatus === "all" || article.category === filterStatus;
    return matchesSearch && matchesCategory;
  });

  const stats = {
    total: articles.length,
    published: articles.filter(a => a.status === 'published').length,
    drafts: articles.filter(a => a.status === 'draft').length,
    views: articles.reduce((acc, curr) => acc + (curr.views || 0), 0)
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-6 lg:p-8">
      {/* Header Section */}
      <div className="mb-6 md:mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="inline-flex items-center bg-blue-50 border border-blue-200 px-3 py-1.5 rounded-lg mb-3">
              <BookOpen className="h-4 w-4 text-blue-600 mr-2" />
              <span className="text-xs font-semibold text-blue-600 tracking-wider">ARTICLE MANAGEMENT</span>
            </div>
            <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900">
              Manage Articles
            </h1>
            <p className="text-xs md:text-sm text-gray-500 mt-1">
              Create and manage legal articles for your clients
            </p>
          </div>
          
          {/* Stats Cards - Mobile Horizontal Scroll */}
          <div className="md:hidden flex space-x-2 overflow-x-auto pb-2">
            <div className="flex-shrink-0 bg-white rounded-xl border border-gray-200 px-4 py-2 min-w-[100px]">
              <p className="text-xs text-gray-500">Total</p>
              <p className="text-lg font-bold text-gray-900">{stats.total}</p>
            </div>
            <div className="flex-shrink-0 bg-white rounded-xl border border-gray-200 px-4 py-2 min-w-[100px]">
              <p className="text-xs text-gray-500">Views</p>
              <p className="text-lg font-bold text-blue-600">{stats.views}</p>
            </div>
            <div className="flex-shrink-0 bg-white rounded-xl border border-gray-200 px-4 py-2 min-w-[100px]">
              <p className="text-xs text-gray-500">Published</p>
              <p className="text-lg font-bold text-green-600">{stats.published}</p>
            </div>
          </div>

          {/* Desktop Stats */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="bg-white rounded-xl border border-gray-200 px-6 py-3">
              <p className="text-xs text-gray-500">Total Articles</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 px-6 py-3">
              <p className="text-xs text-gray-500">Total Views</p>
              <p className="text-2xl font-bold text-blue-600">{stats.views}</p>
            </div>
            <button
              onClick={fetchArticles}
              className="p-3 bg-white rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors"
              title="Refresh"
            >
              <RefreshCw className="h-5 w-5 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Search and Filter Bar */}
        <div className="mt-4 flex flex-col md:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search articles by title or content..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:border-blue-600 focus:ring-2 focus:ring-blue-200 transition-all"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:border-blue-600 focus:ring-2 focus:ring-blue-200"
          >
            <option value="all">All Categories</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Column - Add Article Form */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 sticky top-6 overflow-hidden">
            {/* Form Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-5">
              <div className="flex items-center space-x-2">
                <PenTool className="h-5 w-5 text-white" />
                <h2 className="text-lg font-bold text-white">Write New Article</h2>
              </div>
              <p className="text-xs text-blue-100 mt-1">
                Share your legal expertise with clients
              </p>
            </div>

            {/* Form Body */}
            <form onSubmit={handleAddArticle} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">
                  Subject / Title
                </label>
                <input
                  type="text"
                  placeholder="e.g., Understanding Property Rights in India"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 bg-white rounded-xl text-sm focus:border-blue-600 focus:ring-2 focus:ring-blue-200 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 bg-white rounded-xl text-sm focus:border-blue-600 focus:ring-2 focus:ring-blue-200"
                >
                  <option value="">Select Category</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">
                  Tags
                </label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {tags.map(tag => (
                    <span key={tag} className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-700 rounded-lg text-xs">
                      {tag}
                      <button type="button" onClick={() => removeTag(tag)} className="ml-1 hover:text-blue-900">
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Add tag"
                    value={currentTag}
                    onChange={(e) => setCurrentTag(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                    className="flex-1 px-4 py-2 border border-gray-300 bg-white rounded-xl text-sm focus:border-blue-600 focus:ring-2 focus:ring-blue-200"
                  />
                  <button
                    type="button"
                    onClick={addTag}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">
                  Article Content
                </label>
                <textarea
                  placeholder="Write your article content here. Include legal references, case studies, and practical advice..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={8}
                  className="w-full px-4 py-2.5 border border-gray-300 bg-white rounded-xl text-sm focus:border-blue-600 focus:ring-2 focus:ring-blue-200 transition-all resize-none"
                />
              </div>

              {/* Character Count */}
              <div className="text-right text-xs text-gray-400">
                {description.length} characters
              </div>

              {/* Preview Button */}
              {description && (
                <button
                  type="button"
                  onClick={() => {
                    setSelectedArticle({ subject, description, category, tags });
                    setShowPreview(true);
                  }}
                  className="w-full px-4 py-2 border border-blue-600 text-blue-600 rounded-xl hover:bg-blue-50 transition-colors flex items-center justify-center space-x-2"
                >
                  <Eye className="h-4 w-4" />
                  <span>Preview Article</span>
                </button>
              )}

              {/* Form Footer */}
              <div className="border-t border-gray-100 pt-4">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-4 rounded-xl font-medium hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg flex items-center justify-center space-x-2"
                >
                  {submitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent animate-spin"></div>
                      <span>Publishing...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4" />
                      <span>Publish Article</span>
                    </>
                  )}
                </button>
              </div>
            </form>

            {/* Writing Tips */}
            <div className="border-t border-gray-200 bg-gray-50 p-5">
              <h3 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
                <Award className="h-4 w-4 text-blue-600 mr-2" />
                Writing Tips
              </h3>
              <ul className="space-y-2">
                {[
                  "Use clear, jargon-free language",
                  "Include relevant legal citations",
                  "Add practical examples",
                  "Keep paragraphs concise",
                  "Add SEO-friendly keywords"
                ].map((tip, index) => (
                  <li key={index} className="flex items-start text-xs text-gray-600">
                    <CheckCircle className="h-3 w-3 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Right Column - Articles List */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
            {/* List Header */}
            <div className="border-b border-gray-200 p-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Archive className="h-5 w-5 text-gray-600" />
                  <h2 className="text-lg font-bold text-gray-900">Published Articles</h2>
                </div>
                <span className="text-xs bg-blue-100 text-blue-700 px-3 py-1.5 rounded-full font-medium">
                  {filteredArticles.length} {filteredArticles.length === 1 ? 'article' : 'articles'}
                </span>
              </div>
            </div>

            {/* Articles List */}
            <div className="p-5">
              {loading ? (
                <div className="text-center py-12">
                  <div className="inline-flex items-center space-x-3">
                    <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent animate-spin rounded-full"></div>
                    <p className="text-gray-600">Loading articles...</p>
                  </div>
                </div>
              ) : filteredArticles.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <BookOpen className="h-8 w-8 text-gray-400" />
                  </div>
                  <p className="text-gray-500 mb-2">No articles found</p>
                  <p className="text-xs text-gray-400">
                    {searchTerm ? "Try different search terms" : "Create your first article using the form"}
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredArticles.map((article) => (
                    <div
                      key={article._id}
                      className={`border rounded-xl overflow-hidden transition-all ${
                        editingId === article._id 
                          ? 'border-blue-600 shadow-lg' 
                          : 'border-gray-200 hover:border-blue-300 hover:shadow-md'
                      }`}
                    >
                      {editingId === article._id ? (
                        // Edit Mode
                        <div className="p-5 bg-blue-50">
                          <h3 className="text-sm font-medium text-gray-900 mb-4">Edit Article</h3>
                          <div className="space-y-4">
                            <div>
                              <label className="block text-xs font-medium text-gray-700 mb-1">
                                Subject
                              </label>
                              <input
                                value={editSubject}
                                onChange={(e) => setEditSubject(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 bg-white rounded-lg text-sm focus:border-blue-600 focus:ring-2 focus:ring-blue-200"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-gray-700 mb-1">
                                Category
                              </label>
                              <select
                                value={editCategory}
                                onChange={(e) => setEditCategory(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 bg-white rounded-lg text-sm focus:border-blue-600 focus:ring-2 focus:ring-blue-200"
                              >
                                <option value="">Select Category</option>
                                {categories.map(cat => (
                                  <option key={cat} value={cat}>{cat}</option>
                                ))}
                              </select>
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-gray-700 mb-1">
                                Description
                              </label>
                              <textarea
                                value={editDescription}
                                onChange={(e) => setEditDescription(e.target.value)}
                                rows={6}
                                className="w-full px-3 py-2 border border-gray-300 bg-white rounded-lg text-sm focus:border-blue-600 focus:ring-2 focus:ring-blue-200 resize-none"
                              />
                            </div>
                            <div className="flex items-center space-x-2 pt-2">
                              <button
                                onClick={() => handleUpdate(article._id)}
                                className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors flex items-center space-x-2"
                              >
                                <Save className="h-4 w-4" />
                                <span>Save Changes</span>
                              </button>
                              <button
                                onClick={cancelEdit}
                                className="px-4 py-2 border border-gray-300 bg-white text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors flex items-center space-x-2"
                              >
                                <X className="h-4 w-4" />
                                <span>Cancel</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      ) : (
                        // View Mode
                        <div className="p-5">
                          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3 mb-3">
                            <div className="flex-1">
                              <div className="flex items-start space-x-2">
                                <FileText className="h-5 w-5 text-blue-600 mt-1 flex-shrink-0" />
                                <div>
                                  <h3 className="text-lg font-bold text-gray-900 hover:text-blue-600 transition-colors">
                                    {article.subject}
                                  </h3>
                                  
                                  {/* Category & Tags */}
                                  <div className="flex flex-wrap gap-2 mt-2">
                                    {article.category && (
                                      <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-lg text-xs">
                                        {article.category}
                                      </span>
                                    )}
                                    {article.tags?.map(tag => (
                                      <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-600 rounded-lg text-xs">
                                        #{tag}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              </div>
                              
                              {/* Metadata */}
                              <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 mt-3">
                                <span className="flex items-center">
                                  <Calendar className="h-3 w-3 mr-1" />
                                  {new Date(article.createdAt).toLocaleDateString('en-US', {
                                    month: 'short',
                                    day: 'numeric',
                                    year: 'numeric'
                                  })}
                                </span>
                                <span className="flex items-center">
                                  <Eye className="h-3 w-3 mr-1" />
                                  {article.views || 0} views
                                </span>
                                {article.updatedAt !== article.createdAt && (
                                  <span className="flex items-center">
                                    <Clock className="h-3 w-3 mr-1" />
                                    Updated
                                  </span>
                                )}
                              </div>
                            </div>
                            
                            <span className="inline-flex items-center px-2 py-1 bg-green-100 text-green-700 rounded-lg text-xs font-medium self-start">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Published
                            </span>
                          </div>
                          
                          <p className="text-sm text-gray-600 mb-4 leading-relaxed whitespace-pre-wrap">
                            {article.description.length > 250
                              ? `${article.description.substring(0, 250)}...`
                              : article.description}
                          </p>

                          {article.description.length > 250 && (
                            <button 
                              onClick={() => {
                                setSelectedArticle(article);
                                setShowPreview(true);
                              }}
                              className="text-xs text-blue-600 hover:text-blue-700 font-medium mb-3 flex items-center"
                            >
                              Read More
                              <ChevronRight className="h-3 w-3 ml-1" />
                            </button>
                          )}

                          {/* Engagement Stats */}
                          <div className="flex items-center space-x-4 mb-3 text-xs text-gray-500">
                            <span className="flex items-center">
                              <MessageCircle className="h-3 w-3 mr-1" />
                              {article.comments || 0} comments
                            </span>
                            <span className="flex items-center">
                              <Share2 className="h-3 w-3 mr-1" />
                              {article.shares || 0} shares
                            </span>
                          </div>

                          <div className="flex items-center justify-end space-x-2 pt-3 border-t border-gray-100">
                            <button
                              onClick={() => startEdit(article)}
                              className="p-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                              title="Edit article"
                            >
                              <Edit2 className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(article._id)}
                              className="p-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                              title="Delete article"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Article Preview Modal */}
      {showPreview && selectedArticle && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-900">Article Preview</h3>
              <button
                onClick={() => {
                  setShowPreview(false);
                  setSelectedArticle(null);
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>
            
            <div className="p-6">
              <div className="mb-4">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                  {selectedArticle.subject}
                </h1>
                <div className="flex flex-wrap gap-2">
                  {selectedArticle.category && (
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg text-xs">
                      {selectedArticle.category}
                    </span>
                  )}
                  {selectedArticle.tags?.map(tag => (
                    <span key={tag} className="px-3 py-1 bg-gray-100 text-gray-600 rounded-lg text-xs">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="prose prose-sm max-w-none">
                <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                  {selectedArticle.description}
                </p>
              </div>
            </div>
            
            <div className="border-t border-gray-200 p-4 bg-gray-50 flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowPreview(false);
                  setSelectedArticle(null);
                }}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}