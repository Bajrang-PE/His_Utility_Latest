# Stage 1: Build with Node (nodework)
FROM node:alpine3.16 AS nodework
WORKDIR /fe-central-dashboard

#COPY package.json .
#ENV NODE_OPTIONS="--max-old-space-size=4096"
#RUN npm install --verbose
COPY . .
#RUN npm run build
RUN ls -la /fe-central-dashboard

# Stage 2: Nginx deployment
FROM nginx:alpine
WORKDIR /usr/share/nginx/html
RUN rm -rf ./*
COPY nginx-custom.conf /etc/nginx/conf.d/default.conf
COPY dist .
COPY --from=nodework /fe-central-dashboard/dist .
ENTRYPOINT ["nginx", "-g", "daemon off;"]

