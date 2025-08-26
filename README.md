# K3s Deployment Samples 🚀

Ce repository contient une collection d'exemples de déploiements Kubernetes optimisés pour K3s, allant des composants basiques aux applications complètes.

## 📋 Vue d'ensemble

Ce projet propose des exemples pratiques pour déployer des applications sur K3s, avec une progression logique. Tous les exemples sont prêts à l'emploi.

## 🏗️ Structure du projet

```
├── 01-basics/                          # Exemples fondamentaux
│   ├── nginx/                          # Déploiement Nginx simple
│   ├── postgresql_memory/              # PostgreSQL avec stockage temporaire
│   └── postgresql_persistent/          # PostgreSQL avec persistance
└── 02-application/                     # Applications complètes
    ├── 3_tier_demo/                   # App 3-tiers (Vue.js + Express + MongoDB)
    └── symfony_mysql/                 # Application Symfony + MySQL

```

## 🎯 Exemples disponibles

### 01-basics - Composants fondamentaux

#### 🌐 Nginx
- **Chemin** : `01-basics/nginx/`
- **Description** : Serveur web Nginx basique avec 2 réplicas
- **Image** : `nginx:alpine`
- **Commande** : `kubectl apply -f nginx.yaml`

#### 🐘 PostgreSQL (Mémoire)
- **Chemin** : `01-basics/postgresql_memory/`
- **Description** : Base PostgreSQL avec stockage temporaire
- **Image** : `postgres:15`
- **⚠️ Note** : Les données sont perdues au redémarrage du pod

#### 🐘 PostgreSQL (Persistant)
- **Chemin** : `01-basics/postgresql_persistent/`
- **Description** : Base PostgreSQL avec stockage persistant (PVC)
- **Image** : `postgres:15`
- **✅ Avantage** : Conservation des données entre les redémarrages

### 02-application - Applications complètes

#### 🏢 Application 3-Tiers
- **Chemin** : `02-application/3_tier_demo/`
- **Description** : Stack complète Vue.js + Express.js + MongoDB
- **Images personnalisées** :
    - `maxxa/k3s_demo_vue:latest` - Frontend Vue.js
    - `maxxa/k3s_demo_api:latest` - API Express.js
- **Fonctionnalités** :
    - Build automatique du frontend Vue.js avec init containers
    - Configuration Nginx pour SPA
    - Persistance MongoDB avec PVC
    - Exposition via NodePort (Frontend: 32000, API: 31000)

#### 🎼 Symfony + MySQL
- **Chemin** : `02-application/symfony_mysql/`
- **Description** : Application Symfony avec base MySQL
- **Images** :
    - `maxxa/k3s:latest` - Application Symfony personnalisée
    - `mysql:latest` - Base de données
- **Fonctionnalités** :
    - Gestion des secrets Kubernetes
    - Init containers pour migrations automatiques
    - Health checks (liveness/readiness probes)
    - LoadBalancer avec NodePort 30080

## 🐳 Images Docker personnalisées

Les images personnalisées sont disponibles sur Docker Hub : **[maxxa](https://hub.docker.com/repositories/maxxa)**

- `maxxa/k3s_demo_vue:latest` - Frontend Vue.js pour la démo 3-tiers
- `maxxa/k3s_demo_api:latest` - API Express.js pour la démo 3-tiers
- `maxxa/k3s:latest` - Application Symfony personnalisée

## 🚀 Installation et prérequis

### Installation K3s

Pour installer K3s sur vos machines (Debian 12.7.1 testé sur Proxmox LXC) :

#### Sur le Master :
```bash
curl -sfL https://get.k3s.io | INSTALL_K3S_EXEC="--kubelet-arg=feature-gates=KubeletInUserNamespace=true" sh -
```

#### Récupérer le token :
```bash
cat /var/lib/rancher/k3s/server/node-token
```

#### Sur les Workers :
```bash
curl -sfL https://get.k3s.io | K3S_URL=https://MASTER_IP:6443 K3S_TOKEN=YOUR_TOKEN INSTALL_K3S_EXEC="--kubelet-arg=feature-gates=KubeletInUserNamespace=true" sh -
```

### Prérequis logiciels
- Cluster K3s fonctionnel
- `kubectl` installé et configuré
- Accès aux images Docker (Docker Hub)

## 📦 Déploiement rapide

### Exemple basique - Nginx
```bash
cd 01-basics/nginx/
kubectl apply -f nginx.yaml
kubectl get pods
```

### Exemple avancé - Application 3-tiers
```bash
cd 02-application/3_tier_demo/
kubectl apply -f 3_tier.yml

# Vérification
kubectl get pods -n mon-app
kubectl get services -n mon-app

# Accès à l'application
# Frontend: http://NODE_IP:32000
# API: http://NODE_IP:31000
```

## 🧪 Tests automatisés

Chaque exemple inclut un script de test `test.sh` :

```bash
# Test avec namespace par défaut
./test.sh

# Test avec namespace personnalisé et timeout
./test.sh my-namespace 600
```

## 🔍 Surveillance et débuggage

### Commandes utiles
```bash
# Statut des services K3s
systemctl status k3s          # Master
systemctl status k3s-agent    # Worker

# Logs des services
journalctl -u k3s -f          # Master
journalctl -u k3s-agent -f    # Worker

# État du cluster
kubectl get nodes
kubectl get pods --all-namespaces
kubectl describe pod <pod-name>
```

### Accès aux applications
- **Nginx** : Accessible via l'IP du master K3s (grâce à Traefik)
- **PostgreSQL** : Accessible uniquement depuis l'intérieur du cluster
- **App 3-tiers** : Frontend sur port 32000, API sur port 31000
- **Symfony** : Accessible sur port 30080

## 📚 Concepts Kubernetes illustrés

Ce repository démontre les concepts suivants :

- **Deployments** : Gestion des réplicas et rolling updates
- **Services** : Exposition réseau (ClusterIP, NodePort, LoadBalancer)
- **Secrets** : Gestion sécurisée des données sensibles
- **ConfigMaps** : Configuration des applications
- **PVC/PV** : Stockage persistant
- **Init Containers** : Initialisation et prérequis
- **Health Checks** : Probes de santé (liveness/readiness)
- **Namespaces** : Isolation des ressources

## 🛠️ Nettoyage

### Désinstallation d'un déploiement
```bash
kubectl delete -f <fichier-yaml>
```

### Désinstallation K3s
```bash
# Sur le master
/usr/local/bin/k3s-uninstall.sh

# Sur les workers
/usr/local/bin/k3s-agent-uninstall.sh
```

## ⚠️ Notes importantes

- **Sécurité** : Les mots de passe sont en dur dans les exemples, utilisez des Secrets Kubernetes appropriés.
- **Images** : Certains exemples utilisent `:latest`, préférez des tags versionnés.
- **Ressources** : Les limites de ressources sont configurées pour un environnement de développement.
- **Stockage** : K3s utilise `local-path` par défaut pour les PVC.

## 🤝 Contribution

Pour contribuer à ce projet :
1. Fork le repository
2. Créez une branche pour votre fonctionnalité
3. Testez vos modifications avec les scripts fournis
4. Soumettez une Pull Request

## 📖 Ressources utiles

- [Documentation K3s](https://docs.k3s.io/)
- [Documentation Kubernetes](https://kubernetes.io/docs/)
- [Images Docker personnalisées](https://hub.docker.com/repositories/maxxa)
- [Bonnes pratiques Kubernetes](https://kubernetes.io/docs/concepts/configuration/overview/)

---