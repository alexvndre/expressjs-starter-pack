BABEL=./node_modules/.bin/babel
BABEL_NODE=./node_modules/.bin/babel-node
BUILD_DIRECTORY=./build
ESLINT=./node_modules/.bin/eslint
PORT=3000

.PHONY: build help lint install start

build:
	@$(MAKE) -s lint
	@echo " > Building the project in $(BUILD_DIRECTORY)"
	@rm -rf $(BUILD_DIRECTORY)/*
	@$(BABEL) -q ./src -d $(BUILD_DIRECTORY)

help:
	@echo "Please use \`make <target>' where <target> is one of"
	@echo "  build			transpile the files from ES6 to JS"
	@echo "  lint			lint the code"
	@echo "  install		install dependencies"
	@echo "  start			start the web server"

lint:
	@echo " > Linting the source"
	@$(ESLINT) ./src

install:
	@echo " > Installing the project"
	@npm install

start:
	@echo " > Starting the project"
	@$(MAKE) -s build
	@export PORT=$(PORT) && export NODE_ENV=local && node $(BUILD_DIRECTORY)/index.js

test:
	@echo " > Testing"
	@echo "No test available"

test-coverage:
	@echo " > Testing with coverage"
	@echo "No test available"
