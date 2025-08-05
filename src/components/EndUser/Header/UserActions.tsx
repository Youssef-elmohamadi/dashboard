import React, { RefObject, Suspense, lazy } from "react";
import { Separator } from "../../EndUser/Common/Separator"; // Adjust path if necessary
import { FavoriteProductsIcon } from "./FavoriteProductsIcon"; // Adjust path if necessary
// Lazy Loaded Components
const LazyUserAccountDropdown = lazy(() => import("./UserAccountDropdown"));
const LazyNotificationIcon = lazy(() => import("./NotificationIcon"));

interface UserActionsProps {
  user: any; // Define a more specific type for user if available
  isLoading: boolean;
  isError: boolean;
  handleUserLogout: () => void;
  dir: string;
  lang: string;
  altTexts: {
    avatar: { ar: string; en: string };
  };
  openNotification: boolean;
  toggleNotification: (event: React.MouseEvent) => void;
  onCloseNotification: () => void;
  notificationIconRef: RefObject<HTMLDivElement | null>;
  favoriteCount: number | undefined;
}

const UserActions: React.FC<UserActionsProps> = ({
  user,
  isLoading,
  isError,
  handleUserLogout,
  dir,
  lang,
  altTexts,
  openNotification,
  toggleNotification,
  onCloseNotification,
  notificationIconRef,
  favoriteCount,
}) => {
  return (
    <>
      <div className="flex items-center gap-2">
        <Suspense fallback={null}>
          <LazyUserAccountDropdown
            user={user}
            isLoading={isLoading}
            isError={isError}
            handleUserLogout={handleUserLogout}
            dir={dir}
            lang={lang}
            altTexts={altTexts}
          />
        </Suspense>
        <Separator />
      </div>
      <div className="flex gap-4">
        <Suspense fallback={null}>
          <LazyNotificationIcon
            openNotification={openNotification}
            toggleNotification={toggleNotification}
            onCloseNotification={onCloseNotification}
            notificationIconRef={notificationIconRef}
          />
        </Suspense>
        <FavoriteProductsIcon favoriteCount={favoriteCount} lang={lang} />
        {/* <div className="flex items-center gap-2">
          <NavLink to={`/${lang}/u-compare`} aria-label="Compare Products">
            <MdOutlineCompareArrows className="text-2xl text-secondary" />
          </NavLink>
        </div> */}
      </div>
    </>
  );
};

export default React.memo(UserActions);
