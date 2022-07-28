result of executing list_bindings in docker container

```log
root@my-rabbit:/# rabbitmqctl list_bindings
Listing bindings for vhost /...
source_name	source_kind	destination_name	destination_kind	routing_key	arguments
	exchange	amq.gen-JI621kU3Kz6jmcZ5Auay5w	queue	amq.gen-JI621kU3Kz6jmcZ5Auay5w	[]
	exchange	amq.gen-RY8PYkgnPEkwLpAOstBIZQ	queue	amq.gen-RY8PYkgnPEkwLpAOstBIZQ	[]
logs	exchange	amq.gen-JI621kU3Kz6jmcZ5Auay5w	queue		[]
logs	exchange	amq.gen-RY8PYkgnPEkwLpAOstBIZQ	queue		[]

```
