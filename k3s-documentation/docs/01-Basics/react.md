---
sidebar_label: 'React'
sidebar_position: 5
---
import GitHubChart from '@site/src/components/GitHubChart';

# Déploiement Nginx sur Kubernetes

Ce projet contient un CHart permettant de déployer un serveur Nginx contenant un projet react minimal (basé sur l'image nginx:stable-alpine) dans un cluster Kubernetes.

Le déploiement crée 2 réplicas

## 📂 Contenu du projet

<GitHubChart
repo="maxime67/manifest_k3s_sample"
path="01-basics/react"
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
kubectl apply -f 01-basics/postgresql/argocd/argocd-postgre_memory.yaml
```

2. Vérifie la création des pods:
```bash
kubectl get pod -n react
```

## 📌 Notes

Ce déploiement ne crée pas de service exposé à l'extérieur du cluster.
Par défaut Treafik, installé avec k3s, permet d'accéder à nos pods depuis l'ip du master
Donc le nginx est accessible par l'IP du master