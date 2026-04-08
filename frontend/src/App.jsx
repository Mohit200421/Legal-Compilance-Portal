import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import { CallProvider } from "./context/CallContext";
import VideoCall from "./components/VideoCall";

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



function App() {
  return (
    <CallProvider>
      <BrowserRouter>
        <Toaster
          position="top-right"
          reverseOrder={false}
          toastOptions={{
            duration: 4000,
            style: {
              background: "#333",
              color: "#fff",
            },
            success: {
              style: {
                background: "#10b981",
              },
            },
            error: {
              style: {
                background: "#ef4444",
              },
            },
          }}
        />
        <VideoCall />
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
          </Route>

          <Route
  path="/chat/:id"
  element={
    <ProtectedRoute allow="user">
      <ChatPage />
    </ProtectedRoute>
  }
/>
        </Routes>
      </BrowserRouter>
    </CallProvider>
  );
}

export default App;
