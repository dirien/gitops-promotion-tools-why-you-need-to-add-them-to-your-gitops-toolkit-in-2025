# Manifest Hydration

To hydrate the manifests in this repository, run the following commands:

```shell
git clone https://github.com/dirien/gitops-promotion-tools-why-you-need-to-add-them-to-your-gitops-toolkit-in-2025
# cd into the cloned directory
git checkout 79bd08e688d75e2aa057455a3d2657c506f84e7b
helm template . --name-template podtato-head-app-gitops-promoter-dev --include-crds
```
