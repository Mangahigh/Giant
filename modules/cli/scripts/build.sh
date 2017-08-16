#!/usr/bin/env bash
set -e

##
# Builds module specified in $1
##

if [[ $(giant run $1 "npm ls --depth=0 2> /dev/null | grep grunt") ]]; then
    ## calling grunt with params passed to build-distribute
    giant run $1 "grunt build ${@:2}"
else
    echo "Grunt is not available for module $1"
fi
