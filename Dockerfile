# build stage
FROM node:16-alpine as build-stage
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build-only

# production stage
FROM nginx:1.19.6-alpine as production-stage
COPY --from=build-stage /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY certs  /etc/nginx/ssl
EXPOSE 443
CMD ["nginx", "-g", "daemon off;"]
