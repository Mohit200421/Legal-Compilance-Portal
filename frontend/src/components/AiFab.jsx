import React, { useState, useContext, useEffect } from "react";
import {
  Bot,
  X,
  MessageCircle,
  Sparkles,
  Minimize2,
  Maximize2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import AiAssistant from "./AiAssistant";
import { AuthContext } from "../context/AuthContext";

// Lex-Modernism Color System
const colors = {
  primary: "#091426",
  primaryContainer: "#1e293b",
  onPrimaryContainer: "#8590a6",
  secondary: "#4648d4",
  secondaryContainer: "#6063ee",
  onSecondaryContainer: "#fffbff",
  surface: "#fbf8fa",
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

const AiFab = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const { user, loading } = useContext(AuthContext);

  // Simulate unread messages
  useEffect(() => {
    if (!isOpen && !loading) {
      const interval = setInterval(() => {
        setUnreadCount((prev) => Math.min(prev + 1, 99));
      }, 30000);
      return () => clearInterval(interval);
    } else {
      setUnreadCount(0);
    }
  }, [isOpen, loading]);

  // Show AI assistance only when logged in
  if (loading) return null;
  if (!user) return null;

  const handleOpen = () => {
    setIsOpen(true);
    setIsMinimized(false);
    setUnreadCount(0);
  };

  const handleMinimize = () => {
    setIsMinimized(true);
  };

  const handleRestore = () => {
    setIsMinimized(false);
  };

  const handleClose = () => {
    setIsOpen(false);
    setIsMinimized(false);
  };

  // Glassmorphism styles
  const glassCardClass =
    "bg-white/90 backdrop-blur-md shadow-[0_4px_20px_rgba(30,41,59,0.08)] border border-white/50";

  return (
    <>
      {/* Floating Action Button - Glassmorphism Style */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={handleOpen}
          className="relative group"
          aria-label="AI Legal Assistant"
        >
          {/* Main button with glass effect */}
          <div
            className="w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 backdrop-blur-md"
            style={{
              background: `linear-gradient(135deg, ${colors.primary}, ${colors.primaryContainer})`,
              boxShadow: "0 4px 20px rgba(30, 41, 59, 0.15)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "scale(1.05)";
              e.currentTarget.style.boxShadow =
                "0 8px 30px rgba(30, 41, 59, 0.2)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "scale(1)";
              e.currentTarget.style.boxShadow =
                "0 4px 20px rgba(30, 41, 59, 0.15)";
            }}
          >
            <Bot className="w-6 h-6 text-white" />

            {/* Notification badge - using tertiary color for urgency */}
            {unreadCount > 0 && (
              <div
                className="absolute -top-1 -right-1 text-white text-xs font-medium rounded-full w-5 h-5 flex items-center justify-center ring-2 ring-white"
                style={{ backgroundColor: colors.error }}
              >
                {unreadCount > 9 ? "9+" : unreadCount}
              </div>
            )}
          </div>
        </button>
      </div>

      {/* Modal - Glassmorphism Level 2 */}
      <AnimatePresence mode="wait">
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[9999] flex items-center justify-center p-4"
            onClick={(e) => {
              if (e.target === e.currentTarget) handleClose();
            }}
          >
            <motion.div
              initial={
                isMinimized
                  ? { scale: 0.9, y: 50, opacity: 0 }
                  : { scale: 0.95, opacity: 0, y: 20 }
              }
              animate={
                isMinimized
                  ? { scale: 0.9, y: 50, opacity: 1 }
                  : { scale: 1, opacity: 1, y: 0 }
              }
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className={`relative rounded-xl w-full max-w-4xl h-[85vh] flex flex-col overflow-hidden ${glassCardClass}`}
              style={{ backdropFilter: "blur(20px)" }}
            >
              {/* Header - Glassmorphism */}
              <div
                className="px-5 py-3 flex items-center justify-between flex-shrink-0"
                style={{
                  borderBottom: `1px solid ${colors.outlineVariant}`,
                  backgroundColor: "rgba(255, 255, 255, 0.7)",
                  backdropFilter: "blur(8px)",
                }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{
                      background: `linear-gradient(135deg, ${colors.secondary}, ${colors.secondaryContainer})`,
                    }}
                  >
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h2
                      className="text-sm font-semibold"
                      style={{ color: colors.onSurface }}
                    >
                      Legal Assistant
                    </h2>
                    <div className="flex items-center gap-2">
                      <div
                        className="w-1.5 h-1.5 rounded-full"
                        style={{ backgroundColor: "#4caf50" }}
                      />
                      <p
                        className="text-xs"
                        style={{ color: colors.onSurfaceVariant }}
                      >
                        Ready to help
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={isMinimized ? handleRestore : handleMinimize}
                    className="p-1.5 rounded-lg transition-all duration-200"
                    style={{ color: colors.onSurfaceVariant }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor =
                        colors.surfaceContainerHighest;
                      e.currentTarget.style.color = colors.onSurface;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "transparent";
                      e.currentTarget.style.color = colors.onSurfaceVariant;
                    }}
                    title={isMinimized ? "Restore" : "Minimize"}
                  >
                    {isMinimized ? (
                      <Maximize2 className="w-4 h-4" />
                    ) : (
                      <Minimize2 className="w-4 h-4" />
                    )}
                  </button>

                  <button
                    onClick={handleClose}
                    className="p-1.5 rounded-lg transition-all duration-200"
                    style={{ color: colors.onSurfaceVariant }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor =
                        colors.errorContainer;
                      e.currentTarget.style.color = colors.onErrorContainer;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "transparent";
                      e.currentTarget.style.color = colors.onSurfaceVariant;
                    }}
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* User info bar - Glassmorphism */}
              {user && (
                <div
                  className="px-5 py-2 flex-shrink-0"
                  style={{
                    backgroundColor: colors.surfaceContainerLow,
                    borderBottom: `1px solid ${colors.outlineVariant}`,
                  }}
                >
                  <div className="flex items-center gap-2">
                    <span
                      className="text-xs"
                      style={{ color: colors.onSurfaceVariant }}
                    >
                      Signed in as
                    </span>
                    <span
                      className="text-xs font-medium"
                      style={{ color: colors.onSurface }}
                    >
                      {user.name || user.email}
                    </span>
                    <span className="text-xs" style={{ color: colors.outline }}>
                      •
                    </span>
                    <span
                      className="text-xs"
                      style={{ color: colors.onSurfaceVariant }}
                    >
                      {user.role || "User"}
                    </span>
                  </div>
                </div>
              )}

              {/* Chat Area */}
              <div className="flex-1 overflow-hidden">
                <AiAssistant />
              </div>

              {/* Footer */}
              <div
                className="px-5 py-2 flex-shrink-0"
                style={{
                  borderTop: `1px solid ${colors.outlineVariant}`,
                  backgroundColor: "rgba(255, 255, 255, 0.7)",
                  backdropFilter: "blur(8px)",
                }}
              >
                <p
                  className="text-[11px] text-center"
                  style={{ color: colors.onSurfaceVariant }}
                >
                  AI-generated information. Not legal advice.
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Minimized state - Glassmorphism */}
      <AnimatePresence>
        {isOpen && isMinimized && (
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="fixed bottom-24 right-6 z-[9999] cursor-pointer"
            onClick={handleRestore}
          >
            <div
              className="rounded-xl p-3 flex items-center gap-3 transition-all duration-300 hover:shadow-xl"
              style={{
                backgroundColor: "rgba(255, 255, 255, 0.95)",
                backdropFilter: "blur(12px)",
                border: `1px solid ${colors.outlineVariant}`,
                boxShadow: "0 4px 20px rgba(30, 41, 59, 0.08)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow =
                  "0 8px 30px rgba(30, 41, 59, 0.15)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow =
                  "0 4px 20px rgba(30, 41, 59, 0.08)";
              }}
            >
              <div className="relative">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{
                    background: `linear-gradient(135deg, ${colors.secondary}, ${colors.secondaryContainer})`,
                  }}
                >
                  <MessageCircle className="w-4 h-4 text-white" />
                </div>
                <div
                  className="absolute -top-1 -right-1 w-2 h-2 rounded-full ring-2"
                  style={{ backgroundColor: "#4caf50", ringColor: "white" }}
                />
              </div>
              <div>
                <p
                  className="text-sm font-medium"
                  style={{ color: colors.onSurface }}
                >
                  Legal Assistant
                </p>
                <p
                  className="text-xs"
                  style={{ color: colors.onSurfaceVariant }}
                >
                  Click to open
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AiFab;
