import { useEffect } from "react";
import { useLocation, useNavigationType } from "react-router-dom";

const waitForDOMStable = (callback: () => void, checkInterval = 50) => {
  let lastHeight = document.body.scrollHeight;
  let stableCount = 0;
  const maxStable = 3;

  const check = () => {
    const newHeight = document.body.scrollHeight;
    if (newHeight === lastHeight) {
      stableCount++;
      if (stableCount >= maxStable) {
        callback();
        return;
      }
    } else {
      stableCount = 0;
      lastHeight = newHeight;
    }
    setTimeout(check, checkInterval);
  };

  check();
};

function ScrollRestoration() {
  const { pathname } = useLocation();
  const navigationType = useNavigationType();

  useEffect(() => {
    // نحفظ موضع السحب الحالي في الـ sessionStorage
    const handleScroll = () => {
      sessionStorage.setItem(`scroll-${pathname}`, window.scrollY.toString());
    };

    window.addEventListener("scroll", handleScroll);

    // عند التنقل:
    const savedY = sessionStorage.getItem(`scroll-${pathname}`);

    if (navigationType === "POP" && savedY) {
      // عند الرجوع أو التقدم للخلف
      waitForDOMStable(() => {
        window.scrollTo({
          top: Number(savedY),
          behavior: "smooth",
        });
      });
    } else {
      // عند الدخول لصفحة جديدة من رابط أو كليك
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: "auto",
      });
    }

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [pathname, navigationType]);

  return null;
}

export default ScrollRestoration;
