const useCheckOnline = () => {
  const isOnline = () => navigator.onLine;
  return isOnline;
};

export default useCheckOnline;
