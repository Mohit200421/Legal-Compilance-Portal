import { useEffect, useState } from "react";
import API from "../../api/axios";
import toast from "react-hot-toast";
import {
  FileText,
  Upload,
  Download,
  Eye,
  Trash2,
  X,
  User,
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  HardDrive,
  File,
  Image,
  FileSpreadsheet,
  FileArchive,
  Loader2,
  Search,
  Filter,
  ChevronDown,
  UserPlus,
  Brain,
  FileSearch,
  Grid,
  List,
  RefreshCw,
  FolderOpen,
  Tag,
  MoreVertical,
  Share2,
  Copy,
  Archive,
  Star,
  TrendingUp,
  Sparkles
} from "lucide-react";

export default function Documents() {
  const [file, setFile] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [filteredDocs, setFilteredDocs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [viewMode, setViewMode] = useState("list"); // grid or list

  // for assign dropdown
  const [requests, setRequests] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState("");

  // OCR Modal
  const [openOCR, setOpenOCR] = useState(false);
  const [ocrText, setOcrText] = useState("");
  const [ocrLoading, setOcrLoading] = useState(false);
  const [ocrDocId, setOcrDocId] = useState(null);

  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterType, setFilterType] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [showFilters, setShowFilters] = useState(false);

  // Document preview
  const [previewDoc, setPreviewDoc] = useState(null);

  const BACKEND_URL = import.meta.env.VITE_API_URL;

  // Fetch Documents
  const fetchDocuments = async () => {
    try {
      setLoading(true);
      const res = await API.get("/lawyer/document");
      setDocuments(res.data);
      setFilteredDocs(res.data);
    } catch (err) {
      console.log(err);
      toast.error(err?.response?.data?.msg || "Failed to load documents");
    } finally {
      setLoading(false);
    }
  };

  // Fetch Accepted Requests
  const fetchAcceptedRequests = async () => {
    try {
      const res = await API.get("/lawyer/requests");
      const accepted = res.data.filter((r) => r.status === "Accepted");
      setRequests(accepted);
    } catch (err) {
      console.log(err);
      toast.error("Failed to load accepted requests");
    }
  };

  useEffect(() => {
    fetchDocuments();
    fetchAcceptedRequests();
  }, []);

  // Filter and Sort Documents
  useEffect(() => {
    let result = [...documents];

    // Search filter
    if (searchTerm) {
      result = result.filter(doc => 
        doc.filename?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.assignedUserId?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.assignedUserId?.email?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // OCR status filter
    if (filterStatus !== "all") {
      result = result.filter(doc => 
        filterStatus === "completed" ? doc.ocrTextId : !doc.ocrTextId
      );
    }

    // File type filter
    if (filterType !== "all") {
      result = result.filter(doc => {
        const ext = doc.filename?.split('.').pop()?.toLowerCase();
        if (filterType === "pdf") return ext === 'pdf';
        if (filterType === "image") return ['jpg', 'jpeg', 'png', 'gif'].includes(ext);
        if (filterType === "document") return ['doc', 'docx', 'txt'].includes(ext);
        if (filterType === "spreadsheet") return ['xls', 'xlsx', 'csv'].includes(ext);
        return true;
      });
    }

    // Sort
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
  }, [documents, searchTerm, filterStatus, filterType, sortBy]);

  // Upload
  const handleUpload = async (e) => {
    e.preventDefault();

    if (!file) return toast.error("Please select a file first!");
    if (!selectedUserId) return toast.error("Please select a user to assign!");

    try {
      setUploading(true);
      const formData = new FormData();
      formData.append("file", file);
      formData.append("assignedUserId", selectedUserId);

      const res = await API.post("/lawyer/document", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success(res.data.msg || "Document uploaded!");
      setFile(null);
      setSelectedUserId("");
      fetchDocuments();
      
      // Reset file input
      const fileInput = document.getElementById("file-upload");
      if (fileInput) fileInput.value = "";
    } catch (err) {
      console.log(err);
      toast.error(err?.response?.data?.error || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  // Delete
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this document?")) return;

    try {
      const res = await API.delete(`/lawyer/document/${id}`);
      toast.success(res.data.msg || "Document deleted");
      fetchDocuments();
    } catch (err) {
      console.log(err);
      toast.error(err?.response?.data?.error || "Delete failed");
    }
  };

  // View
  const handleView = (doc) => {
    const fileUrl = `${BACKEND_URL}/${doc.path}`;
    window.open(fileUrl, "_blank");
  };

  // Preview
  const handlePreview = (doc) => {
    setPreviewDoc(doc);
  };

  // Download
  const handleDownload = (doc) => {
    const fileUrl = `${BACKEND_URL}/${doc.path}`;
    const link = document.createElement("a");
    link.href = fileUrl;
    link.download = doc.filename || "document";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Run OCR
  const handleRunOCR = async (docId) => {
    try {
      setOcrLoading(true);
      const res = await API.get(`/ocr/${docId}`);
      toast.success(res.data.msg || "OCR completed!");
      fetchDocuments();
    } catch (err) {
      console.log(err);
      toast.error(err?.response?.data?.msg || "OCR failed");
    } finally {
      setOcrLoading(false);
    }
  };

  // View OCR Text
  const handleViewOCR = async (docId) => {
    try {
      setOcrLoading(true);
      setOcrDocId(docId);
      setOpenOCR(true);
      setOcrText("");

      const res = await API.get(`/ocr/text/${docId}`);
      setOcrText(res.data.extractedText || "No OCR text found");
    } catch (err) {
      console.log(err);
      setOcrText(err?.response?.data?.msg || "Failed to load OCR text");
    } finally {
      setOcrLoading(false);
    }
  };

  const getFileIcon = (filename) => {
    const ext = filename?.split('.').pop()?.toLowerCase();
    if (ext === 'pdf') return <FileText className="h-5 w-5 text-red-500" />;
    if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext)) return <Image className="h-5 w-5 text-blue-500" />;
    if (['doc', 'docx', 'txt', 'rtf'].includes(ext)) return <FileText className="h-5 w-5 text-blue-600" />;
    if (['xls', 'xlsx', 'csv'].includes(ext)) return <FileSpreadsheet className="h-5 w-5 text-green-600" />;
    if (['zip', 'rar', '7z', 'tar', 'gz'].includes(ext)) return <FileArchive className="h-5 w-5 text-yellow-600" />;
    return <File className="h-5 w-5 text-gray-500" />;
  };

  const getFileType = (filename) => {
    const ext = filename?.split('.').pop()?.toLowerCase();
    if (ext === 'pdf') return 'PDF';
    if (['jpg', 'jpeg', 'png', 'gif'].includes(ext)) return 'Image';
    if (['doc', 'docx'].includes(ext)) return 'Word';
    if (['xls', 'xlsx'].includes(ext)) return 'Excel';
    if (['txt'].includes(ext)) return 'Text';
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
    ocrCompleted: documents.filter(d => d.ocrTextId).length,
    totalSize: documents.reduce((acc, doc) => acc + (doc.size || 0), 0),
    byType: {
      pdf: documents.filter(d => d.filename?.toLowerCase().endsWith('.pdf')).length,
      image: documents.filter(d => ['jpg', 'jpeg', 'png', 'gif'].some(ext => d.filename?.toLowerCase().endsWith(ext))).length,
      doc: documents.filter(d => ['doc', 'docx', 'txt'].some(ext => d.filename?.toLowerCase().endsWith(ext))).length
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-6 md:mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="inline-flex items-center bg-purple-50 border border-purple-200 px-3 py-1.5 rounded-lg mb-3">
              <HardDrive className="h-4 w-4 text-purple-600 mr-2" />
              <span className="text-xs font-semibold text-purple-600 tracking-wider">DOCUMENT MANAGEMENT</span>
            </div>
            <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900">
              Document Management
            </h1>
            <p className="text-xs md:text-sm text-gray-500 mt-1">
              Upload, manage, and process legal documents with OCR
            </p>
          </div>
          
          {/* Stats Cards - Mobile Horizontal Scroll */}
          <div className="md:hidden flex space-x-2 overflow-x-auto pb-2">
            <div className="flex-shrink-0 bg-white rounded-xl border border-gray-200 px-4 py-2 min-w-[100px]">
              <p className="text-xs text-gray-500">Total</p>
              <p className="text-lg font-bold text-gray-900">{stats.total}</p>
            </div>
            <div className="flex-shrink-0 bg-white rounded-xl border border-gray-200 px-4 py-2 min-w-[100px]">
              <p className="text-xs text-gray-500">OCR Done</p>
              <p className="text-lg font-bold text-green-600">{stats.ocrCompleted}</p>
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
            <div className="bg-white rounded-xl border border-gray-200 px-6 py-3">
              <p className="text-xs text-gray-500">OCR Completed</p>
              <p className="text-2xl font-bold text-green-600">{stats.ocrCompleted}</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 px-6 py-3">
              <p className="text-xs text-gray-500">Total Storage</p>
              <p className="text-2xl font-bold text-blue-600">{formatFileSize(stats.totalSize)}</p>
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

      {/* Upload Form */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 mb-6 overflow-hidden">
        <div className="bg-gradient-to-r from-purple-600 to-purple-700 p-5">
          <div className="flex items-center space-x-2">
            <Upload className="h-5 w-5 text-white" />
            <h2 className="text-lg font-bold text-white">Upload New Document</h2>
          </div>
          <p className="text-xs text-purple-100 mt-1">
            Assign documents to clients for review and processing
          </p>
        </div>

        <form onSubmit={handleUpload} className="p-5">
          <div className="grid md:grid-cols-3 gap-4">
            {/* User Selection */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-2">
                Assign to Client
              </label>
              <div className="relative">
                <UserPlus className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <select
                  value={selectedUserId}
                  onChange={(e) => setSelectedUserId(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 border border-gray-300 bg-white rounded-xl text-sm focus:border-purple-600 focus:ring-2 focus:ring-purple-200 transition-all appearance-none"
                >
                  <option value="">Select a client</option>
                  {requests.length === 0 ? (
                    <option disabled>No accepted requests</option>
                  ) : (
                    requests.map((r) => (
                      <option key={r._id} value={r.userId?._id}>
                        {r.userId?.name} ({r.userId?.email})
                      </option>
                    ))
                  )}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* File Upload */}
            <div className="md:col-span-2">
              <label className="block text-xs font-medium text-gray-700 mb-2">
                Select File
              </label>
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1 relative">
                  <input
                    id="file-upload"
                    type="file"
                    onChange={(e) => setFile(e.target.files[0])}
                    className="absolute inset-0 opacity-0 cursor-pointer z-10"
                  />
                  <div className="w-full px-4 py-2.5 border border-gray-300 bg-white rounded-xl text-sm text-gray-500 flex items-center">
                    <File className="h-4 w-4 mr-2 text-gray-400" />
                    <span className="truncate">{file ? file.name : "Choose a file..."}</span>
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={uploading}
                  className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-xl font-medium hover:from-purple-700 hover:to-purple-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg flex items-center justify-center space-x-2"
                >
                  {uploading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Uploading...</span>
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4" />
                      <span>Upload</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>

      {/* Filters Bar */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 mb-6 p-4">
        <div className="flex flex-col gap-4">
          {/* Search and View Toggle */}
          <div className="flex items-center gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by filename or client..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 border border-gray-300 bg-white rounded-xl text-sm focus:border-purple-600 focus:ring-2 focus:ring-purple-200 transition-all"
              />
            </div>
            
            {/* View Toggle */}
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

            {/* Mobile Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="md:hidden p-2.5 bg-gray-100 rounded-xl"
            >
              <Filter className="h-5 w-5 text-gray-600" />
            </button>
          </div>

          {/* Filters - Desktop */}
          <div className="hidden md:flex items-center gap-3">
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-gray-400" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 border border-gray-300 bg-white rounded-lg text-sm focus:border-purple-600 focus:ring-2 focus:ring-purple-200"
              >
                <option value="all">All Status</option>
                <option value="completed">OCR Completed</option>
                <option value="pending">OCR Pending</option>
              </select>
            </div>

            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-3 py-2 border border-gray-300 bg-white rounded-lg text-sm focus:border-purple-600 focus:ring-2 focus:ring-purple-200"
            >
              <option value="all">All Types</option>
              <option value="pdf">PDF</option>
              <option value="image">Images</option>
              <option value="document">Documents</option>
              <option value="spreadsheet">Spreadsheets</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border border-gray-300 bg-white rounded-lg text-sm focus:border-purple-600 focus:ring-2 focus:ring-purple-200"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="name">Name A-Z</option>
              <option value="size">Size</option>
            </select>

            <span className="text-sm text-gray-500 ml-auto">
              Showing {filteredDocs.length} of {documents.length} documents
            </span>
          </div>

          {/* Filters - Mobile */}
          {showFilters && (
            <div className="md:hidden space-y-3 pt-2">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 bg-white rounded-lg text-sm"
              >
                <option value="all">All Status</option>
                <option value="completed">OCR Completed</option>
                <option value="pending">OCR Pending</option>
              </select>

              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 bg-white rounded-lg text-sm"
              >
                <option value="all">All Types</option>
                <option value="pdf">PDF</option>
                <option value="image">Images</option>
                <option value="document">Documents</option>
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
                <option value="size">Size</option>
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

      {/* Documents List/Grid */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
        <div className="border-b border-gray-200 p-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <FolderOpen className="h-5 w-5 text-purple-600" />
              <h2 className="text-lg font-bold text-gray-900">Uploaded Documents</h2>
            </div>
            <span className="text-xs bg-purple-100 text-purple-700 px-3 py-1.5 rounded-full font-medium">
              {filteredDocs.length} of {documents.length}
            </span>
          </div>
        </div>

        <div className="p-5">
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-flex items-center space-x-3">
                <Loader2 className="h-6 w-6 text-purple-600 animate-spin" />
                <p className="text-gray-600">Loading documents...</p>
              </div>
            </div>
          ) : filteredDocs.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="h-8 w-8 text-gray-400" />
              </div>
              <p className="text-gray-500 mb-2">No documents found</p>
              <p className="text-xs text-gray-400">
                {searchTerm || filterStatus !== "all" || filterType !== "all"
                  ? "Try adjusting your filters"
                  : "Upload your first document to get started"}
              </p>
            </div>
          ) : viewMode === "grid" ? (
            /* Grid View */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredDocs.map((doc) => (
                <div
                  key={doc._id}
                  className="border border-gray-200 rounded-xl hover:border-purple-300 hover:shadow-lg transition-all group"
                >
                  <div className="p-5">
                    {/* File Icon and Preview */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="p-3 bg-gray-50 rounded-xl group-hover:scale-110 transition-transform">
                        {getFileIcon(doc.filename)}
                      </div>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        doc.ocrTextId
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}>
                        {doc.ocrTextId ? "OCR Done" : "Pending"}
                      </span>
                    </div>

                    {/* Document Info */}
                    <h3 className="font-semibold text-gray-900 mb-1 truncate">
                      {doc.filename}
                    </h3>
                    
                    <div className="space-y-1 mb-4">
                      <p className="text-xs text-gray-500 flex items-center">
                        <User className="h-3 w-3 mr-1" />
                        {doc.assignedUserId?.name || "Unassigned"}
                      </p>
                      <p className="text-xs text-gray-500 flex items-center">
                        <Calendar className="h-3 w-3 mr-1" />
                        {new Date(doc.createdAt).toLocaleDateString()}
                      </p>
                      <p className="text-xs text-gray-500 flex items-center">
                        <HardDrive className="h-3 w-3 mr-1" />
                        {formatFileSize(doc.size)}
                      </p>
                      <p className="text-xs text-gray-500 flex items-center">
                        <Tag className="h-3 w-3 mr-1" />
                        {getFileType(doc.filename)}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                      <div className="flex space-x-1">
                        <button
                          onClick={() => handlePreview(doc)}
                          className="p-1.5 hover:bg-gray-100 rounded-lg"
                          title="Preview"
                        >
                          <Eye className="h-4 w-4 text-gray-600" />
                        </button>
                        <button
                          onClick={() => handleDownload(doc)}
                          className="p-1.5 hover:bg-gray-100 rounded-lg"
                          title="Download"
                        >
                          <Download className="h-4 w-4 text-gray-600" />
                        </button>
                      </div>
                      <div className="flex space-x-1">
                        <button
                          onClick={() => handleRunOCR(doc._id)}
                          disabled={ocrLoading}
                          className="p-1.5 hover:bg-purple-100 rounded-lg"
                          title="Run OCR"
                        >
                          <Brain className="h-4 w-4 text-purple-600" />
                        </button>
                        <button
                          onClick={() => handleViewOCR(doc._id)}
                          className="p-1.5 hover:bg-blue-100 rounded-lg"
                          title="View OCR"
                        >
                          <FileSearch className="h-4 w-4 text-blue-600" />
                        </button>
                        <button
                          onClick={() => handleDelete(doc._id)}
                          className="p-1.5 hover:bg-red-100 rounded-lg"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4 text-red-600" />
                        </button>
                      </div>
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
                  className="border border-gray-200 rounded-xl hover:border-purple-300 hover:shadow-lg transition-all"
                >
                  <div className="p-5">
                    <div className="flex flex-col md:flex-row md:items-start gap-4">
                      {/* File Icon */}
                      <div className="flex-shrink-0">
                        <div className="p-3 bg-gray-50 rounded-xl">
                          {getFileIcon(doc.filename)}
                        </div>
                      </div>

                      {/* Document Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
                          <div>
                            <h3 className="text-lg font-bold text-gray-900 mb-2">
                              {doc.filename}
                            </h3>
                            
                            <div className="grid grid-cols-2 md:flex md:flex-wrap gap-3 text-sm">
                              <span className="flex items-center text-gray-600">
                                <User className="h-4 w-4 mr-1 text-gray-400" />
                                {doc.assignedUserId?.name || "Unassigned"}
                              </span>
                              
                              <span className="flex items-center text-gray-600">
                                <Calendar className="h-4 w-4 mr-1 text-gray-400" />
                                {new Date(doc.createdAt).toLocaleDateString()}
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

                            {/* OCR Status */}
                            <div className="mt-2">
                              <span className={`inline-flex items-center px-2 py-1 text-xs rounded-lg ${
                                doc.ocrTextId
                                  ? "bg-green-100 text-green-700"
                                  : "bg-yellow-100 text-yellow-700"
                              }`}>
                                {doc.ocrTextId ? (
                                  <>
                                    <CheckCircle className="h-3 w-3 mr-1" />
                                    OCR Completed
                                  </>
                                ) : (
                                  <>
                                    <AlertCircle className="h-3 w-3 mr-1" />
                                    OCR Pending
                                  </>
                                )}
                              </span>
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex flex-wrap gap-2">
                            <button
                              onClick={() => handlePreview(doc)}
                              className="p-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                              title="View"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                            
                            <button
                              onClick={() => handleDownload(doc)}
                              className="p-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                              title="Download"
                            >
                              <Download className="h-4 w-4" />
                            </button>

                            <button
                              onClick={() => handleRunOCR(doc._id)}
                              disabled={ocrLoading}
                              className="p-2 border border-purple-300 text-purple-600 rounded-lg hover:bg-purple-50 disabled:opacity-50"
                              title="Run OCR"
                            >
                              <Brain className="h-4 w-4" />
                            </button>

                            <button
                              onClick={() => handleViewOCR(doc._id)}
                              className="p-2 border border-blue-300 text-blue-600 rounded-lg hover:bg-blue-50"
                              title="View OCR Text"
                            >
                              <FileSearch className="h-4 w-4" />
                            </button>

                            <button
                              onClick={() => handleDelete(doc._id)}
                              className="p-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50"
                              title="Delete"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Document Preview Modal */}
      {previewDoc && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                {getFileIcon(previewDoc.filename)}
                <h3 className="text-lg font-bold text-gray-900 truncate max-w-md">
                  {previewDoc.filename}
                </h3>
              </div>
              <button
                onClick={() => setPreviewDoc(null)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              <iframe
                src={`${BACKEND_URL}/${previewDoc.path}`}
                className="w-full h-[600px] border-0"
                title="Document Preview"
              />
            </div>
            
            <div className="border-t border-gray-200 p-4 bg-gray-50 flex justify-end space-x-3">
              <button
                onClick={() => handleDownload(previewDoc)}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center space-x-2"
              >
                <Download className="h-4 w-4" />
                <span>Download</span>
              </button>
              <button
                onClick={() => setPreviewDoc(null)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* OCR Text Modal */}
      {openOCR && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setOpenOCR(false)}
        >
          <div 
            className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl border border-gray-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-5 border-b border-gray-200">
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <FileSearch className="h-5 w-5 text-purple-600" />
                </div>
                <h2 className="text-lg font-bold text-gray-900">OCR Extracted Text</h2>
              </div>
              <button
                onClick={() => setOpenOCR(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 max-h-[60vh] overflow-y-auto">
              {ocrLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 text-purple-600 animate-spin" />
                  <span className="ml-2 text-gray-600">Loading OCR text...</span>
                </div>
              ) : (
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                  <pre className="whitespace-pre-wrap font-mono text-sm text-gray-700">
                    {ocrText}
                  </pre>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end space-x-3 p-5 border-t border-gray-200 bg-gray-50">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(ocrText);
                  toast.success("Copied to clipboard!");
                }}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors flex items-center space-x-2"
              >
                <Copy className="h-4 w-4" />
                <span>Copy</span>
              </button>
              <button
                onClick={() => setOpenOCR(false)}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
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