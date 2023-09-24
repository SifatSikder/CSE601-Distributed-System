# Stage 0, for downloading project’s npm dependencies, building and compiling the app.
FROM node:18 as node
WORKDIR /app
COPY package.json ./    
RUN npm install 
COPY . .
CMD [ "npm","start" ]





