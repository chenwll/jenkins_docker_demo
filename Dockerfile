FROM node:14-alpine
WORKDIR /project
COPY package*.json /project/
RUN npm install
COPY . /project
RUN npm run build

FROM nginx
COPY --from=0 /project/dist /usr/share/nginx/City
COPY --from=0 /project/default.conf /etc/nginx/conf.d/City.conf