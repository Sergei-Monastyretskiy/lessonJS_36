/**
 * Генерує базову HTML сторінку
 * @param {string} title - Заголовок сторінки
 * @param {string} content - Контент сторінки
 * @returns {string} HTML сторінка
 */
function generatePage(title, content) {
    return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${title}</title>
<style>
  body {
    font-family: Arial, sans-serif;
    max-width: 800px;
    margin: 50px auto;
    padding: 20px;
    line-height: 1.6;
  }
  h1 {
    color: #333;
    border-bottom: 3px solid #007bff;
    padding-bottom: 10px;
  }
  p {
    color: #666;
    font-size: 18px;
  }
  nav {
    margin-bottom: 30px;
  }
  nav a {
    margin-right: 15px;
    color: #007bff;
    text-decoration: none;
  }
  nav a:hover {
    text-decoration: underline;
  }
</style>
</head>
<body>
<nav>
  <a href="/">Home</a>
  <a href="/about">About</a>
  <a href="/contact">Contact</a>
</nav>
<h1>${title}</h1>
<p>${content}</p>
</body>
</html>`;
}

/**
 * Генерує HTML сторінку з помилкою
 * @param {number} statusCode - HTTP статус код
 * @param {string} title - Заголовок помилки
 * @param {string} message - Повідомлення про помилку
 * @returns {string} HTML сторінка з помилкою
 */
function generateErrorPage(statusCode, title, message) {
    return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${statusCode} - ${title}</title>
<style>
  body {
    font-family: Arial, sans-serif;
    max-width: 800px;
    margin: 50px auto;
    padding: 20px;
    text-align: center;
  }
  h1 {
    color: #d9534f;
    font-size: 48px;
  }
  h2 {
    color: #333;
  }
  p {
    color: #666;
    font-size: 18px;
  }
  a {
    color: #007bff;
    text-decoration: none;
  }
  a:hover {
    text-decoration: underline;
  }
</style>
</head>
<body>
<h1>${statusCode}</h1>
<h2>${title}</h2>
<p>${message}</p>
<p><a href="/">Go back to Home</a></p>
</body>
</html>`;
}

/**
 * Генерує HTML сторінку підтвердження відправки форми
 * @param {string} name - Ім'я користувача
 * @param {string} email - Email користувача
 * @returns {string} HTML сторінка
 */
function generateSubmitPage(name, email) {
    return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Form Submitted</title>
<style>
  body {
    font-family: Arial, sans-serif;
    max-width: 800px;
    margin: 50px auto;
    padding: 20px;
    line-height: 1.6;
  }
  h1 {
    color: #5cb85c;
    border-bottom: 3px solid #5cb85c;
    padding-bottom: 10px;
  }
  .info {
    background-color: #f9f9f9;
    padding: 20px;
    border-radius: 5px;
    margin: 20px 0;
  }
  .info p {
    margin: 10px 0;
    color: #333;
    font-size: 18px;
  }
  .info strong {
    color: #007bff;
  }
  a {
    display: inline-block;
    margin-top: 20px;
    color: #007bff;
    text-decoration: none;
  }
  a:hover {
    text-decoration: underline;
  }
</style>
</head>
<body>
<h1>Form Submitted Successfully!</h1>
<div class="info">
  <p><strong>Name:</strong> ${name}</p>
  <p><strong>Email:</strong> ${email}</p>
</div>
<a href="/">Go back to Home</a>
</body>
</html>`;
}

module.exports = {
    generatePage,
    generateErrorPage,
    generateSubmitPage
};
