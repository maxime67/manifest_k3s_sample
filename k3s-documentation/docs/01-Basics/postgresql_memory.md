---
sidebar_label: 'PostgreSQL (Memory)'
sidebar_position: 3
---

# Déploiement PostgreSQL avec Stockage Temporaire

Ce projet contient un Chart permettant de déployer une base de données PostgreSQL avec stockage en mémoire dans un cluster Kubernetes.

## 📂 Contenu du projet

Contient la définition du déploiement Kubernetes avec :

- 1 pod PostgreSQL
- Service ClusterIP sur port 5432
- Configuration des variables d'environnement via Secrets
- **⚠️ Stockage temporaire** : Les données sont perdues au redémarrage du pod

## 🚀 Prérequis

Avant d'utiliser ce projet, assure-toi d'avoir :

- Un cluster K3s fonctionnel
- kubectl installé

## 📦 Déploiement

1. Applique le manifeste Kubernetes avec la commande :
   ```bash
   kubectl apply -f postgresql-memory.yaml
   ```

2. Vérifie que le pod est bien créé :
   ```bash
   kubectl get pods
   ```

3. Test de connexion à la base :
   ```bash
   kubectl exec -it <postgresql-pod> -- psql -U postgres
   ```

## 🔍 Caractéristiques

- **Image** : `postgres:15`
- **Service** : ClusterIP (accessible uniquement depuis l'intérieur du cluster)
- **Stockage** : EmptyDir (temporaire)
- **Variables** : Configurées via Secrets Kubernetes

## ⚠️ Limitations

- Les données sont perdues au redémarrage du pod
- Pas de sauvegarde automatique
- Utilisation recommandée pour les tests et développement uniquement