"use client";

export type SortMode = "published" | "random";

type SortToggleProps = {
  value: SortMode;
  onChange: (value: SortMode) => void;
};

export function SortToggle({ value, onChange }: SortToggleProps) {
  return (
    <div className="inline-flex border border-line bg-bone text-sm text-muted">
      <button
        type="button"
        onClick={() => onChange("published")}
        className={`px-4 py-2 transition ${
          value === "published" ? "bg-ink text-bone" : "hover:text-ink"
        }`}
      >
        Published
      </button>
      <button
        type="button"
        onClick={() => onChange("random")}
        className={`border-l border-line px-4 py-2 transition ${
          value === "random" ? "bg-ink text-bone" : "hover:text-ink"
        }`}
      >
        Random
      </button>
    </div>
  );
}
