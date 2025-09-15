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

## Repository Structure

```
├── infra/                 # Pulumi infrastructure code for DigitalOcean Kubernetes cluster
├── base-tools/            # Pulumi code for installing base tools using GitOps bridge pattern
├── gitops/                # GitOps configurations and applications
│   ├── base-tools/        # Base tool configurations (ArgoCD, cert-manager, etc.)
│   ├── promote-app/       # Application promotion configurations
│   └── promote-tools/     # GitOps promotion tool configurations
├── app/                   # Sample application (Podtato Head) Helm chart
└── docs/                  # Talk slides and additional documentation
```

## Infrastructure

This repository uses **Pulumi** for Infrastructure as Code to provision:

- **DigitalOcean Kubernetes Cluster**: Complete K8s infrastructure setup
- **Pulumi ESC Environment**: Automatically creates a Pulumi ESC (Environments, Secrets, and Configuration) environment for secure configuration management
- **Base Tools Installation**: Leveraging the **GitOps Bridge Pattern** to seamlessly connect IaC-provisioned resources with GitOps-managed deployments

### Pulumi ESC Integration

This demo utilizes **Pulumi ESC** (Environments, Secrets, and Configuration) for centralized configuration management. The infrastructure automatically:

1. **Creates an ESC Environment**: Automatically provisions a Pulumi ESC environment with the same name as the Kubernetes cluster
2. **Configures Stack References**: Sets up automatic references to the infrastructure stack for seamless access to cluster configuration
3. **Manages Kubeconfig**: Automatically makes the cluster's kubeconfig available through ESC for secure access
4. **Enables Easy Access**: Provides simple commands to interact with the cluster through the ESC environment

### GitOps Bridge Pattern

The [GitOps Bridge Pattern](https://github.com/gitops-bridge-dev/gitops-bridge) bridges the gap between Infrastructure as Code (IaC) and GitOps by enabling Kubernetes administrators to:

- Use IaC tools (Pulumi) for cluster provisioning and cloud resource creation
- Automatically configure GitOps tools with metadata from IaC-provisioned resources
- Install and configure base tools (ArgoCD, cert-manager, metrics-server) through GitOps
- Maintain separation of concerns while ensuring seamless integration

### Getting Started with Infrastructure

1. **Provision Infrastructure**: Deploy DigitalOcean Kubernetes cluster and create ESC environment
   ```bash
   cd infra/
   pulumi up
   ```

2. **Access Your Cluster**: Use the automatically created Pulumi ESC environment to connect
   ```bash
   # Connect to cluster using ESC environment
   pulumi env run <project-name>/<cluster-name> -i -- kubectl
   
   # Or use k9s for interactive cluster management
   pulumi env run <project-name>/<cluster-name> -i -- k9s
   ```

3. **Install Base Tools**: Deploy foundational tools using GitOps bridge
   ```bash
   cd base-tools/
   pulumi up
   ```

4. **Access ArgoCD**: The GitOps engine will be available for managing applications and promotion workflows

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

## Contributing

This repository is part of an educational initiative to improve GitOps practices. Contributions, issues, and feature requests are welcome!

## License

This project is licensed under the Mozilla Public License Version 2.0 - see the [LICENSE](LICENSE) file for details.

