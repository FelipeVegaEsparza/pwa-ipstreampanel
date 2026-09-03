# Build por cliente para Dockploy.
# Uso (Dockploy/Easypanel): BUILD_ARGS="CLIENT=fusionaustral"
ARG CLIENT=radio-a

FROM node:20-alpine AS build
WORKDIR /app
ARG CLIENT

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build:client -- ${CLIENT}

FROM nginx:alpine
ARG CLIENT
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist/${CLIENT} /usr/share/nginx/html
EXPOSE 80
