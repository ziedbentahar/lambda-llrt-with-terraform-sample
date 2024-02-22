#! /bin/sh
set -e

LLRT_VERSION="${1:-latest}"
ARCHITECTURE="${2:-arm64}"
LAMBDA_HANDLERS_PATH=**/lambda-handlers
DIST_DIR=dist


if [ "$LLRT_VERSION" = "latest" ]; then
    PACKAGE_URL="https://github.com/awslabs/llrt/releases/${LLRT_VERSION}/download/llrt-lambda-${ARCHITECTURE}.zip"
else
    PACKAGE_URL="https://github.com/awslabs/llrt/releases/download/${LLRT_VERSION}/llrt-lambda-${ARCHITECTURE}.zip"
fi

# build
node esbuild.config.js $LAMBDA_HANDLERS_PATH $DIST_DIR

# download llrt
mkdir -p ./tmp/llrt-bootstrap-${LLRT_VERSION}-${ARCHITECTURE}
cd ./tmp/llrt-bootstrap-${LLRT_VERSION}-${ARCHITECTURE}

curl -L -o llrt-lambda-${LLRT_VERSION}-${ARCHITECTURE}.zip ${PACKAGE_URL}
unzip -o llrt-lambda-${LLRT_VERSION}-${ARCHITECTURE}.zip
rm -rf llrt-lambda-${LLRT_VERSION}-${ARCHITECTURE}.zip

cd ../..

for dir in ${DIST_DIR}/${LAMBDA_HANDLERS_PATH}; do
    cp ./tmp/llrt-bootstrap-${LLRT_VERSION}-${ARCHITECTURE}/bootstrap ${dir}
done
