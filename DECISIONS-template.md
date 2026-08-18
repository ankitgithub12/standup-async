# Decisions Write-Up

## 1. Ingestion strategy

N/A — this is the Part 2 / home page track.

---

## 2. One trade-off made under the time limit

**Trade-off: In-memory React state for Kanban prototyping instead of full persistent drag-and-drop backend storage.**

* **Context & Decision:** For the interactive Kanban board demonstration in `ProductBoard.jsx`, I chose `@dnd-kit/core` with `useDraggable` and `useDroppable` paired with React component state (`INITIAL_CARDS`) rather than implementing a full persistence layer with MongoDB card schemas, REST endpoints for column reordering, and optimistic UI synchronization.
* **Why this trade-off was made:** 
  1. The primary objective of the landing page is communicating the product's uncompromising value proposition (the 60-second cap constraint) and capturing waitlist demand.
  2. Implementing a full task persistence layer within the assessment's time limit would have introduced unnecessary state management abstractions and boilerplate without adding tangible user value to the landing page pitch.
  3. By keeping the Kanban state local and using core `@dnd-kit` primitives, the codebase remains lean, accessible, highly responsive on mobile (390px) and desktop (1440px), and easily explainable line-by-line in a technical interview.

---

## 3. Where AI was used, and what I personally verified or changed

### A. Where AI was used:
1. **Initial File Scaffolding & Component Skeleton:** Generating initial boilerplate for component layout structure (`Hero.jsx`, `ProductBoard.jsx`, `HonestySection.jsx`, `WaitlistForm.jsx`, `DarkModeToggle.jsx`, `Footer.jsx`).
2. **Animation Physics Configuration:** Tuning initial damping and stiffness values for Framer Motion spring physics in `useCountUp.js` and `Hero.jsx` CTA hover states.
3. **Easter Egg Pattern Implementation:** Crafting the keycode sequence listener array and DOM burst effect in `useKonamiCode.js`.

### B. What was personally verified, debugged, and changed:
1. **Tailwind CSS Build Pipeline (`postcss.config.js`):** 
   - *Issue:* Initially, Tailwind v3 utility classes were not rendering in Vite due to missing PostCSS config.
   - *Fix:* Added `postcss.config.js` with `tailwindcss` and `autoprefixer` plugins, ensuring CSS bundle properly compiled from `1.07 kB` to `10.80 kB` with full utility coverage.
2. **Database Fail-Fast Architecture & Error Handling (`server.js` & `routes/waitlist.js`):**
   - *Verification:* Ensured the Express server strictly initializes only *after* MongoDB Atlas successfully connects, avoiding silent request hanging.
   - *Duplicate Handling:* Verified that Mongoose unique index violation (`err.code === 11000`) returns HTTP 200 with `{ message: "You've already joined" }` rather than an ugly 500 or 409 conflict, providing a frictionless user experience.
3. **Touch & Click Collision Tuning in `@dnd-kit`:**
   - *Change:* Implemented a `PointerSensor` constraint of `distance: 5` to prevent accidental card drags during standard mobile tap/touch gestures.
4. **Theme Integrity & Responsive Constraints:**
   - *Verification:* Tested both light (`#faf9f7`) and dark (`#111110`) themes across all components via CSS variables, ensuring no contrast loss and confirming zero horizontal scroll at 390px mobile viewport.
