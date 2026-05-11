import { NextResponse } from "next/server";

export const runtime = "nodejs";

type GalleryKind = "paintings" | "photos";

const allowedKinds = new Set<GalleryKind>(["paintings", "photos"]);
const allowedImageTypes = new Map([
  ["image/jpeg", "jpg"],
  ["image/png", "png"],
  ["image/webp", "webp"],
  ["image/avif", "avif"]
]);

function requiredEnv(name: string) {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing environment variable: ${name}`);
  }

  return value;
}

function field(formData: FormData, name: string) {
  const value = formData.get(name);

  if (typeof value !== "string" || value.trim().length === 0) {
    throw new Error(`${name} is required.`);
  }

  return value.trim();
}

function optionalField(formData: FormData, name: string) {
  const value = formData.get(name);
  return typeof value === "string" && value.trim() ? value.trim() : "";
}

function normalizeSlug(value: string) {
  const slug = value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-+/g, "-");

  if (!slug) {
    throw new Error("Slug must contain letters or numbers.");
  }

  return slug;
}

function escapeFrontmatter(value: string) {
  return value.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}

function toBase64(buffer: ArrayBuffer) {
  return Buffer.from(buffer).toString("base64");
}

async function githubRequest(path: string, init: RequestInit = {}) {
  const owner = requiredEnv("GITHUB_OWNER");
  const repo = requiredEnv("GITHUB_REPO");
  const token = requiredEnv("GITHUB_TOKEN");
  const url = `https://api.github.com/repos/${owner}/${repo}${path}`;

  return fetch(url, {
    ...init,
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      "X-GitHub-Api-Version": "2022-11-28",
      ...init.headers
    }
  });
}

async function ensurePathDoesNotExist(path: string, branch: string) {
  const response = await githubRequest(`/contents/${path}?ref=${encodeURIComponent(branch)}`);

  if (response.status === 200) {
    throw new Error(`${path} already exists.`);
  }

  if (response.status !== 404) {
    throw new Error(`Could not check ${path}.`);
  }
}

async function createGithubFile(path: string, content: string, message: string, branch: string) {
  const response = await githubRequest(`/contents/${path}`, {
    method: "PUT",
    body: JSON.stringify({
      branch,
      content,
      message
    })
  });

  if (!response.ok) {
    const details = (await response.json().catch(() => null)) as { message?: string } | null;
    throw new Error(details?.message ?? `Failed to create ${path}.`);
  }
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const password = field(formData, "password");
    const adminPassword = requiredEnv("ADMIN_PASSWORD");

    if (password !== adminPassword) {
      return NextResponse.json({ message: "Invalid password." }, { status: 401 });
    }

    const kind = field(formData, "kind") as GalleryKind;

    if (!allowedKinds.has(kind)) {
      throw new Error("Type must be paintings or photos.");
    }

    const title = field(formData, "title");
    const slug = normalizeSlug(field(formData, "slug"));
    const date = field(formData, "date");
    const description = field(formData, "description");
    const materials = optionalField(formData, "materials");
    const image = formData.get("image");

    if (!(image instanceof File)) {
      throw new Error("Image is required.");
    }

    const extension = allowedImageTypes.get(image.type);

    if (!extension) {
      throw new Error("Image must be JPG, PNG, WebP, or AVIF.");
    }

    const branch = process.env.GITHUB_BRANCH || "main";
    const imagePath = `public/images/${kind}/${slug}.${extension}`;
    const contentPath = `content/${kind}/${slug}.md`;
    const publicImagePath = `/images/${kind}/${slug}.${extension}`;
    const frontmatter = [
      "---",
      `title: "${escapeFrontmatter(title)}"`,
      `slug: "${slug}"`,
      `image: "${publicImagePath}"`,
      `date: "${escapeFrontmatter(date)}"`,
      kind === "paintings" && materials ? `materials: "${escapeFrontmatter(materials)}"` : "",
      "---",
      "",
      description,
      ""
    ]
      .filter((line) => line !== "")
      .join("\n");

    await ensurePathDoesNotExist(imagePath, branch);
    await ensurePathDoesNotExist(contentPath, branch);

    await createGithubFile(
      imagePath,
      toBase64(await image.arrayBuffer()),
      `Add ${kind.slice(0, -1)} image: ${title}`,
      branch
    );
    await createGithubFile(
      contentPath,
      Buffer.from(frontmatter, "utf8").toString("base64"),
      `Add ${kind.slice(0, -1)} content: ${title}`,
      branch
    );

    return NextResponse.json({
      message: "Uploaded to GitHub. Vercel will redeploy from the new commits.",
      url: `/${kind}/${slug}`
    });
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Upload failed." },
      { status: 400 }
    );
  }
}
