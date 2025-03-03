# Stage 1: Build the Angular app
FROM node:22-alpine as build-angular

WORKDIR /build
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Create the final image
FROM nginx:alpine

WORKDIR /app
COPY --from=build-angular /build/dist/home-dashboard-client/browser /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80 443

CMD ["nginx", "-g", "daemon off;"]
