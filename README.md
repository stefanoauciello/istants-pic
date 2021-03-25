# Istants-pic

NodeJS backend with dockerized solution. <br>
The principal goal of this backend is to resize uploaded photos. <br>
You just need to clone it, install dependencies and execute with "yarn start" command.

Installation Required:
- Docker
- NodeJS
- NPM
- Yarn

1) "git clone https://github.com/stefanoauciello/istants-pic.git"
2) "yarn install" in cloned folder
3) "docker stop $(docker ps -a -q)" to stop all running docker containers
4) "yarn test" in cloned folder to run application tests
5) "yarn start" in cloned folder to start application

In "postman-collection" folder you may find the collection of API-REST calls that you may use with the backend. 
Obviously you should change the file location in POST call.

[![CircleCI](https://circleci.com/gh/circleci/circleci-docs.svg?style=svg)](https://circleci.com/gh/circleci/circleci-docs)