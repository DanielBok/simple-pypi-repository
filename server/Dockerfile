FROM python:3.8-slim

WORKDIR /app

RUN apt-get update -y && apt-get upgrade -y && apt-get install dos2unix vim -y
RUN apt-get install -y curl net-tools

COPY requirements.txt .
RUN pip install -r requirements.txt

# Copy application files
COPY . .

RUN dos2unix start.sh

EXPOSE 80 443
RUN chmod 0777 start.sh
ENTRYPOINT ["./start.sh"]
