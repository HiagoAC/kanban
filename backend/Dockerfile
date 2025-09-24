FROM python:3.13-alpine

WORKDIR /app
EXPOSE 8000

COPY ./requirements.txt tmp/requirements.txt

RUN pip install --upgrade pip \
    && apk update && apk add --no-cache bash \
    && pip install --no-cache-dir -r tmp/requirements.txt

COPY ./src/ /app/src/

ARG DEV=false
COPY ./requirements.dev.txt /tmp/requirements.dev.txt
COPY tests/ tests/
RUN if [ "$DEV" = "true" ]; \
    then pip install --no-cache-dir -r /tmp/requirements.dev.txt ; \
else \
    rm -rf /tmp/requirements.dev.txt tests ; \
fi

RUN addgroup -S nonroot \
    && adduser -S nonroot -G nonroot \
    && chown -R nonroot:nonroot /app \
    && chmod -R 755 /app

USER nonroot

CMD ["python", "src/manage.py", "runserver", "0.0.0.0:8000"]
