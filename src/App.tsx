import { BrowserRouter as Router } from "react-router-dom";
import { Suspense, lazy } from "react";
import DirectionAndLanguageProvider from "./context/DirectionContext";
import { HelmetProvider } from "react-helmet-async";
import "./i18n";

// Lazy imports
const AppRoutes = lazy(() => import("./Routes/AppRoutes"));

export default function App() {
  return (
    <Router>
      <DirectionAndLanguageProvider>
        <HelmetProvider>
          <Suspense fallback={null}>
            <AppRoutes />
          </Suspense>
        </HelmetProvider>
      </DirectionAndLanguageProvider>
    </Router>
  );
}
