import { useState } from "react";
import {
  DndContext,
  DragOverlay,
  useDraggable,
  useDroppable,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";

// DECISION: Using useDraggable + useDroppable (from @dnd-kit/core) instead
// of the full @dnd-kit/sortable API. We only need cross-column dragging for
// this mock, not within-column reordering. Fewer concepts = easier to explain.

// -- Mock data: realistic engineering standup entries, not Lorem Ipsum --------

const INITIAL_CARDS = {
  today: [
    {
      id: "card-1",
      text: "Migrate auth middleware to edge runtime — drop the Node crypto dep",
      author: "Priya",
      time: "9m ago",
    },
    {
      id: "card-2",
      text: "Review PR #284: pagination cursor refactor",
      author: "Marcus",
      time: "14m ago",
    },
    {
      id: "card-3",
      text: "Write integration tests for the Stripe webhook handler",
      author: "Sam",
      time: "22m ago",
    },
  ],
  blocked: [
    {
      id: "card-4",
      text: "Waiting on DevOps to provision staging Redis instance",
      author: "Priya",
      time: "1h ago",
    },
    {
      id: "card-5",
      text: "Design hasn't finalized the empty-state illustrations",
      author: "Jordan",
      time: "2h ago",
    },
  ],
  done: [
    {
      id: "card-6",
      text: "Shipped rate limiter on /api/upload — 100 req/min per user",
      author: "Marcus",
      time: "3h ago",
    },
    {
      id: "card-7",
      text: "Fixed Safari flexbox bug in the dashboard grid layout",
      author: "Sam",
      time: "5h ago",
    },
    {
      id: "card-8",
      text: "Updated Sentry to v8, removed deprecated breadcrumb config",
      author: "Jordan",
      time: "6h ago",
    },
  ],
};

const COLUMNS = [
  { id: "today", title: "Today", dot: "var(--color-accent)" },
  { id: "blocked", title: "Blocked", dot: "#d97706" },
  { id: "done", title: "Done", dot: "#16a34a" },
];

// -- Draggable card component ------------------------------------------------

function Card({ id, text, author, time, isDragOverlay }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({ id });

  const style = {
    // DECISION: Using raw transform instead of CSS.Transform.toString() from
    // @dnd-kit/utilities to avoid importing another module for one line of code.
    transform: transform
      ? `translate(${transform.x}px, ${transform.y}px)`
      : undefined,
    opacity: isDragging ? 0.4 : 1,
    backgroundColor: "var(--color-bg-raised)",
    borderColor: "var(--color-border)",
    cursor: isDragOverlay ? "grabbing" : "grab",
  };

  return (
    <div
      ref={isDragOverlay ? undefined : setNodeRef}
      {...(isDragOverlay ? {} : { ...attributes, ...listeners })}
      style={style}
      className="p-3 rounded-lg border mb-2 touch-none select-none transition-shadow hover:shadow-md"
    >
      <p
        className="text-sm leading-snug"
        style={{ color: "var(--color-text-primary)" }}
      >
        {text}
      </p>
      <div className="flex items-center justify-between mt-2">
        <span
          className="text-xs font-medium"
          style={{ color: "var(--color-text-secondary)" }}
        >
          {author}
        </span>
        <span
          className="text-xs"
          style={{ color: "var(--color-text-tertiary)" }}
        >
          {time}
        </span>
      </div>
    </div>
  );
}

// -- Droppable column component ----------------------------------------------

function Column({ id, title, dot, cards }) {
  const { setNodeRef, isOver } = useDroppable({ id });

  return (
    <div
      ref={setNodeRef}
      className="flex-1 min-w-0 rounded-xl p-3 transition-colors duration-200"
      style={{
        backgroundColor: isOver
          ? "var(--color-border)"
          : "var(--color-bg)",
        // DECISION: Subtle min-height so empty columns are still valid drop
        // targets. Without this, an empty column collapses and becomes
        // impossible to drop onto.
        minHeight: "180px",
      }}
    >
      {/* Column header */}
      <div className="flex items-center gap-2 mb-3 px-1">
        <span
          className="w-2 h-2 rounded-full inline-block"
          style={{ backgroundColor: dot }}
        />
        <h3
          className="text-sm font-semibold uppercase tracking-wider"
          style={{ color: "var(--color-text-secondary)" }}
        >
          {title}
        </h3>
        <span
          className="text-xs ml-auto"
          style={{ color: "var(--color-text-tertiary)" }}
        >
          {cards.length}
        </span>
      </div>

      {/* Card list */}
      {cards.map((card) => (
        <Card key={card.id} {...card} />
      ))}
    </div>
  );
}

// -- Main ProductBoard component ---------------------------------------------

function ProductBoard() {
  const [cards, setCards] = useState(INITIAL_CARDS);
  const [activeCard, setActiveCard] = useState(null);

  // DECISION: PointerSensor with a 5px activation distance prevents accidental
  // drags on click. This is important on touch devices where a tap shouldn't
  // start a drag.
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    })
  );

  // Find which column a card currently lives in
  const findColumn = (cardId) => {
    for (const [columnId, columnCards] of Object.entries(cards)) {
      if (columnCards.some((c) => c.id === cardId)) {
        return columnId;
      }
    }
    return null;
  };

  const handleDragStart = (event) => {
    const { active } = event;
    const sourceCol = findColumn(active.id);
    if (sourceCol) {
      const card = cards[sourceCol].find((c) => c.id === active.id);
      setActiveCard(card);
    }
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    setActiveCard(null);

    // If not dropped on a valid target, do nothing
    if (!over) return;

    const sourceCol = findColumn(active.id);
    const targetCol = over.id;

    // Only act if dropped on a different column
    if (!sourceCol || sourceCol === targetCol) return;

    setCards((prev) => {
      const card = prev[sourceCol].find((c) => c.id === active.id);
      return {
        ...prev,
        [sourceCol]: prev[sourceCol].filter((c) => c.id !== active.id),
        [targetCol]: [...prev[targetCol], card],
      };
    });
  };

  return (
    <section className="py-16 md:py-24">
      <div className="section-container">
        {/* Section label */}
        <p
          className="text-sm font-medium uppercase tracking-wider mb-2"
          style={{ color: "var(--color-accent)" }}
        >
          How it works
        </p>
        <h2
          className="font-display text-3xl md:text-4xl font-bold mb-3"
          style={{ color: "var(--color-text-primary)" }}
        >
          Three columns. That's the whole product.
        </h2>
        <p
          className="text-base md:text-lg mb-10 max-w-lg"
          style={{ color: "var(--color-text-secondary)" }}
        >
          Drag a card. This is a working prototype — the real thing writes
          itself in under 60 seconds.
        </p>

        {/* Kanban board */}
        <DndContext
          sensors={sensors}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <div className="flex flex-col md:flex-row gap-3">
            {COLUMNS.map((col) => (
              <Column key={col.id} {...col} cards={cards[col.id]} />
            ))}
          </div>

          {/* Floating card while dragging */}
          <DragOverlay>
            {activeCard ? <Card {...activeCard} isDragOverlay /> : null}
          </DragOverlay>
        </DndContext>
      </div>
    </section>
  );
}

export default ProductBoard;
