# Standup — Manual Verification Checklist

All items verified and tested end-to-end.

---

- [x] Tested at 390px and 1440px, no horizontal scroll
- [x] Dark mode checked fully in both themes (every section, every component)
- [x] Waitlist form tested end-to-end against backend API (POST /api/waitlist + GET /api/waitlist/count)
- [x] No fabricated testimonials/numbers/logos anywhere in copy
- [x] Easter egg triggers correctly (↑ ↑ ↓ ↓ ← → ← → B A) with screen-shake and emoji burst
- [x] Kanban drag-and-drop works across all three columns (Today / Blocked / Done)
- [x] Count-up animation triggers on scroll into the waitlist section using Framer Motion `useSpring`
- [x] CTA button springy hover works as expected
- [x] Every file reviewed and understood, not just copy-pasted
- [x] All `// DECISION` comments reviewed and understood
- [x] `.env.example` files contain no real credentials
- [x] Server starts only after MongoDB connects successfully (fail-fast architecture)
- [x] Duplicate email returns 200 with friendly message, not an error (Mongoose code 11000 handling)
