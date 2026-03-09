const http = require('http');
const querystring = require('querystring');

// Кольори для консолі (Windows сумісні)
const colors = {
    reset: '\x1b[0m',
    green: '\x1b[32m',
    red: '\x1b[31m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    cyan: '\x1b[36m'
};

// Функція для GET запиту
function testGet(path, expectedStatus = 200) {
    return new Promise((resolve, reject) => {
        http.get(`http://localhost:3000${path}`, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                const success = res.statusCode === expectedStatus;
                const color = success ? colors.green : colors.red;
                const status = success ? '✓' : '✗';

                console.log(`${color}${status} GET ${path}${colors.reset}`);
                console.log(`  Status: ${res.statusCode} (expected ${expectedStatus})`);
                console.log(`  Content-Type: ${res.headers['content-type']}`);
                console.log(`  Content-Length: ${res.headers['content-length']}`);
                console.log(`  X-Content-Type-Options: ${res.headers['x-content-type-options']}`);

                resolve({ success, statusCode: res.statusCode, data });
            });
        }).on('error', (err) => {
            console.log(`${colors.red}✗ GET ${path} - Error: ${err.message}${colors.reset}`);
            reject(err);
        });
    });
}

// Функція для POST запиту
function testPost(path, postData, expectedStatus = 200) {
    return new Promise((resolve, reject) => {
        const data = querystring.stringify(postData);
        const options = {
            hostname: 'localhost',
            port: 3000,
            path: path,
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Content-Length': Buffer.byteLength(data)
            }
        };

        const req = http.request(options, (res) => {
            let responseData = '';
            res.on('data', chunk => responseData += chunk);
            res.on('end', () => {
                const success = res.statusCode === expectedStatus;
                const color = success ? colors.green : colors.red;
                const status = success ? '✓' : '✗';

                console.log(`${color}${status} POST ${path}${colors.reset}`);
                console.log(`  Status: ${res.statusCode} (expected ${expectedStatus})`);
                console.log(`  Data: ${JSON.stringify(postData)}`);
                console.log(`  Content-Type: ${res.headers['content-type']}`);

                resolve({ success, statusCode: res.statusCode, data: responseData });
            });
        });

        req.on('error', (err) => {
            console.log(`${colors.red}✗ POST ${path} - Error: ${err.message}${colors.reset}`);
            reject(err);
        });

        req.write(data);
        req.end();
    });
}

// Виконання всіх тестів
async function runTests() {
    console.log(`\n${colors.cyan}${'='.repeat(50)}`);
    console.log('   HTTP Server Testing Suite');
    console.log(`${'='.repeat(50)}${colors.reset}\n`);

    const results = [];

    try {
        console.log(`${colors.blue}--- GET Requests ---${colors.reset}\n`);

        // GET запити
        results.push(await testGet('/', 200));
        results.push(await testGet('/about', 200));
        results.push(await testGet('/contact', 200));
        results.push(await testGet('/nonexistent', 404)); // Очікується 404

        console.log(`\n${colors.blue}--- POST Requests ---${colors.reset}\n`);

        // POST запити - успішні
        results.push(await testPost('/submit', {
            name: 'Ivan Petrenko',
            email: 'ivan@example.com'
        }, 200));

        results.push(await testPost('/submit', {
            name: 'Олена Коваленко',
            email: 'olena.kovalenko@example.com'
        }, 200));

        console.log(`\n${colors.blue}--- Validation Tests (should fail) ---${colors.reset}\n`);

        // POST запити - помилки валідації
        results.push(await testPost('/submit', {
            name: '',
            email: ''
        }, 400)); // Порожні поля

        results.push(await testPost('/submit', {
            name: 'Test',
            email: 'invalid-email'
        }, 400)); // Невалідний email

        results.push(await testPost('/submit', {
            name: 'A',
            email: 'test@example.com'
        }, 400)); // Занадто коротке ім'я

        results.push(await testPost('/submit', {
            name: 'Test User'
            // Відсутній email
        }, 400));

        console.log(`\n${colors.blue}--- XSS Protection Test ---${colors.reset}\n`);

        // Тест XSS захисту
        const xssResult = await testPost('/submit', {
            name: '<script>alert("XSS")</script>',
            email: 'test@example.com'
        }, 200);

        // Перевіряємо чи санітизовано
        if (xssResult.data.includes('&lt;script&gt;') && !xssResult.data.includes('<script>')) {
            console.log(`${colors.green}  ✓ XSS Protection working - script tags sanitized${colors.reset}`);
            results.push({ success: true });
        } else {
            console.log(`${colors.red}  ✗ XSS Protection failed - script tags not sanitized${colors.reset}`);
            results.push({ success: false });
        }

        // Підсумок
        console.log(`\n${colors.cyan}${'='.repeat(50)}`);
        console.log('   Test Results Summary');
        console.log(`${'='.repeat(50)}${colors.reset}\n`);

        const passed = results.filter(r => r.success).length;
        const total = results.length;
        const percentage = ((passed / total) * 100).toFixed(1);

        console.log(`  Total Tests: ${total}`);
        console.log(`  ${colors.green}Passed: ${passed}${colors.reset}`);
        console.log(`  ${colors.red}Failed: ${total - passed}${colors.reset}`);
        console.log(`  Success Rate: ${percentage}%\n`);

        if (passed === total) {
            console.log(`${colors.green}✓ All tests passed!${colors.reset}\n`);
        } else {
            console.log(`${colors.yellow}⚠ Some tests failed${colors.reset}\n`);
        }

    } catch (error) {
        console.error(`${colors.red}Fatal error during testing:${colors.reset}`, error.message);
        process.exit(1);
    }
}

// Перевірка чи сервер запущений
function checkServer() {
    return new Promise((resolve) => {
        http.get('http://localhost:3000/', (res) => {
            resolve(true);
        }).on('error', () => {
            resolve(false);
        });
    });
}

// Головна функція
(async () => {
    console.log('Checking if server is running...');
    const serverRunning = await checkServer();

    if (!serverRunning) {
        console.log(`${colors.red}Error: Server is not running on http://localhost:3000${colors.reset}`);
        console.log('Please start the server first: node server.js\n');
        process.exit(1);
    }

    console.log(`${colors.green}Server is running!${colors.reset}`);
    await runTests();
})();
