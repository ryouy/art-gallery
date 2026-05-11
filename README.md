# Art Index

A quiet gallery site built with Next.js App Router. Images live in `public/images`, and text content lives in Markdown files under `content`. No CMS or external database is required.

## Setup

```bash
npm install
```

## Development

```bash
npm run dev
```

Open the local URL printed in your terminal, usually `http://localhost:3000`.

Copy `.env.example` to `.env.local` and fill in the values before using the upload page.

## Build

```bash
npm run build
```

## Deploy to Vercel

1. Push this repository to GitHub.
2. Import the GitHub repository in Vercel.
3. Keep the Framework Preset set to `Next.js`.
4. Add the environment variables listed below in Vercel.
5. Every future push to GitHub will trigger a new Vercel deployment.

## Manage from the Site

Open `/admin` on the deployed site or local dev server.

The admin page can add, edit, and delete works. Changes are written to GitHub:

- `public/images/paintings` or `public/images/photos`
- `content/paintings` or `content/photos`

After GitHub receives the commit, Vercel redeploys the site automatically.

Required environment variables:

- `ADMIN_PASSWORD`: Password required by the upload form.
- `GITHUB_OWNER`: GitHub user or organization name.
- `GITHUB_REPO`: Repository name.
- `GITHUB_BRANCH`: Branch to commit to. Defaults to `main` if omitted.
- `GITHUB_TOKEN`: GitHub token with repository Contents read/write permission.

For a fine-grained GitHub token, select this repository and grant `Contents: Read and write`.

## Add a Painting

1. Add an image to `public/images/paintings`.
2. Add a matching Markdown file to `content/paintings`.

Example:

```md
---
title: "Quiet Afternoon"
slug: "quiet-afternoon"
image: "/images/paintings/quiet-afternoon.jpg"
date: "2026-05-01"
materials: "Oil on canvas"
---

Write the work description here.
```

## Add a Photo

1. Add an image to `public/images/photos`.
2. Add a matching Markdown file to `content/photos`.

Example:

```md
---
title: "Morning by the Sea"
slug: "morning-by-the-sea"
image: "/images/photos/morning-by-the-sea.jpg"
date: "2026-05-01"
---

Write the photo description here.
```

## Frontmatter

- `title`: Work title. Required.
- `slug`: Used for the detail page URL, such as `/paintings/quiet-afternoon`.
- `image`: Image path from `public`. Required.
- `date`: Production or shooting date. Required. Published order uses this date, newest first.
- `materials`: Optional painting materials, such as `"Oil on canvas"`.

To publish a new work, add the image file and Markdown file, then push to GitHub. Vercel will rebuild and publish the updated gallery.

You can also publish from `/admin`, which creates those files in GitHub for you.
