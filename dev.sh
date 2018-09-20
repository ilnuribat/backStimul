#!/bin/bash
cd server
npm i
npm run databases:up
npm run migrate:up
npm run dev &

cd ../client
npm i
npm start &

