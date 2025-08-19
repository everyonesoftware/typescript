const { build } = require("esbuild");
const madge = require('madge');
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

madge(["sources", "tests"], {
  fileExtensions: ["ts"],
})
	.then((res) =>
  {
    console.log(res.circular());
  })