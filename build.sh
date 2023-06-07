yarn workspace backend build
yarn workspace frontend build
yarn workspace types build
cd packages/backend/build
cp -r ../../frontend/dist .