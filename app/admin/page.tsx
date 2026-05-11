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
    <div className="mx-auto max-w-5xl px-5 py-8 sm:px-8 sm:py-10">
      <header className="mb-6 border-b border-line pb-5">
        <p className="mb-2 text-sm text-muted">Private admin</p>
        <h1 className="text-4xl font-medium leading-none text-ink sm:text-5xl">Manage Works</h1>
      </header>
      <AdminPanel />
    </div>
  );
}
