import { Circles } from "react-loader-spinner";

const LoadingPageEndUser = () => {
  return (
    <div className="flex items-center justify-center h-screen">
      <Circles height="80" width="80" color="#d62828" ariaLabel="loading" />
    </div>
  );
};

export default LoadingPageEndUser;
