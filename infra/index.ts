import * as pulumi from "@pulumi/pulumi";
import * as digitalocean from "@pulumi/digitalocean";

const clusterRegion = "fra1";
const nodePoolName = "default";
const nodeCount = 1;
const version = "1.33.1-do.1";
const doCluster = new digitalocean.KubernetesCluster("do-cluster", {
  region: clusterRegion,
  version: version,
  destroyAllAssociatedResources: true,
  nodePool: {
    name: nodePoolName,
    size: "s-4vcpu-8gb",
    nodeCount: nodeCount,
  },
});

export const name = doCluster.name;
export const kubeconfig = doCluster.kubeConfigs.apply(kubeConfigs => kubeConfigs[0].rawConfig);
