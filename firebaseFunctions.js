/* eslint-disable @typescript-eslint/no-var-requires */
const { https } = require("firebase-functions");
const { default: next } = require("next");

const nextjsDistDir = require("./next.config.js").distDir;

const nextjsServer = next({
  dev: false,
  conf: {
    distDir: nextjsDistDir,
  },
});
const nextjsHandle = nextjsServer.getRequestHandler();

exports.nextjsFunc = https.onRequest((req, res) => {
  return nextjsServer.prepare().then(() => nextjsHandle(req, res));
});
