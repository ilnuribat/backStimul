FROM busybox

COPY . /app/build

CMD ["sh", "-c", "tail -f /dev/null"]
