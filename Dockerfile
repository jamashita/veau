FROM node:14.5.0 as build-image

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

FROM node:14.5.0

USER root

RUN groupadd veau
RUN useradd -g veau veau
RUN mkdir -p /home/veau
WORKDIR /home/veau

COPY --from=build-image /root/dist dist
COPY config config
COPY pm2.yml pm2.yml
COPY package.json package.json
COPY yarn.lock yarn.lock

RUN mkdir logs
RUN yarn install --production=true --frozen-lockfile
RUN yarn cache clean

RUN chown -R veau /home/veau
RUN chgrp -R veau /home/veau

USER veau
WORKDIR /home/veau

EXPOSE 4000

CMD ["yarn", "start"]
