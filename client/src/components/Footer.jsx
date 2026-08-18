// DECISION: Minimal footer — project name + year only. No sitemap links,
// no social icons, no "built with" badges. A landing page for an unreleased
// product doesn't need footer navigation.

function Footer() {
  return (
    <footer className="py-10 text-center">
      <div className="section-container">
        <p
          className="text-sm"
          style={{ color: "var(--color-text-tertiary)" }}
        >
          Standup © {new Date().getFullYear()}
        </p>
      </div>
    </footer>
  );
}

export default Footer;
