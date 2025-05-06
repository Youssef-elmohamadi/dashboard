import React, { createContext, useState, ReactNode, useEffect } from "react";
import { getProfile } from "../../../api/EndUserApi/endUserAuth/_requests";
import { handleLogout } from "../../../components/EndUser/Auth/Logout";

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

export const EndUserProvider = ({ children }: UserProviderProps) => {
  useEffect(() => {
    const token = localStorage.getItem("uToken");
    if (token) {
      const fetchData = async () => {
        try {
          const res = await getProfile();
        } catch (error: any) {
          console.log("Failed to get data", error);
          if (error.response && error.response.status === 401) {
            handleLogout();
          }
          console.log(error);
        }
      };
      fetchData();
    }
  }, []);
  const [userId, setUserId] = useState<number | null>(null);

  useEffect(() => {
    const storedAdminId = localStorage.getItem("uId");

    console.log("Stored userId from localStorage:", storedAdminId); // Debugging

    if (storedAdminId) {
      setUserId(Number(storedAdminId));
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
