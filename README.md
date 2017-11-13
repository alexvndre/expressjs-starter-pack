Express.js starter pack [![Build Status](https://travis-ci.org/alexvndre/expressjs-starter-pack.svg?branch=master)](https://travis-ci.org/alexvndre/expressjs-starter-pack)
======

A ready to use [Express.js](https://expressjs.com) solution.

## Requirements

* [NodeJS](https://nodejs.org)

## How to use?

### Install the project

Install dependencies from [npm](https://www.npmjs.com) (or whatever).

`$ make install`

### Run tests

Run tests to verify the installation.

`$ make test` or `$ make test-coverage`

### Run the project (without [Docker](https://www.docker.com/))

The project is available on [http://127.0.0.1:<PORT>](http://127.0.0.1:<PORT>).

`$ make start`

### Run the project (with [Docker](https://www.docker.com/))

#### Build the image

`$ docker build -t alexvndre/express-js-starter-pack .`

You can check that your image is listed by Docker with `$ docker images`.

#### Run the image

`$ docker run -p 49160:3000 -d alexvndre/express-js-starter-pack`

Check if the image is running with `$ docker ps`. You can read the app output with `$ docker logs <CONTAINER_ID>`.
If you need to run an app command, `$ docker exec -it <CONTAINER_ID> /bin/bash`.
To kill it: `$ docker kill <CONTAINER_ID>`.

### TODO

* Command sample ([commander](https://github.com/tj/commander.js))
* External HTTP calls ([request](https://github.com/request/request))
* Mock test ([sinon.js](http://sinonjs.org))
* BDD ([mongodb](https://www.npmjs.com/package/mongodb) and other wrappers)
