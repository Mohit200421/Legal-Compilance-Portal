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

export default function UserArticles() {
  const [articles, setArticles] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [category, setCategory] = useState("all");

  // Glassmorphism card style
  const glassCardClass = "bg-white/80 backdrop-blur-md rounded-xl shadow-[0_4px_20px_rgba(30,41,59,0.05)] border border-white/50";

  const handleInputFocus = (e) => {
    e.currentTarget.style.borderColor = colors.secondary;
    e.currentTarget.style.boxShadow = `0 0 0 3px ${colors.secondary}20`;
  };

  const handleInputBlur = (e) => {
    e.currentTarget.style.borderColor = colors.outlineVariant;
    e.currentTarget.style.boxShadow = "none";
  };

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
    <div className="min-h-screen p-4 md:p-6" style={{ backgroundColor: colors.surface }}>
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
                LEGAL LIBRARY
              </span>
            </div>
            <h1 className="text-xl md:text-2xl lg:text-3xl font-bold leading-[1.2] tracking-[-0.02em]" style={{ color: colors.onSurface }}>
              Legal Articles
            </h1>
            <p className="text-xs md:text-sm mt-1" style={{ color: colors.onSurfaceVariant }}>
              Read latest legal articles written by verified lawyers
            </p>
          </div>
          
          {/* Stats */}
          <div className="flex items-center space-x-3">
            <div className={`${glassCardClass} px-4 py-2`}>
              <p className="text-xs" style={{ color: colors.onSurfaceVariant }}>Total Articles</p>
              <p className="text-lg font-bold" style={{ color: colors.onSurface }}>{articles.length}</p>
            </div>
            <div className={`${glassCardClass} px-4 py-2`}>
              <p className="text-xs" style={{ color: colors.onSurfaceVariant }}>Contributors</p>
              <p className="text-lg font-bold" style={{ color: colors.onSurface }}>
                {new Set(articles.map(a => a.authorId?._id)).size}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter Bar - Glass Card */}
      <div className={`${glassCardClass} p-4 mb-6`}>
        <div className="flex flex-col gap-4">
          {/* Search */}
          <div className="flex items-center gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: colors.outline }} />
              <input
                type="text"
                placeholder="Search articles by subject..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-10 py-2.5 rounded-xl text-sm transition-all duration-200 focus:outline-none"
                style={{
                  backgroundColor: colors.surfaceContainerLowest,
                  border: `1px solid ${colors.outlineVariant}`,
                  color: colors.onSurface,
                }}
                onFocus={handleInputFocus}
                onBlur={handleInputBlur}
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                >
                  <X className="h-4 w-4" style={{ color: colors.outline }} />
                </button>
              )}
            </div>
          </div>

          {/* Category Filters */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
            <Filter className="h-4 w-4 flex-shrink-0" style={{ color: colors.outline }} />
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all duration-200 ${
                  category === cat
                    ? "text-white shadow-md"
                    : "hover:bg-surfaceContainerHighest"
                }`}
                style={{
                  backgroundColor: category === cat ? colors.secondary : colors.surfaceContainerHighest,
                  color: category === cat ? "white" : colors.onSurfaceVariant,
                }}
              >
                {cat === "all" ? "All" : cat}
              </button>
            ))}
          </div>

          {/* Results Count */}
          <div className="text-xs" style={{ color: colors.onSurfaceVariant }}>
            Showing <span className="font-medium" style={{ color: colors.onSurface }}>{filtered.length}</span> articles
          </div>
        </div>
      </div>

      {/* Featured Articles Section */}
      {!loading && featuredArticles.length > 0 && search === "" && category === "all" && (
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold flex items-center" style={{ color: colors.onSurface }}>
              <Sparkles className="h-5 w-5 mr-2" style={{ color: colors.tertiary }} />
              Featured Articles
            </h2>
            <TrendingUp className="h-5 w-5" style={{ color: colors.outline }} />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {featuredArticles.map((article) => (
              <div
                key={article._id}
                className={`${glassCardClass} p-5 cursor-pointer transition-all duration-300 hover:shadow-[0_8px_30px_rgba(30,41,59,0.1)] group`}
                onClick={() => setSelected(article)}
                style={{ backgroundColor: "rgba(255, 255, 255, 0.9)" }}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="p-2 rounded-lg" style={{ backgroundColor: `${colors.secondary}10` }}>
                    <Award className="h-5 w-5" style={{ color: colors.secondary }} />
                  </div>
                  <span className="text-xs px-2 py-1 rounded-full" style={{ backgroundColor: colors.surfaceContainerHighest, color: colors.secondary }}>
                    Featured
                  </span>
                </div>
                <h3 className="font-bold mb-2 line-clamp-2 transition-colors group-hover:text-secondary" style={{ color: colors.onSurface }}>
                  {article.subject}
                </h3>
                <p className="text-xs mb-3 line-clamp-2" style={{ color: colors.onSurfaceVariant }}>
                  {article.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-xs" style={{ color: colors.onSurfaceVariant }}>
                    {article.authorId?.name || "Legal Expert"}
                  </span>
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" style={{ color: colors.secondary }} />
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
            <Tag className="h-4 w-4 flex-shrink-0" style={{ color: colors.outline }} />
            {popularTags.map((tag, index) => (
              <span
                key={index}
                className="px-3 py-1 rounded-full text-xs whitespace-nowrap cursor-pointer transition-all duration-200"
                style={{ backgroundColor: colors.surfaceContainerHighest, color: colors.onSurfaceVariant }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = `${colors.secondary}10`;
                  e.currentTarget.style.color = colors.secondary;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = colors.surfaceContainerHighest;
                  e.currentTarget.style.color = colors.onSurfaceVariant;
                }}
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
        <div className={`${glassCardClass} p-12 text-center`}>
          <div className="inline-flex items-center space-x-3">
            <div className="w-6 h-6 border-2 rounded-full animate-spin" style={{ borderColor: colors.secondary, borderTopColor: "transparent" }} />
            <p style={{ color: colors.onSurfaceVariant }}>Loading articles...</p>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!loading && filtered.length === 0 && (
        <div className={`${glassCardClass} p-12 text-center`}>
          <div className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: colors.surfaceContainerHighest }}>
            <BookOpen className="h-8 w-8" style={{ color: colors.onSurfaceVariant }} />
          </div>
          <h3 className="text-lg font-medium mb-2" style={{ color: colors.onSurface }}>No articles found</h3>
          <p className="text-sm mb-4" style={{ color: colors.onSurfaceVariant }}>
            {search ? "No results match your search criteria" : "No articles available yet"}
          </p>
          {search && (
            <button
              onClick={() => setSearch("")}
              className="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 shadow-md inline-flex items-center space-x-2"
              style={{ backgroundColor: colors.secondary, color: "white" }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colors.secondaryContainer}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = colors.secondary}
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
              className={`${glassCardClass} overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-[0_8px_30px_rgba(30,41,59,0.1)] group`}
              onClick={() => setSelected(article)}
            >
              <div className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className="inline-flex items-center px-2 py-1 rounded-lg" style={{ backgroundColor: `${colors.secondary}10`, border: `1px solid ${colors.secondary}20` }}>
                    <FileText className="h-3 w-3 mr-1" style={{ color: colors.secondary }} />
                    <span className="text-[10px] font-medium" style={{ color: colors.secondary }}>Article</span>
                  </div>
                  {article.category && (
                    <span className="text-[10px] px-2 py-1 rounded-full" style={{ backgroundColor: colors.surfaceContainerHighest, color: colors.onSurfaceVariant }}>
                      {article.category}
                    </span>
                  )}
                </div>
                
                <h3 className="text-base font-bold mb-2 line-clamp-2 transition-colors group-hover:text-secondary" style={{ color: colors.onSurface }}>
                  {article.subject}
                </h3>

                <p className="text-xs mb-4 line-clamp-3 leading-relaxed" style={{ color: colors.onSurfaceVariant, lineHeight: "1.5" }}>
                  {article.description}
                </p>

                {article.authorId?.name && (
                  <div className="flex items-center text-xs mb-3" style={{ color: colors.onSurfaceVariant }}>
                    <div 
                      className="w-5 h-5 rounded-full flex items-center justify-center mr-2"
                      style={{ background: `linear-gradient(135deg, ${colors.secondary}, ${colors.secondaryContainer})` }}
                    >
                      <span className="text-[8px] font-bold text-white">
                        {article.authorId.name.charAt(0)}
                      </span>
                    </div>
                    <span className="truncate">{article.authorId.name}</span>
                  </div>
                )}

                <div className="flex items-center justify-between pt-3" style={{ borderTop: `1px solid ${colors.outlineVariant}` }}>
                  <div className="flex items-center space-x-3 text-[10px]" style={{ color: colors.onSurfaceVariant }}>
                    {article.createdAt && (
                      <span className="flex items-center">
                        <Calendar className="h-3 w-3 mr-1" style={{ color: colors.outline }} />
                        {new Date(article.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric'
                        })}
                      </span>
                    )}
                    {article.views && (
                      <span className="flex items-center">
                        <Eye className="h-3 w-3 mr-1" style={{ color: colors.outline }} />
                        {article.views}
                      </span>
                    )}
                  </div>

                  <button 
                    className="inline-flex items-center text-xs font-medium transition-colors group-hover:text-secondary"
                    style={{ color: colors.secondary }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelected(article);
                    }}
                  >
                    Read
                    <ArrowRight className="h-3 w-3 ml-1 transition-transform group-hover:translate-x-1" />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {/* Article Modal - Glassmorphism */}
      {selected && (
        <div 
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setSelected(null)}
        >
          <div 
            className={`${glassCardClass} w-full max-w-3xl max-h-[90vh] overflow-hidden`}
            style={{ backgroundColor: "rgba(255, 255, 255, 0.95)" }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="sticky top-0 p-6 z-10" style={{ 
              background: `linear-gradient(135deg, ${colors.secondary}, ${colors.secondaryContainer})`,
            }}>
              <div className="flex items-start justify-between">
                <div>
                  <div className="inline-flex items-center px-3 py-1 rounded-lg mb-3" style={{ backgroundColor: "rgba(255,255,255,0.2)", backdropFilter: "blur(8px)" }}>
                    <BookOpen className="h-4 w-4 text-white mr-2" />
                    <span className="text-xs font-medium text-white">LEGAL ARTICLE</span>
                  </div>
                  <h2 className="text-xl font-bold text-white pr-8">
                    {selected.subject}
                  </h2>
                </div>
                <button
                  onClick={() => setSelected(null)}
                  className="p-2 rounded-lg transition-colors hover:bg-white/20"
                >
                  <X className="h-5 w-5 text-white" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
              <div className="flex flex-wrap gap-4 mb-6 pb-6" style={{ borderBottom: `1px solid ${colors.outlineVariant}` }}>
                {selected.createdAt && (
                  <div className="flex items-center text-xs" style={{ color: colors.onSurfaceVariant }}>
                    <Calendar className="h-4 w-4 mr-2" style={{ color: colors.outline }} />
                    <span>Published: {new Date(selected.createdAt).toLocaleDateString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric'
                    })}</span>
                  </div>
                )}
                {selected.authorId?.name && (
                  <div className="flex items-center text-xs" style={{ color: colors.onSurfaceVariant }}>
                    <User className="h-4 w-4 mr-2" style={{ color: colors.outline }} />
                    <span>Author: <span className="font-medium" style={{ color: colors.onSurface }}>{selected.authorId.name}</span></span>
                  </div>
                )}
                {selected.authorId?.specialization && (
                  <div className="flex items-center text-xs" style={{ color: colors.onSurfaceVariant }}>
                    <BookOpen className="h-4 w-4 mr-2" style={{ color: colors.outline }} />
                    <span>{selected.authorId.specialization}</span>
                  </div>
                )}
              </div>

              <div className="prose prose-sm max-w-none">
                <div className="text-sm leading-relaxed whitespace-pre-wrap" style={{ color: colors.onSurfaceVariant, lineHeight: "1.6" }}>
                  {selected.description}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-5 flex items-center justify-end space-x-3" style={{ borderTop: `1px solid ${colors.outlineVariant}`, backgroundColor: colors.surfaceContainerLow }}>
              <button
                onClick={() => setSelected(null)}
                className="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200"
                style={{ border: `1px solid ${colors.outlineVariant}`, color: colors.onSurfaceVariant }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colors.surfaceContainerHighest}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
              >
                Close
              </button>
              <button
                onClick={() => setSelected(null)}
                className="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 shadow-md"
                style={{ backgroundColor: colors.secondary, color: "white" }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colors.secondaryContainer}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = colors.secondary}
              >
                Mark as Read
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}