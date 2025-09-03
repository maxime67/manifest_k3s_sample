# Déploiement Nginx avec Service LoadBalancer sur Kubernetes

Ce projet contient un fichier YAML permettant de déployer un serveur Nginx minimal (basé sur l'image nginx:alpine) avec un **Service LoadBalancer** dans un cluster Kubernetes.

Le déploiement crée 2 réplicas avec un service accessible depuis l'extérieur via un load balancer externe.

## 📂 Contenu du projet

Contient la définition du déploiement Kubernetes avec :

- 2 **pods** Nginx
- Un sélecteur de labels
- La configuration des containers et du port exposé
- Un **Service LoadBalancer** permettant d'exposer les pods via un load balancer externe avec une IP publique

## 🔍 À propos du Service LoadBalancer

Le **LoadBalancer** étend NodePort en provisionnant un load balancer externe (fourni par le cloud provider). Ses caractéristiques :

- **Portée** : Accessible depuis Internet avec une IP publique
- **IP externe** : Le cloud provider assigne automatiquement une IP publique
- **Load balancing** : Double niveau - externe (cloud) + interne (Kubernetes)
- **Ports standard** : Utilise les ports standards (80, 443, etc.)
- **Usage typique** : Production, exposition publique d'applications

## ⚠️ Important - Prérequis spéciaux

Le type **LoadBalancer** nécessite un environnement cloud ou un load balancer controller :

### Environnements supportés :
- **Cloud providers** : AWS (ELB), GCP (Cloud Load Balancer), Azure (Load Balancer), etc.
- **On-premises** : MetalLB, HAProxy, F5, etc.
- **K3s spécial** : Servicelb (load balancer intégré basique)

### K3s avec Servicelb (par défaut) :
K3s inclut un simple load balancer appelé **Servicelb** qui :
- Utilise l'IP du nœud comme EXTERNAL-IP
- Ne fournit pas de vraie IP publique
- Convient pour les environnements de développement/test

## 🚀 Prérequis

Avant d'utiliser ce projet, assure-toi d'avoir :

- Un cluster K3s fonctionnel avec Servicelb activé (par défaut) OU
- Un cluster cloud (AWS, GCP, Azure) OU
- MetalLB ou autre load balancer controller installé
- kubectl installé

## 📦 Déploiement

1. Clone ou copie ce projet sur ta machine.

2. Applique le manifeste Kubernetes avec la commande :
   ```bash
   kubectl apply -f nginx-loadbalancer.yaml
   ```

3. Vérifie que les pods sont bien créés :
   ```bash
   kubectl get pods
   ```

4. Vérifie que le service est créé et attend l'IP externe :
   ```bash
   kubectl get services
   ```

## 🧪 Tests de fonctionnement

### Vérification de l'IP externe

```bash
# Surveiller l'attribution de l'IP externe (peut prendre quelques minutes)
kubectl get svc nginx-loadbalancer-service -w

# États possibles :
# EXTERNAL-IP <pending>     -> En cours de provisionnement
# EXTERNAL-IP <none>        -> Pas de load balancer disponible  
# EXTERNAL-IP 34.102.136.X  -> IP publique assignée (cloud)
# EXTERNAL-IP 192.168.1.10  -> IP du nœud (K3s/Servicelb)
```

### Accès via l'IP externe

```bash
# Une fois l'IP externe assignée
EXTERNAL_IP=$(kubectl get svc nginx-loadbalancer-service -o jsonpath='{.status.loadBalancer.ingress[0].ip}')
echo "Service accessible sur : http://$EXTERNAL_IP"

# Test avec curl
curl http://$EXTERNAL_IP

# Test dans le navigateur
echo "Ouvre ton navigateur sur : http://$EXTERNAL_IP"
```

### Accès depuis l'intérieur du cluster

Le service reste accessible depuis l'intérieur comme un ClusterIP :

```bash
# Test interne
kubectl run test-pod --image=busybox --rm -it --restart=Never -- wget -qO- http://nginx-loadbalancer-service
```

## 🔧 Configuration selon l'environnement

### K3s avec Servicelb (défaut)

```yaml
# Configuration basique - utilise l'IP des nœuds
spec:
  type: LoadBalancer
  # Servicelb utilise automatiquement l'IP du nœud
```

### Cloud providers (AWS, GCP, Azure)

```yaml
# Exemple avec annotations cloud-spécifiques
metadata:
  annotations:
    # AWS
    service.beta.kubernetes.io/aws-load-balancer-type: "nlb"
    
    # GCP  
    cloud.google.com/load-balancer-type: "External"
    
    # Azure
    service.beta.kubernetes.io/azure-load-balancer-internal: "false"
```

### Avec MetalLB

```yaml
# Configuration MetalLB avec pool d'IPs
metadata:
  annotations:
    metallb.universe.tf/address-pool: production-public-ips
```

## 📊 Monitoring et debugging

### Vérification du load balancer

```bash
# Status détaillé du service
kubectl describe svc nginx-loadbalancer-service

# Events liés au service
kubectl get events --field-selector involvedObject.name=nginx-loadbalancer-service

# Logs du controller de load balancer (K3s)
kubectl logs -n kube-system -l app=servicelb
```

### Test de haute disponibilité

```bash
# Supprimer un pod pour tester la résilience
kubectl delete pod -l app=nginx-loadbalancer | head -1

# Le load balancer devrait automatiquement router vers le pod restant
curl http://$EXTERNAL_IP
```

## 📌 Notes importantes selon l'environnement

### K3s/Servicelb
- **IP externe** : IP du nœud master
- **Limitations** : Pas de vraie IP publique, pas de health checks avancés
- **Usage** : Développement, labs, réseaux internes

### Cloud providers
- **IP externe** : IP publique fournie par le cloud
- **Avantages** : Health checks, SSL termination, DDoS protection
- **Coût** : Facturation du load balancer cloud

### On-premises (MetalLB)
- **IP externe** : Pool d'IPs défini par l'administrateur
- **Configuration** : Nécessite configuration réseau avancée
- **Flexibilité** : Contrôle total sur le load balancing

## 🔄 Comparaison complète des types de services

| Type | Accessibilité | IP/Port | Gestion | Coût | Usage |
|------|---------------|---------|---------|------|-------|
| ClusterIP | Interne | IP virtuelle | Kubernetes | Gratuit | Microservices |
| NodePort | Interne + Externe | IP nœuds:30000+ | Kubernetes | Gratuit | Développement |
| **LoadBalancer** | Externe optimisé | IP publique | Cloud/MetalLB | Payant | Production |

## 🛠️ Troubleshooting

### EXTERNAL-IP reste en &lt;pending&gt;

```bash
# Vérifier si un load balancer controller est disponible
kubectl get pods -n kube-system | grep -E "servicelb|metallb|aws-load-balancer"

# K3s : vérifier que servicelb est actif
kubectl get pods -n kube-system -l app=servicelb

# Vérifier les events du service
kubectl describe svc nginx-loadbalancer-service
```

### EXTERNAL-IP est &lt;none&gt;

Cela indique qu'aucun load balancer controller n'est disponible :

```bash
# Installer MetalLB (exemple)
kubectl apply -f https://raw.githubusercontent.com/metallb/metallb/v0.13.7/config/manifests/metallb-native.yaml

# Ou réinstaller K3s avec servicelb
curl -sfL https://get.k3s.io | sh -
```

### Service non accessible via l'IP externe

```bash
# Vérifier les règles de firewall
# Cloud : vérifier les security groups/firewalls
# On-premises : vérifier iptables/firewalld

# Tester depuis l'intérieur du cluster d'abord
kubectl run debug --image=busybox --rm -it -- wget -qO- http://nginx-loadbalancer-service
```

## 🌐 Exemples d'accès selon l'environnement

### K3s local (Servicelb)
```bash
# L'EXTERNAL-IP sera l'IP de ton nœud master
curl http://192.168.1.100  # IP de ton master K3s
```

### AWS EKS
```bash
# L'EXTERNAL-IP sera un hostname AWS ELB
curl http://a1b2c3d4e5f6-1234567890.us-west-2.elb.amazonaws.com
```

### GCP GKE
```bash
# L'EXTERNAL-IP sera une IP publique Google Cloud
curl http://34.102.136.180
```

### Azure AKS
```bash
# L'EXTERNAL-IP sera une IP publique Azure
curl http://20.62.146.142
```

## 🔒 Configuration SSL/TLS (Avancé)

Pour des déploiements en production avec HTTPS :

```yaml
apiVersion: v1
kind: Service
metadata:
  name: nginx-loadbalancer-service
  annotations:
    # AWS - Termination SSL sur le load balancer
    service.beta.kubernetes.io/aws-load-balancer-ssl-cert: "arn:aws:acm:us-east-1:123456789:certificate/12345"
    service.beta.kubernetes.io/aws-load-balancer-backend-protocol: "http"
spec:
  type: LoadBalancer
  ports:
    - port: 443        # Port HTTPS
      targetPort: 80   # Nginx reste en HTTP en interne
      protocol: TCP
    - port: 80         # Port HTTP (optionnel pour redirection)
      targetPort: 80
      protocol: TCP
```

## 🧹 Nettoyage

Pour supprimer le déploiement :

```bash
kubectl delete -f nginx-loadbalancer.yaml

# Vérifier que l'IP externe est bien libérée
kubectl get svc

# Dans le cloud, le load balancer externe sera automatiquement supprimé
```

## ⚡ Optimisations et bonnes pratiques

### Health checks
```yaml
# Ajout de health checks dans le Deployment
spec:
  template:
    spec:
      containers:
        - name: nginx
          image: nginx:alpine
          livenessProbe:
            httpGet:
              path: /
              port: 80
            initialDelaySeconds: 30
            periodSeconds: 10
          readinessProbe:
            httpGet:
              path: /
              port: 80
            initialDelaySeconds: 5
            periodSeconds: 5
```

### Resource limits
```yaml
# Ajout de limites de ressources
spec:
  template:
    spec:
      containers:
        - name: nginx
          image: nginx:alpine
          resources:
            limits:
              memory: "128Mi"
              cpu: "100m"
            requests:
              memory: "64Mi"
              cpu: "50m"
```

## 🏗️ Architecture complète avec LoadBalancer

```
Internet
    ↓
[Cloud Load Balancer] ← IP publique (34.102.136.X)
    ↓
[Kubernetes Service] ← LoadBalancer type
    ↓
[Pod Nginx 1] [Pod Nginx 2] ← Load balancing automatique
```

## 🎯 Cas d'usage recommandés

### Utilise LoadBalancer pour :
- ✅ Applications web publiques en production
- ✅ APIs REST exposées sur Internet
- ✅ Sites web avec trafic important
- ✅ Applications nécessitant une IP publique stable
- ✅ Services avec besoins de SSL/TLS termination

### N'utilise PAS LoadBalancer pour :
- ❌ Services internes (utilise ClusterIP)
- ❌ Développement local (utilise NodePort)
- ❌ Applications sans besoin d'accès externe
- ❌ Environments où le coût est critique