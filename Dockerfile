# Tahap Build
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Tahap Production (Nginx)
FROM nginx:alpine
# Copy build result
COPY --from=build /app/dist /usr/share/nginx/html
# Copy custom nginx config for React Router fallback
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
