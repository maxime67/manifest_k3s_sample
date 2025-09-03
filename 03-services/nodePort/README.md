# Déploiement Nginx avec Service NodePort sur Kubernetes

Ce projet contient un fichier YAML permettant de déployer un serveur Nginx minimal (basé sur l'image nginx:alpine) avec un **Service NodePort** dans un cluster Kubernetes.

Le déploiement crée 2 réplicas avec un service accessible depuis l'extérieur du cluster via l'IP des nœuds.

## 📂 Contenu du projet

Contient la définition du déploiement Kubernetes avec :

- 2 **pods** Nginx
- Un sélecteur de labels
- La configuration des containers et du port exposé
- Un **Service NodePort** permettant d'exposer les pods à l'extérieur du cluster via l'IP des nœuds

## 🔍 À propos du Service NodePort

Le **NodePort** étend ClusterIP en exposant le service sur un port statique sur chaque nœud du cluster. Ses caractéristiques :

- **Portée** : Accessible depuis l'intérieur ET l'extérieur du cluster
- **Port range** : Utilise la plage 30000-32767 par défaut
- **IP d'accès** : IP de n'importe quel nœud du cluster
- **Load balancing** : Distribue le trafic entre tous les pods disponibles
- **Usage typique** : Développement, tests, exposition temporaire de services

## 🚀 Prérequis

Avant d'utiliser ce projet, assure-toi d'avoir :

- Un cluster K3s fonctionnel
- kubectl installé
- Accès réseau aux IPs des nœuds du cluster

## 📦 Déploiement

1. Clone ou copie ce projet sur ta machine.

2. Applique le manifeste Kubernetes avec la commande :
   ```bash
   kubectl apply -f nginx-nodeport.yaml
   ```

3. Vérifie que les pods sont bien créés :
   ```bash
   kubectl get pods
   ```

4. Vérifie que le service est créé et note le port assigné :
   ```bash
   kubectl get services
   ```

## 🧪 Tests de fonctionnement

### Récupération des informations de connexion

```bash
# Récupérer le port NodePort assigné
kubectl get svc nginx-nodeport-service
# Exemple de sortie :
# NAME                    TYPE       CLUSTER-IP    EXTERNAL-IP   PORT(S)        AGE
# nginx-nodeport-service  NodePort   10.43.xx.xx   <none>        80:31234/TCP   1m

# Récupérer les IPs des nœuds
kubectl get nodes -o wide
```

### Accès depuis l'extérieur du cluster

```bash
# Test avec curl (remplace NODE_IP et NODE_PORT par les valeurs réelles)
curl http://NODE_IP:NODE_PORT

# Exemples concrets :
curl http://192.168.1.100:31234
curl http://192.168.1.101:31234  # Marche sur tous les nœuds même si le pod n'y est pas
```

### Accès depuis l'intérieur du cluster

Le service reste accessible depuis l'intérieur comme un ClusterIP :

```bash
# Créer un pod temporaire pour les tests internes
kubectl run test-pod --image=busybox --rm -it --restart=Never -- sh

# Dans le pod de test
wget -qO- http://nginx-nodeport-service
wget -qO- http://nginx-nodeport-service:80
```

### Test avec un navigateur

Tu peux également accéder à l'application via un navigateur web :
```
http://NODE_IP:NODE_PORT
```

## 📊 Vérification du load balancing

```bash
# Vérifier la distribution du trafic
kubectl get pods -l app=nginx-nodeport -o wide

# Effectuer plusieurs requêtes pour tester la répartition
for i in $(seq 1 10); do
  curl -s http://NODE_IP:NODE_PORT | grep "Welcome to nginx"
done
```

## 🔧 Configuration avancée

### Spécifier un NodePort fixe

Par défaut, Kubernetes assigne automatiquement un port dans la plage 30000-32767. Tu peux spécifier un port fixe :

```yaml
spec:
  type: NodePort
  ports:
    - port: 80
      targetPort: 80
      nodePort: 30080  # Port fixe (doit être dans la plage autorisée)
```

### Vérification des endpoints

```bash
# Voir quels pods sont associés au service
kubectl get endpoints nginx-nodeport-service

# Description détaillée du service
kubectl describe svc nginx-nodeport-service
```

## 📌 Notes importantes

- **Firewall** : Assure-toi que le port NodePort est ouvert sur tes nœuds
- **Sécurité** : NodePort expose le service publiquement - attention en production
- **Haute disponibilité** : Le service marche même si un nœud tombe (tant qu'il reste des pods actifs)
- **Performance** : Ajoute une couche de routage supplémentaire par rapport à ClusterIP

## 🔄 Comparaison avec les autres types de services

| Type | Accessibilité | IP/Port | Complexité | Usage |
|------|---------------|---------|------------|-------|
| ClusterIP | Interne seulement | IP virtuelle interne | Simple | Microservices |
| **NodePort** | Interne + Externe | IP des nœuds:30000+ | Modérée | Développement, tests |
| LoadBalancer | Externe optimisé | IP publique | Complexe | Production |

## 🛠️ Troubleshooting

### Service non accessible depuis l'extérieur

```bash
# Vérifier le service et son port
kubectl get svc nginx-nodeport-service

# Vérifier que les pods fonctionnent
kubectl get pods -l app=nginx-nodeport

# Tester depuis l'intérieur du cluster
kubectl run debug --image=busybox --rm -it -- wget -qO- http://nginx-nodeport-service
```

### Port déjà utilisé

```bash
# Si tu obtiens une erreur "port already in use"
kubectl get svc --all-namespaces | grep NodePort
```

### Problèmes de firewall

```bash
# Sur les nœuds, vérifier si le port est ouvert
ss -tlnp | grep :31234
netstat -tlnp | grep :31234

# Avec iptables/firewall
iptables -L | grep 31234
```

## 🌐 Accès depuis différents contextes

### Depuis le master K3s
```bash
curl http://localhost:NODE_PORT
curl http://127.0.0.1:NODE_PORT
```

### Depuis le réseau local
```bash
curl http://MASTER_IP:NODE_PORT
curl http://WORKER_IP:NODE_PORT
```

### Depuis Internet (si IPs publiques)
```bash
curl http://PUBLIC_IP:NODE_PORT
```

## 🧹 Nettoyage

Pour supprimer le déploiement :

```bash
kubectl delete -f nginx-nodeport.yaml

# Vérifier que le port NodePort est bien libéré
kubectl get svc
```