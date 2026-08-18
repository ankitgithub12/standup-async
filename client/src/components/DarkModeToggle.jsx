// DECISION: Using a simple sun/moon emoji toggle instead of an icon library.
// Adding react-icons or heroicons for two glyphs would bloat the bundle.
// The toggle is fixed to the top-right corner so it's always accessible
// without taking up layout space in the page flow.

function DarkModeToggle({ isDark, onToggle }) {
  return (
    <button
      onClick={onToggle}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className="fixed top-5 right-5 z-50 w-10 h-10 rounded-full border flex items-center justify-center cursor-pointer transition-colors duration-200"
      style={{
        backgroundColor: "var(--color-bg-raised)",
        borderColor: "var(--color-border)",
      }}
    >
      <span className="text-lg" aria-hidden="true">
        {isDark ? "☀️" : "🌙"}
      </span>
    </button>
  );
}

export default DarkModeToggle;
