---
sidebar_label: 'Spring Boot'
sidebar_position: 6
---
import GitHubChart from '@site/src/components/GitHubChart';

# Déploiement Spring Boot sur Kubernetes

Ce projet contient un fichier YAML permettant de déployer un projet Spring boot

Le déploiement crée 2 réplicas

## 🔍 Caractéristiques

- **Image** : `postgres:15`
- **Service** : ClusterIP (accessible uniquement depuis l'intérieur du cluster)
- **Stockage** : EmptyDir (temporaire)
- **Variables** : Configurées via Secrets Kubernetes


## 📂 Contenu du projet

<GitHubChart
repo="maxime67/manifest_k3s_sample"
path="01-basics/spring-boot"
files={[
'Chart.yaml',
'values.yaml',
'templates/deployment.yaml',
'templates/service.yaml',
]}
/>

## 🚀 Prérequis

Avant d'utiliser ce projet, assure-toi d'avoir :

- Un cluster K3s fonctionnel
- kubectl installé

## Mise en place

1. Une application ArgoCD te permet de déployer l'application:

```bash
kubectl apply -f 01-basics/spring-boot/argocd/argocd-spring-boot.yaml
```

2. vérifier la présence des pods
```bash
kubectl get pods
```