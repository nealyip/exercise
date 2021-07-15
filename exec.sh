#!/bin/bash
cd /app && npm run migrate && cd /app/build && node server.js
