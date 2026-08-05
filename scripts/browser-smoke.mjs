import { writeFile } from "node:fs/promises";

const pageUrl = process.argv[2] || "http://127.0.0.1:3100";
const outputPath = process.argv[3] || "browser-smoke.png";
const viewportWidth = Number(process.argv[4] || 1440);
const viewportHeight = Number(process.argv[5] || 1000);
const focusSelector = process.argv[6];
const debuggerUrl = process.env.CHROME_DEBUGGER_URL || "http://127.0.0.1:9223";

const targets = await fetch(`${debuggerUrl}/json/list`).then((response) => response.json());
const target = targets.find((item) => item.type === "page");
if (!target?.webSocketDebuggerUrl) throw new Error("No Chrome page target is available.");

const socket = new WebSocket(target.webSocketDebuggerUrl);
const pending = new Map();
const browserErrors = [];
let messageId = 0;

socket.addEventListener("message", (event) => {
  const message = JSON.parse(event.data);
  if (message.id && pending.has(message.id)) {
    const { resolve, reject } = pending.get(message.id);
    pending.delete(message.id);
    if (message.error) reject(new Error(message.error.message));
    else resolve(message.result);
    return;
  }

  if (message.method === "Runtime.exceptionThrown") {
    const details = message.params?.exceptionDetails;
    browserErrors.push(details?.exception?.description || details?.text || "Unknown browser exception");
  }

  if (message.method === "Log.entryAdded" && message.params?.entry?.level === "error") {
    browserErrors.push(message.params.entry.text);
  }
});

function send(method, params = {}) {
  const id = ++messageId;
  socket.send(JSON.stringify({ id, method, params }));
  return new Promise((resolve, reject) => pending.set(id, { resolve, reject }));
}

await new Promise((resolve, reject) => {
  socket.addEventListener("open", resolve, { once: true });
  socket.addEventListener("error", reject, { once: true });
});

await Promise.all([send("Page.enable"), send("Runtime.enable"), send("Log.enable")]);
await send("Emulation.setDeviceMetricsOverride", { width: viewportWidth, height: viewportHeight, deviceScaleFactor: 1, mobile: viewportWidth < 768 });
await send("Page.navigate", { url: pageUrl });
await new Promise((resolve) => setTimeout(resolve, 5000));
if (focusSelector) {
  await send("Runtime.evaluate", {
    expression: `document.querySelector(${JSON.stringify(focusSelector)})?.scrollIntoView({ block: 'center', behavior: 'instant' })`,
  });
  await new Promise((resolve) => setTimeout(resolve, 600));
}

const pageState = await send("Runtime.evaluate", {
  expression: `({
    title: document.title,
    bodyText: document.body?.innerText?.slice(0, 220),
    background: getComputedStyle(document.body).backgroundColor,
    color: getComputedStyle(document.body).color,
    viewport: { width: window.innerWidth, height: window.innerHeight },
    layout: {
      documentWidth: document.documentElement.scrollWidth,
      horizontalOverflow: document.documentElement.scrollWidth > window.innerWidth,
      fixedBottomNav: Boolean(document.querySelector('nav.fixed.bottom-0'))
    },
    visualChecks: {
      h1: (() => { const node = document.querySelector('h1'); if (!node) return null; const style = getComputedStyle(node); return { fontSize: style.fontSize, lineHeight: style.lineHeight, fontWeight: style.fontWeight }; })(),
      brandMark: (() => { const node = document.querySelector('.brand-gradient'); if (!node) return null; const style = getComputedStyle(node); return { width: style.width, height: style.height, background: style.backgroundImage, color: style.color }; })(),
      primaryButton: (() => { const node = document.querySelector('a.bg-orange-700'); if (!node) return null; const style = getComputedStyle(node); return { background: style.backgroundColor, color: style.color, height: style.height }; })()
    },
    headings: Array.from(document.querySelectorAll('h1,h2,h3')).slice(0, 8).map((node) => ({ text: node.textContent?.trim(), color: getComputedStyle(node).color })),
    cards: Array.from(document.querySelectorAll('.glass-panel')).slice(0, 5).map((node) => ({ background: getComputedStyle(node).backgroundColor, color: getComputedStyle(node).color }))
  })`,
  returnByValue: true,
});

const screenshot = await send("Page.captureScreenshot", { format: "png", captureBeyondViewport: false });
await writeFile(outputPath, Buffer.from(screenshot.data, "base64"));
socket.close();

console.log(JSON.stringify({ url: pageUrl, state: pageState.result.value, browserErrors }, null, 2));
if (browserErrors.length) process.exitCode = 1;
