FROM nginx:latest
RUN rm /etc/nginx/conf.d/default.conf
COPY frontend.conf /etc/nginx/conf.d
COPY ./build/ /var/www/frontend/cdrive/
