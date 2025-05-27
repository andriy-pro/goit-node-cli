import { listContacts } from './src/contacts.js';

// Тест функції listContacts
async function testListContacts() {
    try {
        console.log('🧪 Тестуємо listContacts()...');
        const contacts = await listContacts();
        console.log('✅ Результат:', contacts);
        console.log(`📊 Кількість контактів: ${contacts.length}`);
    } catch (error) {
        console.error('❌ Помилка:', error.message);
    }
}

testListContacts();