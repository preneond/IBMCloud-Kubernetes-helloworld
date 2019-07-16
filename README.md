# IBMCloud Kubernetes Tutorial
Tutorial how to create a docker image, upload the image on *IBM Container Registry* and deploy it on IBM Kubernetes Services. Star the repository if you liked the tutorial.

## 1. Writing a Hello World app
------
Lets have a simple hello world program `src/server.js`

```javascript
var http = require('http');

var handleRequest = (request,response) => {
  console.log('Received request for URL: ' + request.url);
  response.writeHead(200);
  response.end('Hello World!');
};

var server = http.createServer(handleRequest);
server.listen(8080);
```
and `src/Dockerfile` to specify image

```Dockerfile 
FROM node:6.14.2
EXPOSE 8080
COPY server.js .
CMD node server.js
```

## 2. Creating a Docker Image
------
If you don't have a Docker CLI installed, do it now. https://docs.docker.com/install/

We need to build an image from Dockerfile
```shell
$ cd src/
$ docker build -t helloworld-example .
```
`-t` option names and optionally tag an image in image:tag format. The dot represents a path to Dockerfile.

To test the image locally we can run the image
```shell
$ docker run -p 3000:8080 helloworld-example
```
`-p` option publish a container's port(s) to the host. By default, when you create a container, it does not publish any of its ports to the outside world. Notation `3000:8080` says that we want to redirect container port `8080` to host port `3000:8080` which I randomly chose - should be empty for our usage.

You should see on [127.0.0.1:3000]() the output
```
Hello World!
```

## 3. Uploading the Docker Image on IBM Container Registry
------

### Install, Setup and Login

If you already installed the IBM CLoud CLI and you also set up your private registry namespace before, you can skip step 1.

1. Install the [IBM Cloud CLI](https://cloud.ibm.com/docs/containers?topic=containers-cs_cli_install)
2.  Log in to your IBM Cloud account. 
```shell 
$ ibmcloud login -a https://cloud.ibm.com
```
If you have a federated ID, use command below to log in to the IBM Cloud CLI.
```shell 
$ ibmcloud login --sso
``` 
5. Choose a name for your first namespace, and create that namespace
```shell
$ ibmcloud cr namespace-add <my_namespace>
```
For more details about IBM Container Registry click [here](https://cloud.ibm.com/kubernetes/registry/main/start)


### Push the image to your private registry
1. Log your local Docker daemon into the IBM Cloud Container Registry
```shell
$ ibmcloud cr login
```

2. Choose a repository and tag by which you can identify the image.
```shell
$ docker tag hello-world de.icr.io/<my_namespace>/<my_repository>:<my_tag>
```

3. Push the image.
```shell
$ docker push de.icr.io/<my_namespace>/<my_repository>:<my_tag>
```

4. Check if the image is in private registry
```shell
$ ibmcloud cr image-list
```


## 4. Create a Kubernetes cluster in IBM Cloud Kubernetes Service.
---
Create a cluster.
```shell
$ ibmcloud ks cluster-create --name my_cluster
```


Verify that the creation of the cluster was requested. It can take a few minutes for the worker node machine to be ordered.
```shell 
 $ ibmcloud ks clusters
```

Check the status of the worker node.
```shell 
 $  ibmcloud ks workers --cluster <cluster_name_or_ID> 
```
## 5. Deploy a container from your image to the cluster.

```shell 
 $ kubectl run example1 --image=de.icr.io/watsonilab-ns-example/watsonilab-repo-example 
```

Deplo
```shell 
 $  kubectl expose deployment hello-node --type=NodePort --port=8383 --name=hello-node-service --target-port=8080  
```

check if service is created
```shell 
 $ kubectl get services 
```

you should see something like this
```
NAME                 TYPE        CLUSTER-IP      EXTERNAL-IP   PORT(S)          AGE
hello-node-service   NodePort    172.21.160.34   <none>        8383:32029/TCP   3h15m
kubernetes           ClusterIP   172.21.0.1      <none>        443/TCP          3h25m
```
Now we know the port from which the service is accessible from out. `8383:32029/TCP` is the same notation as above, so we can access the service on the port `32039`.

Since the External-IP of the service is not available (available only in the Premium version) we need to find out the IP adress of the worker in cluster where the service runs. We run again

```shell 
 $  ibmcloud ks workers --cluster <cluster_name_or_ID> 
```
and we get output like this
```
ID                                                 Public IP        Private IP     Machine Type   State    Status   Zone    Version   
kube-mil01-pa276fda8d92764f8c9898465b297de652-w1   159.122.187.43   10.144.183.7   free           normal   Ready    mil01   1.13.7_1528 
```

Right know we know everything to connect to the service - the IP is 159.122.187.43 and the port is 32029 so we will try to connect to [159.122.187.43:32029]() and we get 
```
Hello World!
```

and that's it 🎉🎉🎉. Now you know everything to deploy your own app on Kubernetes.

![](https://i.imgur.com/QdZZKDm.gif?1)