#!/bin/bash
HUGO_ARCHIVE="tools/hugo-${HUGO_VERSION}.tar.gz"
mkdir -p tools

if [[ ! -f "${HUGO_ARCHIVE}" ]]; then
    wget -O "${HUGO_ARCHIVE}" "https://github.com/spf13/hugo/releases/download/v${HUGO_VERSION}/hugo_${HUGO_VERSION}_Linux-64bit.tar.gz"
    if [[ -x sha256sum ]]; then
        echo "${HUGO_SHA} hugo-${HUGO_VERSION}.tar.gz" | sha256sum -c
    fi
    cd tools && tar -xzvf "hugo-${HUGO_VERSION}.tar.gz"
fi
