import React, { useEffect, useState, useRef } from "react";
import { getProfile, updateProfile } from "../services/profileService";
import Navbar from "../components/Navbar";
import { FaCamera } from "react-icons/fa";
import "./StudentProfile.css";

const StudentProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [avatarUrl, setAvatarUrl] = useState(null);

  const fileInputRef = useRef(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const data = await getProfile();
        setProfile(data);
        setFormData({
          firstName: data.firstName || "",
          lastName: data.lastName || "",
          email: data.email || "",
          phone: data.phone || "",
          graduationYear: data.graduationYear || "",
          degree: data.degree || "",
          branch: data.branch || "",
          currentCompany: data.currentCompany || "",
          position: data.position || "",
          about: data.about || "",
        });
        setAvatarUrl(data.avatar || null);
        setError("");
      } catch (err) {
        setError(err.message || "Failed to load profile");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    setError("");
  };

  const handleSave = async () => {
    try {
      const updated = await updateProfile({ ...formData, avatar: avatarUrl });
      setProfile(updated);
      setIsEditing(false);
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update profile");
    }
  };

  const handleCancel = () => {
    setFormData({
      firstName: profile.firstName,
      lastName: profile.lastName,
      email: profile.email,
      phone: profile.phone,
      graduationYear: profile.graduationYear,
      degree: profile.degree,
      branch: profile.branch,
      currentCompany: profile.currentCompany,
      position: profile.position,
      about: profile.about,
    });
    setAvatarUrl(profile.avatar || null);
    setIsEditing(false);
    setError("");
  };

  const handleAvatarClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setAvatarUrl(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const initials = `${profile?.firstName?.charAt(0) || ""}${profile?.lastName?.charAt(0) || ""}`.toUpperCase() || "S";

  if (loading)
    return (
      <div className="student-profile-container">
        <div className="student-profile-background">
          <div className="bg-circle bg-circle-1"></div>
          <div className="bg-circle bg-circle-2"></div>
          <div className="bg-circle bg-circle-3"></div>
          <div className="bg-pattern"></div>
        </div>
        <Navbar />
        <div className="student-profile-content">
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p>Loading your profile...</p>
          </div>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="student-profile-container">
        <div className="student-profile-background">
          <div className="bg-circle bg-circle-1"></div>
          <div className="bg-circle bg-circle-2"></div>
          <div className="bg-circle bg-circle-3"></div>
          <div className="bg-pattern"></div>
        </div>
        <Navbar />
        <div className="student-profile-content">
          <div className="error-state">
            <svg className="error-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p>Error: {error}</p>
            <button onClick={() => window.location.reload()} className="retry-btn">Retry</button>
          </div>
        </div>
      </div>
    );

  return (
    <div className="student-profile-container">
      {/* Decorative Background */}
      <div className="student-profile-background">
        <div className="bg-circle bg-circle-1"></div>
        <div className="bg-circle bg-circle-2"></div>
        <div className="bg-circle bg-circle-3"></div>
        <div className="bg-pattern"></div>
      </div>

      <Navbar />

      <div className="student-profile-content">
        <div className="student-profile-card">
          {/* Profile Header with Avatar */}
          <div className="student-profile-header">
            <div className="student-profile-header-content">
              {/* Avatar Section */}
              <div className="student-profile-avatar-section">
                <div className="student-profile-avatar-wrapper">
                  <div className="student-profile-avatar">
                    {avatarUrl ? <img src={avatarUrl} alt="Profile" /> : initials}
                  </div>

                  {/* Camera Overlay */}
                  <div className="change-photo-overlay" onClick={handleAvatarClick}>
                    <FaCamera />
                  </div>

                  {/* Remove Button */}
                  {avatarUrl && (
                    <div className="remove-profile" onClick={() => setAvatarUrl(null)}>
                      ✕
                    </div>
                  )}

                  <input type="file" accept="image/*" ref={fileInputRef} style={{ display: "none" }} onChange={handleFileChange} />
                </div>
              </div>

              {/* User Info */}
              <div className="student-profile-user-info">
                <h1 className="student-profile-name">
                  {profile.firstName} {profile.lastName}
                </h1>
                <p className="student-profile-email">{profile.email}</p>
                {profile.graduationYear && <p className="student-profile-batch">Batch of {profile.graduationYear}</p>}
              </div>

              {/* Edit Button */}
              <button className="student-edit-profile-btn" onClick={handleEditToggle}>
                <svg className="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isEditing ? "M6 18L18 6M6 6l12 12" : "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"} />
                </svg>
                {isEditing ? "Cancel Editing" : "Edit Profile"}
              </button>
            </div>
          </div>

          {/* Profile Body */}
          <div className="student-profile-body">
            <div className="student-profile-info-grid">
              {/* Personal Info */}
              <div className="student-info-section">
                <div className="student-section-header">
                  <svg className="section-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <h3>Personal Information</h3>
                </div>

                <div className="student-info-item">
                  <span className="student-info-label">First Name</span>
                  <span className="student-info-value">
                    {isEditing ? (
                      <input
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        className="student-profile-input"
                      />
                    ) : (
                      profile.firstName
                    )}
                  </span>
                </div>

                <div className="student-info-item">
                  <span className="student-info-label">Last Name</span>
                  <span className="student-info-value">
                    {isEditing ? (
                      <input
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        className="student-profile-input"
                      />
                    ) : (
                      profile.lastName
                    )}
                  </span>
                </div>

                <div className="student-info-item">
                  <span className="student-info-label">Email</span>
                  <span className="student-info-value">{profile.email}</span>
                </div>

                <div className="student-info-item">
                  <span className="student-info-label">Phone</span>
                  <span className="student-info-value">
                    {isEditing ? (
                      <input
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="student-profile-input"
                      />
                    ) : (
                      profile.phone || "Not provided"
                    )}
                  </span>
                </div>
              </div>

              {/* Academic & Professional Info */}
              <div className="student-info-section">
                <div className="student-section-header">
                  <svg className="section-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <h3>Academic & Professional</h3>
                </div>

                <div className="student-info-item">
                  <span className="student-info-label">Graduation Year</span>
                  <span className="student-info-value">
                    {isEditing ? (
                      <input
                        name="graduationYear"
                        value={formData.graduationYear}
                        onChange={handleChange}
                        className="student-profile-input"
                      />
                    ) : (
                      profile.graduationYear || "Not specified"
                    )}
                  </span>
                </div>

                <div className="student-info-item">
                  <span className="student-info-label">Degree</span>
                  <span className="student-info-value">
                    {isEditing ? (
                      <input
                        name="degree"
                        value={formData.degree}
                        onChange={handleChange}
                        className="student-profile-input"
                      />
                    ) : (
                      profile.degree || "Not specified"
                    )}
                  </span>
                </div>

                <div className="student-info-item">
                  <span className="student-info-label">Branch</span>
                  <span className="student-info-value">
                    {isEditing ? (
                      <input
                        name="branch"
                        value={formData.branch}
                        onChange={handleChange}
                        className="student-profile-input"
                      />
                    ) : (
                      profile.branch || "Not specified"
                    )}
                  </span>
                </div>

                <div className="student-info-item">
                  <span className="student-info-label">Current Company</span>
                  <span className="student-info-value">
                    {isEditing ? (
                      <input
                        name="currentCompany"
                        value={formData.currentCompany}
                        onChange={handleChange}
                        className="student-profile-input"
                      />
                    ) : (
                      profile.currentCompany || "Not specified"
                    )}
                  </span>
                </div>

                <div className="student-info-item">
                  <span className="student-info-label">Position</span>
                  <span className="student-info-value">
                    {isEditing ? (
                      <input
                        name="position"
                        value={formData.position}
                        onChange={handleChange}
                        className="student-profile-input"
                      />
                    ) : (
                      profile.position || "Not specified"
                    )}
                  </span>
                </div>
              </div>
            </div>

            {/* About Section - Full Width */}
            <div className="student-info-section student-info-full">
              <div className="student-section-header">
                <svg className="section-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3>About</h3>
              </div>
              <div className="student-info-item student-info-item-full">
                <span className="student-info-value">
                  {isEditing ? (
                    <textarea
                      name="about"
                      value={formData.about}
                      onChange={handleChange}
                      rows="4"
                      className="student-profile-textarea"
                      placeholder="Tell us about yourself, your journey, achievements..."
                    />
                  ) : (
                    profile.about || "No information provided"
                  )}
                </span>
              </div>
            </div>

            {/* Save/Cancel Buttons */}
            {isEditing && (
              <div className="student-profile-actions">
                <button className="save-btn" onClick={handleSave}>
                  <svg className="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Save Changes
                </button>
                <button className="cancel-btn" onClick={handleCancel}>
                  <svg className="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentProfile;