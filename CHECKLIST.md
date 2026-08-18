# Standup — Manual Verification Checklist

Before submitting, verify each item manually. Don't check it off unless you've actually done it.

---

- [ ] Tested at 390px and 1440px, no horizontal scroll
- [ ] Dark mode checked fully in both themes (every section, every component)
- [ ] Waitlist form tested end-to-end against deployed backend
- [ ] No fabricated testimonials/numbers/logos anywhere in copy
- [ ] Easter egg triggers correctly (↑ ↑ ↓ ↓ ← → ← → B A)
- [ ] Kanban drag-and-drop works across all three columns
- [ ] Count-up animation triggers on scroll into the waitlist section
- [ ] CTA button springy hover works
- [ ] Every file reviewed and understood, not just copy-pasted
- [ ] All `// DECISION` comments reviewed and understood
- [ ] `.env.example` files contain no real credentials
- [ ] Server starts only after MongoDB connects successfully
- [ ] Duplicate email returns 200 with friendly message, not an error
