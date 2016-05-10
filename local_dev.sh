#!/bin/bash
set -e
clear
npm run lint 2>/dev/null
clear
npm run test 2> /dev/null
