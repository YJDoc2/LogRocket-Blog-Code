FROM python:3.9.18-alpine3.18

RUN pip install flask

COPY ./backend /backend

WORKDIR /backend

# we must specify the host as 0.0.0.0 otherwise cannot access outside container
CMD ["flask","--app","/backend/server.py","run","--host","0.0.0.0"]