import { listContacts, getContactById, removeContact, addContact } from './contacts.js';
// Імпортуємо Commander.js для парсингу аргументів командного рядка
import { Command } from 'commander';
// Імпортуємо функції валідації
import { checkRequiredFields } from './utils/validation.js';

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
            // Отримуємо список всіх контактів та виводимо у вигляді таблиці
            const contacts = await listContacts();
            console.table(contacts);
            break;

        case 'get':
            // Шукаємо контакт за ID та виводимо результат
            const contact = await getContactById(id);
            if (contact) {
                console.table([contact]); // Відображаємо знайдений контакт
            } else {
                console.log(`Контакт з ID ${id} не знайдено`);
            }
            break;

        case 'add':
            // Перевіряємо наявність всіх обов'язкових полів
            const missingFields = checkRequiredFields(name, email, phone);
            if (missingFields.length > 0) {
                console.error(`Відсутні обов'язкові поля: ${missingFields.join(', ')}`);
                return;
            }
            
            try {
                // Додаємо новий контакт з переданими даними (з валідацією)
                const newContact = await addContact(name, email, phone);
                console.log('Контакт додано:');
                console.table([newContact]); // Показуємо доданий контакт
            } catch (error) {
                console.error(`Помилка додавання контакту: ${error.message}`);
            }
            break;

        case 'remove':
            // Видаляємо контакт за ID та показуємо оновлений список
            const updatedContacts = await removeContact(id);
            console.log(`Контакт з ID ${id} видалено`);
            console.table(updatedContacts); // Показуємо список після видалення
            break;

        default:
            console.warn('Невідома дія'); // Повідомлення про некоректну команду
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

// Викликаємо головну функцію з переданими аргументами
invokeAction(argv);