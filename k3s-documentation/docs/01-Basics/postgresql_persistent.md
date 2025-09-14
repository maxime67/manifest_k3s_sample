---
sidebar_label: 'PostgreSQL (Persistent)'
sidebar_position: 5
---

# Déploiement PostgreSQL avec Stockage Persistant

Ce projet contient un Chart permettant de déployer une base de données PostgreSQL avec stockage persistant (PVC) dans un cluster Kubernetes.

## 📂 Contenu du projet

Contient la définition du déploiement Kubernetes avec :

- 1 pod PostgreSQL
- Service ClusterIP sur port 5432
- PersistentVolumeClaim (PVC) pour la persistance des données
- Configuration des variables d'environnement via Secrets
- **✅ Stockage persistant** : Conservation des données entre les redémarrages

## 🚀 Prérequis

Avant d'utiliser ce projet, assure-toi d'avoir :

- Un cluster K3s fonctionnel
- kubectl installé
- StorageClass disponible (K3s utilise `local-path` par défaut)

## 📦 Déploiement

1. Applique le manifeste Kubernetes avec la commande :
   ```bash
   kubectl apply -f postgresql-persistent.yaml
   ```

2. Vérifie que le pod et le PVC sont bien créés :
   ```bash
   kubectl get pods
   kubectl get pvc
   ```

3. Test de connexion à la base :
   ```bash
   kubectl exec -it <postgresql-pod> -- psql -U postgres
   ```

## 🔍 Caractéristiques

- **Image** : `postgres:15`
- **Service** : ClusterIP (accessible uniquement depuis l'intérieur du cluster)
- **Stockage** : PVC avec `local-path` StorageClass
- **Variables** : Configurées via Secrets Kubernetes
- **Persistance** : Les données survivent aux redémarrages et suppressions de pods

## 🧪 Test de persistance

Pour vérifier la persistance des données :

```bash
# Créer des données de test
kubectl exec -it <postgres-pod> -- psql -U postgres
CREATE TABLE test_cluster (id SERIAL PRIMARY KEY, data TEXT);
INSERT INTO test_cluster (data) VALUES ('test1'), ('test2');

# Supprimer le pod
kubectl delete pod <postgres-pod>

# Vérifier que les données sont toujours présentes
kubectl exec -it <new-postgres-pod> -- psql -U postgres
SELECT * FROM test_cluster; # Les données doivent être présentes
```

## ✅ Avantages

- Conservation des données entre les redémarrages
- Adapté pour la production
- Sauvegarde possible via les volumes
- Haute disponibilité potentielle