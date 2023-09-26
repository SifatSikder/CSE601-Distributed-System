FROM node:18

WORKDIR /app

COPY ./package.json .

RUN npm i

COPY ./ .

ENV PORT 8888

EXPOSE ${PORT}

CMD [ "npm", "run","dev" ]