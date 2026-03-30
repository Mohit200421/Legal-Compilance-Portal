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
  MoreVertical
} from "lucide-react";

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

  // editing state
  const [editingEventId, setEditingEventId] = useState(null);

  // form
  const [eventTitle, setEventTitle] = useState("");
  const [eventDetails, setEventDetails] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [eventTime, setEventTime] = useState("");
  const [eventLocation, setEventLocation] = useState("");
  const [eventType, setEventType] = useState("hearing");
  const [attendees, setAttendees] = useState("");
  const [reminder, setReminder] = useState("1day");

  // Load cases
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

  // Load events of selected case
  const fetchEvents = async (caseId) => {
    if (!caseId) return;

    try {
      setLoadingEvents(true);
      const res = await API.get(`/lawyer/case/${caseId}/event`);
      setEvents(res.data);
      setFilteredEvents(res.data);
      
      // Find selected case details
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

  // Filter events
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
        // UPDATE
        const res = await API.put(`/lawyer/case/event/${editingEventId}`, eventData);
        toast.success(res.data?.msg || "Event updated");
        setEditingEventId(null);
      } else {
        // CREATE
        const res = await API.post("/lawyer/case/event", {
          caseId: selectedCaseId,
          ...eventData
        });

        toast.success(res.data?.msg || "Event added");
      }

      // Reset form
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
    
    // Handle date and time
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
      case "hearing": return "orange";
      case "meeting": return "blue";
      case "deadline": return "red";
      case "filing": return "green";
      case "consultation": return "purple";
      default: return "gray";
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-6 md:mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="inline-flex items-center bg-orange-50 border border-orange-200 px-3 py-1.5 rounded-lg mb-3">
              <CalendarDays className="h-4 w-4 text-orange-600 mr-2" />
              <span className="text-xs font-semibold text-orange-600 tracking-wider">CASE EVENTS</span>
            </div>
            <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900">
              Case Events Management
            </h1>
            <p className="text-xs md:text-sm text-gray-500 mt-1">
              Schedule and manage events for your legal cases
            </p>
          </div>
          
          {/* Stats Cards - Mobile Horizontal Scroll */}
          <div className="md:hidden flex space-x-2 overflow-x-auto pb-2">
            <div className="flex-shrink-0 bg-white rounded-xl border border-gray-200 px-4 py-2 min-w-[100px]">
              <p className="text-xs text-gray-500">Total</p>
              <p className="text-lg font-bold text-gray-900">{stats.total}</p>
            </div>
            <div className="flex-shrink-0 bg-white rounded-xl border border-gray-200 px-4 py-2 min-w-[100px]">
              <p className="text-xs text-gray-500">Upcoming</p>
              <p className="text-lg font-bold text-green-600">{stats.upcoming}</p>
            </div>
            <div className="flex-shrink-0 bg-white rounded-xl border border-gray-200 px-4 py-2 min-w-[100px]">
              <p className="text-xs text-gray-500">Hearings</p>
              <p className="text-lg font-bold text-orange-600">{stats.hearings}</p>
            </div>
            <div className="flex-shrink-0 bg-white rounded-xl border border-gray-200 px-4 py-2 min-w-[100px]">
              <p className="text-xs text-gray-500">Meetings</p>
              <p className="text-lg font-bold text-blue-600">{stats.meetings}</p>
            </div>
          </div>

          {/* Desktop Stats */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="bg-white rounded-xl border border-gray-200 px-6 py-3">
              <p className="text-xs text-gray-500">Total Events</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 px-6 py-3">
              <p className="text-xs text-gray-500">Upcoming</p>
              <p className="text-2xl font-bold text-green-600">{stats.upcoming}</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 px-6 py-3">
              <p className="text-xs text-gray-500">Hearings</p>
              <p className="text-2xl font-bold text-orange-600">{stats.hearings}</p>
            </div>
            <button
              onClick={() => selectedCaseId && fetchEvents(selectedCaseId)}
              className="p-3 bg-white rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors"
              title="Refresh"
            >
              <RefreshCw className="h-5 w-5 text-gray-600" />
            </button>
          </div>
        </div>
      </div>

      {/* Case Selection */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 mb-6 overflow-hidden">
        <div className="bg-gradient-to-r from-orange-600 to-orange-700 p-5">
          <div className="flex items-center space-x-2">
            <Briefcase className="h-5 w-5 text-white" />
            <h2 className="text-lg font-bold text-white">Select Case</h2>
          </div>
          <p className="text-xs text-orange-100 mt-1">
            Choose a case to view and manage its events
          </p>
        </div>

        <div className="p-5">
          {loadingCases ? (
            <div className="flex items-center justify-center py-8">
              <div className="inline-flex items-center space-x-3">
                <div className="w-5 h-5 border-2 border-orange-600 border-t-transparent animate-spin rounded-full"></div>
                <p className="text-gray-600">Loading cases...</p>
              </div>
            </div>
          ) : cases.length === 0 ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Briefcase className="h-6 w-6 text-gray-400" />
              </div>
              <p className="text-gray-500 mb-2">No cases found</p>
              <p className="text-xs text-gray-400">Please add a case first to manage events.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              <div className="relative">
                <select
                  value={selectedCaseId}
                  onChange={(e) => setSelectedCaseId(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 bg-white rounded-xl text-sm focus:border-orange-600 focus:ring-2 focus:ring-orange-200 transition-all appearance-none"
                >
                  <option value="">-- Select a case --</option>
                  {cases.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.caseTitle} - {c.clientName}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
              </div>

              {selectedCase && (
                <div className="bg-orange-50 rounded-xl border border-orange-200 p-4">
                  <p className="text-xs text-orange-600 mb-2">Selected Case Details</p>
                  <p className="text-sm font-bold text-gray-900 mb-1">{selectedCase?.caseTitle}</p>
                  <div className="flex items-center space-x-3 text-xs text-gray-600">
                    <span className="flex items-center">
                      <User className="h-3 w-3 mr-1" />
                      {selectedCase?.clientName}
                    </span>
                    <span className="flex items-center">
                      <Scale className="h-3 w-3 mr-1" />
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
          {/* Add/Edit Event Form */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 mb-6 overflow-hidden">
            <div className={`bg-gradient-to-r ${
              editingEventId ? 'from-blue-600 to-blue-700' : 'from-orange-600 to-orange-700'
            } p-5`}>
              <div className="flex items-center space-x-2">
                {editingEventId ? <Edit2 className="h-5 w-5 text-white" /> : <Plus className="h-5 w-5 text-white" />}
                <h2 className="text-lg font-bold text-white">
                  {editingEventId ? "Edit Event" : "Add New Event"}
                </h2>
              </div>
              <p className="text-xs text-white/80 mt-1">
                {editingEventId ? "Update event details" : "Schedule a new event for this case"}
              </p>
            </div>

            <form onSubmit={handleAddEvent} className="p-5">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Event Title */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-2">
                    Event Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Court Hearing, Client Meeting"
                    value={eventTitle}
                    onChange={(e) => setEventTitle(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 bg-white rounded-xl text-sm focus:border-orange-600 focus:ring-2 focus:ring-orange-200 transition-all"
                    required
                  />
                </div>

                {/* Event Type */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-2">
                    Event Type
                  </label>
                  <div className="relative">
                    <select
                      value={eventType}
                      onChange={(e) => setEventType(e.target.value)}
                      className="w-full px-4 py-2.5 border border-gray-300 bg-white rounded-xl text-sm focus:border-orange-600 focus:ring-2 focus:ring-orange-200 transition-all appearance-none"
                    >
                      {eventTypes.map(type => (
                        <option key={type.value} value={type.value}>{type.label}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                {/* Event Date */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-2">
                    Event Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 bg-white rounded-xl text-sm focus:border-orange-600 focus:ring-2 focus:ring-orange-200 transition-all"
                    required
                  />
                </div>

                {/* Event Time */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-2">
                    Event Time
                  </label>
                  <input
                    type="time"
                    value={eventTime}
                    onChange={(e) => setEventTime(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 bg-white rounded-xl text-sm focus:border-orange-600 focus:ring-2 focus:ring-orange-200 transition-all"
                  />
                </div>

                {/* Location */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-2">
                    Location
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Court Room 3, Zoom Link"
                    value={eventLocation}
                    onChange={(e) => setEventLocation(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 bg-white rounded-xl text-sm focus:border-orange-600 focus:ring-2 focus:ring-orange-200 transition-all"
                  />
                </div>

                {/* Reminder */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-2">
                    Reminder
                  </label>
                  <div className="relative">
                    <select
                      value={reminder}
                      onChange={(e) => setReminder(e.target.value)}
                      className="w-full px-4 py-2.5 border border-gray-300 bg-white rounded-xl text-sm focus:border-orange-600 focus:ring-2 focus:ring-orange-200 transition-all appearance-none"
                    >
                      {reminderOptions.map(option => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                {/* Attendees */}
                <div className="md:col-span-2 lg:col-span-3">
                  <label className="block text-xs font-medium text-gray-700 mb-2">
                    Attendees (comma separated)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., John Doe, Jane Smith"
                    value={attendees}
                    onChange={(e) => setAttendees(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 bg-white rounded-xl text-sm focus:border-orange-600 focus:ring-2 focus:ring-orange-200 transition-all"
                  />
                </div>

                {/* Event Details */}
                <div className="md:col-span-2 lg:col-span-3">
                  <label className="block text-xs font-medium text-gray-700 mb-2">
                    Event Details
                  </label>
                  <textarea
                    placeholder="Add detailed information about the event..."
                    value={eventDetails}
                    onChange={(e) => setEventDetails(e.target.value)}
                    rows={3}
                    className="w-full px-4 py-2.5 border border-gray-300 bg-white rounded-xl text-sm focus:border-orange-600 focus:ring-2 focus:ring-orange-200 transition-all resize-none"
                  />
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex items-center space-x-3 mt-6 pt-4 border-t border-gray-200">
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-gradient-to-r from-orange-600 to-orange-700 text-white rounded-xl font-medium hover:from-orange-700 hover:to-orange-800 transition-all shadow-lg flex items-center space-x-2"
                >
                  {editingEventId ? <Save className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                  <span>{editingEventId ? "Save Changes" : "Add Event"}</span>
                </button>
                
                {editingEventId && (
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors flex items-center space-x-2"
                  >
                    <X className="h-4 w-4" />
                    <span>Cancel</span>
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
                    placeholder="Search events by title, details, or location..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 border border-gray-300 bg-white rounded-xl text-sm focus:border-orange-600 focus:ring-2 focus:ring-orange-200 transition-all"
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
                    className="px-3 py-2 border border-gray-300 bg-white rounded-lg text-sm focus:border-orange-600 focus:ring-2 focus:ring-orange-200"
                  >
                    <option value="all">All Events</option>
                    {eventTypes.map(type => (
                      <option key={type.value} value={type.value}>{type.label}</option>
                    ))}
                  </select>
                </div>

                <span className="text-sm text-gray-500 ml-auto">
                  Showing <span className="font-medium text-gray-900">{filteredEvents.length}</span> of {events.length} events
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
                    <option value="all">All Events</option>
                    {eventTypes.map(type => (
                      <option key={type.value} value={type.value}>{type.label}</option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          </div>

          {/* Events List */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
            <div className="border-b border-gray-200 p-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-5 w-5 text-orange-600" />
                  <h2 className="text-lg font-bold text-gray-900">Events for {selectedCase?.caseTitle}</h2>
                </div>
              </div>
            </div>

            <div className="p-5">
              {loadingEvents ? (
                <div className="text-center py-12">
                  <div className="inline-flex items-center space-x-3">
                    <div className="w-6 h-6 border-2 border-orange-600 border-t-transparent animate-spin rounded-full"></div>
                    <p className="text-gray-600">Loading events...</p>
                  </div>
                </div>
              ) : filteredEvents.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Calendar className="h-8 w-8 text-gray-400" />
                  </div>
                  <p className="text-gray-500 mb-2">No events found</p>
                  <p className="text-xs text-gray-400">
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
                        className={`border rounded-xl hover:border-orange-300 hover:shadow-lg transition-all ${
                          upcoming ? 'border-green-200 bg-green-50/30' : 'border-gray-200'
                        }`}
                      >
                        <div className="p-5">
                          <div className="flex flex-col md:flex-row md:items-start gap-4">
                            {/* Event Icon */}
                            <div className="flex-shrink-0">
                              <div className={`w-12 h-12 bg-${color}-100 rounded-xl flex items-center justify-center`}>
                                <EventIcon className={`h-6 w-6 text-${color}-600`} />
                              </div>
                            </div>

                            {/* Event Info */}
                            <div className="flex-1">
                              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
                                <div>
                                  <div className="flex items-center flex-wrap gap-2 mb-2">
                                    <h3 className="text-lg font-bold text-gray-900">
                                      {event.eventTitle}
                                    </h3>
                                    {upcoming && (
                                      <span className="inline-flex items-center px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                                        <Bell className="h-3 w-3 mr-1" />
                                        Upcoming
                                      </span>
                                    )}
                                    <span className={`inline-flex items-center px-2 py-1 bg-${color}-100 text-${color}-700 rounded-full text-xs font-medium`}>
                                      <EventIcon className="h-3 w-3 mr-1" />
                                      {eventTypes.find(t => t.value === event.eventType)?.label || "Event"}
                                    </span>
                                  </div>

                                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mt-3">
                                    <div className="flex items-center space-x-2">
                                      <Clock className="h-4 w-4 text-gray-400" />
                                      <span className="text-sm text-gray-600">
                                        {formatDateTime(event.eventDate)}
                                      </span>
                                    </div>

                                    {event.eventLocation && (
                                      <div className="flex items-center space-x-2">
                                        <MapPin className="h-4 w-4 text-gray-400" />
                                        <span className="text-sm text-gray-600">{event.eventLocation}</span>
                                      </div>
                                    )}

                                    {event.attendees?.length > 0 && (
                                      <div className="flex items-center space-x-2">
                                        <Users className="h-4 w-4 text-gray-400" />
                                        <span className="text-sm text-gray-600">
                                          {event.attendees.length} attendee(s)
                                        </span>
                                      </div>
                                    )}
                                  </div>

                                  {event.eventDetails && (
                                    <p className="text-sm text-gray-600 mt-3 line-clamp-2">
                                      {event.eventDetails}
                                    </p>
                                  )}
                                </div>

                                {/* Action Buttons */}
                                <div className="flex items-center space-x-2">
                                  <button
                                    onClick={() => viewEventDetails(event)}
                                    className="p-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                                    title="View details"
                                  >
                                    <Calendar className="h-4 w-4" />
                                  </button>
                                  <button
                                    onClick={() => handleEditClick(event)}
                                    className="p-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                                    title="Edit event"
                                  >
                                    <Edit2 className="h-4 w-4" />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteEvent(event._id)}
                                    className="p-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
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

      {/* Event Details Modal */}
      {showDetails && selectedEvent && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-gradient-to-r from-orange-600 to-orange-700 p-5 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Calendar className="h-5 w-5 text-white" />
                <h3 className="text-lg font-bold text-white">Event Details</h3>
              </div>
              <button
                onClick={() => {
                  setShowDetails(false);
                  setSelectedEvent(null);
                }}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                <X className="h-5 w-5 text-white" />
              </button>
            </div>
            
            <div className="p-6">
              <div className="space-y-6">
                {/* Event Header */}
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">{selectedEvent.eventTitle}</h2>
                  <div className="flex items-center space-x-2">
                    {(() => {
                      const EventIcon = getEventTypeIcon(selectedEvent.eventType);
                      const color = getEventTypeColor(selectedEvent.eventType);
                      return (
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-${color}-100 text-${color}-700`}>
                          <EventIcon className="h-4 w-4 mr-1" />
                          {eventTypes.find(t => t.value === selectedEvent.eventType)?.label || "Event"}
                        </span>
                      );
                    })()}
                    {isUpcoming(selectedEvent.eventDate) && (
                      <span className="inline-flex items-center px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                        <Bell className="h-4 w-4 mr-1" />
                        Upcoming
                      </span>
                    )}
                  </div>
                </div>

                {/* Date and Time */}
                <div className="bg-orange-50 rounded-xl p-4 border border-orange-200">
                  <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
                    <Clock className="h-4 w-4 mr-2 text-orange-600" />
                    Date & Time
                  </h4>
                  <p className="text-lg font-medium text-gray-900">
                    {formatDateTime(selectedEvent.eventDate)}
                  </p>
                </div>

                {/* Location */}
                {selectedEvent.eventLocation && (
                  <div className="border-t border-gray-200 pt-4">
                    <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
                      <MapPin className="h-4 w-4 mr-2 text-orange-600" />
                      Location
                    </h4>
                    <p className="text-sm text-gray-900 bg-gray-50 p-3 rounded-lg">
                      {selectedEvent.eventLocation}
                    </p>
                  </div>
                )}

                {/* Attendees */}
                {selectedEvent.attendees?.length > 0 && (
                  <div className="border-t border-gray-200 pt-4">
                    <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
                      <Users className="h-4 w-4 mr-2 text-orange-600" />
                      Attendees
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedEvent.attendees.map((attendee, index) => (
                        <span key={index} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-sm">
                          {attendee}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Details */}
                {selectedEvent.eventDetails && (
                  <div className="border-t border-gray-200 pt-4">
                    <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
                      <FileText className="h-4 w-4 mr-2 text-orange-600" />
                      Details
                    </h4>
                    <p className="text-sm text-gray-600 bg-gray-50 p-4 rounded-lg whitespace-pre-wrap">
                      {selectedEvent.eventDetails}
                    </p>
                  </div>
                )}

                {/* Reminder */}
                {selectedEvent.reminder && (
                  <div className="border-t border-gray-200 pt-4">
                    <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
                      <Bell className="h-4 w-4 mr-2 text-orange-600" />
                      Reminder
                    </h4>
                    <p className="text-sm text-gray-900">
                      {reminderOptions.find(r => r.value === selectedEvent.reminder)?.label || "No reminder set"}
                    </p>
                  </div>
                )}

                {/* Metadata */}
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex items-center justify-between text-xs text-gray-400">
                    <span>Created: {new Date(selectedEvent.createdAt).toLocaleString()}</span>
                    {selectedEvent.updatedAt !== selectedEvent.createdAt && (
                      <span>Last updated: {new Date(selectedEvent.updatedAt).toLocaleString()}</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="border-t border-gray-200 p-5 bg-gray-50 flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowDetails(false);
                  setSelectedEvent(null);
                }}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
              >
                Close
              </button>
              <button
                onClick={() => {
                  handleEditClick(selectedEvent);
                  setShowDetails(false);
                }}
                className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
              >
                Edit Event
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Quick Tips */}
      {!selectedCaseId && (
        <div className="bg-blue-50 border-l-4 border-blue-600 rounded-xl p-4">
          <div className="flex items-start">
            <AlertCircle className="h-5 w-5 text-blue-600 mr-3 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm font-medium text-blue-900 mb-1">Getting Started</h3>
              <p className="text-xs text-blue-700">
                Select a case from the dropdown above to view and manage its events. You can add court hearings, client meetings, deadlines, and more. Set reminders to never miss important dates.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}