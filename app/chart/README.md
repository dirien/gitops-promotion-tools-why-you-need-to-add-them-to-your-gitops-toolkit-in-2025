
# Manifest Hydration

To hydrate the manifests in this repository, run the following commands:

```shell

git clone https://github.com/dirien/gitops-promotion-tools-why-you-need-to-add-them-to-your-gitops-toolkit-in-2025
# cd into the cloned directory
git checkout f530ea51123061fbf05af37773c604e1c25c4cd0
helm template . --name-template podtato-head-app-gitops-promoter-dev --include-crds
```