#!/bin/bash

# removing with rm will not remove .git
rm -rf /home/user/ptrwis.github.io/*
ng build --prod  --deleteOutputPath=false --outputPath=/home/user/ptrwis.github.io/

pushd /home/user/ptrwis.github.io
 git add --all 
 git commit -m 'save'
 git push
popd
