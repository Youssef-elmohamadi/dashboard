import { useEffect, RefObject } from "react";

type Event = MouseEvent | TouchEvent;

const useClickOutside = <T extends HTMLElement = HTMLElement>(
  ref: RefObject<T | null>,
  handler: (event: Event) => void,
  isActive: boolean = true
) => {
  useEffect(() => {
    if (!isActive) return;

    const listener = (event: Event) => {
      if (
        !ref.current ||
        ref.current.contains(event.target as Node) ||
        (event.target as HTMLElement).closest(".cart")
      ) {
        return;
      }
      handler(event);
    };

    document.addEventListener("mousedown", listener);
    document.addEventListener("touchstart", listener);

    return () => {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchstart", listener);
    };
  }, [ref, handler, isActive]);
};

export default useClickOutside;
