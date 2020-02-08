TAG := $(shell git describe --abbrev=0)

image:
	docker image build -t danielbok/spr-web:$(TAG) .
	docker image prune -f
