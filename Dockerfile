FROM python:3.9

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

WORKDIR /app

COPY ./requirements.txt /app/requirements.txt
COPY ./starter.sh /

RUN pip install -r requirements.txt

COPY . /app/

ENTRYPOINT [ "sh", "./starter.sh" ]