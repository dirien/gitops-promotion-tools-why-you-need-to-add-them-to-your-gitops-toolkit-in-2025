
# Manifest Hydration

To hydrate the manifests in this repository, run the following commands:

```shell

git clone https://github.com/dirien/gitops-promotion-tools-why-you-need-to-add-them-to-your-gitops-toolkit-in-2025
# cd into the cloned directory
git checkout 582cc9f96ca772fcd35eef83c76cbecea30b5e84
helm template . --name-template podtato-head-app-gitops-promoter-dev --include-crds
```