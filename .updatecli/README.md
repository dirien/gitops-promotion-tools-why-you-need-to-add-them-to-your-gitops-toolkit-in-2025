# Updatecli Configuration

This directory contains Updatecli manifests to automatically track and update Helm chart versions used in this repository.

## Overview

Updatecli is a declarative update automation tool that helps keep dependencies up-to-date. The configurations in this directory monitor Helm charts and automatically create pull requests when new versions are available.

## Monitored Charts

### Base Tools (`gitops/base-tools/`)

| Tool | Current Version | Helm Repository | Manifest |
|------|----------------|-----------------|----------|
| ArgoCD | 8.5.9 | https://argoproj.github.io/argo-helm | `argocd.yaml` |
| ArgoCD Apps | 2.0.2 | https://argoproj.github.io/argo-helm | `argocd.yaml` |
| Argo Rollouts | 2.40.4 | https://argoproj.github.io/argo-helm | `argo-rollouts.yaml` |
| Cert-Manager | v1.18.2 | https://charts.jetstack.io | `cert-manager.yaml` |
| Metrics Server | 3.13.0 | https://kubernetes-sigs.github.io/metrics-server/ | `metrics-server.yaml` |

### Promote Tools (`gitops/promote-tools/`)

| Tool | Current Version | Registry | Manifest |
|------|----------------|----------|----------|
| Kargo | 1.7.5 | oci://ghcr.io/akuity/kargo-charts | `kargo.yaml` |

## Configuration Structure

Each manifest follows the Updatecli pattern:

1. **Sources**: Defines where to fetch the latest version (Helm chart repositories)
2. **Conditions**: Validates that the version exists and is published
3. **Targets**: Specifies which YAML files to update and the exact path to the version field
4. **SCMs**: Configures GitHub integration for creating pull requests
5. **Actions**: Defines how to create pull requests with appropriate labels

## Usage

### Local Testing

Test the configurations locally:

```bash
# Check for available updates (dry-run)
updatecli diff --config .updatecli/updatecli.d/

# Show what would be updated
updatecli apply --config .updatecli/updatecli.d/ --dry-run

# Apply updates locally (without creating PRs)
updatecli apply --config .updatecli/updatecli.d/
```

### Test a Specific Manifest

```bash
# Test ArgoCD updates
updatecli diff --config .updatecli/updatecli.d/argocd.yaml

# Test Kargo updates
updatecli diff --config .updatecli/updatecli.d/kargo.yaml
```

### GitHub Actions Integration

The recommended approach is to run Updatecli via GitHub Actions. Create a workflow file at `.github/workflows/updatecli.yaml`:

```yaml
name: Updatecli

on:
  schedule:
    # Run every day at 8:00 AM UTC
    - cron: '0 8 * * *'
  workflow_dispatch: # Allow manual triggers

permissions:
  contents: write
  pull-requests: write

jobs:
  updatecli:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Install Updatecli
        uses: updatecli/updatecli-action@v2

      - name: Run Updatecli
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          GITHUB_ACTOR: ${{ github.actor }}
          GITHUB_REPOSITORY_OWNER: ${{ github.repository_owner }}
          GITHUB_REPOSITORY_NAME: ${{ github.event.repository.name }}
        run: |
          updatecli apply --config .updatecli/updatecli.d/
```

### Environment Variables

The manifests use the following environment variables (automatically set by GitHub Actions):

- `GITHUB_TOKEN`: Authentication token for GitHub API
- `GITHUB_ACTOR`: GitHub username running the action
- `GITHUB_REPOSITORY_OWNER`: Repository owner
- `GITHUB_REPOSITORY_NAME`: Repository name

## How It Works

1. **Detection**: Updatecli checks Helm repositories for the latest versions
2. **Validation**: Conditions ensure the version exists and is properly published
3. **Update**: If a new version is found, it updates the `targetRevision` field in the ArgoCD Application manifests
4. **Pull Request**: Creates a PR with the changes, labeled with `dependencies` and `updatecli`

## Pull Request Behavior

When updates are found:
- A new PR is created for each manifest with updates
- PRs are labeled with `dependencies` and `updatecli`
- PR title follows the pattern: `[updatecli] Update <Chart Name> Helm Chart`
- Multiple updates in the same manifest are grouped in a single PR

## Customization

### Version Constraints

To pin to specific major versions, modify the source spec:

```yaml
sources:
  chart-version:
    kind: helmchart
    spec:
      url: https://example.com/charts
      name: my-chart
      versionfilter:
        kind: semver
        pattern: "~1.0.0"  # Only 1.x versions
```

### Update Frequency

Modify the cron schedule in the GitHub Actions workflow:
- Daily: `0 8 * * *`
- Weekly: `0 8 * * 1` (Mondays)
- Twice daily: `0 8,20 * * *`

### Auto-merge

To enable auto-merge for dependency updates, add to your workflow:

```yaml
- name: Enable auto-merge
  if: success()
  env:
    GH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
  run: |
    gh pr merge --auto --squash
```

## Troubleshooting

### OCI Registry Issues

If Kargo updates fail, ensure:
- The OCI registry is publicly accessible
- The chart name is correct in the URL

### JSONPath Issues

If target updates fail:
- Verify the JSONPath expression matches your YAML structure
- Use `yq` to test: `yq eval '.spec.source.targetRevision' file.yaml`

### Authentication

For private registries, add credentials to the source spec:

```yaml
sources:
  chart-version:
    kind: helmchart
    spec:
      url: oci://private.registry.com
      name: chart-name
      username: "{{ .Values.username }}"
      password: "{{ .Values.password }}"
```

## Resources

- [Updatecli Documentation](https://www.updatecli.io/docs/)
- [Updatecli GitHub](https://github.com/updatecli/updatecli)
- [Helm Chart Source Plugin](https://www.updatecli.io/docs/plugins/resource/helmchart/)
- [YAML Target Plugin](https://www.updatecli.io/docs/plugins/resource/yaml/)
