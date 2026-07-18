import { cp, mkdir, readFile, readdir, rm, unlink, writeFile } from "node:fs/promises";

const clientDir = new URL("../dist/client/", import.meta.url);
const outputDir = new URL("../pages-dist/", import.meta.url);
const pagesBase = "/socialtest/";

await rm(outputDir, { recursive: true, force: true });
await mkdir(outputDir, { recursive: true });
await cp(clientDir, outputDir, { recursive: true });

const workerUrl = new URL("../dist/server/index.js", import.meta.url);
workerUrl.searchParams.set("pages", Date.now().toString());
const { default: worker } = await import(workerUrl.href);
const response = await worker.fetch(
  new Request("https://mrmahmd.github.io/", {
    headers: { accept: "text/html" },
  }),
  {
    ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) },
  },
  { waitUntil() {}, passThroughOnException() {} },
);

if (!response.ok) {
  throw new Error(`Failed to render the GitHub Pages entry: ${response.status}`);
}

const publicFiles = [
  "favicon.svg",
  "hero-egyptian-girls.png",
  "og.png",
  "station-directions.png",
  "station-maps.png",
];

function rewriteForPages(source) {
  let result = source.replaceAll("/assets/", `${pagesBase}assets/`);
  for (const file of publicFiles) {
    result = result.replaceAll(`/${file}`, `${pagesBase}${file}`);
  }
  return result
    .replaceAll("http://localhost:3000/socialtest/og.png", "https://mrmahmd.github.io/socialtest/og.png")
    .replaceAll("https://mrmahmd.github.io/socialtest/socialtest/og.png", "https://mrmahmd.github.io/socialtest/og.png");
}

const html = rewriteForPages(await response.text());

for (const entry of await readdir(new URL("assets/", outputDir), { withFileTypes: true })) {
  if (!entry.isFile() || !/\.(css|js)$/.test(entry.name)) continue;
  const assetUrl = new URL(`assets/${entry.name}`, outputDir);
  await writeFile(assetUrl, rewriteForPages(await readFile(assetUrl, "utf8")), "utf8");
}

await writeFile(new URL("index.html", outputDir), html, "utf8");
await writeFile(new URL("404.html", outputDir), html, "utf8");
await writeFile(new URL(".nojekyll", outputDir), "", "utf8");
await unlink(new URL("_headers", outputDir)).catch(() => {});

console.log(new URL("index.html", outputDir).pathname);
