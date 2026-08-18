// DECISION: This section exists specifically to avoid the credibility trap
// most landing pages fall into — fabricated testimonials, fake logos, inflated
// user counts. Being upfront about being new is more credible than faking it.

function HonestySection() {
  return (
    <section className="py-16 md:py-24">
      <div className="section-container">
        <div
          className="rounded-xl border px-6 py-8 md:px-10 md:py-10 max-w-2xl mx-auto text-center"
          style={{
            borderColor: "var(--color-border)",
            backgroundColor: "var(--color-bg-raised)",
          }}
        >
          {/* Emoji as a visual anchor — no icon library needed for one glyph */}
          <p className="text-2xl mb-4" aria-hidden="true">
            🧱
          </p>

          <h2
            className="font-display text-2xl md:text-3xl font-bold mb-3"
            style={{ color: "var(--color-text-primary)" }}
          >
            No testimonials yet.
          </h2>

          <p
            className="text-base md:text-lg leading-relaxed"
            style={{ color: "var(--color-text-secondary)" }}
          >
            We shipped this over a weekend. Real users, real feedback,
            and real logos will go here once we've earned them —
            not before.
          </p>
        </div>
      </div>
    </section>
  );
}

export default HonestySection;
