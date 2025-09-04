# K3s Deployment Samples 🚀

Ce repository contient une collection d'exemples de déploiements Kubernetes testés dans un environnement K3s, allant des composants basiques aux applications complètes.

## 📋 Vue d'ensemble

Ce projet propose des exemples pratiques pour déployer des applications sur K3s, avec une progression logique du simple au complexe. Tous les exemples sont prêts à l'emploi et documentés.

## 🏗️ Structure du projet

```
├── 01-basics/                          # Exemples fondamentaux
│   ├── nginx/                          # Déploiement Nginx simple
│   ├── postgresql_memory/              # PostgreSQL avec stockage temporaire
│   ├── postgresql_persistent/          # PostgreSQL avec persistance
│   ├── react/                          # Application React avec Nginx
│   └── spring-boot/                    # Application Spring Boot
├── 02-application/                     # Applications complètes
│    └── symfony_mysql/                 # Application Symfony + MySQL
└── 03-services/ 
│    ├── clusterIP/                     # Détails sur la mise en place d'un service ClusterIP
│    └── nodePort/                      # Détails sur la mise en place d'un service nodePort
└── 04-monitoring/
     └── prometheus/                    # Exemple de mise en place d'une stack d'observabilité, de cluster et d'application
```

## 🎯 Exemples disponibles

### 01-basics - Composants fondamentaux

#### 🌐 Nginx
- **Chemin** : `01-basics/nginx/`
- **Description** : Serveur web Nginx basique avec 2 réplicas
- **Image** : `nginx:alpine`
- **Commande** : `kubectl apply -f nginx.yaml`
- **Service** : NodePort (port 80 → 8080)
- **Commande de vérification** : `kubectl get logs` puis `curl <MASTER_IP>:<PORT>`

#### 🐘 PostgreSQL (Mémoire)
- **Chemin** : `01-basics/postgresql_memory/`
- **Description** : Base PostgreSQL avec stockage temporaire
- **Image** : `postgres:15`
- **Service** : ClusterIP sur port 5432
- **⚠️ Note** : Les données sont perdues au redémarrage du pod

#### 🐘 PostgreSQL (Persistant)
- **Chemin** : `01-basics/postgresql_persistent/`
- **Description** : Base PostgreSQL avec stockage persistant (PVC)
- **Image** : `postgres:15`
- **Service** : ClusterIP sur port 5432
- **✅ Avantage** : Conservation des données entre les redémarrages et après suppresion des pods

#### ⚛️ React Application
- **Chemin** : `01-basics/react/`
- **Description** : Application React servie par Nginx
- **Image** : `maxxa/reacttest:latest`
- **Service** : NodePort
- **Commande de vérification** : `kubectl get logs` puis `curl <MASTER_IP>:<PORT>`

#### ☕ Spring Boot Application
- **Chemin** : `01-basics/spring-boot/`
- **Description** : Application Spring Boot avec Tomcat
- **Image** : `maxxa/demospringboot:latest`
- **Service** : NodePort (port 80 → 8080)
- **Réplicas** : 2 pods

### 02-application - Applications complètes

#### 🎼 Symfony + MySQL
- **Chemin** : `02-application/symfony_mysql/`
- **Description** : Application Symfony complète avec base MySQL
- **Images** :
    - `maxxa/k3s:latest` - Application Symfony personnalisée
    - `mysql:latest` - Base de données MySQL
- **Fonctionnalités** :
    - Gestion des secrets Kubernetes (DATABASE_URL, APP_SECRET)
    - Job: Utilisé pour réaliser les migrations Doctrine 
    - Init containers pour :
        - Attendre la disponibilité de MySQL
    - Health checks complets (liveness/readiness probes)
    - PVC pour persistance MySQL (1Gi)
    - NodePort 30080
    - Variables d'environnement sécurisées via Secrets
### 03-services - Exemple d'utilisation de service
#### ClusterIP
- **Chemin** : `03-services/clusterIp/`
- **Description** : Utilisation du service ClusterIp
- **Image** : ` nginx:alpine`
- **Service** : NodePort (port 80 → 8080)
- **Réplicas** : 2 pods
#### NodePort
- **Chemin** : `03-services/clusterIp/`
- **Description** : Application Spring Boot avec Tomcat
- **Image** : ` nginx:alpine`
- **Service** : NodePort (port 80 → 8080)
- **Réplicas** : 2 pods 

### 04-monitoring - Exemple de déploiement d'une stack prometheus et grafana
#### prometheus
- **Chemin** : `04-monitoring/prometheus/`
- **Description** : Exemple de déploiement d'une stack prometheus et grafana
- **Image** : `grafana/grafana:latest` et `prom/prometheus:latest`
- **Service** : NodePort, utilisé pour exposer prometheus et grafana à l'exterieur du cluster
- **DeamonSet**, permet d'assurer la présence d'un pod sur tout ou partie des noeuds, dans notre cas un pod prometheus qui permet la remontée de data depuis tous les pods de tous les noeuds
- **ConfigMap** : Configuration prometheus.yml
- **Service Account** : Permet de gérer des droits, dans certains cas nécessaire, sera par la suite associé à des pods. Dans notre cas, utilisé pour les pods prometheus afin d'accéder à l'api kubernetes
- **Cluster role** : Définit des droits, sera associé à un service account par la suite
- **Cluster role binding** : Associé un Service account à un Role Binding


## 🐳 Images Docker personnalisées

Les images personnalisées sont disponibles sur Docker Hub : **[maxxa](https://hub.docker.com/repositories/maxxa)**

- `maxxa/reacttest:latest` - Application React pour démo frontend
- `maxxa/demospringboot:latest` - Application Spring Boot de démonstration
- `maxxa/k3s:latest` - Application Symfony simpliste, CRUD

## 🚀 Installation et prérequis

### Installation K3s

Pour installer K3s sur vos machines (testé sur Debian 12.7.1 sur Proxmox LXC) :

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

### Configuration kubectl
```bash
cp /etc/rancher/k3s/k3s.yaml ~/.kube/config
chown $USER:$USER ~/.kube/config
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

### Exemple avec base de données - PostgreSQL persistant
```bash
cd 01-basics/postgresql_persistent/
kubectl apply -f postgresql.yaml
kubectl get pods
kubectl get pvc

# Test de connexion
kubectl exec -it <nom-pod-postgres> -- psql -U postgres
```

### Exemple application frontend - React
```bash
cd 01-basics/react/
kubectl apply -f react.yaml
kubectl get pods
kubectl get services
# Accès via http://<MASTER_IP>:<NODEPORT>
```

### Exemple complexe - Symfony avec MySQL
```bash
cd 02-application/symfony_mysql/
kubectl apply -f symfony-mysql.yml

# Vérification du déploiement
kubectl get pods
kubectl get services
kubectl logs deployment/symfony-app

# Accès à l'application
# Application: http://<NODE_IP>:30080
```

## 🧪 Tests et validation

### Tests de persistance PostgreSQL
```bash
# Créer des données de test
kubectl exec -it <postgres-pod> -- psql -U postgres
CREATE TABLE test_cluster (id SERIAL PRIMARY KEY, data TEXT);
INSERT INTO test_cluster (data) VALUES ('test1'), ('test2');

# Supprimer le pod et vérifier la persistance
kubectl delete pod <postgres-pod>
kubectl exec -it <new-postgres-pod> -- psql -U postgres
SELECT * FROM test_cluster; # Les données doivent être présentes
```

### Tests d'applications web
```bash
# Test React
curl http://<MASTER_IP>:<NODEPORT>

# Test Spring Boot
curl http://<MASTER_IP>:<NODEPORT>

# Test Symfony
curl http://<MASTER_IP>:30080/article
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
kubectl logs <pod-name>

# Vérification des PVC
kubectl get pvc
kubectl describe pvc <pvc-name>

# Vérification des secrets
kubectl get secrets
kubectl describe secret <secret-name>
```

### Accès aux applications
- **Nginx** : Accessible via l'IP du master K3s (grâce à Traefik intégré)
- **PostgreSQL** : Accessible uniquement depuis l'intérieur du cluster (ClusterIP)
- **React** : Accessible via NodePort sur l'IP du master
- **Spring Boot** : Accessible via NodePort sur l'IP du master
- **Symfony** : Accessible sur port 30080 (LoadBalancer/NodePort)

## 📚 Concepts Kubernetes illustrés

Ce repository démontre les concepts suivants :

- **Deployments** : Gestion des réplicas et rolling updates
- **Services** : Exposition réseau (ClusterIP, NodePort, LoadBalancer)
- **Secrets** : Gestion sécurisée des données sensibles (mots de passe, chaînes de connexion)
- **ConfigMaps** : Configuration des applications (configuration Nginx pour SPA)
- **PVC/PV** : Stockage persistant pour bases de données
- **Init Containers** : Initialisation et prérequis (attente de services, migrations)
- **Health Checks** : Probes de santé (liveness/readiness) pour haute disponibilité
- **Namespaces** : Isolation des ressources applicatives
- **Resource Limits** : Limitation et demande de ressources (CPU/Mémoire)
- **Volume Mounts** : Montage de volumes pour persistance

## 🛠️ Nettoyage

### Désinstallation d'un déploiement
```bash
kubectl delete -f <fichier-yaml>

# Pour les applications avec namespace
kubectl delete -f <fichier-yaml>
kubectl delete namespace <namespace-name>
```

### Nettoyage des ressources persistantes
```bash
# Supprimer les PVC (attention : perte de données)
kubectl delete pvc <pvc-name>

# Supprimer les secrets
kubectl delete secret <secret-name>
```

### Désinstallation K3s
```bash
# Sur le master
/usr/local/bin/k3s-uninstall.sh

# Sur les workers
/usr/local/bin/k3s-agent-uninstall.sh
```

## 🔧 Troubleshooting

### Erreur de certificat TLS
```bash
# Si vous rencontrez "tls: failed to verify certificate"
cp /etc/rancher/k3s/k3s.yaml ~/.kube/config
chown $USER:$USER ~/.kube/config
```

### Pods en attente (Pending)
```bash
# Vérifier les ressources disponibles
kubectl describe pod <pod-name>
kubectl get nodes
kubectl top nodes  # Si metrics-server est installé
```

### Problèmes de connectivité entre services
```bash
# Tester la résolution DNS interne
kubectl exec -it <pod-name> -- nslookup <service-name>
kubectl get svc
```

## ⚠️ Notes importantes

- **Sécurité** : Les mots de passe sont en dur dans certains exemples pour la démonstration. En production, utilisez des Secrets Kubernetes appropriés et des gestionnaires de secrets externes.
- **Images** : Certains exemples utilisent `:latest`, préférez des tags versionnés en production.
- **Ressources** : Les limites de ressources sont configurées pour un environnement de développement/test.
- **Stockage** : K3s utilise `local-path` par défaut pour les PVC, approprié pour un cluster de test.
- **Réseau** : Traefik est installé par défaut avec K3s et permet l'exposition automatique de certains services.

## 🤝 Contribution

Pour contribuer à ce projet :
1. Fork le repository
2. Créez une branche pour votre fonctionnalité
3. Testez vos modifications dans un environnement K3s
4. Documentez vos exemples avec un README détaillé
5. Soumettez une Pull Request avec une description claire

## 📖 Ressources utiles

- [Documentation K3s](https://docs.k3s.io/)
- [Documentation Kubernetes](https://kubernetes.io/docs/)
- [Images Docker personnalisées](https://hub.docker.com/repositories/maxxa)
- [Bonnes pratiques Kubernetes](https://kubernetes.io/docs/concepts/configuration/overview/)
- [Traefik avec K3s](https://doc.traefik.io/traefik/providers/kubernetes-ingress/)

---

*Ce repository est maintenu comme ressource éducative pour l'apprentissage de Kubernetes et K3s. Les exemples évoluent.*