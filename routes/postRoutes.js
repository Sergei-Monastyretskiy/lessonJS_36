const querystring = require('querystring');
const { generateSubmitPage, generateErrorPage } = require('../utils/htmlGenerator');
const { sanitizeInput, validateFormData } = require('../utils/validation');

/**
 * Обробляє POST запити
 * @param {Object} req - HTTP request object
 * @param {Object} res - HTTP response object
 * @param {string} pathname - Шлях URL
 * @param {string} body - Тіло запиту
 */
function handlePostRequest(req, res, pathname, body) {
    if (pathname === '/submit') {
        try {
            // Парсинг даних форми
            const parsedData = querystring.parse(body);
            const { name, email } = parsedData;

            // Валідація даних
            const validationError = validateFormData(name, email);
            if (validationError) {
                res.writeHead(400, {
                    'Content-Type': 'text/html; charset=utf-8',
                    'X-Content-Type-Options': 'nosniff'
                });
                const errorHtml = generateErrorPage(400, 'Bad Request', validationError);
                res.end(errorHtml);
                return;
            }

            // Санітизація даних (захист від XSS)
            const safeName = sanitizeInput(name);
            const safeEmail = sanitizeInput(email);

            // Генерація HTML відповіді
            const html = generateSubmitPage(safeName, safeEmail);
            const buffer = Buffer.from(html, 'utf-8');

            res.writeHead(200, {
                'Content-Type': 'text/html; charset=utf-8',
                'Content-Length': buffer.length,
                'X-Content-Type-Options': 'nosniff'
            });

            res.end(html);
        } catch (err) {
            console.error('Error processing POST request:', err);
            res.writeHead(500, {
                'Content-Type': 'text/html; charset=utf-8',
                'X-Content-Type-Options': 'nosniff'
            });
            const errorHtml = generateErrorPage(500, 'Server Error', 'An error occurred while processing your request.');
            res.end(errorHtml);
        }
    } else {
        // Маршрут не знайдено
        res.writeHead(404, {
            'Content-Type': 'text/html; charset=utf-8',
            'X-Content-Type-Options': 'nosniff'
        });
        const errorHtml = generateErrorPage(404, 'Page Not Found', `The requested page "${pathname}" was not found on this server.`);
        res.end(errorHtml);
    }
}

module.exports = { handlePostRequest };
