
# Manifest Hydration

To hydrate the manifests in this repository, run the following commands:

```shell

git clone https://github.com/dirien/gitops-promotion-tools-why-you-need-to-add-them-to-your-gitops-toolkit-in-2025
# cd into the cloned directory
git checkout 616bbd73e1b8999c8f52c7a66a51d891fdd00c10
helm template . --name-template podtato-head-app-gitops-promoter-prod --include-crds
```