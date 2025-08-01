#!/bin/bash
set -e

NAMESPACE=${1:-default}
TIMEOUT=${2:-300}

echo "🚀 Testing deployment in namespace: $NAMESPACE"

# Apply manifests
kubectl apply -f postgresql.yaml -n $NAMESPACE

# Wait for deployment
kubectl wait --for=condition=available deployment --all -n $NAMESPACE --timeout=${TIMEOUT}s

# Run health checks
kubectl get pods -n $NAMESPACE
kubectl get services -n $NAMESPACE

echo "✅ Deployment completed successfully"

kubectl delete deployment postgresql-test
echo "⚠️ Deployment delete completed"