import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request("http://localhost/", {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );
}

test("server-renders the Arabic interactive lesson", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<html[^>]*lang="ar"[^>]*dir="rtl"/i);
  assert.match(html, /الأماكن والاتجاهات من حولنا/);
  assert.match(html, /شهد زهران/);
  assert.doesNotMatch(html, /Your site is taking shape|codex-preview|react-loading-skeleton/i);
});

test("keeps the two-station demo complete and self-contained", async () => {
  const [page, layout, css, packageJson] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
    readFile(new URL("../package.json", import.meta.url), "utf8"),
  ]);

  assert.match(page, /المحطة الأولى/);
  assert.match(page, /المحطة الثانية/);
  assert.doesNotMatch(page, /المحطة الثالثة/);
  assert.match(page, /بطاقات الأسئلة المجابة/);
  assert.match(page, /صح أو خطأ، اختيار من متعدد، ثم توصيل/);
  assert.match(page, /\/station-maps\.png/);
  assert.match(page, /\/station-directions\.png/);
  assert.match(page, /score\.toLocaleString\("ar-EG"\)/);
  assert.match(layout, /@fontsource-variable\/cairo/);
  assert.match(layout, /@fontsource-variable\/noto-kufi-arabic/);
  assert.match(css, /hero-egyptian-girls\.png/);
  assert.doesNotMatch(packageJson, /react-loading-skeleton/);
});
