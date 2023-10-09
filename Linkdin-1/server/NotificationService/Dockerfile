FROM node:16

WORKDIR /app

COPY ./package.json .

RUN npm i

COPY ./ .

ENV PORT 8000

EXPOSE ${PORT}

CMD [ "npm", "run","dev" ]