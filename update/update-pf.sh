#!/usr/bin/env bash

cp update/patternfly.css update/patternfly.min.css update/patternfly.min.css.map update/patternfly.scss node_modules/@patternfly/patternfly
cp -r update/MegaMenu node_modules/@patternfly/patternfly/components
cp -r update/MegaMenuModal node_modules/@patternfly/patternfly/components
