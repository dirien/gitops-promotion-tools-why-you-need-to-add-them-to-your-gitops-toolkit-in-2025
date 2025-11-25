# Manifest Hydration

To hydrate the manifests in this repository, run the following commands:

```shell
git clone https://github.com/dirien/gitops-promotion-tools-why-you-need-to-add-them-to-your-gitops-toolkit-in-2025
# cd into the cloned directory
git checkout 60c8a83ccaa0615468d500ebf110cd0341bda0e3
helm template . --name-template podtato-head-app-gitops-promoter-dev --include-crds
```
