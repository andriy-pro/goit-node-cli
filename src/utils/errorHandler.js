/**
 * Модуль централізованої обробки помилок для CLI застосунку
 * 
 * Надає функції для обробки критичних помилок, попереджень та обгортки асинхронних функцій.
 * 
 * @module utils/errorHandler
 */

import { log } from './output.js';

/**
 * Обробляє помилки та виводить зрозумілі повідомлення користувачу
 * @param {Error} error - Об'єкт помилки для обробки
 * @param {string} context - Контекст, в якому виникла помилка (опціонально)
 */
export const handleError = (error, context = '') => {
    const prefix = context ? `${context}: ` : '';
    
    // Обробляємо різні типи помилок з відповідними повідомленнями
    if (error.code === 'ENOENT') {
        log.error(`${prefix}Файл не знайдено`);
    } else if (error.code === 'EACCES') {
        log.error(`${prefix}Недостатньо прав доступу до файлу`);
    } else if (error.code === 'ENOSPC') {
        log.error(`${prefix}Недостатньо місця на диску`);
    } else if (error instanceof SyntaxError) {
        log.error(`${prefix}Файл contacts.json пошкоджено або містить некоректний JSON`);
    } else if (error.message.includes('валідації')) {
        log.error(`${prefix}${error.message}`);
    } else if (error.message.includes("Відсутні обов'язкові поля")) {
        log.error(`${prefix}${error.message}`);
    } else {
        log.error(`${prefix}${error.message}`);
    }
    
    // Завершуємо програму з кодом помилки
    process.exit(1);
};

/**
 * Обробляє помилки без завершення програми (для відновлюваних помилок)
 * @param {Error} error - Об'єкт помилки
 * @param {string} context - Контекст помилки
 * @returns {boolean} Повертає false для індикації помилки
 */
export const handleWarning = (error, context = '') => {
    const prefix = context ? `${context}: ` : '';
    
    if (error.code === 'ENOENT') {
        log.warning(`${prefix}Файл не існує, буде створено новий`);
    } else {
        log.warning(`${prefix}${error.message}`);
    }
    
    return false;
};

/**
 * Обгортка для асинхронних функцій з автоматичною обробкою помилок
 * @param {Function} asyncFn - Асинхронна функція для виконання
 * @param {string} context - Контекст виконання
 * @returns {Function} Обгорнута функція
 */
export const withErrorHandler = (asyncFn, context) => {
    return async (...args) => {
        try {
            return await asyncFn(...args);
        } catch (error) {
            handleError(error, context);
        }
    };
};