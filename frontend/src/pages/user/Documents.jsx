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

export default function UserDocuments() {
  const [documents, setDocuments] = useState([]);
  const [filteredDocs, setFilteredDocs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false);
  const [viewMode, setViewMode] = useState("list"); // grid or list
  const [showFilters, setShowFilters] = useState(false);

  // Search
  const [query, setQuery] = useState("");
  
  // Filters
  const [filterType, setFilterType] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  const BACKEND_URL = import.meta.env.VITE_API_URL;

  // Fetch User Documents
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

  // Search OCR Documents
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

  // Apply filters and sorting
  useEffect(() => {
    let result = [...documents];

    // Apply type filter
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

    // Apply sorting
    result.sort((a, b) => {
      if (sortBy === "newest") {
        return new Date(b.createdAt) - new Date(a.createdAt);
      }
      if (sortBy === "oldest") {
        return new Date(a.createdAt) - new Date(b.createdAt);
      }
      if (sortBy === "name") {
        return a.filename?.localeCompare(b.filename);
      }
      if (sortBy === "size") {
        return (b.size || 0) - (a.size || 0);
      }
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
    
    if (ext === 'pdf') return <FileText className={`${iconSize} text-red-500`} />;
    if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext)) return <Image className={`${iconSize} text-blue-500`} />;
    if (['doc', 'docx', 'txt', 'rtf', 'odt'].includes(ext)) return <FileText className={`${iconSize} text-blue-600`} />;
    if (['xls', 'xlsx', 'csv', 'ods'].includes(ext)) return <FileSpreadsheet className={`${iconSize} text-green-600`} />;
    if (['zip', 'rar', '7z', 'tar', 'gz'].includes(ext)) return <FileArchive className={`${iconSize} text-yellow-600`} />;
    return <File className={`${iconSize} text-gray-500`} />;
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-6">
      {/* Header */}
      <div className="mb-6 md:mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="inline-flex items-center bg-blue-50 border border-blue-200 px-3 py-1.5 rounded-lg mb-3">
              <HardDrive className="h-4 w-4 text-blue-600 mr-2" />
              <span className="text-xs font-semibold text-blue-600 tracking-wider">DOCUMENT MANAGEMENT</span>
            </div>
            <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900">
              My Documents
            </h1>
            <p className="text-xs md:text-sm text-gray-500 mt-1">
              Access and manage all your legal documents
            </p>
          </div>
          
          {/* Stats Cards - Mobile */}
          <div className="md:hidden flex space-x-2 overflow-x-auto pb-2">
            <div className="flex-shrink-0 bg-white rounded-xl border border-gray-200 px-4 py-2 min-w-[100px]">
              <p className="text-xs text-gray-500">Total</p>
              <p className="text-lg font-bold text-gray-900">{stats.total}</p>
            </div>
            <div className="flex-shrink-0 bg-white rounded-xl border border-gray-200 px-4 py-2 min-w-[100px]">
              <p className="text-xs text-gray-500">Storage</p>
              <p className="text-lg font-bold text-blue-600">{formatFileSize(stats.totalSize)}</p>
            </div>
          </div>

          {/* Desktop Stats */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="bg-white rounded-xl border border-gray-200 px-6 py-3">
              <p className="text-xs text-gray-500">Total Documents</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            
            <button
              onClick={fetchDocuments}
              className="p-3 bg-white rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors"
              title="Refresh"
            >
              <RefreshCw className="h-5 w-5 text-gray-600" />
            </button>
          </div>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
        <div className="flex flex-col gap-4">
          {/* Search Row */}
          <div className="flex items-center gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search inside documents (OCR)..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="w-full pl-9 pr-10 py-2.5 border border-gray-300 bg-white rounded-xl text-sm focus:border-blue-600 focus:ring-2 focus:ring-blue-200 transition-all"
              />
              {query && (
                <button
                  onClick={clearSearch}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                >
                  <X className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                </button>
              )}
            </div>

            {/* Search Button */}
            <button
              onClick={handleSearch}
              disabled={searchLoading}
              className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-medium hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md flex items-center justify-center space-x-2 min-w-[120px]"
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
              className="md:hidden p-2.5 bg-gray-100 rounded-xl"
            >
              <Filter className="h-5 w-5 text-gray-600" />
            </button>

            {/* View Toggle - Desktop */}
            <div className="hidden md:flex bg-gray-100 rounded-xl p-1">
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === "list" ? "bg-white shadow-md" : "hover:bg-gray-200"
                }`}
              >
                <List className="h-5 w-5 text-gray-600" />
              </button>
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === "grid" ? "bg-white shadow-md" : "hover:bg-gray-200"
                }`}
              >
                <Grid className="h-5 w-5 text-gray-600" />
              </button>
            </div>
          </div>

          {/* Filters - Desktop */}
          <div className="hidden md:flex items-center gap-4 pt-2 border-t border-gray-100">
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-gray-400" />
              <span className="text-xs text-gray-500">Filter by:</span>
            </div>
            
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-3 py-1.5 border border-gray-300 bg-white rounded-lg text-sm focus:border-blue-600 focus:ring-2 focus:ring-blue-200"
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
              className="px-3 py-1.5 border border-gray-300 bg-white rounded-lg text-sm focus:border-blue-600 focus:ring-2 focus:ring-blue-200"
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
                className="text-xs text-blue-600 hover:text-blue-700 font-medium"
              >
                Clear all filters
              </button>
            )}

            <span className="text-sm text-gray-500 ml-auto">
              Showing {filteredDocs.length} of {documents.length} documents
            </span>
          </div>

          {/* Filters - Mobile */}
          {showFilters && (
            <div className="md:hidden space-y-3 pt-2">
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 bg-white rounded-lg text-sm"
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
                className="w-full px-3 py-2 border border-gray-300 bg-white rounded-lg text-sm"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="name">Name A-Z</option>
              </select>

              {/* Mobile View Toggle */}
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode("list")}
                  className={`flex-1 py-2 rounded-lg text-sm ${
                    viewMode === "list" ? "bg-white shadow-md" : ""
                  }`}
                >
                  List View
                </button>
                <button
                  onClick={() => setViewMode("grid")}
                  className={`flex-1 py-2 rounded-lg text-sm ${
                    viewMode === "grid" ? "bg-white shadow-md" : ""
                  }`}
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
            <FolderOpen className="h-4 w-4 text-blue-600" />
            <p className="text-sm text-gray-600">
              Showing <span className="font-medium text-gray-900">{filteredDocs.length}</span> documents
            </p>
          </div>
          <div className="flex items-center space-x-2 bg-white px-3 py-1.5 rounded-lg border border-gray-200">
            <HardDrive className="h-4 w-4 text-blue-600" />
            <span className="text-xs text-gray-600">{formatFileSize(stats.totalSize)} total</span>
          </div>
        </div>
      )}

      {/* Loading State */}
      {(loading || searchLoading) && (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <div className="inline-flex flex-col items-center space-y-3">
            <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
            <p className="text-gray-600">
              {loading ? "Loading documents..." : "Searching documents..."}
            </p>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!loading && !searchLoading && filteredDocs.length === 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileText className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No documents found</h3>
          <p className="text-sm text-gray-500 mb-6 max-w-md mx-auto">
            {query 
              ? "No results match your search criteria" 
              : "You don't have any documents assigned yet"}
          </p>
          {query && (
            <button
              onClick={clearSearch}
              className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg text-sm font-medium hover:from-blue-700 hover:to-blue-800 transition-all shadow-md inline-flex items-center space-x-2"
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
                className="bg-white rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all group cursor-pointer"
                onClick={() => handlePreview(doc)}
              >
                <div className="p-5">
                  {/* File Icon */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="p-3 bg-gray-50 rounded-xl group-hover:scale-110 transition-transform">
                      {getFileIcon(doc.filename, "lg")}
                    </div>
                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                      {getFileType(doc.filename)}
                    </span>
                  </div>

                  {/* Document Info */}
                  <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                    {doc.filename}
                  </h3>
                  
                  <div className="space-y-1 mb-4">
                    <p className="text-xs text-gray-500 flex items-center">
                      <User className="h-3 w-3 mr-1" />
                      {doc.uploaderId?.name || "Unknown"}
                    </p>
                    <p className="text-xs text-gray-500 flex items-center">
                      <Calendar className="h-3 w-3 mr-1" />
                      {new Date(doc.createdAt).toLocaleDateString()}
                    </p>
                    <p className="text-xs text-gray-500 flex items-center">
                      <HardDrive className="h-3 w-3 mr-1" />
                      {formatFileSize(doc.size)}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <div className="flex space-x-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleView(doc);
                        }}
                        className="p-1.5 hover:bg-gray-100 rounded-lg"
                        title="View"
                      >
                        <Eye className="h-4 w-4 text-gray-600" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDownload(doc);
                        }}
                        className="p-1.5 hover:bg-gray-100 rounded-lg"
                        title="Download"
                      >
                        <Download className="h-4 w-4 text-gray-600" />
                      </button>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePreview(doc);
                      }}
                      className="text-xs text-blue-600 hover:text-blue-700 font-medium"
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
                className="bg-white rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all group"
              >
                <div className="p-5">
                  <div className="flex flex-col md:flex-row md:items-start gap-4">
                    {/* File Icon */}
                    <div className="flex-shrink-0">
                      <div className="p-3 bg-gray-50 rounded-xl group-hover:scale-110 transition-transform">
                        {getFileIcon(doc.filename, "lg")}
                      </div>
                    </div>

                    {/* Document Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
                        <div>
                          <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                            {doc.filename}
                          </h3>
                          
                          <div className="grid grid-cols-2 md:flex md:flex-wrap gap-3 text-sm">
                            <span className="flex items-center text-gray-600">
                              <User className="h-4 w-4 mr-1 text-gray-400" />
                              {doc.uploaderId?.name || "Unknown"}
                            </span>
                            
                            <span className="flex items-center text-gray-600">
                              <Calendar className="h-4 w-4 mr-1 text-gray-400" />
                              {new Date(doc.createdAt).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric'
                              })}
                            </span>
                            
                            {doc.size && (
                              <span className="flex items-center text-gray-600">
                                <HardDrive className="h-4 w-4 mr-1 text-gray-400" />
                                {formatFileSize(doc.size)}
                              </span>
                            )}

                            <span className="flex items-center text-gray-600">
                              <Tag className="h-4 w-4 mr-1 text-gray-400" />
                              {getFileType(doc.filename)}
                            </span>
                          </div>

                          {/* Uploader Email */}
                          {doc.uploaderId?.email && (
                            <p className="text-xs text-gray-500 mt-2">
                              Uploaded by: {doc.uploaderId.email}
                            </p>
                          )}
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleView(doc)}
                            className="p-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                            title="View document"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          
                          <button
                            onClick={() => handleDownload(doc)}
                            className="p-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all shadow-md"
                            title="Download document"
                          >
                            <Download className="h-4 w-4" />
                          </button>

                          <button 
                            onClick={() => handlePreview(doc)}
                            className="p-2 border border-gray-300 hover:bg-gray-50 rounded-lg transition-colors"
                            title="More options"
                          >
                            <MoreVertical className="h-4 w-4 text-gray-600" />
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

      {/* Document Details Modal */}
      {showDetails && selectedDoc && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => {
            setShowDetails(false);
            setSelectedDoc(null);
          }}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-5 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                {getFileIcon(selectedDoc.filename)}
                <h2 className="text-lg font-bold text-white">Document Details</h2>
              </div>
              <button
                onClick={() => {
                  setShowDetails(false);
                  setSelectedDoc(null);
                }}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                <X className="h-5 w-5 text-white" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
              <div className="space-y-6">
                {/* File Info */}
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                  <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
                    <FileText className="h-4 w-4 text-blue-600 mr-2" />
                    File Information
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-gray-500">Filename</p>
                      <p className="text-sm font-medium text-gray-900">{selectedDoc.filename}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">File Type</p>
                      <p className="text-sm text-gray-900">{getFileType(selectedDoc.filename)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Size</p>
                      <p className="text-sm text-gray-900">{formatFileSize(selectedDoc.size)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Uploaded</p>
                      <p className="text-sm text-gray-900">
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
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                  <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
                    <User className="h-4 w-4 text-blue-600 mr-2" />
                    Uploader Information
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-gray-500">Name</p>
                      <p className="text-sm font-medium text-gray-900">{selectedDoc.uploaderId?.name || "Unknown"}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Email</p>
                      <p className="text-sm text-gray-900">{selectedDoc.uploaderId?.email || "N/A"}</p>
                    </div>
                  </div>
                </div>

                {/* Document ID */}
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                  <h3 className="text-sm font-semibold text-gray-700 mb-2">Document ID</h3>
                  <p className="text-xs text-gray-500 break-all">{selectedDoc._id}</p>
                </div>

                {/* Path */}
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                  <h3 className="text-sm font-semibold text-gray-700 mb-2">File Path</h3>
                  <p className="text-xs text-gray-500 break-all">{selectedDoc.path}</p>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="border-t border-gray-200 p-5 bg-gray-50 flex justify-end space-x-3">
              <button
                onClick={() => handleView(selectedDoc)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors flex items-center space-x-2"
              >
                <Eye className="h-4 w-4" />
                <span>View</span>
              </button>
              <button
                onClick={() => handleDownload(selectedDoc)}
                className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all shadow-md flex items-center space-x-2"
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