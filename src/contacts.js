import { readFile, writeFile } from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { v4 as uuidv4 } from 'uuid';

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
            return []; // Файл не існує
        }
        throw error; // Інші помилки
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
 */
async function removeContact(contactId) {
    const contacts = await listContacts(); // Отримуємо список контактів
    const newContacts = contacts.filter(contact => contact.id !== contactId); // Фільтруємо контакти, виключаючи той, що має заданий ID
    await writeFile(contactsPath, JSON.stringify(newContacts, null, 2)); // Записуємо оновлений список у файл
    return newContacts; // Повертаємо оновлений список
}

/**
 * Додавання нового контакту
 * @param {string} name - Ім'я контакту
 * @param {string} email - Email контакту
 * @param {string} phone - Телефон контакту
 * @returns {Promise<Object>} Об'єкт нового контакту
 */
async function addContact(name, email, phone) {
    const contacts = await listContacts(); // Отримуємо список контактів
    const newContact = { id: uuidv4(), name, email, phone }; // Використовуємо UUID замість Date.now()
    contacts.push(newContact); // Додаємо новий контакт до списку
    await writeFile(contactsPath, JSON.stringify(contacts, null, 2)); // Записуємо оновлений список у файл
    return newContact; // Повертаємо новий контакт
}

// Експортуємо функції для використання в інших частинах програми
export { listContacts, getContactById, removeContact, addContact };