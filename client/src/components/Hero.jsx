import { motion } from "framer-motion";

// DECISION: The micro-interaction (springy CTA hover) lives here because
// it's tied to the single CTA button. Using Framer Motion's whileHover
// with a spring transition — one line of config, easy to explain, and
// framer-motion is already a dependency for useCountUp.

function Hero() {
  const scrollToWaitlist = () => {
    const el = document.getElementById("waitlist");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative py-24 md:py-36">
      <div className="section-container">
        <div className="max-w-2xl">
          {/* Headline — states the constraint as the value prop */}
          <h1
            className="font-display text-5xl md:text-7xl font-bold leading-[1.1] tracking-tight"
            style={{ color: "var(--color-text-primary)" }}
          >
            Your standup gets{" "}
            <span style={{ color: "var(--color-accent)" }}>60 seconds.</span>
          </h1>

          {/* Subhead — terse, opinionated, no SaaS-speak */}
          <p
            className="mt-6 text-lg md:text-xl leading-relaxed max-w-lg"
            style={{ color: "var(--color-text-secondary)" }}
          >
            Not a meeting. Not a thread. Not a video call.
            Write what you shipped, what's next, and what's blocked
            — then get back to work.
          </p>

          {/* Single CTA — springy scale on hover, subtle press on tap */}
          <motion.button
            onClick={scrollToWaitlist}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
            className="mt-10 px-8 py-4 rounded-lg text-base font-medium text-white cursor-pointer border-none"
            style={{ backgroundColor: "var(--color-accent)" }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor =
                "var(--color-accent-hover)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor =
                "var(--color-accent)")
            }
          >
            Get early access
          </motion.button>
        </div>
      </div>
    </section>
  );
}

export default Hero;
