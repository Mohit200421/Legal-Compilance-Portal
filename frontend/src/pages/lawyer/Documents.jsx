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

export default function Documents() {
  const [file, setFile] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [filteredDocs, setFilteredDocs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [viewMode, setViewMode] = useState("list");

  const [requests, setRequests] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState("");

  const [openOCR, setOpenOCR] = useState(false);
  const [ocrText, setOcrText] = useState("");
  const [ocrLoading, setOcrLoading] = useState(false);
  const [ocrDocId, setOcrDocId] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterType, setFilterType] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [showFilters, setShowFilters] = useState(false);

  const [previewDoc, setPreviewDoc] = useState(null);

  const BACKEND_URL = import.meta.env.VITE_API_URL;

  // Glassmorphism card style
  const glassCardClass = "bg-white/80 backdrop-blur-md rounded-xl shadow-[0_4px_20px_rgba(30,41,59,0.05)] border border-white/50";
  const inputClass = "w-full px-4 py-2.5 rounded-xl text-sm transition-all duration-200 focus:outline-none";

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

  useEffect(() => {
    let result = [...documents];

    if (searchTerm) {
      result = result.filter(doc => 
        doc.filename?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.assignedUserId?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.assignedUserId?.email?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterStatus !== "all") {
      result = result.filter(doc => 
        filterStatus === "completed" ? doc.ocrTextId : !doc.ocrTextId
      );
    }

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

    result.sort((a, b) => {
      if (sortBy === "newest") return new Date(b.createdAt) - new Date(a.createdAt);
      if (sortBy === "oldest") return new Date(a.createdAt) - new Date(b.createdAt);
      if (sortBy === "name") return a.filename?.localeCompare(b.filename);
      if (sortBy === "size") return (b.size || 0) - (a.size || 0);
      return 0;
    });

    setFilteredDocs(result);
  }, [documents, searchTerm, filterStatus, filterType, sortBy]);

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
      
      const fileInput = document.getElementById("file-upload");
      if (fileInput) fileInput.value = "";
    } catch (err) {
      console.log(err);
      toast.error(err?.response?.data?.error || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

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

  const handleView = (doc) => {
    const fileUrl = `${BACKEND_URL}/${doc.path}`;
    window.open(fileUrl, "_blank");
  };

  const handlePreview = (doc) => {
    setPreviewDoc(doc);
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
    if (ext === 'pdf') return <FileText className="h-5 w-5" style={{ color: colors.error }} />;
    if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext)) return <Image className="h-5 w-5" style={{ color: colors.secondary }} />;
    if (['doc', 'docx', 'txt', 'rtf'].includes(ext)) return <FileText className="h-5 w-5" style={{ color: colors.secondary }} />;
    if (['xls', 'xlsx', 'csv'].includes(ext)) return <FileSpreadsheet className="h-5 w-5" style={{ color: "#4caf50" }} />;
    if (['zip', 'rar', '7z', 'tar', 'gz'].includes(ext)) return <FileArchive className="h-5 w-5" style={{ color: colors.tertiary }} />;
    return <File className="h-5 w-5" style={{ color: colors.onSurfaceVariant }} />;
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
    <div className="min-h-screen p-4 md:p-6 lg:p-8" style={{ backgroundColor: colors.surface }}>
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
              Document Management
            </h1>
            <p className="text-xs md:text-sm mt-1" style={{ color: colors.onSurfaceVariant }}>
              Upload, manage, and process legal documents with OCR
            </p>
          </div>
          
          {/* Stats Cards - Mobile */}
          <div className="md:hidden flex space-x-2 overflow-x-auto pb-2">
            <div className={`flex-shrink-0 ${glassCardClass} px-4 py-2 min-w-[100px]`}>
              <p className="text-xs" style={{ color: colors.onSurfaceVariant }}>Total</p>
              <p className="text-lg font-bold" style={{ color: colors.onSurface }}>{stats.total}</p>
            </div>
            <div className={`flex-shrink-0 ${glassCardClass} px-4 py-2 min-w-[100px]`}>
              <p className="text-xs" style={{ color: colors.onSurfaceVariant }}>OCR Done</p>
              <p className="text-lg font-bold" style={{ color: "#4caf50" }}>{stats.ocrCompleted}</p>
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
            <div className={`${glassCardClass} px-6 py-3`}>
              <p className="text-xs" style={{ color: colors.onSurfaceVariant }}>OCR Completed</p>
              <p className="text-2xl font-bold" style={{ color: "#4caf50" }}>{stats.ocrCompleted}</p>
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

      {/* Upload Form - Glass Card */}
      <div className={`${glassCardClass} mb-6 overflow-hidden`}>
        <div 
          className="p-5"
          style={{ background: `linear-gradient(135deg, ${colors.secondary}, ${colors.secondaryContainer})` }}
        >
          <div className="flex items-center space-x-2">
            <Upload className="h-5 w-5 text-white" />
            <h2 className="text-lg font-bold text-white">Upload New Document</h2>
          </div>
          <p className="text-xs mt-1" style={{ color: "rgba(255,255,255,0.8)" }}>
            Assign documents to clients for review and processing
          </p>
        </div>

        <form onSubmit={handleUpload} className="p-5">
          <div className="grid md:grid-cols-3 gap-4">
            {/* User Selection */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: colors.onSurfaceVariant }}>
                Assign to Client
              </label>
              <div className="relative">
                <UserPlus className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: colors.outline }} />
                <select
                  value={selectedUserId}
                  onChange={(e) => setSelectedUserId(e.target.value)}
                  className={`${inputClass} appearance-none`}
                  style={{
                    backgroundColor: colors.surfaceContainerLowest,
                    border: `1px solid ${colors.outlineVariant}`,
                    color: colors.onSurface,
                    paddingLeft: "2.25rem"
                  }}
                  onFocus={handleInputFocus}
                  onBlur={handleInputBlur}
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
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 pointer-events-none" style={{ color: colors.outline }} />
              </div>
            </div>

            {/* File Upload */}
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: colors.onSurfaceVariant }}>
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
                  <div 
                    className={`w-full px-4 py-2.5 ${inputClass} flex items-center`}
                    style={{
                      backgroundColor: colors.surfaceContainerLowest,
                      border: `1px solid ${colors.outlineVariant}`,
                      color: colors.onSurfaceVariant,
                    }}
                  >
                    <File className="h-4 w-4 mr-2" style={{ color: colors.outline }} />
                    <span className="truncate">{file ? file.name : "Choose a file..."}</span>
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={uploading}
                  className="px-6 py-2.5 rounded-xl font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                  style={{ 
                    backgroundColor: colors.secondary,
                    color: "white",
                    boxShadow: `0 4px 12px ${colors.secondary}40`
                  }}
                  onMouseEnter={(e) => {
                    if (!uploading) {
                      e.currentTarget.style.backgroundColor = colors.secondaryContainer;
                      e.currentTarget.style.transform = "translateY(-1px)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!uploading) {
                      e.currentTarget.style.backgroundColor = colors.secondary;
                      e.currentTarget.style.transform = "translateY(0)";
                    }
                  }}
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

      {/* Filters Bar - Glass Card */}
      <div className={`${glassCardClass} mb-6 p-4`}>
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: colors.outline }} />
              <input
                type="text"
                placeholder="Search by filename or client..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={inputClass}
                style={{
                  backgroundColor: colors.surfaceContainerLowest,
                  border: `1px solid ${colors.outlineVariant}`,
                  color: colors.onSurface,
                  paddingLeft: "2.25rem"
                }}
                onFocus={handleInputFocus}
                onBlur={handleInputBlur}
              />
            </div>
            
            {/* View Toggle */}
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

            <button
              onClick={() => setShowFilters(!showFilters)}
              className="md:hidden p-2.5 rounded-xl"
              style={{ backgroundColor: colors.surfaceContainerHighest }}
            >
              <Filter className="h-5 w-5" style={{ color: colors.onSurfaceVariant }} />
            </button>
          </div>

          {/* Filters - Desktop */}
          <div className="hidden md:flex items-center gap-3">
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4" style={{ color: colors.outline }} />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 rounded-lg text-sm transition-all duration-200 focus:outline-none"
                style={{
                  backgroundColor: colors.surfaceContainerLowest,
                  border: `1px solid ${colors.outlineVariant}`,
                  color: colors.onSurface,
                }}
                onFocus={handleInputFocus}
                onBlur={handleInputBlur}
              >
                <option value="all">All Status</option>
                <option value="completed">OCR Completed</option>
                <option value="pending">OCR Pending</option>
              </select>
            </div>

            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-3 py-2 rounded-lg text-sm transition-all duration-200 focus:outline-none"
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
              <option value="document">Documents</option>
              <option value="spreadsheet">Spreadsheets</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 rounded-lg text-sm transition-all duration-200 focus:outline-none"
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

            <span className="text-sm ml-auto" style={{ color: colors.onSurfaceVariant }}>
              Showing {filteredDocs.length} of {documents.length} documents
            </span>
          </div>

          {/* Filters - Mobile */}
          {showFilters && (
            <div className="md:hidden space-y-3 pt-2">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-3 py-2 rounded-lg text-sm"
                style={{
                  backgroundColor: colors.surfaceContainerLowest,
                  border: `1px solid ${colors.outlineVariant}`,
                  color: colors.onSurface,
                }}
              >
                <option value="all">All Status</option>
                <option value="completed">OCR Completed</option>
                <option value="pending">OCR Pending</option>
              </select>

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
                <option value="document">Documents</option>
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
                <option value="size">Size</option>
              </select>

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

      {/* Documents List/Grid - Glass Card */}
      <div className={`${glassCardClass} overflow-hidden`}>
        <div className="p-5" style={{ borderBottom: `1px solid ${colors.outlineVariant}` }}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <FolderOpen className="h-5 w-5" style={{ color: colors.secondary }} />
              <h2 className="text-lg font-bold" style={{ color: colors.onSurface }}>Uploaded Documents</h2>
            </div>
            <span className="text-xs px-3 py-1.5 rounded-full font-medium" style={{ backgroundColor: `${colors.secondary}10`, color: colors.secondary }}>
              {filteredDocs.length} of {documents.length}
            </span>
          </div>
        </div>

        <div className="p-5">
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-flex items-center space-x-3">
                <Loader2 className="h-6 w-6 animate-spin" style={{ color: colors.secondary }} />
                <p style={{ color: colors.onSurfaceVariant }}>Loading documents...</p>
              </div>
            </div>
          ) : filteredDocs.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: colors.surfaceContainerHighest }}>
                <FileText className="h-8 w-8" style={{ color: colors.onSurfaceVariant }} />
              </div>
              <p className="mb-2" style={{ color: colors.onSurfaceVariant }}>No documents found</p>
              <p className="text-xs" style={{ color: colors.outline }}>
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
                  className="rounded-xl transition-all duration-200 hover:shadow-md"
                  style={{ border: `1px solid ${colors.outlineVariant}`, backgroundColor: colors.surfaceContainerLowest }}
                >
                  <div className="p-5">
                    <div className="flex items-start justify-between mb-4">
                      <div className="p-3 rounded-xl transition-transform group-hover:scale-110" style={{ backgroundColor: colors.surfaceContainerHighest }}>
                        {getFileIcon(doc.filename)}
                      </div>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        doc.ocrTextId
                          ? "text-green-700"
                          : "text-yellow-700"
                      }`} style={{
                        backgroundColor: doc.ocrTextId ? "#4caf5015" : `${colors.tertiary}15`
                      }}>
                        {doc.ocrTextId ? "OCR Done" : "Pending"}
                      </span>
                    </div>

                    <h3 className="font-semibold mb-1 truncate" style={{ color: colors.onSurface }}>
                      {doc.filename}
                    </h3>
                    
                    <div className="space-y-1 mb-4">
                      <p className="text-xs flex items-center" style={{ color: colors.onSurfaceVariant }}>
                        <User className="h-3 w-3 mr-1" style={{ color: colors.outline }} />
                        {doc.assignedUserId?.name || "Unassigned"}
                      </p>
                      <p className="text-xs flex items-center" style={{ color: colors.onSurfaceVariant }}>
                        <Calendar className="h-3 w-3 mr-1" style={{ color: colors.outline }} />
                        {new Date(doc.createdAt).toLocaleDateString()}
                      </p>
                      <p className="text-xs flex items-center" style={{ color: colors.onSurfaceVariant }}>
                        <HardDrive className="h-3 w-3 mr-1" style={{ color: colors.outline }} />
                        {formatFileSize(doc.size)}
                      </p>
                      <p className="text-xs flex items-center" style={{ color: colors.onSurfaceVariant }}>
                        <Tag className="h-3 w-3 mr-1" style={{ color: colors.outline }} />
                        {getFileType(doc.filename)}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-3" style={{ borderTop: `1px solid ${colors.outlineVariant}` }}>
                      <div className="flex space-x-1">
                        <button
                          onClick={() => handlePreview(doc)}
                          className="p-1.5 rounded-lg transition-colors"
                          style={{ color: colors.onSurfaceVariant }}
                          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colors.surfaceContainerHighest}
                          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
                          title="Preview"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDownload(doc)}
                          className="p-1.5 rounded-lg transition-colors"
                          style={{ color: colors.onSurfaceVariant }}
                          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colors.surfaceContainerHighest}
                          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
                          title="Download"
                        >
                          <Download className="h-4 w-4" />
                        </button>
                      </div>
                      <div className="flex space-x-1">
                        <button
                          onClick={() => handleRunOCR(doc._id)}
                          disabled={ocrLoading}
                          className="p-1.5 rounded-lg transition-colors disabled:opacity-50"
                          style={{ color: colors.secondary }}
                          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = `${colors.secondary}10`}
                          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
                          title="Run OCR"
                        >
                          <Brain className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleViewOCR(doc._id)}
                          className="p-1.5 rounded-lg transition-colors"
                          style={{ color: colors.onSurfaceVariant }}
                          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colors.surfaceContainerHighest}
                          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
                          title="View OCR"
                        >
                          <FileSearch className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(doc._id)}
                          className="p-1.5 rounded-lg transition-colors"
                          style={{ color: colors.error }}
                          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colors.errorContainer}
                          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
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
                  className="rounded-xl transition-all duration-200 hover:shadow-md"
                  style={{ border: `1px solid ${colors.outlineVariant}`, backgroundColor: colors.surfaceContainerLowest }}
                >
                  <div className="p-5">
                    <div className="flex flex-col md:flex-row md:items-start gap-4">
                      <div className="flex-shrink-0">
                        <div className="p-3 rounded-xl" style={{ backgroundColor: colors.surfaceContainerHighest }}>
                          {getFileIcon(doc.filename)}
                        </div>
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
                          <div>
                            <h3 className="text-lg font-bold mb-2" style={{ color: colors.onSurface }}>
                              {doc.filename}
                            </h3>
                            
                            <div className="grid grid-cols-2 md:flex md:flex-wrap gap-3 text-sm">
                              <span className="flex items-center" style={{ color: colors.onSurfaceVariant }}>
                                <User className="h-4 w-4 mr-1" style={{ color: colors.outline }} />
                                {doc.assignedUserId?.name || "Unassigned"}
                              </span>
                              
                              <span className="flex items-center" style={{ color: colors.onSurfaceVariant }}>
                                <Calendar className="h-4 w-4 mr-1" style={{ color: colors.outline }} />
                                {new Date(doc.createdAt).toLocaleDateString()}
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

                            <div className="mt-2">
                              <span className={`inline-flex items-center px-2 py-1 text-xs rounded-lg ${
                                doc.ocrTextId
                                  ? "text-green-700"
                                  : "text-yellow-700"
                              }`} style={{
                                backgroundColor: doc.ocrTextId ? "#4caf5015" : `${colors.tertiary}15`
                              }}>
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

                          <div className="flex flex-wrap gap-2">
                            <button
                              onClick={() => handlePreview(doc)}
                              className="p-2 rounded-lg transition-all duration-200"
                              style={{ border: `1px solid ${colors.outlineVariant}`, color: colors.onSurfaceVariant }}
                              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colors.surfaceContainerHighest}
                              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
                              title="View"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                            
                            <button
                              onClick={() => handleDownload(doc)}
                              className="p-2 rounded-lg transition-all duration-200"
                              style={{ border: `1px solid ${colors.outlineVariant}`, color: colors.onSurfaceVariant }}
                              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colors.surfaceContainerHighest}
                              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
                              title="Download"
                            >
                              <Download className="h-4 w-4" />
                            </button>

                            <button
                              onClick={() => handleRunOCR(doc._id)}
                              disabled={ocrLoading}
                              className="p-2 rounded-lg transition-all duration-200 disabled:opacity-50"
                              style={{ border: `1px solid ${colors.secondary}30`, color: colors.secondary }}
                              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = `${colors.secondary}10`}
                              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
                              title="Run OCR"
                            >
                              <Brain className="h-4 w-4" />
                            </button>

                            <button
                              onClick={() => handleViewOCR(doc._id)}
                              className="p-2 rounded-lg transition-all duration-200"
                              style={{ border: `1px solid ${colors.outlineVariant}`, color: colors.onSurfaceVariant }}
                              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colors.surfaceContainerHighest}
                              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
                              title="View OCR Text"
                            >
                              <FileSearch className="h-4 w-4" />
                            </button>

                            <button
                              onClick={() => handleDelete(doc._id)}
                              className="p-2 rounded-lg transition-all duration-200"
                              style={{ border: `1px solid ${colors.error}30`, color: colors.error }}
                              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colors.errorContainer}
                              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
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

      {/* Document Preview Modal - Glassmorphism */}
      {previewDoc && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className={`${glassCardClass} max-w-4xl w-full max-h-[90vh] overflow-hidden`} style={{ backgroundColor: "rgba(255, 255, 255, 0.95)" }}>
            <div className="sticky top-0 p-4 flex items-center justify-between" style={{ borderBottom: `1px solid ${colors.outlineVariant}`, backgroundColor: "rgba(255, 255, 255, 0.95)" }}>
              <div className="flex items-center space-x-2">
                {getFileIcon(previewDoc.filename)}
                <h3 className="text-lg font-bold truncate max-w-md" style={{ color: colors.onSurface }}>
                  {previewDoc.filename}
                </h3>
              </div>
              <button
                onClick={() => setPreviewDoc(null)}
                className="p-2 rounded-lg transition-colors"
                style={{ color: colors.onSurfaceVariant }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colors.surfaceContainerHighest}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              <iframe
                src={`${BACKEND_URL}/${previewDoc.path}`}
                className="w-full h-[600px] border-0"
                title="Document Preview"
              />
            </div>
            
            <div className="p-4 flex justify-end space-x-3" style={{ borderTop: `1px solid ${colors.outlineVariant}`, backgroundColor: colors.surfaceContainerLow }}>
              <button
                onClick={() => handleDownload(previewDoc)}
                className="px-4 py-2 rounded-lg transition-all duration-200 flex items-center space-x-2"
                style={{ backgroundColor: colors.secondary, color: "white" }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colors.secondaryContainer}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = colors.secondary}
              >
                <Download className="h-4 w-4" />
                <span>Download</span>
              </button>
              <button
                onClick={() => setPreviewDoc(null)}
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

      {/* OCR Text Modal - Glassmorphism */}
      {openOCR && (
        <div 
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setOpenOCR(false)}
        >
          <div 
            className={`${glassCardClass} w-full max-w-3xl`}
            style={{ backgroundColor: "rgba(255, 255, 255, 0.95)" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-5" style={{ borderBottom: `1px solid ${colors.outlineVariant}` }}>
              <div className="flex items-center space-x-2">
                <div className="p-2 rounded-lg" style={{ backgroundColor: `${colors.secondary}10` }}>
                  <FileSearch className="h-5 w-5" style={{ color: colors.secondary }} />
                </div>
                <h2 className="text-lg font-bold" style={{ color: colors.onSurface }}>OCR Extracted Text</h2>
              </div>
              <button
                onClick={() => setOpenOCR(false)}
                className="p-2 rounded-lg transition-colors"
                style={{ color: colors.onSurfaceVariant }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colors.surfaceContainerHighest}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-5 max-h-[60vh] overflow-y-auto">
              {ocrLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin" style={{ color: colors.secondary }} />
                  <span className="ml-2" style={{ color: colors.onSurfaceVariant }}>Loading OCR text...</span>
                </div>
              ) : (
                <div className="rounded-xl p-4" style={{ backgroundColor: colors.surfaceContainerLow, border: `1px solid ${colors.outlineVariant}` }}>
                  <pre className="whitespace-pre-wrap font-mono text-sm" style={{ color: colors.onSurfaceVariant }}>
                    {ocrText}
                  </pre>
                </div>
              )}
            </div>

            <div className="flex items-center justify-end space-x-3 p-5" style={{ borderTop: `1px solid ${colors.outlineVariant}`, backgroundColor: colors.surfaceContainerLow }}>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(ocrText);
                  toast.success("Copied to clipboard!");
                }}
                className="px-4 py-2 rounded-lg transition-all duration-200 flex items-center space-x-2"
                style={{ border: `1px solid ${colors.outlineVariant}`, color: colors.onSurfaceVariant }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colors.surfaceContainerHighest}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
              >
                <Copy className="h-4 w-4" />
                <span>Copy</span>
              </button>
              <button
                onClick={() => setOpenOCR(false)}
                className="px-4 py-2 rounded-lg transition-all duration-200"
                style={{ backgroundColor: colors.secondary, color: "white" }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colors.secondaryContainer}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = colors.secondary}
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