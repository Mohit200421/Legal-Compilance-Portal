import { useEffect, useState } from "react";
import API from "../../api/axios";
import { 
  BookOpen, 
  Search, 
  X, 
  Calendar, 
  User, 
  ChevronRight,
  FileText,
  Clock,
  Eye,
  ArrowRight,
  Sparkles,
  TrendingUp,
  Award,
  Star,
  Filter,
  Download,
  Share2,
  Bookmark,
  Heart,
  MessageCircle,
  Tag,
  Layers
} from "lucide-react";

export default function UserArticles() {
  const [articles, setArticles] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [category, setCategory] = useState("all");

  // Fetch Articles (User View)
  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setLoading(true);
        const res = await API.get("/user/articles");
        setArticles(res.data || []);
        setFiltered(res.data || []);
      } catch (err) {
        console.log(err);
        setArticles([]);
        setFiltered([]);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  // Search Filter
  useEffect(() => {
    let result = articles.filter((a) =>
      a.subject?.toLowerCase().includes(search.toLowerCase())
    );
    
    // Apply category filter if needed
    if (category !== "all") {
      result = result.filter(a => a.category === category);
    }
    
    setFiltered(result);
  }, [search, articles, category]);

  const categories = [
    "all",
    "Criminal Law",
    "Civil Law",
    "Corporate Law",
    "Family Law",
    "Property Law",
    "Tax Law"
  ];

  const popularTags = [
    "Supreme Court",
    "Rights",
    "Amendment",
    "Contract",
    "Divorce",
    "Property Dispute"
  ];

  const featuredArticles = articles.slice(0, 3);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-6">
      {/* Header Section */}
      <div className="mb-6 md:mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="inline-flex items-center bg-purple-50 border border-purple-200 px-3 py-1.5 rounded-lg mb-3">
              <BookOpen className="h-4 w-4 text-purple-600 mr-2" />
              <span className="text-xs font-semibold text-purple-600 tracking-wider">LEGAL LIBRARY</span>
            </div>
            <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900">
              Legal Articles
            </h1>
            <p className="text-xs md:text-sm text-gray-500 mt-1">
              Read latest legal articles written by verified lawyers
            </p>
          </div>
          
          {/* Stats */}
          <div className="flex items-center space-x-3">
            <div className="bg-white rounded-xl border border-gray-200 px-4 py-2">
              <p className="text-xs text-gray-500">Total Articles</p>
              <p className="text-lg font-bold text-gray-900">{articles.length}</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 px-4 py-2">
              <p className="text-xs text-gray-500">Contributors</p>
              <p className="text-lg font-bold text-gray-900">
                {new Set(articles.map(a => a.authorId?._id)).size}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
        <div className="flex flex-col gap-4">
          {/* Search */}
          <div className="flex items-center gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search articles by subject..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-10 py-2.5 border border-gray-300 bg-white rounded-xl text-sm focus:border-purple-600 focus:ring-2 focus:ring-purple-200 transition-all"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>

          {/* Category Filters */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
            <Filter className="h-4 w-4 text-gray-400 flex-shrink-0" />
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                  category === cat
                    ? "bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-md"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {cat === "all" ? "All" : cat}
              </button>
            ))}
          </div>

          {/* Results Count */}
          <div className="text-xs text-gray-500">
            Showing <span className="font-medium text-gray-900">{filtered.length}</span> articles
          </div>
        </div>
      </div>

      {/* Featured Articles Section */}
      {!loading && featuredArticles.length > 0 && search === "" && category === "all" && (
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900 flex items-center">
              <Sparkles className="h-5 w-5 text-yellow-500 mr-2" />
              Featured Articles
            </h2>
            <TrendingUp className="h-5 w-5 text-gray-400" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {featuredArticles.map((article) => (
              <div
                key={article._id}
                className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl border border-purple-200 p-5 cursor-pointer hover:shadow-lg transition-all group"
                onClick={() => setSelected(article)}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="p-2 bg-white rounded-lg">
                    <Award className="h-5 w-5 text-purple-600" />
                  </div>
                  <span className="text-xs bg-white text-purple-600 px-2 py-1 rounded-full">Featured</span>
                </div>
                <h3 className="font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-purple-600 transition-colors">
                  {article.subject}
                </h3>
                <p className="text-xs text-gray-600 mb-3 line-clamp-2">
                  {article.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">
                    {article.authorId?.name || "Legal Expert"}
                  </span>
                  <ArrowRight className="h-4 w-4 text-purple-600 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Popular Tags */}
      {!loading && search === "" && (
        <div className="mb-6">
          <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-hide">
            <Tag className="h-4 w-4 text-gray-400 flex-shrink-0" />
            {popularTags.map((tag, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs whitespace-nowrap hover:bg-purple-100 hover:text-purple-700 transition-colors cursor-pointer"
                onClick={() => setSearch(tag)}
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <div className="inline-flex items-center space-x-3">
            <div className="w-6 h-6 border-2 border-purple-600 border-t-transparent animate-spin rounded-full"></div>
            <p className="text-gray-600">Loading articles...</p>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!loading && filtered.length === 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <BookOpen className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No articles found</h3>
          <p className="text-sm text-gray-500 mb-4">
            {search ? "No results match your search criteria" : "No articles available yet"}
          </p>
          {search && (
            <button
              onClick={() => setSearch("")}
              className="px-4 py-2 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg text-sm font-medium hover:from-purple-700 hover:to-purple-800 transition-all shadow-md inline-flex items-center space-x-2"
            >
              <X className="h-4 w-4" />
              <span>Clear search</span>
            </button>
          )}
        </div>
      )}

      {/* Articles Grid */}
      {!loading && filtered.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((article) => (
            <article
              key={article._id}
              className="bg-white rounded-xl border border-gray-200 hover:border-purple-300 hover:shadow-lg transition-all group cursor-pointer overflow-hidden"
              onClick={() => setSelected(article)}
            >
              {/* Card Header */}
              <div className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className="inline-flex items-center px-2 py-1 bg-purple-50 border border-purple-200 rounded-lg">
                    <FileText className="h-3 w-3 text-purple-600 mr-1" />
                    <span className="text-[10px] font-medium text-purple-600">Article</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    {article.category && (
                      <span className="text-[10px] bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                        {article.category}
                      </span>
                    )}
                  </div>
                </div>
                
                <h3 className="text-base font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-purple-600 transition-colors">
                  {article.subject}
                </h3>

                <p className="text-xs text-gray-600 mb-4 line-clamp-3 leading-relaxed">
                  {article.description}
                </p>

                {/* Author Info */}
                {article.authorId?.name && (
                  <div className="flex items-center text-xs text-gray-500 mb-3">
                    <div className="w-5 h-5 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center mr-2">
                      <span className="text-[8px] font-bold text-white">
                        {article.authorId.name.charAt(0)}
                      </span>
                    </div>
                    <span className="truncate">{article.authorId.name}</span>
                  </div>
                )}

                {/* Card Footer */}
                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <div className="flex items-center space-x-3 text-[10px] text-gray-500">
                    <span className="flex items-center">
                      <Calendar className="h-3 w-3 mr-1" />
                      {article.createdAt
                        ? new Date(article.createdAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric'
                          })
                        : "No date"}
                    </span>
                    {article.views && (
                      <span className="flex items-center">
                        <Eye className="h-3 w-3 mr-1" />
                        {article.views}
                      </span>
                    )}
                  </div>

                  <button 
                    className="inline-flex items-center text-purple-600 text-xs font-medium group-hover:text-purple-700"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelected(article);
                    }}
                  >
                    Read
                    <ArrowRight className="h-3 w-3 ml-1 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {/* Article Modal */}
      {selected && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setSelected(null)}
        >
          <div 
            className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="sticky top-0 bg-gradient-to-r from-purple-600 to-purple-700 p-6 z-10">
              <div className="flex items-start justify-between">
                <div>
                  <div className="inline-flex items-center px-3 py-1 bg-white/20 backdrop-blur-sm rounded-lg mb-3">
                    <BookOpen className="h-4 w-4 text-white mr-2" />
                    <span className="text-xs font-medium text-white">LEGAL ARTICLE</span>
                  </div>
                  <h2 className="text-xl font-bold text-white pr-8">
                    {selected.subject}
                  </h2>
                </div>
                <button
                  onClick={() => setSelected(null)}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <X className="h-5 w-5 text-white" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
              {/* Article Metadata */}
              <div className="flex flex-wrap gap-4 mb-6 pb-6 border-b border-gray-200">
                {selected.createdAt && (
                  <div className="flex items-center text-xs text-gray-600">
                    <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                    <span>Published: {new Date(selected.createdAt).toLocaleDateString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric'
                    })}</span>
                  </div>
                )}
                {selected.authorId?.name && (
                  <div className="flex items-center text-xs text-gray-600">
                    <User className="h-4 w-4 text-gray-400 mr-2" />
                    <span>Author: <span className="font-medium text-gray-900">{selected.authorId.name}</span></span>
                  </div>
                )}
                {selected.authorId?.specialization && (
                  <div className="flex items-center text-xs text-gray-600">
                    <BookOpen className="h-4 w-4 text-gray-400 mr-2" />
                    <span>{selected.authorId.specialization}</span>
                  </div>
                )}
              </div>

              {/* Article Content */}
              <div className="prose prose-sm max-w-none">
                <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {selected.description}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="border-t border-gray-200 bg-gray-50 p-5">
              <div className="flex items-center justify-end space-x-3">
                <button
                  onClick={() => setSelected(null)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors"
                >
                  Close
                </button>
                <button
                  onClick={() => setSelected(null)}
                  className="px-4 py-2 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg text-sm font-medium hover:from-purple-700 hover:to-purple-800 transition-all shadow-md"
                >
                  Mark as Read
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}