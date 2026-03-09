# 🚀 Quick Start Guide

## Швидкий старт за 3 кроки

### 1️⃣ Запуск сервера

```powershell
node server.js
```

Ви побачите:
```
Server is running on http://localhost:3000
Available routes:
  GET  /
  GET  /about
  GET  /contact
  POST /submit
```

### 2️⃣ Відкрийте браузер

Перейдіть за адресою:
- **http://localhost:3000** - Головна сторінка
- **http://localhost:3000/about** - Про нас
- **http://localhost:3000/contact** - Контакти

### 3️⃣ Тестування форми

Відкрийте файл **test-form.html** у браузері та відправте форму.

---

## 🧪 Автоматичне тестування

Запустіть тестовий клієнт:

```powershell
node test-client.js
```

Він автоматично перевірить всі маршрути та покаже результати.

---

## 📝 Приклади запитів

### PowerShell

```powershell
# GET запит
Invoke-WebRequest -Uri "http://localhost:3000/" -UseBasicParsing

# POST запит
$body = @{
    name = 'Іван'
    email = 'ivan@example.com'
}
Invoke-WebRequest -Uri "http://localhost:3000/submit" -Method POST -Body $body
```

### Curl (Windows)

```bash
# GET запит
curl http://localhost:3000/

# POST запит
curl -X POST http://localhost:3000/submit ^
  -H "Content-Type: application/x-www-form-urlencoded" ^
  -d "name=Ivan&email=ivan@example.com"
```

---

## ⚙️ Зміна порту

```powershell
# PowerShell
$env:PORT=8080; node server.js

# CMD
set PORT=8080 && node server.js
```

---

## 🛑 Зупинка сервера

Натисніть **Ctrl + C** у терміналі, де запущено сервер.

---

## 📚 Детальна документація

Дивіться [README.md](README.md) для повної документації.

---

## ✅ Перевірка що все працює

Всі тести повинні пройти успішно:

```powershell
node test-client.js
```

Очікуваний результат:
```
✓ All tests passed!
Success Rate: 100.0%
```

---

**Готово!** Ваш HTTP сервер працює! 🎉
