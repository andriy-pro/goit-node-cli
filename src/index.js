import { listContacts, getContactById, removeContact, addContact } from './contacts.js';
// Імпортуємо Commander.js для парсингу аргументів командного рядка
import { Command } from 'commander';
// Імпортуємо функції валідації
import { checkRequiredFields } from './utils/validation.js';
// Імпортуємо утиліти для кольорового виводу
import { log } from './utils/output.js';
// Імпортуємо централізований обробник помилок
import { handleError, withErrorHandler } from './utils/errorHandler.js';
// Імпортуємо chalk для кольорового виводу
import chalk from 'chalk';

// Створюємо новий екземпляр програми Commander
const program = new Command();

/**
 * Головна функція для виконання дій залежно від переданої команди
 * 
 * Ця функція аналізує тип дії та викликає відповідну функцію для роботи з контактами.
 * Використовує console.table() для красивого відображення результатів.
 * 
 * @param {Object} options - Об'єкт з параметрами команди
 * @param {string} options.action - Назва дії (list, get, add, remove)
 * @param {string} options.id - ID контакту (потрібен для get та remove)
 * @param {string} options.name - Ім'я контакту (потрібне для add)
 * @param {string} options.email - Email контакту (потрібний для add)
 * @param {string} options.phone - Телефон контакту (потрібний для add)
 */
async function invokeAction({ action, id, name, email, phone }) {
    switch (action) {
        case 'list':
            try {
                // Отримуємо список всіх контактів та виводимо у вигляді таблиці
                const contacts = await listContacts();
                log.table(contacts, 'Список контактів');
            } catch (error) {
                handleError(error, 'Помилка отримання списку контактів');
            }
            break;

        case 'get':
            try {
                // Шукаємо контакт за ID та виводимо результат
                const contact = await getContactById(id);
                if (contact) {
                    log.table([contact], `Контакт з ID: ${id}`); // Відображаємо знайдений контакт
                } else {
                    log.warning(`Контакт з ID ${chalk.bold(${id})} не знайдено!`);              }
            } catch (error) {
                handleError(error, 'Помилка пошуку контакту');
            }
            break;

        case 'add':
            // Перевіряємо наявність всіх обов'язкових полів
            const missingFields = checkRequiredFields(name, email, phone);
            if (missingFields.length > 0) {
                log.error(`Відсутні обов'язкові поля: ${chalk.bold(missingFields.join(', '))}`);
                return;
            }
            
            try {
                // Додаємо новий контакт з переданими даними (з валідацією)
                const newContact = await addContact(name, email, phone);
                log.success('Контакт успішно додано!');
                log.table([newContact], 'Новий контакт'); // Показуємо доданий контакт
            } catch (error) {
                log.error(`Помилка додавання контакту: ${error.message}`);
            }
            break;

        case 'remove':
            try {
                // Видаляємо контакт за ID та показуємо оновлений список
                const updatedContacts = await removeContact(id);
                log.success(`Контакт з ID ${chalk.bold(${id})} успішно видалено!`);
                log.table(updatedContacts, 'Оновлений список контактів'); // Показуємо список після видалення
            } catch (error) {
                handleError(error, 'Помилка видалення контакту');
            }
            break;

        default:
            log.error(`Невідома дія. Доступні дії: ${chalk.bold('list, get, add, remove')}`); // Повідомлення про некоректну команду
            process.exit(1); // Завершуємо з кодом помилки
    }
}

// Налаштовуємо опції командного рядка за допомогою Commander.js
// Кожна опція має коротку (-a) та довгу (--action) форму
program
    .option('-a, --action <type>', 'choose action') // Тип дії: list, get, add, remove
    .option('-i, --id <type>', 'contact id')         // ID контакту для операцій get/remove
    .option('-n, --name <type>', 'contact name')     // Ім'я для додавання контакту
    .option('-e, --email <type>', 'contact email')   // Email для додавання контакту
    .option('-p, --phone <type>', 'contact phone');  // Телефон для додавання контакту

// Парсимо аргументи командного рядка
program.parse(process.argv);

// Отримуємо об'єкт з усіма переданими опціями
const argv = program.opts();

// Викликаємо головну функцію з централізованою обробкою помилок
invokeAction(argv).catch(error => {
    handleError(error, 'Критична помилка застосунку');
});