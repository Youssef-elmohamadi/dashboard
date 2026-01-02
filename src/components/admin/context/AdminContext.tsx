import { createContext, useState, ReactNode, useEffect } from "react";
import { getAdminUser } from "../../../api/AdminApi/profileApi/_requests";
import { handleLogout } from "../../common/Auth/Logout";
import { useNavigate } from "react-router-dom";
import { useDirectionAndLanguage } from "../../../context/DirectionContext";
import i18n from "../../../i18n";

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

  const [userId, setUserId] = useState<number | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const storedAdminId = localStorage.getItem("admin_id");
    if (!storedAdminId) {
      handleLogout("admin", navigate, lang);
      return;
    }

    const id = Number(storedAdminId);
    setUserId(id);

    const fetchDataAndLoadTranslations = async () => {
      try {
        await getAdminUser(id);

        const namespaces = [
          "Status",
          "AdminsTablesActions",
          "OrderDetails",
          "DateFilter",
          "TopSellingTable",
        ];

        await i18n.loadNamespaces(namespaces);
        setIsReady(true);
      } catch (error: any) {
        console.error("Failed to get data", error);
        if (error.response?.status === 401) {
          handleLogout("admin", navigate, lang);
        }
      }
    };

    fetchDataAndLoadTranslations();
  }, [lang, navigate]);

  if (!isReady) return null;

  return (
    <UserContext.Provider value={{ userId, setUserId }}>
      {children}
    </UserContext.Provider>
  );
};
