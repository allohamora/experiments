# How to run

```bash
# apply kustomization.yml in k8s dir
kubectl apply -k k8s

# enable metrics-server (needs for horizontal pod autoscale)
minikube addons enable metrics-server

# run highload test
npx artillery run --target {{MINIKUBE_TUNNEL_EXTERNAL_URL}} artillery.yml

# check metrics of pods
kubectl top pods
```

# Check list

- [x] Deployment with 3 replicas.
- [x] LoadBalancer with 3 replicas (use "minikube tunnel").
- [x] HorizontalPodAutoscaling with 3 to 10 replicas (requires "metrics-server", and time to init, and time to collect metrics).
- [x] StatefulSet with 1 replica of postgresql.
- [x] Secrets(for private data like passwords) and ConfigMap(for public data like public config) usage.

# Notes

* Deployment is for stateless pods
* StatefulSet is for stateful pods
* Service is an access layer
* Deployment/StatefulSet are creation layer
* Secret is for a private data
* Config is for a public data
* If you have problems with image downloading you can do it manually by "minikube ssh docker pull {{IMAGE}}" [bug](https://github.com/kubernetes/minikube/issues/14806)
* For horizontal pod autoscale you need to define pod limits