// @ts-check
const { test, expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

test('web and app service worker cache versions stay in sync', async () => {
    const webSw = fs.readFileSync(path.resolve(__dirname, '../sw.js'), 'utf8');
    const appSw = fs.readFileSync(path.resolve(__dirname, '../app/sw.js'), 'utf8');

    const webCache = webSw.match(/const\s+CACHE_NAME\s*=\s*'([^']+)'/);
    const appCache = appSw.match(/const\s+CACHE_NAME\s*=\s*'([^']+)'/);

    expect(webCache).not.toBeNull();
    expect(appCache).not.toBeNull();
    expect(webCache[1]).toBe(appCache[1]);
    expect(webCache[1]).toMatch(/^lucky3-v\d{4}\.\d{2}\.\d{2}\.\d+$/);

    expect(webSw).toContain("cache: 'no-store'");
    expect(appSw).toContain("cache: 'no-store'");
});

test('main.js keeps active update triggers for service worker refresh', async () => {
    const mainJs = fs.readFileSync(path.resolve(__dirname, '../app/src/main.js'), 'utf8');

    expect(mainJs).toContain("navigator.serviceWorker.addEventListener('controllerchange'");
    expect(mainJs).toContain('window.location.reload()');
    expect(mainJs).toContain("setInterval(() => {\n                    registration.update().catch(() => { });");
    expect(mainJs).toContain("document.addEventListener('visibilitychange'");
    expect(mainJs).toContain("window.addEventListener('focus'");
});
