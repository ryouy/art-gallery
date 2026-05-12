"use client";

import { useMemo, useState } from "react";
import { WorkEditForm, type AdminWork } from "@/components/WorkEditForm";
import type { GalleryItem } from "@/lib/gallery";

type LoadState = "idle" | "loading" | "ready" | "error";
type SubmitState = "idle" | "submitting" | "success" | "error";

export function DetailWorkAdmin({ item, backHref }: { item: GalleryItem; backHref: string }) {
  const [open, setOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [works, setWorks] = useState<AdminWork[]>([]);
  const [editing, setEditing] = useState(false);
  const [loadState, setLoadState] = useState<LoadState>("idle");
  const [submitState, setSubmitState] = useState<SubmitState>("idle");
  const [message, setMessage] = useState("");

  const work = useMemo(
    () => works.find((candidate) => candidate.kind === item.kind && candidate.slug === item.slug) ?? null,
    [item.kind, item.slug, works]
  );

  async function loadWork() {
    setLoadState("loading");
    setSubmitState("idle");
    setMessage("");

    try {
      const response = await fetch(`/api/admin/works?password=${encodeURIComponent(password)}`);
      const result = (await response.json()) as { works?: AdminWork[]; message?: string };

      if (!response.ok) {
        throw new Error(result.message ?? "Could not load work.");
      }

      setWorks(result.works ?? []);
      setLoadState("ready");
    } catch (error) {
      setLoadState("error");
      setMessage(error instanceof Error ? error.message : "Could not load work.");
    }
  }

  async function handleEdit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!work) {
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
      setEditing(false);
      await loadWork();
    } catch (error) {
      setSubmitState("error");
      setMessage(error instanceof Error ? error.message : "Could not update work.");
    }
  }

  async function handleDelete() {
    if (!work) {
      return;
    }

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
      window.location.assign(backHref);
    } catch (error) {
      setSubmitState("error");
      setMessage(error instanceof Error ? error.message : "Could not delete work.");
    }
  }

  return (
    <section className="mx-auto max-w-5xl border-t border-line pt-5">
      <button
        type="button"
        onClick={() => {
          setOpen((current) => !current);
          setMessage("");
        }}
        className={`border px-3 py-1.5 text-xs transition ${
          open ? "border-ink bg-ink text-bone" : "border-line text-muted hover:border-ink hover:text-ink"
        }`}
      >
        Manage
      </button>

      {open ? (
        <div className="mt-4 grid gap-4">
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
              onClick={loadWork}
              disabled={loadState === "loading"}
              className="border border-line px-3 py-1.5 text-xs text-muted transition hover:border-ink hover:text-ink disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loadState === "loading" ? "Loading..." : "Load"}
            </button>
          </div>

          {loadState === "ready" && work && !editing ? (
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setEditing(true)}
                disabled={submitState === "submitting"}
                className="border border-line px-3 py-1.5 text-xs text-muted transition hover:border-ink hover:text-ink disabled:cursor-not-allowed disabled:opacity-50"
              >
                Edit
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={submitState === "submitting"}
                className="border border-[#f0a7a7] px-3 py-1.5 text-xs text-[#f0a7a7] transition hover:bg-[#f0a7a7] hover:text-paper disabled:cursor-not-allowed disabled:opacity-50"
              >
                {submitState === "submitting" ? "Deleting..." : "Delete"}
              </button>
            </div>
          ) : null}

          {loadState === "ready" && !work ? (
            <p className="text-sm text-[#f0a7a7]">Could not find this work in admin data.</p>
          ) : null}

          {editing && work ? (
            <WorkEditForm
              work={work}
              password={password}
              submitLabel={submitState === "submitting" ? "Saving..." : "Save changes"}
              disabled={submitState === "submitting"}
              onCancel={() => setEditing(false)}
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
    </section>
  );
}
