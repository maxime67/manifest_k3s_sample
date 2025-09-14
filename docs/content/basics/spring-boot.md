---
title: "Spring Boot"
description: "Guide de déploiement Spring Boot"
weight: 50
cascade:
  - type: "docs"
---


{{< alert title="📁 Fichiers" >}}
**Configuration disponible :**
- [Voir les fichiers YAML](/files/)
- [Repository GitHub](https://github.com/maxime67/manifest_k3s_sample)
{{< /alert >}}

# Déploiement Nginx sur Kubernetes
Ce projet contient un fichier YAML permettant de déployer un projet Spring boot

Le déploiement crée 2 réplicas

📂 Contenu du projet 

Contient la définition du déploiement Kubernetes avec :

- 2 pods Spring boot

- La configuration des containers et du port exposé 

🚀 Prérequis

Avant d’utiliser ce projet, assure-toi d’avoir :

- Un cluster K3s fonctionnel

- kubectl installé

Vérifie que les pods sont bien créés : 

` kubectl get pods `

📌 Notes 

Ce déploiement ne crée pas de service exposé à l’extérieur du cluster.
Par défaut Treafik, installé avec k3s, permet d'accéder à nos pods depuis l'ip du master
Donc le nginx est accessible par l'IP du master