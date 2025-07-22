
# Manifest Hydration

To hydrate the manifests in this repository, run the following commands:

```shell

git clone https://github.com/dirien/gitops-promotion-tools-why-you-need-to-add-them-to-your-gitops-toolkit-in-2025
# cd into the cloned directory
git checkout a6cb49bd0074cfa031cee2a7cbfcf574637f0e7a
helm template . --name-template podtato-head-app-gitops-promoter-dev --include-crds
```