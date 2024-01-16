ARG DOCKER_PUBLIC_REPO=${DOCKER_PUBLIC_REPO}
ARG NODE_BASE_VERSION="node:14.20.1"
ARG NGINX_BASE_VERSION="nginx:1.25"

FROM ${DOCKER_PUBLIC_REPO}/${NODE_BASE_VERSION} AS install

WORKDIR /app
COPY package.json .
COPY yarn.lock .

RUN yarn install

FROM install AS build
WORKDIR /app
COPY . .

RUN yarn build

ARG RELEASE_NAME=${RELEASE_NAME}
RUN sed -i "s/<\/head>/<script>window.RELEASE_NAME='$RELEASE_NAME';<\/script><\/head>/" /app/dist/index.html

FROM build AS unit-test
# RUN yarn test:unit

FROM ${DOCKER_PUBLIC_REPO}/${NGINX_BASE_VERSION}-alpine
RUN mkdir /app
COPY --from=build /app/dist /app
COPY nginx/default.conf /etc/nginx/templates/default.conf.template
COPY nginx/nginx.conf /etc/nginx/nginx.conf

RUN mkdir /app/public
ARG BUILD_COMMIT_SHA
ARG IMAGE_TAG
RUN echo "{\"commitSha\":\"$BUILD_COMMIT_SHA\",\"imageTag\":\"$IMAGE_TAG\",\"buildTs\":$(date +%s)}" > /app/public/version.json
