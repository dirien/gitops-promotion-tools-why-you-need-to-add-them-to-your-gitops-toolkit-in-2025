
# Manifest Hydration

To hydrate the manifests in this repository, run the following commands:

```shell

git clone https://github.com/dirien/gitops-promotion-tools-why-you-need-to-add-them-to-your-gitops-toolkit-in-2025
# cd into the cloned directory
git checkout a575435621f156fff45445c9c658faca023ec5ba
helm template . --name-template podtato-head-app-gitops-promoter-prod --include-crds
```