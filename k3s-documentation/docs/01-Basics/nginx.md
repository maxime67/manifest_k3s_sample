---
sidebar_label: 'Nginx'
sidebar_position: 1
---

# Déploiement Nginx sur Kubernetes

Ce projet contient un Chart permettant de déployer un serveur Nginx minimal (basé sur l'image nginx:alpine) dans un cluster Kubernetes.

Le déploiement crée 2 réplicas

## 📂 Contenu du projet

Contient la définition du déploiement Kubernetes avec :

- 2 pods Nginx
- La configuration des containers et du port exposé
- Un service "NodePort" permettant d'exposer les pods à partir de l'ip du master

## 🚀 Prérequis

Avant d'utiliser ce projet, assure-toi d'avoir :

- Un cluster K3s fonctionnel
- kubectl installé

Vérifie que les pods sont bien créés :

```bash
kubectl get pods
```