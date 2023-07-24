import * as esbuild from "esbuild";
import * as glob from "glob";

// find all *.ts files in src/** and add them as entry points
const entries = glob.sync("src/**/*.ts");

// build all entry points in parallel
await Promise.all(
  entries.map((entry) =>
    esbuild.build({
      entryPoints: [entry],
      outfile: entry.replace(/^src/, "lib").replace(/\.ts$/, ".js"),
      bundle: true,
      platform: "node",
      target: "node18",
      sourcemap: true,
      external: ["firebase-admin", "firebase-functions"],
    })
  )
);
