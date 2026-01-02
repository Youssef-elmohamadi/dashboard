import React, { Suspense, lazy } from "react";

// Lazy loaded MobileMenu (assuming it's a separate component)
const LazyMobileMenu = lazy(() => import("./MobileMenu"));

interface MobileMenuContainerProps {
  dir: string;
  isMenuOpen: boolean;
  closeMenu: () => void;
  uToken: string | null;
  handleLogout: () => void;
}

const MobileMenuContainer: React.FC<MobileMenuContainerProps> = ({
  dir,
  isMenuOpen,
  closeMenu,
  uToken,
  handleLogout,
}) => {
  return (
    <>
      {isMenuOpen && (
        <div
          onClick={closeMenu}
          className="fixed inset-0 bg-[rgba(0,0,0,0.6)] z-[999999] overflow-auto"
          aria-hidden="true" // For accessibility
        />
      )}

      <Suspense fallback={null}>
        <LazyMobileMenu
          dir={dir}
          isMenuOpen={isMenuOpen}
          closeMenu={closeMenu}
          uToken={uToken}
          handleLogout={handleLogout}
        />
      </Suspense>
    </>
  );
};

export default React.memo(MobileMenuContainer);
