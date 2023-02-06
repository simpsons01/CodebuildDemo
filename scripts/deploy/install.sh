#!/bin/bash

CODEBUILD_WEBHOOK_PREV_COMMIT=b1298c4 
CODEBUILD_RESOLVED_SOURCE_VERSION=ed47ea4 

install() {
  echo "install npm dependencies......"
  npm install
}

if [ -d "node_modules" ]; then
  echo "node_modules dir exist......"
  if [ -s "node_modules" ];then
    GIT_STDOUT=$(git log $CODEBUILD_WEBHOOK_PREV_COMMIT..$CODEBUILD_RESOLVED_SOURCE_VERSION --oneline --pretty='format:' --name-only)
    ttt=$(echo $GIT_STDOUT | grep package.json)
    echo $ttt
  else
   echo "node_modules dir is empty......"
   install
  fi  
else
 install
fi

