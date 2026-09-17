<!-- FOR AI AGENTS - verified against a fresh bootstrap on 2026-09-17 -->

# Secrets runbook

Every credential this demo needs, in the order an agent has to set them up. It assumes a fresh cluster and that `gitops/promote-app/gitops-promoter/github-app-secret.yaml` does **not** exist. No secret value ever goes into git.

| # | Credential | Lives in | Who creates it | Symptom when missing |
|---|------------|----------|----------------|----------------------|
| 1 | Pulumi access token | agent environment | user | `pulumi` commands fail to authenticate |
| 2 | GitHub push access (for this repo) | agent environment | user | `git push` fails |
| 3 | DigitalOcean token | ESC env `ediri/pulumi-idp/auth` | user | `infra` `pulumi up` fails on the cluster |
| 4 | GitHub App + private key | GitHub, key file on disk | user | everything in steps 5-7 blocked |
| 5 | GitOps Promoter SCM secret | `promoter-system/my-gitops-promoter-app` | agent | `promote-app-gitops-promoter` Degraded, no CTP progress |
| 6 | Argo CD hydrator write credential | `argocd/github-app-repo-write` | agent | hydrator: `could not read Username for 'https://github.com'` |
| 7 | Kargo git credential | `podtato-head-app/<name>` | agent | Kargo promotions cannot push `stage/*` branches |

## 1. Pulumi access token (agent environment)

- Stacks and ESC environments are in the **`ediri`** org. Check with `pulumi whoami -v` and `pulumi org get-default`.
- **Docker `sbx` sandbox with the infrastructure kit:** the kit's `pulumi` service credential overwrites every `Authorization` header to `api.pulumi.com`. `pulumi preview`, `whoami` and `env` work, but `pulumi up` fails a second in with `pre-step event returned an error: this command requires logging in`, because Pulumi's `update-token` header gets replaced. Workaround, until the kit is fixed (docker/sbx-releases#596):
  1. The user creates a short-lived Pulumi token and writes it into the sandbox from the host:
     `sbx exec -d <sandbox> bash -c "printf 'export PULUMI_ACCESS_TOKEN=%s\n' \"$TOKEN\" >> /etc/sandbox-persistent.sh"`
  2. The agent sends `api.pulumi.com` around the proxy by appending a guarded block to `/etc/sandbox-persistent.sh` that adds `api.pulumi.com` to `NO_PROXY`/`no_proxy`.
  3. Verify from a new shell: a fake token must now get `401`, and `pulumi login` must succeed.
  4. Remove both blocks and revoke the token when done.
- A failed `pulumi up` leaves the stack locked. Run `pulumi cancel --stack ediri/dev --yes` only for your own failed update.

## 2. GitHub push access

Argo CD deploys from `main` on GitHub, so every change must be pushed. In an `sbx` sandbox the user provides this with `sbx secret set github`. Never ask for a token in chat.

## 3. DigitalOcean token (ESC)

- `infra/Pulumi.dev.yaml` imports `pulumi-idp/auth` (org `ediri`), which must provide `DIGITALOCEAN_ACCESS_TOKEN`. The infra stack creates `ediri/gitops-promotion-tools/gitops-promotion-tools-do-cluster`, which imports the same env and adds the kubeconfig.
- Do not import environments from another org (for example `dirien/...`): the ESC resource fails with `environment ... not found`.
- Verify: `pulumi env run pulumi-idp/auth -- sh -c 'curl -s -H "Authorization: Bearer $DIGITALOCEAN_ACCESS_TOKEN" https://api.digitalocean.com/v2/kubernetes/options'` returns versions, not `Unauthorized`.

## 4. GitHub App (user action in the GitHub UI)

The agent cannot create or approve this. Ask the user for:

- A GitHub App installed on `dirien/gitops-promotion-tools-why-you-need-to-add-them-to-your-gitops-toolkit-in-2025` with repository permissions **Checks: Read and write**, **Contents: Read and write**, **Pull requests: Read and write** (Metadata: read is implicit).
- **Accepting updated permissions on the installation.** Changing the App's permissions does not change existing installations until the owner approves the request under Settings → Applications → Installed GitHub Apps → Configure.
- The **App ID** and **installation ID**. They are not secret and are in `gitops/promote-app/gitops-promoter/podtato-head-app.yaml` (`ScmProvider.spec.github`).
- The **path to a private key `.pem`** generated in the App settings. Keep it outside the repo, or under a gitignored name.

Verify the installation really has the permissions. This authenticates as the App with a JWT; in an `sbx` sandbox `api.github.com` must bypass the proxy (`--noproxy api.github.com`) or the `github` secret overwrites the JWT:

```bash
# JWT: RS256, iss=<APP_ID>, iat=now-60, exp=now+540, signed with the .pem (node crypto or openssl)
curl -s --noproxy api.github.com -H "Authorization: Bearer $JWT" \
  https://api.github.com/app/installations/<INSTALLATION_ID> | jq .permissions
# expect: checks, contents, pull_requests = write
```

## 5. GitOps Promoter SCM secret

Create it after the `gitops-promoter` app has created the `promoter-system` namespace:

```bash
E=ediri/gitops-promotion-tools/gitops-promotion-tools-do-cluster
pulumi env run $E -i -- kubectl create secret generic my-gitops-promoter-app -n promoter-system \
  --from-file=githubAppPrivateKey=<path-to-pem>
```

- The name must match `ScmProvider.spec.secretRef.name`; the key must be `githubAppPrivateKey`.
- Verify: the promoter logs show `ls-remote called` without errors, and `kubectl get promotionstrategy -n promoter-system` shows `READY=True`.
- `403 Resource not accessible by integration` on `.../check-runs` means the **Checks** permission is missing on the installation (step 4). No restart is needed after accepting it.

## 6. Argo CD hydrator write credential

The source hydrator pushes rendered manifests and git notes to `environment/<env>-next`. It needs a write credential in `argocd`:

```bash
pulumi env run $E -i -- bash -c '
kubectl create secret generic github-app-repo-write -n argocd \
  --from-literal=url=https://github.com/dirien/gitops-promotion-tools-why-you-need-to-add-them-to-your-gitops-toolkit-in-2025 \
  --from-literal=type=git \
  --from-literal=githubAppID=<APP_ID> \
  --from-literal=githubAppInstallationID=<INSTALLATION_ID> \
  --from-file=githubAppPrivateKey=<path-to-pem> &&
kubectl label secret github-app-repo-write -n argocd argocd.argoproj.io/secret-type=repository-write'
```

Verify: `kubectl get application podtato-head-app-gitops-promoter-dev -n argocd -o jsonpath='{.status.sourceHydrator.currentOperation.phase}'` becomes `Hydrated`.

## 7. Kargo git credential

Kargo promotions push `stage/<env>` branches. Kargo reads Secrets labelled `kargo.akuity.io/cred-type: git` in the Project namespace `podtato-head-app` (created by the Kargo `Project`, sync wave -1). Supported GitHub App keys (Kargo 1.11): `githubAppID` or `githubAppClientID`, `githubAppPrivateKey`, `githubAppInstallationID`, `repoURL`.

```bash
pulumi env run $E -i -- bash -c '
kubectl create secret generic podtato-head-app-github-app -n podtato-head-app \
  --from-literal=repoURL=https://github.com/dirien/gitops-promotion-tools-why-you-need-to-add-them-to-your-gitops-toolkit-in-2025.git \
  --from-literal=githubAppID=<APP_ID> \
  --from-literal=githubAppInstallationID=<INSTALLATION_ID> \
  --from-file=githubAppPrivateKey=<path-to-pem> &&
kubectl label secret podtato-head-app-github-app -n podtato-head-app kargo.akuity.io/cred-type=git'
```

Caveat: git also contains the Secret `podtato-head-app-repo` for the same `repoURL`, with placeholder password `xxx`, and Argo CD self-heals it. With two credentials for one URL it is not documented which one Kargo uses. Ask the user before removing the placeholder Secret from `gitops/promote-app/kargo/podtato-head-app.yaml`.

## Handling rules for agents

- Extract key material into a `mktemp` file under `umask 077` and `rm` it right after use. Never `cat`, `echo` or log it; confirm success via key names or lengths only.
- Never commit: `*.pem`, `github-app-secret.yaml`, `kubeconfig.yaml`, tokens. `.gitignore` covers `github-app-secret.yaml`, `kubeconfig.yaml` and one specific `.pem` name only.
- Cluster secrets are lost with the cluster. After every new `infra` deploy, repeat steps 5-7.
