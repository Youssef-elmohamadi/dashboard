import React, { Suspense, lazy, useRef } from "react"; // استيراد Suspense و lazy
import { MdNotifications } from "react-icons/md";

interface NotificationIconProps {
  openNotification: boolean;
  toggleNotification: (event: React.MouseEvent) => void;
  onCloseNotification: () => void;
  notificationIconRef: React.RefObject<HTMLDivElement | null>;
}

const LazyNotificationDropdown = lazy(() => import("./Dropdown")); // تأكد من المسار الصحيح لـ NotificationDropdown

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
        <MdNotifications className="text-2xl text-secondary" />
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
