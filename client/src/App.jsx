import { useState } from "react";
import Hero from "./components/Hero";
import ProductBoard from "./components/ProductBoard";
import HonestySection from "./components/HonestySection";
import WaitlistForm from "./components/WaitlistForm";
import DarkModeToggle from "./components/DarkModeToggle";
import useKonamiCode from "./hooks/useKonamiCode";
import Footer from "./components/Footer";

// DECISION: Dark mode state lives here in App, not in a context or store.
// There's only one consumer of the toggle (DarkModeToggle) and every section
// reads theme via CSS custom properties on <html>, so prop-drilling one level
// is simpler than context for this scale.

function App() {
  const [isDark, setIsDark] = useState(false);
  useKonamiCode();

  const toggleDark = () => {
    setIsDark((prev) => {
      const next = !prev;
      document.documentElement.classList.toggle("dark", next);
      return next;
    });
  };

  return (
    <div className="min-h-screen">
      <DarkModeToggle isDark={isDark} onToggle={toggleDark} />
      <Hero />
      <ProductBoard />
      <HonestySection />
      <WaitlistForm />
      <Footer />
    </div>
  );
}

export default App;
