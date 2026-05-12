import type { Metadata } from "next";
import { GalleryGrid } from "@/components/GalleryGrid";
import { getGalleryItems } from "@/lib/content";

export const metadata: Metadata = {
  title: "Photos"
};

export default function PhotosPage() {
  const items = getGalleryItems("photos");

  return (
    <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8 sm:py-16">
      <header className="mb-10 grid gap-6 border-b border-line pb-8 lg:grid-cols-[0.7fr_1fr]">
        <p className="text-sm text-muted">Archive / 02</p>
        <div>
        <h1 className="text-4xl font-medium leading-none tracking-normal text-ink sm:text-5xl">
          Photos
        </h1>
        
        </div>
      </header>
      <GalleryGrid items={items} kind="photos" />
    </div>
  );
}
