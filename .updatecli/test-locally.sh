#!/bin/bash

# Test Updatecli configurations locally
# This script helps you test Updatecli manifests without creating PRs

set -e

echo "🔍 Updatecli Local Testing Script"
echo "=================================="
echo ""

# Check if updatecli is installed
if ! command -v updatecli &> /dev/null; then
    echo "❌ Updatecli is not installed!"
    echo ""
    echo "Install it using one of the following methods:"
    echo ""
    echo "macOS (Homebrew):"
    echo "  brew install updatecli/updatecli/updatecli"
    echo ""
    echo "Linux:"
    echo "  curl -L -o updatecli https://github.com/updatecli/updatecli/releases/latest/download/updatecli_Linux_x86_64"
    echo "  chmod +x updatecli"
    echo "  sudo mv updatecli /usr/local/bin/"
    echo ""
    echo "Windows (Chocolatey):"
    echo "  choco install updatecli"
    echo ""
    exit 1
fi

echo "✅ Updatecli is installed: $(updatecli version)"
echo ""

# Parse command line arguments
ACTION="${1:-diff}"
MANIFEST="${2:-all}"

case "$ACTION" in
    diff)
        echo "📊 Checking for available updates..."
        ;;
    apply)
        echo "⚠️  This will apply updates locally (no PR will be created)"
        read -p "Continue? (y/N) " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            echo "Cancelled."
            exit 0
        fi
        ;;
    *)
        echo "Usage: $0 [diff|apply] [all|argocd|kargo|cert-manager|metrics-server|argo-rollouts]"
        exit 1
        ;;
esac

echo ""

# Determine which manifests to run
if [ "$MANIFEST" = "all" ]; then
    CONFIG_PATH=".updatecli/updatecli.d/"
    echo "🎯 Testing all manifests in $CONFIG_PATH"
else
    CONFIG_PATH=".updatecli/updatecli.d/${MANIFEST}.yaml"
    if [ ! -f "$CONFIG_PATH" ]; then
        echo "❌ Manifest not found: $CONFIG_PATH"
        exit 1
    fi
    echo "🎯 Testing manifest: $CONFIG_PATH"
fi

echo ""
echo "─────────────────────────────────"
echo ""

# Run updatecli
if [ "$ACTION" = "diff" ]; then
    updatecli diff --config "$CONFIG_PATH"
else
    updatecli apply --config "$CONFIG_PATH"
fi

echo ""
echo "─────────────────────────────────"
echo ""
echo "✅ Done!"
echo ""

if [ "$ACTION" = "diff" ]; then
    echo "To apply these updates locally, run:"
    echo "  $0 apply $MANIFEST"
    echo ""
    echo "Note: Local apply won't create pull requests."
    echo "Use GitHub Actions for automated PR creation."
fi
