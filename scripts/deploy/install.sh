#!/bin/bash

NODE_MODULES_PATH="node_modules"
START_COMMIT=$CODEBUILD_WEBHOOK_PREV_COMMIT
END_COMMIT=$CODEBUILD_RESOLVED_SOURCE_VERSION

get_git_log() {
  result=$(git log $1..$2 --oneline --pretty='format:' --name-only)
  echo $result
}

delete_node_modules() {
  echo "delete node_modules......"
  rm -rf node_modules
}

install_node_modules() {
  echo "install npm dependencies......"
  yarn
}

if [ -d $NODE_MODULES_PATH ]; then
  echo "node_modules dir exist......"
  if [ ! -z "$(ls -A $NODE_MODULES_PATH)" ];then
     git_log=$(get_git_log $START_COMMIT $END_COMMIT)
     grep_package_json=$(echo $git_log | grep package.json)
     if [ -z "$grep_package_json" ]; then
      echo "package.json is not modified and use codebuild cache"
     else
      echo "package.json is modified"
      delete_node_modules
      install_node_modules
     fi
  else
   echo "node_modules dir exist but empty......"
   install_node_modules
  fi
else 
  echo "node_modules dir does not exist......"
  install_node_modules
fi

