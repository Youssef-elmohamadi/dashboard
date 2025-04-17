import React, { createContext, useState, ReactNode, useEffect } from "react";
import { showUser } from "../api/profileApi/_requests";
import { handleLogout } from "../components/admin/auth/Logout";

// Define the shape of the context
interface UserContextType {
  userId: number | null;
  setUserId: (id: number) => void;
}

// Create context with default value
export const UserContext = createContext<UserContextType>({
  userId: null,
  setUserId: () => {},
});

interface UserProviderProps {
  children: ReactNode;
}

export const AdminProvider = ({ children }: UserProviderProps) => {
  useEffect(() => {
    const storedUserId = localStorage.getItem("userId"); // Make sure 'userId' is a string key in localStorage
    if (storedUserId) {
      const fetchData = async (id: number) => {
        try {
          const res = await showUser(id);
          const role = res.data.data.roles[0].name;
          localStorage.setItem("aRole", role);
        } catch (error: any) {
          console.log("Failed to get data", error);
          if (error.response && error.response.status === 401) {
            handleLogout();
          }
          console.log(error);
        }
      };
      fetchData(Number(storedUserId)); // Make sure it's converted to a number if needed
    }
  }, []);
  const [userId, setUserId] = useState<number | null>(null);

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");

    console.log("Stored userId from localStorage:", storedUserId); // Debugging

    if (storedUserId) {
      setUserId(Number(storedUserId)); // تحويل القيمة إلى رقم
    } else {
      console.log("No userId found in localStorage.");
    }
  }, []);

  return (
    <UserContext.Provider value={{ userId, setUserId }}>
      {children}
    </UserContext.Provider>
  );
};
