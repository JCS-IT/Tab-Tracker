import * as esbuild from "esbuild";
import * as glob from "glob";

// find all *.ts files in src/** and add them as entry points
const entries = glob.sync("src/**/*.ts");

esbuild
  .build({
    entryPoints: entries.map((entry) => entry),
    outdir: "lib",
    bundle: true,
    platform: "node",
    target: "node18",
    sourcemap: "external",
    external: ["firebase-admin", "firebase-functions"],
    logLevel: "debug",
    legalComments: "none",
    minify: true,
    format: "cjs",
    treeShaking: true,
  })
  .catch(() => {
    console.error("Build failed");
    process.exit(1);
  });
