/**
 * Санітизує вхідні дані для захисту від XSS атак
 * @param {string} input - Вхідний текст
 * @returns {string} Санітизований текст
 */
function sanitizeInput(input) {
    if (typeof input !== 'string') {
        return '';
    }

    return input
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#x27;')
        .replace(/\//g, '&#x2F;');
}

/**
 * Валідує дані форми
 * @param {string} name - Ім'я
 * @param {string} email - Email
 * @returns {string|null} Повідомлення про помилку або null якщо все ок
 */
function validateFormData(name, email) {
    // Перевірка на наявність полів
    if (!name || !email) {
        return 'Invalid form data. Both name and email are required.';
    }

    // Перевірка на порожні значення після trim
    const trimmedName = name.trim();
    const trimmedEmail = email.trim();

    if (trimmedName === '' || trimmedEmail === '') {
        return 'Invalid form data. Name and email cannot be empty.';
    }

    // Перевірка довжини імені
    if (trimmedName.length < 2 || trimmedName.length > 100) {
        return 'Invalid form data. Name must be between 2 and 100 characters.';
    }

    // Базова перевірка email формату
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
        return 'Invalid form data. Please provide a valid email address.';
    }

    // Перевірка довжини email
    if (trimmedEmail.length > 254) {
        return 'Invalid form data. Email is too long.';
    }

    return null;
}

module.exports = {
    sanitizeInput,
    validateFormData
};
