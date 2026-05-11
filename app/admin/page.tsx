import type { Metadata } from "next";
import { UploadForm } from "@/components/UploadForm";

export const metadata: Metadata = {
  title: "Admin",
  robots: {
    index: false,
    follow: false
  }
};

export default function AdminPage() {
  return (
    <div className="mx-auto max-w-4xl px-5 py-12 sm:px-8 sm:py-16">
      <header className="mb-10 border-b border-line pb-8">
        <p className="mb-4 text-sm text-muted">Private upload</p>
        <h1 className="text-5xl font-medium leading-none text-ink sm:text-7xl">Add Work</h1>
        <p className="mt-6 max-w-2xl text-base leading-8 text-muted">
          Upload an image and description. The site will commit the files to GitHub, then Vercel will
          redeploy from that commit.
        </p>
      </header>
      <UploadForm />
    </div>
  );
}
