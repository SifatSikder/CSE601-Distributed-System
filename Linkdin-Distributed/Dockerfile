# Stage 0, for downloading project’s npm dependencies, building and compiling the app.
FROM node:16 as builder
WORKDIR /app
COPY ./client/package.json ./    
RUN npm install 
COPY ./client .
RUN npm run build --prod



FROM nginx
COPY ./nginx.default.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist/client/ /usr/share/nginx/html








