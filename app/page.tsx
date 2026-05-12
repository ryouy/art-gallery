import Link from "next/link";
import { GalleryCard } from "@/components/GalleryCard";
import { getLatestItems } from "@/lib/content";

export default function Home() {
  const latestItems = getLatestItems(4);

  return (
    <div>
      <section className="mx-auto grid min-h-[calc(100vh-57px)] max-w-7xl items-start gap-10 px-5 pt-3 pb-10 sm:px-8 lg:grid-cols-[0.82fr_1.18fr] lg:pt-6 lg:pb-16">
        <div className="max-w-2xl pb-4">
         
          <h1 className="max-w-xl text-5xl font-medium leading-none tracking-normal text-ink sm:text-7xl lg:text-8xl">
            
          </h1>
          <p className="mt-8 max-w-md text-base leading-8 text-muted">
            A quiet archive for recent paintings and photographs.
          </p>
          <div className="mt-10 flex flex-wrap gap-3 text-sm">
            <Link
              href="/paintings"
              className="border border-ink bg-ink px-5 py-3 text-bone transition hover:bg-transparent hover:text-ink"
            >
              Paintings
            </Link>
            <Link
              href="/photos"
              className="border border-ink px-5 py-3 text-ink transition hover:bg-ink hover:text-bone"
            >
              Photos
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          {latestItems.slice(0, 4).map((item, index) => (
            <Link
              key={item.slug}
              href={`/${item.kind}/${item.slug}`}
              className={`group relative overflow-hidden bg-bone ${
                index === 0 || index === 3 ? "aspect-[4/5]" : "aspect-[5/4]"
              }`}
            >
              <img
                src={item.image}
                alt={item.title}
                className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.025]"
              />
            </Link>
          ))}
        </div>
      </section>

      <section className="border-t border-line">
        <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8 sm:py-16">
          <div className="mb-8 flex items-end justify-between gap-4 border-b border-line pb-5">
            <div>
              <p className="mb-3 text-sm text-muted">Recent</p>
              <h2 className="text-3xl font-medium tracking-normal text-ink sm:text-4xl">
                Latest Works
              </h2>
            </div>
            <Link href="/paintings" className="hidden text-sm text-muted transition hover:text-ink sm:block">
              View all
            </Link>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {latestItems.map((item) => (
              <GalleryCard key={`${item.kind}-${item.slug}`} item={item} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
