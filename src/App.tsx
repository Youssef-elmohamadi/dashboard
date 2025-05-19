import { BrowserRouter as Router } from "react-router-dom";
import { ScrollToTop } from "./components/common/ScrollToTop";
import DirectionAndLanguageProvider from "./context/DirectionContext";
import AppRoutes from "./Routes/AppRoutes";
import { HelmetProvider } from "react-helmet-async";
import "./i18n";

export default function App() {
  return (
    <Router>
      <HelmetProvider>
        <DirectionAndLanguageProvider>
          <ScrollToTop />
          <AppRoutes />
        </DirectionAndLanguageProvider>
      </HelmetProvider>
    </Router>
  );
}
