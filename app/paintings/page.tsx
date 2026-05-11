import type { Metadata } from "next";
import { GalleryGrid } from "@/components/GalleryGrid";
import { getGalleryItems } from "@/lib/content";

export const metadata: Metadata = {
  title: "Paintings"
};

export default function PaintingsPage() {
  const items = getGalleryItems("paintings");

  return (
    <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8 sm:py-16">
      <header className="mb-10 grid gap-6 border-b border-line pb-8 lg:grid-cols-[0.7fr_1fr]">
        <p className="text-sm text-muted">Archive / 01</p>
        <div>
        <h1 className="text-5xl font-medium leading-none tracking-normal text-ink sm:text-7xl">
          Paintings
        </h1>
        <p className="mt-6 max-w-xl text-base leading-8 text-muted">
          A quiet index of brushwork, negative space, and layered color.
        </p>
        </div>
      </header>
      <GalleryGrid items={items} />
    </div>
  );
}
