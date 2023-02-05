FROM node:alpine3.17 as build
COPY src src
COPY package.json package.json
COPY package-lock.json package-lock.json
COPY tsconfig.json tsconfig.json
COPY tsconfig.build.json tsconfig.build.json
RUN npm install
RUN npm run build

FROM node:alpine3.17 as production
COPY --from=build /dist /dist
COPY package.json package.json
COPY package-lock.json package-lock.json
RUN npm install --production
CMD [ "node", "dist/main" ]