#!/bin/bash
clear
echo Starting cURLs..

echo Retrieve all entities
curl http://127.0.0.1:9100/api/entity -H "Content-type: application/json"
echo Done !

echo Create an entity
curl http://127.0.0.1:9100/api/entity -H "Content-type: application/json" -X POST
echo Done !

echo Retrieve all entities again
curl http://127.0.0.1:9100/api/entity -H "Content-type: application/json"
echo Done !

echo All Done !
