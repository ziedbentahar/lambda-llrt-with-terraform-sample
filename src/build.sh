#! /bin/sh

LLRT_VERSION="${1:-latest}"
ARCHITECTURE="${2:-arm64}"

if [ "$LLRT_VERSION" = "latest" ]; then
    PACKAGE_URL="https://github.com/awslabs/llrt/releases/${LLRT_VERSION}/download/llrt-lambda-${ARCHITECTURE}.zip"
else
    PACKAGE_URL="https://github.com/awslabs/llrt/releases/download/${LLRT_VERSION}/llrt-lambda-${ARCHITECTURE}.zip"
fi

# clean up dist

# build
node esbuild.config.js

# download llrt
mkdir -p ./tmp/llrt-bootstrap-${LLRT_VERSION}-${ARCHITECTURE}
cd ./tmp/llrt-bootstrap-${LLRT_VERSION}-${ARCHITECTURE}

curl -L -o llrt-lambda-${LLRT_VERSION}-${ARCHITECTURE}.zip ${PACKAGE_URL}
unzip -o llrt-lambda-${LLRT_VERSION}-${ARCHITECTURE}.zip
rm -rf llrt-lambda-${LLRT_VERSION}-${ARCHITECTURE}.zip

cd ../..

for dir in dist/**/lambda-handlers; do
    cp ./tmp/llrt-bootstrap-${LLRT_VERSION}-${ARCHITECTURE}/bootstrap ${dir}
done
