import { BrowserRouter as Router } from "react-router-dom";
import { ScrollToTop } from "./components/common/ScrollToTop";
import DirectionAndLanguageProvider from "./context/DirectionContext";
import AppRoutes from "./Routes/AppRoutes";
import "./i18n";
export default function App() {
  return (
    <Router>
      <DirectionAndLanguageProvider>
        <ScrollToTop />
        <AppRoutes />
      </DirectionAndLanguageProvider>
    </Router>
  );
}
