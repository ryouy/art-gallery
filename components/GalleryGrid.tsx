"use client";

import { useMemo, useState } from "react";
import { GalleryCard } from "@/components/GalleryCard";
import { SortToggle, type SortMode } from "@/components/SortToggle";
import type { GalleryItem } from "@/lib/gallery";

function shuffleItems(items: GalleryItem[]) {
  const next = [...items];

  for (let index = next.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [next[index], next[randomIndex]] = [next[randomIndex], next[index]];
  }

  return next;
}

export function GalleryGrid({ items }: { items: GalleryItem[] }) {
  const [mode, setMode] = useState<SortMode>("published");
  const [seed, setSeed] = useState(0);

  const visibleItems = useMemo(() => {
    if (mode === "published") {
      return items;
    }

    return shuffleItems(items);
  }, [items, mode, seed]);

  function handleChange(nextMode: SortMode) {
    setMode(nextMode);
    if (nextMode === "random") {
      setSeed((current) => current + 1);
    }
  }

  return (
    <section className="space-y-8">
      <div className="flex flex-col gap-4 border-b border-line pb-5 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted">{items.length} works</p>
        <SortToggle value={mode} onChange={handleChange} />
      </div>
      <div className="grid gap-x-5 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {visibleItems.map((item) => (
          <GalleryCard key={item.slug} item={item} />
        ))}
      </div>
    </section>
  );
}
