# Development details

## Multiplatform builds

Based on https://docs.docker.com/build/building/multi-platform/.

```shell
docker run --privileged --rm tonistiigi/binfmt --install all
docker buildx create --name mjmlbuilder --bootstrap --use
# docker buildx use mjmlbuilder
docker buildx ls
docker buildx build --push --platform linux/amd64,linux/arm/v6,linux/arm/v7,linux/arm64,linux/arm64,linux/ppc64le -t adrianrudnik/mjml-server:latest -t adrianrudnik/mjml-server:2.5.2 .
```
