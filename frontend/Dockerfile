# -------- Build Stage --------
FROM node:20-alpine AS build
WORKDIR /app

# Accept API URL at build time (Vite bakes env vars at build)
ARG VITE_API_URL=http://localhost:5000/api
ENV VITE_API_URL=$VITE_API_URL

COPY package*.json ./
RUN npm ci && npm cache clean --force
COPY . .
RUN npm run build

# -------- Serve Stage --------
FROM nginx:alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
