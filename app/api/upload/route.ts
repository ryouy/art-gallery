import { NextResponse } from "next/server";
import {
  allowedImageTypes,
  allowedKinds,
  buildMarkdown,
  createGithubFile,
  ensurePathDoesNotExist,
  getBranch,
  normalizeSlug,
  toBase64,
  validateAdminPassword,
  type AdminKind
} from "@/lib/github-admin";

export const runtime = "nodejs";

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

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const password = field(formData, "password");

    try {
      validateAdminPassword(password);
    } catch {
      return NextResponse.json({ message: "Invalid password." }, { status: 401 });
    }

    const kind = field(formData, "kind") as AdminKind;

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

    const branch = getBranch();
    const imagePath = `public/images/${kind}/${slug}.${extension}`;
    const contentPath = `content/${kind}/${slug}.md`;
    const publicImagePath = `/images/${kind}/${slug}.${extension}`;
    const frontmatter = buildMarkdown({
      kind,
      title,
      slug,
      image: publicImagePath,
      date,
      materials,
      description
    });

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
