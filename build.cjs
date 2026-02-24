const { build } = require("esbuild");
const { dependencies } = require("./package.json");

const externalDependencies = Object.keys(dependencies || {});

/**
 * Build the project with the following properties.
 * @param {string} projectName The name of the project.
 * @param {string|string[]} entryPointFile The file that is the entrypoint for the project.
 */
function buildProject(projectName, entryPointFile)
{
  build({
    entryPoints: [entryPointFile],
    bundle: true,
    minify: false,
    external: externalDependencies,
    platform: "node", // for CommonJS
    outdir: `outputs/${projectName}/`,
    sourcemap: true,
  });
}

buildProject("everythingCLI", "sources/everythingCLI.ts");
buildProject("tests", "tests/tests.ts");
buildProject("everythingServer", "sources/everythingServer.ts");
