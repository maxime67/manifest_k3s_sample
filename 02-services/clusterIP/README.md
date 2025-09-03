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

4. Vérifie que le service est créé :
   ```bash
   kubectl get services
   ```

## 🧪 Tests de fonctionnement

### Vérification du service depuis l'intérieur du cluster

Puisque ClusterIP n'est accessible que depuis l'intérieur du cluster, nous devons créer un pod temporaire pour tester :

```bash
# Créer un pod temporaire pour les tests
kubectl run test-pod --image=busybox --rm -it --restart=Never -- sh
```

Dans le pod de test, tu peux accéder au service Nginx :

```bash
# Test avec le nom du service (DNS interne)
wget -qO- http://nginx-clusterip-service

# Test avec l'IP du service (récupérée via kubectl get svc)
wget -qO- http://CLUSTER_IP

# Test de résolution DNS
nslookup nginx-clusterip-service
```

### Commandes de vérification depuis l'extérieur

```bash
# Vérifier l'IP assignée au service
kubectl get svc nginx-clusterip-service

# Obtenir des détails sur le service
kubectl describe svc nginx-clusterip-service

# Vérifier les endpoints (pods associés au service)
kubectl get endpoints nginx-clusterip-service
```

### Test avec port-forward (pour accès externe temporaire)

```bash
# Créer un tunnel temporaire vers le service (pour tests uniquement)
kubectl port-forward svc/nginx-clusterip-service 8080:80

# Dans un autre terminal, tester l'accès
curl http://localhost:8080
```

## 📊 Vérification du load balancing

Pour vérifier que le service distribue bien le trafic entre les pods :

```bash
# Identifier les pods Nginx
kubectl get pods -l app=nginx-clusterip -o wide

# Vérifier les logs des pods en temps réel
kubectl logs -f deployment/nginx-clusterip-test

# Depuis un pod de test, faire plusieurs requêtes
kubectl run test-pod --image=busybox --rm -it --restart=Never -- sh
for i in $(seq 1 10); do wget -qO- http://nginx-clusterip-service; done
```

## 📌 Notes importantes

- **Sécurité** : ClusterIP est le type de service le plus sécurisé car il n'expose pas l'application à l'extérieur
- **Performance** : Communication directe entre pods sans traverser de proxies externes
- **DNS** : Le service est automatiquement enregistré dans le DNS interne du cluster
- **Cas d'usage** : Idéal pour les services internes (bases de données, APIs internes, microservices)

## 🔄 Comparaison avec les autres types de services

| Type | Accessibilité | IP | Port | Usage |
|------|---------------|----|----- |-------|
| **ClusterIP** | Interne seulement | IP virtuelle interne | Port interne | Microservices, BDD |
| NodePort | Interne + Externe | IP des nœuds | 30000-32767 | Développement, tests |
| LoadBalancer | Externe | IP publique | Port standard | Production, exposition publique |

## 🛠️ Troubleshooting

### Le service n'est pas accessible
```bash
# Vérifier que le service existe
kubectl get svc

# Vérifier les endpoints
kubectl get endpoints nginx-clusterip-service

# Vérifier les labels des pods
kubectl get pods --show-labels
```

### Problèmes de DNS
```bash
# Tester la résolution DNS depuis un pod
kubectl run dns-test --image=busybox --rm -it --restart=Never -- nslookup nginx-clusterip-service
```

### Pods non associés au service
```bash
# Vérifier la correspondance des labels
kubectl describe svc nginx-clusterip-service
kubectl get pods -l app=nginx-clusterip
```

## 🧹 Nettoyage

Pour supprimer le déploiement :

```bash
kubectl delete -f nginx-clusterip.yml
```