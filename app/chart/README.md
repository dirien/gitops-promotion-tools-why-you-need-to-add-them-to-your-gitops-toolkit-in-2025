# Manifest Hydration

To hydrate the manifests in this repository, run the following commands:

```shell
git clone https://github.com/dirien/gitops-promotion-tools-why-you-need-to-add-them-to-your-gitops-toolkit-in-2025
# cd into the cloned directory
git checkout 1c75459e0316f0f2268739a87005e7f4ec6f9945
helm template . --name-template podtato-head-app-gitops-promoter-prod --include-crds
```
