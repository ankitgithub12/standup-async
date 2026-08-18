import { useState, useEffect } from "react";
import useCountUp from "../hooks/useCountUp";

// DECISION: Reading VITE_API_URL from env at module level so it's resolved
// once at build time. If the env var is missing, API calls will use a
// relative URL (works if client and server share a domain, fails otherwise —
// but that's the deployer's responsibility to configure).
const API_URL =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.DEV ? "http://localhost:5000" : "");

const EMAIL_REGEX =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;

const INVALID_TLD_TYPOS = [".cm", ".con", ".cmo", ".coom", ".comm", ".ocm"];

const COMMON_DOMAIN_TYPOS = {
  "gmai.com": "gmail.com",
  "gamil.com": "gmail.com",
  "gmial.com": "gmail.com",
  "yaho.com": "yahoo.com",
  "outlok.com": "outlook.com",
  "hotmial.com": "hotmail.com",
};

function validateEmail(email) {
  if (!email || typeof email !== "string") {
    return { valid: false, error: "A valid email is required" };
  }

  const trimmed = email.trim().toLowerCase();

  if (trimmed.length > 254 || trimmed.length < 5) {
    return { valid: false, error: "Email must be between 5 and 254 characters" };
  }

  if (!EMAIL_REGEX.test(trimmed)) {
    return { valid: false, error: "Please enter a valid email address" };
  }

  const [localPart, domain] = trimmed.split("@");
  if (!localPart || !domain) {
    return { valid: false, error: "Please enter a valid email address" };
  }

  if (
    localPart.includes("..") ||
    localPart.startsWith(".") ||
    localPart.endsWith(".")
  ) {
    return { valid: false, error: "Invalid email format" };
  }

  const domainParts = domain.split(".");
  const tld = domainParts[domainParts.length - 1];

  if (!/^[a-zA-Z]{2,24}$/.test(tld)) {
    return { valid: false, error: "Invalid domain extension" };
  }

  const lastDotExt = "." + tld;
  if (INVALID_TLD_TYPOS.includes(lastDotExt)) {
    return {
      valid: false,
      error: `Did you mean .com? Please check "${lastDotExt}" in your email`,
    };
  }

  if (COMMON_DOMAIN_TYPOS[domain]) {
    return {
      valid: false,
      error: `Did you mean @${COMMON_DOMAIN_TYPOS[domain]}?`,
    };
  }

  return { valid: true, email: trimmed };
}

function WaitlistForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle"); // idle | submitting | success | already | error
  const [message, setMessage] = useState("");
  const [count, setCount] = useState(0);

  // Fetch live signup count on mount — no hardcoded numbers
  useEffect(() => {
    fetch(`${API_URL}/api/waitlist/count`)
      .then((res) => res.json())
      .then((data) => setCount(data.count))
      .catch(() => {
        // DECISION: Silently failing on count fetch — the count display just
        // stays at 0 and animates to 0, which is visually invisible. No need
        // to show an error for a non-critical stat.
      });
  }, []);

  // Animated count display, triggered when section scrolls into view
  const { ref: countRef, display: animatedCount } = useCountUp(count);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validation = validateEmail(email);
    if (!validation.valid) {
      setStatus("error");
      setMessage(validation.error);
      return;
    }

    setStatus("submitting");

    try {
      const res = await fetch(`${API_URL}/api/waitlist`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: validation.email }),
      });

      const data = await res.json();

      if (res.status === 201) {
        setStatus("success");
        setMessage(data.message);
        setCount((prev) => prev + 1);
        setEmail("");
      } else if (res.status === 200) {
        // Duplicate email — not an error, just a note
        setStatus("already");
        setMessage(data.message);
      } else {
        setStatus("error");
        setMessage(data.error || "Something went wrong");
      }
    } catch {
      setStatus("error");
      setMessage("Can't reach the server — try again in a minute");
    }
  };

  return (
    <section id="waitlist" className="py-16 md:py-24">
      <div className="section-container max-w-xl mx-auto text-center">
        <h2
          className="font-display text-3xl md:text-4xl font-bold mb-3"
          style={{ color: "var(--color-text-primary)" }}
        >
          Get in early.
        </h2>
        <p
          className="text-base md:text-lg mb-8"
          style={{ color: "var(--color-text-secondary)" }}
        >
          Drop your email. We'll let you know when it's ready.
        </p>

        {/* Email form */}
        <form
          onSubmit={handleSubmit}
          className="flex flex-col sm:flex-row gap-3 mb-6"
        >
          <input
            type="email"
            required
            placeholder="you@company.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={status === "submitting"}
            className="flex-1 px-4 py-3 rounded-lg border text-base outline-none transition-colors"
            style={{
              backgroundColor: "var(--color-bg-raised)",
              borderColor: "var(--color-border)",
              color: "var(--color-text-primary)",
            }}
            onFocus={(e) =>
              (e.target.style.borderColor = "var(--color-accent)")
            }
            onBlur={(e) =>
              (e.target.style.borderColor = "var(--color-border)")
            }
          />
          <button
            type="submit"
            disabled={status === "submitting"}
            className="px-6 py-3 rounded-lg text-base font-medium text-white cursor-pointer border-none transition-opacity disabled:opacity-60 disabled:cursor-not-allowed"
            style={{ backgroundColor: "var(--color-accent)" }}
          >
            {status === "submitting" ? "Joining…" : "Join waitlist"}
          </button>
        </form>

        {/* Feedback message */}
        {message && (
          <p
            className="text-sm mb-4"
            style={{
              color:
                status === "error"
                  ? "#dc2626"
                  : "var(--color-text-secondary)",
            }}
          >
            {message}
          </p>
        )}

        {/* Live signup count — animated on scroll */}
        <p
          ref={countRef}
          className="text-sm"
          style={{ color: "var(--color-text-tertiary)" }}
        >
          <span
            className="font-semibold text-base"
            style={{ color: "var(--color-text-primary)" }}
          >
            {animatedCount}
          </span>{" "}
          {animatedCount === 1 ? "person has" : "people have"} joined so far
        </p>
      </div>
    </section>
  );
}

export default WaitlistForm;
