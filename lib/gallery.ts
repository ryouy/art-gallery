export type GalleryKind = "paintings" | "photos";

export type GalleryItem = {
  kind: GalleryKind;
  title: string;
  slug: string;
  image: string;
  date: string;
  description: string;
  materials?: string;
};

export type GalleryNeighbor = Pick<GalleryItem, "slug" | "title"> | null;

export function formatDate(date: string) {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric"
  }).format(new Date(date));
}
