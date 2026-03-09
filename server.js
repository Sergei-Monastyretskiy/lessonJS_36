const http = require('http');
const url = require('url');
const querystring = require('querystring');
const { handleGetRequest } = require('./routes/getRoutes');
const { handlePostRequest } = require('./routes/postRoutes');
const { generateErrorPage } = require('./utils/htmlGenerator');

const PORT = process.env.PORT || 3000;
const MAX_BODY_SIZE = 1024 * 1024; // 1 MB

const server = http.createServer((req, res) => {
    try {
        const parsedUrl = url.parse(req.url, true);
        const pathname = parsedUrl.pathname;
        const method = req.method;

        console.log(`[${new Date().toISOString()}] ${method} ${pathname}`);

        // Обробка GET запитів
        if (method === 'GET') {
            handleGetRequest(req, res, pathname);
        }
        // Обробка POST запитів
        else if (method === 'POST') {
            let body = '';
            let bodySize = 0;

            req.on('data', (chunk) => {
                bodySize += chunk.length;

                // Перевірка розміру тіла запиту
                if (bodySize > MAX_BODY_SIZE) {
                    res.writeHead(413, {
                        'Content-Type': 'text/html; charset=utf-8',
                        'X-Content-Type-Options': 'nosniff'
                    });
                    const errorHtml = generateErrorPage(413, 'Payload Too Large', 'The request payload is too large. Maximum size is 1 MB.');
                    res.end(errorHtml);
                    req.connection.destroy();
                    return;
                }

                body += chunk.toString();
            });

            req.on('end', () => {
                handlePostRequest(req, res, pathname, body);
            });

            req.on('error', (err) => {
                console.error('Request error:', err);
                res.writeHead(500, {
                    'Content-Type': 'text/html; charset=utf-8',
                    'X-Content-Type-Options': 'nosniff'
                });
                const errorHtml = generateErrorPage(500, 'Server Error', 'An unexpected error occurred.');
                res.end(errorHtml);
            });
        }
        // Непідтримувані методи
        else {
            res.writeHead(405, {
                'Content-Type': 'text/html; charset=utf-8',
                'X-Content-Type-Options': 'nosniff',
                'Allow': 'GET, POST'
            });
            const errorHtml = generateErrorPage(405, 'Method Not Allowed', `The ${method} method is not allowed for this route.`);
            res.end(errorHtml);
        }
    } catch (err) {
        console.error('Server error:', err);
        res.writeHead(500, {
            'Content-Type': 'text/html; charset=utf-8',
            'X-Content-Type-Options': 'nosniff'
        });
        const errorHtml = generateErrorPage(500, 'Server Error', 'An unexpected error occurred.');
        res.end(errorHtml);
    }
});

server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log('Available routes:');
    console.log('  GET  /');
    console.log('  GET  /about');
    console.log('  GET  /contact');
    console.log('  POST /submit');
});

// Обробка помилок сервера
server.on('error', (err) => {
    console.error('Server failed to start:', err);
    process.exit(1);
});

module.exports = server;
