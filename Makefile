BABEL=./node_modules/.bin/babel
BABEL_ISTANBUL=./node_modules/.bin/babel-istanbul
BABEL_NODE=./node_modules/.bin/babel-node
BUILD_DIRECTORY=./build
ENVIRONMENT=local
ENVIRONMENT_TEST=test
ESLINT=./node_modules/.bin/eslint
MOCHA=./node_modules/.bin/mocha
MOCHA_=./node_modules/.bin/_mocha
PORT=0

.PHONY: build clean help lint install start test test-coverage

.DEFAULT_GOAL := help

build: ## transpile the files from ES6 to JS
	@$(MAKE) -s lint
	@$(MAKE) -s clean
	@echo " > Building the project in $(BUILD_DIRECTORY)"
	@$(BABEL) -q ./src -d $(BUILD_DIRECTORY)

clean: ## clean artifacts
	@echo " > Cleaning $(BUILD_DIRECTORY)"
	@rm -rf $(BUILD_DIRECTORY)

help: ## provide help to you
	@echo "Please use \`make <target>' where <target> is one of"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "	\033[36m%-30s\033[0m %s\n", $$1, $$2}'

lint: ## check the quality code and ES6 integration
	@echo " > Linting the source"
	@$(ESLINT) ./src

install: ## install dependencies
	@echo " > Installing the project"
	@npm install

start: ## start the web server
	@echo " > Starting the project"
	@$(MAKE) -s build
	@export PORT=$(PORT) && export NODE_ENV=$(ENVIRONMENT) && node $(BUILD_DIRECTORY)/index.js

test: ## launch tests
	@echo " > Testing the project"
	@$(MAKE) -s build
	@export PORT=$(PORT)
	@export NODE_ENV=$(ENVIRONMENT_TEST)
	@$(MOCHA) --compilers js:babel-core/register --recursive --reporter nyan

test-coverage: ## launch tests with coverage
	@echo " > Testing with coverage"
	@$(MAKE) -s build
	@export PORT=$(PORT)
	@export NODE_ENV=$(ENVIRONMENT_TEST)
	@$(BABEL_NODE) $(BABEL_ISTANBUL) cover $(MOCHA_) --report html --report text --check-coverage -- --recursive