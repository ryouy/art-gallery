"use client";

import { useMemo, useState } from "react";
import { GalleryCard } from "@/components/GalleryCard";
import { SortToggle, type SortMode } from "@/components/SortToggle";
import { WorkEditForm, type AdminWork } from "@/components/WorkEditForm";
import type { GalleryItem, GalleryKind } from "@/lib/gallery";

type LoadState = "idle" | "loading" | "ready" | "error";
type SubmitState = "idle" | "submitting" | "success" | "error";

function shuffleItems(items: GalleryItem[]) {
  const next = [...items];

  for (let index = next.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [next[index], next[randomIndex]] = [next[randomIndex], next[index]];
  }

  return next;
}

export function GalleryGrid({ items, kind }: { items: GalleryItem[]; kind: GalleryKind }) {
  const [mode, setMode] = useState<SortMode>("published");
  const [seed, setSeed] = useState(0);
  const [manageOpen, setManageOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [adminWorks, setAdminWorks] = useState<AdminWork[]>([]);
  const [editingWork, setEditingWork] = useState<AdminWork | null>(null);
  const [loadState, setLoadState] = useState<LoadState>("idle");
  const [submitState, setSubmitState] = useState<SubmitState>("idle");
  const [message, setMessage] = useState("");

  const visibleItems = useMemo(() => {
    if (mode === "published") {
      return items;
    }

    return shuffleItems(items);
  }, [items, mode, seed]);

  function handleChange(nextMode: SortMode) {
    setMode(nextMode);
    if (nextMode === "random") {
      setSeed((current) => current + 1);
    }
  }

  async function loadWorks() {
    setLoadState("loading");
    setSubmitState("idle");
    setMessage("");

    try {
      const response = await fetch(`/api/admin/works?password=${encodeURIComponent(password)}`);
      const result = (await response.json()) as { works?: AdminWork[]; message?: string };

      if (!response.ok) {
        throw new Error(result.message ?? "Could not load works.");
      }

      setAdminWorks((result.works ?? []).filter((work) => work.kind === kind));
      setLoadState("ready");
    } catch (error) {
      setLoadState("error");
      setMessage(error instanceof Error ? error.message : "Could not load works.");
    }
  }

  function findAdminWork(item: GalleryItem) {
    return adminWorks.find((work) => work.slug === item.slug && work.kind === item.kind) ?? null;
  }

  async function handleEdit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!editingWork) {
      return;
    }

    setSubmitState("submitting");
    setMessage("");

    try {
      const formData = new FormData(event.currentTarget);
      const response = await fetch("/api/admin/works", {
        method: "PATCH",
        body: formData
      });
      const result = (await response.json()) as { message?: string };

      if (!response.ok) {
        throw new Error(result.message ?? "Could not update work.");
      }

      setSubmitState("success");
      setMessage(result.message ?? "Updated.");
      setEditingWork(null);
      await loadWorks();
    } catch (error) {
      setSubmitState("error");
      setMessage(error instanceof Error ? error.message : "Could not update work.");
    }
  }

  async function handleDelete(work: AdminWork) {
    const confirmed = window.confirm(`Delete "${work.title}"? This will remove the Markdown and image.`);

    if (!confirmed) {
      return;
    }

    setSubmitState("submitting");
    setMessage("");

    try {
      const response = await fetch("/api/admin/works", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          password,
          title: work.title,
          contentPath: work.contentPath,
          contentSha: work.contentSha,
          imagePath: work.imagePath,
          imageSha: work.imageSha
        })
      });
      const result = (await response.json()) as { message?: string };

      if (!response.ok) {
        throw new Error(result.message ?? "Could not delete work.");
      }

      setSubmitState("success");
      setMessage(result.message ?? "Deleted.");
      setEditingWork(null);
      await loadWorks();
    } catch (error) {
      setSubmitState("error");
      setMessage(error instanceof Error ? error.message : "Could not delete work.");
    }
  }

  return (
    <section className="space-y-8">
      <div className="flex flex-col gap-4 border-b border-line pb-5 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted">{items.length} works</p>
        <div className="flex flex-wrap items-center gap-3">
          <SortToggle value={mode} onChange={handleChange} />
          <button
            type="button"
            onClick={() => {
              setManageOpen((current) => !current);
              setMessage("");
            }}
            className={`border px-4 py-2 text-sm transition ${
              manageOpen
                ? "border-ink bg-ink text-bone"
                : "border-line text-muted hover:border-ink hover:text-ink"
            }`}
          >
            Manage
          </button>
        </div>
      </div>

      {manageOpen ? (
        <div className="grid gap-4 border-b border-line pb-6">
          <div className="flex flex-wrap items-end gap-3">
            <label className="grid w-48 gap-1.5 text-xs text-muted">
              Admin password
              <input
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                type="text"
                className="border border-line bg-bone px-2.5 py-1.5 text-sm text-ink"
              />
            </label>
            <button
              type="button"
              onClick={loadWorks}
              disabled={loadState === "loading"}
              className="border border-line px-3 py-1.5 text-xs text-muted transition hover:border-ink hover:text-ink disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loadState === "loading" ? "Loading..." : "Load"}
            </button>
          </div>

          {editingWork ? (
            <WorkEditForm
              work={editingWork}
              password={password}
              submitLabel={submitState === "submitting" ? "Saving..." : "Save changes"}
              disabled={submitState === "submitting"}
              onCancel={() => setEditingWork(null)}
              onSubmit={handleEdit}
            />
          ) : null}

          {message ? (
            <p className={`text-sm ${loadState === "error" || submitState === "error" ? "text-[#f0a7a7]" : "text-muted"}`}>
              {message}
            </p>
          ) : null}
        </div>
      ) : null}

      <div className="grid gap-x-5 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {visibleItems.map((item) => {
          const adminWork = findAdminWork(item);

          return (
            <div key={item.slug} className="grid gap-3">
              <GalleryCard item={item} />
              {manageOpen && loadState === "ready" ? (
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => adminWork && setEditingWork(adminWork)}
                    disabled={!adminWork || submitState === "submitting"}
                    className="flex-1 border border-line px-3 py-2 text-sm text-muted transition hover:border-ink hover:text-ink disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => adminWork && handleDelete(adminWork)}
                    disabled={!adminWork || submitState === "submitting"}
                    className="flex-1 border border-[#f0a7a7] px-3 py-2 text-sm text-[#f0a7a7] transition hover:bg-[#f0a7a7] hover:text-paper disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Delete
                  </button>
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
    </section>
  );
}
