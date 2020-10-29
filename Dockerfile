FROM alpine:3.12

COPY entrypoint.sh /entrypoint.sh

RUN apk --update add git less openssh && \
    rm -rf /var/lib/apt/lists/* && \
    rm /var/cache/apk/*

ENTRYPOINT [ "/entrypoint.sh" ]
