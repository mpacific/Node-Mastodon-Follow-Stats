#!/bin/bash
cd "$(dirname "$0")";
npm start >> log/followers_$(date +'%F').log;