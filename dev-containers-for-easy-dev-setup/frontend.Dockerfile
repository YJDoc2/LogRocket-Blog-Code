FROM node:20

RUN npm install -g http-server -y

COPY ./frontend /frontend

WORKDIR /frontend

CMD ["http-server",".","-p","3000"]