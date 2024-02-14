GLOBAL_DEPS=Makefile $(wildcard src/**.es6) build/build.js build/config.js node_modules

PROJECT_DIR=$(patsubst %/,%,$(dir $(abspath $(lastword $(MAKEFILE_LIST)))))
GH_PAGES_PATH=$(PROJECT_DIR)/gh-pages

.PHONY: test build

all: test build

test: $(GLOBAL_DEPS)
	yarn test

build: $(GLOBAL_DEPS)
	yarn build

node_modules:
	yarn install --frozen-lockfile

release-docs: gh-pages build $(PROJECT_DIR)/dist/samjs.min.js $(PROJECT_DIR)/dist/guessnum.min.js
	cp $(PROJECT_DIR)/dist/samjs.min.js \
		$(PROJECT_DIR)/dist/guessnum.min.js \
		$(GH_PAGES_PATH)/dist
	git -C $(GH_PAGES_PATH) add .
	git -C $(GH_PAGES_PATH) commit -m "update release"

gh-pages: $(GLOBAL_DEPS)
ifeq ($(wildcard $(GH_PAGES_PATH)/),)
	git clone -b gh-pages $(shell git remote get-url --push origin) $(GH_PAGES_PATH)
else
	(cd $(GH_PAGES_PATH) && git pull)
endif
