const { generatePage, generateErrorPage } = require('../utils/htmlGenerator');
const fs = require('fs');
const path = require('path');

/**
 * Обробляє GET запити
 * @param {Object} req - HTTP request object
 * @param {Object} res - HTTP response object
 * @param {string} pathname - Шлях URL
 */
function handleGetRequest(req, res, pathname) {
    let html;
    let statusCode = 200;

    // Маршрутизація
    switch (pathname) {
        case '/':
            html = generatePage('Home', 'Welcome to the Home Page');
            break;

        case '/about':
            html = generatePage('About', 'Learn more about us');
            break;

        case '/contact':
            html = generatePage('Contact', 'Get in touch');
            break;

        case '/test-form.html':
            // Обробка статичного файлу test-form.html
            const filePath = path.join(__dirname, '..', 'test-form.html');
            try {
                if (fs.existsSync(filePath)) {
                    html = fs.readFileSync(filePath, 'utf-8');
                } else {
                    statusCode = 404;
                    html = generateErrorPage(404, 'File Not Found', 'The file test-form.html was not found.');
                }
            } catch (err) {
                console.error('Error reading test-form.html:', err);
                statusCode = 500;
                html = generateErrorPage(500, 'Server Error', 'Error reading the file.');
            }
            break;

        default:
            statusCode = 404;
            html = generateErrorPage(404, 'Page Not Found', `The requested page "${pathname}" was not found on this server.`);
            break;
    }

    // Встановлення заголовків
    const buffer = Buffer.from(html, 'utf-8');
    res.writeHead(statusCode, {
        'Content-Type': 'text/html; charset=utf-8',
        'Content-Length': buffer.length,
        'X-Content-Type-Options': 'nosniff'
    });

    res.end(html);
}

module.exports = { handleGetRequest };
