import { useEffect, useState } from "react";
import axios from "axios";
import "../../styles/admincss/dashboard.css";

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalLawyers: 0,
    activeJobs: 0,
    newsPosts: 0,
  });

  useEffect(() => {
    fetchDashboardCounts();
  }, []);

  const fetchDashboardCounts = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(
        "http://localhost:5000/api/admin/dashboard-counts",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setStats(res.data);
    } catch (error) {
      console.error("Dashboard API error:", error);
    }
  };

  return (
    <>
      <h1 className="admin-title">Dashboard</h1>

      <div className="stats-grid">
        <div className="stat-card">
          <h3>{stats.totalLawyers}</h3>
          <p>Total Lawyers</p>
        </div>

        <div className="stat-card">
          <h3>{stats.totalUsers}</h3>
          <p>Total Users</p>
        </div>

        <div className="stat-card">
          <h3>{stats.activeJobs}</h3>
          <p>Active Jobs</p>
        </div>

        <div className="stat-card">
          <h3>{stats.newsPosts}</h3>
          <p>News Posts</p>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
