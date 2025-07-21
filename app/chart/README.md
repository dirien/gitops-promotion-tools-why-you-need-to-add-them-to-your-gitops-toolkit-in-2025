
# Manifest Hydration

To hydrate the manifests in this repository, run the following commands:

```shell

git clone https://github.com/dirien/gitops-promotion-tools-why-you-need-to-add-them-to-your-gitops-toolkit-in-2025
# cd into the cloned directory
git checkout 0cc037e0a981f2f0935da5679534829e4d66c1d4
helm template . --name-template podtato-head-app-gitops-promoter-dev --include-crds
```