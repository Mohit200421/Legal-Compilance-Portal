import API from "../../api/axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  User,
  Mail,
  Shield,
  CheckCircle,
  XCircle,
  Clock,
  Search,
  X,
  Filter,
  ChevronDown,
  Trash2,
  Eye,
  AlertCircle,
  Users as UsersIcon,
  Ban,
  CheckCheck,
  TrendingUp,
  Award,
  Calendar,
  MapPin,
  Phone,
  Briefcase,
  BookOpen,
  Star,
  MoreVertical
} from "lucide-react";

export default function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await API.get("/admin/users");
      setUsers(res.data);
      setFilteredUsers(res.data);
    } catch (err) {
      console.log(err);
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  // Filter and search
  useEffect(() => {
    let result = [...users];

    // Apply role filter
    if (roleFilter !== "all") {
      result = result.filter(u => u.role === roleFilter);
    }

    // Apply status filter
    if (statusFilter !== "all") {
      result = result.filter(u => u.status === statusFilter);
    }

    // Apply search
    if (searchTerm) {
      result = result.filter(u => 
        u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredUsers(result);
  }, [users, searchTerm, roleFilter, statusFilter]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      await API.delete(`/admin/users/${id}`);
      setUsers(users.filter((u) => u._id !== id));
      toast.success("User deleted successfully");
      setSelectedUser(null);
    } catch (err) {
      console.log(err);
      toast.error("Failed to delete user");
    }
  };

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      await API.put(`/admin/users/${id}/status`, { status: newStatus });
      setUsers(users.map(u => u._id === id ? { ...u, status: newStatus } : u));
      toast.success(`User status updated to ${newStatus}`);
    } catch (err) {
      console.log(err);
      toast.error("Failed to update status");
    }
  };

  const getRoleBadge = (role) => {
    switch(role) {
      case "admin":
        return {
          icon: Shield,
          text: "Admin",
          bg: "bg-purple-100",
          textColor: "text-purple-700",
          border: "border-purple-200",
          gradient: "from-purple-500 to-purple-600"
        };
      case "lawyer":
        return {
          icon: Briefcase,
          text: "Lawyer",
          bg: "bg-blue-100",
          textColor: "text-blue-700",
          border: "border-blue-200",
          gradient: "from-blue-500 to-blue-600"
        };
      default:
        return {
          icon: User,
          text: "User",
          bg: "bg-green-100",
          textColor: "text-green-700",
          border: "border-green-200",
          gradient: "from-green-500 to-green-600"
        };
    }
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case "active":
        return {
          icon: CheckCircle,
          text: "Active",
          bg: "bg-green-100",
          textColor: "text-green-700",
          border: "border-green-200",
          lightBg: "bg-green-50"
        };
      case "inactive":
        return {
          icon: Clock,
          text: "Inactive",
          bg: "bg-yellow-100",
          textColor: "text-yellow-700",
          border: "border-yellow-200",
          lightBg: "bg-yellow-50"
        };
      case "suspended":
        return {
          icon: Ban,
          text: "Suspended",
          bg: "bg-red-100",
          textColor: "text-red-700",
          border: "border-red-200",
          lightBg: "bg-red-50"
        };
      default:
        return {
          icon: XCircle,
          text: status || "Unknown",
          bg: "bg-gray-100",
          textColor: "text-gray-700",
          border: "border-gray-200",
          lightBg: "bg-gray-50"
        };
    }
  };

  const stats = {
    total: users.length,
    active: users.filter(u => u.status === "active").length,
    inactive: users.filter(u => u.status === "inactive").length,
    suspended: users.filter(u => u.status === "suspended").length,
    admins: users.filter(u => u.role === "admin").length,
    lawyers: users.filter(u => u.role === "lawyer").length,
    regular: users.filter(u => u.role === "user").length
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-6">
      {/* Page Header */}
      <div className="mb-6 md:mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="inline-flex items-center bg-green-50 border border-green-200 px-3 py-1.5 rounded-lg mb-3">
              <UsersIcon className="h-4 w-4 text-green-600 mr-2" />
              <span className="text-xs font-semibold text-green-600 tracking-wider">USER MANAGEMENT</span>
            </div>
            <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900">
              Manage Users
            </h1>
            <p className="text-xs md:text-sm text-gray-500 mt-1">
              View and manage all registered users
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
              <p className="text-xs text-gray-500">Lawyers</p>
              <p className="text-lg font-bold text-blue-600">{stats.lawyers}</p>
            </div>
          </div>

          {/* Desktop Stats */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="bg-white rounded-xl border border-gray-200 px-6 py-3">
              <p className="text-xs text-gray-500">Total Users</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 px-6 py-3">
              <p className="text-xs text-gray-500">Active</p>
              <p className="text-2xl font-bold text-green-600">{stats.active}</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 px-6 py-3">
              <p className="text-xs text-gray-500">Lawyers</p>
              <p className="text-2xl font-bold text-blue-600">{stats.lawyers}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="bg-white rounded-xl border border-gray-200 mb-6 p-4">
        <div className="flex flex-col gap-4">
          {/* Search and Filter Row */}
          <div className="flex items-center gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-10 py-2.5 border border-gray-300 bg-white rounded-xl text-sm focus:border-green-600 focus:ring-2 focus:ring-green-200 transition-all"
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
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 bg-white rounded-lg text-sm focus:border-green-600 focus:ring-2 focus:ring-green-200"
              >
                <option value="all">All Roles</option>
                <option value="user">Users</option>
                <option value="lawyer">Lawyers</option>
                <option value="admin">Admins</option>
              </select>
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 bg-white rounded-lg text-sm focus:border-green-600 focus:ring-2 focus:ring-green-200"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="suspended">Suspended</option>
            </select>

            <span className="text-sm text-gray-500 ml-auto">
              Showing <span className="font-medium text-gray-900">{filteredUsers.length}</span> of {users.length} users
            </span>
          </div>

          {/* Filters - Mobile */}
          {showFilters && (
            <div className="md:hidden space-y-3 pt-2">
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 bg-white rounded-lg text-sm"
              >
                <option value="all">All Roles</option>
                <option value="user">Users</option>
                <option value="lawyer">Lawyers</option>
                <option value="admin">Admins</option>
              </select>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 bg-white rounded-lg text-sm"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="suspended">Suspended</option>
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center">
            <div className="inline-flex items-center space-x-3">
              <div className="w-6 h-6 border-2 border-green-600 border-t-transparent animate-spin rounded-full"></div>
              <p className="text-gray-600">Loading users...</p>
            </div>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <UsersIcon className="h-8 w-8 text-gray-400" />
            </div>
            <p className="text-gray-500 mb-2">No users found</p>
            <p className="text-xs text-gray-400">
              {searchTerm || roleFilter !== "all" || statusFilter !== "all"
                ? "Try adjusting your filters"
                : "No users registered yet"}
            </p>
          </div>
        ) : (
          <>
            {/* Table Header */}
            <div className="border-b border-gray-200 p-5">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-gray-900">
                  Registered Users
                </h2>
              </div>
            </div>

            {/* Table - Desktop */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left p-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      User
                    </th>
                    <th className="text-left p-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="text-left p-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="text-left p-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="text-right p-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredUsers.map((user) => {
                    const roleBadge = getRoleBadge(user.role);
                    const statusBadge = getStatusBadge(user.status);
                    const RoleIcon = roleBadge.icon;
                    const StatusIcon = statusBadge.icon;

                    return (
                      <tr key={user._id} className="hover:bg-gray-50 transition-colors">
                        <td className="p-4">
                          <div className="flex items-center space-x-3">
                            <div className={`w-10 h-10 bg-gradient-to-br ${roleBadge.gradient} rounded-lg flex items-center justify-center shadow-md`}>
                              <User className="h-5 w-5 text-white" />
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">{user.name}</p>
                              <p className="text-xs text-gray-500 mt-1">ID: {user._id.slice(-8)}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center text-sm text-gray-600">
                            <Mail className="h-3 w-3 mr-2 text-gray-400" />
                            {user.email}
                          </div>
                        </td>
                        <td className="p-4">
                          <span className={`inline-flex items-center px-2 py-1 text-xs rounded-full ${roleBadge.bg} ${roleBadge.textColor}`}>
                            <RoleIcon className="h-3 w-3 mr-1" />
                            {roleBadge.text}
                          </span>
                        </td>
                        <td className="p-4">
                          <span className={`inline-flex items-center px-2 py-1 text-xs rounded-full ${statusBadge.bg} ${statusBadge.textColor}`}>
                            <StatusIcon className="h-3 w-3 mr-1" />
                            {statusBadge.text}
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end space-x-2">
                            <button
                              onClick={() => setSelectedUser(user)}
                              className="p-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                              title="View Details"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                            
                            {/* Status Update Dropdown */}
                            <select
                              onChange={(e) => handleStatusUpdate(user._id, e.target.value)}
                              value={user.status}
                              className="p-2 border border-gray-300 rounded-lg text-sm focus:border-green-600 focus:ring-2 focus:ring-green-200"
                            >
                              <option value="active">Set Active</option>
                              <option value="inactive">Set Inactive</option>
                              <option value="suspended">Suspend</option>
                            </select>

                            <button
                              onClick={() => handleDelete(user._id)}
                              className="p-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                              title="Delete User"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden p-4 space-y-4">
              {filteredUsers.map((user) => {
                const roleBadge = getRoleBadge(user.role);
                const statusBadge = getStatusBadge(user.status);
                const RoleIcon = roleBadge.icon;

                return (
                  <div key={user._id} className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-lg transition-shadow">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className={`w-10 h-10 bg-gradient-to-br ${roleBadge.gradient} rounded-lg flex items-center justify-center shadow-md`}>
                          <User className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{user.name}</p>
                          <p className="text-xs text-gray-500">ID: {user._id.slice(-8)}</p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-xs text-gray-600">
                        <Mail className="h-3 w-3 mr-2 text-gray-400" />
                        {user.email}
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`inline-flex items-center px-2 py-1 text-xs rounded-full ${roleBadge.bg} ${roleBadge.textColor}`}>
                          <RoleIcon className="h-3 w-3 mr-1" />
                          {roleBadge.text}
                        </span>
                        <span className={`inline-flex items-center px-2 py-1 text-xs rounded-full ${statusBadge.bg} ${statusBadge.textColor}`}>
                          {statusBadge.text}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-end space-x-2 pt-3 border-t border-gray-100">
                      <button
                        onClick={() => setSelectedUser(user)}
                        className="p-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <select
                        onChange={(e) => handleStatusUpdate(user._id, e.target.value)}
                        value={user.status}
                        className="p-2 border border-gray-300 rounded-lg text-sm"
                      >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                        <option value="suspended">Suspend</option>
                      </select>
                      <button
                        onClick={() => handleDelete(user._id)}
                        className="p-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>

      {/* View Details Modal */}
      {selectedUser && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedUser(null)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-green-600 to-green-700 p-5 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <User className="h-5 w-5 text-white" />
                <h2 className="text-lg font-bold text-white">User Details</h2>
              </div>
              <button
                onClick={() => setSelectedUser(null)}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                <X className="h-5 w-5 text-white" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                    <p className="text-xs text-gray-500 mb-1">Name</p>
                    <p className="text-sm font-medium text-gray-900">{selectedUser.name}</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                    <p className="text-xs text-gray-500 mb-1">Email</p>
                    <p className="text-sm text-gray-900">{selectedUser.email}</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                    <p className="text-xs text-gray-500 mb-1">Role</p>
                    <span className={`inline-flex items-center px-2 py-1 text-xs rounded-full ${
                      selectedUser.role === "admin" 
                        ? "bg-purple-100 text-purple-700"
                        : selectedUser.role === "lawyer"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-green-100 text-green-700"
                    }`}>
                      {selectedUser.role}
                    </span>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                    <p className="text-xs text-gray-500 mb-1">Status</p>
                    <span className={`inline-flex items-center px-2 py-1 text-xs rounded-full ${
                      selectedUser.status === "active" 
                        ? "bg-green-100 text-green-700"
                        : selectedUser.status === "inactive"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-red-100 text-red-700"
                    }`}>
                      {selectedUser.status}
                    </span>
                  </div>
                  <div className="col-span-2 bg-gray-50 rounded-xl p-4 border border-gray-200">
                    <p className="text-xs text-gray-500 mb-1">User ID</p>
                    <p className="text-sm text-gray-600 break-all">{selectedUser._id}</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                    <p className="text-xs text-gray-500 mb-1">Joined</p>
                    <p className="text-sm text-gray-600">
                      {selectedUser.createdAt 
                        ? new Date(selectedUser.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })
                        : "N/A"}
                    </p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                    <p className="text-xs text-gray-500 mb-1">Last Updated</p>
                    <p className="text-sm text-gray-600">
                      {selectedUser.updatedAt 
                        ? new Date(selectedUser.updatedAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })
                        : "N/A"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end space-x-3 p-5 border-t border-gray-200 bg-gray-50">
              <button
                onClick={() => handleDelete(selectedUser._id)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-all shadow-md flex items-center space-x-2"
              >
                <Trash2 className="h-4 w-4" />
                <span>Delete User</span>
              </button>
              <button
                onClick={() => setSelectedUser(null)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Info Note */}
      <div className="mt-6 bg-blue-50 border-l-4 border-blue-600 rounded-xl p-4">
        <div className="flex items-start">
          <AlertCircle className="h-5 w-5 text-blue-600 mr-3 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="text-sm font-medium text-blue-900 mb-1">About User Management</h3>
            <p className="text-xs text-blue-700">
              You can update user status (active, inactive, suspended) or delete users. Deleted users cannot be recovered.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}