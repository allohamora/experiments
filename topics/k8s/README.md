# How to run

```bash
# apply kustomization.yml in k8s dir
kubectl apply -k k8s
```

# Check list

- [x] Deployment with 3 replicas.
- [x] LoadBalancer with 3 replicas (use minikube tunnel).
- [x] HorizontalPodAutoscaling with 3 to 10 replicas (doesn't working in minikube on 10.02.22, target is always 0% or unknown, i think it is [minikube](https://github.com/kubernetes/minikube)/[metrics-server](https://github.com/kubernetes-sigs/metrics-server) bug).
- [x] StatefulSet with 1 replica of postgresql.
- [x] Secrets(for private data like passwords) and ConfigMap(for public data like public config) usage.

# Notes
* Deployment is for stateless pods
* StatefulSet is for stateful pods
* Service is an access layer
* Deployment/StatefulSet are creation layer
* Secret is for a private data
* Config is for a public data
* If you have problems with image downloading you can do it manually by "minikube ssh docker pull {{IMAGE}}"