import { useEffect, useState } from "react";
import API from "../../api/axios";
import {
  FileText,
  Search,
  X,
  Download,
  Eye,
  User,
  Calendar,
  Clock,
  Filter,
  ChevronDown,
  File,
  Image,
  FileSpreadsheet,
  FileArchive,
  Loader2,
  Trash2,
  Share2,
  MoreVertical,
  HardDrive,
  Grid,
  List,
  RefreshCw,
  FolderOpen,
  Tag,
  Sparkles,
  TrendingUp,
  Award,
  CheckCircle,
  AlertCircle,
  Copy,
  Printer,
  Star,
  Heart,
  Bookmark,
  Upload,
  DownloadCloud,
  ExternalLink,
  Info
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

export default function UserDocuments() {
  const [documents, setDocuments] = useState([]);
  const [filteredDocs, setFilteredDocs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false);
  const [viewMode, setViewMode] = useState("list");
  const [showFilters, setShowFilters] = useState(false);

  const [query, setQuery] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  const BACKEND_URL = import.meta.env.VITE_API_URL;

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

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      const res = await API.get("/user/documents");
      setDocuments(res.data);
      setFilteredDocs(res.data);
    } catch (err) {
      console.log(err);
      alert("Failed to load documents");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const handleSearch = async () => {
    if (!query.trim()) {
      setFilteredDocs(documents);
      return;
    }

    try {
      setSearchLoading(true);
      const res = await API.get(`/user/search-documents?query=${query}`);
      setFilteredDocs(res.data);
    } catch (err) {
      console.log(err);
      alert("Failed to search documents");
    } finally {
      setSearchLoading(false);
    }
  };

  useEffect(() => {
    let result = [...documents];

    if (filterType !== "all") {
      result = result.filter(doc => {
        const ext = doc.filename?.split('.').pop()?.toLowerCase();
        if (filterType === "pdf") return ext === "pdf";
        if (filterType === "image") return ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'].includes(ext);
        if (filterType === "doc") return ['doc', 'docx', 'txt', 'rtf', 'odt'].includes(ext);
        if (filterType === "spreadsheet") return ['xls', 'xlsx', 'csv', 'ods'].includes(ext);
        if (filterType === "archive") return ['zip', 'rar', '7z', 'tar', 'gz'].includes(ext);
        return true;
      });
    }

    result.sort((a, b) => {
      if (sortBy === "newest") return new Date(b.createdAt) - new Date(a.createdAt);
      if (sortBy === "oldest") return new Date(a.createdAt) - new Date(b.createdAt);
      if (sortBy === "name") return a.filename?.localeCompare(b.filename);
      if (sortBy === "size") return (b.size || 0) - (a.size || 0);
      return 0;
    });

    setFilteredDocs(result);
  }, [documents, filterType, sortBy]);

  const handleView = (doc) => {
    const fileUrl = `${BACKEND_URL}/${doc.path}`;
    window.open(fileUrl, "_blank");
  };

  const handleDownload = (doc) => {
    const fileUrl = `${BACKEND_URL}/${doc.path}`;
    const link = document.createElement("a");
    link.href = fileUrl;
    link.download = doc.filename || "document";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePreview = (doc) => {
    setSelectedDoc(doc);
    setShowDetails(true);
  };

  const clearSearch = () => {
    setQuery("");
    setFilteredDocs(documents);
  };

  const getFileIcon = (filename, size = "md") => {
    const ext = filename?.split('.').pop()?.toLowerCase();
    const iconSize = size === "lg" ? "h-8 w-8" : "h-5 w-5";
    
    if (ext === 'pdf') return <FileText className={`${iconSize}`} style={{ color: colors.error }} />;
    if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext)) return <Image className={`${iconSize}`} style={{ color: colors.secondary }} />;
    if (['doc', 'docx', 'txt', 'rtf', 'odt'].includes(ext)) return <FileText className={`${iconSize}`} style={{ color: colors.secondary }} />;
    if (['xls', 'xlsx', 'csv', 'ods'].includes(ext)) return <FileSpreadsheet className={`${iconSize}`} style={{ color: "#4caf50" }} />;
    if (['zip', 'rar', '7z', 'tar', 'gz'].includes(ext)) return <FileArchive className={`${iconSize}`} style={{ color: colors.tertiary }} />;
    return <File className={`${iconSize}`} style={{ color: colors.onSurfaceVariant }} />;
  };

  const getFileType = (filename) => {
    const ext = filename?.split('.').pop()?.toLowerCase();
    if (ext === 'pdf') return 'PDF Document';
    if (['jpg', 'jpeg', 'png', 'gif'].includes(ext)) return 'Image';
    if (['doc', 'docx'].includes(ext)) return 'Word Document';
    if (['xls', 'xlsx'].includes(ext)) return 'Excel Spreadsheet';
    if (['txt'].includes(ext)) return 'Text File';
    if (['zip', 'rar'].includes(ext)) return 'Archive';
    return 'File';
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return "N/A";
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${sizes[i]}`;
  };

  const stats = {
    total: documents.length,
    totalSize: documents.reduce((acc, doc) => acc + (doc.size || 0), 0),
    byType: {
      pdf: documents.filter(d => d.filename?.toLowerCase().endsWith('.pdf')).length,
      image: documents.filter(d => ['jpg', 'jpeg', 'png', 'gif'].some(ext => d.filename?.toLowerCase().endsWith(ext))).length,
      doc: documents.filter(d => ['doc', 'docx', 'txt'].some(ext => d.filename?.toLowerCase().endsWith(ext))).length
    }
  };

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
              <HardDrive className="h-4 w-4 mr-2" style={{ color: colors.secondary }} />
              <span className="text-xs font-semibold tracking-wider" style={{ color: colors.secondary }}>
                DOCUMENT MANAGEMENT
              </span>
            </div>
            <h1 className="text-xl md:text-2xl lg:text-3xl font-bold leading-[1.2] tracking-[-0.02em]" style={{ color: colors.onSurface }}>
              My Documents
            </h1>
            <p className="text-xs md:text-sm mt-1" style={{ color: colors.onSurfaceVariant }}>
              Access and manage all your legal documents
            </p>
          </div>
          
          {/* Stats Cards - Mobile */}
          <div className="md:hidden flex space-x-2 overflow-x-auto pb-2">
            <div className={`flex-shrink-0 ${glassCardClass} px-4 py-2 min-w-[100px]`}>
              <p className="text-xs" style={{ color: colors.onSurfaceVariant }}>Total</p>
              <p className="text-lg font-bold" style={{ color: colors.onSurface }}>{stats.total}</p>
            </div>
            <div className={`flex-shrink-0 ${glassCardClass} px-4 py-2 min-w-[100px]`}>
              <p className="text-xs" style={{ color: colors.onSurfaceVariant }}>Storage</p>
              <p className="text-lg font-bold" style={{ color: colors.secondary }}>{formatFileSize(stats.totalSize)}</p>
            </div>
          </div>

          {/* Desktop Stats */}
          <div className="hidden md:flex items-center space-x-4">
            <div className={`${glassCardClass} px-6 py-3`}>
              <p className="text-xs" style={{ color: colors.onSurfaceVariant }}>Total Documents</p>
              <p className="text-2xl font-bold" style={{ color: colors.onSurface }}>{stats.total}</p>
            </div>
            
            <button
              onClick={fetchDocuments}
              className={`${glassCardClass} p-3 transition-all duration-200 hover:shadow-[0_8px_30px_rgba(30,41,59,0.1)]`}
              title="Refresh"
            >
              <RefreshCw className="h-5 w-5" style={{ color: colors.onSurfaceVariant }} />
            </button>
          </div>
        </div>
      </div>

      {/* Search and Filter Bar - Glass Card */}
      <div className={`${glassCardClass} p-4 mb-6`}>
        <div className="flex flex-col gap-4">
          {/* Search Row */}
          <div className="flex items-center gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: colors.outline }} />
              <input
                type="text"
                placeholder="Search inside documents (OCR)..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="w-full pl-9 pr-10 py-2.5 rounded-xl text-sm transition-all duration-200 focus:outline-none"
                style={{
                  backgroundColor: colors.surfaceContainerLowest,
                  border: `1px solid ${colors.outlineVariant}`,
                  color: colors.onSurface,
                }}
                onFocus={handleInputFocus}
                onBlur={handleInputBlur}
              />
              {query && (
                <button
                  onClick={clearSearch}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                >
                  <X className="h-4 w-4" style={{ color: colors.outline }} />
                </button>
              )}
            </div>

            {/* Search Button */}
            <button
              onClick={handleSearch}
              disabled={searchLoading}
              className="px-6 py-2.5 rounded-xl font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-md flex items-center justify-center space-x-2 min-w-[120px]"
              style={{ 
                backgroundColor: colors.secondary,
                color: "white",
              }}
              onMouseEnter={(e) => {
                if (!searchLoading) {
                  e.currentTarget.style.backgroundColor = colors.secondaryContainer;
                  e.currentTarget.style.transform = "translateY(-1px)";
                }
              }}
              onMouseLeave={(e) => {
                if (!searchLoading) {
                  e.currentTarget.style.backgroundColor = colors.secondary;
                  e.currentTarget.style.transform = "translateY(0)";
                }
              }}
            >
              {searchLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Search...</span>
                </>
              ) : (
                <>
                  <Search className="h-4 w-4" />
                  <span>Search</span>
                </>
              )}
            </button>

            {/* Mobile Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="md:hidden p-2.5 rounded-xl"
              style={{ backgroundColor: colors.surfaceContainerHighest }}
            >
              <Filter className="h-5 w-5" style={{ color: colors.onSurfaceVariant }} />
            </button>

            {/* View Toggle - Desktop */}
            <div className="hidden md:flex p-1 rounded-xl" style={{ backgroundColor: colors.surfaceContainerHighest }}>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-lg transition-all duration-200 ${
                  viewMode === "list" ? "bg-white shadow-md" : ""
                }`}
                style={{
                  backgroundColor: viewMode === "list" ? colors.surfaceContainerLowest : "transparent",
                  color: colors.onSurfaceVariant
                }}
              >
                <List className="h-5 w-5" />
              </button>
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-lg transition-all duration-200 ${
                  viewMode === "grid" ? "bg-white shadow-md" : ""
                }`}
                style={{
                  backgroundColor: viewMode === "grid" ? colors.surfaceContainerLowest : "transparent",
                  color: colors.onSurfaceVariant
                }}
              >
                <Grid className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Filters - Desktop */}
          <div className="hidden md:flex items-center gap-4 pt-2" style={{ borderTop: `1px solid ${colors.outlineVariant}` }}>
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4" style={{ color: colors.outline }} />
              <span className="text-xs" style={{ color: colors.onSurfaceVariant }}>Filter by:</span>
            </div>
            
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-3 py-1.5 rounded-lg text-sm transition-all duration-200 focus:outline-none"
              style={{
                backgroundColor: colors.surfaceContainerLowest,
                border: `1px solid ${colors.outlineVariant}`,
                color: colors.onSurface,
              }}
              onFocus={handleInputFocus}
              onBlur={handleInputBlur}
            >
              <option value="all">All Types</option>
              <option value="pdf">PDF</option>
              <option value="image">Images</option>
              <option value="doc">Documents</option>
              <option value="spreadsheet">Spreadsheets</option>
              <option value="archive">Archives</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-1.5 rounded-lg text-sm transition-all duration-200 focus:outline-none"
              style={{
                backgroundColor: colors.surfaceContainerLowest,
                border: `1px solid ${colors.outlineVariant}`,
                color: colors.onSurface,
              }}
              onFocus={handleInputFocus}
              onBlur={handleInputBlur}
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="name">Name A-Z</option>
              <option value="size">Size</option>
            </select>

            {(filterType !== "all" || query) && (
              <button
                onClick={() => {
                  setFilterType("all");
                  setSortBy("newest");
                  setQuery("");
                  setFilteredDocs(documents);
                }}
                className="text-xs font-medium transition-colors"
                style={{ color: colors.secondary }}
              >
                Clear all filters
              </button>
            )}

            <span className="text-sm ml-auto" style={{ color: colors.onSurfaceVariant }}>
              Showing <span className="font-medium" style={{ color: colors.onSurface }}>{filteredDocs.length}</span> of {documents.length} documents
            </span>
          </div>

          {/* Filters - Mobile */}
          {showFilters && (
            <div className="md:hidden space-y-3 pt-2">
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="w-full px-3 py-2 rounded-lg text-sm"
                style={{
                  backgroundColor: colors.surfaceContainerLowest,
                  border: `1px solid ${colors.outlineVariant}`,
                  color: colors.onSurface,
                }}
              >
                <option value="all">All Types</option>
                <option value="pdf">PDF</option>
                <option value="image">Images</option>
                <option value="doc">Documents</option>
                <option value="spreadsheet">Spreadsheets</option>
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-3 py-2 rounded-lg text-sm"
                style={{
                  backgroundColor: colors.surfaceContainerLowest,
                  border: `1px solid ${colors.outlineVariant}`,
                  color: colors.onSurface,
                }}
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="name">Name A-Z</option>
              </select>

              {/* Mobile View Toggle */}
              <div className="flex p-1 rounded-lg" style={{ backgroundColor: colors.surfaceContainerHighest }}>
                <button
                  onClick={() => setViewMode("list")}
                  className={`flex-1 py-2 rounded-lg text-sm transition-all duration-200 ${
                    viewMode === "list" ? "bg-white shadow-md" : ""
                  }`}
                  style={{
                    backgroundColor: viewMode === "list" ? colors.surfaceContainerLowest : "transparent",
                    color: colors.onSurfaceVariant
                  }}
                >
                  List View
                </button>
                <button
                  onClick={() => setViewMode("grid")}
                  className={`flex-1 py-2 rounded-lg text-sm transition-all duration-200 ${
                    viewMode === "grid" ? "bg-white shadow-md" : ""
                  }`}
                  style={{
                    backgroundColor: viewMode === "grid" ? colors.surfaceContainerLowest : "transparent",
                    color: colors.onSurfaceVariant
                  }}
                >
                  Grid View
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Results Count */}
      {!loading && !searchLoading && (
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <FolderOpen className="h-4 w-4" style={{ color: colors.secondary }} />
            <p className="text-sm" style={{ color: colors.onSurfaceVariant }}>
              Showing <span className="font-medium" style={{ color: colors.onSurface }}>{filteredDocs.length}</span> documents
            </p>
          </div>
          <div className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg ${glassCardClass}`}>
            <HardDrive className="h-4 w-4" style={{ color: colors.secondary }} />
            <span className="text-xs" style={{ color: colors.onSurfaceVariant }}>{formatFileSize(stats.totalSize)} total</span>
          </div>
        </div>
      )}

      {/* Loading State */}
      {(loading || searchLoading) && (
        <div className={`${glassCardClass} p-12 text-center`}>
          <div className="inline-flex flex-col items-center space-y-3">
            <Loader2 className="h-8 w-8 animate-spin" style={{ color: colors.secondary }} />
            <p style={{ color: colors.onSurfaceVariant }}>
              {loading ? "Loading documents..." : "Searching documents..."}
            </p>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!loading && !searchLoading && filteredDocs.length === 0 && (
        <div className={`${glassCardClass} p-12 text-center`}>
          <div className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: colors.surfaceContainerHighest }}>
            <FileText className="h-8 w-8" style={{ color: colors.onSurfaceVariant }} />
          </div>
          <h3 className="text-lg font-medium mb-2" style={{ color: colors.onSurface }}>No documents found</h3>
          <p className="text-sm mb-6 max-w-md mx-auto" style={{ color: colors.onSurfaceVariant }}>
            {query 
              ? "No results match your search criteria" 
              : "You don't have any documents assigned yet"}
          </p>
          {query && (
            <button
              onClick={clearSearch}
              className="px-6 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 shadow-md inline-flex items-center space-x-2"
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

      {/* Documents Grid/List */}
      {!loading && !searchLoading && filteredDocs.length > 0 && (
        viewMode === "grid" ? (
          /* Grid View */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredDocs.map((doc) => (
              <div
                key={doc._id}
                className={`${glassCardClass} transition-all duration-300 hover:shadow-[0_8px_30px_rgba(30,41,59,0.1)] group cursor-pointer`}
                onClick={() => handlePreview(doc)}
              >
                <div className="p-5">
                  {/* File Icon */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="p-3 rounded-xl transition-transform group-hover:scale-110" style={{ backgroundColor: colors.surfaceContainerHighest }}>
                      {getFileIcon(doc.filename, "lg")}
                    </div>
                    <span className="text-xs px-2 py-1 rounded-full" style={{ backgroundColor: `${colors.secondary}10`, color: colors.secondary }}>
                      {getFileType(doc.filename)}
                    </span>
                  </div>

                  {/* Document Info */}
                  <h3 className="font-semibold mb-2 line-clamp-2 transition-colors group-hover:text-secondary" style={{ color: colors.onSurface }}>
                    {doc.filename}
                  </h3>
                  
                  <div className="space-y-1 mb-4">
                    <p className="text-xs flex items-center" style={{ color: colors.onSurfaceVariant }}>
                      <User className="h-3 w-3 mr-1" style={{ color: colors.outline }} />
                      {doc.uploaderId?.name || "Unknown"}
                    </p>
                    <p className="text-xs flex items-center" style={{ color: colors.onSurfaceVariant }}>
                      <Calendar className="h-3 w-3 mr-1" style={{ color: colors.outline }} />
                      {new Date(doc.createdAt).toLocaleDateString()}
                    </p>
                    <p className="text-xs flex items-center" style={{ color: colors.onSurfaceVariant }}>
                      <HardDrive className="h-3 w-3 mr-1" style={{ color: colors.outline }} />
                      {formatFileSize(doc.size)}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-3" style={{ borderTop: `1px solid ${colors.outlineVariant}` }}>
                    <div className="flex space-x-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleView(doc);
                        }}
                        className="p-1.5 rounded-lg transition-colors"
                        style={{ color: colors.onSurfaceVariant }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colors.surfaceContainerHighest}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
                        title="View"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDownload(doc);
                        }}
                        className="p-1.5 rounded-lg transition-colors"
                        style={{ color: colors.onSurfaceVariant }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colors.surfaceContainerHighest}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
                        title="Download"
                      >
                        <Download className="h-4 w-4" />
                      </button>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePreview(doc);
                      }}
                      className="text-xs font-medium transition-colors"
                      style={{ color: colors.secondary }}
                    >
                      Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* List View */
          <div className="space-y-4">
            {filteredDocs.map((doc) => (
              <div
                key={doc._id}
                className={`${glassCardClass} transition-all duration-300 hover:shadow-[0_8px_30px_rgba(30,41,59,0.1)] group`}
              >
                <div className="p-5">
                  <div className="flex flex-col md:flex-row md:items-start gap-4">
                    {/* File Icon */}
                    <div className="flex-shrink-0">
                      <div className="p-3 rounded-xl transition-transform group-hover:scale-110" style={{ backgroundColor: colors.surfaceContainerHighest }}>
                        {getFileIcon(doc.filename, "lg")}
                      </div>
                    </div>

                    {/* Document Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
                        <div>
                          <h3 className="text-lg font-bold mb-2 transition-colors group-hover:text-secondary" style={{ color: colors.onSurface }}>
                            {doc.filename}
                          </h3>
                          
                          <div className="grid grid-cols-2 md:flex md:flex-wrap gap-3 text-sm">
                            <span className="flex items-center" style={{ color: colors.onSurfaceVariant }}>
                              <User className="h-4 w-4 mr-1" style={{ color: colors.outline }} />
                              {doc.uploaderId?.name || "Unknown"}
                            </span>
                            
                            <span className="flex items-center" style={{ color: colors.onSurfaceVariant }}>
                              <Calendar className="h-4 w-4 mr-1" style={{ color: colors.outline }} />
                              {new Date(doc.createdAt).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric'
                              })}
                            </span>
                            
                            {doc.size && (
                              <span className="flex items-center" style={{ color: colors.onSurfaceVariant }}>
                                <HardDrive className="h-4 w-4 mr-1" style={{ color: colors.outline }} />
                                {formatFileSize(doc.size)}
                              </span>
                            )}

                            <span className="flex items-center" style={{ color: colors.onSurfaceVariant }}>
                              <Tag className="h-4 w-4 mr-1" style={{ color: colors.outline }} />
                              {getFileType(doc.filename)}
                            </span>
                          </div>

                          {doc.uploaderId?.email && (
                            <p className="text-xs mt-2" style={{ color: colors.onSurfaceVariant }}>
                              Uploaded by: {doc.uploaderId.email}
                            </p>
                          )}
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleView(doc)}
                            className="p-2 rounded-lg transition-all duration-200"
                            style={{ border: `1px solid ${colors.outlineVariant}`, color: colors.onSurfaceVariant }}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colors.surfaceContainerHighest}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
                            title="View document"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          
                          <button
                            onClick={() => handleDownload(doc)}
                            className="p-2 rounded-lg transition-all duration-200 shadow-md"
                            style={{ backgroundColor: colors.secondary, color: "white" }}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colors.secondaryContainer}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = colors.secondary}
                            title="Download document"
                          >
                            <Download className="h-4 w-4" />
                          </button>

                          <button 
                            onClick={() => handlePreview(doc)}
                            className="p-2 rounded-lg transition-all duration-200"
                            style={{ border: `1px solid ${colors.outlineVariant}`, color: colors.onSurfaceVariant }}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colors.surfaceContainerHighest}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
                            title="More options"
                          >
                            <MoreVertical className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )
      )}

      {/* Document Details Modal - Glassmorphism */}
      {showDetails && selectedDoc && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => {
            setShowDetails(false);
            setSelectedDoc(null);
          }}
        >
          <div
            className={`${glassCardClass} w-full max-w-2xl max-h-[90vh] overflow-hidden`}
            style={{ backgroundColor: "rgba(255, 255, 255, 0.95)" }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-5 flex items-center justify-between" style={{ background: `linear-gradient(135deg, ${colors.secondary}, ${colors.secondaryContainer})` }}>
              <div className="flex items-center space-x-2">
                {getFileIcon(selectedDoc.filename)}
                <h2 className="text-lg font-bold text-white">Document Details</h2>
              </div>
              <button
                onClick={() => {
                  setShowDetails(false);
                  setSelectedDoc(null);
                }}
                className="p-2 rounded-lg transition-colors hover:bg-white/20"
              >
                <X className="h-5 w-5 text-white" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
              <div className="space-y-6">
                {/* File Info */}
                <div className="rounded-xl p-4" style={{ backgroundColor: colors.surfaceContainerLow }}>
                  <h3 className="text-sm font-semibold mb-3 flex items-center" style={{ color: colors.onSurfaceVariant }}>
                    <FileText className="h-4 w-4 mr-2" style={{ color: colors.secondary }} />
                    File Information
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs" style={{ color: colors.onSurfaceVariant }}>Filename</p>
                      <p className="text-sm font-medium" style={{ color: colors.onSurface }}>{selectedDoc.filename}</p>
                    </div>
                    <div>
                      <p className="text-xs" style={{ color: colors.onSurfaceVariant }}>File Type</p>
                      <p className="text-sm" style={{ color: colors.onSurfaceVariant }}>{getFileType(selectedDoc.filename)}</p>
                    </div>
                    <div>
                      <p className="text-xs" style={{ color: colors.onSurfaceVariant }}>Size</p>
                      <p className="text-sm" style={{ color: colors.onSurfaceVariant }}>{formatFileSize(selectedDoc.size)}</p>
                    </div>
                    <div>
                      <p className="text-xs" style={{ color: colors.onSurfaceVariant }}>Uploaded</p>
                      <p className="text-sm" style={{ color: colors.onSurfaceVariant }}>
                        {new Date(selectedDoc.createdAt).toLocaleDateString('en-US', {
                          month: 'long',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Uploader Info */}
                <div className="rounded-xl p-4" style={{ backgroundColor: colors.surfaceContainerLow }}>
                  <h3 className="text-sm font-semibold mb-3 flex items-center" style={{ color: colors.onSurfaceVariant }}>
                    <User className="h-4 w-4 mr-2" style={{ color: colors.secondary }} />
                    Uploader Information
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs" style={{ color: colors.onSurfaceVariant }}>Name</p>
                      <p className="text-sm font-medium" style={{ color: colors.onSurface }}>{selectedDoc.uploaderId?.name || "Unknown"}</p>
                    </div>
                    <div>
                      <p className="text-xs" style={{ color: colors.onSurfaceVariant }}>Email</p>
                      <p className="text-sm" style={{ color: colors.onSurfaceVariant }}>{selectedDoc.uploaderId?.email || "N/A"}</p>
                    </div>
                  </div>
                </div>

                {/* Document ID */}
                <div className="rounded-xl p-4" style={{ backgroundColor: colors.surfaceContainerLow }}>
                  <h3 className="text-sm font-semibold mb-2" style={{ color: colors.onSurfaceVariant }}>Document ID</h3>
                  <p className="text-xs break-all" style={{ color: colors.onSurfaceVariant }}>{selectedDoc._id}</p>
                </div>

                {/* Path */}
                <div className="rounded-xl p-4" style={{ backgroundColor: colors.surfaceContainerLow }}>
                  <h3 className="text-sm font-semibold mb-2" style={{ color: colors.onSurfaceVariant }}>File Path</h3>
                  <p className="text-xs break-all" style={{ color: colors.onSurfaceVariant }}>{selectedDoc.path}</p>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-5 flex justify-end space-x-3" style={{ borderTop: `1px solid ${colors.outlineVariant}`, backgroundColor: colors.surfaceContainerLow }}>
              <button
                onClick={() => handleView(selectedDoc)}
                className="px-4 py-2 rounded-lg transition-all duration-200 flex items-center space-x-2"
                style={{ border: `1px solid ${colors.outlineVariant}`, color: colors.onSurfaceVariant }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colors.surfaceContainerHighest}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
              >
                <Eye className="h-4 w-4" />
                <span>View</span>
              </button>
              <button
                onClick={() => handleDownload(selectedDoc)}
                className="px-4 py-2 rounded-lg transition-all duration-200 shadow-md flex items-center space-x-2"
                style={{ backgroundColor: colors.secondary, color: "white" }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colors.secondaryContainer}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = colors.secondary}
              >
                <Download className="h-4 w-4" />
                <span>Download</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}