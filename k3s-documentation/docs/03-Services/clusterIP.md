---
sidebar_label: 'ClusterIP'
sidebar_position: 1
---

# Déploiement Nginx avec Service ClusterIP sur Kubernetes

Ce projet contient un fichier YAML permettant de déployer un serveur Nginx minimal (basé sur l'image nginx:alpine) avec un **Service ClusterIP** dans un cluster Kubernetes.

Le déploiement crée 2 réplicas avec un service accessible uniquement depuis l'intérieur du cluster.

## 📂 Contenu du projet

Contient la définition du déploiement Kubernetes avec :

- 2 **pods** Nginx
- Un sélecteur de labels
- La configuration des containers et du port exposé
- Un **Service ClusterIP** permettant d'exposer les pods uniquement aux autres pods du cluster Kubernetes

## 🔍 À propos du Service ClusterIP

Le **ClusterIP** est le type de service par défaut dans Kubernetes. Ses caractéristiques :

- **Portée** : Accessible uniquement depuis l'intérieur du cluster
- **IP virtuelle** : Kubernetes assigne une IP virtuelle interne au service
- **DNS interne** : Le service est accessible via son nom (`nginx-clusterip-service`)
- **Usage typique** : Communication entre microservices, bases de données internes

## 🚀 Prérequis

Avant d'utiliser ce projet, assure-toi d'avoir :

- Un cluster K3s fonctionnel
- kubectl installé

## 📦 Déploiement

1. Clone ou copie ce projet sur ta machine.

2. Applique le manifeste Kubernetes avec la commande :
   ```bash
   kubectl apply -f nginx-clusterip.yml
   ```

3. Vérifie que les pods sont bien créés :
   ```bash
   kubectl get pods
   ```