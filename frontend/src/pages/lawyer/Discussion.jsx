import { useEffect, useState, useRef, useCallback, useMemo } from "react";
import API from "../../api/axios";
import socket from "../../api/socket";
import toast from "react-hot-toast";
import {
  MessageSquare,
  Send,
  CheckCircle,
  Clock,
  AlertCircle,
  User,
  Mail,
  MoreVertical,
  Paperclip,
  Smile,
  X,
  CheckCheck,
  Users,
  Shield,
  Phone,
  Video,
  Search,
  Filter,
  Menu,
  Reply,
  Image as ImageIcon,
  File,
  MoreHorizontal,
  Download,
  Copy,
  Pin,
  Trash2,
  Edit3,
  Maximize2,
  Minimize2,
  Loader2,
  ChevronLeft,
  ChevronRight
} from "lucide-react";

// Constants
const MESSAGE_STATUS = {
  RESOLVED: "resolved",
  ACTIVE: "active",
  PENDING: "pending"
};

const SENDER_ROLE = {
  LAWYER: "lawyer",
  USER: "user"
};

// Utility functions
const formatTime = (date) => {
  return new Date(date).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  });
};

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
};

const formatDateTime = (date) => {
  return new Date(date).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const getStatusConfig = (status) => {
  const statusMap = {
    [MESSAGE_STATUS.RESOLVED]: {
      icon: CheckCircle,
      text: "Resolved",
      bg: "bg-green-100",
      textColor: "text-green-700",
      border: "border-green-200",
      lightBg: "bg-green-50",
      gradient: "from-green-600 to-green-700"
    },
    [MESSAGE_STATUS.ACTIVE]: {
      icon: MessageSquare,
      text: "Active",
      bg: "bg-blue-100",
      textColor: "text-blue-700",
      border: "border-blue-200",
      lightBg: "bg-blue-50",
      gradient: "from-blue-600 to-blue-700"
    },
    default: {
      icon: Clock,
      text: "Pending",
      bg: "bg-yellow-100",
      textColor: "text-yellow-700",
      border: "border-yellow-200",
      lightBg: "bg-yellow-50",
      gradient: "from-yellow-600 to-yellow-700"
    }
  };
  return statusMap[status] || statusMap.default;
};

// Custom Hooks
const useDiscussion = () => {
  const [discussions, setDiscussions] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDiscussions = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await API.get("/lawyer/discussion");
      setDiscussions(res.data);
    } catch (err) {
      console.error("Failed to fetch discussions:", err);
      setError("Failed to load discussions");
      toast.error("Failed to load discussions");
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchDiscussion = useCallback(async (id) => {
    try {
      const res = await API.get(`/lawyer/discussion/${id}`);
      setSelected(res.data);
      await API.patch(`/lawyer/discussion/${id}/read`);
      return res.data;
    } catch (err) {
      console.error("Failed to fetch discussion:", err);
      toast.error("Failed to open discussion");
      throw err;
    }
  }, []);

  const sendReply = useCallback(async (discussionId, text, replyTo = null) => {
    try {
      const res = await API.post(`/lawyer/discussion/${discussionId}/reply`, {
        text,
        replyTo
      });
      return res.data.discussion;
    } catch (err) {
      console.error("Failed to send reply:", err);
      toast.error("Failed to send reply");
      throw err;
    }
  }, []);

  const resolveDiscussion = useCallback(async (discussionId) => {
    try {
      const res = await API.patch(`/lawyer/discussion/${discussionId}/resolve`);
      toast.success("Discussion marked as resolved");
      return res.data.discussion;
    } catch (err) {
      console.error("Failed to resolve discussion:", err);
      toast.error("Failed to resolve discussion");
      throw err;
    }
  }, []);

  return {
    discussions,
    setDiscussions,
    selected,
    setSelected,
    loading,
    error,
    fetchDiscussions,
    fetchDiscussion,
    sendReply,
    resolveDiscussion
  };
};

const useTyping = (selected, socket) => {
  const [isTyping, setIsTyping] = useState(false);
  const typingTimer = useRef(null);

  const handleTyping = useCallback(() => {
    if (!selected?.userId?._id) return;

    socket.emit("typing", {
      receiverId: selected.userId._id,
      senderRole: SENDER_ROLE.LAWYER,
    });

    clearTimeout(typingTimer.current);

    typingTimer.current = setTimeout(() => {
      socket.emit("stopTyping", {
        receiverId: selected.userId._id,
        senderRole: SENDER_ROLE.LAWYER,
      });
    }, 1000);
  }, [selected, socket]);

  useEffect(() => {
    const handleTypingEvent = ({ senderRole }) => {
      if (senderRole === SENDER_ROLE.USER) setIsTyping(true);
    };

    const handleStopTyping = ({ senderRole }) => {
      if (senderRole === SENDER_ROLE.USER) setIsTyping(false);
    };

    socket.on("typing", handleTypingEvent);
    socket.on("stopTyping", handleStopTyping);

    return () => {
      socket.off("typing", handleTypingEvent);
      socket.off("stopTyping", handleStopTyping);
      clearTimeout(typingTimer.current);
    };
  }, [socket]);

  return { isTyping, handleTyping };
};

// Loading Component
const LoadingSpinner = () => (
  <div className="h-full bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
    <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
      <div className="relative">
        <div className="w-24 h-24 mx-auto mb-6 relative">
          <div className="absolute inset-0 bg-purple-100 rounded-full animate-ping opacity-20"></div>
          <div className="relative bg-gradient-to-br from-purple-600 to-purple-700 rounded-2xl p-5 shadow-lg animate-bounce">
            <MessageSquare className="h-14 w-14 text-white" />
          </div>
        </div>
        
        <h3 className="text-xl font-bold text-gray-900 mb-2">Loading Discussions</h3>
        <p className="text-sm text-gray-500 mb-6">Please wait while we fetch your conversations...</p>
        
        <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
          <div className="bg-gradient-to-r from-purple-600 to-purple-700 h-2 rounded-full animate-pulse w-3/4"></div>
        </div>
      </div>
    </div>
  </div>
);

// Empty State Component
const EmptyState = ({ icon: Icon, title, message, action }) => (
  <div className="h-full flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
    <div className="text-center max-w-md px-4">
      <div className="w-24 h-24 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <Icon className="h-10 w-10 text-purple-600" />
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
      <p className="text-sm text-gray-500 mb-6">{message}</p>
      {action}
    </div>
  </div>
);

// Discussion Card Component
const DiscussionCard = ({ discussion, isSelected, onClick }) => {
  const unreadCount = discussion?.messages?.filter(
    (m) => m.senderRole === SENDER_ROLE.USER && !m.isRead
  )?.length || 0;
  
  const lastMessage = discussion.messages?.[discussion.messages.length - 1];
  const statusConfig = getStatusConfig(discussion.status);
  const StatusIcon = statusConfig.icon;

  return (
    <div
      onClick={onClick}
      className={`border rounded-xl cursor-pointer transition-all hover:shadow-md ${
        isSelected
          ? 'border-purple-300 bg-purple-50 shadow-md'
          : 'border-gray-200 hover:border-purple-200 bg-white'
      }`}
    >
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-semibold text-gray-900 flex-1 pr-2 line-clamp-1">
            {discussion.title}
          </h3>
          {unreadCount > 0 && (
            <span className="bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full flex-shrink-0 animate-pulse">
              {unreadCount}
            </span>
          )}
        </div>

        <div className="space-y-2 mb-2">
          <div className="flex items-center text-xs text-gray-600">
            <User className="h-3 w-3 mr-1 flex-shrink-0" />
            <span className="truncate">{discussion.userId?.name || "Unknown User"}</span>
          </div>
          
          {lastMessage && (
            <p className="text-xs text-gray-500 truncate">
              {lastMessage.senderRole === SENDER_ROLE.LAWYER ? "You: " : ""}
              {lastMessage.text}
            </p>
          )}
        </div>

        <div className="flex items-center justify-between">
          <span className={`inline-flex items-center px-2 py-0.5 text-xs rounded-full ${statusConfig.bg} ${statusConfig.textColor}`}>
            <StatusIcon className="h-3 w-3 mr-1" />
            {statusConfig.text}
          </span>
          
          {discussion.updatedAt && (
            <span className="text-xs text-gray-400">
              {formatDateTime(discussion.updatedAt)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

// Message Bubble Component
const MessageBubble = ({ message, isLawyer, showDate, date }) => {
  const isReplied = message.replyTo;

  return (
    <>
      {showDate && (
        <div className="flex justify-center my-4">
          <span className="text-xs bg-gray-200 px-3 py-1 rounded-full text-gray-600">
            {date}
          </span>
        </div>
      )}
      
      <div className={`flex ${isLawyer ? 'justify-end' : 'justify-start'}`}>
        <div className={`max-w-[85%] md:max-w-[70%] ${isLawyer ? 'order-2' : 'order-1'}`}>
          {isReplied && (
            <div className="mb-1 text-xs text-gray-500 flex items-center">
              <Reply className="h-3 w-3 mr-1 rotate-180" />
              Replying to previous message
            </div>
          )}
          
          <div className="flex items-end space-x-2">
            {!isLawyer && (
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <User className="h-4 w-4 text-purple-600" />
              </div>
            )}
            
            <div className={`rounded-2xl ${
              isLawyer 
                ? 'bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-br-none' 
                : 'bg-white border border-gray-200 rounded-bl-none'
            } p-3 shadow-sm`}>
              {message.replyTo && (
                <div className={`mb-2 p-2 rounded-lg text-xs ${
                  isLawyer ? 'bg-purple-500/30' : 'bg-gray-100'
                }`}>
                  <div className="flex items-center mb-1">
                    <Reply className="h-3 w-3 mr-1" />
                    <span className="font-medium">Reply to:</span>
                  </div>
                  <p className="line-clamp-2">{message.replyTo.text}</p>
                </div>
              )}
              
              <p className={`text-sm ${isLawyer ? 'text-white' : 'text-gray-900'}`}>
                {message.text}
              </p>
              
              <div className={`flex items-center justify-end space-x-1 mt-1 text-xs ${
                isLawyer ? 'text-purple-200' : 'text-gray-400'
              }`}>
                <span>{formatTime(message.createdAt)}</span>
                {isLawyer && (
                  <CheckCheck className="h-3 w-3" />
                )}
              </div>
            </div>

            {isLawyer && (
              <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-purple-700 rounded-lg flex items-center justify-center flex-shrink-0 shadow-md">
                <Shield className="h-4 w-4 text-white" />
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

// Typing Indicator Component
const TypingIndicator = () => (
  <div className="flex items-center space-x-2 mt-4">
    <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
      <User className="h-4 w-4 text-purple-600" />
    </div>
    <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-none px-4 py-3 shadow-sm">
      <div className="flex space-x-1">
        <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
        <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
        <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
      </div>
    </div>
  </div>
);

// Message Input Component
const MessageInput = ({ 
  value, 
  onChange, 
  onSend, 
  onTyping,
  disabled,
  replyTo,
  onReplyCancel,
  onFileUpload
}) => {
  const textareaRef = useRef(null);

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [value]);

  return (
    <div className="border-t border-gray-200 bg-white flex-shrink-0">
      {replyTo && (
        <div className="px-4 py-2 bg-gray-50 flex items-center justify-between border-b border-gray-200">
          <div className="flex items-center space-x-2 min-w-0">
            <Reply className="h-4 w-4 text-purple-600 flex-shrink-0" />
            <span className="text-sm text-gray-600 flex-shrink-0">Replying to:</span>
            <span className="text-sm text-gray-900 truncate">
              {replyTo.text}
            </span>
          </div>
          <button
            onClick={onReplyCancel}
            className="p-1 hover:bg-gray-200 rounded-lg transition-colors flex-shrink-0"
          >
            <X className="h-4 w-4 text-gray-500" />
          </button>
        </div>
      )}
      
      <div className="p-4">
        <div className="flex items-end space-x-3">
          <div className="flex-1">
            <div className="relative">
              <textarea
                ref={textareaRef}
                value={value}
                onChange={onChange}
                onKeyDown={handleKeyPress}
                onKeyUp={onTyping}
                placeholder="Type your reply... (Shift + Enter for new line)"
                rows={1}
                disabled={disabled}
                className="w-full px-4 py-3 pr-20 border border-gray-300 bg-white rounded-xl text-sm focus:border-purple-600 focus:ring-2 focus:ring-purple-200 transition-all resize-none max-h-32"
              />
              
              <div className="absolute right-2 bottom-2 flex items-center space-x-1">
                <button
                  onClick={onFileUpload}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  title="Attach file"
                  disabled={disabled}
                >
                  <Paperclip className="h-4 w-4 text-gray-500" />
                </button>
                <button
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  title="Add emoji"
                  disabled={disabled}
                >
                  <Smile className="h-4 w-4 text-gray-500" />
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between mt-2">
              <span className="text-xs text-gray-400">
                {value.length} characters
              </span>
              
              <button
                onClick={onSend}
                disabled={!value.trim() || disabled}
                className="px-6 py-2 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-xl font-medium hover:from-purple-700 hover:to-purple-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md flex items-center space-x-2"
              >
                <Send className="h-4 w-4" />
                <span className="hidden md:inline">Send</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main Component
export default function LawyerDiscussion() {
  // State
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [replyText, setReplyText] = useState("");
  const [replyToMessage, setReplyToMessage] = useState(null);
  const [isFullScreen, setIsFullScreen] = useState(false);
  
  // Refs
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const chatContainerRef = useRef(null);

  // Custom hooks
  const {
    discussions,
    setDiscussions,
    selected,
    setSelected,
    loading,
    error,
    fetchDiscussions,
    fetchDiscussion,
    sendReply,
    resolveDiscussion
  } = useDiscussion();

  const { isTyping, handleTyping } = useTyping(selected, socket);

  // Effects
  useEffect(() => {
    fetchDiscussions();
  }, [fetchDiscussions]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [selected?.messages]);

  useEffect(() => {
    const handleNewMessage = (data) => {
      if (selected && data.discussionId === selected._id) {
        setSelected(prev => ({
          ...prev,
          messages: [...prev.messages, data.message]
        }));
      }
      fetchDiscussions();
    };

    socket.on("newMessage", handleNewMessage);

    return () => {
      socket.off("newMessage", handleNewMessage);
    };
  }, [selected, fetchDiscussions]);

  // Handlers
  const handleOpenDiscussion = async (id) => {
    try {
      await fetchDiscussion(id);
      fetchDiscussions();
      
      if (window.innerWidth < 1024) {
        setSidebarOpen(false);
      }
    } catch (error) {
      console.error("Failed to open discussion:", error);
    }
  };

  const handleSendReply = async () => {
    if (!replyText.trim() || !selected) return;

    try {
      const updatedDiscussion = await sendReply(
        selected._id,
        replyText,
        replyToMessage?._id
      );
      
      setSelected(updatedDiscussion);
      setReplyText("");
      setReplyToMessage(null);

      if (selected?.userId?._id) {
        socket.emit("stopTyping", {
          receiverId: selected.userId._id,
          senderRole: SENDER_ROLE.LAWYER,
        });
      }

      fetchDiscussions();
    } catch (error) {
      console.error("Failed to send reply:", error);
    }
  };

  const handleResolveDiscussion = async () => {
    if (!selected) return;
    
    try {
      const updatedDiscussion = await resolveDiscussion(selected._id);
      setSelected(updatedDiscussion);
      fetchDiscussions();
    } catch (error) {
      console.error("Failed to resolve discussion:", error);
    }
  };

  const handleTypingEvent = (e) => {
    setReplyText(e.target.value);
    handleTyping();
  };

  const handleFileUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      toast.success(`File selected: ${file.name}`);
      // Handle file upload logic here
    }
  };

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullScreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullScreen(false);
      }
    }
  };

  // Memoized values
  const filteredDiscussions = useMemo(() => {
    return discussions.filter(d => {
      const matchesSearch = d.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           d.userId?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           d.userId?.email?.toLowerCase().includes(searchTerm.toLowerCase());
      
      if (filterStatus === "all") return matchesSearch;
      return matchesSearch && d.status === filterStatus;
    });
  }, [discussions, searchTerm, filterStatus]);

  const stats = useMemo(() => ({
    active: discussions.filter(d => d.status === MESSAGE_STATUS.ACTIVE).length,
    resolved: discussions.filter(d => d.status === MESSAGE_STATUS.RESOLVED).length,
    pending: discussions.filter(d => d.status === MESSAGE_STATUS.PENDING).length
  }), [discussions]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <EmptyState
        icon={AlertCircle}
        title="Something went wrong"
        message={error}
        action={
          <button
            onClick={fetchDiscussions}
            className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Try Again
          </button>
        }
      />
    );
  }

  return (
    <div className={`h-[calc(100vh-73px)] bg-gradient-to-br from-gray-50 to-gray-100 flex overflow-hidden ${isFullScreen ? 'fixed inset-0 z-50' : ''}`}>
      {/* Sidebar - Fixed height, scrollable list */}
      <aside className={`${
        sidebarOpen ? 'w-full lg:w-96' : 'w-0'
      } border-r border-gray-200 bg-white transition-all duration-300 overflow-hidden flex flex-col shadow-xl h-full`}>
        {/* Sidebar Header - Fixed */}
        <div className="border-b border-gray-200 p-5 bg-gradient-to-r from-purple-600 to-purple-700 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <MessageSquare className="h-5 w-5 text-white" />
              <h2 className="text-lg font-bold text-white">Discussions</h2>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-xs bg-white/20 text-white px-2 py-1 rounded-full">
                {filteredDiscussions.length}
              </span>
              <button
                onClick={() => setSidebarOpen(false)}
                className="lg:hidden p-1.5 hover:bg-white/20 rounded-lg transition-colors"
                aria-label="Close sidebar"
              >
                <X className="h-5 w-5 text-white" />
              </button>
            </div>
          </div>

          {/* Search - Fixed */}
          <div className="mt-4 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/60" />
            <input
              type="text"
              placeholder="Search discussions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white/10 border border-white/20 rounded-xl text-sm text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/30"
              aria-label="Search discussions"
            />
          </div>

          {/* Filters - Fixed */}
          <div className="flex space-x-2 mt-4">
            {["all", ...Object.values(MESSAGE_STATUS)].map((status) => {
              const isActive = filterStatus === status;
              return (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    isActive
                      ? "bg-white text-purple-700 shadow-md"
                      : "bg-white/10 text-white hover:bg-white/20"
                  }`}
                  aria-pressed={isActive}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              );
            })}
          </div>
        </div>

        {/* Discussion List - Scrollable */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {filteredDiscussions.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Users className="h-6 w-6 text-gray-400" />
              </div>
              <p className="text-sm text-gray-500">No discussions found</p>
              <p className="text-xs text-gray-400 mt-1">
                {searchTerm ? "Try different search terms" : "New discussions will appear here"}
              </p>
            </div>
          ) : (
            filteredDiscussions.map((discussion) => (
              <DiscussionCard
                key={discussion._id}
                discussion={discussion}
                isSelected={selected?._id === discussion._id}
                onClick={() => handleOpenDiscussion(discussion._id)}
              />
            ))
          )}
        </div>
      </aside>

      {/* Main Chat Area - Fixed header, scrollable messages, fixed input */}
      <main className={`flex-1 flex flex-col bg-white h-full ${!sidebarOpen ? 'w-full' : ''}`}>
        {!selected ? (
          <EmptyState
            icon={MessageSquare}
            title="Welcome to Client Discussions"
            message="Select a discussion from the sidebar to start chatting with your clients. You can manage multiple conversations and track their status."
            action={
              <div className="grid grid-cols-3 gap-3 max-w-sm mx-auto">
                <div className="bg-blue-50 rounded-lg p-3 text-center">
                  <MessageSquare className="h-5 w-5 text-blue-600 mx-auto mb-1" />
                  <p className="text-xs text-gray-600">Active</p>
                  <p className="text-lg font-bold text-blue-600">{stats.active}</p>
                </div>
                <div className="bg-green-50 rounded-lg p-3 text-center">
                  <CheckCircle className="h-5 w-5 text-green-600 mx-auto mb-1" />
                  <p className="text-xs text-gray-600">Resolved</p>
                  <p className="text-lg font-bold text-green-600">{stats.resolved}</p>
                </div>
                <div className="bg-yellow-50 rounded-lg p-3 text-center">
                  <Clock className="h-5 w-5 text-yellow-600 mx-auto mb-1" />
                  <p className="text-xs text-gray-600">Pending</p>
                  <p className="text-lg font-bold text-yellow-600">{stats.pending}</p>
                </div>
              </div>
            }
          />
        ) : (
          <>
            {/* Chat Header - Fixed */}
            <header className="border-b border-gray-200 p-4 bg-white flex-shrink-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3 min-w-0">
                  {!sidebarOpen && (
                    <button
                      onClick={() => setSidebarOpen(true)}
                      className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
                      aria-label="Open sidebar"
                    >
                      <Menu className="h-5 w-5 text-gray-600" />
                    </button>
                  )}
                  
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-purple-700 rounded-xl flex items-center justify-center shadow-md flex-shrink-0">
                    <span className="text-lg font-bold text-white">
                      {selected.userId?.name?.charAt(0) || "C"}
                    </span>
                  </div>
                  
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center space-x-2">
                      <h2 className="text-lg font-bold text-gray-900 truncate">
                        {selected.title}
                      </h2>
                      {(() => {
                        const badge = getStatusConfig(selected.status);
                        const Icon = badge.icon;
                        return (
                          <span className={`hidden md:inline-flex items-center px-2 py-1 text-xs rounded-full ${badge.bg} ${badge.textColor} flex-shrink-0`}>
                            <Icon className="h-3 w-3 mr-1" />
                            {badge.text}
                          </span>
                        );
                      })()}
                    </div>
                    
                    <div className="flex items-center space-x-3 text-xs text-gray-500">
                      <span className="flex items-center truncate">
                        <User className="h-3 w-3 mr-1 flex-shrink-0" />
                        <span className="truncate">{selected.userId?.name}</span>
                      </span>
                      <span className="hidden md:flex items-center truncate">
                        <Mail className="h-3 w-3 mr-1 flex-shrink-0" />
                        <span className="truncate">{selected.userId?.email}</span>
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2 flex-shrink-0">
                  <button
                    onClick={toggleFullScreen}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    title={isFullScreen ? "Exit full screen" : "Full screen"}
                    aria-label={isFullScreen ? "Exit full screen" : "Enter full screen"}
                  >
                    {isFullScreen ? (
                      <Minimize2 className="h-4 w-4 text-gray-600" />
                    ) : (
                      <Maximize2 className="h-4 w-4 text-gray-600" />
                    )}
                  </button>

                  {selected.status !== MESSAGE_STATUS.RESOLVED && (
                    <button
                      onClick={handleResolveDiscussion}
                      className="hidden md:flex items-center space-x-1 px-3 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                      aria-label="Resolve discussion"
                    >
                      <CheckCircle className="h-4 w-4" />
                      <span>Resolve</span>
                    </button>
                  )}
                  
                  <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors" aria-label="More options">
                    <MoreVertical className="h-4 w-4 text-gray-600" />
                  </button>
                </div>
              </div>

              {/* Mobile status badge */}
              <div className="md:hidden mt-2">
                {(() => {
                  const badge = getStatusConfig(selected.status);
                  const Icon = badge.icon;
                  return (
                    <span className={`inline-flex items-center px-2 py-1 text-xs rounded-full ${badge.bg} ${badge.textColor}`}>
                      <Icon className="h-3 w-3 mr-1" />
                      {badge.text}
                    </span>
                  );
                })()}
              </div>
            </header>

            {/* Messages Area - Scrollable */}
            <div 
              ref={chatContainerRef}
              className="flex-1 overflow-y-auto p-4 md:p-6 bg-gray-50"
            >
              {selected.messages?.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-3">
                    <MessageSquare className="h-6 w-6 text-gray-400" />
                  </div>
                  <p className="text-gray-500">No messages yet. Start the conversation!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {selected.messages.map((message, index) => (
                    <MessageBubble
                      key={index}
                      message={message}
                      isLawyer={message.senderRole === SENDER_ROLE.LAWYER}
                      showDate={index === 0 || 
                        formatDate(message.createdAt) !== formatDate(selected.messages[index - 1]?.createdAt)}
                      date={formatDate(message.createdAt)}
                    />
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              )}

              {isTyping && <TypingIndicator />}
            </div>

            {/* Input Area - Fixed */}
            {selected.status === MESSAGE_STATUS.RESOLVED ? (
              <div className="border-t border-gray-200 p-5 bg-green-50 flex-shrink-0">
                <div className="flex items-center justify-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <p className="text-green-700 font-medium">This discussion has been resolved</p>
                </div>
              </div>
            ) : (
              <MessageInput
                value={replyText}
                onChange={handleTypingEvent}
                onSend={handleSendReply}
                onTyping={handleTyping}
                disabled={!selected}
                replyTo={replyToMessage}
                onReplyCancel={() => setReplyToMessage(null)}
                onFileUpload={handleFileUpload}
              />
            )}
          </>
        )}
      </main>

      {/* Mobile FAB */}
      {!sidebarOpen && !selected && (
        <button
          onClick={() => setSidebarOpen(true)}
          className="fixed bottom-20 right-4 lg:hidden bg-gradient-to-r from-purple-600 to-purple-700 text-white p-4 rounded-full shadow-xl"
          aria-label="Open discussions"
        >
          <MessageSquare className="h-6 w-6" />
        </button>
      )}

      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        aria-hidden="true"
      />
    </div>
  );
}