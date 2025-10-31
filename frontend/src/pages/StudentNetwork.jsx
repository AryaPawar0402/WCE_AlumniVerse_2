import React, { useEffect, useState } from "react";
import api from "../config/api";
import "./StudentNetwork.css";

const StudentNetwork = () => {
  const [alumniList, setAlumniList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [connections, setConnections] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ✅ Get student ID directly from localStorage
  const studentId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (studentId && token) {
      console.log("✅ Student ID found:", studentId);
      console.log("✅ Token found:", token ? "YES" : "NO");
      fetchAllAlumni();
    } else {
      console.log("❌ No student ID or token found in localStorage");
      setError("Please log in to access this feature.");
    }
  }, [studentId, token]);

  // 🔹 Fetch all alumni
  const fetchAllAlumni = async () => {
    try {
      setLoading(true);
      setError("");

      console.log("🔄 Fetching alumni from: /connections/allAlumni");
      const res = await api.get("/connections/allAlumni");
      console.log("📊 Alumni data:", res.data);
      setAlumniList(res.data || []);
      await fetchStudentConnections();
    } catch (err) {
      console.error("Error fetching alumni:", err);
      if (err.response?.status === 403) {
        setError("Access denied. Please check if you're logged in properly.");
      } else {
        setError("Failed to load alumni data. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Fetch student's current connection statuses
  const fetchStudentConnections = async () => {
    try {
      const res = await api.get(`/connections/status/${studentId}`);
      console.log("🔗 Connection status response:", res.data);

      if (Array.isArray(res.data)) {
        const map = {};
        res.data.forEach((conn) => {
          if (conn.alumniId && conn.status) {
            map[conn.alumniId] = conn.status;
          }
        });
        setConnections(map);
        console.log("✅ Connection status map:", map);
      } else if (typeof res.data === 'object') {
        setConnections(res.data);
        console.log("✅ Connection status object:", res.data);
      } else {
        console.log("⚠️ Unexpected connection status format:", res.data);
        setConnections({});
      }
    } catch (err) {
      console.error("Error fetching connection status:", err);
      setConnections({});
    }
  };

  // 🔹 Send connection request
  const sendRequest = async (alumniId) => {
    try {
      await api.post("/connections/send", null, {
        params: { studentId, alumniId }
      });
      alert("Connection request sent!");
      await fetchStudentConnections();
    } catch (err) {
      console.error("Error sending request:", err);
      if (err.response?.status === 403) {
        alert("You don't have permission to send connection requests.");
      } else {
        alert("Failed to send connection request. Please try again.");
      }
    }
  };

  // 🔍 Filter alumni list
  const filteredAlumni = alumniList.filter((alumni) => {
    if (!alumni) return false;
    const searchLower = searchTerm.toLowerCase();
    const profile = alumni.profile || {};

    return (
      alumni.name?.toLowerCase().includes(searchLower) ||
      profile.firstName?.toLowerCase().includes(searchLower) ||
      profile.lastName?.toLowerCase().includes(searchLower) ||
      profile.batch?.toString().includes(searchTerm) ||
      profile.branch?.toLowerCase().includes(searchLower) ||
      profile.currentPosition?.toLowerCase().includes(searchLower)
    );
  });

  // ✅ Show authentication error if no student ID
  if (!studentId || !token) {
    return (
      <div className="error-container">
        <h2>Authentication Required</h2>
        <p>Please log in to access the network features.</p>
        <button
          onClick={() => window.location.href = "/login"}
          className="login-redirect-btn"
        >
          Go to Login
        </button>
      </div>
    );
  }

  return (
    <div className="connections-page">
      <div className="connections-header">
        <h1>Student Network</h1>
        <p>Discover alumni and expand your professional network.</p>
      </div>

      {error && (
        <div className="error-message">
          {error}
          <button onClick={() => setError("")} className="dismiss-btn">
            ×
          </button>
        </div>
      )}

      <div className="search-bar">
        <input
          type="text"
          placeholder="🔍 Search alumni by name, batch, or branch..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button onClick={fetchAllAlumni} disabled={loading}>
          {loading ? "Loading..." : "Refresh"}
        </button>
      </div>

      {loading && <div className="loading">Loading alumni data...</div>}

      <div className="alumni-grid">
        {filteredAlumni.length > 0 ? (
          filteredAlumni.map((alumni) => {
            const profile = alumni.profile || {};
            const alumniName = profile.firstName && profile.lastName
              ? `${profile.firstName} ${profile.lastName}`
              : alumni.name || "Alumni Name";
            const batch = profile.batch || "Batch not specified";
            const branch = profile.branch || "Branch not specified";
            const position = profile.currentPosition || "Position not specified";
            const status = connections[alumni.id];

            return (
              <div className="alumni-card" key={alumni.id}>
                <img
                  src={profile.profilePicture || "https://via.placeholder.com/100"}
                  alt={alumniName}
                  className="alumni-photo"
                />
                <h3>{alumniName}</h3>
                <p><strong>{batch} • {branch}</strong></p>
                <p className="text-sm italic">{position}</p>

                {status === "ACCEPTED" ? (
                  <button className="connect-btn connected" disabled>
                    ✅ Connected
                  </button>
                ) : status === "PENDING" ? (
                  <button className="connect-btn pending" disabled>
                    ⏳ Pending
                  </button>
                ) : (
                  <button
                    className="connect-btn"
                    onClick={() => sendRequest(alumni.id)}
                  >
                    🤝 Connect
                  </button>
                )}
              </div>
            );
          })
        ) : (
          !loading && <p className="no-results">No alumni found. Try adjusting your search.</p>
        )}
      </div>
    </div>
  );
};

export default StudentNetwork;