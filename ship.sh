#!/bin/bash
set -o pipefail

yarn run build && \
git init && \
git add . && \
git commit -m "deploy" && \
git remote add origin https://${GH_TOKEN}@github.com/samccone/fidgetspin.xyz.git > /dev/null 2>&1 && \
git push -f origin master:gh-pages
