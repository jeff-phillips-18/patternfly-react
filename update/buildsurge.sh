#!/usr/bin/env bash

yarn build:docs
rm -rf .public/patternfly-4
cp -r packages/patternfly-4/react-docs/public .public/patternfly-4 
cp -r .public/patternfly-4/assets .public/assets 
cp .public/patternfly-4/favicon* .public
surge ./.public pf-react-mega-menu.surge.sh

