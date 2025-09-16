---
sidebar_label: 'PostgreSQL with PVC'
sidebar_position: 3
description: "Déploiement d'un pod PostgreSQL et d'un Pvc"
tags: ['PostgreSQL', 'pod', 'simple', 'pvc']
---

import GitHubChart from '@site/src/components/GitHubChart';

# Déploiement d'un pod PostgreSql simple
## 🔍 Aperçu

- Déploiement d'un pod PostgreSql simple
- Déploiement d'un PVC utilisé par le pod PostgreSql afin de persiter les données
- Déploie un service permettant d'exposer le pod au sein du cluster
- Utilise les secrets Kubernetes pour stocker des données

### Caractéristiques clés
- ✅ **PostgreSql** : Permet de déployer un serveur PostgreSql vide avec une configuration par défaut
- ✅ **PVC** : Permet de persister les données suite aux redémarages des pods
- ✅ **Exposition** : Permet d'exposer le pod au sein du cluster (peut être accessible depuis l'ip du node en fonction de la configuration)
- ⚠️ **Limitation** : Les secrets sont stockées dans des variables définies dans ```values.yaml```, privilégiez un externalSecret

## 🔍 Caractéristiques

- **Image** : `postgres:15`
- **Service** : ClusterIP (accessible uniquement depuis l'intérieur du cluster).
- **Stockage** : PVC avec `local-path` comme StorageClass, par défaut dans k3s.

## 📂 Contenu du projet

<GitHubChart
repo="maxime67/manifest_k3s_sample"
path="01-basics/postgresql-with-pvc"
files={[
'Chart.yaml',
'values.yaml',
'templates/deployment.yaml',
'templates/pvc.yaml',
'templates/secret.yaml',
'templates/service.yaml',
]}
/>
## 🚀 Prérequis

Avant d'utiliser ce projet, assure-toi d'avoir :

- Un cluster K3s fonctionnel
- kubectl installé
- StorageClass disponible (K3s utilise `local-path` par défaut)

## 📦 Déploiement

## Mise en place

1. Une application ArgoCD te permet de déployer l'application:

```bash
kubectl apply -f 01-basics/postgresql-with-pvc/argocd/argocd-postgresql-with-pvc.yaml
```

2. Vérifie que le pod et le PVC sont bien créés :
   ```bash
   kubectl get pods -n postgresql-persistent
   kubectl get pvc -n postgresql-persistent
   ```

3. Test de connexion à la base :
   ```bash
   kubectl exec -it <postgresql-pod> -n postgresql-persistent -- psql -U postgres
   ```



## 🧪 Test de persistance

Pour vérifier la persistance des données :

```bash
# Créer des données de test
kubectl exec -it <postgres-pod> -n postgresql-persistent -- psql -U postgres
CREATE TABLE test_cluster (id SERIAL PRIMARY KEY, data TEXT);
INSERT INTO test_cluster (data) VALUES ('test1'), ('test2');

# Supprimer le pod
kubectl delete pod <postgres-pod> -n postgresql-persistent

# Vérifier que les données sont toujours présentes
kubectl exec -it <new-postgres-pod> -n postgresql-persistent -- psql -U postgres
SELECT * FROM test_cluster; # Les données doivent être présentes
```

## ✅ Avantages

- Conservation des données entre les redémarrages
- Sauvegarde possible via les volumes