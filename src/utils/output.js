/**
 * Утиліти для кольорового виводу в консоль
 * 
 * Цей модуль надає зручні функції для виводу повідомлень різних типів
 * з відповідним кольоровим форматуванням та емодзі для покращення UX.
 */
import chalk from 'chalk';

/**
 * Об'єкт з методами для різних типів кольорових повідомлень
 * Кожен метод автоматично додає відповідний емодзі та колір
 */
export const log = {
    /**
     * Виводить повідомлення про успішну операцію (зелений колір)
     * @param {string} msg - Повідомлення для виводу
     */
    success: (msg) => console.log(chalk.green(`✓ ${msg}`)),

    /**
     * Виводить повідомлення про помилку (червоний колір)
     * @param {string} msg - Повідомлення про помилку
     */
    error: (msg) => console.log(chalk.red(`✗ ${msg}`)),

    /**
     * Виводить інформаційне повідомлення (синій колір)
     * @param {string} msg - Інформаційне повідомлення
     */
    info: (msg) => console.log(chalk.blue(`ℹ ${msg}`)),

    /**
     * Виводить попередження (жовтий колір)
     * @param {string} msg - Повідомлення-попередження
     */
    warning: (msg) => console.log(chalk.yellow(`⚠ ${msg}`)),

    /**
     * Виводить заголовок розділу (магента колір, жирний)
     * @param {string} msg - Текст заголовка
     */
    header: (msg) => console.log(chalk.magenta.bold(`📋 ${msg}`)),

    /**
     * Виводить дані у вигляді таблиці з кольоровим заголовком
     * @param {Array} data - Масив об'єктів для відображення
     * @param {string} title - Заголовок таблиці
     */
    table: (data, title) => {
        if (title) {
            console.log(chalk.cyan.bold(`\n📊 ${title}:`));
        }
        if (data.length === 0) {
            console.log(chalk.gray('   Немає даних для відображення'));
        } else {
            console.table(data);
        }
    }
};