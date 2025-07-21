# GitOps Promotion Tools: Why You Need to Add Them to Your GitOps Toolkit in 2025!

> Demo repository for the talk showcasing GitOps promotion tools and patterns.

## About This Repository

This repository contains the demo code, examples, and practical implementations used in the talk **"GitOps Promotion Tools: Why You Need to Add Them to Your GitOps Toolkit in 2025!"**

Each directory contains working examples and demonstrations of how to implement GitOps promotion workflows using different tools, moving beyond traditional CI/CD approaches to embrace true GitOps principles for environment promotion.

## The Problem We're Solving

GitOps agents like Argo CD or Flux excel at maintaining desired state within a single environment, but they don't provide clear patterns for promoting changes between environments. This often leads to:

- Bloated CI pipelines handling promotion logic
- Drift from GitOps principles
- Complex, error-prone promotion processes

This repository demonstrates how **GitOps Promotion Tools** solve these challenges by bringing promotion back into the GitOps paradigm.

## Demo Tools & Examples

This repository includes hands-on demonstrations of three GitOps promotion tools:

### [Kargo](./kargo/)
Complete setup and demo scenarios showing multi-environment GitOps promotion workflows.

### [GitOps Promoter](./gitops-promoter/)
Working examples of Argo CD-native promotion patterns and configurations.

### [Telefonistka](./telefonistka/)
Practical implementations of automated GitOps promotion workflows.

## Repository Structure

```
├── kargo/                 # Kargo demo setup and examples
├── gitops-promoter/       # GitOps Promoter demo configurations
├── telefonistka/          # Telefonistka demo implementations
├── docs/                  # Talk slides and additional documentation
└── examples/              # Common patterns and use cases
```

## Getting Started

Each tool directory contains:
- Complete setup instructions
- Working demo scenarios
- Configuration examples
- Step-by-step guides

Start with any tool directory to explore different approaches to GitOps promotion.

## Related Tools & Technologies

- [Argo CD](https://argoproj.github.io/cd/) - Declarative GitOps CD for Kubernetes
- [Flux](https://fluxcd.io/) - GitOps toolkit for Kubernetes
- [Kargo](https://kargo.io/) - GitOps promotion tool
- [GitOps Promoter](https://github.com/argoproj-labs/gitops-promoter) - Argo CD promotion tool
- [Telefonistka](https://github.com/wayfair-incubator/telefonistka) - GitOps promotion automation

## Contributing

This repository is part of an educational initiative to improve GitOps practices. Contributions, issues, and feature requests are welcome!

## License

This project is licensed under the Mozilla Public License Version 2.0 - see the [LICENSE](LICENSE) file for details.

