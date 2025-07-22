import { readFile, writeFile } from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { v4 as uuidv4 } from 'uuid';
import { validateContact } from './validation.js';
import { handleWarning } from './errorHandler.js';
import chalk from 'chalk';

// Отримуємо шлях до поточного файлу та директорії в ES-модулях
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Шлях до файлу contacts.json (у кореневій папці проекту)
const contactsPath = path.join(__dirname, '../contacts.json');

/**
 * Отримує список всіх контактів з файлу contacts.json.
 * Якщо файл не існує, повертає порожній масив.
 * @returns {Promise<Array<Object>>} Масив контактів або порожній масив
 */
async function listContacts() {
    try {
        const data = await readFile(contactsPath, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        if (error.code === 'ENOENT') {
            return []; // Файл не існує - повертаємо порожній масив
        } else if (error instanceof SyntaxError) {
            throw new Error('Файл contacts.json містить некоректний JSON');
        } else if (error.code === 'EACCES') {
            throw new Error('Недостатньо прав для читання файлу contacts.json');
        }
        throw error; // Інші помилки передаємо далі
    }
}

/**
 * Пошук контакту за ID
 * @param {string} contactId - ID контакту для пошуку
 * @returns {Promise<Object|null>} Об'єкт контакту або null, якщо не знайдено
 */
async function getContactById(contactId) {
    const contacts = await listContacts(); // Отримуємо список контактів
    return contacts.find(contact => contact.id === contactId); // Пошук контакту за ID
}

/**
 * Видалення контакту за ID
 * @param {string} contactId - ID контакту для видалення
 * @returns {Promise<Array<Object>>} Масив контактів після видалення
 * @throws {Error} Викидає помилку, якщо контакт не знайдено або виникли проблеми із записом
 */
async function removeContact(contactId) {
    const contacts = await listContacts();
    const initialLength = contacts.length;
    const newContacts = contacts.filter(contact => contact.id !== contactId);
    
    // Перевіряємо, чи був контакт знайдений та видалений
    if (newContacts.length === initialLength) {
        throw new Error(`Контакт з ID ${chalk.bold(contactId)} не знайдено`);
    }
    
    try {
        await writeFile(contactsPath, JSON.stringify(newContacts, null, 2));
        return newContacts;
    } catch (error) {
        if (error.code === 'EACCES') {
            throw new Error('Недостатньо прав для запису у файл contacts.json');
        } else if (error.code === 'ENOSPC') {
            throw new Error('Недостатньо місця на диску для збереження файлу');
        }
        throw error;
    }
}

/**
 * Додавання нового контакту з валідацією даних
 * @param {string} name - Ім'я контакту
 * @param {string} email - Email контакту
 * @param {string} phone - Телефон контакту
 * @returns {Promise<Object>} Об'єкт нового контакту
 * @throws {Error} Викидає помилку, якщо дані не пройшли валідацію
 */
async function addContact(name, email, phone) {
    // Створюємо об'єкт контакту для валідації
    const contactData = { name, email, phone };
    
    // Перевіряємо валідність даних
    const validationErrors = validateContact(contactData);
    if (validationErrors) {
        throw new Error(`Помилки валідації: ${validationErrors.join(', ')}`);
    }
    
    const contacts = await listContacts();
    const newContact = { id: uuidv4(), name, email, phone };
    contacts.push(newContact);
    
    try {
        await writeFile(contactsPath, JSON.stringify(contacts, null, 2));
        return newContact;
    } catch (error) {
        if (error.code === 'EACCES') {
            throw new Error('Недостатньо прав для запису у файл contacts.json');
        } else if (error.code === 'ENOSPC') {
            throw new Error('Недостатньо місця на диску для збереження контакту');
        }
        throw error;
    }
}

// Експортуємо функції для використання в інших частинах програми
export { listContacts, getContactById, removeContact, addContact };