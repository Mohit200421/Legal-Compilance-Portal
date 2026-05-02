import { useEffect, useState } from "react";
import API from "../../api/axios";
import toast from "react-hot-toast";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  Award,
  FileText,
  CheckCircle,
  XCircle,
  Eye,
  Shield,
  Calendar,
  Clock,
  Star,
  BookOpen,
  AlertCircle,
  Search,
  X,
  Scale,
  TrendingUp,
  Users,
  Filter,
  ChevronDown,
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

export default function PendingLawyers() {
  const [lawyers, setLawyers] = useState([]);
  const [filteredLawyers, setFilteredLawyers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedLawyer, setSelectedLawyer] = useState(null);

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

  const fetchPendingLawyers = async () => {
    try {
      setLoading(true);
      const res = await API.get("/admin/pending-lawyers");
      setLawyers(res.data || []);
      setFilteredLawyers(res.data || []);
    } catch (err) {
      console.log(err);
      toast.error("Failed to load pending lawyers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingLawyers();
  }, []);

  useEffect(() => {
    let result = lawyers;

    if (searchTerm) {
      result = result.filter(l => 
        l.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        l.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        l.specialization?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        l.city?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredLawyers(result);
  }, [searchTerm, lawyers]);

  const handleApprove = async (id) => {
    try {
      const res = await API.put(`/admin/pending-lawyers/${id}/approve`);
      toast.success(res.data?.msg || "Lawyer approved");
      setSelectedLawyer(null);
      fetchPendingLawyers();
    } catch (err) {
      console.log(err);
      toast.error(err?.response?.data?.msg || "Approve failed");
    }
  };

  const handleReject = async (id) => {
    if (!window.confirm("Are you sure you want to reject this lawyer?")) return;

    try {
      const res = await API.put(`/admin/pending-lawyers/${id}/reject`);
      toast.success(res.data?.msg || "Lawyer rejected");
      setSelectedLawyer(null);
      fetchPendingLawyers();
    } catch (err) {
      console.log(err);
      toast.error(err?.response?.data?.msg || "Reject failed");
    }
  };

  const formatKey = (key) => {
    return key
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, (str) => str.toUpperCase());
  };

  const allowedFields = [
    "name",
    "email",
    "username",
    "phone",
    "city",
    "state",
    "experience",
    "specialization",
    "barCouncilNumber",
    "about",
  ];

  return (
    <div className="min-h-screen p-4 md:p-6" style={{ backgroundColor: colors.surface }}>
      {/* Page Header */}
      <div className="mb-6 md:mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div 
              className="inline-flex items-center px-3 py-1.5 rounded-lg mb-3"
              style={{ backgroundColor: `${colors.tertiary}15`, border: `1px solid ${colors.tertiary}20` }}
            >
              <Clock className="h-4 w-4 mr-2" style={{ color: colors.tertiary }} />
              <span className="text-xs font-semibold tracking-wider" style={{ color: colors.tertiary }}>
                PENDING REVIEW
              </span>
            </div>
            <h1 className="text-xl md:text-2xl lg:text-3xl font-bold leading-[1.2] tracking-[-0.02em]" style={{ color: colors.onSurface }}>
              Pending Lawyer Requests
            </h1>
            <p className="text-xs md:text-sm mt-1" style={{ color: colors.onSurfaceVariant }}>
              Review and approve lawyer applications
            </p>
          </div>
          
          {/* Stats */}
          <div className="flex items-center space-x-3">
            <div className={`${glassCardClass} px-4 py-2`}>
              <p className="text-xs" style={{ color: colors.onSurfaceVariant }}>Pending</p>
              <p className="text-xl font-bold" style={{ color: colors.tertiary }}>{lawyers.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search Bar - Glass Card */}
      <div className={`${glassCardClass} mb-6 p-4`}>
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: colors.outline }} />
              <input
                type="text"
                placeholder="Search by name, email, specialization, or city..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-10 py-2.5 rounded-xl text-sm transition-all duration-200 focus:outline-none"
                style={{
                  backgroundColor: colors.surfaceContainerLowest,
                  border: `1px solid ${colors.outlineVariant}`,
                  color: colors.onSurface,
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
          </div>
        </div>
      </div>

      {/* Lawyers Table - Glass Card */}
      <div className={`${glassCardClass} overflow-hidden`}>
        {loading ? (
          <div className="p-12 text-center">
            <div className="inline-flex items-center space-x-3">
              <div className="w-6 h-6 border-2 rounded-full animate-spin" style={{ borderColor: colors.secondary, borderTopColor: "transparent" }} />
              <p style={{ color: colors.onSurfaceVariant }}>Loading lawyers...</p>
            </div>
          </div>
        ) : filteredLawyers.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: colors.surfaceContainerHighest }}>
              <Shield className="h-8 w-8" style={{ color: colors.onSurfaceVariant }} />
            </div>
            <p className="mb-2" style={{ color: colors.onSurfaceVariant }}>No pending lawyers found</p>
            <p className="text-xs" style={{ color: colors.outline }}>
              {searchTerm ? "Try adjusting your search" : "All applications have been processed"}
            </p>
          </div>
        ) : (
          <>
            {/* Table Header */}
            <div className="p-5" style={{ borderBottom: `1px solid ${colors.outlineVariant}` }}>
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold" style={{ color: colors.onSurface }}>
                  Applications ({filteredLawyers.length})
                </h2>
              </div>
            </div>

            {/* Table - Desktop */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead className="sticky top-0" style={{ backgroundColor: colors.surfaceContainerLow, borderBottom: `1px solid ${colors.outlineVariant}` }}>
                  <tr>
                    <th className="text-left p-4 text-xs font-semibold uppercase tracking-wider" style={{ color: colors.onSurfaceVariant }}>
                      Lawyer Details
                    </th>
                    <th className="text-left p-4 text-xs font-semibold uppercase tracking-wider" style={{ color: colors.onSurfaceVariant }}>
                      Contact
                    </th>
                    <th className="text-left p-4 text-xs font-semibold uppercase tracking-wider" style={{ color: colors.onSurfaceVariant }}>
                      Specialization
                    </th>
                    <th className="text-right p-4 text-xs font-semibold uppercase tracking-wider" style={{ color: colors.onSurfaceVariant }}>
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y" style={{ borderColor: colors.outlineVariant }}>
                  {filteredLawyers.map((lawyer) => (
                    <tr key={lawyer._id} className="transition-colors hover:bg-surfaceContainerLow" style={{ backgroundColor: "transparent" }}>
                      <td className="p-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-md" style={{ background: `linear-gradient(135deg, ${colors.tertiary}, ${colors.tertiaryContainer})` }}>
                            <User className="h-5 w-5 text-white" />
                          </div>
                          <div>
                            <p className="font-medium" style={{ color: colors.onSurface }}>{lawyer.name}</p>
                            <div className="flex items-center text-xs mt-1" style={{ color: colors.onSurfaceVariant }}>
                              <Briefcase className="h-3 w-3 mr-1" style={{ color: colors.outline }} />
                              {lawyer.experience || "0"} years exp.
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="space-y-1">
                          <div className="flex items-center text-sm" style={{ color: colors.onSurfaceVariant }}>
                            <Mail className="h-3 w-3 mr-2" style={{ color: colors.outline }} />
                            {lawyer.email}
                          </div>
                          {lawyer.phone && (
                            <div className="flex items-center text-sm" style={{ color: colors.onSurfaceVariant }}>
                              <Phone className="h-3 w-3 mr-2" style={{ color: colors.outline }} />
                              {lawyer.phone}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="space-y-1">
                          <div className="flex items-center text-sm" style={{ color: colors.onSurfaceVariant }}>
                            <BookOpen className="h-3 w-3 mr-2" style={{ color: colors.outline }} />
                            {lawyer.specialization || "Not specified"}
                          </div>
                          {lawyer.city && (
                            <div className="flex items-center text-sm" style={{ color: colors.onSurfaceVariant }}>
                              <MapPin className="h-3 w-3 mr-2" style={{ color: colors.outline }} />
                              {lawyer.city}, {lawyer.state || ""}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => setSelectedLawyer(lawyer)}
                            className="p-2 rounded-lg transition-all duration-200"
                            style={{ border: `1px solid ${colors.outlineVariant}`, color: colors.onSurfaceVariant }}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colors.surfaceContainerHighest}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
                            title="View Details"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleApprove(lawyer._id)}
                            className="p-2 rounded-lg transition-all duration-200"
                            style={{ border: `1px solid #4caf5030`, color: "#4caf50" }}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#4caf5015"}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
                            title="Approve"
                          >
                            <CheckCircle className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleReject(lawyer._id)}
                            className="p-2 rounded-lg transition-all duration-200"
                            style={{ border: `1px solid ${colors.error}30`, color: colors.error }}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colors.errorContainer}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
                            title="Reject"
                          >
                            <XCircle className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden p-4 space-y-4">
              {filteredLawyers.map((lawyer) => (
                <div key={lawyer._id} className={`${glassCardClass} p-4 transition-all duration-300 hover:shadow-[0_8px_30px_rgba(30,41,59,0.1)]`}>
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-md" style={{ background: `linear-gradient(135deg, ${colors.tertiary}, ${colors.tertiaryContainer})` }}>
                        <User className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <p className="font-medium" style={{ color: colors.onSurface }}>{lawyer.name}</p>
                        <p className="text-xs" style={{ color: colors.onSurfaceVariant }}>{lawyer.experience || "0"} years exp.</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-xs" style={{ color: colors.onSurfaceVariant }}>
                      <Mail className="h-3 w-3 mr-2" style={{ color: colors.outline }} />
                      {lawyer.email}
                    </div>
                    {lawyer.phone && (
                      <div className="flex items-center text-xs" style={{ color: colors.onSurfaceVariant }}>
                        <Phone className="h-3 w-3 mr-2" style={{ color: colors.outline }} />
                        {lawyer.phone}
                      </div>
                    )}
                    <div className="flex items-center text-xs" style={{ color: colors.onSurfaceVariant }}>
                      <BookOpen className="h-3 w-3 mr-2" style={{ color: colors.outline }} />
                      {lawyer.specialization || "Not specified"}
                    </div>
                    {lawyer.city && (
                      <div className="flex items-center text-xs" style={{ color: colors.onSurfaceVariant }}>
                        <MapPin className="h-3 w-3 mr-2" style={{ color: colors.outline }} />
                        {lawyer.city}, {lawyer.state || ""}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-end space-x-2 pt-3" style={{ borderTop: `1px solid ${colors.outlineVariant}` }}>
                    <button
                      onClick={() => setSelectedLawyer(lawyer)}
                      className="p-2 rounded-lg transition-all duration-200"
                      style={{ border: `1px solid ${colors.outlineVariant}`, color: colors.onSurfaceVariant }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colors.surfaceContainerHighest}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleApprove(lawyer._id)}
                      className="p-2 rounded-lg transition-all duration-200"
                      style={{ border: `1px solid #4caf5030`, color: "#4caf50" }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#4caf5015"}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
                    >
                      <CheckCircle className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleReject(lawyer._id)}
                      className="p-2 rounded-lg transition-all duration-200"
                      style={{ border: `1px solid ${colors.error}30`, color: colors.error }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colors.errorContainer}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
                    >
                      <XCircle className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* View Card Modal - Glassmorphism */}
      {selectedLawyer && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedLawyer(null)}
        >
          <div
            className={`${glassCardClass} w-full max-w-2xl max-h-[90vh] overflow-hidden`}
            style={{ backgroundColor: "rgba(255, 255, 255, 0.95)" }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-5 flex items-center justify-between" style={{ background: `linear-gradient(135deg, ${colors.tertiary}, ${colors.tertiaryContainer})` }}>
              <div className="flex items-center space-x-2">
                <Shield className="h-5 w-5 text-white" />
                <h2 className="text-lg font-bold text-white">Lawyer Application Details</h2>
              </div>
              <button
                onClick={() => setSelectedLawyer(null)}
                className="p-2 rounded-lg transition-colors hover:bg-white/20"
              >
                <X className="h-5 w-5 text-white" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
              <div className="space-y-4">
                {allowedFields.map((key) => (
                  <div key={key} className="rounded-xl p-4" style={{ backgroundColor: colors.surfaceContainerLow }}>
                    <p className="text-xs mb-1" style={{ color: colors.onSurfaceVariant }}>{formatKey(key)}</p>
                    <p className="text-sm font-medium" style={{ color: colors.onSurface }}>
                      {selectedLawyer?.[key]
                        ? String(selectedLawyer[key])
                        : "N/A"}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end space-x-3 p-5" style={{ borderTop: `1px solid ${colors.outlineVariant}`, backgroundColor: colors.surfaceContainerLow }}>
              <button
                onClick={() => handleApprove(selectedLawyer._id)}
                className="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 shadow-md flex items-center space-x-2"
                style={{ backgroundColor: "#4caf50", color: "white" }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#45a049"}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#4caf50"}
              >
                <CheckCircle className="h-4 w-4" />
                <span>Approve Application</span>
              </button>
              <button
                onClick={() => handleReject(selectedLawyer._id)}
                className="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center space-x-2"
                style={{ border: `1px solid ${colors.error}30`, color: colors.error }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colors.errorContainer}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
              >
                <XCircle className="h-4 w-4" />
                <span>Reject</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}