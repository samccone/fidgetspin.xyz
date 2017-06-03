#!/bin/bash
set -o pipefail

yarn run build && \
git init && \
git checkout -b to_deploy
git add . && \
git commit -m "deploy" && \
git remote add deploy_time https://${GH_TOKEN}@github.com/samccone/fidgetspin.xyz.git
git push -f deploy_time to_deploy:gh-pages
