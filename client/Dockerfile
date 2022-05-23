FROM node:lts as building-stage

WORKDIR /app

COPY package*.json /app/

RUN npm ci

COPY ./ /app/

RUN npm run build

## Create NGINX deployment
FROM nginx:latest

COPY --from=building-stage /app/build /usr/share/nginx/html

COPY ./nginx.conf /etc/nginx/conf.d/default.conf

ENV REACT_APP_BACKEND_HOST=https://buergerbuero.smartcity.w-mi.de/api

EXPOSE 80
