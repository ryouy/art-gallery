import { DetailFrame } from "@/components/ArtworkDetail";
import type { GalleryItem, GalleryNeighbor } from "@/lib/gallery";

type DetailProps = {
  item: GalleryItem;
  previous: GalleryNeighbor;
  next: GalleryNeighbor;
};

export function PhotoDetail({ item, previous, next }: DetailProps) {
  return (
    <DetailFrame
      item={item}
      previous={previous}
      next={next}
      backHref="/photos"
      backLabel="Back to photos"
      dateLabel="Date"
    />
  );
}
