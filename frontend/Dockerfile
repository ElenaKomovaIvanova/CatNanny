# frontend/Dockerfile
FROM node:16 as build
ARG REACT_APP_API_URL

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

COPY . .

# Сборка проекта React
#RUN npm run build
RUN REACT_APP_API_URL=${REACT_APP_API_URL} \
  npm run build


# Используем nginx для статического сервера
FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html

# Копируем конфигурацию nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf
