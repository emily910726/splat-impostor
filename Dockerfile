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
COPY --from=build /app/fonts ./fonts/
COPY --from=build /app/package*.json ./
RUN cp /app/fonts/Noto_Serif_SC.zip /usr/local/share/fonts
RUN unzip /usr/local/share/fonts/Noto_Serif_SC.zip -d /usr/local/share/fonts

CMD ["npm", "run", "start"]