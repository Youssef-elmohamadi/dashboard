import React, { Suspense, lazy } from "react"; // استيراد Suspense و lazy
import NotificationsIcon from "../../../icons/NotificationIcon";
interface NotificationIconProps {
  openNotification: boolean;
  toggleNotification: (event: React.MouseEvent) => void;
  onCloseNotification: () => void;
  notificationIconRef: React.RefObject<HTMLDivElement | null>;
}

const LazyNotificationDropdown = lazy(() => import("./Dropdown")); 

const NotificationIcon: React.FC<NotificationIconProps> = ({
  openNotification,
  toggleNotification,
  onCloseNotification,
  notificationIconRef,
}) => {
  return (
    <div className="relative">
      <div
        ref={notificationIconRef}
        onClick={toggleNotification}
        className="flex items-center gap-2 cursor-pointer"
      >
        <NotificationsIcon />
      </div>

      {openNotification && (
        <div className="absolute top-full right-0 z-50">
          <Suspense fallback={null}>
            <LazyNotificationDropdown
              open={openNotification}
              onClose={onCloseNotification}
              notificationIconRef={notificationIconRef}
            />
          </Suspense>
        </div>
      )}
    </div>
  );
};

export default NotificationIcon;
