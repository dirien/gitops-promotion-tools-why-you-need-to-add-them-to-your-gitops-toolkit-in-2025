
# Manifest Hydration

To hydrate the manifests in this repository, run the following commands:

```shell

git clone https://github.com/dirien/gitops-promotion-tools-why-you-need-to-add-them-to-your-gitops-toolkit-in-2025
# cd into the cloned directory
git checkout 318522b73114518b365468c9a81405c1b1b05423
helm template . --name-template podtato-head-app-gitops-promoter-dev --include-crds
```