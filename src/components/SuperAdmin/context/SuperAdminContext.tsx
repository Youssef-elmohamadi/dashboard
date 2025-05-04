import React, { createContext, useState, ReactNode, useEffect } from "react";
import { showUser } from "../../../api/AdminApi/profileApi/_requests";
import { handleLogout } from "../../admin/auth/Logout";

interface UserContextType {
  userId: number | null;
  setUserId: (id: number) => void;
}

export const UserContext = createContext<UserContextType>({
  userId: null,
  setUserId: () => {},
});

interface UserProviderProps {
  children: ReactNode;
}

export const SuperAdminProvider = ({ children }: UserProviderProps) => {
  useEffect(() => {
    const storedSuperAdminId = localStorage.getItem("sId");
    console.log(storedSuperAdminId);

    if (storedSuperAdminId) {
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
      fetchData(Number(storedSuperAdminId));
    }
  }, []);
  const [userId, setUserId] = useState<number | null>(null);

  useEffect(() => {
    const storedSuperAdminId = localStorage.getItem("sId");

    console.log("Stored userId from localStorage:", storedSuperAdminId);

    if (storedSuperAdminId) {
      setUserId(Number(storedSuperAdminId));
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
