FROM python:3.13-slim

ENV PYTHONDONTWRITEBYTECODE 1 \
    PYTHONUNBUFFERED 1

WORKDIR /app
EXPOSE 8000

# Copy project
COPY ./requirements.txt /tmp/requirements.txt
COPY ./requirements.dev.txt /tmp/requirements.dev.txt
COPY ./scripts /scripts

# Install dependencies
RUN apt-get update \
    && apt-get install -y --no-install-recommends bash \
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

# Create django user and set permissions
RUN useradd --system django-user && \
    mkdir -p /vol/web/media && \
    chown -R django-user:django-user /vol && \
    chmod -R 755 /vol && \
    chmod -R +x /scripts

ENV PATH="/scripts:$PATH"

USER django-user
