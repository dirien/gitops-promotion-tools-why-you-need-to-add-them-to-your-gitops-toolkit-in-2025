# Manifest Hydration

To hydrate the manifests in this repository, run the following commands:

```shell
git clone https://github.com/dirien/gitops-promotion-tools-why-you-need-to-add-them-to-your-gitops-toolkit-in-2025
# cd into the cloned directory
git checkout 77c3e4adc55a7db5ddbd6b6c0afa199609b840c7
helm template . --name-template podtato-head-app-gitops-promoter-prod --include-crds
```
