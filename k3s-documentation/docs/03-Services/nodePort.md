---
sidebar_label: 'NodePort'
sidebar_position: 2
---

# Déploiement Nginx avec Service NodePort sur Kubernetes

Ce projet contient un fichier YAML permettant de déployer un serveur Nginx minimal (basé sur l'image nginx:alpine) avec un **Service NodePort** dans un cluster Kubernetes.

Le déploiement crée 2 réplicas avec un service accessible depuis l'extérieur du cluster via l'IP des nœuds.

## 📂 Contenu du projet

Contient la définition du déploiement Kubernetes avec :

- 2 **pods** Nginx
- Un sélecteur de labels
- La configuration des containers et du port exposé
- Un **Service NodePort** permettant d'exposer les pods via l'IP des nœuds du cluster

## 🔍 À propos du Service NodePort

Le **NodePort** expose le service sur chaque nœud du cluster via un port statique.

Ses caractéristiques :
- **Portée** : Accessible depuis l'extérieur du cluster via `<NodeIP>:<NodePort>`
- **Range de ports** : 30000-32767 (par défaut)
- **IP publique** : Utilise l'IP publique/privée des nœuds
- **Load balancing** : Kubernetes distribue automatiquement le trafic
- **Usage typique** : Exposition simple pour développement/test, services publics basiques

## 🚀 Prérequis

Avant d'utiliser ce projet, assure-toi d'avoir :

- Un cluster K3s fonctionnel
- kubectl installé
- Accès réseau aux IPs des nœuds du cluster

## 📦 Déploiement

1. Clone ou copie ce projet sur ta machine.

2. Applique le manifeste Kubernetes avec la commande :
   ```bash
   kubectl apply -f 03-services/clusterIp/nginx-nodeport.yml
   ```

3. Vérifie que les pods sont bien créés :
   ```bash
   kubectl get pods
   ```

4. Récupère le port NodePort assigné :
   ```bash
   kubectl get services
   # Note le port dans la colonne PORT(S), format 80:XXXXX/TCP
   ```

5. Teste l'accès au service :
   ```bash
   curl http://<NODE_IP>:<NODEPORT>
   ```

## 🌐 Accès au service

Une fois déployé, le service est accessible via :

- **URL** : `http://<NODE_IP>:<NODEPORT>`
- **IP des nœuds** : Utilise l'IP de n'importe quel nœud du cluster
- **Port** : Port automatiquement assigné dans la range 30000-32767

### Exemple d'accès
```bash
# Si le NodePort assigné est 31234 et l'IP du nœud est 192.168.1.100
curl http://192.168.1.100:31234

# Ou depuis un navigateur
http://192.168.1.100:31234
```

## 🔧 Configuration avancée

### Spécifier un NodePort fixe
```yaml
spec:
  type: NodePort
  ports:
    - port: 80
      targetPort: 80
      nodePort: 30080  # Port fixe spécifique
```

### Multi-ports
```yaml
spec:
  type: NodePort
  ports:
    - name: http
      port: 80
      targetPort: 80
      nodePort: 30080
    - name: https
      port: 443
      targetPort: 443
      nodePort: 30443
```

## ⚠️ Considérations de sécurité

- **Firewall** : Assure-toi que les ports NodePort sont accessibles via le firewall
- **Exposition** : Tous les nœuds exposent le service, même s'ils n'hébergent pas le pod
- **Production** : Pour la production, privilégie LoadBalancer ou Ingress avec SSL/TLS
- **Monitoring** : Surveille l'utilisation des ports pour éviter les conflits

## 🧹 Nettoyage

Pour supprimer le déploiement :

```bash
kubectl delete -f 03-services/clusterIp/nginx-nodeport.yml
```