---
title: "Application React"
description: "Guide de déploiement Application React"
weight: 40
cascade:
  - type: "docs"
---


> **💡 Info**
**Configuration disponible :**
- [Voir les fichiers YAML](/files/)
- [Repository GitHub](https://github.com/maxime67/manifest_k3s_sample)


# Déploiement Nginx sur Kubernetes
Ce projet contient un CHart permettant de déployer un serveur Nginx contenant un projet react minimal (basé sur l’image nginx:stable-alpine) dans un cluster Kubernetes.

Le déploiement crée 2 réplicas

📂 Contenu du projet 

Contient la définition du déploiement Kubernetes avec :

- 2 pods Nginx

- La configuration des containers et du port exposé 

🚀 Prérequis

Avant d’utiliser ce projet, assure-toi d’avoir :

- Un cluster K3s fonctionnel

- kubectl installé

📌 Notes 

Ce déploiement ne crée pas de service exposé à l’extérieur du cluster.
Par défaut Treafik, installé avec k3s, permet d'accéder à nos pods depuis l'ip du master
Donc le nginx est accessible par l'IP du master