---
sidebar_label: 'Spring Boot'
sidebar_position: 6
---

# Déploiement Spring Boot sur Kubernetes

Ce projet contient un fichier YAML permettant de déployer un projet Spring boot

Le déploiement crée 2 réplicas

## 📂 Contenu du projet

Contient la définition du déploiement Kubernetes avec :

- 2 pods Spring boot
- La configuration des containers et du port exposé

## 🚀 Prérequis

Avant d'utiliser ce projet, assure-toi d'avoir :

- Un cluster K3s fonctionnel
- kubectl installé

Vérifie que les pods sont bien créés :

```bash
kubectl get pods
```

## 📌 Notes

Ce déploiement ne crée pas de service exposé à l'extérieur du cluster.
Par défaut Treafik, installé avec k3s, permet d'accéder à nos pods depuis l'ip du master
Donc le nginx est accessible par l'IP du master