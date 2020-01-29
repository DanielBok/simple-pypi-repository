DB_NAME := "ppdb"

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
