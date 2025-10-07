# Manifest Hydration

To hydrate the manifests in this repository, run the following commands:

```shell
git clone https://github.com/dirien/gitops-promotion-tools-why-you-need-to-add-them-to-your-gitops-toolkit-in-2025
# cd into the cloned directory
git checkout b5c739e7569e14b80606f22883ce27551de9c56c
helm template . --name-template podtato-head-app-gitops-promoter-prod --include-crds
```
