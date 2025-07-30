import { createContext, useState, ReactNode, useEffect } from "react";
import { getAdminUser } from "../../../api/AdminApi/profileApi/_requests";
import { handleLogout } from "../../../components/common/Auth/Logout";
import { useNavigate } from "react-router-dom";
import { useDirectionAndLanguage } from "../../../context/DirectionContext";
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

export const AdminProvider = ({ children }: UserProviderProps) => {
  const navigate = useNavigate();
  const { lang } = useDirectionAndLanguage();
  useEffect(() => {
    const storedAdminId = localStorage.getItem("admin_id");
    console.log("Stored Admin ID:", storedAdminId);

    if (storedAdminId) {
      const fetchData = async (id: number) => {
        try {
          await getAdminUser(id);
        } catch (error: any) {
          console.error("Failed to get data", error);
          if (error.response && error.response.status === 401) {
            handleLogout("admin", navigate, lang);
          }
        }
      };
      fetchData(Number(storedAdminId));
    }
  }, []);
  const [userId, setUserId] = useState<number | null>(null);

  useEffect(() => {
    const storedAdminId = localStorage.getItem("admin_id");
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
