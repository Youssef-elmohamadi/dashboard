import React, { createContext, useState, ReactNode, useEffect } from "react";
import { showUser } from "../../../api/AdminApi/profileApi/_requests";
import { handleLogout } from "../../common/Auth/Logout";

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
  const [userId, setUserId] = useState<number | null>(null);

  useEffect(() => {
    const storedSuperAdminId = localStorage.getItem("super_admin_token");

    if (storedSuperAdminId) {
      setUserId(Number(storedSuperAdminId));
    }
  }, []);

  return (
    <UserContext.Provider value={{ userId, setUserId }}>
      {children}
    </UserContext.Provider>
  );
};
