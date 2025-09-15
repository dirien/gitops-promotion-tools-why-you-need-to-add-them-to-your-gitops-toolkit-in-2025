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
            secret: {
                argocdServerAdminPassword: "$2a$10$5vm8wXaSdbuff0m9l21JdevzXBzJFPCi8sy6OOnpZMAG.fOXL7jvO",
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
                extensionList: [
                    {
                        name: "rollout-extension",
                        env: [
                            {
                                name: "EXTENSION_URL",
                                value: "https://github.com/argoproj-labs/rollout-extension/releases/download/v0.3.7/extension.tar"
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
