<!-- FOR AI AGENTS - Human readability is a side effect, not a goal -->
<!-- Managed by agent: keep sections and order; edit content, not structure -->
<!-- Last updated: 2026-09-17 | Last verified: 2026-09-17 -->

# AGENTS.md

**Precedence:** the **closest `AGENTS.md`** to the files you're changing wins. Root holds global defaults only.

Demo repo for a talk comparing GitOps promotion tools (Kargo vs GitOps Promoter) on a DigitalOcean Kubernetes cluster, provisioned with Pulumi and bootstrapped into Argo CD (GitOps Bridge pattern).

## Commands (verified)
> Source: Pulumi.yaml, package.json, .updatecli/, this session's runs. No test suite exists.

<!-- AGENTS-GENERATED:START commands -->
| Task | Command | ~Time |
|------|---------|-------|
| Typecheck infra | `cd infra && npx tsc --noEmit -p .` | ~5s |
| Typecheck base-tools | `cd base-tools && npx tsc --noEmit -p .` | ~5s |
| Deploy cluster + ESC env | `cd infra && pulumi up --stack ediri/dev --non-interactive` | ~7m |
| Bootstrap Argo CD | `cd base-tools && pulumi up --stack ediri/dev --non-interactive` | ~3m |
| Cluster access | `pulumi env run ediri/gitops-promotion-tools/gitops-promotion-tools-do-cluster -i -- kubectl get applications -n argocd` | ~5s |
| Render a chart with repo values | `helm template argo-cd oci://ghcr.io/argoproj/argo-helm/argo-cd --version <ver> -f gitops/base-tools/argocd/argocd-values.yaml` | ~10s |
| Check chart updates | `.updatecli/test-locally.sh diff [manifest]` (needs `updatecli`) | ~30s |
<!-- AGENTS-GENERATED:END commands -->

> Argo CD deploys from GitHub `main`, not the working tree. Unpushed changes never reach the cluster.

## Workflow
1. **Before changing versions**: run `helm template` with the repo values and confirm the rendered output (catches silently ignored values).
2. **After editing `gitops/`**: parse YAML, commit, push to `main`, then watch `kubectl get applications -n argocd` until `Synced/Healthy`.
3. **Before claiming done**: show `kubectl`/`pulumi` output as evidence.

## File Map
<!-- AGENTS-GENERATED:START filemap -->
```
infra/                 -> Pulumi (TS): DOKS cluster + ESC env exposing kubeconfig
base-tools/            -> Pulumi (TS): Helm releases argo-cd + argocd-apps (bootstrap only)
base-tools/argocd-initial-objects.yaml -> app-of-apps + `infra` AppProject (argocd-apps values)
gitops/base-tools/     -> Argo CD self-management, cert-manager, rollouts, prometheus, metrics-server
gitops/promote-tools/  -> Kargo, GitOps Promoter (wave 0), promote-app Applications (wave 1)
gitops/promote-app/    -> podtato-head promotion setup per tool (ApplicationSets + tool CRs)
app/chart/             -> podtato-head Helm chart (the promoted app)
.updatecli/            -> chart version tracking; .github/workflows/updatecli.yaml runs it daily
docs/secrets-runbook.md -> every manual secret, in order
```
<!-- AGENTS-GENERATED:END filemap -->

## Golden Samples (follow these patterns)
<!-- AGENTS-GENERATED:START golden-samples -->
| For | Reference | Key patterns |
|-----|-----------|--------------|
| Helm chart via OCI | `gitops/promote-tools/kargo/kargo.yaml` | `path: .`, `ServerSideApply=true`, `CreateNamespace=true` |
| Chart + values from repo | `gitops/base-tools/argocd/argocd-app.yaml` | multi-source with `ref: values` |
| Ordered child app | `gitops/promote-tools/promote-app/podtato-head-app-kargo.yaml` | `sync-wave: "1"` + `retry` |
| Updatecli manifest | `.updatecli/updatecli.d/gitops-promoter.yaml` | source/condition/target on `$.spec.source.targetRevision` |
<!-- AGENTS-GENERATED:END golden-samples -->

## Heuristics (quick decisions)
<!-- AGENTS-GENERATED:START heuristics -->
| When | Do |
|------|-----|
| Bumping a chart | Change `targetRevision`, update `.updatecli/README.md` table, render with `helm template` |
| Changing Argo CD values | Edit `argocd-values.yaml`; mirror bootstrap-relevant values in `base-tools/index.ts` |
| New app must wait for another | Put it in the same app-of-apps with a higher `argocd.argoproj.io/sync-wave` |
| Parent app stuck `Degraded` with healthy children | Look for an app-of-apps loop; use `argocd.argoproj.io/ignore-healthcheck: "true"` |
| Anything needs a credential | Follow `docs/secrets-runbook.md`; create it on the cluster, never in git |
| Argo CD shows old state after push | `kubectl annotate application <app> -n argocd argocd.argoproj.io/refresh=hard --overwrite` |
| Upgrading GitOps Promoter / Kargo | Read the upstream upgrade guide first (v0.39 made `orderCommitStatusRef` required) |
<!-- AGENTS-GENERATED:END heuristics -->

## Key Decisions
<!-- AGENTS-GENERATED:START key-decisions -->
- Pulumi only bootstraps Argo CD (`ignoreChanges` on values); Argo CD manages itself afterwards from `gitops/`.
- The `argoproj.io/Application` health check is restored in `argocd-cm` so sync waves wait on child app health.
- GitOps Promoter is installed from the official Helm chart (not a vendored manifest); Argo CD UI extensions come from `server.extensions` (`enabled: true` is required).
- Pulumi stacks and ESC environments live in the `ediri` org; ESC imports cannot cross orgs.
<!-- AGENTS-GENERATED:END key-decisions -->

## Boundaries

### Always Do
- Use Conventional Commits (`feat:`, `fix:`, `chore:`, `docs:`); atomic commits
- Pass `--stack ediri/dev --non-interactive` to Pulumi; release a stale lock with `pulumi cancel` only if the failed update is yours
- Keep private keys in temp files (`umask 077`), never print them, delete them afterwards
- Verify rendered Helm output when a values key could be silently ignored

### Ask First
- `pulumi destroy`, deleting Applications/namespaces, or changing the DOKS version on an existing cluster (one minor step at a time)
- Changing the `ediri` org, ESC imports, or anything under `.github/workflows/`
- Removing the placeholder Kargo repo Secret from `gitops/promote-app/kargo/podtato-head-app.yaml`
- Pushing to `main` (Argo CD deploys it immediately)

### Never Do
- Commit secrets: `github-app-secret.yaml`, `*.pem`, `kubeconfig.yaml`, GitHub/Pulumi/DO tokens
- Replace the committed `xxx` Kargo password with a real token in git
- Hand-apply manifests that belong in `gitops/` (drift is reverted by self-heal)
- Edit `node_modules/`, `package-lock.json` by hand

## Codebase State
<!-- AGENTS-GENERATED:START codebase-state -->
- Demo credentials are committed on purpose: Argo CD admin bcrypt (`base-tools/index.ts`), Kargo `passwordHash`/`tokenSigningKey` (`kargo.yaml`), webhook secret placeholder. Not for real use.
- `gitops/promote-app/kargo/podtato-head-app.yaml` ships a Kargo git Secret with placeholder password `xxx` (real credential: see runbook step 7). `promote-app-kargo` is `Healthy` but `OutOfSync`; cause not yet investigated.
- `README.md` links `./kargo/` and `./gitops-promoter/`, which no longer exist.
- `base-tools/index.ts`: `argocdApps` is assigned but unused (TS6133 warning, harmless).
<!-- AGENTS-GENERATED:END codebase-state -->

## Terminology
| Term | Means |
|------|-------|
| GitOps Bridge | IaC (Pulumi) installs Argo CD once, then Argo CD owns everything |
| app-of-apps | `app-of-apps-base-tools` / `app-of-apps-promote-tools` Applications from `argocd-initial-objects.yaml` |
| Hydrator | Argo CD source hydrator: renders `app/chart` to `environment/<env>-next` branches |
| CTP | GitOps Promoter ChangeTransferPolicy (one per environment) |
| Freight / Stage | Kargo artifact bundle / promotion target |

## Scoped AGENTS.md (MUST read when working in these directories)
<!-- AGENTS-GENERATED:START scope-index -->
None. For credentials and cluster bootstrap secrets, read `docs/secrets-runbook.md`.
<!-- AGENTS-GENERATED:END scope-index -->

## When instructions conflict
The nearest `AGENTS.md` wins. Explicit user prompts override files.
