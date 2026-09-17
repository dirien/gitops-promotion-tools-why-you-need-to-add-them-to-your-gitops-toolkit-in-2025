import * as k8s from "@pulumi/kubernetes";
import * as pulumi from "@pulumi/pulumi";

const argoCD = new k8s.helm.v3.Release("argo-cd", {
    name: "argo-cd",
    chart: "oci://ghcr.io/argoproj/argo-helm/argo-cd",
    createNamespace: true,
    namespace: "argocd",
    values: {
        dex: {
            enabled: false
        },
        configs: {
            cm: {
                // Restore Application health so app-of-apps sync waves wait for child apps
                "resource.customizations.health.argoproj.io_Application": `hs = {}
hs.status = "Progressing"
hs.message = ""
if obj.status ~= nil then
  if obj.status.health ~= nil then
    hs.status = obj.status.health.status
    if obj.status.health.message ~= nil then
      hs.message = obj.status.health.message
    end
  end
end
return hs
`,
            },
            params: {
                // Enable hydrator for source hydration pattern
                "hydrator.enabled": "true",
                // Reduce polling interval when using webhooks (optimization)
                "timeout.reconciliation": "60s",
            },
            secret: {
                argocdServerAdminPassword: "$2a$10$5vm8wXaSdbuff0m9l21JdevzXBzJFPCi8sy6OOnpZMAG.fOXL7jvO",
                // GitHub webhook secret for authenticating webhook requests
                // IMPORTANT: Change this to a secure random string and configure the same in GitHub webhook
                "webhook.github.secret": "change-me-to-a-secure-random-string",
            }
        },
        notifications: {
            enabled: false
        },
        server: {
            service: {
                type: "LoadBalancer",
            },
            extensions: {
                enabled: true,
                extensionList: [
                    {
                        name: "rollout-extension",
                        env: [
                            {
                                name: "EXTENSION_URL",
                                value: "https://github.com/argoproj-labs/rollout-extension/releases/download/v0.4.0/extension.tar"
                            }
                        ],
                    },
                ]
            }
        },
    }
}, {
    ignoreChanges: ["checksum", "version", "values"],
});

const argocdApps = new k8s.helm.v3.Release("argocd-apps", {
    name: "argocd-apps",
    chart: "oci://ghcr.io/argoproj/argo-helm/argocd-apps",
    namespace: argoCD.namespace,
    createNamespace: false,
    valueYamlFiles: [
        new pulumi.asset.FileAsset("./argocd-initial-objects.yaml")
    ],
}, {
    dependsOn: argoCD,
    ignoreChanges: ["checksum"],
});
