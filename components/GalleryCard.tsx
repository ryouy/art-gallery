import Link from "next/link";
import { formatDate, type GalleryItem } from "@/lib/gallery";

export function GalleryCard({ item }: { item: GalleryItem }) {
  const href = `/${item.kind}/${item.slug}`;

  return (
    <Link href={href} className="group block">
      <article className="border-b border-line pb-4 transition duration-300 hover:border-ink">
        <div className="aspect-[4/5] overflow-hidden bg-paper sm:aspect-[5/6]">
          <img
            src={item.image}
            alt={item.title}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.02]"
          />
        </div>
        <div className="space-y-2 pt-4">
          <div className="flex items-start justify-between gap-4">
            <h2 className="text-base font-medium leading-7 text-ink">
              {item.title}
            </h2>
            <span className="shrink-0 pt-1 text-xs text-muted">
              {item.kind === "paintings" ? "Painting" : "Photo"}
            </span>
          </div>
          <p className="text-sm leading-6 text-muted">{formatDate(item.date)}</p>
        </div>
      </article>
    </Link>
  );
}
