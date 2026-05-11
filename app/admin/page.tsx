import type { Metadata } from "next";
import { AdminPanel } from "@/components/AdminPanel";

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
        <p className="mb-4 text-sm text-muted">Private admin</p>
        <h1 className="text-5xl font-medium leading-none text-ink sm:text-7xl">Manage Works</h1>
      </header>
      <AdminPanel />
    </div>
  );
}
