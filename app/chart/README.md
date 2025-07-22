
# Manifest Hydration

To hydrate the manifests in this repository, run the following commands:

```shell

git clone https://github.com/dirien/gitops-promotion-tools-why-you-need-to-add-them-to-your-gitops-toolkit-in-2025
# cd into the cloned directory
git checkout 175c437f7fb99ba4962be221832b73a7f339af5d
helm template . --name-template podtato-head-app-gitops-promoter-prod --include-crds
```