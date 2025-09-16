---
sidebar_label: 'Simple Nginx'
sidebar_position: 1
description: "Déploiement d'un pod nginx simple"
tags: ['nginx', 'pod', 'simple']
---
import GitHubChart from '@site/src/components/GitHubChart';

# Déploiement d'un pod nginx simple
## 🔍 Aperçu

- Déploiement d'un pod nginx simple
- Déploie un service permettant d'exposer le pod au sein du cluster

### Caractéristiques clés
- ✅ **Nginx** : Permet de déployer un serveur nginx vide avec une configuration par défaut
- ✅ **Exposition** : Permet d'exposer le pod au sein du cluster (peut être accessible depuis l'ip du node en fonction de la configuration)
- ⚠️ **Limitation** : Le pod est par défaut accessible seulement par les autre pods du même cluster

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