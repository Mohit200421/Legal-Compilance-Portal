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
  Star
} from "lucide-react";

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

  // Form state
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

  // Filter and search
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

      // Reset form
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
    "Civil",
    "Criminal",
    "Corporate",
    "Family",
    "Property",
    "Tax",
    "Employment",
    "Intellectual Property",
    "Constitutional",
    "Environmental"
  ];

  const caseStatuses = [
    { value: "active", label: "Active", color: "green", icon: CheckCircle },
    { value: "pending", label: "Pending", color: "yellow", icon: Clock },
    { value: "resolved", label: "Resolved", color: "blue", icon: CheckCircle },
    { value: "closed", label: "Closed", color: "gray", icon: X }
  ];

  const stats = {
    total: cases.length,
    active: cases.filter(c => c.caseStatus === "active").length,
    pending: cases.filter(c => c.caseStatus === "pending").length,
    resolved: cases.filter(c => c.caseStatus === "resolved").length
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-6 md:mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="inline-flex items-center bg-blue-50 border border-blue-200 px-3 py-1.5 rounded-lg mb-3">
              <Briefcase className="h-4 w-4 text-blue-600 mr-2" />
              <span className="text-xs font-semibold text-blue-600 tracking-wider">CASE MANAGEMENT</span>
            </div>
            <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900">
              Case Management
            </h1>
            <p className="text-xs md:text-sm text-gray-500 mt-1">
              Manage your legal cases and client information
            </p>
          </div>
          
          {/* Stats Cards - Mobile Horizontal Scroll */}
          <div className="md:hidden flex space-x-2 overflow-x-auto pb-2">
            <div className="flex-shrink-0 bg-white rounded-xl border border-gray-200 px-4 py-2 min-w-[100px]">
              <p className="text-xs text-gray-500">Total</p>
              <p className="text-lg font-bold text-gray-900">{stats.total}</p>
            </div>
            <div className="flex-shrink-0 bg-white rounded-xl border border-gray-200 px-4 py-2 min-w-[100px]">
              <p className="text-xs text-gray-500">Active</p>
              <p className="text-lg font-bold text-green-600">{stats.active}</p>
            </div>
            <div className="flex-shrink-0 bg-white rounded-xl border border-gray-200 px-4 py-2 min-w-[100px]">
              <p className="text-xs text-gray-500">Pending</p>
              <p className="text-lg font-bold text-yellow-600">{stats.pending}</p>
            </div>
            <div className="flex-shrink-0 bg-white rounded-xl border border-gray-200 px-4 py-2 min-w-[100px]">
              <p className="text-xs text-gray-500">Resolved</p>
              <p className="text-lg font-bold text-blue-600">{stats.resolved}</p>
            </div>
          </div>

          {/* Desktop Stats */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="bg-white rounded-xl border border-gray-200 px-6 py-3">
              <p className="text-xs text-gray-500">Total Cases</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 px-6 py-3">
              <p className="text-xs text-gray-500">Active</p>
              <p className="text-2xl font-bold text-green-600">{stats.active}</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 px-6 py-3">
              <p className="text-xs text-gray-500">Pending</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 px-6 py-3">
              <p className="text-xs text-gray-500">Resolved</p>
              <p className="text-2xl font-bold text-blue-600">{stats.resolved}</p>
            </div>
            <button
              onClick={fetchCases}
              className="p-3 bg-white rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors"
              title="Refresh"
            >
              <RefreshCw className="h-5 w-5 text-gray-600" />
            </button>
          </div>
        </div>
      </div>

      {/* Add/Edit Case Form */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 mb-6 overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-5">
          <div className="flex items-center space-x-2">
            {editingId ? <Edit2 className="h-5 w-5 text-white" /> : <Plus className="h-5 w-5 text-white" />}
            <h2 className="text-lg font-bold text-white">
              {editingId ? "Edit Case" : "Add New Case"}
            </h2>
          </div>
          <p className="text-xs text-blue-100 mt-1">
            {editingId ? "Update case information" : "Enter new case details"}
          </p>
        </div>

        <form onSubmit={handleAddCase} className="p-5">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Case Title */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-2">
                Case Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g., Smith vs Corporation"
                value={caseTitle}
                onChange={(e) => setCaseTitle(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 bg-white rounded-xl text-sm focus:border-blue-600 focus:ring-2 focus:ring-blue-200 transition-all"
                required
              />
            </div>

            {/* Case Number */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-2">
                Case Number
              </label>
              <input
                type="text"
                placeholder="e.g., CIV-2024-001"
                value={caseNumber}
                onChange={(e) => setCaseNumber(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 bg-white rounded-xl text-sm focus:border-blue-600 focus:ring-2 focus:ring-blue-200 transition-all"
              />
            </div>

            {/* Client Name */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-2">
                Client Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Full name of client"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 bg-white rounded-xl text-sm focus:border-blue-600 focus:ring-2 focus:ring-blue-200 transition-all"
                required
              />
            </div>

            {/* Client Email */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-2">
                Client Email
              </label>
              <input
                type="email"
                placeholder="client@example.com"
                value={clientEmail}
                onChange={(e) => setClientEmail(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 bg-white rounded-xl text-sm focus:border-blue-600 focus:ring-2 focus:ring-blue-200 transition-all"
              />
            </div>

            {/* Client Phone */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-2">
                Client Phone
              </label>
              <input
                type="tel"
                placeholder="+1 234 567 8900"
                value={clientPhone}
                onChange={(e) => setClientPhone(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 bg-white rounded-xl text-sm focus:border-blue-600 focus:ring-2 focus:ring-blue-200 transition-all"
              />
            </div>

            {/* Case Type */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-2">
                Case Type <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  value={caseType}
                  onChange={(e) => setCaseType(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 bg-white rounded-xl text-sm focus:border-blue-600 focus:ring-2 focus:ring-blue-200 transition-all appearance-none"
                  required
                >
                  <option value="">Select case type</option>
                  {caseTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* Case Status */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-2">
                Case Status
              </label>
              <div className="relative">
                <select
                  value={caseStatus}
                  onChange={(e) => setCaseStatus(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 bg-white rounded-xl text-sm focus:border-blue-600 focus:ring-2 focus:ring-blue-200 transition-all appearance-none"
                >
                  {caseStatuses.map(status => (
                    <option key={status.value} value={status.value}>{status.label}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* Filing Date */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-2">
                Filing Date
              </label>
              <input
                type="date"
                value={filingDate}
                onChange={(e) => setFilingDate(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 bg-white rounded-xl text-sm focus:border-blue-600 focus:ring-2 focus:ring-blue-200 transition-all"
              />
            </div>

            {/* Court Name */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-2">
                Court Name
              </label>
              <input
                type="text"
                placeholder="e.g., District Court"
                value={courtName}
                onChange={(e) => setCourtName(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 bg-white rounded-xl text-sm focus:border-blue-600 focus:ring-2 focus:ring-blue-200 transition-all"
              />
            </div>

            {/* Judge Name */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-2">
                Judge Name
              </label>
              <input
                type="text"
                placeholder="Honorable Judge"
                value={judgeName}
                onChange={(e) => setJudgeName(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 bg-white rounded-xl text-sm focus:border-blue-600 focus:ring-2 focus:ring-blue-200 transition-all"
              />
            </div>

            {/* Opposing Party */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-2">
                Opposing Party
              </label>
              <input
                type="text"
                placeholder="Name of opposing party"
                value={opposingParty}
                onChange={(e) => setOpposingParty(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 bg-white rounded-xl text-sm focus:border-blue-600 focus:ring-2 focus:ring-blue-200 transition-all"
              />
            </div>

            {/* Description */}
            <div className="md:col-span-2 lg:col-span-3">
              <label className="block text-xs font-medium text-gray-700 mb-2">
                Case Description
              </label>
              <textarea
                placeholder="Brief description of the case..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="w-full px-4 py-2.5 border border-gray-300 bg-white rounded-xl text-sm focus:border-blue-600 focus:ring-2 focus:ring-blue-200 transition-all resize-none"
              />
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center space-x-3 mt-6 pt-4 border-t border-gray-200">
            <button
              type="submit"
              className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-medium hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg flex items-center space-x-2"
            >
              {editingId ? <Edit2 className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
              <span>{editingId ? "Update Case" : "Add Case"}</span>
            </button>
            
            {editingId && (
              <button
                type="button"
                onClick={cancelEdit}
                className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 mb-6 p-4">
        <div className="flex flex-col gap-4">
          {/* Search */}
          <div className="flex items-center gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search cases by title, client, type, or case number..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 border border-gray-300 bg-white rounded-xl text-sm focus:border-blue-600 focus:ring-2 focus:ring-blue-200 transition-all"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                >
                  <X className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                </button>
              )}
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
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-3 py-2 border border-gray-300 bg-white rounded-lg text-sm focus:border-blue-600 focus:ring-2 focus:ring-blue-200"
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
              className="px-3 py-2 border border-gray-300 bg-white rounded-lg text-sm focus:border-blue-600 focus:ring-2 focus:ring-blue-200"
            >
              <option value="all">All Status</option>
              {caseStatuses.map(status => (
                <option key={status.value} value={status.value}>{status.label}</option>
              ))}
            </select>

            <span className="text-sm text-gray-500 ml-auto">
              Showing <span className="font-medium text-gray-900">{filteredCases.length}</span> of {cases.length} cases
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
                {caseTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>

              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 bg-white rounded-lg text-sm"
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

      {/* Cases List */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
        <div className="border-b border-gray-200 p-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <FolderOpen className="h-5 w-5 text-blue-600" />
              <h2 className="text-lg font-bold text-gray-900">My Cases</h2>
            </div>
          </div>
        </div>

        <div className="p-5">
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-flex items-center space-x-3">
                <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent animate-spin rounded-full"></div>
                <p className="text-gray-600">Loading cases...</p>
              </div>
            </div>
          ) : filteredCases.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Briefcase className="h-8 w-8 text-gray-400" />
              </div>
              <p className="text-gray-500 mb-2">No cases found</p>
              <p className="text-xs text-gray-400">
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
                    className="border border-gray-200 rounded-xl hover:border-blue-300 hover:shadow-lg transition-all"
                  >
                    <div className="p-5">
                      <div className="flex flex-col lg:flex-row lg:items-start gap-4">
                        {/* Case Icon */}
                        <div className="flex-shrink-0">
                          <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-md">
                            <Gavel className="h-6 w-6 text-white" />
                          </div>
                        </div>

                        {/* Case Info */}
                        <div className="flex-1">
                          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
                            <div>
                              <div className="flex items-center flex-wrap gap-2 mb-2">
                                <h3 className="text-lg font-bold text-gray-900">
                                  {caseItem.caseTitle}
                                </h3>
                                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-${statusConfig.color}-100 text-${statusConfig.color}-700`}>
                                  <StatusIcon className="h-3 w-3 mr-1" />
                                  {statusConfig.label}
                                </span>
                              </div>

                              {caseItem.caseNumber && (
                                <p className="text-xs text-gray-500 mb-2">
                                  Case #: {caseItem.caseNumber}
                                </p>
                              )}

                              {/* Client Info */}
                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mt-3">
                                <div className="flex items-center space-x-2">
                                  <User className="h-4 w-4 text-gray-400" />
                                  <span className="text-sm text-gray-600">{caseItem.clientName}</span>
                                </div>

                                {caseItem.clientEmail && (
                                  <div className="flex items-center space-x-2">
                                    <Mail className="h-4 w-4 text-gray-400" />
                                    <span className="text-sm text-gray-600">{caseItem.clientEmail}</span>
                                  </div>
                                )}

                                {caseItem.clientPhone && (
                                  <div className="flex items-center space-x-2">
                                    <Phone className="h-4 w-4 text-gray-400" />
                                    <span className="text-sm text-gray-600">{caseItem.clientPhone}</span>
                                  </div>
                                )}

                                <div className="flex items-center space-x-2">
                                  <FileText className="h-4 w-4 text-gray-400" />
                                  <span className="text-sm text-gray-600">{caseItem.caseType}</span>
                                </div>

                                {caseItem.courtName && (
                                  <div className="flex items-center space-x-2">
                                    <Scale className="h-4 w-4 text-gray-400" />
                                    <span className="text-sm text-gray-600">{caseItem.courtName}</span>
                                  </div>
                                )}

                                {caseItem.filingDate && (
                                  <div className="flex items-center space-x-2">
                                    <Calendar className="h-4 w-4 text-gray-400" />
                                    <span className="text-sm text-gray-600">
                                      Filed: {new Date(caseItem.filingDate).toLocaleDateString()}
                                    </span>
                                  </div>
                                )}
                              </div>

                              {/* Description */}
                              {caseItem.description && (
                                <p className="text-sm text-gray-600 mt-3 line-clamp-2">
                                  {caseItem.description}
                                </p>
                              )}
                            </div>

                            {/* Action Buttons */}
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => viewCaseDetails(caseItem)}
                                className="p-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                                title="View details"
                              >
                                <Eye className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => handleEdit(caseItem)}
                                className="p-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                                title="Edit case"
                              >
                                <Edit2 className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => handleDelete(caseItem._id)}
                                className="p-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
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

      {/* Case Details Modal */}
      {showDetails && selectedCase && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-blue-700 p-5 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Gavel className="h-5 w-5 text-white" />
                <h3 className="text-lg font-bold text-white">Case Details</h3>
              </div>
              <button
                onClick={() => {
                  setShowDetails(false);
                  setSelectedCase(null);
                }}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                <X className="h-5 w-5 text-white" />
              </button>
            </div>
            
            <div className="p-6">
              <div className="space-y-6">
                {/* Case Header */}
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">{selectedCase.caseTitle}</h2>
                  {selectedCase.caseNumber && (
                    <p className="text-sm text-gray-500">Case Number: {selectedCase.caseNumber}</p>
                  )}
                </div>

                {/* Status Badge */}
                <div className="flex items-center space-x-2">
                  {(() => {
                    const statusConfig = caseStatuses.find(s => s.value === selectedCase.caseStatus) || caseStatuses[1];
                    const StatusIcon = statusConfig.icon;
                    return (
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-${statusConfig.color}-100 text-${statusConfig.color}-700`}>
                        <StatusIcon className="h-4 w-4 mr-1" />
                        {statusConfig.label}
                      </span>
                    );
                  })()}
                </div>

                {/* Client Information */}
                <div className="border-t border-gray-200 pt-4">
                  <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
                    <User className="h-4 w-4 mr-2 text-blue-600" />
                    Client Information
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-gray-500">Name</p>
                      <p className="text-sm font-medium text-gray-900">{selectedCase.clientName}</p>
                    </div>
                    {selectedCase.clientEmail && (
                      <div>
                        <p className="text-xs text-gray-500">Email</p>
                        <p className="text-sm text-gray-900">{selectedCase.clientEmail}</p>
                      </div>
                    )}
                    {selectedCase.clientPhone && (
                      <div>
                        <p className="text-xs text-gray-500">Phone</p>
                        <p className="text-sm text-gray-900">{selectedCase.clientPhone}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Case Details */}
                <div className="border-t border-gray-200 pt-4">
                  <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
                    <FileText className="h-4 w-4 mr-2 text-blue-600" />
                    Case Details
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-gray-500">Case Type</p>
                      <p className="text-sm font-medium text-gray-900">{selectedCase.caseType}</p>
                    </div>
                    {selectedCase.filingDate && (
                      <div>
                        <p className="text-xs text-gray-500">Filing Date</p>
                        <p className="text-sm text-gray-900">
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
                        <p className="text-xs text-gray-500">Court</p>
                        <p className="text-sm text-gray-900">{selectedCase.courtName}</p>
                      </div>
                    )}
                    {selectedCase.judgeName && (
                      <div>
                        <p className="text-xs text-gray-500">Judge</p>
                        <p className="text-sm text-gray-900">{selectedCase.judgeName}</p>
                      </div>
                    )}
                    {selectedCase.opposingParty && (
                      <div>
                        <p className="text-xs text-gray-500">Opposing Party</p>
                        <p className="text-sm text-gray-900">{selectedCase.opposingParty}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Description */}
                {selectedCase.description && (
                  <div className="border-t border-gray-200 pt-4">
                    <h4 className="text-sm font-semibold text-gray-700 mb-3">Description</h4>
                    <p className="text-sm text-gray-600 bg-gray-50 p-4 rounded-lg">
                      {selectedCase.description}
                    </p>
                  </div>
                )}

                {/* Metadata */}
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex items-center justify-between text-xs text-gray-400">
                    <span>Created: {new Date(selectedCase.createdAt).toLocaleString()}</span>
                    {selectedCase.updatedAt !== selectedCase.createdAt && (
                      <span>Last updated: {new Date(selectedCase.updatedAt).toLocaleString()}</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="border-t border-gray-200 p-5 bg-gray-50 flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowDetails(false);
                  setSelectedCase(null);
                }}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
              >
                Close
              </button>
              <button
                onClick={() => {
                  handleEdit(selectedCase);
                  setShowDetails(false);
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Edit Case
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Quick Tips */}
      <div className="mt-6 bg-blue-50 border-l-4 border-blue-600 rounded-xl p-4">
        <div className="flex items-start">
          <AlertCircle className="h-5 w-5 text-blue-600 mr-3 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="text-sm font-medium text-blue-900 mb-1">Case Management Tips</h3>
            <p className="text-xs text-blue-700">
              Add detailed case information to help track progress. You can add case events and documents after creating the case. Keep all client information up to date for better communication.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}