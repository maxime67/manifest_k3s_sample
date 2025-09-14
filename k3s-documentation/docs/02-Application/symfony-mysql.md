---
sidebar_label: 'Symfony + MySQL'
sidebar_position: 1
---

# Application Symfony avec Base MySQL

Ce projet contient un fichier YAML permettant de déployer une application Symfony complète avec base de données MySQL dans un cluster Kubernetes.

## 📂 Contenu du projet

Contient la définition du déploiement Kubernetes avec :

- **Application Symfony** : `maxxa/k3s:latest`
- **Base de données MySQL** : `mysql:latest`
- **Gestion des secrets** : DATABASE_URL, APP_SECRET
- **Job de migration** : Migrations Doctrine automatiques
- **Init containers** : Attente de disponibilité MySQL
- **Health checks** : Probes liveness/readiness complètes
- **PVC** : Persistance MySQL (1Gi)
- **Service** : NodePort 30080

## 🚀 Prérequis

Avant d'utiliser ce projet, assure-toi d'avoir :

- Un cluster K3s fonctionnel
- kubectl installé
- StorageClass disponible pour le PVC MySQL

## 📦 Déploiement

1. Applique le manifeste Kubernetes avec la commande :
   ```bash
   kubectl apply -f symfony-mysql.yml
   ```

2. Vérifie que les pods sont bien créés :
   ```bash
   kubectl get pods
   kubectl get services
   kubectl logs deployment/symfony-app
   ```

3. Accès à l'application :
   ```bash
   # Application accessible sur :
   http://<NODE_IP>:30080
   ```

## 🔍 Fonctionnalités

### **Gestion des Secrets**
- Variables d'environnement sécurisées via Secrets Kubernetes
- Configuration DATABASE_URL automatique
- APP_SECRET pour Symfony

### **Init Containers**
- Attente de disponibilité MySQL avant démarrage Symfony
- Vérification de la connectivité base de données

### **Job de Migration**
- Exécution automatique des migrations Doctrine
- Initialisation de la base de données

### **Health Checks**
- **Liveness Probe** : Vérification que l'application fonctionne
- **Readiness Probe** : Vérification que l'application est prête à recevoir du trafic
- Endpoint : `/article` sur port 80

### **Persistance**
- PVC MySQL pour conservation des données
- Survie aux redémarrages et suppressions de pods

## 🧪 Tests et validation

### Test de l'application
```bash
# Test direct
curl http://<NODE_IP>:30080/article

# Vérification des logs
kubectl logs deployment/symfony-app
kubectl logs deployment/mysql-app
```

### Test de persistance MySQL
```bash
# Connexion à MySQL
kubectl exec -it <mysql-pod> -- mysql -u root -p

# Vérifier les tables créées par Symfony
SHOW DATABASES;
USE symfony_db;
SHOW TABLES;
```

## 📌 Configuration

### **Images utilisées**
- **Symfony** : `maxxa/k3s:latest` - Application Symfony personnalisée
- **MySQL** : `mysql:latest` - Base de données MySQL officielle

### **Ports et Services**
- **Symfony** : NodePort 30080 (80 → 8080)
- **MySQL** : ClusterIP 3306 (interne uniquement)

### **Variables d'environnement**
Configurées via Secrets Kubernetes :
- `DATABASE_URL` : Chaîne de connexion MySQL
- `APP_SECRET` : Clé secrète Symfony
- `MYSQL_ROOT_PASSWORD` : Mot de passe root MySQL

## ⚠️ Notes importantes

- **Sécurité** : Les mots de passe sont en dur pour la démonstration
- **Production** : Utilisez des Secrets Kubernetes appropriés
- **Ressources** : Les limites sont configurées pour un environnement de test
- **Stockage** : K3s utilise `local-path` par défaut pour les PVC