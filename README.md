# Node.js HTTP Server

Базовий HTTP сервер, розроблений на чистому Node.js без використання сторонніх бібліотек (таких як Express). Сервер обробляє GET і POST запити, валідує дані та забезпечує базовий рівень безпеки.

## 📋 Зміст

- [Можливості](#можливості)
- [Вимоги](#вимоги)
- [Встановлення](#встановлення)
- [Запуск](#запуск)
- [API Маршрути](#api-маршрути)
- [Приклади використання](#приклади-використання)
- [Обмеження](#обмеження)
- [Структура проекту](#структура-проекту)

## ✨ Можливості

- ✅ Обробка GET запитів для статичних сторінок
- ✅ Обробка POST запитів з валідацією даних
- ✅ Захист від XSS атак (санітизація вхідних даних)
- ✅ Обмеження розміру POST запитів (1 МБ)
- ✅ Коректна обробка помилок (404, 400, 413, 500)
- ✅ Правильні HTTP заголовки
- ✅ Модульна структура коду
- ✅ Логування запитів

## 🔧 Вимоги

- **Node.js** версії 14.0.0 або вище
- Немає додаткових залежностей (використовуються тільки вбудовані модулі Node.js)

## 📥 Встановлення

1. Клонуйте репозиторій або завантажте файли проекту:
```bash
git clone <your-repository-url>
cd lessonJS_35
```

2. Проект не потребує встановлення npm пакетів, оскільки використовує тільки вбудовані модулі Node.js.

## 🚀 Запуск

### Стандартний запуск (порт 3000):
```bash
node server.js
```

### Запуск з кастомним портом:
```bash
# Windows (PowerShell)
$env:PORT=8080; node server.js

# Windows (CMD)
set PORT=8080 && node server.js

# Linux/Mac
PORT=8080 node server.js
```

### Використання npm скриптів:
```bash
npm start
```

Після запуску сервер буде доступний за адресою: `http://localhost:3000`

## 🛣️ API Маршрути

### GET Запити

#### 1. Home Page - `/`
**Опис:** Головна сторінка

**Запит:**
```bash
curl http://localhost:3000/
```

**Відповідь:** HTML сторінка з заголовком "Home" та текстом "Welcome to the Home Page"

---

#### 2. About Page - `/about`
**Опис:** Сторінка "Про нас"

**Запит:**
```bash
curl http://localhost:3000/about
```

**Відповідь:** HTML сторінка з заголовком "About" та текстом "Learn more about us"

---

#### 3. Contact Page - `/contact`
**Опис:** Сторінка контактів

**Запит:**
```bash
curl http://localhost:3000/contact
```

**Відповідь:** HTML сторінка з заголовком "Contact" та текстом "Get in touch"

---

#### 4. 404 Not Found
**Опис:** Будь-який неіснуючий маршрут

**Запит:**
```bash
curl http://localhost:3000/nonexistent
```

**Відповідь:** HTTP статус 404 з HTML сторінкою помилки

---

### POST Запити

#### Submit Form - `/submit`
**Опис:** Обробка даних форми

**Content-Type:** `application/x-www-form-urlencoded`

**Параметри:**
- `name` (required) - ім'я користувача (2-100 символів)
- `email` (required) - email адреса (валідний формат)

**Успішний запит:**
```bash
curl -X POST http://localhost:3000/submit \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "name=John Doe&email=john@example.com"
```

**Відповідь:** HTTP статус 200 з HTML сторінкою підтвердження

**Помилки валідації:**
```bash
# Порожні поля
curl -X POST http://localhost:3000/submit \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "name=&email="
```
**Відповідь:** HTTP статус 400 "Invalid form data. Name and email cannot be empty."

```bash
# Невалідний email
curl -X POST http://localhost:3000/submit \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "name=John&email=invalid-email"
```
**Відповідь:** HTTP статус 400 "Please provide a valid email address."

## 🧪 Приклади використання

### Тестування через браузер

1. Запустіть сервер: `node server.js`
2. Відкрийте в браузері: `http://localhost:3000`
3. Для тестування форми відкрийте файл `test-form.html` у браузері та заповніть форму

### Тестування через Postman

1. **GET запит:**
   - Метод: GET
   - URL: `http://localhost:3000/`
   
2. **POST запит:**
   - Метод: POST
   - URL: `http://localhost:3000/submit`
   - Headers: `Content-Type: application/x-www-form-urlencoded`
   - Body (x-www-form-urlencoded):
     - name: "John Doe"
     - email: "john@example.com"

### Тестування через PowerShell

```powershell
# GET запит
Invoke-WebRequest -Uri "http://localhost:3000/" -Method GET

# POST запит
$body = @{
    name = "John Doe"
    email = "john@example.com"
}
Invoke-WebRequest -Uri "http://localhost:3000/submit" -Method POST -Body $body
```

### Тестування через Curl

```bash
# GET запит до головної сторінки
curl http://localhost:3000/

# GET запит до about
curl http://localhost:3000/about

# POST запит з валідними даними
curl -X POST http://localhost:3000/submit \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "name=Ivan Petrenko&email=ivan@example.com"

# Тест 404 помилки
curl http://localhost:3000/unknown-page

# Тест з невалідними даними
curl -X POST http://localhost:3000/submit \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "name=&email=invalid"
```

## ⚠️ Обмеження

1. **Максимальний розмір POST запиту:** 1 МБ (1024 * 1024 байт)
   - При перевищенні повертається статус 413 Payload Too Large

2. **Валідація форми:**
   - Поле `name`: обов'язкове, від 2 до 100 символів
   - Поле `email`: обов'язкове, валідний email формат, до 254 символів

3. **Підтримувані HTTP методи:**
   - GET - для отримання сторінок
   - POST - для відправки даних
   - Інші методи повертають 405 Method Not Allowed

4. **Content-Type для POST:**
   - Підтримується тільки `application/x-www-form-urlencoded`

5. **Безпека:**
   - Всі вхідні дані санітизуються для захисту від XSS
   - Встановлюється заголовок `X-Content-Type-Options: nosniff`

## 📁 Структура проекту

```
lessonJS_35/
│
├── server.js                 # Головний файл сервера
│
├── routes/
│   ├── getRoutes.js         # Обробка GET запитів
│   └── postRoutes.js        # Обробка POST запитів
│
├── utils/
│   ├── htmlGenerator.js     # Генерація HTML сторінок
│   └── validation.js        # Валідація та санітизація даних
│
├── test-form.html           # Тестова HTML форма
├── package.json             # Конфігурація проекту
└── README.md                # Документація

```

## 🔒 Безпека

Сервер реалізує наступні заходи безпеки:

1. **XSS захист:**
   - Санітизація всіх вхідних даних
   - Заміна спеціальних символів на HTML entities

2. **Обмеження розміру запитів:**
   - Максимум 1 МБ для POST запитів
   - Автоматичне закриття з'єднання при перевищенні ліміту

3. **Правильні HTTP заголовки:**
   - `Content-Type: text/html; charset=utf-8`
   - `Content-Length`: точний розмір відповіді
   - `X-Content-Type-Options: nosniff`

4. **Валідація даних:**
   - Перевірка наявності обов'язкових полів
   - Перевірка формату email
   - Перевірка довжини полів

## 📝 HTTP Статус коди

- **200 OK** - Успішний запит
- **400 Bad Request** - Некоректні дані форми
- **404 Not Found** - Маршрут не знайдено
- **405 Method Not Allowed** - Метод не підтримується
- **413 Payload Too Large** - Розмір запиту перевищує 1 МБ
- **500 Internal Server Error** - Внутрішня помилка сервера

## 📚 Використані модулі Node.js

- `http` - створення HTTP сервера
- `url` - парсинг URL
- `querystring` - парсинг даних форми

## 👨‍💻 Автор

Цей проект створено як навчальне завдання для демонстрації роботи з вбудованими модулями Node.js.

## 📄 Ліцензія

MIT

---

**Примітка:** Це навчальний проект. Для production використання рекомендується використовувати фреймворки такі як Express.js та додаткові модулі безпеки.
