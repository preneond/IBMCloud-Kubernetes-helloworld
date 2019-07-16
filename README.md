# IBMCloud Kubernetes Tutorial
Tutorial how to create a docker image, upload the image on *IBM Container Registry* and deploy it on IBM Kubernetes Services. 

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


## Create a Kubernetes cluster in IBM Cloud Kubernetes Service.
```shell
$ ibmcloud ks cluster-create --name my_cluster
```

```shell
$ ibmcloud ks cluster-create --name my_cluster
```

```shell 
 $ ibmcloud ks clusters
```
