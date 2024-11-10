# frontend/Dockerfile
FROM node:16 as build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

COPY . .

# Сборка проекта React
RUN npm run build

# Используем nginx для статического сервера
FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html

# Копируем конфигурацию nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf
