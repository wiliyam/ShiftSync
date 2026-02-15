#!/bin/bash
# Setup script to install TDD git hooks

set -e

echo "🔧 Setting up TDD Git Hooks..."
echo ""

# Get the git hooks directory
GIT_HOOKS_DIR=".git/hooks"

if [ ! -d "$GIT_HOOKS_DIR" ]; then
    echo "❌ Error: Not a git repository or .git/hooks directory not found"
    exit 1
fi

# Create symlinks to our custom hooks
HOOKS=("pre-commit" "commit-msg" "post-commit")

for hook in "${HOOKS[@]}"; do
    SOURCE_HOOK=".ai/hooks/$hook"
    TARGET_HOOK="$GIT_HOOKS_DIR/$hook"

    if [ -f "$TARGET_HOOK" ] || [ -L "$TARGET_HOOK" ]; then
        echo "⚠️  $hook already exists"
        read -p "   Overwrite? (y/N): " -n 1 -r
        echo ""
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            echo "   Skipping $hook"
            continue
        fi
        rm "$TARGET_HOOK"
    fi

    # Create symlink
    ln -s "../../$SOURCE_HOOK" "$TARGET_HOOK"
    echo "✅ Installed $hook"
done

echo ""
echo "✨ Git hooks installed successfully!"
echo ""
echo "Installed hooks:"
echo "  📋 pre-commit   - Runs tests and checks coverage before commit"
echo "  💬 commit-msg   - Enforces conventional commit message format"
echo "  📝 post-commit  - Logs commits to development.jsonl"
echo ""
echo "TDD Workflow:"
echo "  1. 🔴 RED:      Write failing test → commit with 'test:' prefix"
echo "  2. 🟢 GREEN:    Make test pass → commit with 'feat:' prefix"
echo "  3. 🔵 REFACTOR: Improve code → commit with 'refactor:' prefix"
echo ""
echo "To bypass hooks (not recommended):"
echo "  git commit --no-verify"
echo ""
echo "Happy TDD! 🧪"
