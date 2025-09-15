# Manifest Hydration

To hydrate the manifests in this repository, run the following commands:

```shell
git clone https://github.com/dirien/gitops-promotion-tools-why-you-need-to-add-them-to-your-gitops-toolkit-in-2025
# cd into the cloned directory
git checkout f451fb65a58c933cbd42e03734aa44b69dae098d
helm template . --name-template podtato-head-app-gitops-promoter-prod --include-crds
```
