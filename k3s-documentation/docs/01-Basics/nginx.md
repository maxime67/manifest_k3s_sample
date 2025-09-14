---
sidebar_label: 'Nginx'
sidebar_position: 1
---
import GitHubChart from '@site/src/components/GitHubChart';

# Déploiement Nginx sur Kubernetes

Ce projet contient un Chart permettant de déployer un serveur Nginx minimal (basé sur l'image nginx:alpine) dans un cluster Kubernetes.

Le déploiement crée 2 réplicas

## 📂 Contenu du projet

<GitHubChart
repo="maxime67/manifest_k3s_sample"
path="01-basics/nginx"
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

Une application ArgoCD te permet de déployer l'application:

```bash
kubectl apply -f 01-basics/nginx/argocd/argocd-nginx.yaml
```

Vérifie que les pods sont bien créés :

```bash
kubectl get pods
```