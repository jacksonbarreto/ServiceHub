# Stage 1: Build the Angular app
FROM node:14 as build
WORKDIR /app
#COPY package.json package-lock.json ./
RUN npm install
COPY . .
#RUN npm run build

# Stage 2: Serve the app with Nginx
FROM nginx:1.24
#COPY --from=build /app/dist /usr/share/nginx/html
#COPY ./nginx-custom.conf /etc/nginx/conf.d/default.conf
