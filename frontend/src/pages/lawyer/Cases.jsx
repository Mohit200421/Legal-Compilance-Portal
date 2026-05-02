import { useEffect, useState } from "react";
import API from "../../api/axios";
import toast from "react-hot-toast";
import {
  Briefcase,
  Plus,
  Trash2,
  Edit2,
  User,
  Calendar,
  Clock,
  FileText,
  Scale,
  Gavel,
  Search,
  Filter,
  ChevronDown,
  X,
  AlertCircle,
  CheckCircle,
  ArrowRight,
  MoreVertical,
  FolderOpen,
  TrendingUp,
  Award,
  Users,
  Phone,
  Mail,
  MapPin,
  Shield,
  BookOpen,
  BarChart3,
  RefreshCw,
  Download,
  Upload,
  Share2,
  Printer,
  Eye,
  Copy,
  Star,
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

export default function Cases() {
  const [cases, setCases] = useState([]);
  const [filteredCases, setFilteredCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCase, setSelectedCase] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  const [caseTitle, setCaseTitle] = useState("");
  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [caseType, setCaseType] = useState("");
  const [caseStatus, setCaseStatus] = useState("active");
  const [filingDate, setFilingDate] = useState("");
  const [courtName, setCourtName] = useState("");
  const [judgeName, setJudgeName] = useState("");
  const [opposingParty, setOpposingParty] = useState("");
  const [caseNumber, setCaseNumber] = useState("");
  const [description, setDescription] = useState("");
  const [editingId, setEditingId] = useState(null);

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

  const fetchCases = async () => {
    try {
      setLoading(true);
      const res = await API.get("/lawyer/case");
      setCases(res.data);
      setFilteredCases(res.data);
    } catch (err) {
      console.log(err);
      toast.error("Failed to load cases");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCases();
  }, []);

  useEffect(() => {
    let result = [...cases];

    if (searchTerm) {
      result = result.filter(c => 
        c.caseTitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.clientName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.caseType?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.caseNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.courtName?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterType !== "all") {
      result = result.filter(c => c.caseType === filterType);
    }

    if (filterStatus !== "all") {
      result = result.filter(c => c.caseStatus === filterStatus);
    }

    setFilteredCases(result);
  }, [cases, searchTerm, filterType, filterStatus]);

  const handleAddCase = async (e) => {
    e.preventDefault();

    if (!caseTitle || !clientName || !caseType) {
      return toast.error("Please fill all required fields");
    }

    try {
      const caseData = {
        caseTitle,
        clientName,
        clientEmail,
        clientPhone,
        caseType,
        caseStatus,
        filingDate,
        courtName,
        judgeName,
        opposingParty,
        caseNumber,
        description
      };

      if (editingId) {
        await API.put(`/lawyer/case/${editingId}`, caseData);
        toast.success("Case updated successfully");
        setEditingId(null);
      } else {
        await API.post("/lawyer/case", caseData);
        toast.success("Case added successfully");
      }

      setCaseTitle("");
      setClientName("");
      setClientEmail("");
      setClientPhone("");
      setCaseType("");
      setCaseStatus("active");
      setFilingDate("");
      setCourtName("");
      setJudgeName("");
      setOpposingParty("");
      setCaseNumber("");
      setDescription("");
      
      fetchCases();
    } catch (err) {
      console.log(err);
      toast.error(err?.response?.data?.error || "Operation failed");
    }
  };

  const handleEdit = (caseItem) => {
    setEditingId(caseItem._id);
    setCaseTitle(caseItem.caseTitle);
    setClientName(caseItem.clientName);
    setClientEmail(caseItem.clientEmail || "");
    setClientPhone(caseItem.clientPhone || "");
    setCaseType(caseItem.caseType);
    setCaseStatus(caseItem.caseStatus || "active");
    setFilingDate(caseItem.filingDate ? caseItem.filingDate.split('T')[0] : "");
    setCourtName(caseItem.courtName || "");
    setJudgeName(caseItem.judgeName || "");
    setOpposingParty(caseItem.opposingParty || "");
    setCaseNumber(caseItem.caseNumber || "");
    setDescription(caseItem.description || "");
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this case?")) return;
    
    try {
      await API.delete(`/lawyer/case/${id}`);
      toast.success("Case deleted successfully");
      fetchCases();
    } catch (err) {
      console.log(err);
      toast.error("Failed to delete case");
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setCaseTitle("");
    setClientName("");
    setClientEmail("");
    setClientPhone("");
    setCaseType("");
    setCaseStatus("active");
    setFilingDate("");
    setCourtName("");
    setJudgeName("");
    setOpposingParty("");
    setCaseNumber("");
    setDescription("");
  };

  const viewCaseDetails = (caseItem) => {
    setSelectedCase(caseItem);
    setShowDetails(true);
  };

  const caseTypes = [
    "Civil", "Criminal", "Corporate", "Family", "Property",
    "Tax", "Employment", "Intellectual Property", "Constitutional", "Environmental"
  ];

  const caseStatuses = [
    { value: "active", label: "Active", color: "#4caf50", icon: CheckCircle },
    { value: "pending", label: "Pending", color: colors.tertiary, icon: Clock },
    { value: "resolved", label: "Resolved", color: colors.secondary, icon: CheckCircle },
    { value: "closed", label: "Closed", color: colors.onSurfaceVariant, icon: X }
  ];

  const stats = {
    total: cases.length,
    active: cases.filter(c => c.caseStatus === "active").length,
    pending: cases.filter(c => c.caseStatus === "pending").length,
    resolved: cases.filter(c => c.caseStatus === "resolved").length
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
              <Briefcase className="h-4 w-4 mr-2" style={{ color: colors.secondary }} />
              <span className="text-xs font-semibold tracking-wider" style={{ color: colors.secondary }}>
                CASE MANAGEMENT
              </span>
            </div>
            <h1 className="text-xl md:text-2xl lg:text-3xl font-bold leading-[1.2] tracking-[-0.02em]" style={{ color: colors.onSurface }}>
              Case Management
            </h1>
            <p className="text-xs md:text-sm mt-1" style={{ color: colors.onSurfaceVariant }}>
              Manage your legal cases and client information
            </p>
          </div>
          
          {/* Stats Cards - Mobile */}
          <div className="md:hidden flex space-x-2 overflow-x-auto pb-2">
            <div className={`flex-shrink-0 ${glassCardClass} px-4 py-2 min-w-[100px]`}>
              <p className="text-xs" style={{ color: colors.onSurfaceVariant }}>Total</p>
              <p className="text-lg font-bold" style={{ color: colors.onSurface }}>{stats.total}</p>
            </div>
            <div className={`flex-shrink-0 ${glassCardClass} px-4 py-2 min-w-[100px]`}>
              <p className="text-xs" style={{ color: colors.onSurfaceVariant }}>Active</p>
              <p className="text-lg font-bold" style={{ color: "#4caf50" }}>{stats.active}</p>
            </div>
            <div className={`flex-shrink-0 ${glassCardClass} px-4 py-2 min-w-[100px]`}>
              <p className="text-xs" style={{ color: colors.onSurfaceVariant }}>Pending</p>
              <p className="text-lg font-bold" style={{ color: colors.tertiary }}>{stats.pending}</p>
            </div>
            <div className={`flex-shrink-0 ${glassCardClass} px-4 py-2 min-w-[100px]`}>
              <p className="text-xs" style={{ color: colors.onSurfaceVariant }}>Resolved</p>
              <p className="text-lg font-bold" style={{ color: colors.secondary }}>{stats.resolved}</p>
            </div>
          </div>

          {/* Desktop Stats */}
          <div className="hidden md:flex items-center space-x-4">
            <div className={`${glassCardClass} px-6 py-3`}>
              <p className="text-xs" style={{ color: colors.onSurfaceVariant }}>Total Cases</p>
              <p className="text-2xl font-bold" style={{ color: colors.onSurface }}>{stats.total}</p>
            </div>
            <div className={`${glassCardClass} px-6 py-3`}>
              <p className="text-xs" style={{ color: colors.onSurfaceVariant }}>Active</p>
              <p className="text-2xl font-bold" style={{ color: "#4caf50" }}>{stats.active}</p>
            </div>
            <div className={`${glassCardClass} px-6 py-3`}>
              <p className="text-xs" style={{ color: colors.onSurfaceVariant }}>Pending</p>
              <p className="text-2xl font-bold" style={{ color: colors.tertiary }}>{stats.pending}</p>
            </div>
            <div className={`${glassCardClass} px-6 py-3`}>
              <p className="text-xs" style={{ color: colors.onSurfaceVariant }}>Resolved</p>
              <p className="text-2xl font-bold" style={{ color: colors.secondary }}>{stats.resolved}</p>
            </div>
            <button
              onClick={fetchCases}
              className={`${glassCardClass} p-3 transition-all duration-200 hover:shadow-[0_8px_30px_rgba(30,41,59,0.1)]`}
              title="Refresh"
            >
              <RefreshCw className="h-5 w-5" style={{ color: colors.onSurfaceVariant }} />
            </button>
          </div>
        </div>
      </div>

      {/* Add/Edit Case Form - Glass Card */}
      <div className={`${glassCardClass} mb-6 overflow-hidden`}>
        <div 
          className="p-5"
          style={{ background: `linear-gradient(135deg, ${colors.secondary}, ${colors.secondaryContainer})` }}
        >
          <div className="flex items-center space-x-2">
            {editingId ? <Edit2 className="h-5 w-5 text-white" /> : <Plus className="h-5 w-5 text-white" />}
            <h2 className="text-lg font-bold text-white">
              {editingId ? "Edit Case" : "Add New Case"}
            </h2>
          </div>
          <p className="text-xs mt-1" style={{ color: "rgba(255,255,255,0.8)" }}>
            {editingId ? "Update case information" : "Enter new case details"}
          </p>
        </div>

        <form onSubmit={handleAddCase} className="p-5">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: colors.onSurfaceVariant }}>
                Case Title <span style={{ color: colors.error }}>*</span>
              </label>
              <input
                type="text"
                placeholder="e.g., Smith vs Corporation"
                value={caseTitle}
                onChange={(e) => setCaseTitle(e.target.value)}
                className={inputClass}
                style={{
                  backgroundColor: colors.surfaceContainerLowest,
                  border: `1px solid ${colors.outlineVariant}`,
                  color: colors.onSurface,
                }}
                onFocus={handleInputFocus}
                onBlur={handleInputBlur}
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: colors.onSurfaceVariant }}>
                Case Number
              </label>
              <input
                type="text"
                placeholder="e.g., CIV-2024-001"
                value={caseNumber}
                onChange={(e) => setCaseNumber(e.target.value)}
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
                Client Name <span style={{ color: colors.error }}>*</span>
              </label>
              <input
                type="text"
                placeholder="Full name of client"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                className={inputClass}
                style={{
                  backgroundColor: colors.surfaceContainerLowest,
                  border: `1px solid ${colors.outlineVariant}`,
                  color: colors.onSurface,
                }}
                onFocus={handleInputFocus}
                onBlur={handleInputBlur}
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: colors.onSurfaceVariant }}>
                Client Email
              </label>
              <input
                type="email"
                placeholder="client@example.com"
                value={clientEmail}
                onChange={(e) => setClientEmail(e.target.value)}
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
                Client Phone
              </label>
              <input
                type="tel"
                placeholder="+1 234 567 8900"
                value={clientPhone}
                onChange={(e) => setClientPhone(e.target.value)}
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
                Case Type <span style={{ color: colors.error }}>*</span>
              </label>
              <div className="relative">
                <select
                  value={caseType}
                  onChange={(e) => setCaseType(e.target.value)}
                  className={`${inputClass} appearance-none`}
                  style={{
                    backgroundColor: colors.surfaceContainerLowest,
                    border: `1px solid ${colors.outlineVariant}`,
                    color: colors.onSurface,
                  }}
                  onFocus={handleInputFocus}
                  onBlur={handleInputBlur}
                  required
                >
                  <option value="">Select case type</option>
                  {caseTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 pointer-events-none" style={{ color: colors.outline }} />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: colors.onSurfaceVariant }}>
                Case Status
              </label>
              <div className="relative">
                <select
                  value={caseStatus}
                  onChange={(e) => setCaseStatus(e.target.value)}
                  className={`${inputClass} appearance-none`}
                  style={{
                    backgroundColor: colors.surfaceContainerLowest,
                    border: `1px solid ${colors.outlineVariant}`,
                    color: colors.onSurface,
                  }}
                  onFocus={handleInputFocus}
                  onBlur={handleInputBlur}
                >
                  {caseStatuses.map(status => (
                    <option key={status.value} value={status.value}>{status.label}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 pointer-events-none" style={{ color: colors.outline }} />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: colors.onSurfaceVariant }}>
                Filing Date
              </label>
              <input
                type="date"
                value={filingDate}
                onChange={(e) => setFilingDate(e.target.value)}
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
                Court Name
              </label>
              <input
                type="text"
                placeholder="e.g., District Court"
                value={courtName}
                onChange={(e) => setCourtName(e.target.value)}
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
                Judge Name
              </label>
              <input
                type="text"
                placeholder="Honorable Judge"
                value={judgeName}
                onChange={(e) => setJudgeName(e.target.value)}
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
                Opposing Party
              </label>
              <input
                type="text"
                placeholder="Name of opposing party"
                value={opposingParty}
                onChange={(e) => setOpposingParty(e.target.value)}
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

            <div className="md:col-span-2 lg:col-span-3">
              <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: colors.onSurfaceVariant }}>
                Case Description
              </label>
              <textarea
                placeholder="Brief description of the case..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
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
          </div>

          <div className="flex items-center space-x-3 mt-6 pt-4" style={{ borderTop: `1px solid ${colors.outlineVariant}` }}>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl font-medium transition-all duration-200 flex items-center space-x-2 shadow-lg"
              style={{ 
                backgroundColor: colors.secondary,
                color: "white",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = colors.secondaryContainer;
                e.currentTarget.style.transform = "translateY(-1px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = colors.secondary;
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              {editingId ? <Edit2 className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
              <span>{editingId ? "Update Case" : "Add Case"}</span>
            </button>
            
            {editingId && (
              <button
                type="button"
                onClick={cancelEdit}
                className="px-6 py-2.5 rounded-xl font-medium transition-all duration-200"
                style={{ border: `1px solid ${colors.outlineVariant}`, color: colors.onSurfaceVariant }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colors.surfaceContainerHighest}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Search and Filters - Glass Card */}
      <div className={`${glassCardClass} mb-6 p-4`}>
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: colors.outline }} />
              <input
                type="text"
                placeholder="Search cases by title, client, type, or case number..."
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
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                >
                  <X className="h-4 w-4" style={{ color: colors.outline }} />
                </button>
              )}
            </div>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className="md:hidden p-2.5 rounded-xl"
              style={{ backgroundColor: colors.surfaceContainerHighest }}
            >
              <Filter className="h-5 w-5" style={{ color: colors.onSurfaceVariant }} />
            </button>
          </div>

          <div className="hidden md:flex items-center gap-3">
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4" style={{ color: colors.outline }} />
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
                {caseTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

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
              {caseStatuses.map(status => (
                <option key={status.value} value={status.value}>{status.label}</option>
              ))}
            </select>

            <span className="text-sm ml-auto" style={{ color: colors.onSurfaceVariant }}>
              Showing <span className="font-medium" style={{ color: colors.onSurface }}>{filteredCases.length}</span> of {cases.length} cases
            </span>
          </div>

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
                {caseTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>

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
                {caseStatuses.map(status => (
                  <option key={status.value} value={status.value}>{status.label}</option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Cases List - Glass Card */}
      <div className={`${glassCardClass} overflow-hidden`}>
        <div className="p-5" style={{ borderBottom: `1px solid ${colors.outlineVariant}` }}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <FolderOpen className="h-5 w-5" style={{ color: colors.secondary }} />
              <h2 className="text-lg font-bold" style={{ color: colors.onSurface }}>My Cases</h2>
            </div>
          </div>
        </div>

        <div className="p-5">
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-flex items-center space-x-3">
                <div className="w-6 h-6 border-2 animate-spin rounded-full" style={{ borderColor: colors.secondary, borderTopColor: "transparent" }} />
                <p style={{ color: colors.onSurfaceVariant }}>Loading cases...</p>
              </div>
            </div>
          ) : filteredCases.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: colors.surfaceContainerHighest }}>
                <Briefcase className="h-8 w-8" style={{ color: colors.onSurfaceVariant }} />
              </div>
              <p className="mb-2" style={{ color: colors.onSurfaceVariant }}>No cases found</p>
              <p className="text-xs" style={{ color: colors.outline }}>
                {searchTerm || filterType !== "all" || filterStatus !== "all"
                  ? "Try adjusting your filters"
                  : "Add your first case to get started"}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredCases.map((caseItem) => {
                const statusConfig = caseStatuses.find(s => s.value === caseItem.caseStatus) || caseStatuses[1];
                const StatusIcon = statusConfig.icon;

                return (
                  <div
                    key={caseItem._id}
                    className="rounded-xl transition-all duration-200 hover:shadow-md"
                    style={{ border: `1px solid ${colors.outlineVariant}`, backgroundColor: colors.surfaceContainerLowest }}
                  >
                    <div className="p-5">
                      <div className="flex flex-col lg:flex-row lg:items-start gap-4">
                        <div className="flex-shrink-0">
                          <div className="w-12 h-12 rounded-xl flex items-center justify-center shadow-md" style={{ background: `linear-gradient(135deg, ${colors.secondary}, ${colors.secondaryContainer})` }}>
                            <Gavel className="h-6 w-6 text-white" />
                          </div>
                        </div>

                        <div className="flex-1">
                          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
                            <div>
                              <div className="flex items-center flex-wrap gap-2 mb-2">
                                <h3 className="text-lg font-bold" style={{ color: colors.onSurface }}>
                                  {caseItem.caseTitle}
                                </h3>
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium" style={{ backgroundColor: `${statusConfig.color}15`, color: statusConfig.color }}>
                                  <StatusIcon className="h-3 w-3 mr-1" />
                                  {statusConfig.label}
                                </span>
                              </div>

                              {caseItem.caseNumber && (
                                <p className="text-xs mb-2" style={{ color: colors.onSurfaceVariant }}>
                                  Case #: {caseItem.caseNumber}
                                </p>
                              )}

                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mt-3">
                                <div className="flex items-center space-x-2">
                                  <User className="h-4 w-4" style={{ color: colors.outline }} />
                                  <span className="text-sm" style={{ color: colors.onSurfaceVariant }}>{caseItem.clientName}</span>
                                </div>

                                {caseItem.clientEmail && (
                                  <div className="flex items-center space-x-2">
                                    <Mail className="h-4 w-4" style={{ color: colors.outline }} />
                                    <span className="text-sm" style={{ color: colors.onSurfaceVariant }}>{caseItem.clientEmail}</span>
                                  </div>
                                )}

                                {caseItem.clientPhone && (
                                  <div className="flex items-center space-x-2">
                                    <Phone className="h-4 w-4" style={{ color: colors.outline }} />
                                    <span className="text-sm" style={{ color: colors.onSurfaceVariant }}>{caseItem.clientPhone}</span>
                                  </div>
                                )}

                                <div className="flex items-center space-x-2">
                                  <FileText className="h-4 w-4" style={{ color: colors.outline }} />
                                  <span className="text-sm" style={{ color: colors.onSurfaceVariant }}>{caseItem.caseType}</span>
                                </div>

                                {caseItem.courtName && (
                                  <div className="flex items-center space-x-2">
                                    <Scale className="h-4 w-4" style={{ color: colors.outline }} />
                                    <span className="text-sm" style={{ color: colors.onSurfaceVariant }}>{caseItem.courtName}</span>
                                  </div>
                                )}

                                {caseItem.filingDate && (
                                  <div className="flex items-center space-x-2">
                                    <Calendar className="h-4 w-4" style={{ color: colors.outline }} />
                                    <span className="text-sm" style={{ color: colors.onSurfaceVariant }}>
                                      Filed: {new Date(caseItem.filingDate).toLocaleDateString()}
                                    </span>
                                  </div>
                                )}
                              </div>

                              {caseItem.description && (
                                <p className="text-sm mt-3 line-clamp-2" style={{ color: colors.onSurfaceVariant }}>
                                  {caseItem.description}
                                </p>
                              )}
                            </div>

                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => viewCaseDetails(caseItem)}
                                className="p-2 rounded-lg transition-all duration-200"
                                style={{ border: `1px solid ${colors.outlineVariant}`, color: colors.onSurfaceVariant }}
                                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colors.surfaceContainerHighest}
                                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
                                title="View details"
                              >
                                <Eye className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => handleEdit(caseItem)}
                                className="p-2 rounded-lg transition-all duration-200"
                                style={{ border: `1px solid ${colors.outlineVariant}`, color: colors.onSurfaceVariant }}
                                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colors.surfaceContainerHighest}
                                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
                                title="Edit case"
                              >
                                <Edit2 className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => handleDelete(caseItem._id)}
                                className="p-2 rounded-lg transition-all duration-200"
                                style={{ border: `1px solid ${colors.error}30`, color: colors.error }}
                                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colors.errorContainer}
                                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
                                title="Delete case"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Case Details Modal - Glassmorphism */}
      {showDetails && selectedCase && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className={`${glassCardClass} max-w-3xl w-full max-h-[90vh] overflow-y-auto`} style={{ backgroundColor: "rgba(255, 255, 255, 0.95)" }}>
            <div className="sticky top-0 p-5 flex items-center justify-between" style={{ borderBottom: `1px solid ${colors.outlineVariant}` }}>
              <div className="flex items-center space-x-2">
                <Gavel className="h-5 w-5" style={{ color: colors.secondary }} />
                <h3 className="text-lg font-bold" style={{ color: colors.onSurface }}>Case Details</h3>
              </div>
              <button
                onClick={() => {
                  setShowDetails(false);
                  setSelectedCase(null);
                }}
                className="p-2 rounded-lg transition-colors"
                style={{ color: colors.onSurfaceVariant }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colors.surfaceContainerHighest}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="p-6">
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold mb-2" style={{ color: colors.onSurface }}>{selectedCase.caseTitle}</h2>
                  {selectedCase.caseNumber && (
                    <p className="text-sm" style={{ color: colors.onSurfaceVariant }}>Case Number: {selectedCase.caseNumber}</p>
                  )}
                </div>

                <div className="flex items-center space-x-2">
                  {(() => {
                    const statusConfig = caseStatuses.find(s => s.value === selectedCase.caseStatus) || caseStatuses[1];
                    const StatusIcon = statusConfig.icon;
                    return (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium" style={{ backgroundColor: `${statusConfig.color}15`, color: statusConfig.color }}>
                        <StatusIcon className="h-4 w-4 mr-1" />
                        {statusConfig.label}
                      </span>
                    );
                  })()}
                </div>

                <div className="pt-4" style={{ borderTop: `1px solid ${colors.outlineVariant}` }}>
                  <h4 className="text-sm font-semibold mb-3 flex items-center" style={{ color: colors.onSurfaceVariant }}>
                    <User className="h-4 w-4 mr-2" style={{ color: colors.secondary }} />
                    Client Information
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs" style={{ color: colors.onSurfaceVariant }}>Name</p>
                      <p className="text-sm font-medium" style={{ color: colors.onSurface }}>{selectedCase.clientName}</p>
                    </div>
                    {selectedCase.clientEmail && (
                      <div>
                        <p className="text-xs" style={{ color: colors.onSurfaceVariant }}>Email</p>
                        <p className="text-sm" style={{ color: colors.onSurfaceVariant }}>{selectedCase.clientEmail}</p>
                      </div>
                    )}
                    {selectedCase.clientPhone && (
                      <div>
                        <p className="text-xs" style={{ color: colors.onSurfaceVariant }}>Phone</p>
                        <p className="text-sm" style={{ color: colors.onSurfaceVariant }}>{selectedCase.clientPhone}</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="pt-4" style={{ borderTop: `1px solid ${colors.outlineVariant}` }}>
                  <h4 className="text-sm font-semibold mb-3 flex items-center" style={{ color: colors.onSurfaceVariant }}>
                    <FileText className="h-4 w-4 mr-2" style={{ color: colors.secondary }} />
                    Case Details
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs" style={{ color: colors.onSurfaceVariant }}>Case Type</p>
                      <p className="text-sm font-medium" style={{ color: colors.onSurface }}>{selectedCase.caseType}</p>
                    </div>
                    {selectedCase.filingDate && (
                      <div>
                        <p className="text-xs" style={{ color: colors.onSurfaceVariant }}>Filing Date</p>
                        <p className="text-sm" style={{ color: colors.onSurfaceVariant }}>
                          {new Date(selectedCase.filingDate).toLocaleDateString('en-US', {
                            month: 'long',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </p>
                      </div>
                    )}
                    {selectedCase.courtName && (
                      <div>
                        <p className="text-xs" style={{ color: colors.onSurfaceVariant }}>Court</p>
                        <p className="text-sm" style={{ color: colors.onSurfaceVariant }}>{selectedCase.courtName}</p>
                      </div>
                    )}
                    {selectedCase.judgeName && (
                      <div>
                        <p className="text-xs" style={{ color: colors.onSurfaceVariant }}>Judge</p>
                        <p className="text-sm" style={{ color: colors.onSurfaceVariant }}>{selectedCase.judgeName}</p>
                      </div>
                    )}
                    {selectedCase.opposingParty && (
                      <div>
                        <p className="text-xs" style={{ color: colors.onSurfaceVariant }}>Opposing Party</p>
                        <p className="text-sm" style={{ color: colors.onSurfaceVariant }}>{selectedCase.opposingParty}</p>
                      </div>
                    )}
                  </div>
                </div>

                {selectedCase.description && (
                  <div className="pt-4" style={{ borderTop: `1px solid ${colors.outlineVariant}` }}>
                    <h4 className="text-sm font-semibold mb-3" style={{ color: colors.onSurfaceVariant }}>Description</h4>
                    <p className="text-sm p-4 rounded-lg" style={{ backgroundColor: colors.surfaceContainerLow, color: colors.onSurfaceVariant }}>
                      {selectedCase.description}
                    </p>
                  </div>
                )}

                <div className="pt-4" style={{ borderTop: `1px solid ${colors.outlineVariant}` }}>
                  <div className="flex items-center justify-between text-xs" style={{ color: colors.onSurfaceVariant }}>
                    <span>Created: {new Date(selectedCase.createdAt).toLocaleString()}</span>
                    {selectedCase.updatedAt !== selectedCase.createdAt && (
                      <span>Last updated: {new Date(selectedCase.updatedAt).toLocaleString()}</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-5 flex justify-end space-x-3" style={{ borderTop: `1px solid ${colors.outlineVariant}`, backgroundColor: colors.surfaceContainerLow }}>
              <button
                onClick={() => {
                  setShowDetails(false);
                  setSelectedCase(null);
                }}
                className="px-4 py-2 rounded-lg transition-all duration-200"
                style={{ border: `1px solid ${colors.outlineVariant}`, color: colors.onSurfaceVariant }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colors.surfaceContainerHighest}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
              >
                Close
              </button>
              <button
                onClick={() => {
                  handleEdit(selectedCase);
                  setShowDetails(false);
                }}
                className="px-4 py-2 rounded-lg transition-all duration-200"
                style={{ backgroundColor: colors.secondary, color: "white" }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colors.secondaryContainer}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = colors.secondary}
              >
                Edit Case
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Quick Tips */}
      <div className="mt-6 rounded-xl p-4" style={{ backgroundColor: `${colors.secondary}10`, borderLeft: `4px solid ${colors.secondary}` }}>
        <div className="flex items-start">
          <AlertCircle className="h-5 w-5 mr-3 flex-shrink-0 mt-0.5" style={{ color: colors.secondary }} />
          <div>
            <h3 className="text-sm font-medium mb-1" style={{ color: colors.onSurface }}>Case Management Tips</h3>
            <p className="text-xs" style={{ color: colors.onSurfaceVariant }}>
              Add detailed case information to help track progress. You can add case events and documents after creating the case. Keep all client information up to date for better communication.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}