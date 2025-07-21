
# Manifest Hydration

To hydrate the manifests in this repository, run the following commands:

```shell

git clone https://github.com/dirien/gitops-promotion-tools-why-you-need-to-add-them-to-your-gitops-toolkit-in-2025
# cd into the cloned directory
git checkout ec22da170792204e7b93bfdedb49759ebaca89cf
helm template . --name-template podtato-head-app-gitops-promoter-prod --include-crds
```