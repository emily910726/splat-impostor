FROM node:latest as build
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN mkdir data
RUN mkdir data/raw
RUN mkdir data/raw/splat3
RUN git clone https://github.com/Leanny/splat3.git data/raw/splat3
RUN npm run pull-data

FROM node:latest as final
WORKDIR /app
COPY --from=build /app/data/clean ./data/clean/
COPY --from=build /app/node_modules ./node_modules/
COPY --from=build /app/src ./src/
COPY --from=build /app/package*.json ./
COPY --from=build /app/.env ./

CMD ["npm", "run", "start"]
# ENTRYPOINT ["tail", "-f", "/dev/null"]
