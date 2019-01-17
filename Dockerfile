FROM node:11.6.0 as build-image

USER root
WORKDIR /root

COPY src src
COPY gulpfile.js gulpfile.js
COPY package.json package.json
COPY tsconfig.json tsconfig.json
COPY yarn.lock yarn.lock

RUN yarn install --production=false
RUN yarn build

FROM node:11.6.0

USER root
WORKDIR /root

RUN mkdir app
WORKDIR /root/app

COPY --from=build-image /root/dist dist
COPY config config
COPY logs logs
COPY package.json package.json
COPY yarn.lock yarn.lock

RUN yarn install --production=true

EXPOSE 4000

CMD ["yarn", "start"]
