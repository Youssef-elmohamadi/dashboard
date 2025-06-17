import React, { useEffect } from "react";
import { useNavigate } from "react-router";

const UserNotifications = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("end_user_token");
    if (!token) {
      navigate("/signin", { replace: true });
    }
  }, []);
  return <div>UserNotifications</div>;
};

export default UserNotifications;
