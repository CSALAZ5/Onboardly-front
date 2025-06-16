#!/usr/bin/env bash
set -eux
rm ~/.npmrc | true
curl -u "${ARTIFACTORY_READER_USER}:${ARTIFACTORY_READER_API_KEY}" 'https://bbogdigital.jfrog.io/bbogdigital/api/npm/auth' >> ~/.npmrc
npm ci || exit 1
git reset --hard || exit 1
