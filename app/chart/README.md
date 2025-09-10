
# Manifest Hydration

To hydrate the manifests in this repository, run the following commands:

```shell

git clone https://github.com/dirien/gitops-promotion-tools-why-you-need-to-add-them-to-your-gitops-toolkit-in-2025
# cd into the cloned directory
git checkout 399ba1f856e981a03dc4a1a0640ad59f6a1677f8
helm template . --name-template podtato-head-app-gitops-promoter-qs --include-crds
```