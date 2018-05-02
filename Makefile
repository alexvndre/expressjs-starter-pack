include ./.env

.PHONY: build check clean help lint install start test test-coverage

.DEFAULT_GOAL := help

build: ## transpile the files from ES6 to JS
	@$(MAKE) -s lint
	@$(MAKE) -s clean
	@echo " > Building the project in $(BUILD_DIRECTORY)"
	@$(BABEL) -q ./src -d $(BUILD_DIRECTORY)

check: ## check dependencies
	@echo " > Checking dependencies"
	@$(NCU)

clean: ## clean artifacts
	@echo " > Cleaning $(BUILD_DIRECTORY)"
	@rm -rf $(BUILD_DIRECTORY)

help: ## provide help to you
	@echo "Please use \`make <target>' where <target> is one of"
	@echo "$$(grep -hE '^\S+:.*##' $(MAKEFILE_LIST) | sed -e 's/:.*##\s*/:/' -e 's/^\(.\+\):\(.*\)/\1:\2/' | column -c2 -t -s :)"

lint: ## check the quality code and ES6 integration
	@echo " > Linting the source"
	@$(ESLINT) ./src

install: ## install dependencies
	@echo " > Installing the project"
	@npm install

start: ## start the web server
	@echo " > Starting the project"
	@$(MAKE) -s build
	@export NODE_ENV=dev && \
		node $(BUILD_DIRECTORY)/index.js

test: ## launch tests
	@echo " > Testing the project"
	@$(MAKE) -s build
	@export PORT=0 && \
		export NODE_ENV=test &&  \
		$(MOCHA) --require babel-core/register --recursive --exit

test-coverage: ## launch tests with coverage
	@echo " > Testing with coverage"
	@$(MAKE) -s build
	@export PORT=0 && \
		export NODE_ENV=test && \
		$(BABEL_NODE) $(BABEL_ISTANBUL) cover $(MOCHA_) --report html --report text --check-coverage -- --recursive --exit
