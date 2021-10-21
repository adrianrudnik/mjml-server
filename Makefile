.PHONY: docker help

UNAME_M := $(shell uname -m)
RACE=
ifeq ($(UNAME_M),x86_64)
	RACE=-race
endif

all: docker ## Test, lint check and build application


docker: ## create docker images
	#  create arm64
	docker buildx build -f Dockerfile --platform linux/arm64 --tag dndit/mjml-server:arm64 .
	# create amd64
	docker buildx build -f Dockerfile --platform linux/amd64 --tag dndit/mjml-server:amd64 .
	# push arm64
	docker push dndit/mjml-server:arm64
	# push amd64
	docker push dndit/mjml-server:amd64
	# create multi arch manifest
	# docker manifest create $(DOCKER_REGISTRY):alpine3.12-manual --amend $(DOCKER_REGISTRY):alpine3.12-arm64 --amend $(DOCKER_REGISTRY):alpine3.12-amd64
	docker manifest create dndit/mjml-server --amend dndit/mjml-server:arm64 --amend dndit/mjml-server:amd64
	# push
	docker manifest push dndit/mjml-server

help: ## Print all possible targets
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z0-9_-]+:.*?## / {gsub("\\\\n",sprintf("\n%22c",""), $$2);printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}' $(MAKEFILE_LIST)