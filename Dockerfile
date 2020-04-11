FROM node:13.10.1 as build-image

USER root
WORKDIR /root

COPY src src
COPY gulpfile.js gulpfile.js
COPY tsconfig.json tsconfig.json
COPY package.json package.json
COPY webpack.config.js webpack.config.js
COPY yarn.lock yarn.lock

RUN yarn install --production=false --frozen-lockfile
RUN yarn build

FROM node:13.10.1

USER root
WORKDIR /root

RUN mkdir app
WORKDIR /root/app

COPY --from=build-image /root/dist dist
COPY config config
COPY pm2.config.js pm2.config.js
COPY package.json package.json
COPY yarn.lock yarn.lock

RUN mkdir logs
RUN yarn install --production=true --frozen-lockfile
RUN yarn cache clean
RUN yarn global add pm2

EXPOSE 4000

CMD ["yarn", "start"]
