import Link from "next/link";
import { DetailWorkAdmin } from "@/components/DetailWorkAdmin";
import { formatDate, type GalleryItem, type GalleryNeighbor } from "@/lib/gallery";

type DetailProps = {
  item: GalleryItem;
  previous: GalleryNeighbor;
  next: GalleryNeighbor;
};

export function ArtworkDetail({ item, previous, next }: DetailProps) {
  return (
    <DetailFrame
      item={item}
      previous={previous}
      next={next}
      backHref="/paintings"
      backLabel="Back to paintings"
      dateLabel="Date"
    />
  );
}

export function DetailFrame({
  item,
  previous,
  next,
  backHref,
  backLabel,
  dateLabel
}: DetailProps & { backHref: string; backLabel: string; dateLabel: string }) {
  return (
    <article className="mx-auto max-w-7xl px-5 py-10 sm:px-8 sm:py-14">
      <div className="mb-8">
        <Link href={backHref} className="text-sm text-muted transition hover:text-ink">
          {backLabel}
        </Link>
      </div>

      <div className="mx-auto flex min-h-[58vh] items-center justify-center border border-line bg-bone p-3 sm:p-6">
        <img
          src={item.image}
          alt={item.title}
          className="max-h-[78vh] w-auto max-w-full object-contain"
        />
      </div>

      <div className="mx-auto grid max-w-5xl gap-8 py-10 sm:py-12 lg:grid-cols-[0.78fr_1fr]">
        <div>
        <p className="mb-3 text-sm text-muted">
          {item.kind === "paintings" ? "Painting" : "Photograph"}
        </p>
        <h1 className="text-4xl font-medium leading-tight tracking-normal text-ink sm:text-6xl">
          {item.title}
        </h1>
        </div>
        <div>
        <dl className="grid gap-4 border-y border-line py-5 text-sm leading-6 text-muted sm:grid-cols-2">
          <div>
            <dt className="mb-1 text-ink">{dateLabel}</dt>
            <dd>{formatDate(item.date)}</dd>
          </div>
          {item.kind === "paintings" && item.materials ? (
            <div>
              <dt className="mb-1 text-ink">Materials</dt>
              <dd>{item.materials}</dd>
            </div>
          ) : null}
        </dl>
        <div className="prose-gallery mt-8 whitespace-pre-line text-base leading-8 text-ink">
          {item.description}
        </div>
        </div>
      </div>

      <DetailWorkAdmin item={item} backHref={backHref} />

      <nav className="mx-auto mt-6 grid max-w-5xl gap-3 border-t border-line pt-6 text-sm sm:grid-cols-2">
        {previous ? (
          <Link href={`${backHref}/${previous.slug}`} className="text-muted transition hover:text-ink">
            Previous: {previous.title}
          </Link>
        ) : (
          <span className="text-muted/60">No previous work</span>
        )}
        {next ? (
          <Link
            href={`${backHref}/${next.slug}`}
            className="text-muted transition hover:text-ink sm:text-right"
          >
            Next: {next.title}
          </Link>
        ) : (
          <span className="text-muted/60 sm:text-right">No next work</span>
        )}
      </nav>
    </article>
  );
}
