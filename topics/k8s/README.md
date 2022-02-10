# Check list

- [x] Deployment with 3 replicas.
- [x] LoadBalancer with 3 replicas (use minikube tunnel).
- [x] HorizontalPodAutoscaling with 3 to 10 replicas (doesn't working in minikube on 10.02.22, target is always 0% or unknown, i think it is [minikube](https://github.com/kubernetes/minikube)/[metrics-server](https://github.com/kubernetes-sigs/metrics-server) bug).
