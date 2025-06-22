import React, { createContext, useState, ReactNode, useEffect } from "react";
import { getProfile } from "../../../api/EndUserApi/endUserAuth/_requests";
import { handleLogout } from "../../common/Logout";
import { useNavigate } from "react-router-dom";
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
    const navigate = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem("end_user_token");
    if (token) {
      const fetchData = async () => {
        try {
          const res = await getProfile();
        } catch (error: any) {
          console.error("Failed to get data", error);
          if (error.response && error.response.status === 401) {
            handleLogout("end_user", navigate);
          }
          console.error(error);
        }
      };
      fetchData();
    }
  }, []);
  const [userId, setUserId] = useState<number | null>(null);

  useEffect(() => {
    const storedAdminId = localStorage.getItem("end_user_id");

    if (storedAdminId) {
      setUserId(Number(storedAdminId));
    }
  }, []);

  return (
    <UserContext.Provider value={{ userId, setUserId }}>
      {children}
    </UserContext.Provider>
  );
};
