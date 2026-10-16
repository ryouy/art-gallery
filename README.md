# Art Index

A quiet gallery site built with Next.js App Router. Images live in `public/images`, and text content lives in Markdown files under `content`. No CMS or external database is required.

- Changes in admin page are committed to GitHub, then Vercel redeploys from the new commit.

## Run locally

Install the Node.js dependencies and start the Next.js development server:

```bash
npm install
npm run dev
```

Open the local URL reported by Next.js (normally `http://localhost:3000`). To check the production build before pushing:

```bash
npm run build
```

The admin interface may update `content/**` and `public/images/**` on GitHub while local work is in progress. Fetch recent remote changes before publishing so those edits are not accidentally overwritten.

## Pushing local changes

Admin edits can add commits to `content/**` and `public/images/**` directly on GitHub. To push local code changes without manually fixing those remote-managed files every time, use:

```sh
npm run sync:push
```

The script fetches `origin/main`, rebases local commits, accepts the GitHub version for conflicts under `content/` and `public/images/`, then pushes.

So if you just want push, try

```sh
git add .
git commit -m "Update site design"
npm run sync:push
```