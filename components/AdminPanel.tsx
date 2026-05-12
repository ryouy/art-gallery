"use client";

import { useMemo, useState } from "react";
import { UploadForm } from "@/components/UploadForm";

type Tab = "add" | "edit" | "delete";
type Kind = "paintings" | "photos";

type AdminWork = {
  kind: Kind;
  title: string;
  slug: string;
  date: string;
  materials?: string;
  description: string;
  image: string;
  contentPath: string;
  contentSha: string;
  imagePath: string;
  imageSha?: string;
};

type LoadState = "idle" | "loading" | "ready" | "error";
type SubmitState = "idle" | "submitting" | "success" | "error";

const tabs: Array<{ id: Tab; label: string }> = [
  { id: "add", label: "Add" },
  { id: "edit", label: "Edit" },
  { id: "delete", label: "Delete" }
];

export function AdminPanel() {
  const [tab, setTab] = useState<Tab>("add");
  const [selectedKind, setSelectedKind] = useState<Kind>("paintings");
  const [password, setPassword] = useState("");
  const [works, setWorks] = useState<AdminWork[]>([]);
  const [selectedPath, setSelectedPath] = useState("");
  const [loadState, setLoadState] = useState<LoadState>("idle");
  const [submitState, setSubmitState] = useState<SubmitState>("idle");
  const [message, setMessage] = useState("");

  const filteredWorks = useMemo(
    () => works.filter((work) => work.kind === selectedKind),
    [selectedKind, works]
  );

  const selectedWork = useMemo(
    () => filteredWorks.find((work) => work.contentPath === selectedPath) ?? filteredWorks[0] ?? null,
    [filteredWorks, selectedPath]
  );

  async function loadWorks() {
    setLoadState("loading");
    setMessage("");

    try {
      const response = await fetch(`/api/admin/works?password=${encodeURIComponent(password)}`);
      const result = (await response.json()) as { works?: AdminWork[]; message?: string };

      if (!response.ok) {
        throw new Error(result.message ?? "Could not load works.");
      }

      const nextWorks = result.works ?? [];
      const nextFilteredWorks = nextWorks.filter((work) => work.kind === selectedKind);

      setWorks(nextWorks);
      setSelectedPath((current) => {
        const currentStillVisible = nextFilteredWorks.some((work) => work.contentPath === current);
        return currentStillVisible ? current : nextFilteredWorks[0]?.contentPath || "";
      });
      setLoadState("ready");
    } catch (error) {
      setLoadState("error");
      setMessage(error instanceof Error ? error.message : "Could not load works.");
    }
  }

  async function handleEdit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!selectedWork) {
      setMessage("Select a work first.");
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
      await loadWorks();
    } catch (error) {
      setSubmitState("error");
      setMessage(error instanceof Error ? error.message : "Could not update work.");
    }
  }

  async function handleDelete() {
    if (!selectedWork) {
      setMessage("Select a work first.");
      return;
    }

    const confirmed = window.confirm(`Delete "${selectedWork.title}"? This will remove the Markdown and image.`);

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
          title: selectedWork.title,
          contentPath: selectedWork.contentPath,
          contentSha: selectedWork.contentSha,
          imagePath: selectedWork.imagePath,
          imageSha: selectedWork.imageSha
        })
      });
      const result = (await response.json()) as { message?: string };

      if (!response.ok) {
        throw new Error(result.message ?? "Could not delete work.");
      }

      setSubmitState("success");
      setMessage(result.message ?? "Deleted.");
      setSelectedPath("");
      await loadWorks();
    } catch (error) {
      setSubmitState("error");
      setMessage(error instanceof Error ? error.message : "Could not delete work.");
    }
  }

  return (
    <div className="grid gap-5">
      <div className="flex flex-wrap gap-2 border-b border-line pb-3">
        {tabs.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => {
              setTab(item.id);
              setMessage("");
            }}
            className={`border px-4 py-2 text-sm transition ${
              tab === item.id
                ? "border-ink bg-ink text-bone"
                : "border-line text-muted hover:border-ink hover:text-ink"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {tab === "add" ? <UploadForm /> : null}

      {tab !== "add" ? (
        <section className="grid gap-4">
          <div className="grid gap-4 border-b border-line pb-4 sm:grid-cols-[1fr_auto] sm:items-end">
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
              className="border border-ink bg-ink px-5 py-2.5 text-sm text-bone transition hover:bg-transparent hover:text-ink disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loadState === "loading" ? "Loading..." : "Load works"}
            </button>
          </div>

          {works.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-[auto_1fr] sm:items-end">
              <div className="grid gap-2 text-sm text-muted">
                Category
                <div className="inline-flex border border-line bg-bone">
                  {(["paintings", "photos"] as const).map((kind) => (
                    <button
                      key={kind}
                      type="button"
                      onClick={() => {
                        setSelectedKind(kind);
                        const first = works.find((work) => work.kind === kind);
                        setSelectedPath(first?.contentPath || "");
                      }}
                      className={`px-4 py-2.5 text-sm transition ${
                        selectedKind === kind
                          ? "bg-ink text-bone"
                          : "text-muted hover:text-ink"
                      } ${kind === "photos" ? "border-l border-line" : ""}`}
                    >
                      {kind === "paintings" ? "Painting" : "Photo"}
                    </button>
                  ))}
                </div>
              </div>

              <label className="grid gap-2 text-sm text-muted">
                Work
                <select
                  value={selectedWork?.contentPath ?? ""}
                  onChange={(event) => setSelectedPath(event.target.value)}
                  className="border border-line bg-bone px-3 py-2.5 text-ink"
                >
                  {filteredWorks.map((work) => (
                    <option key={work.contentPath} value={work.contentPath}>
                      {work.title}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          ) : null}

          {selectedWork ? (
            <div className="grid gap-1 border-b border-line pb-4 text-xs leading-5 text-muted">
              <p>Content path: {selectedWork.contentPath}</p>
              <p>Image path: {selectedWork.imagePath}</p>
            </div>
          ) : null}

          {tab === "edit" && selectedWork ? (
            <form key={selectedWork.contentPath} onSubmit={handleEdit} className="grid gap-4">
              <input type="hidden" name="password" value={password} />
              <input type="hidden" name="contentPath" value={selectedWork.contentPath} />
              <input type="hidden" name="contentSha" value={selectedWork.contentSha} />
              <input type="hidden" name="imagePath" value={selectedWork.imagePath} />
              <input type="hidden" name="imageSha" value={selectedWork.imageSha ?? ""} />
              <input type="hidden" name="image" value={selectedWork.image} />

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <label className="grid gap-2 text-sm text-muted">
                  Type
                  <select
                    name="kind"
                    defaultValue={selectedWork.kind}
                    className="border border-line bg-bone px-3 py-2.5 text-ink"
                  >
                    <option value="paintings">Painting</option>
                    <option value="photos">Photo</option>
                  </select>
                </label>
                <label className="grid gap-2 text-sm text-muted">
                  Title
                  <input
                    name="title"
                    defaultValue={selectedWork.title}
                    className="border border-line bg-bone px-3 py-2.5 text-ink"
                    required
                  />
                </label>
                <label className="grid gap-2 text-sm text-muted">
                  Slug
                  <input
                    name="slug"
                    defaultValue={selectedWork.slug}
                    className="border border-line bg-bone px-3 py-2.5 text-ink"
                    required
                  />
                </label>
                <label className="grid gap-2 text-sm text-muted">
                  Date
                  <input
                    name="date"
                    type="date"
                    defaultValue={selectedWork.date}
                    className="border border-line bg-bone px-3 py-2.5 text-ink"
                    required
                  />
                </label>
                <label className="grid gap-2 text-sm text-muted">
                  Materials
                  <input
                    name="materials"
                    defaultValue={selectedWork.materials ?? ""}
                    className="border border-line bg-bone px-3 py-2.5 text-ink"
                  />
                </label>
                <label className="grid gap-2 text-sm text-muted">
                  Replace image
                  <input
                    name="replacementImage"
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/avif"
                    className="border border-line bg-bone px-3 py-2.5 text-ink file:mr-4 file:border-0 file:bg-ink file:px-4 file:py-2 file:text-bone"
                  />
                </label>
              </div>

              <label className="grid gap-2 text-sm text-muted">
                Description
                <textarea
                  name="description"
                  rows={5}
                  defaultValue={selectedWork.description}
                  className="border border-line bg-bone px-3 py-2.5 leading-7 text-ink"
                  required
                />
              </label>

              <button
                type="submit"
                disabled={submitState === "submitting"}
                className="w-fit border border-ink bg-ink px-5 py-2.5 text-sm text-bone transition hover:bg-transparent hover:text-ink disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitState === "submitting" ? "Saving..." : "Save changes"}
              </button>
            </form>
          ) : null}

          {tab === "delete" && selectedWork ? (
            <div className="grid gap-4 border border-line p-4 sm:grid-cols-[1fr_auto] sm:items-center">
              <div>
                <p className="text-sm text-muted">Selected work</p>
                <h2 className="mt-2 text-2xl font-medium text-ink">{selectedWork.title}</h2>
                <p className="mt-2 text-sm text-muted">{selectedWork.contentPath}</p>
              </div>
              <button
                type="button"
                onClick={handleDelete}
                disabled={submitState === "submitting"}
                className="w-fit border border-[#f0a7a7] px-5 py-2.5 text-sm text-[#f0a7a7] transition hover:bg-[#f0a7a7] hover:text-paper disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitState === "submitting" ? "Deleting..." : "Delete work"}
              </button>
            </div>
          ) : null}

          {message ? (
            <p className={`text-sm ${loadState === "error" || submitState === "error" ? "text-[#f0a7a7]" : "text-muted"}`}>
              {message}
            </p>
          ) : null}
        </section>
      ) : null}
    </div>
  );
}
