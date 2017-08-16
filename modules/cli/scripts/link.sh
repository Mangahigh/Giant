#!/usr/bin/env bash
set -e

##
# Links module specified in $1 to other modules.
# Should be run after cloning, or adding / removing modules.
##

if [[ $(giant run $1 "ls npm-links 2> /dev/null | grep npm-links") ]]; then
    giant run $1 "cat npm-links | xargs npm link"
else
    echo "No npm-links file found for module $1"
fi

giant run $1 "npm link"
