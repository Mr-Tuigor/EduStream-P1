import { useContext, createContext, useState, useEffect } from "react";
import axios from "axios";



const AuthContext = createContext(); 
// 2. Create a custom hook to export instead
export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Check if user is already logged in (Persist across refreshes)
  useEffect(() => {
    // FIREBASE_REPLACE: Firebase uses 'onAuthStateChanged' listener here.
    // You won't need to manually check localStorage.
    const storedUser = localStorage.getItem("userInfo");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);



  // Login Function
  const login = async (email, password) => {
    try {
      // FIREBASE_REPLACE: 
      // const userCredential = await signInWithEmailAndPassword(auth, email, password);
      // const user = userCredential.user;
      const { data } = await axios.post("http://localhost:3000/api/auth/login", {
        email,
        password,
        },
        { withCredentials: true }
      );

      setUser(data);
      // Save basic user info to localStorage (Token is safely in the HTTP-Only Cookie)
      localStorage.setItem("userInfo", JSON.stringify(data));
      return { success: true };
    } catch (error) {
      console.error("Login failed:", error);
      return { success: false, message: error.response?.data?.message || "Login failed" };
    }
  };

  // Logout Function
  const logout = async () => {
    try {
      // FIREBASE_REPLACE: await signOut(auth);
      await axios.get("http://localhost:3000/api/auth/logout");
      localStorage.removeItem("userInfo");
      setUser(null);
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  // Update Profile Function
  const updateProfile = async (updatedData) => {
    try {
      const { data } = await axios.put(
        "http://localhost:3000/api/auth/profile", 
        updatedData,
        { withCredentials: true } // Need cookie to verify identity!
      );

      // 1. Update the State
      setUser(data);
      
      // 2. Update LocalStorage (so it persists on refresh)
      localStorage.setItem("userInfo", JSON.stringify(data));
      
      return { success: true };
    } catch (error) {
      console.error("Update failed:", error);
      return { success: false, message: error.response?.data?.message || "Update failed" };
    }
  };

  

  return (
    <AuthContext.Provider value={{ user, login, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};