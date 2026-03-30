import { useEffect, useState, useRef } from "react";
import API from "../../api/axios";
import socket from "../../api/socket";
import {
  MessageSquare,
  Users,
  Send,
  CheckCircle,
  Clock,
  AlertCircle,
  User,
  Mail,
  Calendar,
  ArrowLeft,
  MoreVertical,
  Paperclip,
  Smile,
  X,
  ChevronRight,
  Bell,
  CheckCheck,
  Search,
  Filter,
  Menu,
  Star,
  Award,
  ThumbsUp,
  Image,
  File,
  Mic,
  MoreHorizontal,
  Download,
  Copy,
  Reply,
  Pin,
  Flag,
  Trash2,
  Edit3,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  Shield,
  Briefcase,
  Phone,
  Video,
  Sparkles
} from "lucide-react";

export default function UserDiscussion() {
  const [discussions, setDiscussions] = useState([]);
  const [filteredDiscussions, setFilteredDiscussions] = useState([]);
  const [selected, setSelected] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [loading, setLoading] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [showFilters, setShowFilters] = useState(false);
  const [replyToMessage, setReplyToMessage] = useState(null);
  const [isFullScreen, setIsFullScreen] = useState(false);
  
  const messagesEndRef = useRef(null);
  const typingTimer = useRef(null);
  const chatContainerRef = useRef(null);
  const fileInputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [selected?.messages]);

  const fetchDiscussions = async () => {
    try {
      setLoading(true);
      const res = await API.get("/user/discussion");
      setDiscussions(res.data);
      setFilteredDiscussions(res.data);
    } catch (err) {
      console.log(err);
      alert("Failed to load discussions");
    } finally {
      setLoading(false);
    }
  };

  const openDiscussion = async (id) => {
    try {
      const res = await API.get(`/user/discussion/${id}`);
      setSelected(res.data);

      await API.patch(`/user/discussion/${id}/read`);
      fetchDiscussions();
      
      // Close sidebar on mobile when opening a chat
      if (window.innerWidth < 1024) {
        setSidebarOpen(false);
      }
    } catch (err) {
      console.log(err);
      alert("Failed to open discussion");
    }
  };

  const sendReply = async () => {
    if (!replyText.trim()) return alert("Type message first");

    try {
      const messageData = {
        text: replyText,
        replyTo: replyToMessage?._id
      };

      const res = await API.post(`/user/discussion/${selected._id}/reply`, messageData);

      setSelected(res.data.discussion);
      setReplyText("");
      setReplyToMessage(null);

      if (selected?.lawyerId?._id) {
        socket.emit("stopTyping", {
          receiverId: selected.lawyerId._id,
          senderRole: "user",
        });
      }

      fetchDiscussions();
    } catch (err) {
      console.log(err);
      alert("Failed to send message");
    }
  };

  const handleTyping = (e) => {
    setReplyText(e.target.value);

    if (!selected?.lawyerId?._id) return;

    socket.emit("typing", {
      receiverId: selected.lawyerId._id,
      senderRole: "user",
    });

    clearTimeout(typingTimer.current);

    typingTimer.current = setTimeout(() => {
      socket.emit("stopTyping", {
        receiverId: selected.lawyerId._id,
        senderRole: "user",
      });
    }, 1000);
  };

  // Listen typing events (lawyer typing)
  useEffect(() => {
    socket.on("typing", ({ senderRole }) => {
      if (senderRole === "lawyer") setIsTyping(true);
    });

    socket.on("stopTyping", ({ senderRole }) => {
      if (senderRole === "lawyer") setIsTyping(false);
    });

    socket.on("newMessage", (data) => {
      if (selected && data.discussionId === selected._id) {
        setSelected(prev => ({
          ...prev,
          messages: [...prev.messages, data.message]
        }));
      }
      fetchDiscussions();
    });

    return () => {
      socket.off("typing");
      socket.off("stopTyping");
      socket.off("newMessage");
    };
  }, [selected]);

  useEffect(() => {
    fetchDiscussions();
  }, []);

  // Filter discussions
  useEffect(() => {
    let result = discussions.filter(d => {
      const matchesSearch = d.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           d.lawyerId?.name?.toLowerCase().includes(searchTerm.toLowerCase());
      
      if (filterStatus === "all") return matchesSearch;
      return matchesSearch && d.status === filterStatus;
    });
    setFilteredDiscussions(result);
  }, [discussions, searchTerm, filterStatus]);

  const getStatusBadge = (status) => {
    switch(status) {
      case "resolved":
        return {
          icon: CheckCircle,
          text: "Resolved",
          bg: "bg-green-100",
          textColor: "text-green-700",
          border: "border-green-200",
          lightBg: "bg-green-50",
          gradient: "from-green-500 to-green-600"
        };
      case "active":
        return {
          icon: MessageSquare,
          text: "Active",
          bg: "bg-blue-100",
          textColor: "text-blue-700",
          border: "border-blue-200",
          lightBg: "bg-blue-50",
          gradient: "from-blue-500 to-blue-600"
        };
      default:
        return {
          icon: Clock,
          text: "Pending",
          bg: "bg-yellow-100",
          textColor: "text-yellow-700",
          border: "border-yellow-200",
          lightBg: "bg-yellow-50",
          gradient: "from-yellow-500 to-yellow-600"
        };
    }
  };

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

  const handleFileUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      alert(`File selected: ${file.name}`);
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="relative">
            <div className="w-24 h-24 mx-auto mb-6 relative">
              <div className="absolute inset-0 bg-blue-100 rounded-full animate-ping opacity-20"></div>
              <div className="relative bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-5 shadow-lg animate-bounce">
                <MessageSquare className="h-14 w-14 text-white" />
              </div>
            </div>
            
            <h3 className="text-xl font-bold text-gray-900 mb-2">Loading Discussions</h3>
            <p className="text-sm text-gray-500 mb-6">Please wait while we fetch your conversations...</p>
            
            <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 h-2 rounded-full animate-pulse" style={{ width: '60%' }}></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`h-[calc(100vh-73px)] bg-gradient-to-br from-gray-50 to-gray-100 flex overflow-hidden ${isFullScreen ? 'fixed inset-0 z-50' : ''}`}>
      {/* Sidebar - Discussion List */}
      <div className={`${
        sidebarOpen ? 'w-full lg:w-96' : 'w-0'
      } border-r border-gray-200 bg-white transition-all duration-300 overflow-hidden flex flex-col shadow-xl`}>
        {/* Sidebar Header with Gradient */}
        <div className="border-b border-gray-200 p-5 bg-gradient-to-r from-blue-600 to-blue-700">
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
              >
                <X className="h-5 w-5 text-white" />
              </button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="mt-4 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/60" />
            <input
              type="text"
              placeholder="Search discussions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white/10 border border-white/20 rounded-xl text-sm text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/30"
            />
          </div>

          {/* Filter Tabs */}
          <div className="flex space-x-2 mt-4">
            {["all", "active", "resolved"].map((status) => {
              const isActive = filterStatus === status;
              return (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    isActive
                      ? "bg-white text-blue-700 shadow-md"
                      : "bg-white/10 text-white hover:bg-white/20"
                  }`}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              );
            })}
          </div>
        </div>

        {/* Discussion List */}
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
            filteredDiscussions.map((d) => {
              const unreadCount = d?.messages?.filter(
                (m) => m.senderRole === "lawyer" && m.isRead === false
              )?.length || 0;
              
              const lastMessage = d.messages?.[d.messages.length - 1];
              const statusBadge = getStatusBadge(d.status);
              const StatusIcon = statusBadge.icon;

              return (
                <div
                  key={d._id}
                  onClick={() => openDiscussion(d._id)}
                  className={`border rounded-xl cursor-pointer transition-all hover:shadow-md ${
                    selected?._id === d._id
                      ? 'border-blue-300 bg-blue-50 shadow-md'
                      : 'border-gray-200 hover:border-blue-200 bg-white'
                  }`}
                >
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-bold text-gray-900 flex-1 pr-2 line-clamp-1">
                        {d.title}
                      </h3>
                      {unreadCount > 0 && (
                        <span className="bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full animate-pulse">
                          {unreadCount}
                        </span>
                      )}
                    </div>

                    <div className="space-y-2 mb-2">
                      <div className="flex items-center text-xs text-gray-600">
                        <User className="h-3 w-3 mr-1 flex-shrink-0" />
                        <span className="truncate">{d.lawyerId?.name || "N/A"}</span>
                      </div>
                      
                      {lastMessage && (
                        <p className="text-xs text-gray-500 truncate">
                          {lastMessage.senderRole === "user" ? "You: " : ""}
                          {lastMessage.text}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center justify-between">
                      <span className={`inline-flex items-center px-2 py-0.5 text-xs rounded-full ${statusBadge.bg} ${statusBadge.textColor}`}>
                        <StatusIcon className="h-3 w-3 mr-1" />
                        {statusBadge.text}
                      </span>
                      
                      {d.updatedAt && (
                        <span className="text-xs text-gray-400">
                          {formatDateTime(d.updatedAt)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className={`flex-1 flex flex-col bg-white ${!sidebarOpen ? 'w-full' : ''}`}>
        {!selected ? (
          <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
            <div className="text-center max-w-md px-4">
              <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <MessageSquare className="h-10 w-10 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Welcome to Discussions</h3>
              <p className="text-sm text-gray-500 mb-6">
                Select a discussion from the sidebar to start chatting with your lawyer.
              </p>
            </div>
          </div>
        ) : (
          <>
            {/* Chat Header */}
            <div className="border-b border-gray-200 p-4 bg-white sticky top-0 z-10">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {/* Mobile Menu Toggle */}
                  {!sidebarOpen && (
                    <button
                      onClick={() => setSidebarOpen(true)}
                      className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <Menu className="h-5 w-5 text-gray-600" />
                    </button>
                  )}
                  
                  {/* Lawyer Avatar */}
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-md">
                    <span className="text-lg font-bold text-white">
                      {selected.lawyerId?.name?.charAt(0) || "L"}
                    </span>
                  </div>
                  
                  <div>
                    <div className="flex items-center space-x-2">
                      <h2 className="text-lg font-bold text-gray-900">{selected.title}</h2>
                      {(() => {
                        const badge = getStatusBadge(selected.status);
                        const Icon = badge.icon;
                        return (
                          <span className={`hidden md:inline-flex items-center px-2 py-1 text-xs rounded-full ${badge.bg} ${badge.textColor}`}>
                            <Icon className="h-3 w-3 mr-1" />
                            {badge.text}
                          </span>
                        );
                      })()}
                    </div>
                    
                    <div className="flex items-center space-x-3 text-xs text-gray-500">
                      <span className="flex items-center">
                        <User className="h-3 w-3 mr-1" />
                        {selected.lawyerId?.name}
                      </span>
                      <span className="hidden md:flex items-center">
                        <Mail className="h-3 w-3 mr-1" />
                        {selected.lawyerId?.email}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  {/* Call buttons */}
                  <div className="hidden md:flex items-center space-x-1">
                    <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors" title="Voice call">
                      <Phone className="h-4 w-4 text-gray-600" />
                    </button>
                    <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors" title="Video call">
                      <Video className="h-4 w-4 text-gray-600" />
                    </button>
                  </div>

                  {/* Full screen toggle */}
                  <button
                    onClick={toggleFullScreen}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    title={isFullScreen ? "Exit full screen" : "Full screen"}
                  >
                    {isFullScreen ? (
                      <Minimize2 className="h-4 w-4 text-gray-600" />
                    ) : (
                      <Maximize2 className="h-4 w-4 text-gray-600" />
                    )}
                  </button>
                  
                  <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <MoreVertical className="h-4 w-4 text-gray-600" />
                  </button>
                </div>
              </div>

              {/* Mobile status badge */}
              <div className="md:hidden mt-2">
                {(() => {
                  const badge = getStatusBadge(selected.status);
                  const Icon = badge.icon;
                  return (
                    <span className={`inline-flex items-center px-2 py-1 text-xs rounded-full ${badge.bg} ${badge.textColor}`}>
                      <Icon className="h-3 w-3 mr-1" />
                      {badge.text}
                    </span>
                  );
                })()}
              </div>
            </div>

            {/* Messages Area */}
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
                  {selected.messages.map((message, index) => {
                    const isUser = message.senderRole === "user";
                    const showDate = index === 0 || 
                      formatDate(message.createdAt) !== formatDate(selected.messages[index - 1]?.createdAt);
                    const isReplied = message.replyTo;

                    return (
                      <div key={index}>
                        {showDate && (
                          <div className="flex justify-center my-4">
                            <span className="text-xs bg-gray-200 px-3 py-1 rounded-full text-gray-600">
                              {formatDate(message.createdAt)}
                            </span>
                          </div>
                        )}
                        
                        <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
                          <div className={`max-w-[85%] md:max-w-[70%] ${isUser ? 'order-2' : 'order-1'}`}>
                            {/* Reply indicator */}
                            {isReplied && (
                              <div className="mb-1 text-xs text-gray-500 flex items-center">
                                <Reply className="h-3 w-3 mr-1 rotate-180" />
                                Replying to previous message
                              </div>
                            )}
                            
                            <div className="flex items-end space-x-2">
                              {!isUser && (
                                <div className="w-8 h-8 bg-gradient-to-br from-gray-600 to-gray-700 rounded-lg flex items-center justify-center flex-shrink-0">
                                  <User className="h-4 w-4 text-white" />
                                </div>
                              )}
                              
                              <div className={`rounded-2xl ${
                                isUser 
                                  ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-br-none' 
                                  : 'bg-white border border-gray-200 rounded-bl-none'
                              } p-3 shadow-sm`}>
                                {message.replyTo && (
                                  <div className={`mb-2 p-2 rounded-lg text-xs ${
                                    isUser ? 'bg-blue-500/30' : 'bg-gray-100'
                                  }`}>
                                    <div className="flex items-center mb-1">
                                      <Reply className="h-3 w-3 mr-1" />
                                      <span className="font-medium">Reply to:</span>
                                    </div>
                                    <p className="line-clamp-2">{message.replyTo.text}</p>
                                  </div>
                                )}
                                
                                <p className={`text-sm ${isUser ? 'text-white' : 'text-gray-900'}`}>
                                  {message.text}
                                </p>
                                
                                <div className={`flex items-center justify-end space-x-1 mt-1 text-xs ${
                                  isUser ? 'text-blue-200' : 'text-gray-400'
                                }`}>
                                  <span>{formatTime(message.createdAt)}</span>
                                  {isUser && (
                                    <CheckCheck className="h-3 w-3" />
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </div>
              )}

              {/* Typing Indicator */}
              {isTyping && (
                <div className="flex items-center space-x-2 mt-4">
                  <div className="w-8 h-8 bg-gradient-to-br from-gray-600 to-gray-700 rounded-lg flex items-center justify-center">
                    <User className="h-4 w-4 text-white" />
                  </div>
                  <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-none px-4 py-3 shadow-sm">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Reply indicator */}
            {replyToMessage && (
              <div className="border-t border-gray-200 px-4 py-2 bg-gray-50 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Reply className="h-4 w-4 text-blue-600" />
                  <span className="text-sm text-gray-600">Replying to:</span>
                  <span className="text-sm text-gray-900 line-clamp-1">
                    {replyToMessage.text}
                  </span>
                </div>
                <button
                  onClick={() => setReplyToMessage(null)}
                  className="p-1 hover:bg-gray-200 rounded-lg"
                >
                  <X className="h-4 w-4 text-gray-500" />
                </button>
              </div>
            )}

            {/* Input Area */}
            {selected.status === "resolved" ? (
              <div className="border-t border-gray-200 p-5 bg-green-50">
                <div className="flex items-center justify-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <p className="text-green-700 font-medium">This discussion has been resolved</p>
                </div>
              </div>
            ) : (
              <div className="border-t border-gray-200 p-4 bg-white">
                <div className="flex items-end space-x-3">
                  <div className="flex-1">
                    <div className="relative">
                      <textarea
                        value={replyText}
                        onChange={handleTyping}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            sendReply();
                          }
                        }}
                        placeholder="Type your message... (Shift + Enter for new line)"
                        rows={2}
                        className="w-full px-4 py-3 border border-gray-300 bg-white rounded-xl text-sm focus:border-blue-600 focus:ring-2 focus:ring-blue-200 transition-all resize-none"
                      />
                      
                      {/* Attachment buttons */}
                      <div className="absolute right-2 bottom-2 flex items-center space-x-1">
                        <button
                          onClick={handleFileUpload}
                          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                          title="Attach file"
                        >
                          <Paperclip className="h-4 w-4 text-gray-500" />
                        </button>
                        <button
                          onClick={() => {}}
                          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                          title="Add emoji"
                        >
                          <Smile className="h-4 w-4 text-gray-500" />
                        </button>
                      </div>
                      
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </div>

                    {/* Character count */}
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-gray-400">
                        {replyText.length} characters
                      </span>
                      
                      <button
                        onClick={sendReply}
                        disabled={!replyText.trim()}
                        className="px-6 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-medium hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md flex items-center space-x-2"
                      >
                        <Send className="h-4 w-4" />
                        <span className="hidden md:inline">Send</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Mobile floating action button */}
      {!sidebarOpen && !selected && (
        <button
          onClick={() => setSidebarOpen(true)}
          className="fixed bottom-20 right-4 lg:hidden bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 rounded-full shadow-xl"
        >
          <MessageSquare className="h-6 w-6" />
        </button>
      )}
    </div>
  );
}