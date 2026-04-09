FROM denoland/deno:alpine

WORKDIR /app

# Copy dependency files
COPY deno.json deno.lock ./

# Cache dependencies
RUN deno cache --lock=deno.lock src/interface/web/web.js || true

# Copy source code
COPY . .

# Expose port
EXPOSE 8000

# Run the app
CMD ["deno", "run", "-A", "--watch", "src/interface/web/web.js"]
