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

// Lex-Modernism Color System
const colors = {
  primary: "#091426",
  primaryContainer: "#1e293b",
  onPrimaryContainer: "#8590a6",
  secondary: "#4648d4",
  secondaryContainer: "#6063ee",
  onSecondaryContainer: "#fffbff",
  surface: "#fbf8fa",
  surfaceDim: "#dcd9db",
  surfaceBright: "#fbf8fa",
  surfaceContainerLowest: "#ffffff",
  surfaceContainerLow: "#f5f3f4",
  surfaceContainer: "#f0edef",
  surfaceContainerHigh: "#eae7e9",
  surfaceContainerHighest: "#e4e2e3",
  onSurface: "#1b1b1d",
  onSurfaceVariant: "#45474c",
  outline: "#75777d",
  outlineVariant: "#c5c6cd",
  error: "#ba1a1a",
  errorContainer: "#ffdad6",
  onError: "#ffffff",
  onErrorContainer: "#93000a",
  tertiary: "#1e1200",
  tertiaryContainer: "#35260c",
  onTertiaryContainer: "#a38c6a",
};

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

  // Glassmorphism card style
  const glassCardClass = "bg-white/80 backdrop-blur-md rounded-xl shadow-[0_4px_20px_rgba(30,41,59,0.05)] border border-white/50";
  const inputClass = "w-full px-4 py-2.5 rounded-xl text-sm transition-all duration-200 focus:outline-none";

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

  const handleInputFocus = (e) => {
    e.currentTarget.style.borderColor = colors.secondary;
    e.currentTarget.style.boxShadow = `0 0 0 3px ${colors.secondary}20`;
  };

  const handleInputBlur = (e) => {
    e.currentTarget.style.borderColor = colors.outlineVariant;
    e.currentTarget.style.boxShadow = "none";
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
    <div className="min-h-screen p-4 md:p-6 lg:p-8" style={{ backgroundColor: colors.surface }}>
      {/* Header Section */}
      <div className="mb-6 md:mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div 
              className="inline-flex items-center px-3 py-1.5 rounded-lg mb-3"
              style={{ backgroundColor: `${colors.secondary}10`, border: `1px solid ${colors.secondary}20` }}
            >
              <BookOpen className="h-4 w-4 mr-2" style={{ color: colors.secondary }} />
              <span className="text-xs font-semibold tracking-wider" style={{ color: colors.secondary }}>
                ARTICLE MANAGEMENT
              </span>
            </div>
            <h1 className="text-xl md:text-2xl lg:text-3xl font-bold leading-[1.2] tracking-[-0.02em]" style={{ color: colors.onSurface }}>
              Manage Articles
            </h1>
            <p className="text-xs md:text-sm mt-1" style={{ color: colors.onSurfaceVariant }}>
              Create and manage legal articles for your clients
            </p>
          </div>
          
          {/* Stats Cards - Mobile */}
          <div className="md:hidden flex space-x-2 overflow-x-auto pb-2">
            <div className={`flex-shrink-0 ${glassCardClass} px-4 py-2 min-w-[100px]`}>
              <p className="text-xs" style={{ color: colors.onSurfaceVariant }}>Total</p>
              <p className="text-lg font-bold" style={{ color: colors.onSurface }}>{stats.total}</p>
            </div>
            <div className={`flex-shrink-0 ${glassCardClass} px-4 py-2 min-w-[100px]`}>
              <p className="text-xs" style={{ color: colors.onSurfaceVariant }}>Views</p>
              <p className="text-lg font-bold" style={{ color: colors.secondary }}>{stats.views}</p>
            </div>
            <div className={`flex-shrink-0 ${glassCardClass} px-4 py-2 min-w-[100px]`}>
              <p className="text-xs" style={{ color: colors.onSurfaceVariant }}>Published</p>
              <p className="text-lg font-bold" style={{ color: "#4caf50" }}>{stats.published}</p>
            </div>
          </div>

          {/* Desktop Stats */}
          <div className="hidden md:flex items-center space-x-4">
            <div className={`${glassCardClass} px-6 py-3`}>
              <p className="text-xs" style={{ color: colors.onSurfaceVariant }}>Total Articles</p>
              <p className="text-2xl font-bold" style={{ color: colors.onSurface }}>{stats.total}</p>
            </div>
            
            <button
              onClick={fetchArticles}
              className={`${glassCardClass} p-3 transition-all duration-200 hover:shadow-[0_8px_30px_rgba(30,41,59,0.1)]`}
              title="Refresh"
            >
              <RefreshCw className="h-5 w-5" style={{ color: colors.onSurfaceVariant }} />
            </button>
          </div>
        </div>

        {/* Search and Filter Bar */}
        <div className="mt-4 flex flex-col md:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4" style={{ color: colors.outline }} />
            <input
              type="text"
              placeholder="Search articles by title or content..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={inputClass}
              style={{
                backgroundColor: colors.surfaceContainerLowest,
                border: `1px solid ${colors.outlineVariant}`,
                color: colors.onSurface,
                paddingLeft: "2.5rem"
              }}
              onFocus={handleInputFocus}
              onBlur={handleInputBlur}
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className={inputClass}
            style={{
              backgroundColor: colors.surfaceContainerLowest,
              border: `1px solid ${colors.outlineVariant}`,
              color: colors.onSurface,
            }}
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
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
          <div className={`${glassCardClass} sticky top-6 overflow-hidden`}>
            {/* Form Header */}
            <div 
              className="p-5"
              style={{ background: `linear-gradient(135deg, ${colors.secondary}, ${colors.secondaryContainer})` }}
            >
              <div className="flex items-center space-x-2">
                <PenTool className="h-5 w-5 text-white" />
                <h2 className="text-lg font-bold text-white">Write New Article</h2>
              </div>
              <p className="text-xs mt-1" style={{ color: "rgba(255,255,255,0.8)" }}>
                Share your legal expertise with clients
              </p>
            </div>

            {/* Form Body */}
            <form onSubmit={handleAddArticle} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: colors.onSurfaceVariant }}>
                  Subject / Title
                </label>
                <input
                  type="text"
                  placeholder="e.g., Understanding Property Rights in India"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className={inputClass}
                  style={{
                    backgroundColor: colors.surfaceContainerLowest,
                    border: `1px solid ${colors.outlineVariant}`,
                    color: colors.onSurface,
                  }}
                  onFocus={handleInputFocus}
                  onBlur={handleInputBlur}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: colors.onSurfaceVariant }}>
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className={inputClass}
                  style={{
                    backgroundColor: colors.surfaceContainerLowest,
                    border: `1px solid ${colors.outlineVariant}`,
                    color: colors.onSurface,
                  }}
                  onFocus={handleInputFocus}
                  onBlur={handleInputBlur}
                >
                  <option value="">Select Category</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: colors.onSurfaceVariant }}>
                  Tags
                </label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {tags.map(tag => (
                    <span key={tag} className="inline-flex items-center px-2 py-1 rounded-lg text-xs" style={{ backgroundColor: `${colors.secondary}15`, color: colors.secondary }}>
                      {tag}
                      <button type="button" onClick={() => removeTag(tag)} className="ml-1 hover:opacity-70">
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
                    className={`flex-1 ${inputClass}`}
                    style={{
                      backgroundColor: colors.surfaceContainerLowest,
                      border: `1px solid ${colors.outlineVariant}`,
                      color: colors.onSurface,
                    }}
                    onFocus={handleInputFocus}
                    onBlur={handleInputBlur}
                  />
                  <button
                    type="button"
                    onClick={addTag}
                    className="px-4 py-2 rounded-xl transition-all duration-200"
                    style={{ backgroundColor: colors.surfaceContainerHighest, color: colors.onSurfaceVariant }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colors.surfaceContainerHigh}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = colors.surfaceContainerHighest}
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: colors.onSurfaceVariant }}>
                  Article Content
                </label>
                <textarea
                  placeholder="Write your article content here. Include legal references, case studies, and practical advice..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={8}
                  className={`${inputClass} resize-none`}
                  style={{
                    backgroundColor: colors.surfaceContainerLowest,
                    border: `1px solid ${colors.outlineVariant}`,
                    color: colors.onSurface,
                  }}
                  onFocus={handleInputFocus}
                  onBlur={handleInputBlur}
                />
              </div>

              <div className="text-right text-xs" style={{ color: colors.onSurfaceVariant }}>
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
                  className="w-full px-4 py-2 rounded-xl transition-all duration-200 flex items-center justify-center space-x-2"
                  style={{ border: `1px solid ${colors.secondary}`, color: colors.secondary }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = `${colors.secondary}10`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "transparent";
                  }}
                >
                  <Eye className="h-4 w-4" />
                  <span>Preview Article</span>
                </button>
              )}

              {/* Form Footer */}
              <div className="pt-4" style={{ borderTop: `1px solid ${colors.outlineVariant}` }}>
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3 rounded-xl font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                  style={{ 
                    backgroundColor: colors.secondary,
                    color: "white",
                    boxShadow: `0 4px 12px ${colors.secondary}40`
                  }}
                  onMouseEnter={(e) => {
                    if (!submitting) {
                      e.currentTarget.style.backgroundColor = colors.secondaryContainer;
                      e.currentTarget.style.transform = "translateY(-1px)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!submitting) {
                      e.currentTarget.style.backgroundColor = colors.secondary;
                      e.currentTarget.style.transform = "translateY(0)";
                    }
                  }}
                >
                  {submitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent animate-spin rounded-full"></div>
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
            <div className="p-5" style={{ borderTop: `1px solid ${colors.outlineVariant}`, backgroundColor: colors.surfaceContainerLow }}>
              <h3 className="text-sm font-medium mb-3 flex items-center" style={{ color: colors.onSurface }}>
                <Award className="h-4 w-4 mr-2" style={{ color: colors.secondary }} />
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
                  <li key={index} className="flex items-start text-xs" style={{ color: colors.onSurfaceVariant }}>
                    <CheckCircle className="h-3 w-3 mr-2 mt-0.5 flex-shrink-0" style={{ color: "#4caf50" }} />
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Right Column - Articles List */}
        <div className="lg:col-span-2">
          <div className={`${glassCardClass} overflow-hidden`}>
            {/* List Header */}
            <div className="p-5" style={{ borderBottom: `1px solid ${colors.outlineVariant}` }}>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Archive className="h-5 w-5" style={{ color: colors.onSurfaceVariant }} />
                  <h2 className="text-lg font-bold" style={{ color: colors.onSurface }}>Published Articles</h2>
                </div>
                <span className="text-xs px-3 py-1.5 rounded-full font-medium" style={{ backgroundColor: `${colors.secondary}10`, color: colors.secondary }}>
                  {filteredArticles.length} {filteredArticles.length === 1 ? 'article' : 'articles'}
                </span>
              </div>
            </div>

            {/* Articles List */}
            <div className="p-5">
              {loading ? (
                <div className="text-center py-12">
                  <div className="inline-flex items-center space-x-3">
                    <div className="w-6 h-6 border-2 rounded-full animate-spin" style={{ borderColor: colors.secondary, borderTopColor: "transparent" }}></div>
                    <p style={{ color: colors.onSurfaceVariant }}>Loading articles...</p>
                  </div>
                </div>
              ) : filteredArticles.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: colors.surfaceContainerHighest }}>
                    <BookOpen className="h-8 w-8" style={{ color: colors.onSurfaceVariant }} />
                  </div>
                  <p className="mb-2" style={{ color: colors.onSurfaceVariant }}>No articles found</p>
                  <p className="text-xs" style={{ color: colors.outline }}>
                    {searchTerm ? "Try different search terms" : "Create your first article using the form"}
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredArticles.map((article) => (
                    <div
                      key={article._id}
                      className={`rounded-xl overflow-hidden transition-all duration-200 ${
                        editingId === article._id 
                          ? 'shadow-lg' 
                          : 'hover:shadow-md'
                      }`}
                      style={{
                        border: `1px solid ${editingId === article._id ? colors.secondary : colors.outlineVariant}`,
                        backgroundColor: colors.surfaceContainerLowest
                      }}
                    >
                      {editingId === article._id ? (
                        // Edit Mode
                        <div className="p-5" style={{ backgroundColor: `${colors.secondary}05` }}>
                          <h3 className="text-sm font-medium mb-4" style={{ color: colors.onSurface }}>Edit Article</h3>
                          <div className="space-y-4">
                            <div>
                              <label className="block text-xs font-semibold mb-1" style={{ color: colors.onSurfaceVariant }}>
                                Subject
                              </label>
                              <input
                                value={editSubject}
                                onChange={(e) => setEditSubject(e.target.value)}
                                className={inputClass}
                                style={{
                                  backgroundColor: colors.surfaceContainerLowest,
                                  border: `1px solid ${colors.outlineVariant}`,
                                  color: colors.onSurface,
                                }}
                                onFocus={handleInputFocus}
                                onBlur={handleInputBlur}
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-semibold mb-1" style={{ color: colors.onSurfaceVariant }}>
                                Category
                              </label>
                              <select
                                value={editCategory}
                                onChange={(e) => setEditCategory(e.target.value)}
                                className={inputClass}
                                style={{
                                  backgroundColor: colors.surfaceContainerLowest,
                                  border: `1px solid ${colors.outlineVariant}`,
                                  color: colors.onSurface,
                                }}
                                onFocus={handleInputFocus}
                                onBlur={handleInputBlur}
                              >
                                <option value="">Select Category</option>
                                {categories.map(cat => (
                                  <option key={cat} value={cat}>{cat}</option>
                                ))}
                              </select>
                            </div>
                            <div>
                              <label className="block text-xs font-semibold mb-1" style={{ color: colors.onSurfaceVariant }}>
                                Description
                              </label>
                              <textarea
                                value={editDescription}
                                onChange={(e) => setEditDescription(e.target.value)}
                                rows={6}
                                className={`${inputClass} resize-none`}
                                style={{
                                  backgroundColor: colors.surfaceContainerLowest,
                                  border: `1px solid ${colors.outlineVariant}`,
                                  color: colors.onSurface,
                                }}
                                onFocus={handleInputFocus}
                                onBlur={handleInputBlur}
                              />
                            </div>
                            <div className="flex items-center space-x-2 pt-2">
                              <button
                                onClick={() => handleUpdate(article._id)}
                                className="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center space-x-2"
                                style={{ backgroundColor: "#4caf50", color: "white" }}
                                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#45a049"}
                                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#4caf50"}
                              >
                                <Save className="h-4 w-4" />
                                <span>Save Changes</span>
                              </button>
                              <button
                                onClick={cancelEdit}
                                className="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center space-x-2"
                                style={{ border: `1px solid ${colors.outlineVariant}`, color: colors.onSurfaceVariant }}
                                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colors.surfaceContainerHighest}
                                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
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
                                <FileText className="h-5 w-5 flex-shrink-0 mt-1" style={{ color: colors.secondary }} />
                                <div>
                                  <h3 className="text-lg font-bold transition-colors hover:text-secondary" style={{ color: colors.onSurface }}>
                                    {article.subject}
                                  </h3>
                                  
                                  <div className="flex flex-wrap gap-2 mt-2">
                                    {article.category && (
                                      <span className="px-2 py-1 rounded-lg text-xs" style={{ backgroundColor: `${colors.secondary}10`, color: colors.secondary }}>
                                        {article.category}
                                      </span>
                                    )}
                                    {article.tags?.map(tag => (
                                      <span key={tag} className="px-2 py-1 rounded-lg text-xs" style={{ backgroundColor: colors.surfaceContainerHighest, color: colors.onSurfaceVariant }}>
                                        #{tag}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              </div>
                              
                              <div className="flex flex-wrap items-center gap-3 text-xs mt-3" style={{ color: colors.onSurfaceVariant }}>
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
                            
                            <span className="inline-flex items-center px-2 py-1 rounded-lg text-xs font-medium self-start" style={{ backgroundColor: "#4caf5015", color: "#4caf50" }}>
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Published
                            </span>
                          </div>
                          
                          <p className="text-sm mb-4 leading-relaxed" style={{ color: colors.onSurfaceVariant, lineHeight: "1.6" }}>
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
                              className="text-xs font-medium mb-3 flex items-center transition-colors"
                              style={{ color: colors.secondary }}
                            >
                              Read More
                              <ChevronRight className="h-3 w-3 ml-1" />
                            </button>
                          )}

                          <div className="flex items-center space-x-4 mb-3 text-xs" style={{ color: colors.onSurfaceVariant }}>
                            <span className="flex items-center">
                              <MessageCircle className="h-3 w-3 mr-1" />
                              {article.comments || 0} comments
                            </span>
                            <span className="flex items-center">
                              <Share2 className="h-3 w-3 mr-1" />
                              {article.shares || 0} shares
                            </span>
                          </div>

                          <div className="flex items-center justify-end space-x-2 pt-3" style={{ borderTop: `1px solid ${colors.outlineVariant}` }}>
                            <button
                              onClick={() => startEdit(article)}
                              className="p-2 rounded-lg transition-all duration-200"
                              style={{ border: `1px solid ${colors.outlineVariant}`, color: colors.onSurfaceVariant }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = colors.surfaceContainerHighest;
                                e.currentTarget.style.color = colors.onSurface;
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = "transparent";
                                e.currentTarget.style.color = colors.onSurfaceVariant;
                              }}
                              title="Edit article"
                            >
                              <Edit2 className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(article._id)}
                              className="p-2 rounded-lg transition-all duration-200"
                              style={{ border: `1px solid ${colors.error}30`, color: colors.error }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = colors.errorContainer;
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = "transparent";
                              }}
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

      {/* Article Preview Modal - Glassmorphism */}
      {showPreview && selectedArticle && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className={`${glassCardClass} max-w-3xl w-full max-h-[90vh] overflow-y-auto`} style={{ backgroundColor: "rgba(255, 255, 255, 0.95)" }}>
            <div className="sticky top-0 p-4 flex items-center justify-between" style={{ borderBottom: `1px solid ${colors.outlineVariant}`, backgroundColor: "rgba(255, 255, 255, 0.95)" }}>
              <h3 className="text-lg font-bold" style={{ color: colors.onSurface }}>Article Preview</h3>
              <button
                onClick={() => {
                  setShowPreview(false);
                  setSelectedArticle(null);
                }}
                className="p-2 rounded-lg transition-all duration-200"
                style={{ color: colors.onSurfaceVariant }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colors.surfaceContainerHighest}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="p-6">
              <div className="mb-4">
                <h1 className="text-2xl font-bold mb-2" style={{ color: colors.onSurface }}>
                  {selectedArticle.subject}
                </h1>
                <div className="flex flex-wrap gap-2">
                  {selectedArticle.category && (
                    <span className="px-3 py-1 rounded-lg text-xs" style={{ backgroundColor: `${colors.secondary}10`, color: colors.secondary }}>
                      {selectedArticle.category}
                    </span>
                  )}
                  {selectedArticle.tags?.map(tag => (
                    <span key={tag} className="px-3 py-1 rounded-lg text-xs" style={{ backgroundColor: colors.surfaceContainerHighest, color: colors.onSurfaceVariant }}>
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="prose prose-sm max-w-none">
                <p className="whitespace-pre-wrap leading-relaxed" style={{ color: colors.onSurfaceVariant, lineHeight: "1.6" }}>
                  {selectedArticle.description}
                </p>
              </div>
            </div>
            
            <div className="p-4 flex justify-end space-x-3" style={{ borderTop: `1px solid ${colors.outlineVariant}`, backgroundColor: colors.surfaceContainerLow }}>
              <button
                onClick={() => {
                  setShowPreview(false);
                  setSelectedArticle(null);
                }}
                className="px-4 py-2 rounded-lg transition-all duration-200"
                style={{ border: `1px solid ${colors.outlineVariant}`, color: colors.onSurfaceVariant }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colors.surfaceContainerHighest}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
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