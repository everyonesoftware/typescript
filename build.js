const { build } = require("esbuild");
const { dependencies } = require("./package.json");

build({
  entryPoints: [
    "sources/everythingCLI.ts",
  ],
  bundle: true,
  minify: false,
  external: Object.keys(dependencies || {}),
  platform: "node", // for CommonJS
  outdir: "outputs",
});
