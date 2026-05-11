import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PhotoDetail } from "@/components/PhotoDetail";
import { getGalleryItem, getGalleryItems, getNeighbors } from "@/lib/content";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getGalleryItems("photos").map((item) => ({
    slug: item.slug
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const item = getGalleryItem("photos", slug);

  return {
    title: item?.title ?? "Photos"
  };
}

export default async function PhotoDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const item = getGalleryItem("photos", slug);

  if (!item) {
    notFound();
  }

  const { previous, next } = getNeighbors("photos", item.slug);

  return <PhotoDetail item={item} previous={previous} next={next} />;
}
