cd packages/backend
zip -q -r build.zip build package.json
mv build.zip ../..
cd ../..
mkdir build
unzip build.zip -d ./build
cd build
yarn install
zip -q -r build.zip build package.json node_modules
mv build.zip ../
cd ../
rm -rf build