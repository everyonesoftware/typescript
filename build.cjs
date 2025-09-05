const { build } = require("esbuild");
const { dependencies } = require("./package.json");

const external = Object.keys(dependencies || {});

build({
  entryPoints: [
    "sources/everythingCLI.ts",
  ],
  bundle: true,
  minify: false,
  external: external,
  platform: "node", // for CommonJS
  outdir: "outputs",
});

build({
  entryPoints: [
    "tests/tests.ts",
  ],
  bundle: true,
  minify: false,
  external: external,
  platform: "node",
  outdir: "outputs",
  sourcemap: true,
});
