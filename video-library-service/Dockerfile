FROM node:12-alpine
LABEL Name=one-platform-video-library-service \
  Version=0.0.1 \
  maintainer="mdeshmuk@redhat.com"

# Building the video-library microservice
ADD  . /app
WORKDIR /app
RUN npm install --silent && \
  npm run build

ENV PORT 8080
EXPOSE 8080 8443

CMD [ "node", "dist/bundle.js"]
