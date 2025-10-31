// services/AlumniProfileService.js
import api from "../config/api";

// Get logged-in alumni's profile
export const getProfile = async () => {
  try {
    console.log("🔄 AlumniProfileService: Fetching alumni profile...");
    const res = await api.get("/alumni/profile");
    console.log("✅ AlumniProfileService: Alumni profile fetched successfully", res.data);
    return res.data;
  } catch (error) {
    console.error("❌ AlumniProfileService: Error fetching alumni profile", error);
    throw error;
  }
};

// TEMPORARY: Update alumni profile (Frontend simulation)
export const updateProfile = async (data) => {
  try {
    console.log("🔄 AlumniProfileService: Simulating profile update...", data);

    // Remove this temporary code when backend is ready
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log("✅ AlumniProfileService: Profile update simulated successfully");
    return { ...data, message: "Profile updated successfully (Frontend simulation)" };

    // TODO: Replace with actual backend call when endpoint is available
    // Example: const res = await api.put("/alumni/update-profile", data);
    // return res.data;

  } catch (error) {
    console.error("❌ AlumniProfileService: Error updating alumni profile", error);
    throw error;
  }
};

// Get alumni's posted jobs
export const getJobs = async () => {
  try {
    console.log("🔄 AlumniProfileService: Fetching alumni jobs...");
    const res = await api.get("/alumni/jobs");
    console.log("✅ AlumniProfileService: Alumni jobs fetched successfully", res.data);
    return res.data;
  } catch (error) {
    console.error("❌ AlumniProfileService: Error fetching alumni jobs", error);
    throw error;
  }
};

// ✅ ADDED: Post a new job (Temporary frontend simulation)
export const postJob = async (data) => {
  try {
    console.log("🔄 AlumniProfileService: Simulating job posting...", data);

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Create simulated job object
    const simulatedJob = {
      id: Date.now(),
      title: data.title,
      company: data.company,
      location: data.location,
      description: data.description,
      link: data.link,
      image: data.image ? URL.createObjectURL(data.image) : null,
      createdAt: new Date().toISOString(),
      postedBy: "Current Alumni",
      message: "Job posted successfully (Frontend simulation)"
    };

    console.log("✅ AlumniProfileService: Job posting simulated successfully");
    return simulatedJob;

  } catch (error) {
    console.error("❌ AlumniProfileService: Error in simulated job posting", error);
    throw error;
  }
};

export default { getProfile, updateProfile, getJobs, postJob }; // ✅ Added postJob to exports