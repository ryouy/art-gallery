# Art Index

A quiet gallery site built with Next.js App Router. Images live in `public/images`, and text content lives in Markdown files under `content`. No CMS or external database is required.

- Changes in admin page are committed to GitHub, then Vercel redeploys from the new commit.

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