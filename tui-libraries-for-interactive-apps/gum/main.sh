#! /bin/bash

echo "Name of the package to serach for :"
NAME=$(gum input)
echo "Version of package to find (leave empty for any version)"
VERSION=$(gum input --value="*")
echo "Select registry :"
REGISTRY=$(gum choose https://reg{1..3}.com)

echo "name $NAME, version $VERSION, registry $REGISTRY"
