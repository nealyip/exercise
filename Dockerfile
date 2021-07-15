FROM node:14-alpine AS install-image

WORKDIR /app

RUN chown node:node /app

USER node

COPY --chown=node:node ./package*.json ./

RUN npm install

FROM node:14-alpine AS runtime-image

WORKDIR /app

COPY --from=install-image /app /app
COPY --chown=node:node ./ .

RUN npm run build && \
    cd build && \
    npm ci --production && \
    cp /app/.env /app/build/.env

EXPOSE 3333

CMD ["sh", "/app/exec.sh"]
