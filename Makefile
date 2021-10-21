.PHONY: docker help

UNAME_M := $(shell uname -m)
RACE=
ifeq ($(UNAME_M),x86_64)
	RACE=-race
endif

GET_LAST_TAGV = $(shell git tag --sort=v:refname | tail -1)

all: docker-build ## Test, lint check and build application

docker-build: ## build latest version locally
	docker buildx build -f Dockerfile -t adrianrudnik/mjml-server --load .

docker-release: DOCKER_CLI_EXPERIMENTAL=enabled
docker-release: ## build latest tag version and publish
	# read latest version tag from local git for release
	$(eval TAGV=$(GET_LAST_TAGV))
	# build and publish multiarch
	docker buildx build -f Dockerfile --platform linux/amd64,linux/arm64,linux/arm/v6,linux/arm/v7,linux/ppc64le -t adrianrudnik/mjml-server:latest -t adrianrudnik/mjml-server:${TAGV} --push .

npm-upgrade:
	npm install -g npm-check-updates
	ncu -u

help: ## Print all possible targets
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z0-9_-]+:.*?## / {gsub("\\\\n",sprintf("\n%22c",""), $$2);printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}' $(MAKEFILE_LIST)
