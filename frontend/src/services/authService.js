import api from "../config/api";

// Register user
export const register = async (user) => {
  try {
    const response = await api.post("/auth/register", user);
    console.log("🔑 Register response:", response.data);
    return {
      message: response.data.message || "Registration successful",
    };
  } catch (error) {
    console.log("🚨 Register error:", error);
    throw error;
  }
};

// Login user
export const login = async (credentials) => {
  try {
    const response = await api.post("/auth/login", credentials);

    console.log("🔑 Full login response:", response);
    console.log("🔑 Login response data:", response.data);

    // Extract data from the response
    const token = response.data.token;
    const userId = response.data.userId; // ✅ NOW GET USER ID FROM BACKEND
    const role = response.data.role;
    const email = response.data.email;

    console.log("🔑 Extracted token:", token);
    console.log("🔑 Extracted userId:", userId);
    console.log("🔑 Extracted role:", role);

    if (token && userId) {
      // ✅ STORE ALL USER DATA IN LOCALSTORAGE
      localStorage.setItem("token", token);
      localStorage.setItem("userId", userId.toString());
      localStorage.setItem("userRole", role || "STUDENT");
      localStorage.setItem("userEmail", email || "");

      // ✅ ALSO STORE COMPLETE USER OBJECT FOR COMPATIBILITY
      localStorage.setItem("user", JSON.stringify({
        id: userId,
        email: email,
        role: role
      }));

      console.log("💾 All user data saved to localStorage:");
      console.log("   - Token:", localStorage.getItem("token") ? "YES" : "NO");
      console.log("   - User ID:", localStorage.getItem("userId"));
      console.log("   - User Role:", localStorage.getItem("userRole"));
      console.log("   - User Object:", localStorage.getItem("user"));
    } else {
      console.log("❌ Missing token or user ID in response!");
      if (!token) console.log("❌ Token missing");
      if (!userId) console.log("❌ User ID missing");
    }

    return {
      token,
      userId,
      role: role || "STUDENT",
      message: response.data.message || "Login successful",
    };
  } catch (error) {
    console.log("🚨 Login error:", error);
    throw error;
  }
};