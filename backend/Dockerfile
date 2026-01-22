FROM python:3.13-slim

ENV PYTHONDONTWRITEBYTECODE 1 \
    PYTHONUNBUFFERED 1

WORKDIR /app
EXPOSE 8000

# Copy requirements files
COPY ./requirements.txt /tmp/requirements.txt
COPY ./requirements.dev.txt /tmp/requirements.dev.txt
COPY ./scripts /scripts
COPY ./app /app

# Install dependencies
RUN apt-get update \
    && apt-get install -y --no-install-recommends bash \
    gcc \
    libpq-dev \
    libpcre2-dev \
    && pip install --upgrade pip \
    && pip install --no-cache-dir -r /tmp/requirements.txt \
    && rm -rf /var/lib/apt/lists/*

# install dev dependencies if DEV argument is true
ARG DEV=false
RUN if [ "$DEV" = "true" ]; \
    then pip install --no-cache-dir -r /tmp/requirements.dev.txt ; \
else \
    rm -rf /tmp/requirements.dev.txt ; \
fi

ARG UID=1000
ARG GID=1000
RUN adduser --disabled-password --gecos "" django-user \
    && groupmod -g ${GID} django-user && usermod -u ${UID} -g ${GID} django-user \
    && mkdir -p /app/staticfiles \
    && chown -R django-user:django-user /app \
    && chmod -R 755 /app \
    && chmod -R +x /scripts

ENV PATH="/scripts:/py/bin:$PATH"

USER django-user

CMD ["run.sh"]