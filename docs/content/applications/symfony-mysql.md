---
title: "Symfony + MySQL"
description: "Guide de déploiement Symfony + MySQL"
weight: 10
cascade:
  - type: "docs"
---


> **💡 Info**
**Configuration disponible :**
- [Voir les fichiers YAML](/files/)
- [Repository GitHub](https://github.com/maxime67/manifest_k3s_sample)


# Déploiement PostgreSQL sur Kubernetes

Ce projet contient un fichier YAML permettant de déployer un serveur PostgreSQL minimal (basé sur l'image postgres:15) dans un cluster Kubernetes.

Le déploiement crée 1 pod et expose le port 5432 pour le trafic TCP.

## 📂 Contenu du projet

Contient la définition du déploiement Kubernetes avec :

- 1 **pod** PostgreSQL
- Un sélecteur de labels
- La configuration des containers et du port exposé
- Un **Service** permettant d'exposer le service PostgreSQL aux autres pods du cluster Kubernetes
- Un **PVC (Persistent Volume Claim)** permettant de rattacher notre pod à un PV (Persistent Volume), garantissant la conservation des données au redémarrage du/des pods

## 🚀 Prérequis

Avant d'utiliser ce projet, assure-toi d'avoir :

- Un cluster K3s fonctionnel
- kubectl installé

## 📦 Déploiement

1. Clone ou copie ce projet sur ta machine.

2. Applique le manifeste Kubernetes avec la commande :
   ```bash
   kubectl apply -f postgresql.yaml
   ```

3. Vérifie que le pod est bien créé :
   ```bash
   kubectl get pods
   ```

4. Connecte-toi au pod :
   ```bash
   kubectl exec -it <nom-pod-principal> -- psql -U postgres
   ```

## 🔍 Tests de fonctionnement

### Vérification en lecture

Dans le pod, tu peux vérifier le bon fonctionnement de PostgreSQL en lecture :

```sql
\l
\dt
SELECT version();
```

### Vérification des actions d'écriture

```sql
CREATE TABLE test_cluster (id SERIAL PRIMARY KEY, data TEXT);
INSERT INTO test_cluster (data) VALUES ('test1'), ('test2');
SELECT * FROM test_cluster;
```

## 🔄 Validation de la persistance des données

1. Supprime le pod actuellement en cours d'exécution :
   ```bash
   kubectl delete pod <nom-pod-principal>
   ```

2. Un nouveau pod est automatiquement créé pour respecter le nombre de replicas demandé

3. Connecte-toi à ce nouveau pod :
   ```bash
   kubectl exec -it <nom-nouveau-pod-principal> -- psql -U postgres
   ```

4. Accède en lecture aux données précédemment insérées :
   ```sql
   SELECT * FROM test_cluster;
   ```

Tu observeras la présence de la table `test_cluster`, suite à la suppression du pod, car celui-ci est rattaché à un volume persistant.

## 📌 Notes importantes

- Un service est déployé parallèlement au pod, ce mécanisme permet d'exposer la base de données aux autres pods la consommant.
- Seuls les pods du cluster Kubernetes y ont accès.
- Un PVC est une demande de stockage de la part du déploiement, il utilise les ressources PV à sa disposition.
- Une ressource PV est un composant de haut niveau créé par l'administrateur du cluster, le PVC est lui créé par le développeur/le déploiement.

## ⚠️ Sécurité

**Important** : Ce déploiement utilise des mots de passe en dur dans le fichier YAML. En production, utilise des Secrets Kubernetes pour stocker les informations sensibles de manière sécurisée.