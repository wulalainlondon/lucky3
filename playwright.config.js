// @ts-check
const { defineConfig, devices } = require('@playwright/test');
const path = require('path');

module.exports = defineConfig({
    testDir: './tests',
    timeout: 30000,
    retries: 1,
    reporter: 'list',
    use: {
        baseURL: 'http://127.0.0.1:5000',
        headless: true,
        viewport: { width: 390, height: 844 }, // iPhone 14 Pro
        locale: 'zh-TW',
        launchOptions: {
            args: [
                '--disable-background-timer-throttling',
                '--disable-backgrounding-occluded-windows',
                '--disable-renderer-backgrounding',
            ],
        },
    },
    projects: [
        { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    ],
    webServer: {
        command: `python3 -m http.server 5000 --bind 127.0.0.1 --directory ${path.resolve(__dirname)}`,
        url: 'http://127.0.0.1:5000',
        reuseExistingServer: !process.env.CI,
        timeout: 10000,
    },
});
