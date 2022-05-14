# build environment
FROM node:alpine

WORKDIR /anime-log
ADD . .

RUN npm install
RUN npm run build
RUN npx prisma generate

EXPOSE 3000

ENTRYPOINT ["npm", "run", "start"]