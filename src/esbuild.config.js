const path = require("path")
const esbuild = require("esbuild")
const { globSync } = require("glob");
const esbuildPluginTsc = require("esbuild-plugin-tsc");

const entryPoints = globSync("./**/lambda-handlers/*.ts", { ignore: ["node_modules/**"] })

let examplePlugin = {
  name: 'example',
  setup(build) {
    build.onEnd(result => {
      console.log({ result: result.outputFiles })
      console.log(`build ended with ${result.errors.length} errors`)
    })
  },
}

esbuild.build({
  entryPoints: entryPoints.filter(f => f.indexOf(".test.ts") < 0),
  bundle: true,
  format: "esm",
  outdir: path.join(__dirname, `dist`),
  outbase: ".",
  platform: "node",
  minify: true,
  outExtension: {
    ".js": ".mjs"
  },
  plugins: [
    esbuildPluginTsc()
  ],
  external: [
    "@aws-sdk/client-dynamodb",
    "@aws-sdk/lib-dynamodb",
    "@aws-sdk/client-kms",
    "@aws-sdk/client-lambda",
    "@aws-sdk/client-s3",
    "@aws-sdk/client-secrets-manager",
    "@aws-sdk/client-ses",
    "@aws-sdk/client-sns",
    "@aws-sdk/client-sqs",
    "@aws-sdk/client-sts",
    "@aws-sdk/client-ssm",
    "@aws-sdk/client-cloudwatch-logs",
    "@aws-sdk/client-cloudwatch-events",
    "@aws-sdk/client-eventbridge",
    "@aws-sdk/client-sfn",
    "@aws-sdk/client-xray",
    "@aws-sdk/client-cognito-identity",
    "@aws-sdk/util-dynamodb",
    "@aws-sdk/credential-providers",
    "@smithy/signature-v4",
    "uuid"
  ]
})