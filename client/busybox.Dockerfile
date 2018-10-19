FROM busybox

COPY build /app/build

CMD ["sh", "-c", "tail -f /dev/null"]
