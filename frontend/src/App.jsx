import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";

// Call feature removed

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import About from "./pages/About";
import VerifyOtp from "./pages/auth/VerifyOtp";
import ApplyLawyer from "./pages/auth/ApplyLawyer";
import TermsAndConditions from "./pages/TermsAndConditions";

// Admin pages
import AdminLayout from "./pages/admin/AdminLayout";
import Dashboard from "./pages/admin/Dashboard";
import ManageUsers from "./pages/admin/ManageUsers";
import ManageLawyers from "./pages/admin/ManageLawyers";
import ManageMaster from "./pages/admin/ManageMaster";
import ManageNews from "./pages/admin/ManageNews";
import ManageEvents from "./pages/admin/ManageEvents";
import ManageJobs from "./pages/admin/ManageJobs";
import AddLawyer from "./pages/admin/AddLawyer";
import PendingLawyers from "./pages/admin/PendingLawyers";

// Lawyer Pages
import LawyerLayout from "./pages/lawyer/LawyerLayout";
import LawyerDashboard from "./pages/lawyer/Dashboard";
import Articles from "./pages/lawyer/Articles";
import Documents from "./pages/lawyer/Documents";
import Discussion from "./pages/lawyer/Discussion";
import Cases from "./pages/lawyer/Cases";
import CaseEvents from "./pages/lawyer/CaseEvents";
import Requests from "./pages/lawyer/Requests";
import LawyerProfile from "./pages/lawyer/LawyerProfile";
import EditProfile from "./pages/lawyer/EditProfile";

// USER PAGES
import UserLayout from "./pages/user/UserLayout";
import UserDashboard from "./pages/user/Dashboard";
import TalkToLawyer from "./pages/user/TalkToLawyer";
import SearchLawyer from "./pages/user/SearchLawyer";
import UserArticles from "./pages/user/Articles";
import UserJobs from "./pages/user/Jobs";
import UserEvents from "./pages/user/Events";
import UserDocuments from "./pages/user/Documents";
import Feedback from "./pages/user/Feedback";
import MyRequests from "./pages/user/MyRequests";
import UserDiscussion from "./pages/user/Discussion";

import ProtectedRoute from "./routes/ProtectedRoute";
import PublicRoute from "./routes/PublicRoute";
import ChatPage from "./pages/common/ChatPage";
import AiChatPage from "./pages/common/AiChatPage";
import ContactSupport from "./pages/ContactSupport";
import AdminSupport from "./components/AdminSupportPanel";
import AiFab from "./components/AiFab";
import { AuthContext } from "./context/AuthContext";

function App() {
  return (
    <AuthContext.Consumer>
      {({ user, loading }) => (
        <BrowserRouter>
          <Toaster
            position="bottom-right"
            reverseOrder={false}
            toastOptions={{
              duration: 4000,
              position: "bottom-right",
              style: {
                background: "linear-gradient(135deg, #1f2937 0%, #111827 100%)",
                color: "#fff",
                borderRadius: "12px",
                padding: "12px 16px",
                fontSize: "14px",
                fontWeight: "500",
                boxShadow:
                  "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
              },
              success: {
                duration: 3000,
                style: {
                  background:
                    "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                  color: "#fff",
                  borderRadius: "12px",
                  padding: "12px 16px",
                  fontSize: "14px",
                  fontWeight: "500",
                  boxShadow:
                    "0 10px 15px -3px rgba(16, 185, 129, 0.2), 0 4px 6px -2px rgba(16, 185, 129, 0.1)",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                },
                iconTheme: {
                  primary: "#fff",
                  secondary: "#10b981",
                },
              },
              error: {
                duration: 5000,
                style: {
                  background:
                    "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
                  color: "#fff",
                  borderRadius: "12px",
                  padding: "12px 16px",
                  fontSize: "14px",
                  fontWeight: "500",
                  boxShadow:
                    "0 10px 15px -3px rgba(239, 68, 68, 0.2), 0 4px 6px -2px rgba(239, 68, 68, 0.1)",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                },
                iconTheme: {
                  primary: "#fff",
                  secondary: "#ef4444",
                },
              },
              loading: {
                style: {
                  background:
                    "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
                  color: "#fff",
                  borderRadius: "12px",
                  padding: "12px 16px",
                  fontSize: "14px",
                  fontWeight: "500",
                  boxShadow: "0 10px 15px -3px rgba(59, 130, 246, 0.2)",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                },
              },
              // Custom icons for different toast types
              icon: true,
              // RTL support if needed
              rtl: false,
              // Close button styling
              closeButton: {
                style: {
                  color: "#fff",
                  opacity: 0.7,
                  transition: "opacity 0.2s",
                },
                onClick: (e) => {
                  // Custom close behavior if needed
                  console.log("Toast closed");
                },
              },
            }}
          />
          {!loading && user ? <AiFab /> : null}

          <Routes>
            {/* Home page with Navbar */}
            <Route path="/" element={<Home />} />

            {/* Auth pages WITHOUT Navbar */}
            <Route
              path="/login"
              element={
                <PublicRoute>
                  <Login />
                </PublicRoute>
              }
            />

            <Route
              path="/register"
              element={
                <PublicRoute>
                  <Register />
                </PublicRoute>
              }
            />
            <Route
              path="/verify-otp"
              element={
                <PublicRoute>
                  <VerifyOtp />
                </PublicRoute>
              }
            />

            <Route
              path="/forgot-password"
              element={
                <PublicRoute>
                  <ForgotPassword />
                </PublicRoute>
              }
            />

            <Route
              path="/about"
              element={
                <PublicRoute>
                  <About />
                </PublicRoute>
              }
            />

            <Route
              path="/apply-lawyer"
              element={
                <PublicRoute>
                  <ApplyLawyer />
                </PublicRoute>
              }
            />

            <Route
              path="/terms-and-conditions"
              element={
                <PublicRoute>
                  <TermsAndConditions />
                </PublicRoute>
              }
            />

            {/* ADMIN ROUTES - AdminLayout already contains its own navigation */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute allow="admin">
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Dashboard />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="lawyers" element={<ManageLawyers />} />
              <Route path="add-lawyer" element={<AddLawyer />} />
              <Route path="pending-lawyers" element={<PendingLawyers />} />
              <Route path="users" element={<ManageUsers />} />
              <Route path="master" element={<ManageMaster />} />
              <Route path="news" element={<ManageNews />} />
              <Route path="events" element={<ManageEvents />} />
              <Route path="jobs" element={<ManageJobs />} />
              <Route path="support" element={<AdminSupport />} />
            </Route>

            {/* LAWYER ROUTES - LawyerLayout already contains its own navigation */}
            <Route
              path="/lawyer"
              element={
                <ProtectedRoute allow="lawyer">
                  <LawyerLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<LawyerDashboard />} />
              <Route path="profile" element={<LawyerProfile />} />
              <Route path="edit-profile" element={<EditProfile />} />
              <Route path="articles" element={<Articles />} />
              <Route path="documents" element={<Documents />} />
              <Route path="discussion" element={<Discussion />} />
              <Route path="cases" element={<Cases />} />
              <Route path="case-events" element={<CaseEvents />} />
              <Route path="requests" element={<Requests />} />
              <Route path="contact-support" element={<ContactSupport />} />
            </Route>

            {/* USER ROUTES - UserLayout already contains its own navigation */}
            <Route
              path="/user"
              element={
                <ProtectedRoute allow="user">
                  <UserLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<UserDashboard />} />
              <Route path="talk-to-lawyer" element={<TalkToLawyer />} />
              <Route path="search-lawyer" element={<SearchLawyer />} />
              <Route path="articles" element={<UserArticles />} />
              <Route path="discussion" element={<UserDiscussion />} />
              <Route path="my-requests" element={<MyRequests />} />

              <Route path="jobs" element={<UserJobs />} />
              <Route path="events" element={<UserEvents />} />
              <Route path="documents" element={<UserDocuments />} />
              <Route path="feedback" element={<Feedback />} />
              <Route path="contact-support" element={<ContactSupport />} />
            </Route>

            <Route
              path="/chat/:id"
              element={
                <ProtectedRoute allow={["user", "lawyer"]}>
                  <ChatPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/ai-assistant"
              element={
                <ProtectedRoute>
                  <AiChatPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/contact-support"
              element={
                <ProtectedRoute allow={["user", "lawyer"]}>
                  <ContactSupport />
                </ProtectedRoute>
              }
            />
          </Routes>
        </BrowserRouter>
      )}
    </AuthContext.Consumer>
  );
}

export default App;
