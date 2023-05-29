ARG NODE_BASE_VERSION="node:14.20.1"
ARG NGINX_BASE_VERSION="nginx:1.18"

FROM public.ecr.aws/docker/library/${NODE_BASE_VERSION} AS install

WORKDIR /app
COPY package.json .
COPY yarn.lock .

RUN yarn install

FROM install AS build
WORKDIR /app
COPY . .

RUN yarn build

FROM build AS unit-test
RUN yarn test:unit

FROM public.ecr.aws/docker/library/${NGINX_BASE_VERSION}-alpine
RUN mkdir /app
COPY --from=build /app/dist /app
COPY nginx/default.conf /etc/nginx/templates/default.conf.template

RUN mkdir /app/public
ARG BUILD_COMMIT_SHA
ARG IMAGE_TAG
RUN echo "{\"commitSha\":\"$BUILD_COMMIT_SHA\",\"imageTag\":\"$IMAGE_TAG\",\"buildTs\":$(date +%s)}" > /app/public/version.json
