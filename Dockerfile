FROM python:3.9

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

ENV APP_HOME=/app
RUN mkdir $APP_HOME
RUN mkdir $APP_HOME/staticfiles
RUN mkdir $APP_HOME/mediafiles
WORKDIR $APP_HOME

# Install system dependencies
RUN apt-get update && apt-get install -y \
    binutils \
    libproj-dev \
    gdal-bin \
    python3-gdal


COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .

EXPOSE 8000

ENTRYPOINT [ "sh", "./starter.sh" ]