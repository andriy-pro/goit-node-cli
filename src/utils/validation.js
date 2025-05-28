/**
 * Модуль для валідації даних контактів
 * 
 * Цей модуль містить функції для перевірки коректності даних контакту
 * перед їх збереженням у файл. Перевіряє всі обов'язкові поля та їх формати.
 */

/**
 * Валідує дані контакту перед збереженням
 * 
 * Ця функція перевіряє коректність всіх обов'язкових полів контакту.
 * Повертає null якщо валідація успішна, або масив помилок.
 * 
 * @param {Object} contact - Об'єкт контакту для валідації
 * @param {string} contact.name - Ім'я контакту
 * @param {string} contact.email - Email контакту
 * @param {string} contact.phone - Телефон контакту
 * @returns {Array<string>|null} Масив помилок або null якщо все ОК
 * 
 * @example
 * const errors = validateContact({ name: "Іван", email: "ivan@test.com", phone: "123-45-67" });
 * if (errors) {
 *   console.log("Помилки:", errors.join(", "));
 * }
 */
export const validateContact = (contact) => {
    const errors = [];

    // Перевіряємо наявність та непустоту імені
    if (!contact.name?.trim()) {
        errors.push("Ім'я обов'язкове");
    }

    // Базова перевірка email (має містити @ та крапку)
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.email)) {
        errors.push("Невірний формат email");
    }

    // Перевірка формату телефону XXX-XX-XX
    if (!/^\d{3}-\d{2}-\d{2}$/.test(contact.phone)) {
        errors.push("Телефон у форматі XXX-XX-XX");
    }

    // Повертаємо null якщо помилок немає, інакше масив помилок
    return errors.length ? errors : null;
};

/**
 * Перевіряє, чи всі обов'язкові поля присутні
 * @param {string} name - Ім'я контакту
 * @param {string} email - Email контакту  
 * @param {string} phone - Телефон контакту
 * @returns {Array<string>} Масив відсутніх полів
 */
export const checkRequiredFields = (name, email, phone) => {
    const missing = [];
    
    if (!name) missing.push('name');
    if (!email) missing.push('email');
    if (!phone) missing.push('phone');
    
    return missing;
};