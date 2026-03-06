#!/usr/bin/env bash
set -eo pipefail

script_dir="$(cd "$(dirname "$0")" && pwd)"
repo_root="$(cd "$script_dir/.." && pwd)"

cd "$repo_root"

# Install dependencies
if [ -f "package-lock.json" ]; then
  npm ci
elif [ -f "package.json" ]; then
  npm install
fi

# Build if a build script exists
if npm run --silent env 2>/dev/null | grep -q 'npm_package_scripts_build'; then
  npm run build
fi
