cd packages/backend
zip -q -r chat_build.zip build package.json
mv chat_build.zip ../..
cd ../..
mkdir chat_build
unzip chat_build.zip -d ./chat_build
cd chat_build
yarn install
zip -q -r chat_build.zip build package.json node_modules
mv chat_build.zip ../
cd ../
rm -rf chat_build