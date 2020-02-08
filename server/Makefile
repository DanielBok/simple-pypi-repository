DB_NAME := "ppdb"
TAG := $(shell git describe --abbrev=0)

db:
	echo "Starting development database server"
	docker container run -d --name $(DB_NAME) \
		-p 5432:5432 \
		-e POSTGRES_PASSWORD=password \
		-e POSTGRES_USER=user \
		-e POSTGRES_DB=db \
		postgres:12-alpine

rm-db:
	docker container rm -f $(DB_NAME)

image:
	docker image build -t danielbok/spr-server:$(TAG) .
	docker image prune -f

certs:
	rm -rf certs
	mkdir certs
	openssl req -x509 -newkey rsa:4096 -keyout server.key -out server.crt -days 3650 -nodes
