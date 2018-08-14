#!/usr/bin/env bash

echo 'db.createUser({user: "'"$MONGO_INITDB_ROOT_USERNAME"'",pwd: "'"$MONGO_INITDB_ROOT_PASSWORD"'",roles: ["readWrite"]});' | mongo $MONGO_INITDB_DATABASE