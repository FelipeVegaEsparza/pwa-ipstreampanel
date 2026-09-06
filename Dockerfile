# Build por cliente para Dockploy.
# Uso (Dockploy/Easypanel): BUILD_ARGS="CLIENT=radio-prueba"
ARG CLIENT=radio-prueba

FROM node:20-alpine AS build
WORKDIR /app
ARG CLIENT

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
# "$CLIENT" entre comillas y la validación kebab-case en scripts/build-client.mjs
# hacen que un CLIENT malformado falle el build en vez de expandirse como shell.
RUN npm run build:client -- "$CLIENT"

FROM nginx:alpine
ARG CLIENT
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist/${CLIENT} /usr/share/nginx/html
# Servir como no-root: nginx:alpine trae el usuario "nginx" (UID 101).
RUN chown -R nginx:nginx /usr/share/nginx/html
USER nginx
EXPOSE 80
