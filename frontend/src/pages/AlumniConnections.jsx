import React, { useEffect, useState } from "react";
import { connectionService } from "../services/connectionService";
import { useNavigate } from "react-router-dom";
import "./AlumniConnections.css";

const AlumniConnections = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const alumniId = localStorage.getItem("userId");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const data = await connectionService.getPendingRequests(alumniId);
        console.log("📋 Pending requests:", data);
        setRequests(data);
      } catch (err) {
        console.error("Error fetching requests:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchRequests();
  }, [alumniId]);

  const handleAccept = async (connectionId) => {
    try {
      await connectionService.acceptRequest(connectionId);
      setRequests((prev) => prev.filter((r) => r.id !== connectionId));
    } catch (err) {
      console.error("Error accepting connection:", err);
      alert("Failed to accept connection");
    }
  };

  const handleReject = async (connectionId) => {
    try {
      await connectionService.rejectRequest(connectionId);
      setRequests((prev) => prev.filter((r) => r.id !== connectionId));
    } catch (err) {
      console.error("Error rejecting connection:", err);
      alert("Failed to reject connection");
    }
  };

  const handleViewProfile = (studentId) => {
    if (studentId) {
      navigate(`/student-profile/${studentId}`);
    } else {
      alert("Student profile not available");
    }
  };

  if (loading) return <p className="loading-text">Loading requests...</p>;

  return (
    <div className="connection-container">
      <h2 className="connection-title">Pending Connection Requests</h2>
      {requests.length === 0 ? (
        <p className="no-requests">No pending requests right now 🎉</p>
      ) : (
        <div className="card-grid">
          {requests.map((req) => {
            const student = req.student;
            const profile = student?.profile || {};
            const studentName = profile.firstName && profile.lastName
              ? `${profile.firstName} ${profile.lastName}`
              : "Student";
            const batch = profile.batch || "Batch not specified";
            const branch = profile.branch || "Branch not specified";
            const about = profile.about || "No description available";

            return (
              <div key={req.id} className="connection-card">
                <img
                  src={profile.profilePicture || "/default-avatar.png"}
                  alt="Student"
                  className="profile-pic"
                />
                <h3>{studentName}</h3>
                <p><strong>Batch:</strong> {batch} • {branch}</p>
                <p><strong>About:</strong> {about}</p>
                <div className="button-group">
                  <button
                    className="accept-btn"
                    onClick={() => handleAccept(req.id)}
                  >
                    Accept
                  </button>
                  <button
                    className="reject-btn"
                    onClick={() => handleReject(req.id)}
                  >
                    Reject
                  </button>
                  <button
                    className="view-btn"
                    onClick={() => handleViewProfile(student?.id)}
                  >
                    View Profile
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AlumniConnections;