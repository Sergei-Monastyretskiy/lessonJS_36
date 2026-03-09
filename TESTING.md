# Приклади тестування HTTP сервера

## PowerShell команди

### 1. Тест GET запитів

```powershell
# Головна сторінка
Invoke-WebRequest -Uri "http://localhost:3000/" -UseBasicParsing

# About сторінка
Invoke-WebRequest -Uri "http://localhost:3000/about" -UseBasicParsing

# Contact сторінка
Invoke-WebRequest -Uri "http://localhost:3000/contact" -UseBasicParsing

# 404 помилка
try { 
    Invoke-WebRequest -Uri "http://localhost:3000/nonexistent" -UseBasicParsing 
} catch { 
    Write-Host "Status Code: $($_.Exception.Response.StatusCode.value__)"
}
```

### 2. Тест POST запитів

```powershell
# Успішна відправка форми
$body = @{
    name = 'Ivan Petrenko'
    email = 'ivan@example.com'
}
Invoke-WebRequest -Uri "http://localhost:3000/submit" -Method POST -Body $body -UseBasicParsing

# Помилка валідації - порожні поля (очікується 400)
$body = @{
    name = ''
    email = ''
}
try {
    Invoke-WebRequest -Uri "http://localhost:3000/submit" -Method POST -Body $body -UseBasicParsing
} catch {
    Write-Host "Status Code: $($_.Exception.Response.StatusCode.value__)"
}

# Помилка валідації - невалідний email (очікується 400)
$body = @{
    name = 'Test User'
    email = 'invalid-email'
}
try {
    Invoke-WebRequest -Uri "http://localhost:3000/submit" -Method POST -Body $body -UseBasicParsing
} catch {
    Write-Host "Status Code: $($_.Exception.Response.StatusCode.value__)"
}

# Помилка валідації - занадто коротке ім'я (очікується 400)
$body = @{
    name = 'A'
    email = 'test@example.com'
}
try {
    Invoke-WebRequest -Uri "http://localhost:3000/submit" -Method POST -Body $body -UseBasicParsing
} catch {
    Write-Host "Status Code: $($_.Exception.Response.StatusCode.value__)"
}
```

### 3. Тест XSS захисту

```powershell
# Спроба XSS атаки - символи будуть санітизовані
$body = @{
    name = '<script>alert("XSS")</script>'
    email = 'test@example.com'
}
$response = Invoke-WebRequest -Uri "http://localhost:3000/submit" -Method POST -Body $body -UseBasicParsing
# Перевіряємо, що у відповіді немає <script> тегу, а є &lt;script&gt;
$response.Content
```

### 4. Детальна перевірка заголовків

```powershell
$response = Invoke-WebRequest -Uri "http://localhost:3000/" -UseBasicParsing
Write-Host "Status Code: $($response.StatusCode)"
Write-Host "Content-Type: $($response.Headers['Content-Type'])"
Write-Host "Content-Length: $($response.Headers['Content-Length'])"
Write-Host "X-Content-Type-Options: $($response.Headers['X-Content-Type-Options'])"
```

## CMD / Curl команди (якщо встановлено curl)

### 1. GET запити

```bash
# Головна сторінка
curl http://localhost:3000/

# About сторінка
curl http://localhost:3000/about

# 404 помилка
curl http://localhost:3000/nonexistent
```

### 2. POST запити

```bash
# Успішна відправка
curl -X POST http://localhost:3000/submit ^
  -H "Content-Type: application/x-www-form-urlencoded" ^
  -d "name=Ivan Petrenko&email=ivan@example.com"

# Помилка валідації
curl -X POST http://localhost:3000/submit ^
  -H "Content-Type: application/x-www-form-urlencoded" ^
  -d "name=&email="

# Детальна інформація з заголовками
curl -v http://localhost:3000/
```

## Тестування через Node.js скрипт

Створіть файл `test-client.js`:

```javascript
const http = require('http');
const querystring = require('querystring');

// Функція для GET запиту
function testGet(path) {
  return new Promise((resolve, reject) => {
    http.get(`http://localhost:3000${path}`, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        console.log(`\nGET ${path}`);
        console.log(`Status: ${res.statusCode}`);
        console.log(`Content-Type: ${res.headers['content-type']}`);
        resolve(data);
      });
    }).on('error', reject);
  });
}

// Функція для POST запиту
function testPost(path, postData) {
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
        console.log(`\nPOST ${path}`);
        console.log(`Status: ${res.statusCode}`);
        console.log(`Content-Type: ${res.headers['content-type']}`);
        resolve(responseData);
      });
    });

    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

// Виконання тестів
async function runTests() {
  console.log('=== Тестування HTTP сервера ===\n');

  try {
    // GET запити
    await testGet('/');
    await testGet('/about');
    await testGet('/contact');
    await testGet('/nonexistent'); // 404

    // POST запити
    await testPost('/submit', { 
      name: 'Ivan Petrenko', 
      email: 'ivan@example.com' 
    });

    await testPost('/submit', { 
      name: '', 
      email: '' 
    }); // 400

    await testPost('/submit', { 
      name: 'Test', 
      email: 'invalid-email' 
    }); // 400

    console.log('\n=== Всі тести завершено ===');
  } catch (error) {
    console.error('Помилка тестування:', error.message);
  }
}

runTests();
```

Запуск:
```bash
node test-client.js
```

## Очікувані результати

| Запит | Метод | Очікуваний статус | Опис |
|-------|-------|-------------------|------|
| `/` | GET | 200 | Home сторінка |
| `/about` | GET | 200 | About сторінка |
| `/contact` | GET | 200 | Contact сторінка |
| `/nonexistent` | GET | 404 | Сторінка не знайдена |
| `/submit` з валідними даними | POST | 200 | Успішна відправка |
| `/submit` з порожніми полями | POST | 400 | Помилка валідації |
| `/submit` з невалідним email | POST | 400 | Помилка валідації |
| `/submit` PUT метод | PUT | 405 | Метод не підтримується |

## Перевірка розміру запиту (413 Payload Too Large)

Для тестування обмеження 1 МБ потрібно відправити великий обсяг даних:

```powershell
# Створюємо велике повідомлення (>1 MB)
$largeData = "x" * 1500000  # 1.5 MB
$body = @{
    name = 'Test'
    email = 'test@example.com'
    message = $largeData
}
try {
    Invoke-WebRequest -Uri "http://localhost:3000/submit" -Method POST -Body $body -UseBasicParsing
} catch {
    Write-Host "Status Code: $($_.Exception.Response.StatusCode.value__)"
    # Очікується 413
}
```
