import { BrowserRouter as Router } from "react-router-dom";
import { Suspense, lazy } from "react";
import DirectionAndLanguageProvider from "./context/DirectionContext";
import "./i18n";

const AppRoutes = lazy(() => import("./Routes/AppRoutes"));

export default function App() {
  return (
    <Router>
      <DirectionAndLanguageProvider>
          <Suspense fallback={null}>
            <AppRoutes />
          </Suspense>
      </DirectionAndLanguageProvider>
    </Router>
  );
}
