
# Manifest Hydration

To hydrate the manifests in this repository, run the following commands:

```shell

git clone https://github.com/dirien/gitops-promotion-tools-why-you-need-to-add-them-to-your-gitops-toolkit-in-2025
# cd into the cloned directory
git checkout d95294a5692e3dc17e6a03c19716e1011a0cb3b2
helm template . --name-template podtato-head-app-gitops-promoter-dev --include-crds
```