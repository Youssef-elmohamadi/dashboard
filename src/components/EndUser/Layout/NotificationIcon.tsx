import { MdNotifications } from "react-icons/md";
import NotificationDropdown from "./Dropdown";

interface NotificationIconProps {
  openNotification: boolean;
  toggleNotification: (event: React.MouseEvent) => void;
  onCloseNotification: () => void;
  notificationIconRef: React.RefObject<HTMLDivElement | null>;
}

export const NotificationIcon: React.FC<NotificationIconProps> = ({
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
          <NotificationDropdown
            open={openNotification}
            onClose={onCloseNotification}
            notificationIconRef={notificationIconRef}
          />
        </div>
      )}
    </div>
  );
};
