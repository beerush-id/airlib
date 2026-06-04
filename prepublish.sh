#!/bin/bash
set -e

bun run prepublish

read -p "Enter form version (e.g., 1.0.0): " VERSION

if [ -z "$VERSION" ]; then
  echo "Error: Version cannot be empty."
  exit 1
fi

echo "Flattening peer dependencies to ^$VERSION..."

bpkg info set peerDependencies.@airlib/form="^$VERSION" -f \
  ui/react-form \
  ui/solid-form

echo "Done. Ready to publish. Remember to revert peer deps after."
