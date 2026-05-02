import { useEffect, useState } from "react";
import API from "../../api/axios";
import toast from "react-hot-toast";
import {
  Calendar,
  Plus,
  Edit2,
  Trash2,
  Save,
  X,
  ChevronDown,
  Search,
  Clock,
  FileText,
  Briefcase,
  User,
  AlertCircle,
  CheckCircle,
  ArrowRight,
  FolderOpen,
  CalendarDays,
  RefreshCw,
  Filter,
  Bell,
  Gavel,
  Scale,
  MapPin,
  Users,
  Phone,
  Mail,
  Video,
  MessageCircle,
  Download,
  Upload,
  Share2,
  Copy,
  Star,
  TrendingUp,
  Award,
  MoreVertical,
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

export default function CaseEvents() {
  const [cases, setCases] = useState([]);
  const [selectedCaseId, setSelectedCaseId] = useState("");
  const [selectedCase, setSelectedCase] = useState(null);

  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [loadingCases, setLoadingCases] = useState(true);
  const [loadingEvents, setLoadingEvents] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  const [editingEventId, setEditingEventId] = useState(null);

  const [eventTitle, setEventTitle] = useState("");
  const [eventDetails, setEventDetails] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [eventTime, setEventTime] = useState("");
  const [eventLocation, setEventLocation] = useState("");
  const [eventType, setEventType] = useState("hearing");
  const [attendees, setAttendees] = useState("");
  const [reminder, setReminder] = useState("1day");

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
      setLoadingCases(true);
      const res = await API.get("/lawyer/case");
      setCases(res.data);
    } catch (err) {
      console.log(err);
      toast.error("Failed to load cases");
    } finally {
      setLoadingCases(false);
    }
  };

  const fetchEvents = async (caseId) => {
    if (!caseId) return;

    try {
      setLoadingEvents(true);
      const res = await API.get(`/lawyer/case/${caseId}/event`);
      setEvents(res.data);
      setFilteredEvents(res.data);
      
      const selected = cases.find(c => c._id === caseId);
      setSelectedCase(selected);
    } catch (err) {
      console.log(err);
      toast.error("Failed to load events");
    } finally {
      setLoadingEvents(false);
    }
  };

  useEffect(() => {
    fetchCases();
  }, []);

  useEffect(() => {
    if (selectedCaseId) {
      fetchEvents(selectedCaseId);
    } else {
      setSelectedCase(null);
      setEvents([]);
      setFilteredEvents([]);
    }
  }, [selectedCaseId]);

  useEffect(() => {
    let result = [...events];

    if (searchTerm) {
      result = result.filter(e => 
        e.eventTitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        e.eventDetails?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        e.eventLocation?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterType !== "all") {
      result = result.filter(e => e.eventType === filterType);
    }

    setFilteredEvents(result);
  }, [searchTerm, filterType, events]);

  const handleAddEvent = async (e) => {
    e.preventDefault();

    if (!selectedCaseId) return toast.error("Please select a case first!");
    if (!eventTitle.trim() || !eventDate)
      return toast.error("Event title & date required!");

    try {
      const eventData = {
        eventTitle,
        eventDetails,
        eventDate: eventTime ? `${eventDate}T${eventTime}` : eventDate,
        eventLocation,
        eventType,
        attendees: attendees.split(',').map(a => a.trim()).filter(a => a),
        reminder
      };

      if (editingEventId) {
        const res = await API.put(`/lawyer/case/event/${editingEventId}`, eventData);
        toast.success(res.data?.msg || "Event updated");
        setEditingEventId(null);
      } else {
        const res = await API.post("/lawyer/case/event", {
          caseId: selectedCaseId,
          ...eventData
        });
        toast.success(res.data?.msg || "Event added");
      }

      setEventTitle("");
      setEventDetails("");
      setEventDate("");
      setEventTime("");
      setEventLocation("");
      setEventType("hearing");
      setAttendees("");
      setReminder("1day");

      fetchEvents(selectedCaseId);
    } catch (err) {
      console.log(err);
      toast.error(err?.response?.data?.msg || "Operation failed");
    }
  };

  const handleEditClick = (event) => {
    setEditingEventId(event._id);
    setEventTitle(event.eventTitle);
    setEventDetails(event.eventDetails || "");
    
    if (event.eventDate) {
      const date = new Date(event.eventDate);
      setEventDate(date.toISOString().split('T')[0]);
      setEventTime(date.toTimeString().slice(0, 5));
    }
    
    setEventLocation(event.eventLocation || "");
    setEventType(event.eventType || "hearing");
    setAttendees(event.attendees?.join(', ') || "");
    setReminder(event.reminder || "1day");
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingEventId(null);
    setEventTitle("");
    setEventDetails("");
    setEventDate("");
    setEventTime("");
    setEventLocation("");
    setEventType("hearing");
    setAttendees("");
    setReminder("1day");
  };

  const handleDeleteEvent = async (eventId) => {
    if (!window.confirm("Are you sure you want to delete this event?")) return;

    try {
      const res = await API.delete(`/lawyer/case/event/${eventId}`);
      toast.success(res.data?.msg || "Event deleted");
      fetchEvents(selectedCaseId);
    } catch (err) {
      console.log(err);
      toast.error(err?.response?.data?.msg || "Failed to delete event");
    }
  };

  const viewEventDetails = (event) => {
    setSelectedEvent(event);
    setShowDetails(true);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const isUpcoming = (dateString) => {
    return new Date(dateString) > new Date();
  };

  const getEventTypeIcon = (type) => {
    switch(type) {
      case "hearing": return Gavel;
      case "meeting": return Users;
      case "deadline": return Clock;
      case "filing": return FileText;
      case "consultation": return MessageCircle;
      default: return Calendar;
    }
  };

  const getEventTypeColor = (type) => {
    switch(type) {
      case "hearing": return colors.error;
      case "meeting": return colors.secondary;
      case "deadline": return colors.error;
      case "filing": return "#4caf50";
      case "consultation": return colors.tertiary;
      default: return colors.onSurfaceVariant;
    }
  };

  const eventTypes = [
    { value: "hearing", label: "Court Hearing", icon: Gavel },
    { value: "meeting", label: "Client Meeting", icon: Users },
    { value: "deadline", label: "Filing Deadline", icon: Clock },
    { value: "filing", label: "Document Filing", icon: FileText },
    { value: "consultation", label: "Consultation", icon: MessageCircle },
    { value: "other", label: "Other", icon: Calendar }
  ];

  const reminderOptions = [
    { value: "15min", label: "15 minutes before" },
    { value: "30min", label: "30 minutes before" },
    { value: "1hour", label: "1 hour before" },
    { value: "2hours", label: "2 hours before" },
    { value: "1day", label: "1 day before" },
    { value: "2days", label: "2 days before" },
    { value: "1week", label: "1 week before" }
  ];

  const stats = {
    total: events.length,
    upcoming: events.filter(e => isUpcoming(e.eventDate)).length,
    hearings: events.filter(e => e.eventType === "hearing").length,
    meetings: events.filter(e => e.eventType === "meeting").length
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
              <CalendarDays className="h-4 w-4 mr-2" style={{ color: colors.secondary }} />
              <span className="text-xs font-semibold tracking-wider" style={{ color: colors.secondary }}>
                CASE EVENTS
              </span>
            </div>
            <h1 className="text-xl md:text-2xl lg:text-3xl font-bold leading-[1.2] tracking-[-0.02em]" style={{ color: colors.onSurface }}>
              Case Events Management
            </h1>
            <p className="text-xs md:text-sm mt-1" style={{ color: colors.onSurfaceVariant }}>
              Schedule and manage events for your legal cases
            </p>
          </div>
          
          {/* Stats Cards - Mobile */}
          <div className="md:hidden flex space-x-2 overflow-x-auto pb-2">
            <div className={`flex-shrink-0 ${glassCardClass} px-4 py-2 min-w-[100px]`}>
              <p className="text-xs" style={{ color: colors.onSurfaceVariant }}>Total</p>
              <p className="text-lg font-bold" style={{ color: colors.onSurface }}>{stats.total}</p>
            </div>
            <div className={`flex-shrink-0 ${glassCardClass} px-4 py-2 min-w-[100px]`}>
              <p className="text-xs" style={{ color: colors.onSurfaceVariant }}>Upcoming</p>
              <p className="text-lg font-bold" style={{ color: "#4caf50" }}>{stats.upcoming}</p>
            </div>
            <div className={`flex-shrink-0 ${glassCardClass} px-4 py-2 min-w-[100px]`}>
              <p className="text-xs" style={{ color: colors.onSurfaceVariant }}>Hearings</p>
              <p className="text-lg font-bold" style={{ color: colors.error }}>{stats.hearings}</p>
            </div>
            <div className={`flex-shrink-0 ${glassCardClass} px-4 py-2 min-w-[100px]`}>
              <p className="text-xs" style={{ color: colors.onSurfaceVariant }}>Meetings</p>
              <p className="text-lg font-bold" style={{ color: colors.secondary }}>{stats.meetings}</p>
            </div>
          </div>

          {/* Desktop Stats */}
          <div className="hidden md:flex items-center space-x-4">
            <div className={`${glassCardClass} px-6 py-3`}>
              <p className="text-xs" style={{ color: colors.onSurfaceVariant }}>Total Events</p>
              <p className="text-2xl font-bold" style={{ color: colors.onSurface }}>{stats.total}</p>
            </div>
            <div className={`${glassCardClass} px-6 py-3`}>
              <p className="text-xs" style={{ color: colors.onSurfaceVariant }}>Upcoming</p>
              <p className="text-2xl font-bold" style={{ color: "#4caf50" }}>{stats.upcoming}</p>
            </div>
            <div className={`${glassCardClass} px-6 py-3`}>
              <p className="text-xs" style={{ color: colors.onSurfaceVariant }}>Hearings</p>
              <p className="text-2xl font-bold" style={{ color: colors.error }}>{stats.hearings}</p>
            </div>
            <button
              onClick={() => selectedCaseId && fetchEvents(selectedCaseId)}
              className={`${glassCardClass} p-3 transition-all duration-200 hover:shadow-[0_8px_30px_rgba(30,41,59,0.1)]`}
              title="Refresh"
            >
              <RefreshCw className="h-5 w-5" style={{ color: colors.onSurfaceVariant }} />
            </button>
          </div>
        </div>
      </div>

      {/* Case Selection - Glass Card */}
      <div className={`${glassCardClass} mb-6 overflow-hidden`}>
        <div 
          className="p-5"
          style={{ background: `linear-gradient(135deg, ${colors.secondary}, ${colors.secondaryContainer})` }}
        >
          <div className="flex items-center space-x-2">
            <Briefcase className="h-5 w-5 text-white" />
            <h2 className="text-lg font-bold text-white">Select Case</h2>
          </div>
          <p className="text-xs mt-1" style={{ color: "rgba(255,255,255,0.8)" }}>
            Choose a case to view and manage its events
          </p>
        </div>

        <div className="p-5">
          {loadingCases ? (
            <div className="flex items-center justify-center py-8">
              <div className="inline-flex items-center space-x-3">
                <div className="w-5 h-5 border-2 animate-spin rounded-full" style={{ borderColor: colors.secondary, borderTopColor: "transparent" }} />
                <p style={{ color: colors.onSurfaceVariant }}>Loading cases...</p>
              </div>
            </div>
          ) : cases.length === 0 ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3" style={{ backgroundColor: colors.surfaceContainerHighest }}>
                <Briefcase className="h-6 w-6" style={{ color: colors.onSurfaceVariant }} />
              </div>
              <p className="mb-2" style={{ color: colors.onSurfaceVariant }}>No cases found</p>
              <p className="text-xs" style={{ color: colors.outline }}>Please add a case first to manage events.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              <div className="relative">
                <select
                  value={selectedCaseId}
                  onChange={(e) => setSelectedCaseId(e.target.value)}
                  className={`${inputClass} appearance-none`}
                  style={{
                    backgroundColor: colors.surfaceContainerLowest,
                    border: `1px solid ${colors.outlineVariant}`,
                    color: colors.onSurface,
                  }}
                  onFocus={handleInputFocus}
                  onBlur={handleInputBlur}
                >
                  <option value="">-- Select a case --</option>
                  {cases.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.caseTitle} - {c.clientName}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 pointer-events-none" style={{ color: colors.outline }} />
              </div>

              {selectedCase && (
                <div className="rounded-xl p-4" style={{ backgroundColor: `${colors.secondary}10`, border: `1px solid ${colors.secondary}20` }}>
                  <p className="text-xs mb-2" style={{ color: colors.secondary }}>Selected Case Details</p>
                  <p className="text-sm font-bold mb-1" style={{ color: colors.onSurface }}>{selectedCase?.caseTitle}</p>
                  <div className="flex items-center space-x-3 text-xs">
                    <span className="flex items-center" style={{ color: colors.onSurfaceVariant }}>
                      <User className="h-3 w-3 mr-1" style={{ color: colors.outline }} />
                      {selectedCase?.clientName}
                    </span>
                    <span className="flex items-center" style={{ color: colors.onSurfaceVariant }}>
                      <Scale className="h-3 w-3 mr-1" style={{ color: colors.outline }} />
                      {selectedCase?.caseType}
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {selectedCaseId && (
        <>
          {/* Add/Edit Event Form - Glass Card */}
          <div className={`${glassCardClass} mb-6 overflow-hidden`}>
            <div 
              className="p-5"
              style={{ background: editingEventId ? `linear-gradient(135deg, ${colors.tertiary}, ${colors.tertiaryContainer})` : `linear-gradient(135deg, ${colors.secondary}, ${colors.secondaryContainer})` }}
            >
              <div className="flex items-center space-x-2">
                {editingEventId ? <Edit2 className="h-5 w-5 text-white" /> : <Plus className="h-5 w-5 text-white" />}
                <h2 className="text-lg font-bold text-white">
                  {editingEventId ? "Edit Event" : "Add New Event"}
                </h2>
              </div>
              <p className="text-xs mt-1" style={{ color: "rgba(255,255,255,0.8)" }}>
                {editingEventId ? "Update event details" : "Schedule a new event for this case"}
              </p>
            </div>

            <form onSubmit={handleAddEvent} className="p-5">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: colors.onSurfaceVariant }}>
                    Event Title <span style={{ color: colors.error }}>*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Court Hearing, Client Meeting"
                    value={eventTitle}
                    onChange={(e) => setEventTitle(e.target.value)}
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
                    Event Type
                  </label>
                  <div className="relative">
                    <select
                      value={eventType}
                      onChange={(e) => setEventType(e.target.value)}
                      className={`${inputClass} appearance-none`}
                      style={{
                        backgroundColor: colors.surfaceContainerLowest,
                        border: `1px solid ${colors.outlineVariant}`,
                        color: colors.onSurface,
                      }}
                      onFocus={handleInputFocus}
                      onBlur={handleInputBlur}
                    >
                      {eventTypes.map(type => (
                        <option key={type.value} value={type.value}>{type.label}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 pointer-events-none" style={{ color: colors.outline }} />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: colors.onSurfaceVariant }}>
                    Event Date <span style={{ color: colors.error }}>*</span>
                  </label>
                  <input
                    type="date"
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
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
                    Event Time
                  </label>
                  <input
                    type="time"
                    value={eventTime}
                    onChange={(e) => setEventTime(e.target.value)}
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
                    Location
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Court Room 3, Zoom Link"
                    value={eventLocation}
                    onChange={(e) => setEventLocation(e.target.value)}
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
                    Reminder
                  </label>
                  <div className="relative">
                    <select
                      value={reminder}
                      onChange={(e) => setReminder(e.target.value)}
                      className={`${inputClass} appearance-none`}
                      style={{
                        backgroundColor: colors.surfaceContainerLowest,
                        border: `1px solid ${colors.outlineVariant}`,
                        color: colors.onSurface,
                      }}
                      onFocus={handleInputFocus}
                      onBlur={handleInputBlur}
                    >
                      {reminderOptions.map(option => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 pointer-events-none" style={{ color: colors.outline }} />
                  </div>
                </div>

                <div className="md:col-span-2 lg:col-span-3">
                  <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: colors.onSurfaceVariant }}>
                    Attendees (comma separated)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., John Doe, Jane Smith"
                    value={attendees}
                    onChange={(e) => setAttendees(e.target.value)}
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
                    Event Details
                  </label>
                  <textarea
                    placeholder="Add detailed information about the event..."
                    value={eventDetails}
                    onChange={(e) => setEventDetails(e.target.value)}
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
                    backgroundColor: editingEventId ? colors.tertiary : colors.secondary,
                    color: "white",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = editingEventId ? colors.tertiaryContainer : colors.secondaryContainer;
                    e.currentTarget.style.transform = "translateY(-1px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = editingEventId ? colors.tertiary : colors.secondary;
                    e.currentTarget.style.transform = "translateY(0)";
                  }}
                >
                  {editingEventId ? <Save className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                  <span>{editingEventId ? "Save Changes" : "Add Event"}</span>
                </button>
                
                {editingEventId && (
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    className="px-6 py-2.5 rounded-xl font-medium transition-all duration-200 flex items-center space-x-2"
                    style={{ border: `1px solid ${colors.outlineVariant}`, color: colors.onSurfaceVariant }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colors.surfaceContainerHighest}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
                  >
                    <X className="h-4 w-4" />
                    <span>Cancel</span>
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
                    placeholder="Search events by title, details, or location..."
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
                    <option value="all">All Events</option>
                    {eventTypes.map(type => (
                      <option key={type.value} value={type.value}>{type.label}</option>
                    ))}
                  </select>
                </div>

                <span className="text-sm ml-auto" style={{ color: colors.onSurfaceVariant }}>
                  Showing <span className="font-medium" style={{ color: colors.onSurface }}>{filteredEvents.length}</span> of {events.length} events
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
                    <option value="all">All Events</option>
                    {eventTypes.map(type => (
                      <option key={type.value} value={type.value}>{type.label}</option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          </div>

          {/* Events List - Glass Card */}
          <div className={`${glassCardClass} overflow-hidden`}>
            <div className="p-5" style={{ borderBottom: `1px solid ${colors.outlineVariant}` }}>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-5 w-5" style={{ color: colors.secondary }} />
                  <h2 className="text-lg font-bold" style={{ color: colors.onSurface }}>Events for {selectedCase?.caseTitle}</h2>
                </div>
              </div>
            </div>

            <div className="p-5">
              {loadingEvents ? (
                <div className="text-center py-12">
                  <div className="inline-flex items-center space-x-3">
                    <div className="w-6 h-6 border-2 animate-spin rounded-full" style={{ borderColor: colors.secondary, borderTopColor: "transparent" }} />
                    <p style={{ color: colors.onSurfaceVariant }}>Loading events...</p>
                  </div>
                </div>
              ) : filteredEvents.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: colors.surfaceContainerHighest }}>
                    <Calendar className="h-8 w-8" style={{ color: colors.onSurfaceVariant }} />
                  </div>
                  <p className="mb-2" style={{ color: colors.onSurfaceVariant }}>No events found</p>
                  <p className="text-xs" style={{ color: colors.outline }}>
                    {searchTerm || filterType !== "all"
                      ? "Try adjusting your filters"
                      : "Add your first event to get started"}
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredEvents.map((event) => {
                    const upcoming = isUpcoming(event.eventDate);
                    const EventIcon = getEventTypeIcon(event.eventType);
                    const color = getEventTypeColor(event.eventType);
                    
                    return (
                      <div
                        key={event._id}
                        className="rounded-xl transition-all duration-200 hover:shadow-md"
                        style={{ 
                          border: `1px solid ${colors.outlineVariant}`,
                          backgroundColor: upcoming ? `${color}05` : colors.surfaceContainerLowest,
                        }}
                      >
                        <div className="p-5">
                          <div className="flex flex-col md:flex-row md:items-start gap-4">
                            <div className="flex-shrink-0">
                              <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${color}15` }}>
                                <EventIcon className="h-6 w-6" style={{ color }} />
                              </div>
                            </div>

                            <div className="flex-1">
                              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
                                <div>
                                  <div className="flex items-center flex-wrap gap-2 mb-2">
                                    <h3 className="text-lg font-bold" style={{ color: colors.onSurface }}>
                                      {event.eventTitle}
                                    </h3>
                                    {upcoming && (
                                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium" style={{ backgroundColor: "#4caf5015", color: "#4caf50" }}>
                                        <Bell className="h-3 w-3 mr-1" />
                                        Upcoming
                                      </span>
                                    )}
                                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium" style={{ backgroundColor: `${color}15`, color }}>
                                      <EventIcon className="h-3 w-3 mr-1" />
                                      {eventTypes.find(t => t.value === event.eventType)?.label || "Event"}
                                    </span>
                                  </div>

                                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mt-3">
                                    <div className="flex items-center space-x-2">
                                      <Clock className="h-4 w-4" style={{ color: colors.outline }} />
                                      <span className="text-sm" style={{ color: colors.onSurfaceVariant }}>
                                        {formatDateTime(event.eventDate)}
                                      </span>
                                    </div>

                                    {event.eventLocation && (
                                      <div className="flex items-center space-x-2">
                                        <MapPin className="h-4 w-4" style={{ color: colors.outline }} />
                                        <span className="text-sm" style={{ color: colors.onSurfaceVariant }}>{event.eventLocation}</span>
                                      </div>
                                    )}

                                    {event.attendees?.length > 0 && (
                                      <div className="flex items-center space-x-2">
                                        <Users className="h-4 w-4" style={{ color: colors.outline }} />
                                        <span className="text-sm" style={{ color: colors.onSurfaceVariant }}>
                                          {event.attendees.length} attendee(s)
                                        </span>
                                      </div>
                                    )}
                                  </div>

                                  {event.eventDetails && (
                                    <p className="text-sm mt-3 line-clamp-2" style={{ color: colors.onSurfaceVariant }}>
                                      {event.eventDetails}
                                    </p>
                                  )}
                                </div>

                                <div className="flex items-center space-x-2">
                                  <button
                                    onClick={() => viewEventDetails(event)}
                                    className="p-2 rounded-lg transition-all duration-200"
                                    style={{ border: `1px solid ${colors.outlineVariant}`, color: colors.onSurfaceVariant }}
                                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colors.surfaceContainerHighest}
                                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
                                    title="View details"
                                  >
                                    <Calendar className="h-4 w-4" />
                                  </button>
                                  <button
                                    onClick={() => handleEditClick(event)}
                                    className="p-2 rounded-lg transition-all duration-200"
                                    style={{ border: `1px solid ${colors.outlineVariant}`, color: colors.onSurfaceVariant }}
                                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colors.surfaceContainerHighest}
                                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
                                    title="Edit event"
                                  >
                                    <Edit2 className="h-4 w-4" />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteEvent(event._id)}
                                    className="p-2 rounded-lg transition-all duration-200"
                                    style={{ border: `1px solid ${colors.error}30`, color: colors.error }}
                                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colors.errorContainer}
                                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
                                    title="Delete event"
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
        </>
      )}

      {/* Event Details Modal - Glassmorphism */}
      {showDetails && selectedEvent && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className={`${glassCardClass} max-w-2xl w-full max-h-[90vh] overflow-y-auto`} style={{ backgroundColor: "rgba(255, 255, 255, 0.95)" }}>
            <div className="sticky top-0 p-5 flex items-center justify-between" style={{ borderBottom: `1px solid ${colors.outlineVariant}` }}>
              <div className="flex items-center space-x-2">
                <Calendar className="h-5 w-5" style={{ color: colors.secondary }} />
                <h3 className="text-lg font-bold" style={{ color: colors.onSurface }}>Event Details</h3>
              </div>
              <button
                onClick={() => {
                  setShowDetails(false);
                  setSelectedEvent(null);
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
                  <h2 className="text-2xl font-bold mb-2" style={{ color: colors.onSurface }}>{selectedEvent.eventTitle}</h2>
                  <div className="flex items-center space-x-2">
                    {(() => {
                      const EventIcon = getEventTypeIcon(selectedEvent.eventType);
                      const color = getEventTypeColor(selectedEvent.eventType);
                      return (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium" style={{ backgroundColor: `${color}15`, color }}>
                          <EventIcon className="h-4 w-4 mr-1" />
                          {eventTypes.find(t => t.value === selectedEvent.eventType)?.label || "Event"}
                        </span>
                      );
                    })()}
                    {isUpcoming(selectedEvent.eventDate) && (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium" style={{ backgroundColor: "#4caf5015", color: "#4caf50" }}>
                        <Bell className="h-4 w-4 mr-1" />
                        Upcoming
                      </span>
                    )}
                  </div>
                </div>

                <div className="rounded-xl p-4" style={{ backgroundColor: `${colors.secondary}10`, border: `1px solid ${colors.secondary}20` }}>
                  <h4 className="text-sm font-semibold mb-3 flex items-center" style={{ color: colors.onSurfaceVariant }}>
                    <Clock className="h-4 w-4 mr-2" style={{ color: colors.secondary }} />
                    Date & Time
                  </h4>
                  <p className="text-lg font-medium" style={{ color: colors.onSurface }}>
                    {formatDateTime(selectedEvent.eventDate)}
                  </p>
                </div>

                {selectedEvent.eventLocation && (
                  <div className="pt-4" style={{ borderTop: `1px solid ${colors.outlineVariant}` }}>
                    <h4 className="text-sm font-semibold mb-3 flex items-center" style={{ color: colors.onSurfaceVariant }}>
                      <MapPin className="h-4 w-4 mr-2" style={{ color: colors.secondary }} />
                      Location
                    </h4>
                    <p className="text-sm p-3 rounded-lg" style={{ backgroundColor: colors.surfaceContainerLow, color: colors.onSurfaceVariant }}>
                      {selectedEvent.eventLocation}
                    </p>
                  </div>
                )}

                {selectedEvent.attendees?.length > 0 && (
                  <div className="pt-4" style={{ borderTop: `1px solid ${colors.outlineVariant}` }}>
                    <h4 className="text-sm font-semibold mb-3 flex items-center" style={{ color: colors.onSurfaceVariant }}>
                      <Users className="h-4 w-4 mr-2" style={{ color: colors.secondary }} />
                      Attendees
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedEvent.attendees.map((attendee, index) => (
                        <span key={index} className="px-3 py-1 rounded-lg text-sm" style={{ backgroundColor: colors.surfaceContainerHighest, color: colors.onSurfaceVariant }}>
                          {attendee}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {selectedEvent.eventDetails && (
                  <div className="pt-4" style={{ borderTop: `1px solid ${colors.outlineVariant}` }}>
                    <h4 className="text-sm font-semibold mb-3 flex items-center" style={{ color: colors.onSurfaceVariant }}>
                      <FileText className="h-4 w-4 mr-2" style={{ color: colors.secondary }} />
                      Details
                    </h4>
                    <p className="text-sm p-4 rounded-lg whitespace-pre-wrap" style={{ backgroundColor: colors.surfaceContainerLow, color: colors.onSurfaceVariant }}>
                      {selectedEvent.eventDetails}
                    </p>
                  </div>
                )}

                {selectedEvent.reminder && (
                  <div className="pt-4" style={{ borderTop: `1px solid ${colors.outlineVariant}` }}>
                    <h4 className="text-sm font-semibold mb-3 flex items-center" style={{ color: colors.onSurfaceVariant }}>
                      <Bell className="h-4 w-4 mr-2" style={{ color: colors.secondary }} />
                      Reminder
                    </h4>
                    <p className="text-sm" style={{ color: colors.onSurfaceVariant }}>
                      {reminderOptions.find(r => r.value === selectedEvent.reminder)?.label || "No reminder set"}
                    </p>
                  </div>
                )}

                <div className="pt-4" style={{ borderTop: `1px solid ${colors.outlineVariant}` }}>
                  <div className="flex items-center justify-between text-xs" style={{ color: colors.onSurfaceVariant }}>
                    <span>Created: {new Date(selectedEvent.createdAt).toLocaleString()}</span>
                    {selectedEvent.updatedAt !== selectedEvent.createdAt && (
                      <span>Last updated: {new Date(selectedEvent.updatedAt).toLocaleString()}</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-5 flex justify-end space-x-3" style={{ borderTop: `1px solid ${colors.outlineVariant}`, backgroundColor: colors.surfaceContainerLow }}>
              <button
                onClick={() => {
                  setShowDetails(false);
                  setSelectedEvent(null);
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
                  handleEditClick(selectedEvent);
                  setShowDetails(false);
                }}
                className="px-4 py-2 rounded-lg transition-all duration-200"
                style={{ backgroundColor: colors.secondary, color: "white" }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colors.secondaryContainer}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = colors.secondary}
              >
                Edit Event
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Quick Tips */}
      {!selectedCaseId && (
        <div className="rounded-xl p-4" style={{ backgroundColor: `${colors.secondary}10`, borderLeft: `4px solid ${colors.secondary}` }}>
          <div className="flex items-start">
            <AlertCircle className="h-5 w-5 mr-3 flex-shrink-0 mt-0.5" style={{ color: colors.secondary }} />
            <div>
              <h3 className="text-sm font-medium mb-1" style={{ color: colors.onSurface }}>Getting Started</h3>
              <p className="text-xs" style={{ color: colors.onSurfaceVariant }}>
                Select a case from the dropdown above to view and manage its events. You can add court hearings, client meetings, deadlines, and more. Set reminders to never miss important dates.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}