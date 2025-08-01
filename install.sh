#!/bin/bash
mkdir uploads
cp -r /opt/devops/env/server/.env /opt/devops/release/server/.env
npm install --ignore-script
cd prisma
npx prisma migrate dev
npx prisma db seed