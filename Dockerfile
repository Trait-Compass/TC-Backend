FROM node:22
RUN mkdir -p /var/app
WORKDIR /var/app
COPY . .
RUN npm install
RUN npm run build
EXPOSE 3000
CMD [ "sh", "-c", "npm run start:${environment}" ]
