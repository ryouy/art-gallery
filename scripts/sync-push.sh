#!/usr/bin/env bash
set -euo pipefail

remote="${1:-origin}"
branch="${2:-$(git branch --show-current)}"
remote_ref="${remote}/${branch}"

if [[ -z "${branch}" ]]; then
  echo "Could not determine the current branch." >&2
  exit 1
fi

echo "Fetching ${remote}/${branch}..."
git fetch "${remote}" "${branch}:refs/remotes/${remote}/${branch}"

if git merge-base --is-ancestor "${remote_ref}" HEAD; then
  echo "Local branch already contains ${remote_ref}."
elif git merge-base --is-ancestor HEAD "${remote_ref}"; then
  echo "Fast-forwarding to ${remote_ref}..."
  git merge --ff-only "${remote_ref}"
else
  echo "Rebasing local commits onto ${remote_ref}..."
  if ! git rebase --autostash "${remote_ref}"; then
    while true; do
      conflicted_paths="$(git diff --name-only --diff-filter=U)"

      if [[ -z "${conflicted_paths}" ]]; then
        GIT_EDITOR=true git rebase --continue && break
        continue
      fi

      unsupported_paths="$(
        printf "%s\n" "${conflicted_paths}" |
          grep -Ev '^(content/|public/images/)' || true
      )"

      if [[ -n "${unsupported_paths}" ]]; then
        echo "Rebase stopped on conflicts outside remote-managed folders:" >&2
        printf "%s\n" "${unsupported_paths}" >&2
        echo "Resolve them, then run: git rebase --continue" >&2
        exit 1
      fi

      echo "Using remote versions for remote-managed conflicts:"
      printf "%s\n" "${conflicted_paths}"
      printf "%s\n" "${conflicted_paths}" | xargs git checkout --ours --
      printf "%s\n" "${conflicted_paths}" | xargs git add --

      GIT_EDITOR=true git rebase --continue || true

      if ! git status --short | grep -q '^UU '; then
        if ! git rebase --show-current-patch >/dev/null 2>&1; then
          break
        fi
      fi
    done
  fi
fi

echo "Pushing ${branch} to ${remote}..."
git push "${remote}" "${branch}"
