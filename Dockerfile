FROM denoland/deno:alpine

WORKDIR /app

COPY . .

RUN deno cache src/interface/web/web.js

EXPOSE 8000

CMD ["run", "-A", "src/interface/web/web.js"]
