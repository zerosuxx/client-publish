FROM node:17-alpine AS base

RUN adduser --disabled-password app

FROM base AS app

USER app

RUN mkdir -p /home/app/client-publish

WORKDIR /home/app/client-publish

COPY --chown=app:app package.json .
COPY --chown=app:app package-lock.json .

RUN npm i --omit dev

COPY --chown=app:app . .

ENTRYPOINT ["node", "bin/client-publish.js"]

FROM base AS emartech

RUN npm i -g @emartech/client-publish

USER app

ENTRYPOINT ["client-publish"]