# Chart Helm Symfony + MySQL 🎼

Ce chart Helm permet de déployer une application Symfony complète avec une base de données MySQL dans un cluster Kubernetes, en utilisant les fonctionnalitées de templating Helm.

## 📂 Structure du Chart

```
05-Chart/symfony-mysql/
├── Chart.yaml                      # Métadonnées du chart
├── values.yaml                     # Valeurs par défaut
├── templates/
│   ├── deployment.yaml             # Déploiements MySQL et Symfony
│   ├── services.yaml               # Services pour exposition
│   ├── secrets.yaml                # Secrets pour credentials
│   ├── pvc.yaml                    # Persistent Volume Claim pour MySQL
│   ├── job.yaml                    # Job pour les migrations Doctrine
└── argocd/
    └── main.yaml                   # Configuration ArgoCD
```

## 🎯 Fonctionnalités

### ✅ Application Symfony
- **Image personnalisée** : `maxxa/k3s:latest` (application CRUD Symfony)
- **Replicas configurables** via values.yaml
- **Health checks** : Liveness et Readiness probes
- **Variables d'environnement** via Secrets
- **Migrations** via Job Kubernetes

### ✅ Base de données MySQL
- **Image** : `mysql:latest`
- **Stockage persistant** avec PVC configurable
- **Credentials** via Secrets Kubernetes
- **Readiness probe** pour validation de démarrage
- **Service ClusterIP** pour communication interne

### ✅ Sécurité et Configuration
- **Secrets Kubernetes** pour toutes les données sensibles
- **Variables d'environnement** injectées de manière sécurisée
- **PVC** avec taille et storage class configurables
- **Job de migration** avec gestion des dépendances

## 🚀 Installation

### Prérequis

- Cluster k3s fonctionnel
- Helm 3.x installé
- kubectl configuré

### Déploiement avec ArgoCD

Si vous utilisez ArgoCD, <b>paramétrez</b> et utilisez le fichier de configuration fourni :

```bash
kubectl apply -f ./05-Chart/symfony-mysql/argocd/main.yaml
```

## ⚙️ Configuration

### Fichier values.yaml

Le fichier `values.yaml` contient toutes les configurations par défaut :

```yaml
# Configuration Symfony
symfony:
  image: maxxa/k3s:latest
  replicas: 2
  service:
    external_port: 80
  pod:
    internal_port: 80

# Configuration des secrets
secrets:
  appSecret: "abcdefghijk6lmnopqrstuvwxyz1234567890"
  databasePassword: "password"
  databaseUsername: "user"
  databaseName: "my_database"

# Configuration MySQL
mysql:
  port: 3306
  image: mysql:latest
  storage: "2Gi"
  storageClass: ""  # Utilise la storage class par défaut
```

### Personnalisation avancée

#### Modifier le nombre de replicas Symfony
```bash
helm upgrade symfony-app ./05-Chart/symfony-mysql/ --set symfony.replicas=5
```

#### Changer la taille du stockage MySQL
```bash
helm upgrade symfony-app ./05-Chart/symfony-mysql/ --set mysql.storage=50Gi
```

#### Utiliser une storage class spécifique
```bash
helm upgrade symfony-app ./05-Chart/symfony-mysql/ --set mysql.storageClass=ssd-storage
```

#### Modifier les credentials de base de données
```bash
helm upgrade symfony-app ./05-Chart/symfony-mysql/ \
  --set secrets.databaseUsername=admin \
  --set secrets.databasePassword=superSecretPassword \
  --set secrets.databaseName=production_db
```

## 🧪 Tests et validation

### Vérification du déploiement

```bash
# Vérifier l'état des ressources
helm status symfony-app
kubectl get pods
kubectl get services
kubectl get pvc

# Vérifier les logs Symfony
kubectl logs deployment/RELEASE_NAME-symfony

# Vérifier les logs MySQL
kubectl logs deployment/RELEASE_NAME-mysql

# Vérifier le job de migration
kubectl get jobs
kubectl logs job/RELEASE_NAME-migrations-job
```

### Test de connectivité

```bash
# Récupérer le port NodePort
kubectl get svc RELEASE_NAME-symfony

# Tester l'application (remplacer NODE_IP et NODE_PORT)
curl http://NODE_IP:NODE_PORT/article
```

## 🛠️ Troubleshooting

### Pod Symfony ne démarre pas

```bash
# Vérifier les logs
kubectl logs deployment/RELEASE_NAME-symfony

# Vérifier les variables d'environnement
kubectl describe pod RELEASE_NAME-symfony-xxx

# Vérifier les secrets
kubectl get secret RELEASE_NAME-secrets -o yaml
```

### MySQL ne démarre pas

```bash
# Vérifier les logs MySQL
kubectl logs deployment/RELEASE_NAME-mysql

# Vérifier le PVC
kubectl describe pvc RELEASE_NAME-mysql-pvc

# Vérifier l'espace de stockage disponible
kubectl get pv
```

### Job de migration échoue

```bash
# Vérifier les logs du job
kubectl logs job/RELEASE_NAME-migrations-job

# Relancer le job manuellement
kubectl delete job RELEASE_NAME-migrations-job
helm upgrade symfony-app ./05-Chart/symfony-mysql/
```

### Problèmes de connectivité

```bash
# Tester la résolution DNS interne
kubectl exec -it deployment/RELEASE_NAME-symfony -- nslookup RELEASE_NAME-mysql

# Vérifier les services
kubectl get svc
kubectl describe svc RELEASE_NAME-mysql
```

## 📊 Monitoring et observabilité

### Métriques disponibles

Les pods Symfony sont configurés pour être scrapés par Prometheus (si installé) :

```yaml
# Dans les annotations des pods
prometheus.io/scrape: "true"
prometheus.io/port: "80" 
prometheus.io/path: "/"
```

### Health checks

Le chart inclut des health checks complets :

- **Liveness Probe** : Vérifie que l'application répond sur `/article`
- **Readiness Probe** : S'assure que l'application est prête à recevoir du trafic
- **MySQL Probe** : Utilise `mysqladmin ping` pour vérifier la disponibilité

## 🔒 Sécurité

### Bonnes pratiques implémentées

- ✅ **Secrets Kubernetes** pour toutes les données sensibles
- ✅ **Pas de mots de passe en dur** dans les templates
- ✅ **Variables d'environnement** injectées de manière sécurisée
- ✅ **Isolation** par namespace

## 📚 Ressources utiles

- [Documentation Helm](https://helm.sh/docs/)
- [Templating Helm](https://helm.sh/docs/chart_template_guide/)
- [Application Symfony source](https://hub.docker.com/r/maxxa/k3s)
- [Bonnes pratiques Kubernetes](https://kubernetes.io/docs/concepts/configuration/overview/)

---

*Ce chart Helm illustre un déploiement d'applications web avec base de données dans Kubernetes, en utilisant les fonctionnalités de templating Helm.*