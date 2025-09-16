import { createContext, useState, useEffect, ReactNode } from "react";
import { getSuperAdminProfile } from "../../../api/SuperAdminApi/profileApi/_request";
import { handleLogout } from "../../common/Auth/Logout";
import { useNavigate } from "react-router-dom";
import { useDirectionAndLanguage } from "../../../context/DirectionContext";
import i18n from "../../../i18n"; // تأكد من المسار

interface SuperAdminContextType {
  isAuthenticated: boolean;
  setIsAuthenticated: (value: boolean) => void;
}

export const SuperAdminContext = createContext<SuperAdminContextType>({
  isAuthenticated: false,
  setIsAuthenticated: () => {},
});

interface SuperAdminProviderProps {
  children: ReactNode;
}

export const SuperAdminProvider = ({ children }: SuperAdminProviderProps) => {
  const navigate = useNavigate();
  const { lang } = useDirectionAndLanguage();

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const fetchAndLoad = async () => {
      try {
        await getSuperAdminProfile();
        setIsAuthenticated(true);
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
        console.error("Failed to fetch super admin profile", error);
        if (error.response?.status === 401) {
          handleLogout("super_admin", navigate, lang);
        }
      }
    };

    fetchAndLoad();
  }, [lang, navigate]);

  if (!isReady) return null; // أو Spinner أثناء التحميل

  return (
    <SuperAdminContext.Provider value={{ isAuthenticated, setIsAuthenticated }}>
      {children}
    </SuperAdminContext.Provider>
  );
};
