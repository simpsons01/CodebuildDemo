#!/bin/bash

NODE_MODULES_PATH="node_modules"
GUTHUB_API_URL="https://api.github.com/repos/simpsons01/CodebuildDemo"
JQ=$(which jq)
PR_NUMBER=$(echo $CODEBUILD_WEBHOOK_TRIGGER | cut -d "/" -f 2)
HEAD_BRANCH=$(echo $CODEBUILD_WEBHOOK_HEAD_REF | sed -e 's/refs\/heads\///g')

get_git_log() {
  result=$(git log $1 -n $2 --oneline --pretty='format:' --name-only)
  echo $result
}

get_pr() {
 result=$(curl -X GET ${GUTHUB_API_URL}/pulls/$1 -H "Accept: application/vnd.github.v3+json" -H "Authorization: $GITHUB_ACCESS_TOKEN")
 echo $result
}

delete_node_modules() {
  echo "delete node_modules......"
  rm -rf node_modules
}

install_node_modules() {
  echo "install npm dependencies......"
  npm install
}

if [ ! -x $JQ ]; then
  echo "jq is not install!"
  exit 1
fi

if [ -d $NODE_MODULES_PATH ]; then
  echo "node_modules dir exist......"
  if [ ! -z "$(ls -A $NODE_MODULES_PATH)" ];then
     pr_result=$(get_pr $PR_NUMBER)
     commit_num=$(echo $pr_result | $JQ '.commits')
     git_log=$(get_git_log $HEAD_BRANCH $commit_num)
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