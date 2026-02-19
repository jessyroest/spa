# ── Serenova Spa Website ─────────────────────────────────────
# Serve static files with a lightweight nginx alpine image

FROM nginx:alpine

# Copy website files into nginx's default serve directory
COPY . /usr/share/nginx/html

# Remove the default nginx config and add our own
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
